<?php

namespace App\DTO;

use App\Utils\UrlHelper;
use Illuminate\Support\Arr;

class PersonDTO
{
  public function __construct(
    public readonly int $id,
    public readonly string $name,
    public readonly string $height,
    public readonly string $mass,
    public readonly string $hair_color,
    public readonly string $skin_color,
    public readonly string $eye_color,
    public readonly string $birth_year,
    public readonly string $gender,
    public readonly array $species,
    public readonly array $filmsIds,
    public readonly array $films,
    public readonly array $vehiclesIds,
    public readonly array $starshipsIds
  ) {}

  public static function fromSwapiResponse(array $data, array $films = []): self
  {
    return new self(
      id: UrlHelper::extractSwapiId($data['url']),
      name: $data['name'],
      height: $data['height'],
      mass: $data['mass'],
      hair_color: $data['hair_color'],
      skin_color: $data['skin_color'],
      eye_color: $data['eye_color'],
      birth_year: $data['birth_year'],
      gender: $data['gender'],
      species: self::extractResourceIds($data['species']),
      filmsIds: self::extractResourceIds($data['films']),
      films: $films,
      vehiclesIds: self::extractResourceIds($data['vehicles']),
      starshipsIds: self::extractResourceIds($data['starships'])
    );
  }

  public function withFilms(array $films): self
  {
    return new self(
      $this->id,
      $this->name,
      $this->height,
      $this->mass,
      $this->hair_color,
      $this->skin_color,
      $this->eye_color,
      $this->birth_year,
      $this->gender,
      $this->species,
      $this->filmsIds,
      $films,
      $this->vehiclesIds,
      $this->starshipsIds
    );
  }

  private static function extractResourceIds(array $urls): array
  {
    return array_map(fn($url) => UrlHelper::extractSwapiId($url), $urls);
  }
}
