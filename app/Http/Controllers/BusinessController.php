<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessController extends Controller {
    public function create() {
        return Inertia::render('Business/Create');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:20',
            'email' => 'required|email|unique:businesses,email',
            'address' => 'nullable|string|max:255',
            'short_note' => 'nullable|string',
            'logo' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $validated['user_id'] = $request->user()->id;

        Business::create($validated);

        return redirect()->route('dashboard')->with('success', 'Business created successfully!');
    }
}
