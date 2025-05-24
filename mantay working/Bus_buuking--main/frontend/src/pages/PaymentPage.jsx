import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { temporaryBookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/bookings/temporary/${temporaryBookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch booking details');
        }

        // Verify this is a pending booking
        if (data.paymentStatus !== 'pending' || data.status !== 'pending') {
          throw new Error('Invalid booking status');
        }

        setBookingDetails(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        // Redirect back to booking page if there's an error
        navigate('/buses');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigate('/login');
      return;
    }

    fetchBookingDetails();
  }, [temporaryBookingId, navigate, user]);

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
        
        // Navigate back to booking page
        navigate(`/booking/${bookingDetails.busId}`);
        return;
      }

      // Only proceed with booking creation if payment was successful
      if (paymentResponse.success || paymentResponse.responseCode === '2001' || paymentResponse.params?.state === 'APPROVED') {
        // Create confirmed booking
        const response = await fetch(`${API_URL}/bookings/confirm/${temporaryBookingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            paymentId: paymentResponse.paymentId || paymentResponse.orderId || paymentResponse.params?.orderId,
            transactionId: paymentResponse.transactionId || paymentResponse.params?.transactionId || paymentResponse.params?.issuerTransactionId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to confirm booking');
        }

        // Navigate to booking confirmation page
        toast.success('Payment successful! Booking confirmed.');
        navigate(`/booking/confirmation/${data._id}`);
      } else {
        toast.error('Payment was not successful. Please try again.');
        navigate(`/booking/${bookingDetails.busId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete payment');
      setError(err.message || 'Failed to complete payment');
      navigate(`/booking/${bookingDetails.busId}`);
    }
  };

  const handlePaymentError = (errorMessage) => {
    toast.error(errorMessage);
    setError(errorMessage);
    // Navigate back to booking page on error
    navigate(`/booking/${bookingDetails?.busId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => navigate('/buses')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Return to Bus List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">${bookingDetails?.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Seats:</span>
              <span className="font-semibold">{bookingDetails?.seats?.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Journey Date:</span>
              <span className="font-semibold">
                {new Date(bookingDetails?.journeyDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <PaymentForm
            bookingId={temporaryBookingId}
            amount={bookingDetails?.totalAmount}
            onPaymentComplete={handlePaymentComplete}
            onError={handlePaymentError}
          />
          <div className="mt-6">
            <button
              onClick={() => navigate(`/booking/${bookingDetails.busId}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 