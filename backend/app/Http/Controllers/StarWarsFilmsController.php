<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Services\StarWarsService;

class StarWarsFilmsController extends Controller
{
  public function __construct(private StarWarsService $service) {}

  public function search(Request $request)
  {
    try {
      $validated = $request->validate([
        'filter' => 'required|string'
      ]);
      $serviceResponse = $this->service->searchFilm($validated['filter']);

      return response()->json(['results' => $serviceResponse]);
    } catch (ValidationException $e) {
      return response()->json([
        'error' => 'Validation Error',
        'messages' => $e->errors()
      ], 400);
    }
  }

  public function show(Request $request, $id)
  {
    try {
      $request->merge(['id' => $id]);
      $validated = $request->validate([
        'id' => 'required|integer|min:1'
      ]);

      $serviceResponse = $this->service->getFilm($validated['id']);

      return response()->json($serviceResponse);
    } catch (ValidationException $e) {
      return response()->json([
        'error' => 'Validation Error',
        'message' => 'The ID must be a positive integer'
      ], 400);
    }
  }
}
