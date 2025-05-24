import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../config';

const BookingTicket = ({ booking }) => {
  const { translate } = useLanguage();

  const generateTicketPDF = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings/${booking._id}/ticket`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate ticket');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${booking.bookingNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating ticket:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-[#CB0404]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{translate('busTicket')}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {translate('bookingNumber')}: {booking.bookingNumber}
            </p>
          </div>
          <div className="text-right flex items-start space-x-2">
            <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {translate(booking.status)}
            </p>
            <button
              onClick={generateTicketPDF}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-[#CB0404] hover:bg-red-700"
            >
              {translate('downloadTicket')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{translate('from')}</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{booking.busId.from}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{translate('to')}</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{booking.busId.to}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{translate('journeyDate')}</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {new Date(booking.journeyDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{translate('departureTime')}</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {new Date(booking.busId.departureTime).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{translate('passengerDetails')}</h3>
          <div className="space-y-4">
            {booking.seats.map((seat, index) => (
              <div key={seat.seatNumber} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{seat.passenger.name}</p>
                  <p className="text-sm text-gray-500">
                    {translate('seat')} {seat.seatNumber} • {seat.passenger.gender} • {translate('age')}: {seat.passenger.age}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{translate('totalAmount')}</h3>
            <p className="text-xl font-bold text-gray-900">${booking.totalAmount}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {translate('transactionId')}: {booking.transactionId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket; 