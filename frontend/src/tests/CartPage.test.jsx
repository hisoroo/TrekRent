import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CartPage from '../pages/CartPage/CartPage';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('CartPage', () => {
    const mockCartItems = [
        {
            id: 1,
            name: 'Test Item 1',
            image: 'test1.jpg',
            timestamp: '2024-01-01',
            startDate: '2024-03-20',
            endDate: '2024-03-23', 
            totalCost: 150
        },
        {
            id: 2,
            name: 'Test Item 2',
            image: 'test2.jpg',
            timestamp: '2024-01-02',
            startDate: '2024-03-24',
            endDate: '2024-03-26',
            totalCost: 200
        }
    ];

    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(Storage.prototype, 'getItem');
        vi.spyOn(Storage.prototype, 'setItem');
    });

    test('renders empty cart message when cart is empty', () => {
        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );
        expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument();
    });

    test('removes item from cart when remove button is clicked', async () => {
        localStorage.setItem('cart', JSON.stringify({ items: mockCartItems }));
        
        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );

        const removeButtons = screen.getAllByTitle('Usuń z koszyka');
        fireEvent.click(removeButtons[0]);

        const updatedCart = JSON.parse(localStorage.getItem('cart'));
        expect(updatedCart.items).toHaveLength(1);
        expect(updatedCart.items[0].name).toBe('Test Item 2');
    });

    test('should remove item from cart', () => {
        const cartItems = {
            items: [{
                id: 1,
                name: 'Narty',
                timestamp: '2024-01-01T12:00:00Z'
            }]
        };
        localStorage.setItem('cart', JSON.stringify(cartItems));

        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );

        const removeButton = screen.getByRole('button', { name: /usuń/i });
        fireEvent.click(removeButton);

        const cart = JSON.parse(localStorage.getItem('cart'));
        expect(cart.items).toHaveLength(0);
    });

    test('handles localStorage errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        Storage.prototype.getItem.mockImplementationOnce(() => {
            throw new Error('LocalStorage error');
        });

        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument();
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});