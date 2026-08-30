// =====================================
// CENTRALIZED TRANSLATIONS
// =====================================
// Single source of truth for all static UI text across BulkBridge.
// Add a new page? Add a new top-level key here (e.g. `orders: {...}`)
// and use it via `t.orders.someLabel` wherever needed.
//
// Language codes: en (English), mr (Marathi), hi (Hindi)

const translations = {
  en: {
    common: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      continueBtn: "Continue",
    },

    // Ported from the original Navbar.jsx translations
    navbar: {
      home: "Home",
      about: "About",
      services: "Services",
      categories: "Categories",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      tagline: "Bridging Farms. Connecting Markets.",
    },

    // Ported from the original Hero.jsx translations
    hero: {
      tag: "From Farm to Market, Seamlessly",
      title1: "Fresh Produce,",
      title2: "Stronger",
      title3: "Connections",
      description:
        "BulkBridge connects farmers and buyers for quality produce, fair prices and reliable delivery. Building a better agri-future together.",
      getStarted: "Get Started",
      exploreMarket: "Explore Market",
      freshQuality: "Fresh & Quality",
      produce: "Produce",
      fairPrices: "Fair Prices",
      everyone: "For Everyone",
      fastSafe: "Fast & Safe",
      delivery: "Delivery",
      secure: "Secure",
      transactions: "Transactions",
      farmersOnboarded: "Farmers Onboarded",
      ordersDelivered: "Orders Delivered",
      customerSatisfaction: "Customer Satisfaction",
      thisMonth12: "↑ 12% this month",
      thisMonth18: "↑ 18% this month",
    },

    login: {
      welcomeBack: "Welcome Back to",
      subtitle: "Login to continue your journey",
      emailPlaceholder: "Enter your Email",
      passwordPlaceholder: "Enter your Password",
      forgotPassword: "Forgot Password?",
      loginBtn: "Login",
      loggingIn: "Logging in...",
      noAccount: "Don't have an account?",
      signupLink: "Sign Up",
    },

    signup: {
      title: "Create your account",
      subtitle: "Join BulkBridge as a Farmer or Buyer",
      farmer: "Farmer",
      buyer: "Buyer",
      signupBtn: "Sign Up",
      signingUp: "Signing up...",
      haveAccount: "Already have an account?",
      loginLink: "Login",
    },

    settings: {
      languageTitle: "Language",
      languageDesc: "Select your preferred language.",
    },

    languagePopup: {
      title: "Choose your language",
      english: "English",
      marathi: "मराठी",
      hindi: "हिंदी",
      continueBtn: "Continue",
    },
  },

  mr: {
    common: {
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      save: "जतन करा",
      cancel: "रद्द करा",
      continueBtn: "पुढे जा",
    },

    navbar: {
      home: "मुख्यपृष्ठ",
      about: "आमच्याबद्दल",
      services: "सेवा",
      categories: "श्रेणी",
      contact: "संपर्क",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      tagline: "शेतांना जोडणे. बाजारपेठांना जोडणे.",
    },

    hero: {
      tag: "शेतापासून बाजारपेठेपर्यंत, सहजपणे",
      title1: "ताजे उत्पादन,",
      title2: "मजबूत",
      title3: "नाती",
      description:
        "BulkBridge शेतकरी आणि खरेदीदारांना दर्जेदार उत्पादन, योग्य किंमत आणि विश्वासार्ह वितरणासाठी जोडते. एकत्रितपणे चांगले कृषी भविष्य घडवूया.",
      getStarted: "सुरुवात करा",
      exploreMarket: "बाजारपेठ पहा",
      freshQuality: "ताजे आणि दर्जेदार",
      produce: "उत्पादन",
      fairPrices: "योग्य किंमती",
      everyone: "सर्वांसाठी",
      fastSafe: "जलद आणि सुरक्षित",
      delivery: "वितरण",
      secure: "सुरक्षित",
      transactions: "व्यवहार",
      farmersOnboarded: "सामील झालेले शेतकरी",
      ordersDelivered: "पूर्ण केलेल्या ऑर्डर्स",
      customerSatisfaction: "ग्राहक समाधान",
      thisMonth12: "↑ या महिन्यात 12%",
      thisMonth18: "↑ या महिन्यात 18%",
    },

    login: {
      welcomeBack: "पुन्हा स्वागत आहे",
      subtitle: "तुमचा प्रवास सुरू ठेवण्यासाठी लॉगिन करा",
      emailPlaceholder: "तुमचा ईमेल टाका",
      passwordPlaceholder: "तुमचा पासवर्ड टाका",
      forgotPassword: "पासवर्ड विसरलात?",
      loginBtn: "लॉगिन",
      loggingIn: "लॉगिन होत आहे...",
      noAccount: "खाते नाही?",
      signupLink: "साइन अप करा",
    },

    signup: {
      title: "तुमचे खाते तयार करा",
      subtitle: "शेतकरी किंवा खरेदीदार म्हणून BulkBridge मध्ये सामील व्हा",
      farmer: "शेतकरी",
      buyer: "खरेदीदार",
      signupBtn: "साइन अप",
      signingUp: "साइन अप होत आहे...",
      haveAccount: "आधीच खाते आहे?",
      loginLink: "लॉगिन करा",
    },

    settings: {
      languageTitle: "भाषा",
      languageDesc: "तुमची पसंतीची भाषा निवडा.",
    },

    languagePopup: {
      title: "तुमची भाषा निवडा",
      english: "English",
      marathi: "मराठी",
      hindi: "हिंदी",
      continueBtn: "पुढे जा",
    },
  },

  hi: {
    common: {
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      save: "सेव करें",
      cancel: "रद्द करें",
      continueBtn: "जारी रखें",
    },

    navbar: {
      home: "होम",
      about: "हमारे बारे में",
      services: "सेवाएँ",
      categories: "श्रेणियाँ",
      contact: "संपर्क",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      tagline: "खेतों को जोड़ना। बाजारों को जोड़ना।",
    },

    hero: {
      tag: "खेत से बाजार तक, आसानी से",
      title1: "ताज़ी उपज,",
      title2: "मजबूत",
      title3: "संबंध",
      description:
        "BulkBridge किसानों और खरीदारों को गुणवत्तापूर्ण उपज, उचित कीमत और विश्वसनीय डिलीवरी के लिए जोड़ता है। मिलकर बेहतर कृषि भविष्य बनाएं।",
      getStarted: "शुरू करें",
      exploreMarket: "बाज़ार देखें",
      freshQuality: "ताज़ा और गुणवत्तापूर्ण",
      produce: "उपज",
      fairPrices: "उचित कीमतें",
      everyone: "सभी के लिए",
      fastSafe: "तेज़ और सुरक्षित",
      delivery: "डिलीवरी",
      secure: "सुरक्षित",
      transactions: "लेन-देन",
      farmersOnboarded: "जुड़े हुए किसान",
      ordersDelivered: "डिलीवर किए गए ऑर्डर",
      customerSatisfaction: "ग्राहक संतुष्टि",
      thisMonth12: "↑ इस महीने 12%",
      thisMonth18: "↑ इस महीने 18%",
    },

    login: {
      welcomeBack: "वापसी पर स्वागत है",
      subtitle: "अपनी यात्रा जारी रखने के लिए लॉगिन करें",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      forgotPassword: "पासवर्ड भूल गए?",
      loginBtn: "लॉगिन",
      loggingIn: "लॉगिन हो रहा है...",
      noAccount: "खाता नहीं है?",
      signupLink: "साइन अप करें",
    },

    signup: {
      title: "अपना खाता बनाएं",
      subtitle: "किसान या खरीदार के रूप में BulkBridge से जुड़ें",
      farmer: "किसान",
      buyer: "खरीदार",
      signupBtn: "साइन अप",
      signingUp: "साइन अप हो रहा है...",
      haveAccount: "पहले से खाता है?",
      loginLink: "लॉगिन करें",
    },

    settings: {
      languageTitle: "भाषा",
      languageDesc: "अपनी पसंदीदा भाषा चुनें।",
    },

    languagePopup: {
      title: "अपनी भाषा चुनें",
      english: "English",
      marathi: "मराठी",
      hindi: "हिंदी",
      continueBtn: "जारी रखें",
    },
  },
};

export default translations;
