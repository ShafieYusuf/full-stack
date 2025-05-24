import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastCheck, setLastCheck] = useState(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const checkAuth = useCallback(async () => {
    const now = Date.now();
    // Return if last check was less than 5 minutes ago
    if (now - lastCheck < CACHE_DURATION) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setUser(data.user);
      setLastCheck(now);
    } catch (err) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [lastCheck]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      const userData = data.user;
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLastCheck(0);
  };

  const checkTokenExpiry = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return;
    }

    // Only check auth if cache is expired
    const now = Date.now();
    if (now - lastCheck >= CACHE_DURATION) {
      checkAuth();
    }
  }, [checkAuth, lastCheck]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuth,
    checkTokenExpiry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 