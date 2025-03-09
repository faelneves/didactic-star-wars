<?php

namespace App\Repositories;

use App\DTO\PersonDTO;

interface StarWarsRepositoryInterface
{
  /**
   * @return array<PersonDTO>
   */
  public function searchPeople(string $searchTerm): array;

  public function getPerson(int $id): PersonDTO;
}
