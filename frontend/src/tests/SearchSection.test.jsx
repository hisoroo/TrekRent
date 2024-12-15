import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import SearchSection from './../pages/MainPage/components/SearchSection/SearchSection';
import equipmentData from '././../utils/equipmentData.json';

describe('SearchSection', () => {
    const mockOnSearch = vi.fn();

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
        render(<SearchSection onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });

        const suggestions = equipmentData.filter(item =>
            item.name.toLowerCase().includes('rower')
        );

        suggestions.forEach(suggestion => {
            expect(screen.getByText(suggestion.name)).toBeInTheDocument();
        });
    });

    test('calls onSearch with suggestion value when suggestion is clicked', () => {
        render(<SearchSection onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });

        const suggestion = screen.getByText('Rower miejski');
        fireEvent.click(suggestion);

        expect(mockOnSearch).toHaveBeenCalledWith('Rower miejski');
    });

    test('clears input and suggestions when clear button is clicked', () => {
        render(<SearchSection onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Wyszukaj sprzęt');
        fireEvent.change(input, { target: { value: 'rower' } });

        const clearButton = screen.getByText('×');
        fireEvent.click(clearButton);

        expect(input.value).toBe('');
        expect(screen.queryByText('Rower miejski')).not.toBeInTheDocument();
        expect(mockOnSearch).toHaveBeenCalledWith('');
    });
});