import { Film, Person, SearchResult, SWAPIResource, SWAPIResponse } from './apiTypes';
import { cache } from '../utils/cache';
import { VITE_SW_API_BASE } from '../constants';


export const searchSWAPI = async (resource: SWAPIResource, query: string): Promise<SearchResult[]> => {
  const url = `${VITE_SW_API_BASE}/${resource}/search?filter=${encodeURIComponent(query)}`;

  const cached = cache.get<SWAPIResponse>(url);
  if (cached) return cached.results;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search ${resource} with query ${query}`);
  }
  const data: SWAPIResponse = await response.json();

  cache.set(url, data);
  return data.results;
};

export const getPerson = async (id: number): Promise<Person> => {
  const url = `${VITE_SW_API_BASE}/people/${id}`;

  const cached = cache.get<Person>(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch person with id ${id}`);
  }
  const data: Person = await response.json();

  cache.set(url, data);
  return data;
};

export const getFilm = async (id: number): Promise<Film> => {
  const url = `${VITE_SW_API_BASE}/films/${id}`;

  const cached = cache.get<Film>(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch film with id ${id}`);
  }
  const data = await response.json();

  cache.set(url, data);
  return data;
};