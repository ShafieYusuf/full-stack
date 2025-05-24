import { API_URL } from '../config/index';
import { getAuthHeaders } from '../utils/auth';

export const initiateWaafiPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payments/waafi/initiate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to initiate payment');
  }

  return data;
};

export const verifyWaafiPayment = async (transactionId) => {
  const response = await fetch(`${API_URL}/payments/waafi/verify/${transactionId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to verify payment');
  }

  return data;
}; 