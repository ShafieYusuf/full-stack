import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useLanguage } from '../../context/LanguageContext';
import { API_URL } from '../../config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { translate } = useLanguage();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    endDate: new Date().toISOString().split('T')[0]
  });
  const [analytics, setAnalytics] = useState({
    bookings: [],
    users: [],
    revenue: [],
    busOccupancy: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const [bookingData, userData, revenueData, busData] = await Promise.all([
        fetch(`${API_URL}/admin/analytics/bookings?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        fetch(`${API_URL}/admin/analytics/users`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        fetch(`${API_URL}/admin/analytics/revenue`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        fetch(`${API_URL}/admin/analytics/buses`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json())
      ]);

      setAnalytics({
        bookings: bookingData,
        users: userData,
        revenue: revenueData,
        busOccupancy: busData
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookingChartData = {
    labels: analytics.bookings.map(item => 
      `${item._id.year}-${item._id.month}-${item._id.day}`
    ),
    datasets: [
      {
        label: translate('dailyStats'),
        data: analytics.bookings.map(item => item.bookings),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const revenueChartData = {
    labels: analytics.revenue.map(item => 
      `${item._id.year}-${item._id.month}`
    ),
    datasets: [
      {
        label: translate('monthlyStats'),
        data: analytics.revenue.map(item => item.revenue),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  };

  const userGrowthData = {
    labels: analytics.users.map(item => 
      `${item._id.year}-${item._id.month}`
    ),
    datasets: [
      {
        label: translate('newUsers'),
        data: analytics.users.map(item => item.count),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const busOccupancyData = {
    labels: analytics.busOccupancy.map(item => item._id),
    datasets: [
      {
        label: translate('busUtilization'),
        data: analytics.busOccupancy.map(item => item.totalBuses),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
      }
    ]
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
          <h1 className="text-2xl font-semibold text-gray-900">{translate('analyticsDashboard')}</h1>
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
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

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Booking Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{translate('bookingTrends')}</h2>
            <div className="h-80">
              <Line
                data={bookingChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Revenue Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{translate('revenueAnalysis')}</h2>
            <div className="h-80">
              <Bar
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{translate('userGrowth')}</h2>
            <div className="h-80">
              <Line
                data={userGrowthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Bus Type Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{translate('busTypeDistribution')}</h2>
            <div className="h-80">
              <Pie
                data={busOccupancyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {translate('totalBookings')}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analytics.bookings.reduce((sum, item) => sum + item.bookings, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {translate('totalRevenue')}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${analytics.revenue.reduce((sum, item) => sum + item.revenue, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {translate('totalUsers')}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analytics.users.reduce((sum, item) => sum + item.count, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {translate('totalBuses')}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analytics.busOccupancy.reduce((sum, item) => sum + item.totalBuses, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 