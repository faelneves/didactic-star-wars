<?php

namespace App\Exceptions;

use Exception;

class NotFoundException extends Exception
{
  public function render()
  {
    return response()->json([
      'error' => 'Resource not found',
      'message' => $this->getMessage()
    ], 404);
  }
}
