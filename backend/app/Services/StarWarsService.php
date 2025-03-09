<?php

namespace App\Services;

use App\Repositories\StarWarsRepositoryInterface;
use App\DTO\PersonDTO;

class StarWarsService
{
  /**
   * Create a new class instance.
   */
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
}
