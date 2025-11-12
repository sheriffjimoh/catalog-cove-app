<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Inertia\Inertia;
use App\Http\Requests\StoreBusinessRequest;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class BusinessController extends Controller
{
    public function create()
    {
        return Inertia::render('Business/Create');
    }

    public function store(StoreBusinessRequest $request, CloudinaryService $cloudinary)
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('logo')) {
                $uploadedFile = $request->file('logo')->getRealPath();

                // Upload with CloudinaryService
                $validated['logo'] = $cloudinary->uploadImage(
                    $uploadedFile,
                    'cataladove/business/logos'
                );
            }

            $validated['user_id'] = $request->user()->id;
            Business::create($validated);

            return redirect()->route('dashboard')->with('success', 'Business created successfully!');
        } catch (\Exception $e) {
            Log::error('Business creation failed: ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }


    public function show($slug)
    {
        $business = Business::where('slug', $slug)
        ->with(['products' => function($query) {
            $query->where('is_published', true)
                  ->with('images');
        }])
        ->firstOrFail();

    return Inertia::render('Business/View', [
        'business' => $business,
    ]);
    }



    public function edit()
    {
        $business = auth()->guard()->user()->business;
        return Inertia::render('Settings/Business', [
            'business' => $business,
        ]);
    }


    public function update(Request $request, $id, CloudinaryService $cloudinary)
    {
        try {
            $business = Business::findOrFail($id);

            $validated =  $request->validate([
                'name' => 'required|string|max:255',
                'whatsapp' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'address' => 'nullable|string|max:500',
                'short_note' => 'nullable|string|max:1000',
                'logo' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('logo')) {
                $uploadedFile = $request->file('logo')->getRealPath();

                // Upload with CloudinaryService
                $validated['logo'] = $cloudinary->uploadImage(
                    $uploadedFile,
                    'cataladove/business/logos'
                );
            }

            // dd($validated);

            $business->update($validated);

            return redirect()->back()->with('success', 'Business updated successfully!');
        } catch (\Exception $e) {
            Log::error('Business update failed: ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }
}
