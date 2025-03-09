<?php

use App\Http\Controllers\StarWarsPeopleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return view('welcome');
});

Route::prefix('api/v1')->group(function () {
  Route::get('/people/search', [StarWarsPeopleController::class, 'search']);
  Route::get('/people/{id}', [StarWarsPeopleController::class, 'show']);
});
