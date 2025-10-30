<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id('academic_year_id');
            $table->string('school_year');
            $table->timestamps();
            $table->softDeletes('archived_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('academic_years');
    }
};
