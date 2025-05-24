import React, { useState } from 'react';
import { initiateWaafiPayment } from '../services/payment.service';

const PaymentForm = ({ bookingId, amount, onPaymentComplete, onError }) => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  const providers = [
    { id: 'evc', name: 'EVC Plus (Hormuud)', prefix: '252' },
    { id: 'zaad', name: 'ZAAD Service (Telesom)', prefix: '252' },
    { id: 'golis', name: 'SAHAL (Golis)', prefix: '252' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!bookingId || !amount) {
        throw new Error('Missing required booking information');
      }

      const formattedPhoneNumber = phoneNumber.startsWith('252') ? phoneNumber : `252${phoneNumber}`;

      const paymentData = {
        bookingId,
        amount: parseFloat(amount),
        phoneNumber: formattedPhoneNumber,
        paymentMethod: selectedProvider,
        description: `Bus Booking Payment - ${bookingId}`
      };

      console.log('Initiating payment with data:', paymentData);

      const response = await initiateWaafiPayment(paymentData);
      
      if (response.success && response.paymentId) {
        console.log('Payment initiated successfully:', response);
        onPaymentComplete(response);
      } else {
        throw new Error(response.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Payment Provider
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CB0404] focus:border-[#CB0404] sm:text-sm"
            required
          >
            <option value="">Select a provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              +252
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              className="block w-full pl-12 border-gray-300 rounded-md shadow-sm focus:ring-[#CB0404] focus:border-[#CB0404] sm:text-sm"
              placeholder="6XXXXXXXX"
              pattern="[0-9]{9}"
              maxLength="9"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Enter 9 digits after 252</p>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading || !selectedProvider || !phoneNumber}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || !selectedProvider || !phoneNumber
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#CB0404] hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB0404]`}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Test Mobile Numbers:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>EVCPlus (Hormuud): 252611111111</li>
            <li>ZAAD (Telesom): 252631111111</li>
            <li>SAHAL (Golis): 252911111111</li>
          </ul>
          <p className="mt-1">Test PIN for all: 1212</p>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 