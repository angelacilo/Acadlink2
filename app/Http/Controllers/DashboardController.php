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
        $activeTab = $request->query('tab', 'students');
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
        $students = collect();
        $showArchived = false;
        $courses = collect();
        $academicYears = collect();
        // Reports data holders
        $reportStudents = collect();
        $reportFaculty = collect();

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
            $courses = Course::orderBy('course_name')->get(['course_id','course_name','department_id']);
            $academicYears = AcademicYear::orderByDesc('school_year')->get(['academic_year_id','school_year']);

            $q = trim((string) $request->query('q', ''));
            $courseId = $request->query('course_id');
            $deptId = $request->query('department_id');
            $showArchived = (bool) $request->query('archived', false);

            $query = Student::query()->with(['course','department','academicYear']);
            if ($showArchived) { $query = $query->onlyTrashed(); }
            if ($q !== '') {
                $query->where(function ($w) use ($q) {
                    $w->where('first_name', 'like', "%$q%")
                      ->orWhere('middle_name', 'like', "%$q%")
                      ->orWhere('last_name', 'like', "%$q%")
                      ->orWhere('email_address', 'like', "%$q%");
                });
            }
            if ($courseId) { $query->where('course_id', $courseId); }
            if ($deptId) { $query->where('department_id', $deptId); }
            $students = $query->orderByDesc('student_id')->limit(300)->get();
        }

        if ($activeView === 'reports') {
            // Filters
            $courses = Course::orderBy('course_name')->get(['course_id','course_name']);
            $academicYears = AcademicYear::orderByDesc('school_year')->get(['academic_year_id','school_year']);
            $departments = Department::orderBy('department_name')->get(['department_id','department_name']);

            // Student report dataset
            $rs = Student::query()->with(['course','department','academicYear']);
            if ($cid = $request->query('course_id')) $rs->where('course_id', $cid);
            if ($ay = $request->query('academic_year_id')) $rs->where('academic_year_id', $ay);
            if ($request->boolean('archived')) { $rs->onlyTrashed(); }
            if ($q = trim((string) $request->query('q', ''))) {
                $rs->where(function ($w) use ($q) {
                    $w->where('first_name', 'like', "%$q%")
                      ->orWhere('middle_name', 'like', "%$q%")
                      ->orWhere('last_name', 'like', "%$q%")
                      ->orWhere('email_address', 'like', "%$q%");
                });
            }
            $reportStudents = $rs->orderBy('student_id')->limit(1000)->get();

            // Faculty report dataset
            $rf = Faculty::query()->with('department');
            if ($did = $request->query('department_id')) $rf->where('department_id', $did);
            if ($request->boolean('archived')) { $rf->onlyTrashed(); }
            if ($q !== '') {
                $rf->where(function ($w) use ($q) {
                    $w->where('first_name', 'like', "%$q%")
                      ->orWhere('middle_name', 'like', "%$q%")
                      ->orWhere('last_name', 'like', "%$q%")
                      ->orWhere('email_address', 'like', "%$q%")
                      ->orWhere('position', 'like', "%$q%");
                });
            }
            $reportFaculty = $rf->orderBy('faculty_id')->limit(1000)->get();

            // Keep active tab from query param if present
            $activeTab = in_array($request->query('tab'), ['students','faculty']) ? $request->query('tab') : 'students';
        }

        if ($activeView === 'system-settings') {
            // Shared filters for panes
            $activeTab = $request->query('tab', 'courses');
            $q = trim((string) $request->query('q', ''));
            $archived = (bool) $request->query('archived', false);

            // Courses
            $cQuery = Course::with('department')->orderBy('course_name');
            if ($archived) { $cQuery = $cQuery->onlyTrashed(); }
            if ($q !== '') { $cQuery->where('course_name', 'like', "%$q%"); }
            $courses = $cQuery->get();

            // Departments
            $dQuery = Department::orderBy('department_name');
            if ($archived) { $dQuery = $dQuery->onlyTrashed(); }
            if ($q !== '') { $dQuery->where('department_name', 'like', "%$q%"); }
            $departments = $dQuery->get();

            // Academic Years
            $yQuery = AcademicYear::orderByDesc('school_year');
            if ($archived) { $yQuery = $yQuery->onlyTrashed(); }
            if ($q !== '') { $yQuery->where('school_year', 'like', "%$q%"); }
            $academicYears = $yQuery->get();

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
                'students' => $students,
                'showArchived' => $showArchived,
                'courses' => $courses,
                'academicYears' => $academicYears,
                'activeTab' => $activeTab,
                'reportStudents' => $reportStudents,
                'reportFaculty' => $reportFaculty,
            ]);
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
            'students' => $students,
            'showArchived' => $showArchived,
            'courses' => $courses,
            'academicYears' => $academicYears,
            'activeTab' => $activeTab,
            'reportStudents' => $reportStudents,
            'reportFaculty' => $reportFaculty,
        ]);
    }
}
