<?php

namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use App\DTO\PersonDTO;
use App\Services\StarWarsService;
use App\Repositories\StarWarsRepositoryInterface;
use Mockery;

class StarWarsServiceTest extends TestCase
{
  private $repositoryMock;
  private $service;

  protected function setUp(): void
  {
    parent::setUp();

    $this->repositoryMock = Mockery::mock(StarWarsRepositoryInterface::class);
    $this->service = new StarWarsService($this->repositoryMock);
  }

  /** @test */
  public function it_returns_person_dto_array_for_search()
  {
    $mockDTO = new PersonDTO(
      id: 1,
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: "fair",
      eye_color: "blue",
      birth_year: '19BBY',
      gender: "male",
      species: [],
      films: [],
      vehicles: [],
      starships: [],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://swapi.dev/api/people/1/'
    );

    $this->repositoryMock
      ->shouldReceive('searchPeople')
      ->with('skywalker')
      ->once()
      ->andReturn([$mockDTO]);

    $result = $this->service->searchPeople('skywalker');

    $this->assertIsArray($result);
    $this->assertCount(1, $result);
    $this->assertInstanceOf(PersonDTO::class, $result[0]);
    $this->assertEquals('Luke Skywalker', $result[0]->name);
  }

  /** @test */
  public function it_returns_single_person_dto()
  {
    $mockDTO = new PersonDTO(
      id: 1,
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: "fair",
      eye_color: "blue",
      birth_year: '19BBY',
      gender: "male",
      species: [],
      films: [],
      vehicles: [],
      starships: [],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://swapi.dev/api/people/1/'
    );

    $this->repositoryMock
      ->shouldReceive('getPerson')
      ->with(1)
      ->once()
      ->andReturn($mockDTO);

    $result = $this->service->getPerson(1);

    $this->assertInstanceOf(PersonDTO::class, $result);
    $this->assertEquals(1, $result->id);
    $this->assertEquals('Luke Skywalker', $result->name);
  }
}
