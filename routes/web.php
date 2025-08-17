<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Services\CloudinaryService;
use App\Http\Controllers\BusinessController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Route::get('/test-upload', function (CloudinaryService $cloudinary) {
//     $path = public_path('images/logo.png');
//     return $cloudinary->uploadImage($path, 'catalog-cove/products');
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Business routes
    Route::get('/business/create', [BusinessController::class, 'create'])->name('business.create');
    Route::post('/business', [BusinessController::class, 'store'])->name('business.store');

    Route::middleware('business.exists')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
    });
});

require __DIR__.'/auth.php';
