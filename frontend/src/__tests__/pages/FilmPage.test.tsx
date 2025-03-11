import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FilmPage from '../../pages/FilmPage';
import { getFilm } from '../../services/apiService';
import { mockFilmDetail } from '../mocks/data';
import '@testing-library/jest-dom';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  getFilm: jest.fn(),
}));

describe('FilmPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator while fetching film data', () => {
    (getFilm as jest.Mock).mockImplementation(() => new Promise(() => { }));

    render(
      <MemoryRouter initialEntries={['/films/1']}>
        <FilmPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays film details after a successful API call', async () => {
    (getFilm as jest.Mock).mockResolvedValue(mockFilmDetail);

    render(
      <MemoryRouter initialEntries={['/films/1']}>
        <FilmPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockFilmDetail.title)).toBeInTheDocument();
    });

    expect(screen.getByText(mockFilmDetail.openingCrawl)).toBeInTheDocument();
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('shows an error message when the film fetch fails', async () => {
    const errorMessage = 'Failed to fetch film';
    (getFilm as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter initialEntries={['/films/1']}>
        <FilmPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('renders clickable character links with proper labels and URLs', async () => {
    (getFilm as jest.Mock).mockResolvedValue(mockFilmDetail);

    render(
      <MemoryRouter initialEntries={['/films/1']}>
        <FilmPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const charactersSection = screen.getByText('Characters').closest('div');
      const links = charactersSection!.querySelectorAll('a');

      expect(links[0]).toHaveTextContent(mockFilmDetail.characters[0].name);
      expect(links[0]).toHaveAttribute('href', '/people/1');
      expect(links[1]).toHaveTextContent(mockFilmDetail.characters[1].name);
      expect(links[1]).toHaveAttribute('href', '/people/2');

      const commaSeparators = charactersSection!.textContent?.match(/,/g) || [];
      expect(commaSeparators.length).toBe(mockFilmDetail.characters.length - 1);
    });
  });

  it('navigates back to the home page when the back button is clicked', async () => {
    (getFilm as jest.Mock).mockResolvedValue(mockFilmDetail);

    render(
      <MemoryRouter initialEntries={['/films/1']}>
        <FilmPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /BACK TO SEARCH/i });
      const link = backButton.closest('a');
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
