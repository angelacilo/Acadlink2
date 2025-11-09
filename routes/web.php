<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::view('/', 'dashboard');

Route::middleware('auth:admin')->group(function () {
    Route::view('/dashboard', 'dashboard');
    Route::view('/settings', 'dashboard');
    Route::view('/profile', 'dashboard');
    Route::view('/student', 'dashboard');
    Route::view('/faculty', 'dashboard');
    Route::view('/archive', 'dashboard');
    Route::view('/reporting', 'dashboard');
});

Route::get('/{any}', function () {
    return redirect('/');
})->where('any', '^(?!api).*$');
