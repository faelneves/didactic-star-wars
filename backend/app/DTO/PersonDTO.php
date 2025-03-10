<?php

namespace App\DTO;

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
    public readonly array $films,
    public readonly array $vehicles,
    public readonly array $starships
  ) {}

  public static function fromSwapiResponse(array $data): self
  {
    return new self(
      id: self::extractIdFromUrl($data['url']),
      name: $data['name'],
      height: $data['height'],
      mass: $data['mass'],
      hair_color: $data['hair_color'],
      skin_color: $data['skin_color'],
      eye_color: $data['eye_color'],
      birth_year: $data['birth_year'],
      gender: $data['gender'],
      species: self::extractResourceIds($data['species']),
      films: self::extractResourceIds($data['films']),
      vehicles: self::extractResourceIds($data['vehicles']),
      starships: self::extractResourceIds($data['starships'])
    );
  }

  private static function extractIdFromUrl(string $url): int
  {
    preg_match('/\/(\d+)\/$/', $url, $matches);
    return (int) $matches[1];
  }

  private static function extractResourceIds(array $urls): array
  {
    return array_map(fn($url) => self::extractIdFromUrl($url), $urls);
  }
}
