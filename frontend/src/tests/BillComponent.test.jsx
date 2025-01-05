import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import BillComponent from './../pages/CartPage/components/BillComponent/BillComponent';
import '@testing-library/jest-dom';

describe('BillComponent', () => {
  const defaultProps = {
    startDate: '2024-03-20',
    endDate: '2024-03-23',
    productName: 'Rower górski',
    totalCost: 150.00
  };

  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  test('renders correctly with all elements present', () => {
    render(<BillComponent {...defaultProps} />);
    
    expect(screen.getByText('Podsumowanie zamówienia')).toBeInTheDocument();
    expect(screen.getByText('Data rozpoczęcia:')).toBeInTheDocument();
    expect(screen.getByText('Data zakończenia:')).toBeInTheDocument();
    expect(screen.getByText('Przedmiot:')).toBeInTheDocument();
    expect(screen.getByText('Łączna cena:')).toBeInTheDocument();
  });

  test('renderuje with minimal props', () => {
    render(<BillComponent />);
    expect(screen.getByText('Brak nazwy')).toBeInTheDocument();
  });

  test('formats dates correctly', () => {
    render(<BillComponent {...defaultProps} />);
    expect(screen.getByText('20.03.2024')).toBeInTheDocument();
    expect(screen.getByText('23.03.2024')).toBeInTheDocument();
  });

  test('handles invalid dates', () => {
    render(
      <BillComponent
        startDate="2024-01-01"
        endDate="invalid-date"
        productName="Test Product"
        totalCost={100}
      />
    );

    expect(screen.getByText(/Data rozpoczęcia:/i)).toBeInTheDocument();
    expect(mockConsoleError).toHaveBeenCalledWith('Nieprawidłowa data:', 'invalid-date');
  });

  test('handles lack of dates', () => {
    render(<BillComponent {...defaultProps} startDate={null} endDate={null} />);
    expect(screen.getAllByText('Brak daty')).toHaveLength(2);
  });

  test('correctly calculates the total cost', () => {
    render(<BillComponent {...defaultProps} />);
    expect(screen.getByText('150.00 zł')).toBeInTheDocument();
  });

  test('correctly calculates the number of days and price per day', () => {
    render(<BillComponent {...defaultProps} />);
    expect(screen.getByText('3 dni x 50.00 zł =')).toBeInTheDocument();
  });

  test('handles 1 day long reservation', () => {
    render(
      <BillComponent 
        {...defaultProps} 
        startDate="2024-03-20" 
        endDate="2024-03-20" 
        totalCost={50}
      />
    );
    expect(screen.getByText('1 dni x 50.00 zł =')).toBeInTheDocument();
  });
});