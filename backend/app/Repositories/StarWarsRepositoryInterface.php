<?php

namespace App\Repositories;

use App\DTO\FilmDTO;
use App\DTO\PersonDTO;

interface StarWarsRepositoryInterface
{
  /**
   * @return array<FilmDTO>
   */
  public function searchFilm(string $searchTerm): array;

  public function getFilm(int $id): FilmDTO;

  /**
   * @return array<PersonDTO>
   */
  public function searchPeople(string $searchTerm): array;

  public function getPerson(int $id): PersonDTO;
}
