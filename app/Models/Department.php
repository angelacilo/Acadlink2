<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';
    protected $primaryKey = 'department_id';

    protected $fillable = [
        'name',
        'faculty_head',
    ];

    protected $dates = [
        'archived_at',
    ];

    protected $appends = [
        'faculty_head_name',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id', 'department_id');
    }

    public function head()
    {
        return $this->belongsTo(Faculty::class, 'faculty_head', 'faculty_id');
    }

    public function getFacultyHeadNameAttribute(): ?string
    {
        return optional($this->head)->full_name;
    }

    public function scopeActive($query)
    {
        return $query->whereNull('archived_at');
    }
}