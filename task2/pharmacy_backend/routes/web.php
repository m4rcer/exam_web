<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MedicineTypeController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;



Route::get('/', function () {
    return view('welcome');
});

Route::apiResource('medicine-types', MedicineTypeController::class);
Route::apiResource('medicines', MedicineController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('orders', OrderController::class);

