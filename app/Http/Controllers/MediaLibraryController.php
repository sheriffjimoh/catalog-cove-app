<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Log;
use App\Models\Product;

class MediaLibraryController extends Controller
{

    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }
   
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
            $images = $product->images->map(fn($image, $index) => [
                'id' => $image->id,
                'url' => $image->url,
                'is_primary' => $index === 0, // First image is always primary
                'is_processed' => $image->is_processed ?? false,
                'has_background' => $image->has_background ?? true,
                'uploaded_at' => $image->created_at,
            ]);
        
            $data = [
                'id' => $product->id,
                'name' => $product->name,
                'created_at' => $product->created_at,
                'images' => $images,
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
    


    public function removeBackground(Request $request)
{
    try {
        $validated = $request->validate([
            'image_id' => 'required|integer|exists:product_images,id',
        ]);

        $image = ProductImage::findOrFail($validated['image_id']);
        
        // Check authorization - ensure user owns this product
        $product = $image->product;
        if ($product->business_id !== $request->user()->business->id && !$request->user()->isAdmin()) {
            return back()->with('error', 'Unauthorized action.');
        }

        // Check if background already removed
        if ($image->isProcessed) {
            return back()->with('info', 'Background already removed for this image.');
        }

        // Remove background using Cloudinary transformation
        $processedUrl = $this->cloudinary->removeBackground($image->url, 'ai_images');
        
        if (!$processedUrl) {
            throw new \Exception("Background removal failed");
        }

        // Update image record
        $image->update([
            'url' => $processedUrl,
            'is_processed' => true,
        ]);
       return back()->with('success', 'Background removed successfully!');
        
    } catch (\Exception $e) {
        Log::error('Background removal error: ' . $e->getMessage());
        return back()->with('error', 'Failed to remove background: ' . $e->getMessage());
    }
}
    
}
