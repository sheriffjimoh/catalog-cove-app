import { product, vendor } from "@/Types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const openMaps = (vendor: vendor) => {
  if (vendor?.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${vendor.coordinates}`, '_blank');
  }
};

export const openWhatsApp = (vendor: vendor, product: product) => {
  if (vendor?.whatsapp) {
      const message = `Hi, I'm interested in ${product?.name} - ${product?.price}`;
      window.open(`https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
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