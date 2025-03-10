<?php

namespace App\Services;

use App\Repositories\StarWarsRepositoryInterface;
use App\DTO\PersonDTO;
use App\DTO\FilmDTO;

class StarWarsService
{
  public function __construct(private StarWarsRepositoryInterface $repository) {}

  /**
   * @return PersonDTO[]
   */
  public function searchPeople(string $searchTerm): array
  {
    return $this->repository->searchPeople($searchTerm);
  }

  public function getPerson(int $id): PersonDTO
  {
    return $this->repository->getPerson($id);
  }

  /**
   * @return FilmDTO[]
   */
  public function searchFilm(string $searchTerm): array
  {
    return $this->repository->searchFilm($searchTerm);
  }

  public function getFilm(int $id): FilmDTO
  {
    return $this->repository->getFilm($id);
  }
}
