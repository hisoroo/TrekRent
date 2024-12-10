import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import EquipmentCard from './../pages/MainPage/components/EquipmentCard/EquipmentCard';
import { BrowserRouter } from 'react-router-dom';

describe('EquipmentCard', () => {
    const mockItem = {
        id: 1,
        image: '/bike-svgrepo-com.svg',
        name: 'Rower miejski',
        price: 'Cena: 20 zł/dzień'
    };

    test('renders EquipmentCard with item details', () => {
        render(
            <BrowserRouter>
                <EquipmentCard {...mockItem} />
            </BrowserRouter>
        );

        expect(screen.getByText('Rower miejski')).toBeInTheDocument();
        expect(screen.getByAltText('Rower miejski')).toBeInTheDocument();
        expect(screen.getByText('Cena: 20 zł/dzień')).toBeInTheDocument();
        expect(screen.getByText('Wypożycz')).toBeInTheDocument();
    });

    test('renders link with correct href', () => {
        render(
            <BrowserRouter>
                <EquipmentCard {...mockItem} />
            </BrowserRouter>
        );

        expect(screen.getByText('Wypożycz')).toHaveAttribute('href', '/equipment/1');
    });

    test('handles missing image gracefully', () => {
        const itemWithoutImage = { ...mockItem, image: undefined };
        render(
            <BrowserRouter>
                <EquipmentCard {...itemWithoutImage} />
            </BrowserRouter>
        );

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Rower miejski');
    });
});