<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use OpenAI\Laravel\Facades\OpenAI;
use Exception;

class AISuggestionController extends Controller
{
    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    public function suggest(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|max:5120', // max 5MB
                'type' => 'required|in:title,description,background',
            ]);

            // 1. Upload image temporarily to Cloudinary (ai_images folder)
            $filePath = $request->file('image')->getRealPath();
            $imageUrl = $this->cloudinary->uploadImage($filePath, 'ai_images');

            if (!$imageUrl) {
                throw new Exception("Image upload failed");
            }
            $type = $request->input('type'); // default to description

            if ($type === 'background') {
                $processedUrl = $this->cloudinary->removeBackground($filePath, 'ai_images');

                if (!$processedUrl) {
                    throw new Exception("Background removal failed");
                }

                return response()->json([
                    'success' => true,
                    'type' => $type,
                    'processed_url' => $processedUrl,
                ]);
            }

            // 2. Build prompt depending on type
            $prompt = match ($type) {
              'title' => "Write a short and natural product title based on this image. 
                Keep it simple and human, like a real product listing. 
                Identify the exact product name from this image, including the brand and model if visible (e.g., 'Apple iPhone 17') if possible.
                Do not add quotes, colons, or extra creative phrases — just return the plain name of the item.",

             'description' => "Write a friendly, engaging product description 
                that highlights what makes this item special. 
                Strict rule: The description MUST NOT exceed 500 characters (including spaces). 
                Do not write more than 500 characters. If it's longer, cut it short. 
                Identify the exact product name (brand + model) if visible, e.g., 'Apple iPhone 17'.",
                        
             default => throw new Exception("Invalid suggestion type: $type"),
            };

            // 3. Call OpenAI to get suggestions
            $result = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an assistant that helps write product listings. Keep answers clean and professional.'],
                    ['role' => 'user', 'content' => [
                        ['type' => 'text', 'text' => $prompt],
                        ['type' => 'image_url', 'image_url' => ['url' => $imageUrl]],
                    ]],
                ],
            ]);

            $suggestion = $result['choices'][0]['message']['content'] ?? null;

            if (!$suggestion) {
                throw new Exception("AI did not return a valid suggestion");
            }

            return response()->json([
                'success' => true,
                'image_url' => $imageUrl,
                'type' => $type,
                'suggestion' => $suggestion,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
