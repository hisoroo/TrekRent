import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ReservationModal from './../pages/ProductPage/components/ReservationModal/ReservationModal';

describe('ReservationModal', () => {
    const mockOnClose = vi.fn();
    const mockOnGoToCart = vi.fn();
    const mockOnContinueBrowsing = vi.fn();

    const defaultProps = {
        show: true,
        onClose: mockOnClose,
        onGoToCart: mockOnGoToCart,
        onContinueBrowsing: mockOnContinueBrowsing,
        productImage: '/test-image.jpg',
        productName: 'Test Product',
        startDate: '2024-03-20',
        endDate: '2024-03-23',
        totalCost: 300
    };

    test('renders ReservationModal with product details', () => {
        render(<ReservationModal {...defaultProps} />);

        expect(screen.getByText('Sprzęt został dodany do koszyka! 🥳')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('20.03.2024 - 23.03.2024')).toBeInTheDocument();
        expect(screen.getByText('Całkowity koszt: 300 zł')).toBeInTheDocument();
    });

    test('handles close button click', () => {
        render(<ReservationModal {...defaultProps} />);

        fireEvent.click(screen.getByText('×'));

        expect(mockOnClose).toHaveBeenCalled();
    });

    test('handles go to cart button click', () => {
        render(<ReservationModal {...defaultProps} />);

        fireEvent.click(screen.getByText('Przejdź do koszyka'));

        expect(mockOnGoToCart).toHaveBeenCalled();
    });

    test('handles continue browsing button click', () => {
        render(<ReservationModal {...defaultProps} />);

        fireEvent.click(screen.getByText('Wróć do przeglądania katalogu'));

        expect(mockOnContinueBrowsing).toHaveBeenCalled();
    });
});