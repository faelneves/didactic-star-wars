import type {
  SearchResult,
  Person,
  Film,
} from '../../services/apiTypes';


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
