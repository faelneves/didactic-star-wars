<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Events\SearchPerformed;

class TrackSearchRequests
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $startTime = microtime(true);

    $response = $next($request);

    $duration = round(microtime(true) - $startTime, 3);
    $query = strtoupper($request->method()) . ' ' . $request->fullUrl();
    $status = $response->getStatusCode();

    event(new SearchPerformed(
      $query,
      $duration,
      $status
    ));
    return $response;
  }
}
