import { searchSWAPI, getPerson, getFilm } from '../../services/apiService';
import { cache } from '../../utils/cache';
import { VITE_SW_API_BASE } from '../../constants';
import fetchMock from 'jest-fetch-mock';
import {
  mockPersonSearchResult,
  mockFilmSearchResult,
  mockPersonDetail,
  mockFilmDetail
} from '../mocks/data';

fetchMock.enableMocks();

jest.mock('../../constants', () => ({
  VITE_SW_API_BASE: "http://localhost:8000/api/v1"
}));

beforeEach(() => {
  cache.clear();
  fetchMock.resetMocks();
});

describe('API Service', () => {
  describe('searchSWAPI', () => {
    it('should search people successfully', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({
        results: [mockPersonSearchResult]
      }));

      const results = await searchSWAPI('people', 'skywalker');
      expect(results).toEqual([mockPersonSearchResult]);
      expect(fetchMock).toHaveBeenCalledWith(
        `${VITE_SW_API_BASE}/people/search?filter=skywalker`
      );
    });

    it('should search films successfully', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({
        results: [mockFilmSearchResult]
      }));

      const results = await searchSWAPI('films', 'hope');
      expect(results).toEqual([mockFilmSearchResult]);
      expect(fetchMock).toHaveBeenCalledWith(
        `${VITE_SW_API_BASE}/films/search?filter=hope`
      );
    });

    it('should return cached results for same query', async () => {
      const url = `${VITE_SW_API_BASE}/people/search?filter=luke`;

      fetchMock.mockResponseOnce(JSON.stringify({ results: [mockPersonSearchResult] }));
      await searchSWAPI('people', 'luke');
      expect(cache.get(url)).toBeTruthy();

      await searchSWAPI('people', 'luke');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should throw error on server failure', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(searchSWAPI('people', 'error'))
        .rejects
        .toThrow('Failed to search people with query error');
    });
  });

  describe('getPerson', () => {
    it('should fetch person details with valid ID', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockPersonDetail));

      const person = await getPerson(1);
      expect(person).toEqual(mockPersonDetail);
      expect(fetchMock).toHaveBeenCalledWith(
        `${VITE_SW_API_BASE}/people/1`
      );
    });

    it('should cache person details', async () => {
      const url = `${VITE_SW_API_BASE}/people/1`;
      fetchMock.mockResponseOnce(JSON.stringify(mockPersonDetail));
      const setSpy = jest.spyOn(cache, 'set');

      await getPerson(1);

      expect(setSpy).toHaveBeenCalledWith(url, mockPersonDetail);
      expect(cache.get(url)).toEqual(mockPersonDetail);
      setSpy.mockRestore();
    });

    it('should use cached data when available', async () => {
      const url = `${VITE_SW_API_BASE}/people/1`;
      cache.set(url, mockPersonDetail);

      await getPerson(1);

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('getFilm', () => {
    it('should fetch film details with valid ID', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockFilmDetail));

      const film = await getFilm(1);
      expect(film).toEqual(mockFilmDetail);
      expect(fetchMock).toHaveBeenCalledWith(
        `${VITE_SW_API_BASE}/films/1`
      );
    });

    it('should cache film details', async () => {
      const url = `${VITE_SW_API_BASE}/films/1`;
      fetchMock.mockResponseOnce(JSON.stringify(mockFilmDetail));
      const setSpy = jest.spyOn(cache, 'set');

      await getFilm(1);

      expect(setSpy).toHaveBeenCalledWith(url, mockFilmDetail);
      expect(cache.get(url)).toEqual(mockFilmDetail);
      setSpy.mockRestore();
    });
  });

  describe('Cache Integration', () => {
    it('should not cache error responses', async () => {
      const url = `${VITE_SW_API_BASE}/people/search?filter=error`;
      fetchMock.mockResponseOnce('', { status: 500 });
      const setSpy = jest.spyOn(cache, 'set');

      await expect(searchSWAPI('people', 'error'))
        .rejects
        .toThrow('Failed to search people with query error');

      expect(setSpy).not.toHaveBeenCalled();
      expect(cache.get(url)).toBeUndefined();
      setSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 responses', async () => {
      fetchMock.mockResponseOnce('', { status: 404 });

      await expect(getPerson(999))
        .rejects
        .toThrow('Failed to fetch person with id 999');
    });
  });
});