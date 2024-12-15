import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ProductCard from './../pages/ProductPage/components/ProductCard/ProductCard';

describe('ProductCard', () => {
    const mockItem = {
        image: '/test-image.jpg',
        name: 'Test Product',
        description: 'Test description'
    };

    test('renders ProductCard with item details', () => {
        render(<ProductCard {...mockItem} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    test('handles missing image gracefully', () => {
        const itemWithoutImage = { ...mockItem, image: undefined };
        render(<ProductCard {...itemWithoutImage} />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Test Product');
    });
});