import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, translate } = useLanguage();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Admin navigation items
  const adminNavItems = [
    { name: translate('dashboard'), path: '/admin/dashboard' },
    { name: translate('buses'), path: '/admin/buses' },
    { name: translate('bookings'), path: '/admin/bookings' },
    { name: translate('users'), path: '/admin/users' },
    { name: translate('analytics'), path: '/admin/analytics' }
  ];

  // Customer navigation items
  const customerNavItems = [
    { name: translate('home'), path: '/' },
    { name: translate('searchBuses'), path: '/search' },
    { name: translate('about'), path: '/about' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#CB0404]">SAXANSAXO TRAVELS</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {/* Language Selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#CB0404] focus:outline-none"
              >
                <span className="text-sm font-medium">
                  {language === 'en' ? translate('english') : translate('somali')}
                </span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isLanguageOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLanguageOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      language === 'en' ? 'text-[#CB0404] bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {translate('english')}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('so');
                      setIsLanguageOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      language === 'so' ? 'text-[#CB0404] bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {translate('somali')}
                  </button>
                </div>
              )}
            </div>

            {/* Show navigation items based on user role */}
            {user ? (
              <>
                {user.role === 'admin' ? (
                  // Admin Navigation
                  adminNavItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-gray-700 hover:text-[#CB0404] px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  // Customer Navigation
                  customerNavItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-gray-700 hover:text-[#CB0404] px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))
                )}
                {/* Profile Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#CB0404] focus:outline-none"
                  >
                    <div className="bg-[#CB0404] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <Link
                        to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {translate('dashboard')}
                      </Link>
                      <Link
                        to={user.role === 'admin' ? '/admin/bookings' : '/bookings'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {user.role === 'admin' ? translate('allBookings') : translate('myBookings')}
                      </Link>
                      <Link
                        to={user.role === 'admin' ? '/admin/settings' : '/profile'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {user.role === 'admin' ? translate('settings') : translate('profileSettings')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        {translate('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Public Navigation Links
              <>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-[#CB0404] px-3 py-2 rounded-md text-sm font-medium"
                >
                  {translate('about')}
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#CB0404] px-3 py-2 rounded-md text-sm font-medium"
                >
                  {translate('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-[#CB0404] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  {translate('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center space-x-4">
            {/* Mobile Language Selector */}
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-[#CB0404] focus:outline-none"
            >
              <span className="text-sm">{language === 'en' ? 'EN' : 'SO'}</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Language options for mobile */}
            {isLanguageOpen && (
              <div className="mb-2 border-b border-gray-200 pb-2">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsLanguageOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    language === 'en' ? 'text-[#CB0404] bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {translate('english')}
                </button>
                <button
                  onClick={() => {
                    setLanguage('so');
                    setIsLanguageOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    language === 'so' ? 'text-[#CB0404] bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {translate('somali')}
                </button>
              </div>
            )}

            {/* Rest of the mobile menu */}
            {user?.role === 'admin' ? (
              // Admin Mobile Navigation
              adminNavItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))
            ) : (
              // Customer Mobile Navigation
              <>
                {customerNavItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 flex items-center">
                      <div className="bg-[#CB0404] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {getInitials(user.name)}
                      </div>
                      <span className="text-gray-700">{user.name}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CB0404] hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:text-red-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 