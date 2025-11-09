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
use App\Http\Controllers\Auth\AdminAuthController;

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

Route::prefix('auth')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('guest:admin');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->middleware('auth:admin');
    Route::get('/me', [AdminAuthController::class, 'me'])->middleware('auth:admin');
});

Route::middleware('auth:admin')->group(function () {
    Route::apiResource('courses', CourseController::class)->parameters(['courses' => 'id']);
    Route::post('courses/{id}/archive', [CourseController::class, 'archive']);
    Route::post('courses/{id}/restore', [CourseController::class, 'restore']);

    Route::apiResource('departments', DepartmentController::class)->parameters(['departments' => 'id']);
    Route::post('departments/{id}/archive', [DepartmentController::class, 'archive']);
    Route::post('departments/{id}/restore', [DepartmentController::class, 'restore']);

    Route::apiResource('academic-years', AcademicYearController::class)->parameters(['academic-years' => 'id']);
    Route::post('academic-years/{id}/archive', [AcademicYearController::class, 'archive']);
    Route::post('academic-years/{id}/restore', [AcademicYearController::class, 'restore']);

    Route::apiResource('faculties', Facultyprofile::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['faculties' => 'id']);
    Route::post('faculties/{id}/archive', [Facultyprofile::class, 'archive']);
    Route::post('faculties/{id}/restore', [Facultyprofile::class, 'restore']);

    Route::apiResource('students', Studentprofile::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['students' => 'id']);
    Route::post('students/{id}/archive', [Studentprofile::class, 'archive']);
    Route::post('students/{id}/restore', [Studentprofile::class, 'restore']);

    Route::apiResource('admins', AdminController::class)->only(['show', 'update'])->parameters(['admins' => 'id']);

    Route::prefix('reports')->group(function () {
        Route::get('/students', [ReportController::class, 'students']);
        Route::get('/faculties', [ReportController::class, 'faculties']);
    });
});