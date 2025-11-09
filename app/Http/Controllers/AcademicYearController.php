<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicYear::orderBy('school_year');

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
            'school_year' => 'required|string|max:255|unique:academic_years,school_year',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $academicYear = AcademicYear::create($request->only(['school_year']));

        return response()->json([
            'success' => true,
            'message' => 'Academic year added successfully',
            'data' => $academicYear,
        ], 201);
    }

    public function show($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Academic year not found',
            ], 404);
        }

        return response()->json($academicYear);
    }

    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Academic year not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'school_year' => 'required|string|max:255|unique:academic_years,school_year,' . $id . ',academic_year_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $academicYear->update($request->only(['school_year']));

        return response()->json([
            'success' => true,
            'message' => 'Academic year updated successfully',
            'data' => $academicYear,
        ]);
    }

    public function archive($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Academic year not found',
            ], 404);
        }

        $academicYear->archived_at = now();
        $academicYear->save();

        return response()->json([
            'success' => true,
            'message' => 'Academic year archived successfully',
        ]);
    }

    public function restore($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Academic year not found',
            ], 404);
        }

        $academicYear->archived_at = null;
        $academicYear->save();

        return response()->json([
            'success' => true,
            'message' => 'Academic year restored successfully',
        ]);
    }

    public function destroy($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Academic year not found',
            ], 404);
        }

        $academicYear->delete();

        return response()->json([
            'success' => true,
            'message' => 'Academic year deleted permanently',
        ]);
    }
}