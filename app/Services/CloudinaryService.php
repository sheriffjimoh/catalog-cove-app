<?php

namespace App\Services;

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    public function __construct()
    {
        Configuration::instance(env('CLOUDINARY_URL'));
    }

    public function uploadImage($filePath, $folder = null)
    {
        $options = [];
        if ($folder) {
            $options['folder'] = $folder;
        }

        $result = (new UploadApi())->upload($filePath, $options);

        return $result['secure_url'] ?? null;
    }
    
    public function removeBackground($filePath, $folder = null)
    {
        $options = [
            "background_removal" => "cloudinary_ai", 
        ];

        if ($folder) {
            $options['folder'] = $folder;
        }

        $result = (new UploadApi())->upload($filePath, $options);

        Log::info('Background removal result: ' . json_encode($result));

        return $result['secure_url'] ?? null;
    }


    public function deleteImage(string $publicId): bool
    {
        try {
            return (new UploadApi())->destroy($publicId)['result'] === 'ok';
        } catch (\Exception $e) {
            Log::error("Cloudinary deletion error: {$e->getMessage()}");
            return false;
        }
    }
    
}
