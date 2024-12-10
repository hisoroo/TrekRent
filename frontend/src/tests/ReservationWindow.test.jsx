import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ReservationWindow from './../pages/ProductPage/components/ReservationWindow/ReservationWindow';

describe('ReservationWindow', () => {
    const mockOnReserve = vi.fn();

    test('renders ReservationWindow with initial state', () => {
        render(<ReservationWindow price={100} onReserve={mockOnReserve} />);

        expect(screen.getByText('Wypożycz produkt')).toBeInTheDocument();
        expect(screen.getByText('Cena: 100 zł/za dobę')).toBeInTheDocument();
    });

    test('handles date changes and calculates total cost', () => {
        render(<ReservationWindow price={100} onReserve={mockOnReserve} />);

        const startDateInput = screen.getByLabelText('Data wypożyczenia:');
        const endDateInput = screen.getByLabelText('Data zwrotu:');

        fireEvent.change(startDateInput, { target: { value: '2024-03-20' } });
        fireEvent.change(endDateInput, { target: { value: '2024-03-23' } });

        expect(screen.getByText('Całkowity koszt: 300 zł')).toBeInTheDocument();
    });

    test('handles reservation submission', () => {
        render(<ReservationWindow price={100} onReserve={mockOnReserve} />);

        fireEvent.click(screen.getByText('ZAREZERWUJ'));

        expect(mockOnReserve).toHaveBeenCalled();
    });
});