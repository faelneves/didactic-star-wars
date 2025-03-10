<?php

namespace App\DTO;

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
    public readonly array $planetIds,
    public readonly array $starshipIds,
    public readonly array $vehicleIds,
    public readonly array $speciesIds
  ) {}

  public static function fromSwapiResponse(array $data): self
  {
    return new self(
      id: self::extractIdFromUrl($data['url']),
      title: $data['title'],
      episodeId: $data['episode_id'],
      openingCrawl: $data['opening_crawl'],
      director: $data['director'],
      producer: $data['producer'],
      releaseDate: $data['release_date'],
      characterIds: self::extractResourceIds($data['characters']),
      planetIds: self::extractResourceIds($data['planets']),
      starshipIds: self::extractResourceIds($data['starships']),
      vehicleIds: self::extractResourceIds($data['vehicles']),
      speciesIds: self::extractResourceIds($data['species'])
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
