export const saveToCart = (item) => {
    const timestamp = new Date().getTime();
    const cartData = {
      items: [item],
      timestamp: timestamp,
      expiresIn: 5 * 60 * 1000 // 5 minut
    };
    
    try {
      const currentCart = getCart()?.items || [];
      cartData.items = [...currentCart, item];
      localStorage.setItem('cart', JSON.stringify(cartData));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error('Błąd podczas zapisywania do koszyka:', error);
    }
  };
  
  export const getCart = () => {
    try {
      const cartData = localStorage.getItem('cart');
      if (!cartData) return null;
  
      const cart = JSON.parse(cartData);
      const currentTime = new Date().getTime();
  
      if (currentTime - cart.timestamp > cart.expiresIn) {
        localStorage.removeItem('cart');
        return null;
      }
  
      return cart;
    } catch (error) {
      console.error('Błąd podczas pobierania koszyka:', error);
      return null;
    }
  };