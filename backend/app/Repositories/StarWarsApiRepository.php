<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Pool;
use App\DTO\FilmDTO;
use App\DTO\PersonDTO;
use App\Exceptions\ApiException;
use App\Exceptions\NotFoundException;
use App\Utils\UrlHelper;


class StarWarsApiRepository implements StarWarsRepositoryInterface
{

  protected string $baseUrl;
  protected int $cacheTtl;

  public function __construct()
  {
    $this->baseUrl = config('services.starwars.url');
    $this->cacheTtl = config('services.starwars.cache_ttl');
  }

  public function searchFilm(string $searchTerm): array
  {
    $cacheKey = 'film_search:' . $searchTerm;

    return Cache::remember($cacheKey, $this->cacheTtl, function () use ($searchTerm) {
      $url = $this->baseUrl . '/films/?search=' . urlencode($searchTerm);
      $results = $this->fetchPaginatedResults($url);

      return array_map(
        fn($item) => FilmDTO::fromSwapiResponse($item),
        $results
      );
    });
  }

  public function getFilm(int $id): FilmDTO
  {
    $cacheKey = 'film:' . $id;

    try {
      return Cache::remember($cacheKey, $this->cacheTtl, function () use ($id) {
        $response = Http::get($this->baseUrl . '/films/' . $id);
        if ($response->status() === 404) {
          throw new NotFoundException("Film with ID {$id} not found");
        }
        $response->throw();

        return FilmDTO::fromSwapiResponse($response->json());
      });
    } catch (NotFoundException $e) {
      throw $e;
    } catch (RequestException $e) {
      throw new ApiException("Error on get film {$id}");
    }
  }

  public function searchPeople(string $searchTerm): array
  {
    $cacheKey = 'people_search:' . $searchTerm;

    return Cache::remember($cacheKey, $this->cacheTtl, function () use ($searchTerm) {
      $url = $this->baseUrl . '/people/?search=' . urlencode($searchTerm);
      $results = $this->fetchPaginatedResults($url);

      return array_map(
        fn($item) => PersonDTO::fromSwapiResponse($item),
        $results
      );
    });
  }

  public function getPerson(int $id): PersonDTO
  {
    $cacheKey = 'person:' . $id;

    try {
      return Cache::remember($cacheKey, $this->cacheTtl, function () use ($id) {
        $response = Http::get($this->baseUrl . '/people/' . $id);
        if ($response->status() === 404) {
          throw new NotFoundException("Person with ID {$id} not found");
        }
        $response->throw();

        return PersonDTO::fromSwapiResponse($response->json());
      });
    } catch (NotFoundException $e) {
      throw $e;
    } catch (RequestException $e) {
      throw new ApiException("Error on get person {$id}");
    }
  }

  public function getCharacterDetails(array $characterIds): array
  {
    $details = [];
    $uncachedIds = [];

    foreach ($characterIds as $id) {
      $cacheKey = 'person:' . $id;
      if (Cache::has($cacheKey)) {
        $person = Cache::get($cacheKey);
        $details[] = [
          'id' => $id,
          'name' => $person->name,
        ];
      } else {
        $uncachedIds[] = $id;
      }
    }

    if (!empty($uncachedIds)) {
      $urls = array_map(fn($id) => $this->baseUrl . '/people/' . $id, $uncachedIds);
      $responses = Http::pool(
        fn(Pool $pool) => array_map(fn($url) => $pool->get($url), $urls)
      );

      foreach ($responses as $index => $response) {
        $id = $uncachedIds[$index];
        $cacheKey = 'person:' . $id;

        if ($response->successful()) {
          $person = PersonDTO::fromSwapiResponse($response->json());
          Cache::put($cacheKey, $person, $this->cacheTtl);
          $details[] = [
            'id' => $id,
            'name' => $person->name,
          ];
        } else {
          throw new ApiException("Error fetching character ID: {$id}");
        }
      }
    }

    return $details;
  }

  public function getFilmsDetails(array $filmsIds): array
  {
    $details = [];
    $uncachedIds = [];

    foreach ($filmsIds as $id) {
      $cacheKey = 'film:' . $id;
      if (Cache::has($cacheKey)) {
        $film = Cache::get($cacheKey);
        $details[] = [
          'id' => $id,
          'title' => $film->title,
        ];
      } else {
        $uncachedIds[] = $id;
      }
    }

    if (!empty($uncachedIds)) {
      $urls = array_map(fn($id) => $this->baseUrl . '/films/' . $id, $uncachedIds);
      $responses = Http::pool(
        fn(Pool $pool) => array_map(fn($url) => $pool->get($url), $urls)
      );

      foreach ($responses as $index => $response) {
        $id = $uncachedIds[$index];
        $cacheKey = 'film:' . $id;

        if ($response->successful()) {
          $film = FilmDTO::fromSwapiResponse($response->json());
          Cache::put($cacheKey, $film, $this->cacheTtl);
          $details[] = [
            'id' => $id,
            'title' => $film->title,
          ];
        } else {
          throw new ApiException("Error fetching film ID: {$id}");
        }
      }
    }

    return $details;
  }

  private function fetchPaginatedResults(string $url): array
  {
    $results = [];

    while ($url) {
      $response = Http::get($url)->throw();
      $data = $response->json();

      $results = array_merge($results, $data['results']);
      $url = $data['next'];
    }

    return $results;
  }
}
