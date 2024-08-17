import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('App Component', () => {
    test('renders input and buttons correctly', () => {
        render(<App />);
        expect(screen.getByPlaceholderText("Enter URL")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add url/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /fetch metadata/i })).toBeInTheDocument();
    });

    test('input validation for URL format', () => {
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText("Enter URL"), { target: { value: 'badurl' } });
        fireEvent.click(screen.getByRole('button', { name: /add url/i }));
        expect(screen.getByText(/enter a valid url that starts with http:\/\/ or https:\/\/./i)).toBeInTheDocument();
    });

    test('displays metadata correctly after fetch', async () => {
        const mockData = {
            data: [
                { url: 'https://example.com', title: 'Example Domain', description: 'This is an example', image: 'example.jpg', error: null }
            ]
        };
        axios.post.mockResolvedValue(mockData);
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /fetch metadata/i }));
        await waitFor(() => {
            expect(screen.getByText('Example Domain')).toBeInTheDocument();
            expect(screen.getByText('This is an example')).toBeInTheDocument();
            expect(screen.getByRole('img', { name: /example domain/i })).toBeInTheDocument();
        });
    });

    test('error handling for server failure', async () => {
        axios.post.mockRejectedValue(new Error('Failed to fetch metadata'));
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /fetch metadata/i }));
        await waitFor(() => {
            expect(screen.getByText('Failed to fetch metadata')).toBeInTheDocument();
        });
    });

    test('restricts adding more than three URLs', () => {
        render(<App />);
        const input = screen.getByPlaceholderText("Enter URL");
        for (let i = 0; i < 4; i++) {
            fireEvent.change(input, { target: { value: `https://example${i}.com` } });
            fireEvent.click(screen.getByRole('button', { name: /add url/i }));
        }
        expect(screen.getAllByText(/https:\/\/example/i).length).toBe(3);
    });
});
