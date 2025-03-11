import { server } from '../mocks/server';
import {
  mockPersonSearchResult,
  mockFilmSearchResult,
  mockPersonDetail,
  mockFilmDetail
} from '../mocks/server';
import {
  searchSWAPI,
  getPerson,
  getFilm
} from '../../services/apiService';
import { cache } from '../../utils/cache';
import { VITE_SW_API_BASE } from '../../constants';

jest.mock('../../constants', () => ({
  VITE_SW_API_BASE: "http://localhost:8000/api/v1"
}));

const API_BASE = VITE_SW_API_BASE || 'http://localhost:8000/api/v1';

beforeAll(() => server.listen());
beforeEach(() => cache.clear());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Service', () => {
  describe('searchSWAPI', () => {
    it('should search people successfully', async () => {
      const results = await searchSWAPI('people', 'skywalker');
      expect(results).toEqual([mockPersonSearchResult]);
    });

    it('should search films successfully', async () => {
      const results = await searchSWAPI('films', 'hope');
      expect(results).toEqual([mockFilmSearchResult]);
    });

    it('should return cached results for same query', async () => {
      const url = `${API_BASE}/people/search?filter=luke`;

      await searchSWAPI('people', 'luke');
      expect(cache.get(url)).toBeTruthy();

      const spy = jest.spyOn(cache, 'get');
      await searchSWAPI('people', 'luke');
      expect(spy).toHaveBeenCalledWith(url);
      spy.mockRestore();
    });

    it('should throw error on server failure', async () => {
      await expect(searchSWAPI('people', 'error'))
        .rejects
        .toThrow('Failed to search people with query error');
    });
  });

  describe('getPerson', () => {
    it('should fetch person details with valid ID', async () => {
      const person = await getPerson(1);
      expect(person).toEqual(mockPersonDetail);
    });

    it('should cache person details', async () => {
      const url = `${API_BASE}/people/1`;
      const setSpy = jest.spyOn(cache, 'set');

      await getPerson(1);

      expect(setSpy).toHaveBeenCalledWith(url, mockPersonDetail);
      expect(cache.get(url)).toEqual(mockPersonDetail);
      setSpy.mockRestore();
    });

    it('should use cached data when available', async () => {
      const url = `${API_BASE}/people/1`;
      cache.set(url, mockPersonDetail);
      const getSpy = jest.spyOn(cache, 'get');

      await getPerson(1);

      expect(getSpy).toHaveBeenCalledWith(url);
      getSpy.mockRestore();
    });
  });

  describe('getFilm', () => {
    it('should fetch film details with valid ID', async () => {
      const film = await getFilm(1);
      expect(film).toEqual(mockFilmDetail);
    });

    it('should cache film details', async () => {
      const url = `${API_BASE}/films/1`;
      const setSpy = jest.spyOn(cache, 'set');

      await getFilm(1);

      expect(setSpy).toHaveBeenCalledWith(url, mockFilmDetail);
      expect(cache.get(url)).toEqual(mockFilmDetail);
      setSpy.mockRestore();
    });
  });

  describe('Cache Integration', () => {
    it('should not cache error responses', async () => {
      const url = `${API_BASE}/people/search?filter=error`;
      const setSpy = jest.spyOn(cache, 'set');

      await expect(searchSWAPI('people', 'error'))
        .rejects
        .toThrow('Failed to search people with query error');

      expect(setSpy).not.toHaveBeenCalled();
      expect(cache.get(url)).toBeUndefined();

      setSpy.mockRestore();
    });
  });
});