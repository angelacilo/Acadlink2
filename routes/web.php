<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\SystemSettingsController;

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
    return redirect()->route('dashboard');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Faculty actions (used by the single Blade view)
Route::post('/faculty', [FacultyController::class, 'store'])->name('faculty.store');
Route::put('/faculty/{faculty}', [FacultyController::class, 'update'])->name('faculty.update');
Route::delete('/faculty/{faculty}', [FacultyController::class, 'destroy'])->name('faculty.destroy');
Route::post('/faculty/{id}/restore', [FacultyController::class, 'restore'])->name('faculty.restore');
Route::post('/faculty/bulk-archive', [FacultyController::class, 'bulkArchive'])->name('faculty.bulk-archive');

// System Settings
Route::post('/settings/courses', [SystemSettingsController::class, 'storeCourse'])->name('settings.courses.store');
Route::put('/settings/courses/{course}', [SystemSettingsController::class, 'updateCourse'])->name('settings.courses.update');
Route::delete('/settings/courses/{course}', [SystemSettingsController::class, 'destroyCourse'])->name('settings.courses.destroy');

Route::post('/settings/departments', [SystemSettingsController::class, 'storeDepartment'])->name('settings.departments.store');
Route::put('/settings/departments/{department}', [SystemSettingsController::class, 'updateDepartment'])->name('settings.departments.update');
Route::delete('/settings/departments/{department}', [SystemSettingsController::class, 'destroyDepartment'])->name('settings.departments.destroy');

Route::post('/settings/academic-years', [SystemSettingsController::class, 'storeYear'])->name('settings.years.store');
Route::put('/settings/academic-years/{academic_year}', [SystemSettingsController::class, 'updateYear'])->name('settings.years.update');
Route::delete('/settings/academic-years/{academic_year}', [SystemSettingsController::class, 'destroyYear'])->name('settings.years.destroy');
