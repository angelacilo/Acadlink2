<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->id('faculty_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('sex', 10)->nullable();
            $table->string('email_address')->unique();
            $table->string('phone_number', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('position')->nullable();
            $table->foreignId('department_id')->nullable()->constrained('departments', 'department_id')->nullOnDelete();
            $table->string('status')->default('Active');
            $table->timestamps();
            $table->softDeletes('archived_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('faculty');
    }
};
