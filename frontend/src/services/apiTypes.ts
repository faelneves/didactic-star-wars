export type SWAPIResource = 'people' | 'films';

export interface SearchResult {
  id: number;
  name?: string;
  title?: string;
}

export interface PersonDetail {
  id: number,
  name: string
}

export interface FilmDetail {
  id: number,
  title: string
}

export interface Person {
  id: number,
  name: string,
  height: string,
  mass: string,
  hair_color: string,
  skin_color: string,
  eye_color: string,
  birth_year: string,
  gender: string,
  species: number[],
  filmsIds: number[],
  films: FilmDetail[],
  vehicles: number[],
  starships: number[]
}

export interface Film {
  id: number,
  title: string,
  episodeId: number,
  openingCrawl: string,
  director: string,
  producer: string,
  releaseDate: string,
  characterIds: number[],
  characters: PersonDetail[],
  planetIds: number[],
  starshipIds: number[],
  vehicleIds: number[],
  speciesIds: number[],
}

export interface SWAPIResponse {
  results: SearchResult[];
}