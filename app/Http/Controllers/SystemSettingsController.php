<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Models\Course;
use App\Models\Department;
use App\Models\AcademicYear;

class SystemSettingsController extends Controller
{
    // Courses
    public function storeCourse(Request $request)
    {
        try {
            $data = $request->validate([
                'course_name' => 'required|string|max:255',
                'department_id' => 'nullable|integer|exists:departments,department_id',
            ]);
            Course::create($data);
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'courses'])
                ->with('status', 'Course added successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save course');
        }
    }

    public function updateCourse(Request $request, Course $course)
    {
        try {
            $data = $request->validate([
                'course_name' => 'required|string|max:255',
                'department_id' => 'nullable|integer|exists:departments,department_id',
            ]);
            $course->update($data);
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'courses'])
                ->with('status', 'Course updated successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save course');
        }
    }

    public function destroyCourse(Course $course)
    {
        try {
            $course->delete();
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'courses'])
                ->with('status', 'Course archived successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to archive course');
        }
    }

    // Departments
    public function storeDepartment(Request $request)
    {
        try {
            $data = $request->validate([
                'department_name' => 'required|string|max:255',
                'department_head' => 'nullable|string|max:255',
            ]);
            Department::create($data);
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'departments'])
                ->with('status', 'Department added successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save department: '.$e->getMessage());
        }
    }

    public function updateDepartment(Request $request, Department $department)
    {
        try {
            $data = $request->validate([
                'department_name' => 'required|string|max:255',
                'department_head' => 'nullable|string|max:255',
            ]);
            $department->update($data);
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'departments'])
                ->with('status', 'Department updated successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save department: '.$e->getMessage());
        }
    }

    public function destroyDepartment(Department $department)
    {
        try {
            $department->delete();
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'departments'])
                ->with('status', 'Department archived successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to archive department');
        }
    }

    // Academic Years
    public function storeYear(Request $request)
    {
        try {
            $data = $request->validate([
                'school_year' => 'required|string|max:50',
            ]);
            AcademicYear::create($data);
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'academic-years'])
                ->with('status', 'Academic year added successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save academic year');
        }
    }

    public function updateYear(Request $request, AcademicYear $academic_year)
    {
        try {
            $data = $request->validate([
                'school_year' => 'required|string|max:50',
            ]);
            $academic_year->update($data);
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'academic-years'])
                ->with('status', 'Academic year updated successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save academic year');
        }
    }

    public function destroyYear(AcademicYear $academic_year)
    {
        try {
            $academic_year->delete();
            return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'academic-years'])
                ->with('status', 'Academic year archived successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to archive academic year');
        }
    }
}

