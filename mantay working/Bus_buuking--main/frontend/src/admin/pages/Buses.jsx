import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { useLanguage } from '../../context/LanguageContext';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { translate } = useLanguage();
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    fare: '',
    totalSeats: '',
    type: 'AC Seater',
    seatLayout: '2x2',
    availableSeats: '',
    status: 'Active'
  });

  // Add Somali cities array
  const somaliCities = [
    'Mogadishu',
    'Hargeisa',
    'Berbera',
    'Bosaso',
    'Kismayo',
    'Merca',
    'Baydhbo',
    'Galkayo',
    'Beledweyne',
    'Garowe',
    'Jowhar',
    'Burco',
    'Lascaanod',
    'Cerigabo',
    'Afgoye',
    'Wanlaweyn'
  ].sort();

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/buses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch buses');
      }

      setBuses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        availableSeats: parseInt(formData.totalSeats),
        fare: parseFloat(formData.fare),
        totalSeats: parseInt(formData.totalSeats)
      };

      const response = await fetch(`${API_URL}/admin/buses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add bus');
      }

      // Refresh buses list
      fetchBuses();
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        busName: '',
        busNumber: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        fare: '',
        totalSeats: '',
        type: 'AC Seater',
        seatLayout: '2x2',
        availableSeats: '',
        status: 'Active'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/buses/${busId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete bus');
      }

      // Refresh buses list
      fetchBuses();
    } catch (err) {
      setError(err.message);
    }
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
          <h1 className="text-2xl font-semibold text-gray-900">{translate('manageBuses')}</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {translate('addBus')}
          </button>
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

        {/* Buses Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('busDetails')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('route')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('schedule')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('capacity')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translate('status')}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{translate('actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {buses.map((bus) => (
                      <tr key={bus._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {bus.busName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {bus.busNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {bus.type} • {bus.seatLayout}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{bus.from} → {bus.to}</div>
                          <div className="text-sm text-gray-500">${bus.fare}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(bus.departureTime).toLocaleTimeString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(bus.arrivalTime).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bus.availableSeats}/{bus.totalSeats} seats
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bus.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {bus.availableSeats > 0 ? 'Available' : 'Full'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(bus._id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Delete
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

        {/* Add Bus Modal */}
        {isAddModalOpen && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Bus Name
                      </label>
                      <input
                        type="text"
                        value={formData.busName}
                        onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Bus Number
                      </label>
                      <input
                        type="text"
                        value={formData.busNumber}
                        onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          From
                        </label>
                        <select
                          value={formData.from}
                          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                          required
                        >
                          <option value="">Select Departure City</option>
                          {somaliCities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          To
                        </label>
                        <select
                          value={formData.to}
                          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                          required
                        >
                          <option value="">Select Destination City</option>
                          {somaliCities.filter(city => city !== formData.from).map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Departure Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.departureTime}
                          onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Arrival Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.arrivalTime}
                          onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Fare ($)
                        </label>
                        <input
                          type="number"
                          value={formData.fare}
                          onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-text"
                          step="0.01"
                          min="0.01"
                          placeholder="Enter fare (e.g. 0.01)"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">You can enter values as low as 0.01 for testing</p>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Total Seats
                        </label>
                        <input
                          type="number"
                          value={formData.totalSeats}
                          onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="AC Seater">AC Seater</option>
                          <option value="Non-AC Seater">Non-AC Seater</option>
                          <option value="AC Sleeper">AC Sleeper</option>
                          <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Seat Layout
                        </label>
                        <select
                          value={formData.seatLayout}
                          onChange={(e) => setFormData({ ...formData, seatLayout: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="2x2">2x2</option>
                          <option value="2x3">2x3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                    >
                      Add Bus
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBuses; 