<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Http;
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

  public function __construct()
  {
    $this->baseUrl = config('services.starwars.url');
  }

  public function searchFilm(string $searchTerm): array
  {
    $url = $this->baseUrl . '/films/?search=' . urlencode($searchTerm);
    $results = $this->fetchPaginatedResults($url);

    return array_map(
      fn($item) => FilmDTO::fromSwapiResponse($item),
      $results
    );
  }

  public function getFilm(int $id): FilmDTO
  {
    try {
      $response = Http::get($this->baseUrl . '/films/' . $id);
      if ($response->status() === 404) {
        throw new NotFoundException("Film with ID {$id} not found");
      }
      $response->throw();

      return FilmDTO::fromSwapiResponse($response->json());
    } catch (RequestException $e) {
      throw new ApiException("Error on get film {$id}");
    }
  }

  public function searchPeople(string $searchTerm): array
  {
    $url = $this->baseUrl . '/people/?search=' . urlencode($searchTerm);
    $results = $this->fetchPaginatedResults($url);

    return array_map(
      fn($item) => PersonDTO::fromSwapiResponse($item),
      $results
    );
  }

  public function getPerson(int $id): PersonDTO
  {
    try {
      $response = Http::get($this->baseUrl . '/people/' . $id);
      if ($response->status() === 404) {
        throw new NotFoundException("Person with ID {$id} not found");
      }
      $response->throw();

      return PersonDTO::fromSwapiResponse($response->json());
    } catch (RequestException $e) {
      throw new ApiException("Error on get person {$id}");
    }
  }

  public function getCharacterDetails(array $characterIds): array
  {
    $urls = array_map(fn($id) => $this->baseUrl . '/people/' . $id, $characterIds);

    $responses = Http::pool(
      fn(Pool $pool) =>
      array_map(fn($url) => $pool->get($url), $urls)
    );

    return array_map(function ($response) {
      if (!$response->successful()) {
        throw new ApiException("Error on get character details");
      };

      $data = $response->json();
      return [
        'id' => UrlHelper::extractSwapiId($data['url']),
        'name' => $data['name']
      ];
    }, $responses);
  }

  public function getFilmsDetails(array $filmsIds): array
  {
    $urls = array_map(fn($id) => $this->baseUrl . '/films/' . $id, $filmsIds);

    $responses = Http::pool(
      fn(Pool $pool) =>
      array_map(fn($url) => $pool->get($url), $urls)
    );

    return array_map(function ($response) {
      if (!$response->successful()) {
        throw new ApiException("Error on get film details");
      };

      $data = $response->json();
      return [
        'id' => UrlHelper::extractSwapiId($data['url']),
        'title' => $data['title']
      ];
    }, $responses);
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
