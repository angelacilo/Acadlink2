<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    const DELETED_AT = 'archived_at';

    protected $primaryKey = 'department_id';

    protected $fillable = [
        'department_name',
        'department_head',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id', 'department_id');
    }

    public function faculty()
    {
        return $this->hasMany(Faculty::class, 'department_id', 'department_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'department_id', 'department_id');
    }
}
