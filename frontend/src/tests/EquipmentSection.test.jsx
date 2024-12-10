import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import EquipmentSection from './../pages/MainPage/components/EquipmentSection/EquipmentSection';
import { BrowserRouter } from 'react-router-dom';

describe('EquipmentSection', () => {
    const mockEquipment = [
        {
            id: 1,
            image: '/bike-svgrepo-com.svg',
            name: 'Rower miejski',
            price: 20
        },
        {
            id: 2,
            image: '/bike-svgrepo-com.svg',
            name: 'Rower górski',
            price: 30
        }
    ];

    test('renders EquipmentSection with equipment items', () => {
        render(
            <BrowserRouter>
                <EquipmentSection equipment={mockEquipment} />
            </BrowserRouter>
        );

        expect(screen.getByText('Rower miejski')).toBeInTheDocument();
        expect(screen.getByText('Rower górski')).toBeInTheDocument();
        expect(screen.getByText('Cena: 20 zł/dzień')).toBeInTheDocument();
        expect(screen.getByText('Cena: 30 zł/dzień')).toBeInTheDocument();
    });

    test('renders correct number of EquipmentCard components', () => {
        render(
            <BrowserRouter>
                <EquipmentSection equipment={mockEquipment} />
            </BrowserRouter>
        );

        const equipmentCards = screen.getAllByRole('heading', { level: 2 });
        expect(equipmentCards).toHaveLength(mockEquipment.length);
    });

    test('renders EquipmentCard components with correct props', () => {
        render(
            <BrowserRouter>
                <EquipmentSection equipment={mockEquipment} />
            </BrowserRouter>
        );

        mockEquipment.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
            expect(screen.getByText(`Cena: ${item.price} zł/dzień`)).toBeInTheDocument();
            expect(screen.getByAltText(item.name)).toHaveAttribute('src', item.image);
        });
    });

    test('handles empty equipment list gracefully', () => {
        render(
            <BrowserRouter>
                <EquipmentSection equipment={[]} />
            </BrowserRouter>
        );

        expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });
});