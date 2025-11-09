<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\Facultyprofile;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Studentprofile;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // TODO: replace with real authentication.
    // For now, we simulate a successful login for any credentials.
    return response()->json(['message' => 'Login successful'], 200);
});

// Courses API
Route::prefix('courses')->group(function () {
    Route::get('/', [CourseController::class, 'index']);
    Route::post('/', [CourseController::class, 'store']);
    Route::get('/{id}', [CourseController::class, 'show']);
    Route::put('/{id}', [CourseController::class, 'update']);
    Route::post('/{id}/archive', [CourseController::class, 'archive']);
    Route::post('/{id}/restore', [CourseController::class, 'restore']);
    Route::delete('/{id}', [CourseController::class, 'destroy']);
});

// Departments API
Route::prefix('departments')->group(function () {
    Route::get('/', [DepartmentController::class, 'index']);
    Route::post('/', [DepartmentController::class, 'store']);
    Route::get('/{id}', [DepartmentController::class, 'show']);
    Route::put('/{id}', [DepartmentController::class, 'update']);
    Route::post('/{id}/archive', [DepartmentController::class, 'archive']);
    Route::post('/{id}/restore', [DepartmentController::class, 'restore']);
    Route::delete('/{id}', [DepartmentController::class, 'destroy']);
});

// Academic Years API
Route::prefix('academic-years')->group(function () {
    Route::get('/', [AcademicYearController::class, 'index']);
    Route::post('/', [AcademicYearController::class, 'store']);
    Route::get('/{id}', [AcademicYearController::class, 'show']);
    Route::put('/{id}', [AcademicYearController::class, 'update']);
    Route::post('/{id}/archive', [AcademicYearController::class, 'archive']);
    Route::post('/{id}/restore', [AcademicYearController::class, 'restore']);
    Route::delete('/{id}', [AcademicYearController::class, 'destroy']);
});

// Faculty API
Route::prefix('faculties')->group(function () {
    Route::get('/', [Facultyprofile::class, 'index']);
    Route::post('/', [Facultyprofile::class, 'store']);
    Route::put('/{id}', [Facultyprofile::class, 'update']);
    Route::post('/{id}/archive', [Facultyprofile::class, 'archive']);
    Route::post('/{id}/restore', [Facultyprofile::class, 'restore']);
    Route::delete('/{id}', [Facultyprofile::class, 'destroy']);
});

// Students API
Route::prefix('students')->group(function () {
    Route::get('/', [Studentprofile::class, 'index']);
    Route::post('/', [Studentprofile::class, 'store']);
    Route::put('/{id}', [Studentprofile::class, 'update']);
    Route::post('/{id}/archive', [Studentprofile::class, 'archive']);
    Route::post('/{id}/restore', [Studentprofile::class, 'restore']);
    Route::delete('/{id}', [Studentprofile::class, 'destroy']);
});

// Admins API
Route::prefix('admins')->group(function () {
    Route::get('/{id}', [AdminController::class, 'show']);
    Route::put('/{id}', [AdminController::class, 'update']);
});

// Reports API
Route::prefix('reports')->group(function () {
    Route::get('/students', [ReportController::class, 'students']);
    Route::get('/faculties', [ReportController::class, 'faculties']);
});