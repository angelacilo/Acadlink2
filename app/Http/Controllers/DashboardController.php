<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Course;
use App\Models\AcademicYear;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $activeView = $request->query('view', 'dashboard');
        $totalStudents = Student::count();
        $totalFaculty = Faculty::count();

        $studentsPerCourse = Student::leftJoin('courses', 'students.course_id', '=', 'courses.course_id')
            ->selectRaw('COALESCE(courses.course_name, "N/A") as label, COUNT(*) as total')
            ->groupBy(DB::raw('COALESCE(courses.course_name, "N/A")'))
            ->orderBy(DB::raw('COALESCE(courses.course_name, "N/A")'))
            ->get();

        $facultyPerDepartment = Faculty::leftJoin('departments', 'faculty.department_id', '=', 'departments.department_id')
            ->selectRaw('COALESCE(departments.department_name, "N/A") as label, COUNT(*) as total')
            ->groupBy(DB::raw('COALESCE(departments.department_name, "N/A")'))
            ->orderBy(DB::raw('COALESCE(departments.department_name, "N/A")'))
            ->get();

        $departments = collect();
        $faculties = collect();
        $showArchived = false;
        $courses = collect();
        $academicYears = collect();
        $activeTab = $request->query('tab', 'courses');

        if ($activeView === 'faculty') {
            $departments = Department::orderBy('department_name')->get(['department_id','department_name']);
            $showArchived = (bool) $request->query('archived', false);
            $q = trim((string) $request->query('q', ''));
            $deptId = $request->query('department_id');

            $query = Faculty::query();
            if ($showArchived) {
                $query = $query->onlyTrashed();
            }
            if ($q !== '') {
                $query->where(function ($w) use ($q) {
                    $w->where('first_name', 'like', "%$q%")
                      ->orWhere('middle_name', 'like', "%$q%")
                      ->orWhere('last_name', 'like', "%$q%")
                      ->orWhere('email_address', 'like', "%$q%");
                });
            }
            if ($deptId) {
                $query->where('department_id', $deptId);
            }
            $faculties = $query->orderByDesc('faculty_id')->limit(200)->with('department')->get();
        }

        if ($activeView === 'students') {
            $departments = Department::orderBy('department_name')->get(['department_id','department_name']);
            $courses = Course::orderBy('course_name')->get(['course_id','course_name']);
        }

        if ($activeView === 'system-settings') {
            $departments = Department::orderBy('department_name')->get();
            $courses = Course::with('department')->orderBy('course_name')->get();
            $academicYears = AcademicYear::orderByDesc('school_year')->get();
        }

        return view('dashboard', [
            'totalStudents' => $totalStudents,
            'totalFaculty' => $totalFaculty,
            'studentLabels' => $studentsPerCourse->pluck('label'),
            'studentData' => $studentsPerCourse->pluck('total'),
            'facultyLabels' => $facultyPerDepartment->pluck('label'),
            'facultyData' => $facultyPerDepartment->pluck('total'),
            'activeView' => $activeView,
            'departments' => $departments,
            'faculties' => $faculties,
            'showArchived' => $showArchived,
            'courses' => $courses,
            'academicYears' => $academicYears,
            'activeTab' => $activeTab,
        ]);
    }
}
