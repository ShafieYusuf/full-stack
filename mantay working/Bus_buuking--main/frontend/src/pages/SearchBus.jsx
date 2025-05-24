import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { searchBuses } from '../services/bus.service';

const SearchBus = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translate } = useLanguage();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState('');

  // Add Somali cities array
  const somaliCities = [
    'Mogadishu',
    'Hargeisa',
    'Berbera',
    'Bosaso',
    'Kismayo',
    'Merca',
    'Baydhabo',
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBuses([]);

    try {
      if (!user) {
        navigate('/login', { state: { from: '/search' } });
        return;
      }

      console.log('Searching with params:', searchParams);  // Debug log
      const results = await searchBuses(searchParams);
      console.log('Search results:', results);  // Debug log
      setBuses(results);
    } catch (err) {
      if (err.message.includes('401')) {
        navigate('/login', { state: { from: '/search' } });
        return;
      }
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (busId) => {
    navigate(`/booking/${busId}`);
  };

  // Get today's date in YYYY-MM-DD format for min date in date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-4 sm:mb-8 border-t-4 border-[#CB0404]">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{translate('searchBusTickets')}</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{translate('from')}</label>
              <select
                value={searchParams.from}
                onChange={handleChange}
                name="from"
                required
                className="block w-full border-2 border-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CB0404] focus:border-[#CB0404] text-sm"
              >
                <option value="">{translate('selectCity')}</option>
                {somaliCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{translate('to')}</label>
              <select
                value={searchParams.to}
                onChange={handleChange}
                name="to"
                required
                className="block w-full border-2 border-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CB0404] focus:border-[#CB0404] text-sm"
              >
                <option value="">{translate('selectCity')}</option>
                {somaliCities.filter(city => city !== searchParams.from).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{translate('journeyDate')}</label>
              <input
                type="date"
                value={searchParams.date}
                onChange={handleChange}
                name="date"
                min={today}
                required
                className="block w-full border-2 border-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CB0404] focus:border-[#CB0404] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{translate('passengers')}</label>
              <input
                type="number"
                value={searchParams.passengers}
                onChange={handleChange}
                name="passengers"
                min="1"
                max="6"
                required
                className="block w-full border-2 border-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CB0404] focus:border-[#CB0404] text-sm"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-[#CB0404] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB0404]"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {translate('search')}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#CB0404]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 sm:mb-8">
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
        ) : buses.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {buses.map((bus) => (
                <li key={bus._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="p-4 sm:px-6 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-lg sm:text-xl font-bold text-[#CB0404] truncate mb-2 sm:mb-0">
                            {bus.busName}
                          </h3>
                          <div className="sm:ml-4">
                            <span className={`inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                              bus.availableSeats > 10 
                                ? 'bg-green-100 text-green-800' 
                                : bus.availableSeats > 0 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {bus.availableSeats} {translate('availableSeats')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                          <div className="flex items-center text-sm">
                            <svg className="flex-shrink-0 mr-1.5 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-gray-900">{bus.from} → {bus.to}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <svg className="flex-shrink-0 mr-1.5 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium text-gray-900">
                              {formatTime(bus.departureTime)} - {formatTime(bus.arrivalTime)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <svg className="flex-shrink-0 mr-1.5 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold text-[#CB0404]">${bus.fare}</span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-4 flex flex-wrap gap-2 items-center text-xs sm:text-sm text-gray-700">
                          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">{bus.type}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">{bus.seatLayout} {translate('seatLayout')}</span>
                        </div>
                      </div>
                      <div className="sm:ml-6 flex justify-center">
                        <button
                          onClick={() => handleBookNow(bus._id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-[#CB0404] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB0404]"
                        >
                          {translate('bookNow')}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{translate('noAvailableBuses')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBus; 