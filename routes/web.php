<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Authenticate;
use Illuminate\Http\Request;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Base');
})->name("index");

Route::controller(Authenticate::class)->prefix("auth")->name('auth.')->group(function () {
    Route::post('/mobile', 'otp')->name("otp");
    Route::post('/check-otp', 'checkOtp')->name("check.otp");
    Route::post('/check-username', 'checkUsername')->name("check.username");
    Route::post('/register', 'register')->name("register");
    Route::get('/logout', 'logout')->name("logout")->middleware("auth:sanctum");
});


require __DIR__ . '/auth.php';
