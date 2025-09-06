<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CloudinaryService;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('business_id', $request->user()->business->id);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'nullable|numeric',
                'stock' => 'nullable|integer',
                'images' => 'nullable|array',
                'images.*' => 'file|mimes:jpg,jpeg,png|max:5120', // 5MB limit per image
            ]);
    
            // Create product under vendor’s business
            $product = $request->user()->business->products()->create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'] ?? null,
                'stock' => $data['stock'] ?? null,
            ]);
    
            // Upload images to Cloudinary
            if (!empty($data['images'])) {
                $cloudinary = new CloudinaryService();
    
                foreach ($data['images'] as $imageFile) {
                    $path = $imageFile->getRealPath();
    
                    $url = $cloudinary->uploadImage($path, 'products');
    
                    if ($url) {
                        $product->images()->create([
                            'url' => $url,
                            'product_id' => $product->id,
                        ]);
                    }
                }
            }
    
            return redirect()
                ->route('products.index')
                ->with('success', 'Product created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()]);
        }
    }
    


    public function destroy(Product $product, Request $request)
    {
        if ($product->business_id !== $request->user()->business->id) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }
}
