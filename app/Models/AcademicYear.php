<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends Model
{
    use HasFactory, SoftDeletes;

    const DELETED_AT = 'archived_at';

    protected $primaryKey = 'academic_year_id';

    protected $fillable = [
        'school_year',
    ];

    public function students()
    {
        return $this->hasMany(Student::class, 'academic_year_id', 'academic_year_id');
    }
}
