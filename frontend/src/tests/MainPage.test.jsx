import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import MainPage from './../pages/MainPage/MainPage';
import { BrowserRouter } from 'react-router-dom';

describe('MainPage', () => {

    const equipmentData = [
        {
            "name": "Namiot dwuosobowy lekki",
            "price": "350.0",
            "description": "Lekki namiot turystyczny dla dwóch osób, łatwy w rozkładaniu.",
            "image_path": "https://placehold.co/600x400",
            "id": 1
        },
        {
            "name": "Namiot rodzinny 4-osobowy",
            "price": "600.0",
            "description": "Przestronny namiot dla rodziny lub grupy znajomych, odporny na deszcz i wiatr.",
            "image_path": "https://placehold.co/600x400",
            "id": 2
        },
        {
            "name": "Namiot trekkingowy z przedsionkiem",
            "price": "450.0",
            "description": "Namiot z dodatkową przestrzenią na bagaż, idealny na dłuższe wyprawy.",
            "image_path": "https://placehold.co/600x400",
            "id": 3
        },
        {
            "name": "Śpiwór letni lekki",
            "price": "120.0",
            "description": "Lekki, kompaktowy śpiwór przeznaczony na ciepłe noce.",
            "image_path": "https://placehold.co/600x400",
            "id": 4
        },
        {
            "name": "Śpiwór zimowy puchowy",
            "price": "500.0",
            "description": "Ciepły śpiwór puchowy, gwarantujący komfort nawet w niskich temperaturach.",
            "image_path": "https://placehold.co/600x400",
            "id": 5
        },
        {
            "name": "Karimata turystyczna",
            "price": "40.0",
            "description": "Klasyczna karimata zapewniająca izolację i podstawowy komfort snu.",
            "image_path": "https://placehold.co/600x400",
            "id": 6
        },
        {
            "name": "Mata samopompująca",
            "price": "180.0",
            "description": "Wygodna mata samopompująca, zapewniająca wysoki komfort.",
            "image_path": "https://placehold.co/600x400",
            "id": 7
        },
        {
            "name": "Plecak trekkingowy 30L",
            "price": "200.0",
            "description": "Lekki plecak z wentylowanym systemem nośnym, idealny na krótkie wycieczki.",
            "image_path": "https://placehold.co/600x400",
            "id": 8
        },
        {
            "name": "Plecak wyprawowy 60L",
            "price": "300.0",
            "description": "Duży plecak z wieloma kieszeniami i regulowanym systemem nośnym.",
            "image_path": "https://placehold.co/600x400",
            "id": 9
        },
        {
            "name": "Buty trekkingowe skórzane",
            "price": "350.0",
            "description": "Wytrzymałe buty trekkingowe z membraną, zapewniające stabilność i ochronę.",
            "image_path": "https://placehold.co/600x400",
            "id": 10
        },
    ];

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