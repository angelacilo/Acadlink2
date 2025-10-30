<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id('student_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('sex', 10)->nullable();
            $table->string('email_address')->unique();
            $table->string('phone_number', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('status')->default('Active');
            $table->foreignId('department_id')->nullable()->constrained('departments', 'department_id')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses', 'course_id')->nullOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years', 'academic_year_id')->nullOnDelete();
            $table->string('year_level')->nullable();
            $table->timestamps();
            $table->softDeletes('archived_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
};
