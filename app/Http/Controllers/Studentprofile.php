<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Studentprofile extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['department', 'course', 'academicYear'])
            ->orderBy('last_name')
            ->orderBy('first_name');

        if ($request->boolean('archived')) {
            $query->whereNotNull('archived_at');
        } else {
            $query->whereNull('archived_at');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'sex' => 'nullable|in:male,female,other',
            'email_address' => 'nullable|email|max:255',
            'phone_number' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'nullable|string|max:100',
            'department_id' => 'nullable|exists:departments,department_id',
            'course_id' => 'nullable|exists:courses,course_id',
            'academic_year_id' => 'nullable|exists:academic_years,academic_year_id',
            'year_level' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $payload = $validator->validated();
        $payload['status'] = $payload['status'] ?? 'Continuing';

        $student = Student::create($payload);
        $student->load(['department', 'course', 'academicYear']);

        return response()->json([
            'success' => true,
            'message' => 'Student added successfully',
            'data' => $student,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'sex' => 'nullable|in:male,female,other',
            'email_address' => 'nullable|email|max:255',
            'phone_number' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'nullable|string|max:100',
            'department_id' => 'nullable|exists:departments,department_id',
            'course_id' => 'nullable|exists:courses,course_id',
            'academic_year_id' => 'nullable|exists:academic_years,academic_year_id',
            'year_level' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $student->update($validator->validated());
        $student->load(['department', 'course', 'academicYear']);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student,
        ]);
    }

    public function archive($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        $student->archived_at = now();
        $student->save();

        return response()->json([
            'success' => true,
            'message' => 'Student archived successfully',
        ]);
    }

    public function restore($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        $student->archived_at = null;
        $student->save();

        return response()->json([
            'success' => true,
            'message' => 'Student restored successfully',
        ]);
    }

    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted permanently',
        ]);
    }
}
