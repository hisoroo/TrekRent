import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CartPage from '../pages/CartPage/CartPage';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

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