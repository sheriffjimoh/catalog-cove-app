<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('business_id', $request->user()->business->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'image' => 'nullable|string', // for now store image URL (Cloudinary later)
        ]);

        $request->user()->business->products()->create($data);

        return redirect()->route('products.index')->with('success', 'Product created.');
    }
}
