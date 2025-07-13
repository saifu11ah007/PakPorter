import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  const isTokenValid = token && tokenTimestamp && Date.now() - parseInt(tokenTimestamp, 10) < 5 * 60 * 1000;

  return isTokenValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;