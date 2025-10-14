<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Log;
use App\Models\Product;

class MediaLibraryController extends Controller
{
   
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Check role using column
        $isAdmin = $user->isAdmin(); // or $user->is_admin if boolean
        
        $query = Product::with('images');
        
        if ($isAdmin) {
            $query->with('business');
        } else {
            $query->where('business_id', $user->business->id);
        }
        
        $products = $query->latest()->get()->map(function ($product) use ($isAdmin) {
            $data = [
                'id' => $product->id,
                'name' => $product->name,
                'created_at' => $product->created_at,
                'images' => $product->images->map(fn($image) => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'is_primary' => $image->is_primary ?? false,
                    'has_background' => $image->has_background ?? true,
                    'uploaded_at' => $image->created_at,
                ]),
            ];
            
            if ($isAdmin) {
                $data['business_name'] = $product->business->name ?? 'N/A';
            }
            
            return $data;
        });
        
        return inertia('MediaLibrary/Index', [
            'productswithImages' => $products,
            'isAdmin' => $isAdmin,
        ]);
    }
    public function deleteImage(string $id)
    {
        try {
            $image = ProductImage::find($id);
    
            if (!$image) {
                throw new \Exception('Image not found.');
            }
    
            $image->delete();
            (new CloudinaryService())->deleteImage($id);
    
            return back()->with('success', 'Image deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Image deletion failed: {$e->getMessage()}");
            return back()->with('error', "Error: ".$e->getMessage());
        }
    }
    
    
}
