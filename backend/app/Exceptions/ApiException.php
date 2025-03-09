<?php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
  public function render()
  {
    return response()->json([
      'error' => 'Internal Server Error',
      'message' => $this->getMessage()
    ], 500);
  }
}
