import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../../pages/SearchPage';
import { searchSWAPI } from '../../services/apiService';
import '@testing-library/jest-dom';

jest.mock('../../services/apiService', () => ({
  searchSWAPI: jest.fn(),
}));

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search form with initial state', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett')).toBeInTheDocument();
    expect(screen.getByText('SEARCH')).toBeDisabled();
    expect(screen.getByLabelText('People')).toBeChecked();
    expect(screen.getByLabelText('Movies')).not.toBeChecked();
  });

  it('enables the search button when input has text', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett');
    const button = screen.getByText('SEARCH');

    fireEvent.change(input, { target: { value: 'Luke' } });
    expect(button).not.toBeDisabled();
  });

  it('shows loading message while searching', async () => {
    (searchSWAPI as jest.Mock).mockImplementation(() => new Promise(() => { }));

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), { target: { value: 'Yoda' } });
    fireEvent.click(screen.getByText('SEARCH'));

    expect(screen.getByText('SEARCHING...')).toBeInTheDocument();
  });

  it('displays results when search is successful', async () => {
    const mockResults = [
      { id: 1, name: 'Luke Skywalker' },
      { id: 2, name: 'Darth Vader' },
    ];
    (searchSWAPI as jest.Mock).mockResolvedValue(mockResults);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), { target: { value: 'Luke' } });
    fireEvent.click(screen.getByText('SEARCH'));

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByText('Darth Vader')).toBeInTheDocument();
    });
  });

  it('shows an error message when search fails', async () => {
    (searchSWAPI as jest.Mock).mockRejectedValue(new Error('Failed to fetch data'));

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), { target: { value: 'Leia' } });
    fireEvent.click(screen.getByText('SEARCH'));

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch data')).toBeInTheDocument();
    });
  });
});
