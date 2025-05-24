import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPopularRoutes } from '../services/bus.service';

const Home = () => {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Fatima Hassan",
      role: "Frequent Traveler",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      stars: 5,
      text: "I regularly travel between Mogadishu and Hargeisa for business. Sabii Travels has made booking so much easier. The seats are comfortable and the service is excellent."
    },
    {
      id: 2,
      name: "Ahmed Omar",
      role: "Business Traveler",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      stars: 5,
      text: "The online booking system is very convenient. I appreciate the professional service and punctuality of the buses. Highly recommended for business travel."
    },
    {
      id: 3,
      name: "Amina Yusuf",
      role: "Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      stars: 5,
      text: "As a student, I frequently travel between cities. Sabii Travels offers great student discounts and their customer service team is always helpful."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const data = await getPopularRoutes();
        // Transform the data to match the expected format
        const formattedRoutes = data.map(route => ({
          from: route._id.from,
          to: route._id.to,
          price: `$${route.minFare}`,
          time: '~8h' // You can calculate this based on your needs
        }));
        setPopularRoutes(formattedRoutes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-[#CB0404] overflow-hidden">
        {/* Liquid Wave Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path fill="white" d="M0,50 C20,60 40,40 50,50 C60,60 80,40 100,50 L100,100 L0,100 Z">
                <animate 
                  attributeName="d" 
                  dur="5s" 
                  repeatCount="indefinite"
                  values="
                    M0,50 C20,60 40,40 50,50 C60,60 80,40 100,50 L100,100 L0,100 Z;
                    M0,50 C20,40 40,60 50,50 C60,40 80,60 100,50 L100,100 L0,100 Z;
                    M0,50 C20,60 40,40 50,50 C60,60 80,40 100,50 L100,100 L0,100 Z"
                />
              </path>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between">
            {/* Text Content */}
            <div className="text-center lg:text-left lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 gradient-text-animate">
                  Travel Across Somalia
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-white gradient-text-animate">
                  Safely & Comfortably
                </span>
                </h1>
              <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-xl mx-auto lg:mx-0">
                Book bus tickets online for all major routes across Somalia. Easy booking, secure payment, and instant confirmation.
                </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/search"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-[#CB0404] bg-white hover:bg-blue-50 hover-scale shadow-glow"
                    >
                      Search Buses
                    </Link>
                    <Link
                      to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-[#CB0404] hover-scale"
                    >
                      Register Now
                    </Link>
                  </div>
                </div>

            {/* Image/Illustration */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
                <img
                  className="relative rounded-lg shadow-2xl hover-scale"
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Luxury Bus"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Why Choose Sabii Travels
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-16">
              We provide the best bus booking experience in Somalia with modern buses, competitive prices, and excellent customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Modern Fleet */}
            <div className="bg-white p-6 rounded-xl text-center hover-scale transition-all duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                  </svg>
                </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Modern Fleet</h3>
              <p className="text-gray-600">
                Our buses are modern, comfortable, and regularly maintained for safe travel.
                </p>
              </div>

            {/* Best Prices */}
            <div className="bg-white p-6 rounded-xl text-center hover-scale transition-all duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">
                We offer competitive prices and special discounts for regular travelers.
                </p>
              </div>

            {/* Safe Travel */}
            <div className="bg-white p-6 rounded-xl text-center hover-scale transition-all duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe Travel</h3>
              <p className="text-gray-600">
                Safety is our priority with professional drivers and well-maintained buses.
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white p-6 rounded-xl text-center hover-scale transition-all duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available 24/7 to assist you with any issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-sm sm:text-base text-[#CB0404] font-semibold tracking-wide uppercase">Popular Routes</h2>
            <p className="mt-2 text-2xl sm:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Top Destinations
            </p>
          </div>

          {loading ? (
            <div className="mt-8 sm:mt-10 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#CB0404]"></div>
            </div>
          ) : error ? (
            <div className="mt-8 sm:mt-10 bg-red-50 border-l-4 border-red-400 p-4">
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
          ) : popularRoutes.length > 0 ? (
            <div className="mt-8 sm:mt-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularRoutes.map((route, index) => (
                  <div
                    key={`${route.from}-${route.to}-${index}`}
                    className="relative rounded-lg border border-gray-300 bg-white px-4 sm:px-6 py-4 sm:py-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="focus:outline-none">
                          <div className="flex items-center justify-between">
                            <p className="text-base sm:text-lg font-medium text-gray-900">
                              {route.from} → {route.to}
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-[#CB0404]">{route.price}</p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">Duration: {route.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <Link
                        to={`/search?from=${route.from}&to=${route.to}`}
                        className="text-xs sm:text-sm font-medium text-[#CB0404] hover:text-red-700"
                      >
                        View available buses →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 sm:mt-10 text-center text-gray-500">
              No popular routes available at the moment.
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
              Booking a bus ticket with Sabii Travels is quick and easy. Follow these simple steps to secure your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Search Buses */}
            <div className="relative text-center step-card rounded-xl p-6">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="step-number w-8 h-8 bg-[#CB0404] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <div className="pt-8 pb-6">
                <div className="step-icon w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Search Buses</h3>
                <p className="text-gray-600">
                  Enter your origin, destination, and travel date to find available buses.
                </p>
              </div>
            </div>

            {/* Step 2: Select Seats */}
            <div className="relative text-center step-card rounded-xl p-6">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="step-number w-8 h-8 bg-[#CB0404] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <div className="pt-8 pb-6">
                <div className="step-icon w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Select Seats</h3>
                <p className="text-gray-600">
                  Choose your preferred seats from the seat map and add passenger details.
                </p>
              </div>
            </div>

            {/* Step 3: Make Payment */}
            <div className="relative text-center step-card rounded-xl p-6">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="step-number w-8 h-8 bg-[#CB0404] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <div className="pt-8 pb-6">
                <div className="step-icon w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Make Payment</h3>
                <p className="text-gray-600">
                  Pay securely using EVC Plus, credit card, or other payment methods.
                </p>
              </div>
            </div>

            {/* Step 4: Get Ticket */}
            <div className="relative text-center step-card rounded-xl p-6">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="step-number w-8 h-8 bg-[#CB0404] rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
              </div>
              <div className="pt-8 pb-6">
                <div className="step-icon w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#CB0404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Ticket</h3>
                <p className="text-gray-600">
                  Receive your e-ticket immediately. Show it on your phone or print it.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center mt-12">
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-[#CB0404] hover:bg-red-700 hover-scale shadow-glow animate-float"
            >
              Book Your Journey Now
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              What Our Customers Say
              </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
              Don't just take our word for it. Here's what our customers think about their experience with Sabii Travels.
              </p>
            </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div className="testimonial-card p-8 sm:p-10">
              <div className="flex flex-col items-center">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="testimonial-image mb-6"
                />
                <div className="testimonial-stars flex space-x-1 mb-6">
                  {[...Array(testimonials[currentTestimonial].stars)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-lg sm:text-xl text-center mb-8">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-500">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4">
              <button
                onClick={prevTestimonial}
                className="testimonial-arrow bg-white rounded-full p-2 shadow-lg"
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
                  <button
                onClick={nextTestimonial}
                className="testimonial-arrow bg-white rounded-full p-2 shadow-lg"
                aria-label="Next testimonial"
                  >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                  </button>
                </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'testimonial-dot active bg-[#CB0404] w-8'
                    : 'testimonial-dot w-2 bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#CB0404] via-purple-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Book Your Bus Ticket?
              </h2>
              <p className="text-white/90 text-lg">
                Travel safely and comfortably with Sabii Travels. Book your bus ticket now for a seamless journey across Somalia.
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-4 bg-white rounded-lg text-[#CB0404] font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Book Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <svg className="w-8 h-8 text-[#CB0404]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8zm13.5-6.5l-5 5-5-5h10z"/>
                </svg>
                <span className="text-2xl font-bold text-white">Sabii Travels</span>
              </div>
              <p className="text-gray-300 mb-6">
                Providing safe, reliable and comfortable travel across Somalia. Book your journey online with ease.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/search" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Find Buses
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#CB0404] mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">
                    Makka Al-Mukarama Road,<br />
                    Mogadishu, Somalia
                  </span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-[#CB0404] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300">+252 61 234 5678</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-[#CB0404] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">info@sabiitravels.so</span>
                </li>
              </ul>
            </div>

            {/* Payment Options */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Payment Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 flex items-center justify-center">
                  <span className="text-blue-900 font-semibold">EVC Plus</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-center">
                  <span className="text-blue-900 font-semibold">Visa</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-center">
                  <span className="text-blue-900 font-semibold">Mastercard</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-300">
                Secured payment processing for your peace of mind.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Sabii Travels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 