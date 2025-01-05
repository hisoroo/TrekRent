import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import Header from '../pages/MainPage/components/Header/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders cart counter when there are items in the cart', () => {
        localStorage.setItem('cart', JSON.stringify({ items: [{ id: 1 }, { id: 2 }] }));
        render(
            <BrowserRouter>
                <Header onSearch={() => {}} />
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
                <Header onSearch={() => {}} />
            </BrowserRouter>
        );

        expect(screen.queryByText('1')).not.toBeInTheDocument();

        await act(async () => {
            localStorage.setItem('cart', JSON.stringify({ items: [{ id: 1 }] }));
            window.dispatchEvent(new Event('cartUpdated'));
        });

        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });
});