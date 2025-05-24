import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SeatLayout from '../components/SeatLayout';
import PaymentForm from '../components/PaymentForm';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const Booking = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busDetails, setBusDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1); // 1: Seat Selection, 2: Passenger Details, 3: Payment
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [temporaryBookingId, setTemporaryBookingId] = useState(null);

  // Fetch bus details
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/buses/${busId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch bus details');
        }

        setBusDetails(data);
        setPassengerDetails(Array(data.selectedSeats?.length || 0).fill({
          name: '',
          age: '',
          gender: ''
        }));
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigate('/login', { state: { from: `/booking/${busId}` } });
      return;
    }

    fetchBusDetails();
  }, [busId, navigate, user]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prev => {
      const isSelected = prev.includes(seatNumber);
      if (isSelected) {
        return prev.filter(seat => seat !== seatNumber);
      }
      return [...prev, seatNumber];
    });
  };

  const handlePassengerDetailChange = (index, field, value) => {
    setPassengerDetails(prev => {
      const newDetails = [...prev];
      newDetails[index] = {
        ...newDetails[index],
        [field]: value
      };
      return newDetails;
    });
  };

  const handlePaymentComplete = async (paymentResponse) => {
    try {
      // Check if payment was rejected
      if (paymentResponse.responseCode === '5310' || paymentResponse.responseCode === '2007') {
        // Delete the temporary booking
        await fetch(`${API_URL}/bookings/${temporaryBookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        toast.error(paymentResponse.responseCode === '5310' ? 
          'Payment was rejected by the customer' : 
          'Payment failed. Please try again.');
        
        // Reset booking state
        setTemporaryBookingId(null);
        setStep(2); // Go back to passenger details step
        return;
      }

      // Only proceed with booking creation if payment was successful
      if (paymentResponse.responseCode === '2001') {
        // Format seats with passenger details
        const formattedSeats = selectedSeats.map((seatNumber, index) => ({
          seatNumber: parseInt(seatNumber),
          passenger: {
            name: passengerDetails[index].name,
            age: parseInt(passengerDetails[index].age),
            gender: passengerDetails[index].gender
          }
        }));

        const bookingData = {
          busId,
          seats: formattedSeats,
          totalAmount: selectedSeats.length * (busDetails?.fare || 0),
          paymentStatus: 'completed',
          paymentId: paymentResponse.paymentId || paymentResponse.orderId,
          status: 'confirmed',
          journeyDate: busDetails.departureTime
        };

        // Create booking after successful payment
        const response = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Booking failed');
        }

        // Navigate to booking confirmation page
        toast.success('Booking confirmed successfully!');
        navigate(`/booking/confirmation/${data._id}`);
      } else {
        // Handle other payment response codes
        toast.error('Payment was not successful. Please try again.');
        setStep(2); // Go back to passenger details step
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete booking');
      setError(err.message || 'Failed to complete booking');
      setStep(2); // Go back to passenger details step
    }
  };

  const handlePaymentError = (errorMessage) => {
    toast.error(errorMessage);
    setError(errorMessage);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    if (step === 2 && !isPassengerDetailsValid()) {
      toast.error('Please fill in all passenger details');
      return;
    }
    if (step === 2) {
      // Create temporary booking and redirect to payment page
      createTemporaryBooking();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const createTemporaryBooking = async () => {
    try {
      // Format seats with passenger details
      const formattedSeats = selectedSeats.map((seatNumber, index) => ({
        seatNumber: parseInt(seatNumber),
        passenger: {
          name: passengerDetails[index].name,
          age: parseInt(passengerDetails[index].age),
          gender: passengerDetails[index].gender
        }
      }));

      const bookingData = {
        busId,
        seats: formattedSeats,
        totalAmount: selectedSeats.length * (busDetails?.fare || 0),
        paymentStatus: 'pending',
        status: 'pending',
        journeyDate: busDetails.departureTime
      };

      // Create temporary booking
      const response = await fetch(`${API_URL}/bookings/temporary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create temporary booking');
      }

      // Navigate to payment page with temporary booking ID
      navigate(`/payment/${data._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to proceed to payment');
      setError(err.message || 'Failed to proceed to payment');
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
  };

  const isPassengerDetailsValid = () => {
    return passengerDetails.slice(0, selectedSeats.length).every(passenger => 
      passenger.name && passenger.age && passenger.gender
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>Select Seats</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>Passenger Details</div>
            <div className="step">Payment</div>
          </div>
        </div>

        {/* Bus Details */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 border-t-4 border-[#CB0404]">
          {busDetails ? (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{busDetails.busName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{translate('from')}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{busDetails.from}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{translate('to')}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{busDetails.to}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{translate('departureTime')}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{new Date(busDetails.departureTime).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{translate('fare')}</p>
                  <p className="mt-1 text-lg font-semibold text-[#CB0404]">${busDetails.fare}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="mt-6">
            <SeatLayout
              totalSeats={busDetails?.totalSeats || 0}
              bookedSeats={busDetails?.bookedSeats || []}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              seatLayout={busDetails?.seatLayout || '2x2'}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#CB0404] hover:bg-red-700"
              >
                Next: Passenger Details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            {/* Passenger Details Form */}
            {selectedSeats.map((seatNumber, index) => (
              <div key={seatNumber} className="mb-6 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Passenger {index + 1} - Seat {seatNumber}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('fullName')}
                    </label>
                    <input
                      type="text"
                      name={`name-${seatNumber}`}
                      value={passengerDetails[index]?.name || ''}
                      onChange={(e) => handlePassengerDetailChange(index, 'name', e.target.value)}
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CB0404] focus:border-[#CB0404] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('age')}
                    </label>
                    <input
                      type="number"
                      name={`age-${seatNumber}`}
                      value={passengerDetails[index]?.age || ''}
                      onChange={(e) => handlePassengerDetailChange(index, 'age', e.target.value)}
                      required
                      min="1"
                      max="120"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CB0404] focus:border-[#CB0404] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('gender')}
                    </label>
                    <select
                      name={`gender-${seatNumber}`}
                      value={passengerDetails[index]?.gender || ''}
                      onChange={(e) => handlePassengerDetailChange(index, 'gender', e.target.value)}
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CB0404] focus:border-[#CB0404] sm:text-sm"
                    >
                      <option value="">{translate('selectGender')}</option>
                      <option value="male">{translate('male')}</option>
                      <option value="female">{translate('female')}</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#CB0404] hover:bg-red-700"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking; 