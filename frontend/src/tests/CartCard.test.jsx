import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import CartCard from '../pages/CartPage/components/CartCard/CartCard';
import '@testing-library/jest-dom';

describe('CartCard', () => {
    const mockItem = {
        id: 1,
        name: 'Test Item',
        image: 'test-image.jpg'
    };

    const mockOnRemove = vi.fn();

    test('renders CartCard with item details', () => {
        render(<CartCard item={mockItem} onRemove={mockOnRemove} />);

        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByAltText('Test Item')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    });

    test('calls onRemove when remove button is clicked', () => {
        render(<CartCard item={mockItem} onRemove={mockOnRemove} />);

        const removeButton = screen.getByTitle('Usuń z koszyka');
        fireEvent.click(removeButton);

        expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
    });

    test('has correct CSS classes', () => {
        render(<CartCard item={mockItem} onRemove={mockOnRemove} />);
        
        expect(screen.getByRole('heading')).toHaveClass('cart-card-name');
        expect(screen.getByRole('img')).toHaveClass('cart-card-image');
    });

    test('remove button has correct title attribute', () => {
        render(<CartCard item={mockItem} onRemove={mockOnRemove} />);

        expect(screen.getByTitle('Usuń z koszyka')).toBeInTheDocument();
    });

    test('handles missing image gracefully', () => {
        const itemWithoutImage = { ...mockItem, image: undefined };
        render(<CartCard item={itemWithoutImage} onRemove={mockOnRemove} />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Test Item');
    });
});