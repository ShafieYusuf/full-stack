const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create booking');
  }

  return data;
};

export const getUserBookings = async () => {
  const response = await fetch(`${API_URL}/bookings`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get bookings');
  }

  return data;
};

export const getBookingDetails = async (bookingId) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get booking details');
  }

  return data;
};

export const cancelBooking = async (bookingId, reason) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel booking');
  }

  return data;
}; 