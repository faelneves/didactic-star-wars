<?php

namespace App\Listeners;

use App\Events\SearchPerformed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LogSearch implements ShouldQueue
{
  use InteractsWithQueue;

  /**
   * Create the event listener.
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   */
  public function handle(SearchPerformed $event): void
  {
    $queries = Cache::get('search_queries', []);
    $queries[] = [
      'query' => $event->query,
      'duration' => $event->duration,
      'status' => $event->status,
      'created_at' => now()->toDateTimeString(),
    ];
    Cache::put('search_queries', $queries);
  }
}
