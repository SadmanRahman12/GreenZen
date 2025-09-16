import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const setAuthToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/user/settings', {
            headers: {
              'x-auth-token': token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error('Failed to fetch user data in UserContext');
            setUserData(null);
            setAuthToken(null); // Clear token if invalid
          }
        } catch (error) {
          console.error('Error fetching user data in UserContext:', error);
          setUserData(null);
          setAuthToken(null); // Clear token on error
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [token]);

  const updateUser = (newUserData) => {
    setUserData(newUserData);
  };

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <UserContext.Provider value={{ userData, loading, updateUser, setUserData, setAuthToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};
