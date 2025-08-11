<?php
require __DIR__ . '/vendor/autoload.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

// Replace with your actual Cloudinary URL
$cloudinaryUrl = 'cloudinary://716565799649827:b_Hgj1M3p4LsODE-vjVmUR7dflU@dy9yoeiq2';

// Configure Cloudinary
Configuration::instance($cloudinaryUrl);

// Test upload
try {
    $result = (new UploadApi())->upload(__DIR__ . '/public/images/logo.png');
    print_r($result);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
