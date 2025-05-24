import React from 'react';

const SeatLayout = ({ seatLayout, totalSeats, selectedSeats, bookedSeats, onSeatClick }) => {
  const renderSeat = (seatNumber) => {
    const isSelected = selectedSeats.includes(seatNumber);
    const isBooked = bookedSeats?.some(seat => seat.seatNumber === seatNumber);

    return (
      <button
        key={seatNumber}
        disabled={isBooked}
        onClick={() => !isBooked && onSeatClick(seatNumber)}
        className={`p-2 sm:p-4 rounded-md font-semibold text-xs sm:text-sm ${
          isBooked
            ? 'bg-red-100 cursor-not-allowed text-gray-500'
            : isSelected
            ? 'bg-[#CB0404] text-white hover:bg-red-700'
            : 'bg-white border-2 border-gray-300 hover:border-[#CB0404] hover:text-[#CB0404]'
        }`}
      >
        {seatNumber}
      </button>
    );
  };

  const renderRow = (startSeat, seatsPerRow) => {
    const seats = [];
    for (let i = 0; i < seatsPerRow; i++) {
      const seatNumber = startSeat + i;
      if (seatNumber <= totalSeats) {
        seats.push(renderSeat(seatNumber));
      }
    }
    return seats;
  };

  const render2x2Layout = () => {
    const rows = [];
    for (let i = 1; i <= totalSeats; i += 4) {
      rows.push(
        <div key={i} className="flex justify-between mb-2 sm:mb-4">
          <div className="flex space-x-1 sm:space-x-2">
            {renderRow(i, 2)}
          </div>
          <div className="w-4 sm:w-8" /> {/* Aisle */}
          <div className="flex space-x-1 sm:space-x-2">
            {renderRow(i + 2, 2)}
          </div>
        </div>
      );
    }
    return rows;
  };

  const render2x3Layout = () => {
    const rows = [];
    for (let i = 1; i <= totalSeats; i += 5) {
      rows.push(
        <div key={i} className="flex justify-between mb-2 sm:mb-4">
          <div className="flex space-x-1 sm:space-x-2">
            {renderRow(i, 2)}
          </div>
          <div className="w-4 sm:w-8" /> {/* Aisle */}
          <div className="flex space-x-1 sm:space-x-2">
            {renderRow(i + 2, 3)}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center">
            <div className="w-4 sm:w-5 h-4 sm:h-5 bg-red-100 rounded-md mr-1.5 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 sm:w-5 h-4 sm:h-5 bg-[#CB0404] rounded-md mr-1.5 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 sm:w-5 h-4 sm:h-5 bg-white border-2 border-gray-300 rounded-md mr-1.5 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Available</span>
          </div>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-gray-700">
          {seatLayout === '2x2' ? '2x2 Layout' : '2x3 Layout'}
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 sm:p-8 bg-gray-50">
        {seatLayout === '2x2' ? render2x2Layout() : render2x3Layout()}
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col items-center">
        <div className="w-16 sm:w-24 h-1 bg-[#CB0404] rounded-full" />
        <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-gray-700">Front</div>
      </div>
    </div>
  );
};

export default SeatLayout; 