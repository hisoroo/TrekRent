import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ProductPage from './../pages/ProductPage/ProductPage';
import { BrowserRouter } from 'react-router-dom';
import equipmentData from '././../utils/equipmentData.json';

describe('ProductPage', () => {
    const mockProductData = equipmentData[0];

    test('renders ProductPage with product details and reservation window', () => {
        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        waitFor(() => {
            expect(screen.getByText(mockProductData.name)).toBeInTheDocument();
            expect(screen.getByText(`Cena: ${mockProductData.price} zł/za dobę`)).toBeInTheDocument();
            expect(screen.getByText('Wypożycz produkt')).toBeInTheDocument();
        })
    });

    test('handles reservation submission', () => {
        const mockOnReserve = vi.fn();
        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ZAREZERWUJ'));

        waitFor(() => {
            expect(mockOnReserve).toHaveBeenCalled();
        })
    });

    test('displays reservation modal on successful reservation', () => {
        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ZAREZERWUJ'));

        expect(screen.getByText('Sprzęt został dodany do koszyka! 🥳')).toBeInTheDocument();
    });

    test('closes reservation modal when close button is clicked', () => {
        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ZAREZERWUJ'));
        fireEvent.click(screen.getByText('×'));

        expect(screen.queryByText('Sprzęt został dodany do koszyka! 🥳')).not.toBeInTheDocument();
    });

    test('navigates to cart when "Przejdź do koszyka" button is clicked', () => {
        const mockNavigate = vi.fn();
        render(
            <BrowserRouter>
                <ProductPage navigate={mockNavigate} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ZAREZERWUJ'));
        fireEvent.click(screen.getByText('Przejdź do koszyka'));

        waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/cart');
        });
    });

    test('continues browsing when "Wróć do przeglądania katalogu" button is clicked', () => {
        render(
            <BrowserRouter>
                <ProductPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ZAREZERWUJ'));
        fireEvent.click(screen.getByText('Wróć do przeglądania katalogu'));

        waitFor(() => {
            expect(screen.getByText(mockProductData.name)).toBeInTheDocument();
        });
    });
});