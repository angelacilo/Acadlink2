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
        $data = $request->validate([
            'course_name' => 'required|string|max:255',
            'department_id' => 'nullable|integer|exists:departments,department_id',
        ]);
        Course::create($data);
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'courses'])
            ->with('status', 'Course added successfully');
    }

    public function updateCourse(Request $request, Course $course)
    {
        $data = $request->validate([
            'course_name' => 'required|string|max:255',
            'department_id' => 'nullable|integer|exists:departments,department_id',
        ]);
        $course->update($data);
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'courses'])
            ->with('status', 'Course updated successfully');
    }

    public function destroyCourse(Course $course)
    {
        $course->delete();
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'courses'])
            ->with('status', 'Course removed');
    }

    // Departments
    public function storeDepartment(Request $request)
    {
        $data = $request->validate([
            'department_name' => 'required|string|max:255',
            'department_head' => 'nullable|string|max:255',
        ]);
        Department::create($data);
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'departments'])
            ->with('status', 'Department added successfully');
    }

    public function updateDepartment(Request $request, Department $department)
    {
        $data = $request->validate([
            'department_name' => 'required|string|max:255',
            'department_head' => 'nullable|string|max:255',
        ]);
        $department->update($data);
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'departments'])
            ->with('status', 'Department updated successfully');
    }

    public function destroyDepartment(Department $department)
    {
        $department->delete();
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'departments'])
            ->with('status', 'Department removed');
    }

    // Academic Years
    public function storeYear(Request $request)
    {
        $data = $request->validate([
            'school_year' => 'required|string|max:50',
        ]);
        AcademicYear::create($data);
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'academic-years'])
            ->with('status', 'Academic year added successfully');
    }

    public function updateYear(Request $request, AcademicYear $academic_year)
    {
        $data = $request->validate([
            'school_year' => 'required|string|max:50',
        ]);
        $academic_year->update($data);
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'academic-years'])
            ->with('status', 'Academic year updated successfully');
    }

    public function destroyYear(AcademicYear $academic_year)
    {
        $academic_year->delete();
        return Redirect::route('dashboard', ['view' => 'system-settings', 'tab' => 'academic-years'])
            ->with('status', 'Academic year removed');
    }
}
