<?php

namespace App\Services;

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

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
}
