<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function show(Request $request, $id)
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'admin_id'   => $admin->admin_id,
                'username'   => $admin->username,
                'email'      => $admin->email,
                'role'       => 'admin',
                'created_at' => optional($admin->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'username'           => 'required|string|max:255|unique:admins,username,' . $id . ',admin_id',
            'email'              => 'required|email|max:255|unique:admins,email,' . $id . ',admin_id',
            'current_password'   => 'nullable|string',
            'password'           => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if (!empty($data['password'])) {
            if (empty($data['current_password']) || !Hash::check($data['current_password'], $admin->password)) {
                return response()->json([
                    'success' => false,
                    'errors'  => [
                        'current_password' => ['Current password is incorrect.'],
                    ],
                ], 422);
            }

            $admin->password = $data['password'];
        }

        $admin->username = $data['username'];
        $admin->email    = $data['email'];
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
        ]);
    }
}