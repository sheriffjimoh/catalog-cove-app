<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BusinessController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProductController;


Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Authenticated routes
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Business setup routes (no business.exists check here)
    Route::middleware(['auth', 'no.business'])->group(function () {
        Route::get('/business/create', [BusinessController::class, 'create'])->name('business.create');
        Route::post('/business', [BusinessController::class, 'store'])->name('business.store');
    });

    // Routes that require business to exist
    Route::middleware('business.exists')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->middleware(['verified'])->name('dashboard');

        // Product routes
        Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
            Route::get('/', [ProductController::class, 'index'])->name('index');
            Route::get('/create', [ProductController::class, 'create'])->name('create');
            Route::post('/', [ProductController::class, 'store'])->name('store');
            Route::delete('/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

        });
    });
});


require __DIR__.'/auth.php';
