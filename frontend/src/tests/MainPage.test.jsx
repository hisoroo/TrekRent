import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import MainPage from './../pages/MainPage/MainPage';
import { BrowserRouter } from 'react-router-dom';
import equipmentData from '././../utils/equipmentData.json';

describe('MainPage', () => {
    test('renders MainPage with Header, SearchSection, and EquipmentSection', () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );

        expect(screen.getByText('TrekRent')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Wyszukaj sprzęt')).toBeInTheDocument();
        equipmentData.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
        });
    });

    test('filters equipment based on search term', () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'Rower miejski' } });
        fireEvent.click(screen.getByText('Wyszukaj'));

        waitFor(() => {
            expect(screen.getByText('Rower miejski')).toBeInTheDocument();
        equipmentData
            .filter(item => item.name !== 'Rower miejski')
            .forEach(item => {
                expect(screen.queryByText(item.name)).not.toBeInTheDocument();
            });
        });
    });

    test('displays all equipment when search term is cleared', () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'Rower miejski' } });
        fireEvent.click(screen.getByText('Wyszukaj'));

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(screen.getByText('Wyszukaj'));

        equipmentData.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
        });
    });

    test('displays suggestions based on input value', () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });

        const suggestions = equipmentData.filter(item =>
            item.name.toLowerCase().includes('rower')
        );

        waitFor(() => {
            suggestions.forEach(suggestion => {
                expect(screen.getByText(suggestion.name)).toBeInTheDocument();
            });
        });
    });
});