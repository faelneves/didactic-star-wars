import { Film, Person, SearchResult, SWAPIResource, SWAPIResponse } from './apiTypes';
import { cache } from '../utils/cache';


const API_BASE = process.env.REACT_APP_SW_API_BASE || 'http://localhost:8000/api/v1';

export const searchSWAPI = async (resource: SWAPIResource, query: string): Promise<SearchResult[]> => {
  const url = `${API_BASE}/${resource}/search?filter=${encodeURIComponent(query)}`;

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
  const url = `${API_BASE}/people/${id}`;

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
  const url = `${API_BASE}/films/${id}`;

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