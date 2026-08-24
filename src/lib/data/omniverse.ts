// src/lib/data/omniverse.ts

export const omniverseData = {
  // ---------- BRAND & LEGACY (Shared Across All) ----------
  brand: {
    name: "Bishnoi Omniverse",
    tagline: "Rooted in five hundred years. Building for what comes next.",
    legacy:
      "For over five centuries, the Bishnoi tradition has championed strict personal discipline, ecological conservation, and selfless protection of life. This enduring philosophy guides our commitment to uncompromised quality, zero-waste logistics, and compassionate care.",
    founder: {
      name: "Naresh Kumar Bishnoi",
      title: "Oncology Medicine Supply Specialist",
      esmo: true,
      esmoLink: "https://www.esmo.org/",
      quote:
        "A box of medicine isn't a product. It's a stage-IV oncology mother in Cebu waiting for her next dose. We exist so distance, cost, and complexity never decide who lives.",
      quoteHi:
        "दवा का एक बॉक्स उत्पाद नहीं है। यह सेबू में एक स्टेज-IV ऑन्कोलॉजी मां है जो अपनी अगली खुराक की प्रतीक्षा कर रही है। हम इसलिए मौजूद हैं ताकि दूरी, लागत और जटिलता कभी यह तय न करें कि कौन जीवित रहेगा।",
    },
  },

  // ---------- GLOBAL METRICS (Shared Across All) ----------
  metrics: {
    countries: 54,
    molecules: 2000,
    hospitals: 500,
    pharmacies: 10000,
    patients: 2000000,
    manufacturers: 50,
    partnerClinics: 226,
    patientsHelped: 22666,
  },

  // ---------- PRODUCT PORTFOLIO (Shared Across All) ----------
  products: {
    carboget: {
      brand: "Carboget",
      generic: "Carboplatin",
      indication: "Ovarian, lung, bladder cancers",
      indicationHi: "अंडाशय, फेफड़े, मूत्राशय के कैंसर",
    },
    borteget: {
      brand: "BorteGet",
      generic: "Bortezomib",
      indication: "Multiple Myeloma, Mantle Cell Lymphoma",
      indicationHi: "मल्टीपल मायलोमा, मेंटल सेल लिंफोमा",
    },
    bendaget: {
      brand: "BendaGet",
      generic: "Bendamustine HCl",
      indication: "CLL, Hodgkin/Non-Hodgkin's Lymphoma",
      indicationHi: "सीएलएल, हॉजकिन/नॉन-हॉजकिन लिंफोमा",
    },
    abiraget: {
      brand: "AbiraGet",
      generic: "Abiraterone Acetate",
      indication: "Metastatic castration-resistant Prostate Cancer",
      indicationHi: "मेटास्टेटिक कैस्ट्रेशन-प्रतिरोधी प्रोस्टेट कैंसर",
    },
    capeget: {
      brand: "CapeGet",
      generic: "Capecitabine",
      indication: "Advanced Breast, Colorectal, and Gastric cancers",
      indicationHi: "उन्नत स्तन, कोलोरेक्टल और गैस्ट्रिक कैंसर",
    },
    temoget: {
      brand: "TemoGet",
      generic: "Temozolomide",
      indication: "Glioblastoma Multiforme and brain tumors",
      indicationHi: "ग्लियोब्लास्टोमा मल्टीफॉर्म और मस्तिष्क ट्यूमर",
    },
    anagaling: {
      brand: "AnaGaling",
      generic: "Anastrozole",
      indication: "Hormone receptor-positive Breast Cancer",
      indicationHi: "हार्मोन रिसेप्टर-पॉजिटिव स्तन कैंसर",
    },
  },

  // ---------- BRANCHES ----------
  branches: {
    // ============================================================
    // PHILIPPINES OPERATIONS (CORP) – ENGLISH ONLY
    // ============================================================
    corp: {
      domain: "getmeds.ph",
      locale: "en-PH",
      languages: ["en"], // Only English
      role: "Local Importer, Distributor & Hospital Supplier",
      audience:
        "Philippine hospitals, government agencies, local patients, and pharmacies",
      description:
        "Getmeds Philippines Inc. / 2MG Inc. is an SEC-registered, FDA-licensed pharmaceutical corporation serving 500+ hospitals and 2 Million+ Filipino patients.",
      metrics: {
        hospitals: 500,
        pharmacies: 10000,
        patients: 2000000,
      },
      licenses: [
        "FDA Philippines License to Operate (LTO)",
        "PDEA S-4 and S-5 permits",
        "Bureau of Customs (BOC) clearance",
        "SEC Registration",
        "DSWD, PCSO, OVP, OP accredited supplier",
        "WHO GSDP Cold-Chain compliant",
      ],
      address: {
        line1: "Unit 301 & 305, 17 Vatican Bldg., Vatican City Drive",
        line2: "B.F. Resort Village, Talon II, Las Piñas City",
        city: "Metro Manila",
        country: "Philippines",
      },
      phone: "+63 917 156 9029",
      emails: {
        general: "info@getmeds.ph",
        sales: "sales5@2mginc.com",
      },
      hours: "Mon–Sat: 8:00 AM – 6:00 PM (PHT) | 24/7 Emergency Hospital Dispatch",
      policyNote:
        "As a Philippine corporation, we operate under the Revised Corporation Code of the Philippines and are regulated by the FDA Philippines, PDEA, and SEC. All products are FDA-registered and compliant with local pharmaceutical regulations.",

      // ---------- PAGES (ENGLISH ONLY) ----------
      pages: {
        home: {
          url: "/corp/",
          metaTitle: "Getmeds PH – Oncology & Hospital Medicine Supplier",
          metaDescription:
            "FDA-licensed oncology medicine distributor in the Philippines. Trusted by 500+ hospitals. WHO cold-chain logistics & 24–48hr nationwide delivery.",
          h1: "Saving Lives Across the Philippines: FDA-Licensed Oncology & Critical Care Pharmaceutical Supply",
          h2s: [
            "Bridging Global Pharmaceutical Innovation with Philippine Healthcare",
            "Trusted Hospital Formulary & Government Tender Partner",
            "Specialized Therapeutic Portfolios for Critical Patient Care",
          ],
          h3s: [
            "WHO GSDP Cold-Chain Excellence (2°C to 8°C Monitored Logistics)",
            "Accredited Government Medical Assistance Fulfillment (DSWD, PCSO, OVP, OP)",
            "Urgent 24 to 48-Hour Nationwide Response for Hospitals",
          ],
          content:
            "At Getmeds Philippines Inc. and 2MG Inc., we believe that a box of medicine isn't a product. It's a stage-IV oncology mother in Cebu waiting for her next dose. Operating under the unified brand identity of the Bishnoi Omniverse, we are SEC-registered, FDA-licensed pharmaceutical importers and distributors dedicated to ensuring that distance, cost, and logistics never decide who lives in the Philippines. With an active distribution network serving 500+ public and private hospitals, 10,000+ retail and clinical pharmacies, and over 2 Million+ Filipino patient lives touched, we bring world-class oncology, hematology, anesthesiology, anti-infective, cardiology, and endocrinology therapies directly to healthcare providers across Luzon, Visayas, and Mindanao. Sourced from audited facilities meeting WHO, PIC/S, US FDA, EU MHRA, and UK MHRA standards through our global supply network, every product undergoes strict regulatory oversight, FDA Certificate of Product Registration (CPR) validation, and PDEA S-4/S-5 compliance.",
          ctas: [
            { text: "Explore Oncology Portfolio →", url: "/corp/oncology-medicines" },
            { text: "Hospital Supply & Tender Inquiries", url: "/corp/hospital-supply" },
            { text: "Global Sourcing & Export Hub", url: "/llp" },
          ],
          keywords: [
            "Oncology medicine distributor Philippines",
            "Hospital pharmaceutical supplier Philippines",
            "FDA-licensed cancer medicines Philippines",
            "Cold-chain medicine delivery Philippines",
            "Government medical tender supplier Philippines",
          ],
        },

        about: {
          url: "/corp/about",
          metaTitle: "About Getmeds Philippines – Oncology & Hospital Supplier",
          metaDescription:
            "Getmeds Philippines Inc. is an SEC-registered, FDA-licensed pharmaceutical corp serving 2M+ patients & 500+ hospitals. Guided by Bishnoi legacy.",
          h1: "Rooted in Five Hundred Years. Building for What Comes Next in Philippine Healthcare.",
          h2s: [
            "Our Story: From a 500-Year Heritage of Service to Modern Medicine Access",
            "Executive Leadership & Oncology Expertise",
            "Full Regulatory Compliance & Government Program Accreditation",
          ],
          h3s: [
            "Naresh Kumar Bishnoi (Oncology Supply Specialist & ESMO Member)",
            "Accredited Supplier for DSWD, PCSO, OVP, and OP Grants",
            "WHO GSDP Cold-Chain Warehousing in Metro Manila",
          ],
          content:
            "Getmeds Philippines Inc. / 2MG Inc. was founded on an enduring commitment to discipline, environmental stewardship, and community service — values drawn from the 500-year Bishnoi legacy. We exist so that healthcare providers and cancer patients across the Philippine archipelago have reliable, uninterrupted access to essential, high-efficacy pharmaceuticals. We exist so distance, cost, and complexity never decide who lives. Under the leadership of Naresh Kumar Bishnoi, Oncology Medicine Supply Specialist and member of the European Society for Medical Oncology (ESMO), our team combines clinical oncology insight with operational supply chain execution. Today, Getmeds Philippines operates from Vatican City Drive, Las Piñas City, holding full FDA License to Operate (LTO) accreditation, PDEA S-4 and S-5 permits for controlled substances, Bureau of Customs import clearances, and official supplier accreditations for public medical assistance grants from DSWD, PCSO, the Office of the Vice President (OVP), and the Office of the President (OP).",
          ctas: [
            { text: "View Full Oncology Portfolio", url: "/corp/oncology-medicines" },
            { text: "Contact Hospital Account Team", url: "/corp/contact" },
          ],
          keywords: [
            "Getmeds Philippines corporation",
            "Naresh Kumar Bishnoi ESMO oncology",
            "FDA LTO PDEA licensed distributor Las Pinas",
            "Accredited supplier DSWD PCSO OVP OP",
            "Philippine pharmaceutical corporation about",
          ],
        },

        oncology: {
          url: "/corp/oncology-medicines",
          metaTitle: "Cancer Medicines Philippines – FDA Oncology Distributor",
          metaDescription:
            "FDA-registered oncology medicines in the Philippines. Carboget, BorteGet, BendaGet, AbiraGet, CapeGet, TemoGet, AnaGaling. Chemotherapy & targeted care.",
          h1: "FDA-Registered Oncology & Hematology Portfolio for Cancer Care in the Philippines",
          h2s: [
            "High-Efficacy Chemotherapy & Targeted Cancer Therapies",
            "Solid Tumor & Hematologic Malignancy Coverage",
            "Patient Assistance & Compassionate Access Programs",
          ],
          h3s: [
            "Featured Branded Products (Carboget, BorteGet, BendaGet, AbiraGet, CapeGet, TemoGet, AnaGaling)",
            "Rigorous Quality & PDEA / FDA Regulatory Verification",
            "Support for PAP, NPAP, and FDA Compassionate Special Permits (CSP)",
          ],
          content:
            "In cancer care, time is everything. A delay in chemotherapy availability can change patient outcomes. That is why Getmeds Philippines Inc. / 2MG Inc. maintains a robust stock of FDA-registered oncology and hematology medicines, serving medical centers, outpatient chemotherapy units, and specialty clinics nationwide. Our portfolio includes essential branded pharmaceuticals: Carboget (Carboplatin) for ovarian, lung, and bladder cancers; BorteGet (Bortezomib) for Multiple Myeloma and Mantle Cell Lymphoma; BendaGet (Bendamustine HCl) for CLL and Lymphomas; AbiraGet (Abiraterone Acetate) for metastatic Prostate Cancer; CapeGet (Capecitabine) for Breast, Colorectal, and Gastric cancers; TemoGet (Temozolomide) for Glioblastoma; and AnaGaling (Anastrozole) for hormone receptor-positive Breast Cancer. We also assist oncologists and hospitals with Patient Assistance Programs (PAP), Named-Patient Access (NPAP), and obtaining FDA Philippines Compassionate Special Permits (CSP) for emergency treatments.",
          ctas: [
            { text: "Request Product Quotation", url: "/corp/contact" },
            { text: "Hospital Supply Information", url: "/corp/hospital-supply" },
          ],
          keywords: [
            "Cancer medicines Philippines price",
            "Carboplatin Bortezomib Capecitabine Philippines",
            "FDA registered chemotherapy drugs Philippines",
            "Compassionate special permit oncology Philippines",
            "Oncology distributor Manila Philippines",
          ],
        },

        hospital: {
          url: "/corp/hospital-supply",
          metaTitle: "Hospital Pharmaceutical Supplier Philippines – Oncology ICU",
          metaDescription:
            "Trusted hospital pharmaceutical supplier for 500+ Philippine hospitals. Cold-chain logistics, urgent ICU delivery & government tender expertise.",
          h1: "Premier Hospital Pharmaceutical Supplier in the Philippines: Serving 500+ Medical Institutions",
          h2s: [
            "Unmatched Reliability for Public, Private & LGU Hospitals",
            "Comprehensive Departmental Portfolio Coverage",
            "Seamless 5-Step Hospital Partnership Workflow",
          ],
          h3s: [
            "24 to 48-Hour Rapid Urgent Hospital Delivery",
            "WHO GSDP Cold-Chain Temperature Logging (2°C to 8°C)",
            "Direct Fulfillment for DSWD, PCSO, OVP & OP Guarantee Letters",
          ],
          content:
            "Getmeds Philippines Inc. / 2MG Inc. is a trusted institutional partner for 500+ healthcare facilities across Luzon, Visayas, and Mindanao. We support Hospital Pharmacy & Therapeutics (P&T) committees, procurement heads, and chief pharmacists with reliable inventory forecasting, complete regulatory dossiers, and competitive pricing. Our supply portfolio covers essential hospital departments: Oncology & Chemotherapy Units (infusions, oral targeted therapies, and supportive anti-emetics); Hematology & Transplant Units (specialized regimens for leukemia, lymphoma, and multiple myeloma); ICU & Operating Rooms (emergency anesthetics, muscle relaxants, and sedatives); Infectious Disease Units (reserve IV broad-spectrum antibiotics and antivirals); Cardiology & Emergency (IV anti-hypertensives and cardiac care injections); and Endocrinology (glycemic management solutions and hormonal therapies). With our 24–48 hour rapid dispatch and WHO GSDP-certified cold-chain handling, hospital pharmacies can rely on zero stockouts for critical care.",
          ctas: [
            { text: "Contact Hospital Account Team", url: "/corp/contact" },
            { text: "View Oncology Portfolio", url: "/corp/oncology-medicines" },
          ],
          keywords: [
            "Hospital pharmaceutical supplier Philippines",
            "Hospital medicine bidding DOH LGU Philippines",
            "ICU emergency medicine delivery Philippines",
            "Cold-chain hospital logistics Metro Manila",
            "PCSO DSWD OVP accredited medicine supplier",
          ],
        },

        partnerships: {
          url: "/corp/partnerships",
          metaTitle: "Pharma Partnerships Philippines – FDA Registration & Supply",
          metaDescription:
            "Partner with an FDA-licensed pharmaceutical distributor in the Philippines. Registration management, hospital marketing & nationwide distribution.",
          h1: "Strategic Pharmaceutical Partnerships: Your Gateway to the Philippine Healthcare Market",
          h2s: [
            "Complete Regulatory & Market Access Solutions for Global Manufacturers",
            "Sourcing Network Across India, China, Europe, and the USA",
            "End-to-End Philippine Market Entry Workflow",
          ],
          h3s: [
            "FDA Philippines Certificate of Product Registration (CPR) Management",
            "Direct Commercial Access to 500+ Hospitals & 10,000+ Pharmacies",
            "Bureau of Customs Clearance & WHO GSDP Warehousing",
          ],
          content:
            "Expanding into the Philippine pharmaceutical market requires regulatory expertise, strong distributor relationships, and compliant cold-chain infrastructure. Getmeds Philippines Inc. / 2MG Inc. provides global pharmaceutical manufacturers with a complete local partnership platform. We manage the entire commercial lifecycle: Regulatory Dossier Submission for securing FDA Philippines CPRs and PDEA permits; Importation & Customs Handling via our BOC-accredited pipeline; Warehousing & Distribution with temperature-monitored storage in Metro Manila and distribution to 500+ public and private hospitals; and Government Tender Representation with compliant bids for DOH, LGU, and public hospital tenders. We maintain active partnerships with 50+ manufacturers in India, China, Europe, and the US, bringing certified medicines to Filipino providers.",
          ctas: [
            { text: "Contact Business Development (sales5@2mginc.com)", url: "/corp/contact" },
            { text: "Global Export Partnerships", url: "/llp/global-partnerships" },
          ],
          keywords: [
            "Philippine pharmaceutical distributor partner",
            "FDA Philippines CPR registration manager",
            "Import oncology medicines Philippines",
            "Distribute pharma products Philippines 2MG Inc",
            "Pharma market entry Philippines",
          ],
        },

        contact: {
          url: "/corp/contact",
          metaTitle: "Contact Getmeds Philippines – Hospital & Medicine Inquiries",
          metaDescription:
            "Contact Getmeds Philippines for oncology medicines, hospital supply, or government tender inquiries. We reply within one business day.",
          h1: "Contact Getmeds Philippines Inc. / 2MG Inc.",
          h2s: [
            "Submit Your Hospital, Tender, or Medicine Inquiry",
            "Registered Office & Contact Channels",
            "24/7 Hospital Emergency Logistics & Business Hours",
          ],
          h3s: [
            "Las Piñas City Registered Office Location",
            "Direct Telephone & Sales Email Channels",
            "International Export Inquiries",
          ],
          content:
            "Whether you are a hospital procurement officer requiring emergency oncology stock, a government agency preparing tender specifications, a global manufacturer exploring Philippine distribution, or a patient seeking medicine access, our account managers respond within one business day. Registered Office Address: Getmeds Philippines Inc. / 2MG Inc., Unit 301 & 305, 17 Vatican Bldg., Vatican City Drive, B.F. Resort Village, Talon II, Las Piñas City, Metro Manila, Philippines. Phone/Mobile: +63 917 156 9029. General & Hospital Inquiries: info@getmeds.ph. B2B / Manufacturer Partnerships: sales5@2mginc.com. Hours: Mon–Sat: 8:00 AM – 6:00 PM (PHT) | 24/7 Emergency Hospital Dispatch.",
          ctas: [
            { text: "Submit Online Inquiry", url: "/corp/contact" },
            { text: "Global Export Inquiries", url: "/llp/contact" },
          ],
          keywords: [
            "Contact Getmeds Philippines",
            "2MG Inc Las Pinas contact number",
            "Oncology medicine inquiry Philippines",
            "info@getmeds.ph sales5@2mginc.com",
            "Getmeds Philippines office address",
          ],
        },
      },
    },

    // ============================================================
    // INDIA GLOBAL EXPORT HUB (LLP) – ENGLISH + HINDI
    // ============================================================
    llp: {
      domain: "getmedshealthcare.com",
      locale: "en-IN",
      languages: ["en", "hi"], // English + Hindi
      role: "Global Sourcing, Export & Wholesale Hub",
      roleHi: "वैश्विक सोर्सिंग, निर्यात और थोक केंद्र",
      audience:
        "International distributors, global hospitals, export buyers, and manufacturers",
      audienceHi:
        "अंतर्राष्ट्रीय वितरक, वैश्विक अस्पताल, निर्यात खरीदार और निर्माता",
      description:
        "Getmeds Healthcare (India LLP) is the global sourcing and export hub of the Bishnoi Omniverse. We source from WHO-GMP, US FDA, EU MHRA certified plants and supply oncology & specialty medicines to 54+ countries.",
      descriptionHi:
        "गेटमेड्स हेल्थकेयर (इंडिया एलएलपी) बिश्नोई ओम्निवर्स का वैश्विक सोर्सिंग और निर्यात केंद्र है। हम WHO-GMP, US FDA, EU MHRA प्रमाणित संयंत्रों से सोर्सिंग करते हैं और 54+ देशों में ऑन्कोलॉजी और विशेष दवाओं की आपूर्ति करते हैं।",
      metrics: {
        countries: 54,
        molecules: 2000,
        manufacturers: 50,
        patientsHelped: 22666,
        partnerClinics: 226,
      },
      sourcing: ["WHO-GMP", "PIC/S", "US FDA", "EU MHRA", "UK MHRA"],
      sourcingHi: [
        "WHO-GMP",
        "PIC/S",
        "US FDA",
        "EU MHRA",
        "UK MHRA",
      ],
      address: {
        city: "Mumbai",
        cityHi: "मुंबई",
        state: "Maharashtra",
        stateHi: "महाराष्ट्र",
        country: "India",
        countryHi: "भारत",
      },
      phone: "+91 91907 69100",
      emails: {
        general: "care2@getmeds.in",
      },
      hours: "Mon–Fri: 9:00 AM – 6:00 PM (IST) | Priority Freight Logistics",
      hoursHi: "सोम–शुक्र: सुबह 9:00 – शाम 6:00 (IST) | प्राथमिकता माल ढुलाई लॉजिस्टिक्स",
      policyNote:
        "As an Indian LLP, we operate under the Limited Liability Partnership Act, 2008, and are regulated by the Ministry of Corporate Affairs, Government of India. Our exports comply with the Indian Drugs and Cosmetics Act, 1940, and international pharmaceutical trade regulations.",
      policyNoteHi:
        "एक भारतीय एलएलपी के रूप में, हम लिमिटेड लायबिलिटी पार्टनरशिप अधिनियम, 2008 के तहत काम करते हैं और भारत सरकार के कॉर्पोरेट मामलों के मंत्रालय द्वारा विनियमित होते हैं। हमारे निर्यात भारतीय औषधि और प्रसाधन अधिनियम, 1940 और अंतर्राष्ट्रीय फार्मास्युटिकल व्यापार नियमों का पालन करते हैं।",

      // ---------- PAGES (ENGLISH + HINDI) ----------
      pages: {
        home: {
          url: "/llp/",
          // ----- ENGLISH -----
          en: {
            metaTitle: "Getmeds Healthcare India – Global Oncology Exporter",
            metaDescription:
              "Global pharmaceutical export hub serving 54+ countries. Sourcing oncology & specialty medicines from WHO-GMP, US FDA, EU MHRA certified plants.",
            h1: "Global Oncology Supply — Sourced from India. Delivered Worldwide.",
            h2s: [
              "Connecting Global Healthcare with High-Quality Specialty Pharmaceuticals",
              "Sourcing from 50+ Certified Manufacturers Worldwide",
              "Core Competencies: Sourcing, Compliance, Cold-Chain & Global Logistics",
            ],
            h3s: [
              "54+ Countries Served Across Asia-Pacific, Middle East, Africa & Americas",
              "2,000+ Active Molecules Sourced Under 5 International Quality Standards",
              "Proven Impact: 22,666+ Patients Helped & 226+ Partner Clinics Worldwide",
            ],
            content:
              "Getmeds Healthcare (India LLP) is the global sourcing, export, and wholesale hub of the Bishnoi Omniverse. Operating from Mumbai, Maharashtra, India, we bridge world-class pharmaceutical manufacturing with healthcare systems, distributors, and hospitals across 54+ countries. We exist so that distance, cost, and logistics never restrict patient access to life-saving cancer care and critical care therapies anywhere in the world. With an export catalog exceeding 2,000+ active molecules and strategic partnerships with 50+ manufacturers in India, China, Europe, and the USA, every shipment complies with five international quality standards: WHO, PIC/S, US FDA, EU MHRA, and UK MHRA.",
            ctas: [
              { text: "Explore Export Portfolio →", url: "/llp/oncology-export-portfolio" },
              { text: "Become a Global Partner", url: "/llp/global-partnerships" },
              { text: "Visit Philippines Portal", url: "/corp" },
            ],
            keywords: [
              "Global oncology exporter India",
              "Sourcing pharmaceutical exporter WHO-GMP India",
              "Export cancer medicines 54 countries",
              "Getmeds Healthcare India LLP",
              "Specialty medicine wholesale exporter",
            ],
          },
          // ----- HINDI -----
          hi: {
            metaTitle: "गेटमेड्स हेल्थकेयर इंडिया – वैश्विक ऑन्कोलॉजी निर्यातक",
            metaDescription:
              "54+ देशों की सेवा करने वाला वैश्विक फार्मास्युटिकल निर्यात केंद्र। WHO-GMP, US FDA, EU MHRA प्रमाणित संयंत्रों से ऑन्कोलॉजी और विशेष दवाओं की सोर्सिंग।",
            h1: "वैश्विक ऑन्कोलॉजी आपूर्ति — भारत से सोर्सिंग। दुनिया भर में वितरण।",
            h2s: [
              "उच्च गुणवत्ता वाली विशेष फार्मास्युटिकल्स के साथ वैश्विक स्वास्थ्य सेवा को जोड़ना",
              "दुनिया भर के 50+ प्रमाणित निर्माताओं से सोर्सिंग",
              "मुख्य क्षमताएं: सोर्सिंग, अनुपालन, कोल्ड-चेन और वैश्विक लॉजिस्टिक्स",
            ],
            h3s: [
              "एशिया-प्रशांत, मध्य पूर्व, अफ्रीका और अमेरिका में 54+ देशों में सेवा",
              "5 अंतर्राष्ट्रीय गुणवत्ता मानकों के तहत 2,000+ सक्रिय अणुओं की सोर्सिंग",
              "सिद्ध प्रभाव: 22,666+ रोगियों की मदद और दुनिया भर में 226+ सहयोगी क्लीनिक",
            ],
            content:
              "गेटमेड्स हेल्थकेयर (इंडिया एलएलपी) बिश्नोई ओम्निवर्स का वैश्विक सोर्सिंग, निर्यात और थोक केंद्र है। भारत के मुंबई, महाराष्ट्र से संचालित, हम 54+ देशों में स्वास्थ्य प्रणालियों, वितरकों और अस्पतालों के साथ विश्व स्तरीय फार्मास्युटिकल निर्माण को जोड़ते हैं। हम इसलिए मौजूद हैं ताकि दूरी, लागत और लॉजिस्टिक्स कभी भी दुनिया में कहीं भी जीवन रक्षक कैंसर देखभाल और गहन देखभाल चिकित्सा तक रोगी की पहुंच को प्रतिबंधित न करें। 2,000+ सक्रिय अणुओं की निर्यात सूची और भारत, चीन, यूरोप और अमेरिका में 50+ निर्माताओं के साथ रणनीतिक साझेदारी के साथ, प्रत्येक शिपमेंट पांच अंतरराष्ट्रीय गुणवत्ता मानकों का अनुपालन करता है: WHO, PIC/S, US FDA, EU MHRA, और UK MHRA।",
            ctas: [
              { text: "निर्यात पोर्टफोलियो देखें →", url: "/llp/oncology-export-portfolio" },
              { text: "वैश्विक भागीदार बनें", url: "/llp/global-partnerships" },
              { text: "फिलीपींस पोर्टल देखें", url: "/corp" },
            ],
            keywords: [
              "भारत वैश्विक ऑन्कोलॉजी निर्यातक",
              "WHO-GMP भारत फार्मास्युटिकल निर्यातक सोर्सिंग",
              "54 देशों को कैंसर दवाओं का निर्यात",
              "गेटमेड्स हेल्थकेयर इंडिया एलएलपी",
              "विशेष दवा थोक निर्यातक",
            ],
          },
        },

        about: {
          url: "/llp/about",
          en: {
            metaTitle: "About Getmeds Healthcare India – Global Oncology Exporter",
            metaDescription:
              "Getmeds Healthcare India is the global export arm of Bishnoi Omniverse. Serving 54+ countries with 2,000+ oncology & specialty molecules.",
            h1: "About Getmeds Healthcare India — The Global Export Hub of the Bishnoi Omniverse",
            h2s: [
              "Guiding Global Access Through Heritage and Ethical Responsibility",
              "Executive Leadership & Clinical Vision",
              "Global Reach & Omniverse Ecosystem Structure",
            ],
            h3s: [
              "Naresh Kumar Bishnoi (Oncology Supply Specialist & ESMO Member)",
              "22,666+ Patients Helped & 226+ Partner Clinics Worldwide",
              "Regional Operational Presence (India, Singapore, Pacific, Caribbean)",
            ],
            content:
              "Getmeds Healthcare (India LLP) was established as the global export and sourcing arm of the Bishnoi Omniverse. Guided by the 500-year Bishnoi legacy of discipline, environmental conservation, and service, our mission is to eliminate geographical barriers to life-saving medicines. Led by Naresh Kumar Bishnoi, Oncology Medicine Supply Specialist and ESMO member, our organization coordinates international procurement, quality audits, export documentation, and cold-chain freight from Mumbai, Maharashtra. To date, our global network has served patients across 54+ countries, supported 226+ partner clinics, established the Pacific's first specialty oncology pharmacy serving Vanuatu and Fiji, and registered regional entities in Singapore (Getmeds HealthTech Pte. Ltd.) and the Caribbean (Saint Kitts and Nevis).",
            ctas: [
              { text: "View Oncology Export Portfolio", url: "/llp/oncology-export-portfolio" },
              { text: "Contact Global Export Team", url: "/llp/contact" },
            ],
            keywords: [
              "Getmeds Healthcare India LLP about",
              "Naresh Kumar Bishnoi global oncology supply",
              "Pharmaceutical exporter Mumbai Maharashtra",
              "Bishnoi Omniverse global export",
              "Cancer medicine exporter 54 countries",
            ],
          },
          hi: {
            metaTitle: "गेटमेड्स हेल्थकेयर इंडिया के बारे में – वैश्विक ऑन्कोलॉजी निर्यातक",
            metaDescription:
              "गेटमेड्स हेल्थकेयर इंडिया बिश्नोई ओम्निवर्स की वैश्विक निर्यात शाखा है। 54+ देशों में 2,000+ ऑन्कोलॉजी और विशेष अणुओं के साथ सेवा।",
            h1: "गेटमेड्स हेल्थकेयर इंडिया के बारे में — बिश्नोई ओम्निवर्स का वैश्विक निर्यात केंद्र",
            h2s: [
              "विरासत और नैतिक जिम्मेदारी के माध्यम से वैश्विक पहुंच का मार्गदर्शन",
              "कार्यकारी नेतृत्व और नैदानिक दृष्टि",
              "वैश्विक पहुंच और ओम्निवर्स पारिस्थितिकी तंत्र संरचना",
            ],
            h3s: [
              "नरेश कुमार बिश्नोई (ऑन्कोलॉजी आपूर्ति विशेषज्ञ और ESMO सदस्य)",
              "22,666+ रोगियों की मदद और दुनिया भर में 226+ सहयोगी क्लीनिक",
              "क्षेत्रीय परिचालन उपस्थिति (भारत, सिंगापुर, प्रशांत, कैरिबियन)",
            ],
            content:
              "गेटमेड्स हेल्थकेयर (इंडिया एलएलपी) को बिश्नोई ओम्निवर्स की वैश्विक निर्यात और सोर्सिंग शाखा के रूप में स्थापित किया गया था। अनुशासन, पर्यावरण संरक्षण और सेवा की 500 साल पुरानी बिश्नोई विरासत द्वारा निर्देशित, हमारा मिशन जीवन रक्षक दवाओं के लिए भौगोलिक बाधाओं को समाप्त करना है। नरेश कुमार बिश्नोई, ऑन्कोलॉजी मेडिसिन सप्लाई विशेषज्ञ और ESMO सदस्य के नेतृत्व में, हमारा संगठन मुंबई, महाराष्ट्र से अंतर्राष्ट्रीय खरीद, गुणवत्ता ऑडिट, निर्यात दस्तावेज़ीकरण और कोल्ड-चेन माल ढुलाई का समन्वय करता है। आज तक, हमारे वैश्विक नेटवर्क ने 54+ देशों में रोगियों की सेवा की है, 226+ सहयोगी क्लीनिकों का समर्थन किया है, वानुअतु और फिजी की सेवा करने वाली प्रशांत की पहली विशेष ऑन्कोलॉजी फार्मेसी स्थापित की है, और सिंगापुर (गेटमेड्स हेल्थटेक पीटीई लिमिटेड) और कैरिबियन (सेंट किट्स और नेविस) में क्षेत्रीय संस्थाओं को पंजीकृत किया है।",
            ctas: [
              { text: "ऑन्कोलॉजी निर्यात पोर्टफोलियो देखें", url: "/llp/oncology-export-portfolio" },
              { text: "वैश्विक निर्यात टीम से संपर्क करें", url: "/llp/contact" },
            ],
            keywords: [
              "गेटमेड्स हेल्थकेयर इंडिया एलएलपी के बारे में",
              "नरेश कुमार बिश्नोई वैश्विक ऑन्कोलॉजी आपूर्ति",
              "मुंबई महाराष्ट्र फार्मास्युटिकल निर्यातक",
              "बिश्नोई ओम्निवर्स वैश्विक निर्यात",
              "54 देशों को कैंसर दवा निर्यातक",
            ],
          },
        },

        oncology: {
          url: "/llp/oncology-export-portfolio",
          en: {
            metaTitle: "Oncology Export Portfolio – Cancer Medicines | Getmeds",
            metaDescription:
              "Export-quality oncology medicines available for global wholesale distribution. Chemotherapy & targeted therapies. Sourced from WHO-GMP certified facilities.",
            h1: "Our Oncology Export Portfolio — Available for Global Distribution",
            h2s: [
              "High-Efficacy Chemotherapy & Targeted Cancer Therapies for Export",
              "Branded Pharmaceuticals Available for Worldwide Shipment",
              "Multi-National Regulatory Compliance & Patient Access Programs",
            ],
            h3s: [
              "Featured Branded Export Portfolio (Carboget, BorteGet, BendaGet, AbiraGet, CapeGet, TemoGet, AnaGaling)",
              "Five Core Certifications (WHO, PIC/S, US FDA, EU MHRA, UK MHRA)",
              "International PAP, NPAP, and Compassionate Permit Access",
            ],
            content:
              "Getmeds Healthcare (India LLP) exports high-quality, cold-chain compliant oncology and hematology medicines to international distributors, hospital groups, and health ministries in 54+ countries. Our global oncology catalog features essential branded pharmaceuticals: Carboget (Carboplatin) for ovarian, lung, and bladder cancer protocols; BorteGet (Bortezomib) for Multiple Myeloma and Mantle Cell Lymphoma; BendaGet (Bendamustine HCl) for CLL and Lymphomas; AbiraGet (Abiraterone Acetate) for metastatic Prostate Cancer; CapeGet (Capecitabine) for Breast, Colorectal, and Gastric cancers; TemoGet (Temozolomide) for Glioblastoma; and AnaGaling (Anastrozole) for breast cancer. Every batch includes full COA and COPP documentation, packed in validated WHO GSDP thermal containers.",
            ctas: [
              { text: "Request Global Export Quote", url: "/llp/contact" },
              { text: "Explore Sourcing & Quality Standards", url: "/llp/sourcing-supply-chain" },
            ],
            keywords: [
              "Oncology export catalog India",
              "Carboplatin Bortezomib exporter India",
              "Wholesale cancer medicine export WHO-GMP",
              "Buy oncology injectables India exporter",
              "Named patient oncology supply international",
            ],
          },
          hi: {
            metaTitle: "ऑन्कोलॉजी निर्यात पोर्टफोलियो – कैंसर दवाएं | गेटमेड्स",
            metaDescription:
              "निर्यात-गुणवत्ता वाली ऑन्कोलॉजी दवाएं वैश्विक थोक वितरण के लिए उपलब्ध। कीमोथेरेपी और लक्षित चिकित्सा। WHO-GMP प्रमाणित सुविधाओं से सोर्सिंग।",
            h1: "हमारा ऑन्कोलॉजी निर्यात पोर्टफोलियो — वैश्विक वितरण के लिए उपलब्ध",
            h2s: [
              "निर्यात के लिए उच्च-प्रभावी कीमोथेरेपी और लक्षित कैंसर चिकित्सा",
              "दुनिया भर में शिपमेंट के लिए उपलब्ध ब्रांडेड फार्मास्युटिकल्स",
              "बहु-राष्ट्रीय नियामक अनुपालन और रोगी पहुंच कार्यक्रम",
            ],
            h3s: [
              "विशेष ब्रांडेड निर्यात पोर्टफोलियो (कार्बोगेट, बोर्टेगेट, बेंडागेट, अबिरागेट, केपगेट, टेमोगेट, अनागालिंग)",
              "पांच कोर प्रमाणपत्र (WHO, PIC/S, US FDA, EU MHRA, UK MHRA)",
              "अंतर्राष्ट्रीय PAP, NPAP, और दयालु परमिट पहुंच",
            ],
            content:
              "गेटमेड्स हेल्थकेयर (इंडिया एलएलपी) 54+ देशों में अंतर्राष्ट्रीय वितरकों, अस्पताल समूहों और स्वास्थ्य मंत्रालयों को उच्च गुणवत्ता, कोल्ड-चेन अनुपालन ऑन्कोलॉजी और हेमेटोलॉजी दवाओं का निर्यात करता है। हमारी वैश्विक ऑन्कोलॉजी सूची में आवश्यक ब्रांडेड फार्मास्युटिकल्स शामिल हैं: कार्बोगेट (कार्बोप्लाटिन) अंडाशय, फेफड़े और मूत्राशय के कैंसर प्रोटोकॉल के लिए; बोर्टेगेट (बोर्टेज़ोमिब) मल्टीपल मायलोमा और मेंटल सेल लिंफोमा के लिए; बेंडागेट (बेंडामुस्टाइन HCl) सीएलएल और लिंफोमा के लिए; अबिरागेट (अबिराटेरोन एसीटेट) मेटास्टेटिक प्रोस्टेट कैंसर के लिए; केपगेट (कैपेसिटाबाइन) स्तन, कोलोरेक्टल और गैस्ट्रिक कैंसर के लिए; टेमोगेट (टेमोज़ोलोमाइड) ग्लियोब्लास्टोमा के लिए; और अनागालिंग (एनास्ट्रोज़ोल) स्तन कैंसर के लिए। प्रत्येक बैच में पूर्ण COA और COPP दस्तावेज़ीकरण शामिल है, जो मान्य WHO GSDP थर्मल कंटेनरों में पैक किया गया है।",
            ctas: [
              { text: "वैश्विक निर्यात उद्धरण का अनुरोध करें", url: "/llp/contact" },
              { text: "सोर्सिंग और गुणवत्ता मानकों का अन्वेषण करें", url: "/llp/sourcing-supply-chain" },
            ],
            keywords: [
              "भारत ऑन्कोलॉजी निर्यात सूची",
              "भारत कार्बोप्लाटिन बोर्टेज़ोमिब निर्यातक",
              "WHO-GMP थोक कैंसर दवा निर्यात",
              "भारत निर्यातक ऑन्कोलॉजी इंजेक्टेबल खरीदें",
              "अंतर्राष्ट्रीय नामित रोगी ऑन्कोलॉजी आपूर्ति",
            ],
          },
        },

        partnerships: {
          url: "/llp/global-partnerships",
          en: {
            metaTitle: "Global Pharmaceutical Partnerships – Oncology Export",
            metaDescription:
              "Partner with a global pharmaceutical exporter. Sourcing from WHO-GMP, US FDA, EU MHRA facilities. Exporting oncology & specialty medicines to 54+ countries.",
            h1: "Global Partnerships — One Partner. Complete Portfolio. Worldwide Reach.",
            h2s: [
              "Empowering International Distributors, Hospitals, and Manufacturers",
              "Strategic Advantages for Global Commercial Partners",
              "Our 5-Step Global Partnership Process",
            ],
            h3s: [
              "Single-Source Access to 2,000+ Molecules & 50+ Audited Manufacturers",
              "Rapid Expansion Across Asia-Pacific, Middle East, Africa, and Americas",
              "Priority Cold-Chain Air Freight & Expedited Documentation",
            ],
            content:
              "Getmeds Healthcare (India LLP) provides a single-source commercial partnership for international pharmaceutical distributors, hospital chains, and global manufacturers seeking reliable export and market expansion. What We Offer: For International Distributors – Direct wholesale access to 2,000+ molecules, competitive pricing, reliable volume allocation, and complete export documentation (COA, COPP). For Manufacturers – Access to commercial distribution channels across 54+ countries in Southeast Asia, the Pacific, Middle East, Africa, Latin America, and the Caribbean. For Hospitals & Ministries – Guaranteed cold-chain integrity, priority air freight, and bulk tender fulfillment.",
            ctas: [
              { text: "Inquire About Global Partnerships (care2@getmeds.in)", url: "/llp/contact" },
              { text: "View Philippines Local Partnerships", url: "/corp/partnerships" },
            ],
            keywords: [
              "Global pharmaceutical partnership India",
              "Wholesale oncology distributor partner",
              "Export partner cancer medicines India",
              "International pharma distributor sourcing",
              "Getmeds Healthcare global partner",
            ],
          },
          hi: {
            metaTitle: "वैश्विक फार्मास्युटिकल साझेदारी – ऑन्कोलॉजी निर्यात",
            metaDescription:
              "एक वैश्विक फार्मास्युटिकल निर्यातक के साथ साझेदारी करें। WHO-GMP, US FDA, EU MHRA सुविधाओं से सोर्सिंग। 54+ देशों में ऑन्कोलॉजी और विशेष दवाओं का निर्यात।",
            h1: "वैश्विक साझेदारी — एक भागीदार। संपूर्ण पोर्टफोलियो। विश्वव्यापी पहुंच।",
            h2s: [
              "अंतर्राष्ट्रीय वितरकों, अस्पतालों और निर्माताओं को सशक्त बनाना",
              "वैश्विक वाणिज्यिक भागीदारों के लिए रणनीतिक लाभ",
              "हमारी 5-चरणीय वैश्विक साझेदारी प्रक्रिया",
            ],
            h3s: [
              "2,000+ अणुओं और 50+ ऑडिटेड निर्माताओं तक सिंगल-सोर्स पहुंच",
              "एशिया-प्रशांत, मध्य पूर्व, अफ्रीका और अमेरिका में तीव्र विस्तार",
              "प्राथमिकता कोल्ड-चेन हवाई माल ढुलाई और त्वरित दस्तावेज़ीकरण",
            ],
            content:
              "गेटमेड्स हेल्थकेयर (इंडिया एलएलपी) विश्वसनीय निर्यात और बाजार विस्तार की तलाश करने वाले अंतर्राष्ट्रीय फार्मास्युटिकल वितरकों, अस्पताल श्रृंखलाओं और वैश्विक निर्माताओं के लिए एक सिंगल-सोर्स वाणिज्यिक साझेदारी प्रदान करता है। हम क्या प्रदान करते हैं: अंतर्राष्ट्रीय वितरकों के लिए – 2,000+ अणुओं तक प्रत्यक्ष थोक पहुंच, प्रतिस्पर्धी मूल्य निर्धारण, विश्वसनीय मात्रा आवंटन, और पूर्ण निर्यात दस्तावेज़ीकरण (COA, COPP)। निर्माताओं के लिए – दक्षिण पूर्व एशिया, प्रशांत, मध्य पूर्व, अफ्रीका, लैटिन अमेरिका और कैरिबियन में 54+ देशों में वाणिज्यिक वितरण चैनलों तक पहुंच। अस्पतालों और मंत्रालयों के लिए – गारंटीकृत कोल्ड-चेन अखंडता, प्राथमिकता हवाई माल ढुलाई, और बल्क निविदा पूर्ति।",
            ctas: [
              { text: "वैश्विक साझेदारियों के बारे में पूछताछ करें (care2@getmeds.in)", url: "/llp/contact" },
              { text: "फिलीपींस स्थानीय साझेदारियाँ देखें", url: "/corp/partnerships" },
            ],
            keywords: [
              "भारत वैश्विक फार्मास्युटिकल साझेदारी",
              "थोक ऑन्कोलॉजी वितरक भागीदार",
              "भारत कैंसर दवाओं के निर्यात भागीदार",
              "अंतर्राष्ट्रीय फार्मा वितरक सोर्सिंग",
              "गेटमेड्स हेल्थकेयर वैश्विक भागीदार",
            ],
          },
        },

        sourcing: {
          url: "/llp/sourcing-supply-chain",
          en: {
            metaTitle: "Pharmaceutical Sourcing & Supply Chain – Global Exporter",
            metaDescription:
              "Global pharmaceutical sourcing from WHO-GMP, US FDA, EU MHRA certified manufacturers. Cold-chain logistics and priority export to 54+ countries.",
            h1: "Global Sourcing & Supply Chain — Quality You Can Trust",
            h2s: [
              "Rigorous Manufacturer Vetting & Quality Assurance",
              "Cold-Chain Integrity & Priority Freight Logistics",
              "End-to-End Export Compliance & Documentation",
            ],
            h3s: [
              "50+ Audited Manufacturing Partners in India, China, Europe, and USA",
              "WHO GSDP 2°C to 8°C Monitored Thermal Shipping",
              "Batch Traceability & Expedited Customs Clearance",
            ],
            content:
              "At Getmeds Healthcare (India LLP), our supply chain infrastructure ensures that every container of medicine reaches its international destination in perfect condition. We source exclusively from 50+ audited manufacturers in India, China, Europe, and the US certified under WHO-GMP, PIC/S, US FDA, EU MHRA, and UK MHRA. Our logistics protocol includes: Multi-Stage Batch Testing for verification of COA, purity, and stability data; WHO GSDP Cold-Chain with custom thermal packaging maintaining 2°C to 8°C and digital temperature data loggers; Priority Air Freight with fast-track airport handling and export customs clearance from Mumbai; and Complete Export Compliance with provision of Airway Bills, COPP, Insurance, and Invoices.",
            ctas: [
              { text: "Discuss Sourcing Requirements", url: "/llp/contact" },
              { text: "Explore Oncology Export Portfolio", url: "/llp/oncology-export-portfolio" },
            ],
            keywords: [
              "Pharmaceutical supply chain exporter India",
              "WHO GSDP cold-chain medicine export",
              "WHO-GMP manufacturer sourcing India",
              "Oncology cold chain air freight export",
              "Pharma export documentation India",
            ],
          },
          hi: {
            metaTitle: "फार्मास्युटिकल सोर्सिंग और आपूर्ति श्रृंखला – वैश्विक निर्यातक",
            metaDescription:
              "WHO-GMP, US FDA, EU MHRA प्रमाणित निर्माताओं से वैश्विक फार्मास्युटिकल सोर्सिंग। कोल्ड-चेन लॉजिस्टिक्स और 54+ देशों को प्राथमिकता निर्यात।",
            h1: "वैश्विक सोर्सिंग और आपूर्ति श्रृंखला — गुणवत्ता जिस पर आप भरोसा कर सकते हैं",
            h2s: [
              "कठोर निर्माता जांच और गुणवत्ता आश्वासन",
              "कोल्ड-चेन अखंडता और प्राथमिकता माल ढुलाई लॉजिस्टिक्स",
              "एंड-टू-एंड निर्यात अनुपालन और दस्तावेज़ीकरण",
            ],
            h3s: [
              "भारत, चीन, यूरोप और अमेरिका में 50+ ऑडिटेड निर्माण भागीदार",
              "WHO GSDP 2°C से 8°C मॉनिटर थर्मल शिपिंग",
              "बैच ट्रेसबिलिटी और त्वरित सीमा शुल्क निकासी",
            ],
            content:
              "गेटमेड्स हेल्थकेयर (इंडिया एलएलपी) में, हमारी आपूर्ति श्रृंखला बुनियादी ढांचा सुनिश्चित करता है कि दवा का प्रत्येक कंटेनर अपने अंतर्राष्ट्रीय गंतव्य तक सही स्थिति में पहुंचे। हम विशेष रूप से WHO-GMP, PIC/S, US FDA, EU MHRA, और UK MHRA के तहत प्रमाणित भारत, चीन, यूरोप और अमेरिका में 50+ ऑडिटेड निर्माताओं से सोर्सिंग करते हैं। हमारे लॉजिस्टिक्स प्रोटोकॉल में शामिल हैं: COA, शुद्धता और स्थिरता डेटा के सत्यापन के लिए बहु-चरण बैच परीक्षण; WHO GSDP कोल्ड-चेन 2°C से 8°C बनाए रखने वाली कस्टम थर्मल पैकेजिंग और डिजिटल तापमान डेटा लॉगर्स के साथ; मुंबई से तीव्र-ट्रैक हवाई अड्डा हैंडलिंग और निर्यात सीमा शुल्क निकासी के साथ प्राथमिकता हवाई माल ढुलाई; और एयरवे बिल, COPP, बीमा और चालान के प्रावधान के साथ पूर्ण निर्यात अनुपालन।",
            ctas: [
              { text: "सोर्सिंग आवश्यकताओं पर चर्चा करें", url: "/llp/contact" },
              { text: "ऑन्कोलॉजी निर्यात पोर्टफोलियो का अन्वेषण करें", url: "/llp/oncology-export-portfolio" },
            ],
            keywords: [
              "भारत फार्मास्युटिकल आपूर्ति श्रृंखला निर्यातक",
              "WHO GSDP कोल्ड-चेन दवा निर्यात",
              "भारत WHO-GMP निर्माता सोर्सिंग",
              "ऑन्कोलॉजी कोल्ड चेन हवाई माल ढुलाई निर्यात",
              "भारत फार्मा निर्यात दस्तावेज़ीकरण",
            ],
          },
        },

        contact: {
          url: "/llp/contact",
          en: {
            metaTitle: "Contact Getmeds Healthcare India – Global Export Inquiries",
            metaDescription:
              "Contact Getmeds Healthcare India for global oncology export, international distribution, or sourcing inquiries. We reply within one business day.",
            h1: "Contact Us — Global Export Inquiries Welcome",
            h2s: [
              "Connect with Our International Export Team",
              "Office Address & Direct Global Communication Channels",
              "Priority Dispatch & Global Operating Hours",
            ],
            h3s: [
              "Mumbai, Maharashtra Export Hub",
              "Email: care2@getmeds.in | Phone: +91 91907 69100",
              "Philippines Local Contact Details",
            ],
            content:
              "Our international trade specialists respond to all global distribution, hospital supply, manufacturer partnership, and sourcing inquiries within one business day. Global Export Hub Address: Getmeds Healthcare (India LLP), Mumbai, Maharashtra, India. Direct Communication Channels: Global Export Email: care2@getmeds.in, Global Contact Center Phone: +91 91907 69100, Operating Hours: Mon–Fri: 9:00 AM – 6:00 PM (IST) | Priority Freight Logistics.",
            ctas: [
              { text: "Submit Global Inquiry", url: "/llp/contact" },
              { text: "Contact Philippines Operations", url: "/corp/contact" },
            ],
            keywords: [
              "Contact Getmeds Healthcare India",
              "care2@getmeds.in global export",
              "Global oncology export inquiry India",
              "Pharma exporter Mumbai contact",
              "International medicine supply contact",
            ],
          },
          hi: {
            metaTitle: "गेटमेड्स हेल्थकेयर इंडिया से संपर्क करें – वैश्विक निर्यात पूछताछ",
            metaDescription:
              "वैश्विक ऑन्कोलॉजी निर्यात, अंतर्राष्ट्रीय वितरण, या सोर्सिंग पूछताछ के लिए गेटमेड्स हेल्थकेयर इंडिया से संपर्क करें। हम एक कार्य दिवस के भीतर उत्तर देते हैं।",
            h1: "संपर्क करें — वैश्विक निर्यात पूछताछ का स्वागत है",
            h2s: [
              "हमारी अंतर्राष्ट्रीय निर्यात टीम से जुड़ें",
              "कार्यालय का पता और प्रत्यक्ष वैश्विक संचार चैनल",
              "प्राथमिकता डिस्पैच और वैश्विक कार्य घंटे",
            ],
            h3s: [
              "मुंबई, महाराष्ट्र निर्यात केंद्र",
              "ईमेल: care2@getmeds.in | फोन: +91 91907 69100",
              "फिलीपींस स्थानीय संपर्क विवरण",
            ],
            content:
              "हमारे अंतर्राष्ट्रीय व्यापार विशेषज्ञ एक कार्य दिवस के भीतर सभी वैश्विक वितरण, अस्पताल आपूर्ति, निर्माता साझेदारी, और सोर्सिंग पूछताछ का उत्तर देते हैं। वैश्विक निर्यात केंद्र का पता: गेटमेड्स हेल्थकेयर (इंडिया एलएलपी), मुंबई, महाराष्ट्र, भारत। प्रत्यक्ष संचार चैनल: वैश्विक निर्यात ईमेल: care2@getmeds.in, वैश्विक संपर्क केंद्र फोन: +91 91907 69100, कार्य घंटे: सोम–शुक्र सुबह 9:00 – शाम 6:00 (IST) | प्राथमिकता माल ढुलाई लॉजिस्टिक्स।",
            ctas: [
              { text: "वैश्विक पूछताछ सबमिट करें", url: "/llp/contact" },
              { text: "फिलीपींस संचालन से संपर्क करें", url: "/corp/contact" },
            ],
            keywords: [
              "गेटमेड्स हेल्थकेयर इंडिया से संपर्क करें",
              "care2@getmeds.in वैश्विक निर्यात",
              "भारत वैश्विक ऑन्कोलॉजी निर्यात पूछताछ",
              "मुंबई फार्मा निर्यातक संपर्क",
              "अंतर्राष्ट्रीय दवा आपूर्ति संपर्क",
            ],
          },
        },
      },
    },

    // ============================================================
    // MOTHER SITE (bishnoi.ai) – ENGLISH ONLY
    // ============================================================
    mother: {
      domain: "bishnoi.ai",
      locale: "en-US",
      languages: ["en"], // Only English
      role: "Brand Umbrella, Legacy & Corporate Hub",
      audience:
        "Hospitals, oncology customers, distributors, media, investors, and the general public",
      description:
        "Bishnoi Omniverse is the unified brand identity connecting healthcare, oncology supply, and social impact. Rooted in 500 years of discipline and service.",

      // ---------- PAGES (ENGLISH ONLY) ----------
      pages: {
        home: {
          url: "/",
          metaTitle: "Bishnoi Omniverse – Global Ecosystem & Healthcare Impact",
          metaDescription:
            "Bishnoi Omniverse connects global healthcare, oncology supply, international ventures, and social impact. Rooted in 500 years of discipline and service.",
          h1: "Bishnoi Omniverse: Rooted in Five Hundred Years. Building for What Comes Next.",
          h2s: [
            "One Unified Brand. Global Healthcare & Specialty Operating Arm.",
            "The Dual-Gateway Operating Model: Philippines CORP & India LLP",
            "Global Impact: 54+ Countries, 500+ Hospitals, 2 Million+ Patient Lives",
          ],
          h3s: [
            "Getmeds Philippines Inc. / 2MG Inc. (Local Importer & Hospital Supplier)",
            "Getmeds Healthcare India LLP (Global Sourcing & Export Hub)",
            "Naresh Bishnoi Foundation & Environmental Legacy",
          ],
          content:
            "Welcome to the Bishnoi Omniverse — a global connected ecosystem bridging healthcare innovation, international pharmaceutical distribution, specialty oncology access, and social impact. Inspired by a 500-year Bishnoi legacy of discipline, environmental conservation, and community service, our ecosystem operates across borders so distance, cost, and logistics never decide who receives life-saving care. Our healthcare operations function through two synergistic entities: Philippines Operations managed by Getmeds Philippines Inc. / 2MG Inc., serving 500+ hospitals, 10,000+ pharmacies, and 2 Million+ patient lives across Luzon, Visayas, and Mindanao; and India Global Export Hub managed by Getmeds Healthcare India LLP, sourcing from 50+ WHO-GMP/FDA certified manufacturers to supply oncology and specialty medicines across 54+ countries.",
          ctas: [
            { text: "Explore Philippines Operations", url: "/corp" },
            { text: "Explore Global Export Hub", url: "/llp" },
            { text: "Learn Our Legacy", url: "/about" },
          ],
          keywords: [
            "Bishnoi Omniverse global ecosystem",
            "Bishnoi healthcare pharmaceutical network",
            "Global oncology supply ecosystem",
            "Getmeds Philippines Getmeds Healthcare India",
            "Rooted in five hundred years building for what comes next",
          ],
        },

        about: {
          url: "/about",
          metaTitle: "About Bishnoi Legacy – History, Philosophy & Vision",
          metaDescription:
            "Discover the 500-year Bishnoi legacy of discipline, conservation, and service driving the Bishnoi Omniverse global healthcare mission.",
          h1: "The Bishnoi Legacy: Five Centuries of Discipline, Service, and Responsibility",
          h2s: [
            "A 500-Year Heritage Applied to Modern Global Challenges",
            "Core Philosophy: Environmental Conservation & Social Purpose",
            "Translating Heritage into Global Healthcare Accessibility",
          ],
          h3s: [
            "The Principles of Discipline and Stewardship",
            "Naresh Bishnoi Foundation & Humanitarian Initiatives",
            "Universal Access to Life-Saving Specialty Care",
          ],
          content:
            "The foundation of the Bishnoi Omniverse is not merely business strategy — it is an enduring 500-year philosophy. For over five centuries, the Bishnoi tradition has championed strict personal discipline, ecological conservation, and selfless protection of life. Today, we apply these principles to the complex realities of modern global pharmaceutical distribution. We exist so distance, cost, and complexity never decide who lives. Whether providing cold-chain oncology delivery to remote islands in Visayas or establishing the Pacific's first specialty cancer pharmacy in Vanuatu, the Bishnoi legacy guides our commitment to uncompromised quality, zero-waste logistics, and compassionate care.",
          ctas: [
            { text: "Meet Our Founder", url: "/founder" },
            { text: "Explore Our Companies", url: "/our-companies" },
          ],
          keywords: [
            "Bishnoi legacy history philosophy",
            "500 year Bishnoi heritage healthcare",
            "Environmental conservation Bishnoi Omniverse",
            "Naresh Bishnoi Foundation impact",
            "Ethical pharmaceutical distribution",
          ],
        },

        companies: {
          url: "/our-companies",
          metaTitle: "Our Companies – Bishnoi Omniverse Global Network",
          metaDescription:
            "Explore the operating companies of Bishnoi Omniverse: Getmeds Philippines, Getmeds Healthcare India, Getmeds HealthTech Singapore & global entities.",
          h1: "Our Ecosystem: Unified Operating Entities Across Healthcare & International Markets",
          h2s: [
            "Healthcare & Pharmaceutical Distribution Leaders",
            "Global Reach & Regional International Subsidiaries",
            "Social Impact & Foundation Initiatives",
          ],
          h3s: [
            "Getmeds Philippines Inc. / 2MG Inc. (CORP)",
            "Getmeds Healthcare (India LLP)",
            "Getmeds HealthTech Pte. Ltd. (Singapore) & Regional Entities",
          ],
          content:
            "The Bishnoi Omniverse brings together specialized operating entities united by a shared identity and operational standard. Primary Operating Entities: Getmeds Philippines Inc. / 2MG Inc. (Philippines Operations) – SEC-registered Philippine corporation holding FDA LTO, PDEA permits, and serving 500+ local hospitals; Getmeds Healthcare India LLP (Global Export Hub) – Global sourcing and export hub in Mumbai, Maharashtra, supplying 2,000+ molecules to 54+ countries; Getmeds HealthTech Pte. Ltd. (Singapore) – Strategic regional management expanding healthcare access across Asia; Pacific Cancer Pharmacy (Vanuatu) – The Pacific's first specialty cancer pharmacy serving Vanuatu, Fiji, and neighboring island nations; Regional Operations – Presence across Saint Kitts and Nevis, Vietnam, Cambodia, Laos, Myanmar, and Pakistan; and Naresh Bishnoi Foundation – Social impact, healthcare grants, and community awareness initiatives.",
          ctas: [
            { text: "Visit Philippines Portal", url: "/corp" },
            { text: "Visit India Export Portal", url: "/llp" },
          ],
          keywords: [
            "Bishnoi Omniverse companies ecosystem",
            "Getmeds Philippines 2MG Inc",
            "Getmeds Healthcare India LLP",
            "Getmeds HealthTech Singapore",
            "Pacific cancer pharmacy Vanuatu",
          ],
        },

        founder: {
          url: "/founder",
          metaTitle: "Founder Story – Naresh Kumar Bishnoi | ESMO Specialist",
          metaDescription:
            "Read the founder story of Naresh Kumar Bishnoi — Oncology Medicine Supply Specialist, ESMO member, and leader of Bishnoi Omniverse.",
          h1: "The Founder Story: Naresh Kumar Bishnoi & The Mission to Save Lives",
          h2s: [
            "A Personal Commitment to Solving Global Oncology Bottlenecks",
            "Clinical Rigor Meets Operational Supply Chain Logistics",
            "Guiding the Bishnoi Omniverse into the Future",
          ],
          h3s: [
            "Member of the European Society for Medical Oncology (ESMO)",
            "Overcoming Geographical & Financial Barriers for Patients",
            '"A box of medicine isn\'t a product. It\'s a mother waiting for her dose."',
          ],
          content:
            "Naresh Kumar Bishnoi is an Oncology Medicine Supply Specialist, an active member of the European Society for Medical Oncology (ESMO), and the visionary founder of the Bishnoi Omniverse. Having witnessed firsthand the tragic gaps in global oncology supply chains, Mr. Bishnoi dedicated his life's work to ensuring that life-saving cancer medicines reach patients regardless of geographic or financial barriers. His guiding principle: 'A box of medicine isn't a product. It's a stage-IV oncology mother in Cebu waiting for her next dose. We exist so distance, cost, and complexity never decide who lives.' Under his leadership, the Bishnoi Omniverse has grown to serve 500+ hospitals in the Philippines, export to 54+ countries worldwide, and touch over 2 Million+ patient lives.",
          ctas: [
            { text: "Read About Bishnoi Legacy", url: "/about" },
            { text: "Contact Leadership Team", url: "/contact" },
          ],
          keywords: [
            "Naresh Kumar Bishnoi founder story",
            "ESMO member oncology medicine specialist",
            "Founder Bishnoi Omniverse Getmeds",
            "Naresh Bishnoi oncology leadership",
            "Life saving medicine supply founder",
          ],
        },

        contact: {
          url: "/contact",
          metaTitle: "Contact Bishnoi Omniverse – Global Group Inquiries",
          metaDescription:
            "Contact Bishnoi Omniverse group headquarters for corporate inquiries, global partnerships, healthcare distribution, or foundation initiatives.",
          h1: "Contact Bishnoi Omniverse Headquarters & Regional Offices",
          h2s: [
            "Connect with Our Global Leadership & Regional Hubs",
            "Direct Regional Office Contacts",
            "Submit a Group Inquiry",
          ],
          h3s: [
            "Philippines Operations (Getmeds PH / 2MG Inc.)",
            "India Global Export Hub (Getmeds Healthcare LLP)",
            "Foundation & Corporate Affairs",
          ],
          content:
            "Whether you represent a hospital network, government health ministry, global pharmaceutical manufacturer, or philanthropic organization, we welcome your inquiry. Philippines Operating Headquarters: Getmeds Philippines Inc. / 2MG Inc., Unit 301 & 305, 17 Vatican Bldg., Vatican City Drive, B.F. Resort Village, Talon II, Las Piñas City, Metro Manila, Philippines. Email: info@getmeds.ph | B2B: sales5@2mginc.com | Phone: +63 917 156 9029. India Global Export Hub: Getmeds Healthcare (India LLP), Mumbai, Maharashtra, India. Email: care2@getmeds.in | Phone: +91 91907 69100.",
          ctas: [
            { text: "Visit Philippines Portal", url: "/corp" },
            { text: "Visit Global Export Portal", url: "/llp" },
          ],
          keywords: [
            "Contact Bishnoi Omniverse headquarters",
            "Getmeds Philippines contact Las Pinas",
            "Getmeds Healthcare India contact Mumbai",
            "Global pharmaceutical ecosystem contact",
            "Naresh Bishnoi foundation contact",
          ],
        },
      },
    },
  },
};
