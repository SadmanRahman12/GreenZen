import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../themes/themes.css';

const ThemeWrapper = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
};

export default ThemeWrapper;
