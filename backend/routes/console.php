<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('fitmanager:about', function () {
    $this->info('FitManager API is ready.');
});
