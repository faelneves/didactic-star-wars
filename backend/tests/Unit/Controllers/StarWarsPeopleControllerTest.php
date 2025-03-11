<?php

namespace Tests\Unit\Controllers;

use App\DTO\PersonDTO;
use App\Services\StarWarsService;
use Tests\TestCase;
use Mockery;

class StarWarsPeopleControllerTest extends TestCase
{

  private $serviceMock;

  protected function setUp(): void
  {
    parent::setUp();

    $this->serviceMock = Mockery::mock(StarWarsService::class);
    $this->app->instance(StarWarsService::class, $this->serviceMock);
  }

  /** @test */
  public function it_returns_search_results_successfully()
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
      filmsIds: [],
      films: [],
      vehiclesIds: [],
      starshipsIds: []
    );

    $this->serviceMock
      ->shouldReceive('searchPeople')
      ->with('skywalker')
      ->once()
      ->andReturn([$mockDTO]);

    $response = $this->getJson('/api/v1/people/search?filter=skywalker');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'results' => [
          '*' => [
            'id',
            'name',
            'height',
            'mass',
            'hair_color',
            'skin_color',
            'eye_color',
            'birth_year',
            'gender',
            'species',
            'films',
            'filmsIds',
            'vehiclesIds',
            'starshipsIds'
          ]
        ]
      ]);
  }

  /** @test */
  public function search_requires_search_parameter()
  {
    $response = $this->getJson('/api/v1/people/search');

    $response->assertStatus(400)
      ->assertJsonStructure([
        'error',
        'messages' => [
          'filter'
        ]
      ]);
  }

  /** @test */
  public function it_returns_person_details_successfully()
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
      filmsIds: [],
      films: [],
      vehiclesIds: [],
      starshipsIds: []
    );

    $this->serviceMock
      ->shouldReceive('getPerson')
      ->with(1)
      ->once()
      ->andReturn($mockDTO);

    $response = $this->getJson('/api/v1/people/1');

    $response->assertStatus(200)
      ->assertJson([
        'id' => 1,
        'name' => 'Luke Skywalker'
      ]);
  }


  /** @test */
  public function show_requires_valid_integer_id()
  {
    $response = $this->getJson("/api/v1/people/abc");

    $response->assertStatus(400)
      ->assertJson([
        'error' => 'Validation Error',
        'message' => 'The ID must be a positive integer'
      ]);
  }
}
