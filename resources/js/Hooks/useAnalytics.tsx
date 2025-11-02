import { useEffect, useRef } from 'react';
import axios from 'axios';

interface TrackEventParams {
    businessId: number;
    eventType: 'store_visited' | 'product_viewed' | 'inquiry_sent' | 'product_shared';
    productId?: number;
}

const getVisitorId = (): string => {
    let visitorId = localStorage.getItem('visitor_id');
    
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitor_id', visitorId);
    }
    
    return visitorId;
};

export const useAnalytics = () => {
    const trackedEvents = useRef(new Set<string>());

    const trackEvent = async ({ businessId, eventType, productId }: TrackEventParams) => {
        // Prevent duplicate tracking in the same session
        const eventKey = `${eventType}_${businessId}_${productId || 'null'}`;
        
        if (trackedEvents.current.has(eventKey)) {
            return;
        }

        try {
            await axios.post('/api/analytics/track', {
                business_id: businessId,
                event_type: eventType,
                product_id: productId,
                visitor_id: getVisitorId(),
            });

            trackedEvents.current.add(eventKey);
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    };

    return { trackEvent };
};

// Hook for auto-tracking page views
export const usePageViewTracking = (
    businessId: number,
    eventType: 'store_visited' | 'product_viewed',
    productId?: number
) => {
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        trackEvent({ businessId, eventType, productId });
    }, [businessId, eventType, productId]);
};