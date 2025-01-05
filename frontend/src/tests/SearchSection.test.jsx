import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import SearchSection from './../pages/MainPage/components/SearchSection/SearchSection';

describe('SearchSection', () => {
    const mockOnSearch = vi.fn();
    const mockEquipmentTypes = [
        "Narty zjazdowe",
        "Rower górski",
        "Rower miejski",
        "Kask narciarski",
        "Kijki trekkingowe"
    ];

    test('renders SearchSection with input and button', () => {
        render(<SearchSection onSearch={mockOnSearch} />);

        expect(screen.getByPlaceholderText('Wyszukaj sprzęt')).toBeInTheDocument();
        expect(screen.getByText('Wyszukaj')).toBeInTheDocument();
    });

    test('calls onSearch with input value when search button is clicked', () => {
        render(<SearchSection onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });
        fireEvent.click(screen.getByText('Wyszukaj'));

        expect(mockOnSearch).toHaveBeenCalledWith('rower');
    });

    test('calls onSearch with input value when Enter key is pressed', () => {
        render(<SearchSection onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockOnSearch).toHaveBeenCalledWith('rower');
    });

    test('displays suggestions based on input value', () => {
        render(
            <SearchSection 
                onSearch={mockOnSearch} 
                equipmentTypes={mockEquipmentTypes}
            />
        );

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });

        expect(screen.getByText('Rower górski')).toBeInTheDocument();
        expect(screen.getByText('Rower miejski')).toBeInTheDocument();
    });

    test('calls onSearch with suggestion value when suggestion is clicked', () => {
        render(
            <SearchSection 
                onSearch={mockOnSearch} 
                equipmentTypes={mockEquipmentTypes}
            />
        );

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });

        const suggestion = screen.getByText('Rower miejski');
        fireEvent.click(suggestion);

        expect(mockOnSearch).toHaveBeenCalledWith('Rower miejski');
    });
    
    test('should call onSearch when search button is clicked', () => {
        const onSearch = vi.fn();
        render(<SearchSection onSearch={onSearch} />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        const searchButton = screen.getByText('Wyszukaj');

        fireEvent.change(input, { target: { value: 'narty' } });
        fireEvent.click(searchButton);

        expect(onSearch).toHaveBeenCalledWith('narty');
    });

    test('should clear search when input is cleared', () => {
        const onSearch = vi.fn();
        render(<SearchSection onSearch={onSearch} searchValue="narty" />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        
        fireEvent.change(input, { target: { value: '' } });

        expect(onSearch).toHaveBeenCalledWith('');
    });
});