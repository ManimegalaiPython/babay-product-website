import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const token      = localStorage.getItem('access');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login — sends username to Django JWT
  // Django JWT requires 'username' field, NOT email
  // But our CustomTokenSerializer supports email too
const login = async (usernameOrEmail, password) => {
  try {
    const { data } = await apiLogin(usernameOrEmail, password);

    localStorage.setItem('access',  data.access);
    localStorage.setItem('refresh', data.refresh);

    const userData = {
      username: data.username,  // ✅ use username from API
      email: data.email,
      id: data.user_id,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (err) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.non_field_errors?.[0] ||
      'Invalid username or password';
    throw new Error(msg);
  }
};

  // ✅ Register — sends username, email, password to Django
  const register = async (name, email, password) => {
    try {
      const { data } = await apiRegister({
        username: name,      // ✅ Django User model uses 'username'
        email:    email,
        password: password,
      });

      // ✅ Store tokens if returned
      if (data.access) {
        localStorage.setItem('access',  data.access);
        localStorage.setItem('refresh', data.refresh);
      }

      const userData = data.user || { username: name, email };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (err) {
      // ✅ Show exact error from Django
      const msg =
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.email?.[0]    ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.detail        ||
        'Registration failed. Please try again.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);