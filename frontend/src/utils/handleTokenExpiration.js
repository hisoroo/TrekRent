import { toast } from 'react-toastify';

export const handleTokenExpiration = async (response, navigate) => {
  if (response.status === 401 || 
      (response.data && response.data.detail && response.data.detail.includes("expired"))) {
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
  return false;
};
