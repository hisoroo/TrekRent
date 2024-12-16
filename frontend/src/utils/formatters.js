export const formatPrice = (price) => {
  const numericPrice = typeof price === 'string' 
    ? price.replace(/[^\d,.-]/g, '').replace(',', '.')
    : price;
    
  if (numericPrice === null || numericPrice === undefined || isNaN(numericPrice)) {
    return '0';
  }
  return Number(numericPrice).toFixed(2).replace(/\.?0+$/, '');
};
