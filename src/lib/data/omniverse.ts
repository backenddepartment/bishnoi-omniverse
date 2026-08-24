// src/lib/data/omniverse.ts

export const omniverseData = {
  // ---------- BRANCHES ----------
  branches: {

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
      },
    },

  },
};
