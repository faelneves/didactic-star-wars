<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class StarWarsServiceProvider extends ServiceProvider
{
  /**
   * Register services.
   */
  public function register(): void
  {
    //
    $this->app->bind(
      \App\Repositories\StarWarsRepositoryInterface::class,
      \App\Repositories\StarWarsApiRepository::class
    );
  }

  /**
   * Bootstrap services.
   */
  public function boot(): void
  {
    //
  }
}
