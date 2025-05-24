import React, { createContext, useContext, useState, useEffect } from 'react';

// Define translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    searchBuses: 'Search Buses',
    about: 'About Us',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    myBookings: 'My Bookings',
    profileSettings: 'Profile Settings',
    logout: 'Logout',
    
    // Common
    welcome: 'Welcome',
    language: 'Language',
    english: 'English',
    somali: 'Somali',
    
    // Search
    from: 'From',
    to: 'To',
    date: 'Date',
    passengers: 'Passengers',
    search: 'Search',
    selectCity: 'Select City',
    
    // Booking
    bookNow: 'Book Now',
    bookNewTrip: 'Book New Trip',
    seatSelection: 'Seat Selection',
    passengerDetails: 'Passenger Details',
    confirmBooking: 'Confirm Booking',
    totalAmount: 'Total Amount',
    seats: 'Seats',
    viewTicket: 'View Ticket',
    cancel: 'Cancel',
    noBookingsFound: 'No bookings found',
    getStartedBooking: 'Get started by booking your first trip',
    bookingConfirmed: 'Your booking is confirmed! Here\'s your ticket.',
    viewAllBookings: 'View All Bookings',
    printTicket: 'Print Ticket',
    
    // Status
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    pending: 'Pending',
    
    // Profile
    fullName: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    password: 'Password',
    
    // Messages
    bookingSuccess: 'Booking successful',
    loginRequired: 'Please login to continue',

    // Search Page
    searchBusTickets: 'Search Bus Tickets',
    findAndBook: 'Find and book bus tickets for your next journey',
    journeyDate: 'Journey Date',
    availableSeats: 'seats left',
    searchResults: 'Search Results',
    noAvailableBuses: 'No buses found for the selected route and date',
    busType: 'Bus Type',
    seatLayout: 'Seat Layout',
    departureTime: 'Departure Time',
    arrivalTime: 'Arrival Time',
    fare: 'Fare',

    // Dashboard
    welcomeBack: 'Welcome back',
    manageBookings: 'Manage your bookings and account settings',
    quickBook: 'Quick Book',
    searchAndBook: 'Search and book your next trip',
    recentBookings: 'Recent Bookings',
    noRecentBookings: 'No recent bookings found',
    viewAllBookings: 'View all bookings',
    editProfile: 'Edit profile',
    status: 'Status',

    // Ticket
    busTicket: 'Bus Ticket',
    bookingNumber: 'Booking #',
    seat: 'Seat',
    age: 'Age',
    transactionId: 'Transaction ID',
    downloadTicket: 'Download Ticket',
    
    // Admin Dashboard
    dashboardOverview: 'Dashboard Overview',
    addNewBus: 'Add New Bus',
    totalBookings: 'Total Bookings',
    totalRevenue: 'Total Revenue',
    totalUsers: 'Total Users',
    activeBuses: 'Active Buses',
    viewAnalytics: 'View analytics',
    viewAllUsers: 'View all users',
    viewAllBuses: 'View all buses',
    quickActions: 'Quick Actions',
    createNewBusRoute: 'Create a new bus route and schedule',
    checkBookingTrends: 'Check booking trends and revenue',
    
    // Admin Analytics
    analyticsDashboard: 'Analytics Dashboard',
    bookingTrends: 'Booking Trends',
    revenueAnalysis: 'Revenue Analysis',
    userGrowth: 'User Growth',
    busTypeDistribution: 'Bus Type Distribution',
    dailyBookings: 'Daily Bookings',
    monthlyRevenue: 'Monthly Revenue',
    newUsers: 'New Users',
    
    // Admin Users
    manageUsers: 'Manage Users',
    allRoles: 'All Roles',
    customers: 'Customers',
    admins: 'Admins',
    searchUsers: 'Search users...',
    user: 'User',
    contact: 'Contact',
    role: 'Role',
    activity: 'Activity',
    viewDetails: 'View Details',
    lastLogin: 'Last Login',
    bookingsCount: 'bookings',
    never: 'Never',

    // Admin Navigation and Pages
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    buses: 'Buses',
    bookings: 'Bookings',
    users: 'Users',
    analytics: 'Analytics',
    logout: 'Logout',
    active: 'Active',
    inactive: 'Inactive',
    actions: 'Actions',
    viewAll: 'View All',
    
    // Bus Management
    manageBuses: 'Manage Buses',
    busDetails: 'Bus Details',
    schedule: 'Schedule',
    capacity: 'Capacity',
    addBus: 'Add New Bus',
    editBus: 'Edit Bus',
    deleteBus: 'Delete Bus',
    busName: 'Bus Name',
    busNumber: 'Bus Number',
    departureTime: 'Departure Time',
    arrivalTime: 'Arrival Time',
    seatLayout: 'Seat Layout',
    availableSeats: 'Available Seats',
    totalSeats: 'Total Seats',
    busType: 'Bus Type',
    
    // Booking Management
    bookingId: 'Lambarka Dalabka',
    passenger: 'Rakaab',
    amount: 'Lacagta',
    paymentStatus: 'Xaalada Lacag bixinta',
    paid: 'La bixiyey',
    unpaid: 'Aan la bixin',
    manageBookings: 'Manage Bookings',
    bookingDetails: 'Booking Details',
    customer: 'Customer',
    journey: 'Journey',
    payment: 'Payment',
    allStatus: 'All Status',
    completed: 'Completed',
    searchBookings: 'Search bookings...',
    allBookings: 'All Bookings',
    
    // User Management
    userName: 'Magaca Isticmaalaha',
    userEmail: 'Emailka Isticmaalaha',
    userPhone: 'Telefoonka Isticmaalaha',
    userRole: 'Doorka Isticmaalaha',
    lastActive: 'Markii ugu dambeysay ee Firfircoonaa',
    accountStatus: 'Xaalada Xisaabta',
    
    // Analytics
    dailyStats: 'Tirakoobka Maalinlaha',
    weeklyStats: 'Tirakoobka Todobaadlaha',
    monthlyStats: 'Tirakoobka Bishii',
    yearlyStats: 'Tirakoobka Sanadka',
    averageBookings: 'Celceliska Dalabyada',
    popularRoutes: 'Waddooyinka ugu Caansan',
    busUtilization: 'Isticmaalka Basaska',

    // Common Actions
    edit: 'Wax ka bedel',
    delete: 'Tirtir',
    save: 'Kaydi',
    confirm: 'Xaqiiji',
    back: 'Dib u noqo',
    next: 'Xiga',
    about: 'Nagu Saabsan',
  },
  so: {
    // Navigation
    home: 'Bogga Hore',
    searchBuses: 'Raadi Basaska',
    login: 'Gal',
    register: 'Isdiiwaan geli',
    dashboard: 'Dashboard',
    myBookings: 'Dalabyadeyda',
    profileSettings: 'Qofka Faahfaahinta',
    logout: 'Ka bax',
    
    // Common
    welcome: 'Soo dhowow',
    language: 'Luuqada',
    english: 'English',
    somali: 'Soomaali',
    
    // Search
    from: 'Ka',
    to: 'Ku',
    date: 'Taariikhda',
    passengers: 'Rakaabka',
    search: 'Raadi',
    selectCity: 'Dooro Magaalada',
    
    // Booking
    bookNow: 'Dalbo Hadda',
    bookNewTrip: 'Dalbo Safar Cusub',
    seatSelection: 'Dooro Kursiga',
    passengerDetails: 'Faahfaahinta Rakaabka',
    confirmBooking: 'Xaqiiji Dalabka',
    totalAmount: 'Wadarta Lacagta',
    seats: 'Kuraasta',
    viewTicket: 'Arag Ticket-ka',
    cancel: 'Jooji',
    noBookingsFound: 'Ma jiraan dalabyo',
    getStartedBooking: 'Ku bilow inaad sameyso dalabaadkaaga ugu horeeya',
    bookingConfirmed: 'Dalabaadkaaga waa la xaqiijiyey! Halkan waa ticket-kaaga.',
    viewAllBookings: 'Arag Dhammaan Dalabyada',
    printTicket: 'Daabac Ticket-ka',
    
    // Status
    confirmed: 'La xaqiijiyey',
    cancelled: 'La joojiyey',
    pending: 'Sugaya',
    
    // Profile
    fullName: 'Magaca oo Dhamaystiran',
    email: 'Emailka',
    phoneNumber: 'Lambarka Teleefanka',
    password: 'Furaha Sirta ah',
    
    // Messages
    bookingSuccess: 'Dalabka waa la dhamaystiray',
    loginRequired: 'Fadlan gal si aad u sii wadato',

    // Search Page
    searchBusTickets: 'Raadi Tigidhada Baska',
    findAndBook: 'Raadi oo dalbo tigidhada baska safarka xiga',
    journeyDate: 'Taariikhda Safarka',
    availableSeats: 'kursi ayaa banaan',
    searchResults: 'Natiijooyinka Raadinta',
    noAvailableBuses: 'Ma jiraan basas laga helo wadada iyo taariikhda la doortay',
    busType: 'Nooca Baska',
    seatLayout: 'Qaabka Kuraasta',
    departureTime: 'Waqtiga Bixitaanka',
    arrivalTime: 'Waqtiga Soo Gelitaanka',
    fare: 'Qiimaha',

    // Dashboard
    welcomeBack: 'Ku soo dhawoow',
    manageBookings: 'Maamul dalabyada iyo hagaajinta xisaabta',
    quickBook: 'Dalbo Hadda',
    searchAndBook: 'Raadi oo dalbo safarka xiga',
    recentBookings: 'Dalabyadii Ugu Danbeeyay',
    noRecentBookings: 'Ma jiraan dalabyo dhowaan la sameeyay',
    viewAllBookings: 'Arag dhammaan dalabyada',
    editProfile: 'Wax ka bedel xogta',
    status: 'Xaalada',

    // Ticket
    busTicket: 'Ticket-ka Baska',
    bookingNumber: 'Lambarka Dalabka',
    seat: 'Kursi',
    age: 'Da\'da',
    transactionId: 'Lambarka Lacag bixinta',
    downloadTicket: 'Soo dejiso Ticket-ka',
    
    // Admin Dashboard
    dashboardOverview: 'Guud ahaan Dashboard-ka',
    addNewBus: 'Kudar Bas Cusub',
    totalBookings: 'Wadarta Dalabka',
    totalRevenue: 'Wadarta Dakhliga',
    totalUsers: 'Wadarta Isticmaalayaasha',
    activeBuses: 'Basaska Firfircoon',
    viewAnalytics: 'Arag xogta guud',
    viewAllUsers: 'Arag dhammaan isticmaalayaasha',
    viewAllBuses: 'Arag dhammaan basaska',
    quickActions: 'Talaabooyinka Degdega ah',
    createNewBusRoute: 'Samee waddo iyo jadwal bas cusub',
    checkBookingTrends: 'Fiiri isbedelka dalabka iyo dakhliga',
    
    // Admin Analytics
    analyticsDashboard: 'Dashboard-ka Xogta',
    bookingTrends: 'Isbedelka Dalabka',
    revenueAnalysis: 'Falanqaynta Dakhliga',
    userGrowth: 'Kobaca Isticmaalayaasha',
    busTypeDistribution: 'Qaybinta Noocyada Baska',
    dailyBookings: 'Dalabka Maalinlaha ah',
    monthlyRevenue: 'Dakhliga Bishii',
    newUsers: 'Isticmaalayaal Cusub',
    
    // Admin Users
    manageUsers: 'Maamul Isticmaalayaasha',
    allRoles: 'Dhammaan Doorarka',
    customers: 'Macaamiisha',
    admins: 'Maamulayaasha',
    searchUsers: 'Raadi isticmaalayaasha...',
    user: 'Isticmaale',
    contact: 'Xiriir',
    role: 'Door',
    activity: 'Dhaqdhaqaaqa',
    viewDetails: 'Arag Faahfaahinta',
    lastLogin: 'Galitaankii ugu dambeeyay',
    bookingsCount: 'dalabyo',
    never: 'Marna',

    // Admin Navigation and Pages
    adminPanel: 'Maamulka',
    dashboard: 'Dashboard-ka',
    buses: 'Basaska',
    bookings: 'Dalabyada',
    users: 'Isticmaalayaasha',
    analytics: 'Falanqaynta',
    logout: 'Ka bax',
    active: 'Firfircoon',
    inactive: 'Aan Firfircooneyn',
    actions: 'Talaabooyinka',
    viewAll: 'Arag Dhammaan',
    
    // Bus Management
    manageBuses: 'Maamul Basaska',
    busDetails: 'Faahfaahinta Baska',
    schedule: 'Jadwalka',
    capacity: 'Awoodda',
    addBus: 'Kudar Bas Cusub',
    editBus: 'Wax ka bedel Baska',
    deleteBus: 'Tirtir Baska',
    busName: 'Magaca Baska',
    busNumber: 'Lambarka Baska',
    departureTime: 'Waqtiga Bixitaanka',
    arrivalTime: 'Waqtiga Soo Gelitaanka',
    seatLayout: 'Qaabka Kuraasta',
    availableSeats: 'Kuraasta Banaan',
    totalSeats: 'Wadarta Kuraasta',
    busType: 'Nooca Baska',
    
    // Booking Management
    bookingId: 'Lambarka Dalabka',
    passenger: 'Rakaab',
    amount: 'Lacagta',
    paymentStatus: 'Xaalada Lacag bixinta',
    paid: 'La bixiyey',
    unpaid: 'Aan la bixin',
    manageBookings: 'Maamul Dalabyada',
    bookingDetails: 'Faahfaahinta Dalabka',
    customer: 'Macmiilka',
    journey: 'Safarka',
    payment: 'Lacag bixinta',
    allStatus: 'Dhammaan Xaaladaha',
    completed: 'La dhammeeyey',
    searchBookings: 'Raadi dalabyada...',
    allBookings: 'Dhammaan Dalabyada',
    
    // User Management
    userName: 'Magaca Isticmaalaha',
    userEmail: 'Emailka Isticmaalaha',
    userPhone: 'Telefoonka Isticmaalaha',
    userRole: 'Doorka Isticmaalaha',
    lastActive: 'Markii ugu dambeysay ee Firfircoonaa',
    accountStatus: 'Xaalada Xisaabta',
    
    // Analytics
    dailyStats: 'Tirakoobka Maalinlaha',
    weeklyStats: 'Tirakoobka Todobaadlaha',
    monthlyStats: 'Tirakoobka Bishii',
    yearlyStats: 'Tirakoobka Sanadka',
    averageBookings: 'Celceliska Dalabyada',
    popularRoutes: 'Waddooyinka ugu Caansan',
    busUtilization: 'Isticmaalka Basaska',

    // Common Actions
    edit: 'Wax ka bedel',
    delete: 'Tirtir',
    save: 'Kaydi',
    confirm: 'Xaqiiji',
    back: 'Dib u noqo',
    next: 'Xiga',
    about: 'Nagu Saabsan',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translate = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 