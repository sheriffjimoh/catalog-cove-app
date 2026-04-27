import { product, vendor } from "@/Types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const countryCurrencyMap: Record<string, { currency: string; locale: string }> = {
  NG: { currency: 'NGN', locale: 'en-NG' },
  US: { currency: 'USD', locale: 'en-US' },
  GH: { currency: 'GHS', locale: 'en-GH' },
  KE: { currency: 'KES', locale: 'en-KE' },
  GB: { currency: 'GBP', locale: 'en-GB' },
  ZA: { currency: 'ZAR', locale: 'en-ZA' },
  IN: { currency: 'INR', locale: 'en-IN' },
  CA: { currency: 'CAD', locale: 'en-CA' },
  AU: { currency: 'AUD', locale: 'en-AU' },
  EU: { currency: 'EUR', locale: 'de-DE' },
};

export function formatPrice(price: number | string | null | undefined, countryCode?: string): string {
  if (price === null || price === undefined || price === '') return '';
  
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.-]+/g, '')) 
    : price;
  
  if (isNaN(numericPrice)) return String(price);
  
  const config = countryCurrencyMap[countryCode || 'US'] || countryCurrencyMap['US'];
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  } catch {
    return `${config.currency} ${numericPrice.toLocaleString()}`;
  }
}


export const openMaps = (vendor: vendor) => {
  if (vendor?.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${vendor.coordinates}`, '_blank');
  }
};

export const openWhatsApp = (vendor: vendor, product?: product | null) => {
  if (vendor?.whatsapp) {
      const phone = vendor.whatsapp.replace(/[^0-9]/g, '');
      const message = product
          ? `Hi, I'm interested in ${product.name} — ${product.price}`
          : `Hi, I'd like to inquire about your products at ${vendor.name}.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }
};

export const handleShare = async (product: product) => {
  const shareData = {
      title: product?.name || '',
      text: `Check out ${product?.name} - ${product?.price}`,
      url: window.location.href
  };

  if (navigator.share) {
      try {
          await navigator.share(shareData);
      } catch (err) {
          console.log('Share cancelled');
      }
  } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
  }
};