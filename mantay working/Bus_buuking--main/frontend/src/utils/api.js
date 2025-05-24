import { API_URL } from '../config';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
}; 