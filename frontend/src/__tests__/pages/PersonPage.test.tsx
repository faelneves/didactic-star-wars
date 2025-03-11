import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonPage from '../../pages/PersonPage';
import { getPerson } from '../../services/apiService';
import '@testing-library/jest-dom';
import { mockPersonDetail } from '../mocks/data';


jest.mock('../../services/apiService', () => ({
  getPerson: jest.fn(),
}));

describe('PersonPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays a loading indicator while fetching data', () => {
    (getPerson as jest.Mock).mockImplementation(() => new Promise(() => { }));

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an error message if fetching data fails', async () => {
    const errorMessage = 'Failed to fetch person';
    (getPerson as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('renders person details when data is successfully fetched', async () => {
    (getPerson as jest.Mock).mockResolvedValue(mockPersonDetail);

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockPersonDetail.name)).toBeInTheDocument();
    });

    expect(screen.getByText(`Birth Year: ${mockPersonDetail.birth_year}`)).toBeInTheDocument();
    expect(screen.getByText(`Gender: ${mockPersonDetail.gender}`)).toBeInTheDocument();
    expect(screen.getByText(`Eye Color: ${mockPersonDetail.eye_color}`)).toBeInTheDocument();
    expect(screen.getByText(`Hair Color: ${mockPersonDetail.hair_color}`)).toBeInTheDocument();
    expect(screen.getByText(`Height: ${mockPersonDetail.height}`)).toBeInTheDocument();
    expect(screen.getByText(`Mass: ${mockPersonDetail.mass}`)).toBeInTheDocument();
  });

  it('renders movie links correctly', async () => {
    (getPerson as jest.Mock).mockResolvedValue(mockPersonDetail);

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockPersonDetail.films[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockPersonDetail.films[1].title)).toBeInTheDocument();
    });

    const filmLink1 = screen.getByRole('link', { name: mockPersonDetail.films[0].title });
    expect(filmLink1).toHaveAttribute('href', `/films/${mockPersonDetail.films[0].id}`);

    const filmLink2 = screen.getByRole('link', { name: mockPersonDetail.films[1].title });
    expect(filmLink2).toHaveAttribute('href', `/films/${mockPersonDetail.films[1].id}`);
  });

  it('renders a back button that navigates to the home page', async () => {
    (getPerson as jest.Mock).mockResolvedValue(mockPersonDetail);

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /BACK TO SEARCH/i });
      const link = backButton.closest('a');
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
