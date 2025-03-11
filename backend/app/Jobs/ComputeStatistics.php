<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class ComputeStatistics implements ShouldQueue
{
  use Queueable;

  public function handle(): void
  {
    $queries = Cache::get('search_queries', []);
    Cache::forget('search_queries');

    $stats = $this->calculateStats($queries);
    Cache::put('latest_statistics', $stats);
  }

  private function calculateStats(array $queries): array
  {
    if (empty($queries)) return [];

    $queryData = [];
    $totalDuration = 0;

    foreach ($queries as $query) {
      $key = $query['query'];
      $status = $query['status'];

      if (!isset($queryData[$key])) {
        $queryData[$key] = [
          'total_count' => 0,
          'status_counts' => [],
          'durations' => []
        ];
      }

      $queryData[$key]['total_count']++;
      $queryData[$key]['status_counts'][$status] =
        ($queryData[$key]['status_counts'][$status] ?? 0) + 1;
      $queryData[$key]['durations'][] = $query['duration'];

      $totalDuration += $query['duration'];
    }

    uasort($queryData, function ($a, $b) {
      return $b['total_count'] <=> $a['total_count'];
    });

    $topQueries = array_slice($queryData, 0, 5, true);
    $totalQueries = count($queries);

    $processedQueries = [];
    foreach ($topQueries as $query => $data) {
      $statusDistribution = [];
      foreach ($data['status_counts'] as $status => $count) {
        $statusDistribution[] = [
          'status' => $status,
          'count' => $count,
          'percentage' => round(($count / $data['total_count']) * 100, 2)
        ];
      }

      usort($statusDistribution, function ($a, $b) {
        return $b['count'] <=> $a['count'];
      });

      $processedQueries[] = [
        'query' => $query,
        'total_count' => $data['total_count'],
        'total_percentage' => round(($data['total_count'] / $totalQueries) * 100, 2),
        'average_duration' => round(array_sum($data['durations']) / count($data['durations']), 4),
        'status_distribution' => $statusDistribution
      ];
    }

    return [
      'top_queries' => $processedQueries,
      'global_stats' => [
        'total_requests' => $totalQueries,
        'average_duration' => round($totalDuration / $totalQueries, 4),
        'unique_queries' => count($queryData),
        'generated_at' => now()->toDateTimeString()
      ]
    ];
  }
}
