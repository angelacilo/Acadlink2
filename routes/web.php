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

Route::post('/login', function (Request $request) {
    $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // TODO: replace with real authentication.
    // For now, we simulate a successful login for any credentials.
    return response()->json(['message' => 'Login successful'], 200);
});

// Serve the SPA from the dashboard view. The SPA will handle client-side routing.
// Keep API routes in routes/api.php (they are loaded separately and use the /api prefix).
Route::view('/dashboard', 'dashboard');

// Optionally, serve the SPA at the root as well
Route::view('/', 'dashboard');

// Catch-all route to support direct links and client-side routing (exclude api/* if needed).
Route::get('/{any}', function () {
    return view('dashboard');
})->where('any', '.*');
