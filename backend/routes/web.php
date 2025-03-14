<?php

use App\Http\Controllers\StarWarsPeopleController;
use App\Http\Controllers\StarWarsFilmsController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
  return view('welcome');
});

Route::prefix('api/v1')->group(function () {
  Route::get('/people/search', [StarWarsPeopleController::class, 'search']);
  Route::get('/people/{id}', [StarWarsPeopleController::class, 'show']);

  Route::get('/films/search', [StarWarsFilmsController::class, 'search']);
  Route::get('/films/{id}', [StarWarsFilmsController::class, 'show']);

  Route::get('/metrics', function () {
    return response()->json(Cache::get('latest_statistics', []));
  });
});
