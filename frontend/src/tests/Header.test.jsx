import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Header from './../pages/MainPage/components/Header/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders Header with logo, title, and cart button', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByAltText('logo')).toBeInTheDocument();
        expect(screen.getByText('TrekRent')).toBeInTheDocument();
        expect(screen.getByAltText('cart')).toBeInTheDocument();
    });

    test('renders cart counter when there are items in the cart', () => {
        localStorage.setItem('cart', JSON.stringify({ items: [{ id: 1 }, { id: 2 }] }));
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('does not render cart counter when cart is empty', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    test('updates cart counter when cart is updated', async () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.queryByText('1')).not.toBeInTheDocument();

        localStorage.setItem('cart', JSON.stringify({ items: [{ id: 1 }] }));
        window.dispatchEvent(new Event('cartUpdated'));

        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    test('handles localStorage errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('LocalStorage error');
        });

        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(consoleSpy).toHaveBeenCalledWith('Błąd podczas aktualizacji licznika koszyka:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});