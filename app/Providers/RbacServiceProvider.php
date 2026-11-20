<?php

namespace App\Providers;

use App\Repositories\Rbac\EloquentRbacRepository;
use App\Repositories\Rbac\RbacRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RbacServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(RbacRepositoryInterface::class, EloquentRbacRepository::class);
    }
}
