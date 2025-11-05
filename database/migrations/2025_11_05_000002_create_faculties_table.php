<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id('faculty_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('sex', ['male','female','other'])->nullable();
            $table->string('email_address')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('address')->nullable();
            $table->string('position')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->timestamp('archived_at')->nullable();

            // foreign key to departments is added without constraint here to avoid ordering issues
            // a later migration or a dedicated schema step can add the constraint if desired
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faculties');
    }
}
