<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    protected $table = 'academic_years';
    protected $primaryKey = 'academic_year_id';

    protected $fillable = [
        'school_year',
    ];

    protected $dates = [
        'archived_at',
    ];

    public function scopeActive($query)
    {
        return $query->whereNull('archived_at');
    }
}