import React from "react";

export function CorpJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Getmeds Philippines Inc. / 2MG Inc.",
    "alternateName": "Bishnoi Omniverse Philippines",
    "url": "https://getmeds.ph",
    "logo": "https://getmeds.ph/logo.png",
    "description": "FDA-licensed oncology medicine importer and distributor serving 500+ hospitals and pharmacies across the Philippines.",
    "telephone": "+63-917-156-9029",
    "email": "info@getmeds.ph",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Unit 301 & 305, 17 Vatican Bldg., Vatican City Drive, B.F. Resort Village, Talon II",
      "addressLocality": "Las Piñas City",
      "addressRegion": "Metro Manila",
      "addressCountry": "PH"
    },
    "hasCredential": [
      "FDA Philippines License to Operate (LTO)",
      "PDEA S-4 and S-5 Permits",
      "Bureau of Customs Accreditation"
    ],
    "priceRange": "$$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LlpJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "name": "Getmeds Healthcare (India LLP)",
    "alternateName": "Bishnoi Omniverse India Global Export Hub",
    "url": "https://getmedshealthcare.com",
    "description": "Global oncology exporter and pharmaceutical sourcing hub supplying WHO-GMP certified medicines to 54+ countries.",
    "telephone": "+91-91907-69100",
    "email": "care2@getmeds.in",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "areaServed": "Worldwide (54+ Countries)"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
