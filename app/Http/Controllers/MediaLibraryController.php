<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class MediaLibraryController extends Controller
{
   
    public function index()
    {
        return inertia('MediaLibrary/Index');
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
