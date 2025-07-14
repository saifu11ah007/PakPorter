import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdminAuth = ({ children }) => {
  const adminLoggedIn = localStorage.getItem('adminLoggedIn');
  
  // If admin is not logged in, redirect to login page
  if (adminLoggedIn !== 'true') {
    return <Navigate to="/admin/login" replace />;
  }
  
  // If admin is logged in, render the protected component
  return children;
};

export default RequireAdminAuth;