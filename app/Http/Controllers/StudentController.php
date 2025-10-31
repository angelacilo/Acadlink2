<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class StudentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $this->validateData($request);
            Student::create($data);
            return Redirect::route('dashboard', ['view' => 'students'])
                ->with('status', 'Student added successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save student');
        }
    }

    public function update(Request $request, Student $student)
    {
        try {
            $data = $this->validateData($request, $student->student_id);
            $student->update($data);
            return Redirect::route('dashboard', ['view' => 'students'])
                ->with('status', 'Student updated successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to save student');
        }
    }

    public function destroy(Student $student)
    {
        try {
            $student->delete();
            return Redirect::back()->with('status', 'Student archived successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to archive student');
        }
    }

    public function restore($id)
    {
        try {
            $stu = Student::onlyTrashed()->findOrFail($id);
            $stu->restore();
            return Redirect::back()->with('status', 'Student restored successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to restore student');
        }
    }

    public function bulkArchive(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return Redirect::back()->with('error', 'Please select students to archive');
        }
        try {
            $count = Student::whereIn('student_id', $ids)->delete();
            return Redirect::back()->with('status', $count.' student(s) archived successfully');
        } catch (\Throwable $e) {
            return Redirect::back()->with('error', 'Failed to archive some students');
        }
    }

    private function validateData(Request $request, $ignoreId = null)
    {
        $emailRule = 'required|email|unique:students,email_address';
        if ($ignoreId) {
            $emailRule .= ','.$ignoreId.',student_id';
        }

        return $request->validate([
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'suffix' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'sex' => 'nullable|string|in:Male,Female',
            'email_address' => $emailRule,
            'phone_number' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',
            'department_id' => 'nullable|integer|exists:departments,department_id',
            'course_id' => 'nullable|integer|exists:courses,course_id',
            'academic_year_id' => 'nullable|integer|exists:academic_years,academic_year_id',
            'year_level' => 'nullable|string|max:50',
            'status' => 'required|string|max:50',
        ]);
    }
}
