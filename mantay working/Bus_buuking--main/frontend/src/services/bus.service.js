const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const formatDate = (dateString) => {
  // Parse the date string
  const date = new Date(dateString);
  
  // Get UTC components
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDay = date.getUTCDate();
  
  // Create new date at midnight UTC
  return new Date(Date.UTC(utcYear, utcMonth, utcDay)).toISOString();
};

export const searchBuses = async (searchParams) => {
  try {
    console.log('Original search params:', searchParams);
    
    const formattedParams = {
      from: searchParams.from,
      to: searchParams.to,
      date: formatDate(searchParams.date),
      passengers: parseInt(searchParams.passengers)
    };

    console.log('Formatted params:', formattedParams);
    console.log('Formatted date (UTC):', formattedParams.date);

    const response = await fetch(`${API_URL}/buses/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedParams)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search buses');
    }

    const data = await response.json();
    console.log('Search results:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Search Error:', error);
    throw new Error(error.message || 'Failed to search buses');
  }
};

export const getBusById = async (busId) => {
  const response = await fetch(`${API_URL}/buses/${busId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get bus details');
  }

  return data;
};

export const getPopularRoutes = async () => {
  const response = await fetch(`${API_URL}/buses/popular-routes`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get popular routes');
  }

  return data;
}; 