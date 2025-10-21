<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Inertia\Inertia;
use App\Http\Requests\StoreBusinessRequest;
use App\Services\CloudinaryService;
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
            ->with('products') // eager load products
            ->firstOrFail();

        return Inertia::render('Business/View', [
            'business' => $business,
        ]);
    }
}
