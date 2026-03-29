<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/stripe/checkout', [PaymentController::class , 'stripeCheckout']);
    Route::post('/paystack/checkout', [PaymentController::class , 'paystackCheckout']);
    Route::post('/subscription/update-payment-method', [PaymentController::class , 'updatePaymentMethod']);
});