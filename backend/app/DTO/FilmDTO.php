<?php

namespace App\DTO;

use App\Utils\UrlHelper;

class FilmDTO
{
  public function __construct(
    public readonly int $id,
    public readonly string $title,
    public readonly int $episodeId,
    public readonly string $openingCrawl,
    public readonly string $director,
    public readonly string $producer,
    public readonly string $releaseDate,
    public readonly array $characterIds,
    public readonly array $characters,
    public readonly array $planetIds,
    public readonly array $starshipIds,
    public readonly array $vehicleIds,
    public readonly array $speciesIds
  ) {}

  public static function fromSwapiResponse(array $data, array $characters = []): self
  {
    return new self(
      id: UrlHelper::extractSwapiId($data['url']),
      title: $data['title'],
      episodeId: $data['episode_id'],
      openingCrawl: $data['opening_crawl'],
      director: $data['director'],
      producer: $data['producer'],
      releaseDate: $data['release_date'],
      characterIds: self::extractResourceIds($data['characters']),
      characters: $characters,
      planetIds: self::extractResourceIds($data['planets']),
      starshipIds: self::extractResourceIds($data['starships']),
      vehicleIds: self::extractResourceIds($data['vehicles']),
      speciesIds: self::extractResourceIds($data['species'])
    );
  }

  public function withCharacters(array $characters): self
  {
    return new self(
      $this->id,
      $this->title,
      $this->episodeId,
      $this->openingCrawl,
      $this->director,
      $this->producer,
      $this->releaseDate,
      $this->characterIds,
      $characters,
      $this->planetIds,
      $this->starshipIds,
      $this->vehicleIds,
      $this->speciesIds
    );
  }

  private static function extractResourceIds(array $urls): array
  {
    return array_map(fn($url) => UrlHelper::extractSwapiId($url), $urls);
  }
}
