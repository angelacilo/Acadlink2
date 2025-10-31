<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\ReportsController;

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

// Auth pages (UI only)
Route::get('/login', function(){ return view('auth.login'); })->name('login');
Route::post('/login', function(){ return redirect()->route('dashboard')->with('status', 'Logged in'); });
Route::get('/signup', function(){ return view('auth.signup'); })->name('signup');
Route::post('/signup', function(){ return redirect()->route('login')->with('status', 'Account created'); });

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Faculty actions (used by the single Blade view)
Route::post('/faculty', [FacultyController::class, 'store'])->name('faculty.store');
Route::put('/faculty/{faculty}', [FacultyController::class, 'update'])->name('faculty.update');
Route::delete('/faculty/{faculty}', [FacultyController::class, 'destroy'])->name('faculty.destroy');
Route::post('/faculty/{id}/restore', [FacultyController::class, 'restore'])->name('faculty.restore');
Route::post('/faculty/bulk-archive', [FacultyController::class, 'bulkArchive'])->name('faculty.bulk-archive');

// Students actions
Route::post('/students', [StudentController::class, 'store'])->name('students.store');
Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
Route::post('/students/{id}/restore', [StudentController::class, 'restore'])->name('students.restore');
Route::post('/students/bulk-archive', [StudentController::class, 'bulkArchive'])->name('students.bulk-archive');

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

// Reports CSV endpoints
Route::get('/reports/students', [ReportsController::class, 'students'])->name('reports.students');
Route::get('/reports/faculty', [ReportsController::class, 'faculty'])->name('reports.faculty');

