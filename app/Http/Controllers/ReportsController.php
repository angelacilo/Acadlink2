<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Models\Student;
use App\Models\Faculty;

class ReportsController extends Controller
{
    public function students(Request $request)
    {
        $query = Student::with(['course','department','academicYear']);
        if ($request->boolean('archived')) { $query->onlyTrashed(); }
        if ($request->filled('course_id')) $query->where('course_id', $request->query('course_id'));
        if ($request->filled('academic_year_id')) $query->where('academic_year_id', $request->query('academic_year_id'));
        $rows = $query->orderBy('student_id')->limit(5000)->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="student_report.csv"',
        ];

        return new StreamedResponse(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Student ID','Name','Email','Course','Department','Year Level','Academic Year','Status']);
            foreach ($rows as $s) {
                $name = trim(($s->first_name.' '.($s->middle_name ? $s->middle_name.' ' : '').$s->last_name));
                fputcsv($out, [
                    $s->student_id,
                    $name,
                    $s->email_address,
                    optional($s->course)->course_name ?: 'N/A',
                    optional($s->department)->department_name ?: 'N/A',
                    $s->year_level ?: 'N/A',
                    optional($s->academicYear)->school_year ?: 'N/A',
                    $s->status ?: 'N/A',
                ]);
            }
            fclose($out);
        }, 200, $headers);
    }

    public function faculty(Request $request)
    {
        $query = Faculty::with('department');
        if ($request->boolean('archived')) { $query->onlyTrashed(); }
        if ($request->filled('department_id')) $query->where('department_id', $request->query('department_id'));
        $rows = $query->orderBy('faculty_id')->limit(5000)->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="faculty_report.csv"',
        ];

        return new StreamedResponse(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Faculty ID','Name','Email','Position','Department','Status']);
            foreach ($rows as $f) {
                $name = trim(($f->first_name.' '.($f->middle_name ? $f->middle_name.' ' : '').$f->last_name));
                fputcsv($out, [
                    $f->faculty_id,
                    $name,
                    $f->email_address,
                    $f->position ?: 'N/A',
                    optional($f->department)->department_name ?: 'N/A',
                    $f->status ?: 'Active',
                ]);
            }
            fclose($out);
        }, 200, $headers);
    }
}
