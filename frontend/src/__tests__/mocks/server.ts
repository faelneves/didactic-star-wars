import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type {
  SWAPIResource,
  SearchResult,
  Person,
  Film,
  SWAPIResponse
} from '../../services/apiTypes';
import { VITE_SW_API_BASE } from '../../constants';

jest.mock('../../constants', () => ({
  VITE_SW_API_BASE: "http://localhost:8000/api/v1"
}));

const API_BASE = VITE_SW_API_BASE || 'http://localhost:8000/api/v1';

export const mockPersonSearchResult: SearchResult = {
  id: 1,
  name: 'Luke Skywalker'
};

export const mockFilmSearchResult: SearchResult = {
  id: 1,
  title: 'A New Hope'
};

export const mockPersonDetail: Person = {
  id: 1,
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  species: [1],
  filmsIds: [1, 2, 3],
  films: [
    { id: 1, title: 'A New Hope' },
    { id: 2, title: 'The Empire Strikes Back' }
  ],
  vehicles: [14, 30],
  starships: [12, 22]
};

export const mockFilmDetail: Film = {
  id: 1,
  title: 'A New Hope',
  episodeId: 4,
  openingCrawl: 'It is a period of civil war...',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  releaseDate: '1977-05-25',
  characterIds: [1, 2, 3],
  characters: [
    { id: 1, name: 'Luke Skywalker' },
    { id: 2, name: 'Darth Vader' }
  ],
  planetIds: [1, 2, 3],
  starshipIds: [2, 3, 5],
  vehicleIds: [4, 6, 7],
  speciesIds: [1, 2]
};

const handlers = [
  http.get(`${API_BASE}/:resource/search`, ({ request, params }) => {
    const resource = params.resource as SWAPIResource;
    const url = new URL(request.url);
    const query = url.searchParams.get('filter');

    if (query === 'error') {
      return new HttpResponse(null, { status: 500 });
    }

    const response: SWAPIResponse = {
      results: resource === 'people'
        ? [mockPersonSearchResult]
        : [mockFilmSearchResult]
    };

    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE}/people/:id`, ({ params }) => {
    const { id } = params;
    return id === '1'
      ? HttpResponse.json(mockPersonDetail)
      : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_BASE}/films/:id`, ({ params }) => {
    const { id } = params;
    return id === '1'
      ? HttpResponse.json(mockFilmDetail)
      : new HttpResponse(null, { status: 404 });
  })
];

export const server = setupServer(...handlers);