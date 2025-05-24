import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getUserBookings, cancelBooking } from '../services/booking.service';

const Dashboard = () => {
  const { user, checkTokenExpiry } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (isRefreshing || !user) return;
    
    try {
      setIsRefreshing(true);
      const bookingsData = await getUserBookings();
      if (bookingsData) {
        setBookings(bookingsData);
      }
    } catch (err) {
      setError(err.message);
      // If there's an auth error, check token
      if (err.message.includes('unauthorized')) {
        checkTokenExpiry();
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing, user, checkTokenExpiry]);

  useEffect(() => {
    let mounted = true;

    if (!user) {
      navigate('/login');
      return;
    }

    const initializeDashboard = async () => {
      if (mounted) {
        await fetchBookings();
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [user, navigate, fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId, 'Customer requested cancellation');
      await fetchBookings();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized')) {
        checkTokenExpiry();
      }
    }
  };

  if (!user) {
    return null;
  }

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

        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-4 sm:py-5 border-b border-gray-200 sm:px-6 border-t-4 border-[#CB0404]">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
              {translate('welcomeBack')}, {user.name}!
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {translate('manageBookings')}
            </p>
          </div>

          {/* Dashboard Content */}
          <div className="px-4 py-4 sm:py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* My Bookings Card */}
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg border-2 border-gray-200 hover:border-[#CB0404] transition-colors duration-200">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#CB0404]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {translate('myBookings')}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                            {bookings.length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 sm:px-5 py-2 sm:py-3">
                  <div className="text-sm">
                    <Link to="/bookings" className="font-medium text-[#CB0404] hover:text-red-700">
                      {translate('viewAllBookings')} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Book Card */}
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg border-2 border-gray-200 hover:border-[#CB0404] transition-colors duration-200">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#CB0404]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {translate('quickBook')}
                        </dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                          {translate('searchAndBook')}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 sm:px-5 py-2 sm:py-3">
                  <div className="text-sm">
                    <Link to="/search" className="font-medium text-[#CB0404] hover:text-red-700">
                      {translate('searchBuses')} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Profile Settings Card */}
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg border-2 border-gray-200 hover:border-[#CB0404] transition-colors duration-200">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#CB0404]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {translate('profileSettings')}
                        </dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                          {translate('manageBookings')}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 sm:px-5 py-2 sm:py-3">
                  <div className="text-sm">
                    <Link to="/profile" className="font-medium text-[#CB0404] hover:text-red-700">
                      {translate('editProfile')} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
                {translate('recentBookings')}
              </h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md border-2 border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {bookings.slice(0, 5).map((booking) => (
                    <li key={booking._id}>
                      <div className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-[#CB0404] truncate">
                              {booking.busId.busName}
                            </p>
                            <p className="mt-1 text-xs sm:text-sm text-gray-500">
                              {new Date(booking.journeyDate).toLocaleDateString()} • {booking.seats.length} {translate('passengers')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {translate(booking.status)}
                            </span>
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="text-xs sm:text-sm font-medium text-[#CB0404] hover:text-red-700"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 