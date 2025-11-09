<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Student;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function students(Request $request)
    {
        $courseId = $request->query('course_id');

        $query = Student::with(['course', 'department', 'academicYear'])
            ->whereNull('archived_at')
            ->orderBy('last_name')
            ->orderBy('first_name');

        if ($courseId && $courseId !== 'all') {
            $query->where('course_id', $courseId);
        }

        $students = $query->get()->map(function (Student $student) {
            return [
                'id' => $student->student_id,
                'studentNumber' => $student->student_number ?? $student->student_id,
                'name' => $student->full_name ?: trim(collect([$student->first_name, $student->last_name])->filter()->join(' ')),
                'course' => optional($student->course)->course_name
                    ?? optional($student->course)->name
                    ?? $student->course_name
                    ?? '—',
                'yearLevel' => $student->year_level ?? '—',
                'status' => $student->status ?? 'Active',
            ];
        })->values();

        return response()->json(['data' => $students]);
    }

    public function faculties(Request $request)
    {
        $departmentId = $request->query('department_id');

        $query = Faculty::with('department')
            ->whereNull('archived_at')
            ->orderBy('last_name')
            ->orderBy('first_name');

        if ($departmentId && $departmentId !== 'all') {
            $query->where('department_id', $departmentId);
        }

        $faculties = $query->get()->map(function (Faculty $faculty) {
            return [
                'id' => $faculty->faculty_id,
                'facultyNumber' => $faculty->faculty_number ?? $faculty->faculty_id,
                'name' => $faculty->full_name ?: trim(collect([$faculty->first_name, $faculty->last_name])->filter()->join(' ')),
                'department' => optional($faculty->department)->name ?? '—',
                'status' => $faculty->status ?? 'Active',
            ];
        })->values();

        return response()->json(['data' => $faculties]);
    }
}
