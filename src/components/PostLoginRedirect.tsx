
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const PostLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Only redirect if user just logged in and is on the landing page
    if (user && location.pathname === '/') {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem('postLoginRedirect');
      if (redirectPath) {
        sessionStorage.removeItem('postLoginRedirect');
        navigate(redirectPath);
      } else {
        // Default redirect to debates page
        navigate('/debates');
      }
    }
  }, [user, location.pathname, navigate]);

  return null;
};
