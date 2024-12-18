export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    
    if (Date.now() >= expirationTime) {
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Błąd podczas walidacji tokena:', error);
    removeToken();
    return false;
  }
};

export const handleLogout = () => {
  removeToken();
  localStorage.removeItem('user');
};
