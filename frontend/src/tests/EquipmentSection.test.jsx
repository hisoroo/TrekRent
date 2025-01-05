import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import EquipmentSection from './../pages/MainPage/components/EquipmentSection/EquipmentSection';
import { BrowserRouter } from 'react-router-dom';

describe('EquipmentSection', () => {
    const mockEquipment = [
        {
            id: 1,
            image_path: "/bike-svgrepo-com.svg",
            name: "Rower miejski",
            price: 20,
            description: "Test description"
        }
    ];

    test('renders EquipmentSection with equipment items', () => {
        render(
            <BrowserRouter>
                <EquipmentSection equipment={mockEquipment} />
            </BrowserRouter>
        );

        expect(screen.getByText('Rower miejski')).toBeInTheDocument();
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

    test('handles empty equipment list gracefully', () => {
        render(
            <BrowserRouter>
                <EquipmentSection equipment={[]} />
            </BrowserRouter>
        );

        expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });
});