<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class FacultyController extends Controller
{
    public function store(Request $request)
    {
        $data = $this->validateData($request);
        Faculty::create($data);
        return Redirect::route('dashboard', ['view' => 'faculty'])
            ->with('status', 'Faculty added successfully');
    }

    public function update(Request $request, Faculty $faculty)
    {
        $data = $this->validateData($request, $faculty->faculty_id);
        $faculty->update($data);
        return Redirect::route('dashboard', ['view' => 'faculty'])
            ->with('status', 'Faculty updated successfully');
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->delete();
        return Redirect::back()->with('status', 'Faculty archived');
    }

    public function restore($id)
    {
        $fac = Faculty::onlyTrashed()->findOrFail($id);
        $fac->restore();
        return Redirect::back()->with('status', 'Faculty restored');
    }

    public function bulkArchive(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!empty($ids)) {
            Faculty::whereIn('faculty_id', $ids)->delete();
        }
        return Redirect::back()->with('status', 'Selected faculty archived');
    }

    private function validateData(Request $request, $ignoreId = null)
    {
        $emailRule = 'required|email|unique:faculty,email_address';
        if ($ignoreId) {
            $emailRule .= ','.$ignoreId.',faculty_id';
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
            'position' => 'nullable|string|max:100',
            'department_id' => 'nullable|integer|exists:departments,department_id',
            'status' => 'required|string|max:50',
        ]);
    }
}
