import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const Layout = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/dashboard/profile') || location.pathname.startsWith('/dashboard/settings');

  return (
    <>
      <Header />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;