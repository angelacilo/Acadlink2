<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Facultyprofile extends Controller
{
    public function index(Request $request)
    {
        $query = Faculty::with('department')
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
            'position' => 'nullable|string|max:255',
            'department_id' => 'nullable|exists:departments,department_id',
            'status' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $payload = $validator->validated();
        $payload['status'] = $payload['status'] ?? 'Active';

        $faculty = Faculty::create($payload);

        if (($payload['position'] ?? '') === 'Department Head' && !empty($payload['department_id'])) {
            Department::where('department_id', $payload['department_id'])
                ->update(['faculty_head' => $faculty->faculty_id]);

            Faculty::where('department_id', $payload['department_id'])
                ->where('faculty_id', '!=', $faculty->faculty_id)
                ->where('position', 'Department Head')
                ->update(['position' => 'Instructor']);
        }

        $faculty->load('department');

        return response()->json([
            'success' => true,
            'message' => 'Faculty added successfully',
            'data' => $faculty,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found',
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
            'position' => 'nullable|string|max:255',
            'department_id' => 'nullable|exists:departments,department_id',
            'status' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $originalDepartmentId = $faculty->department_id;
        $originalPosition = $faculty->position;

        $faculty->update($validator->validated());

        $updatedData = $validator->validated();
        $newDepartmentId = $faculty->department_id;
        $newPosition = $faculty->position;

        if ($newPosition === 'Department Head' && !empty($newDepartmentId)) {
            Department::where('department_id', $newDepartmentId)
                ->update(['faculty_head' => $faculty->faculty_id]);

            Faculty::where('department_id', $newDepartmentId)
                ->where('faculty_id', '!=', $faculty->faculty_id)
                ->where('position', 'Department Head')
                ->update(['position' => 'Instructor']);
        }

        if ($originalPosition === 'Department Head' && $originalDepartmentId && ($newPosition !== 'Department Head' || $originalDepartmentId !== $newDepartmentId)) {
            Department::where('department_id', $originalDepartmentId)
                ->where('faculty_head', $faculty->faculty_id)
                ->update(['faculty_head' => null]);
        }

        $faculty->load('department');

        return response()->json([
            'success' => true,
            'message' => 'Faculty updated successfully',
            'data' => $faculty,
        ]);
    }

    public function archive($id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found',
            ], 404);
        }

        $faculty->archived_at = now();
        $faculty->save();

        return response()->json([
            'success' => true,
            'message' => 'Faculty archived successfully',
        ]);
    }

    public function restore($id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found',
            ], 404);
        }

        $faculty->archived_at = null;
        $faculty->save();

        return response()->json([
            'success' => true,
            'message' => 'Faculty restored successfully',
        ]);
    }

    public function destroy($id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found',
            ], 404);
        }

        $faculty->delete();

        return response()->json([
            'success' => true,
            'message' => 'Faculty deleted permanently',
        ]);
    }
}
