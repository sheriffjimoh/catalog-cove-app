<?php

namespace App\Enums;

enum AnalyticsEventType: string
{
    case STORE_VISITED = 'store_visited';
    case PRODUCT_VIEWED = 'product_viewed';
    case INQUIRY_SENT = 'inquiry_sent';
    case PRODUCT_SHARED = 'product_shared';
}