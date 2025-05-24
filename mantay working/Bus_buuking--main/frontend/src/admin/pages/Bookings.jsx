import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { useLanguage } from '../../context/LanguageContext';

const AdminBookings = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    date: '',
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      let url = `${API_URL}/admin/bookings?`;
      if (filter.status !== 'all') url += `status=${filter.status}&`;
      if (filter.date) url += `date=${filter.date}&`;
      if (filter.searchTerm) url += `search=${filter.searchTerm}&`;
      url += `sortBy=${filter.sortBy}&sortOrder=${filter.sortOrder}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      // Sort bookings by createdAt in descending order (newest first)
      const sortedBookings = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setBookings(sortedBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      // Refresh bookings
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSortChange = (sortBy) => {
    setFilter(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortIcon = (columnName) => {
    if (filter.sortBy !== columnName) return '↕️';
    return filter.sortOrder === 'desc' ? '↓' : '↑';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{translate('manageBookings')}</h1>
          
          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="all">{translate('allStatus')}</option>
              <option value="confirmed">{translate('confirmed')}</option>
              <option value="completed">{translate('completed')}</option>
              <option value="cancelled">{translate('cancelled')}</option>
            </select>
            
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            
            <input
              type="text"
              placeholder={translate('searchBookings')}
              value={filter.searchTerm}
              onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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

        {/* Bookings Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange('createdAt')}
                      >
                        {translate('bookingDetails')} {getSortIcon('createdAt')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('customer')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange('journeyDate')}
                      >
                        {translate('journey')} {getSortIcon('journeyDate')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('status')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange('totalAmount')}
                      >
                        {translate('payment')} {getSortIcon('totalAmount')}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{translate('actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{booking.bookingNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.userId.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.busId.from} → {booking.busId.to}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.journeyDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Seats: {booking.seats.map(seat => 
                              `${seat.seatNumber} (${seat.passenger.name})`
                            ).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          {booking.paymentStatus === 'completed' && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${booking.totalAmount}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.paymentStatus}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings; 