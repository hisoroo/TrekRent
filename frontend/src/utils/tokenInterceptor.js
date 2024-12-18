import { toast } from 'react-toastify';

export const checkTokenExpiration = async (navigate) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      if (Date.now() >= expiry) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        return new Promise((resolve) => {
          toast.warning('Twoja sesja wygasła. Zaloguj się ponownie.', {
            position: "top-center",
            autoClose: 3000,
            onClose: () => {
              navigate('/login', { replace: true });
              resolve(true);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  }
  return false;
};
