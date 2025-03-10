<?php

namespace App\Utils;

class UrlHelper
{
  public static function extractSwapiId(string $url): int
  {
    preg_match('/\/(\d+)\/$/', $url, $matches);
    return (int) ($matches[1] ?? 0);
  }
}
