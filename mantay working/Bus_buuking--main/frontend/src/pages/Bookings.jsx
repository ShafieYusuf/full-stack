import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getUserBookings, cancelBooking } from '../services/booking.service';

const Bookings = () => {
  const { user } = useAuth();
  const { translate } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#CB0404]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{translate('myBookings')}</h1>
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#CB0404] hover:bg-red-700"
          >
            {translate('bookNewTrip')}
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{translate('noBookingsFound')}</h3>
            <p className="mt-1 text-sm text-gray-500">{translate('getStartedBooking')}</p>
            <div className="mt-6">
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#CB0404] hover:bg-red-700"
              >
                {translate('bookNow')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md border-t-4 border-[#CB0404]">
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-medium text-[#CB0404] truncate mb-2 sm:mb-0">
                            {booking.busId.busName}
                          </p>
                          <div className="flex-shrink-0 flex space-x-2">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {translate(booking.status)}
                            </p>
                            {booking.status === 'confirmed' && (
                              <Link
                                to={`/booking/confirmation/${booking._id}`}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-[#CB0404] hover:bg-red-700"
                              >
                                {translate('viewTicket')}
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                            <p className="flex items-center text-xs sm:text-sm text-gray-500">
                              {booking.busId.from} → {booking.busId.to}
                            </p>
                            <p className="flex items-center text-xs sm:text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(booking.journeyDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <p>{translate('seats')}: {booking.seats.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 sm:ml-5 flex-shrink-0">
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-sm font-medium text-[#CB0404] hover:text-red-700"
                          >
                            {translate('cancel')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings; 