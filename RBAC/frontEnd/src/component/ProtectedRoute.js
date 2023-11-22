import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const auth = localStorage.getItem('user');
  return auth ? <Navigate to="/" /> : <Navigate to="/signup" />;
};

export default ProtectedRoute;
