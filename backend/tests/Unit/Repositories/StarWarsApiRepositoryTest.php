<?php

namespace Tests\Unit\Repositories;

use Tests\TestCase;
use App\DTO\PersonDTO;
use App\Repositories\StarWarsApiRepository;
use App\Exceptions\NotFoundException;
use App\Exceptions\ApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class StarWarsApiRepositoryTest extends TestCase
{
  private $repository;
  private string $mockBaseUrl = 'https://mock-swapi.dev/api';


  protected function setUp(): void
  {
    parent::setUp();

    Config::set('services.starwars.url', $this->mockBaseUrl);
    $this->repository = new StarWarsApiRepository();
  }

  /** @test */
  public function it_searches_people_successfully(): void
  {
    Http::fake([
      $this->mockBaseUrl . '/people/?search=luke' => Http::response([
        "count" => 1,
        "next" => null,
        "previous" => null,
        "results" => [
          [
            "name" => "Luke Skywalker",
            "height" => "172",
            "mass" => "77",
            "hair_color" => "blond",
            "skin_color" => "fair",
            "eye_color" => "blue",
            "birth_year" => "19BBY",
            "gender" => "male",
            "homeworld" => "https://swapi.dev/api/planets/1/",
            "films" => [
              "https://swapi.dev/api/films/1/",
              "https://swapi.dev/api/films/2/",
              "https://swapi.dev/api/films/3/",
              "https://swapi.dev/api/films/6/"
            ],
            "species" => [],
            "vehicles" => [
              "https://swapi.dev/api/vehicles/14/",
              "https://swapi.dev/api/vehicles/30/"
            ],
            "starships" => [
              "https://swapi.dev/api/starships/12/",
              "https://swapi.dev/api/starships/22/"
            ],
            "created" => "2014-12-09T13:50:51.644000Z",
            "edited" => "2014-12-20T21:17:56.891000Z",
            "url" => "https://swapi.dev/api/people/1/"
          ]
        ]
      ])
    ]);


    $result = $this->repository->searchPeople('luke');
    $this->assertIsArray($result);
    $this->assertInstanceOf(PersonDTO::class, $result[0]);
    $this->assertEquals('Luke Skywalker', $result[0]->name);
  }

  /** @test */
  public function it_returns_empty_array_for_no_search_results()
  {
    Http::fake([
      $this->mockBaseUrl . '/people/?search=nonexistent' => Http::response([
        "count" => 0,
        "next" => null,
        "previous" => null,
        'results' => []
      ])
    ]);

    $result = $this->repository->searchPeople('nonexistent');

    $this->assertIsArray($result);
    $this->assertEmpty($result);
  }

  /** @test */
  public function it_gets_person_successfully()
  {
    Http::fake([
      $this->mockBaseUrl . '/people/1' => Http::response([
        "name" => "Luke Skywalker",
        "height" => "172",
        "mass" => "77",
        "hair_color" => "blond",
        "skin_color" => "fair",
        "eye_color" => "blue",
        "birth_year" => "19BBY",
        "gender" => "male",
        "homeworld" => "https://swapi.dev/api/planets/1/",
        "films" => [
          "https://swapi.dev/api/films/1/",
          "https://swapi.dev/api/films/2/",
          "https://swapi.dev/api/films/3/",
          "https://swapi.dev/api/films/6/"
        ],
        "species" => [],
        "vehicles" => [
          "https://swapi.dev/api/vehicles/14/",
          "https://swapi.dev/api/vehicles/30/"
        ],
        "starships" => [
          "https://swapi.dev/api/starships/12/",
          "https://swapi.dev/api/starships/22/"
        ],
        "created" => "2014-12-09T13:50:51.644000Z",
        "edited" => "2014-12-20T21:17:56.891000Z",
        "url" => "https://swapi.dev/api/people/1/"
      ])
    ]);

    $result = $this->repository->getPerson(1);

    $this->assertInstanceOf(PersonDTO::class, $result);
    $this->assertEquals(1, $result->id);
  }

  /** @test */
  public function it_throws_not_found_exception()
  {
    Http::fake([
      $this->mockBaseUrl . '/people/999' => Http::response([], 404)
    ]);

    $this->expectException(NotFoundException::class);
    $this->expectExceptionMessage('Person with ID 999 not found');

    $this->repository->getPerson(999);
  }

  /** @test */
  public function it_throws_api_exception_on_general_errors()
  {
    Http::fake([
      $this->mockBaseUrl . '/people/1' => Http::response([], 500)
    ]);

    $this->expectException(ApiException::class);
    $this->expectExceptionMessage('Error on get person 1');

    $this->repository->getPerson(1);
  }
}
