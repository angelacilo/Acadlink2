<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id('student_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('sex', ['male','female','other'])->nullable();
            $table->string('email_address')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('address')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('course_id')->nullable();
            $table->unsignedBigInteger('academic_year_id')->nullable();
            $table->string('year_level')->nullable();
            $table->timestamps();
            $table->timestamp('archived_at')->nullable();

            $table->foreign('department_id')->references('department_id')->on('departments')->onDelete('set null');
            $table->foreign('course_id')->references('course_id')->on('courses')->onDelete('set null');
            $table->foreign('academic_year_id')->references('academic_year_id')->on('academic_years')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['course_id']);
            $table->dropForeign(['academic_year_id']);
        });
        Schema::dropIfExists('students');
    }
}
