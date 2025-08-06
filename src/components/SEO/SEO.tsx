import React from 'react';

const SEO: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free PNG, AVIF, JPEG & GIF to WebP Converter",
    "description": "Convert PNG, AVIF, JPEG, and GIF images to WebP format for free. Reduce file sizes by up to 90% while maintaining quality.",
    "url": "https://yourwebsite.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert PNG to WebP",
      "Convert JPEG to WebP", 
      "Convert AVIF to WebP",
      "Convert GIF to WebP",
      "Adjust image quality",
      "Browser-based conversion",
      "No file uploads required",
      "Batch conversion support"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default SEO;
