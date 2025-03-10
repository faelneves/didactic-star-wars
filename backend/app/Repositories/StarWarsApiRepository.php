<?php

namespace App\Repositories;

use App\DTO\FilmDTO;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;
use App\DTO\PersonDTO;
use App\Exceptions\ApiException;
use App\Exceptions\NotFoundException;


class StarWarsApiRepository implements StarWarsRepositoryInterface
{

  protected string $baseUrl;

  public function __construct()
  {
    $this->baseUrl = config('services.starwars.url');
  }

  public function searchFilm(string $searchTerm): array
  {
    $response = Http::get($this->baseUrl . '/films/?search=' . $searchTerm)->throw();

    return array_map(
      fn($item) => FilmDTO::fromSwapiResponse($item),
      $response->json()['results']
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
    $response = Http::get($this->baseUrl . '/people/?search=' . $searchTerm)->throw();

    return array_map(
      fn($item) => PersonDTO::fromSwapiResponse($item),
      $response->json()['results']
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
}
