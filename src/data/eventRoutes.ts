export interface EventPackage {
  name: string;
  price: string;
  tagline: string;
  popular?: boolean;
  features: string[];
}

export interface EventFAQ {
  q: string;
  a: string;
}

export interface EventDetail {
  slug: string;
  category: "wedding" | "corporate" | "catering" | "decoration";
  menuTitle: string;
  badge: string;
  title: string;
  subtitle: string;
  heroImage: string;
  stats: {
    number: string;
    label: string;
  }[];
  overview: string;
  features: {
    title: string;
    desc: string;
  }[];
  galleryImages: string[];
  packages: EventPackage[];
  faqs: EventFAQ[];
}

export const CATERING_EVENTS: EventDetail[] = [
  {
    "slug": "wedding-catering",
    "category": "catering",
    "menuTitle": "Wedding Catering",
    "badge": "Royal Shahi Dawat & Feasts",
    "title": "Grand Wedding Catering & Royal Shahi Dawat in Rewa & MP",
    "subtitle": "50+ authentic delicacies, royal Mughlai & Awadhi curries, live tandoor stations aur 5-star hospitality ke sath yaadgar bhojan.",
    "heroImage": "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "500+",
        "label": "Weddings Catered"
      },
      {
        "number": "100%",
        "label": "Hygiene Certified"
      },
      {
        "number": "50+",
        "label": "Master Chefs"
      },
      {
        "number": "Custom",
        "label": "Menu Tailoring"
      }
    ],
    "overview": "Shaadi me aane wale mehmaan sabse zyada bhojan ke swad ko yaad rakhte hain. RIWAJ Catering team Shahi Rajputana, Awadhi, aur Contemporary Global cuisines ko traditional hospitality ke sath serve karti hai.",
    "features": [
      {
        "title": "Grand Live Cooking Counters",
        "desc": "Live pasta, chaat, dosa, and sizzling tandoori items prepared fresh in front of guests."
      },
      {
        "title": "Royal Chafing & Silverware Styling",
        "desc": "Heavy brass & antique chafing dishes with elegant buffet counters and floral styling."
      },
      {
        "title": "Trained White-Glove Stewards",
        "desc": "Uniformed, polite and highly trained service staff ensuring VIP hospitality for all guests."
      },
      {
        "title": "Pure Ingredients & Shuddh Ghee",
        "desc": "Top-grade spices, farm-fresh vegetables and pure desi ghee preparation guarantee."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Shahi Wedding Feast",
        "price": "\u20b9650 / Plate",
        "tagline": "Complete Traditional Multi-Course Menu",
        "features": [
          "2 Welcome Drinks",
          "4 Starters",
          "Main Course with 4 Gravies",
          "Dal Makhani & Shahi Pulao",
          "3 Indian Sweets & Ice Cream",
          "Live Tandoori Breads"
        ]
      },
      {
        "name": "Imperial Royal Banquet",
        "price": "\u20b91,050 / Plate",
        "popular": true,
        "tagline": "Ultra Luxury Wedding Spread",
        "features": [
          "4 Welcome Mocktails",
          "6 Live Starters",
          "Italian & Pan-Asian Live Counters",
          "5 Premium Curries with Paneer/Kofta",
          "Live Jalebi & Rabri Station",
          "Uniformed White-Glove Service"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya hum food tasting session arrange kar sakte hain?",
        "a": "Ji haan! Booking se pehle hum couple aur family ke liye complete menu tasting session arrange karte hain."
      },
      {
        "q": "Minimum kitne guests ke liye catering available hai?",
        "a": "Hum minimum 100 guests se lekar 5,000+ guests tak ke grand wedding gatherings successfully handle karte hain."
      }
    ]
  },
  {
    "slug": "corporate-catering",
    "category": "catering",
    "menuTitle": "Corporate Catering",
    "badge": "Punctual & Executive Dining",
    "title": "Executive Corporate Catering & Conference Dining Services",
    "subtitle": "Boardroom lunch boxes, high-tea snacks, coffee breaks aur annual gala dinner spreads with 100% punctuality.",
    "heroImage": "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "300+",
        "label": "Corporate Meets"
      },
      {
        "number": "100%",
        "label": "On-Time Service"
      },
      {
        "number": "GST",
        "label": "Compliant Billing"
      },
      {
        "number": "Custom",
        "label": "Packed Meals"
      }
    ],
    "overview": "Official meetings aur business conferences me khana samay par, swadisht aur neat presentation ke sath milna chahiye. RIWAJ Corporate Catering provides seamless dining solutions.",
    "features": [
      {
        "title": "Continuous Fresh Coffee & Hi-Tea",
        "desc": "Artisanal espresso machines, premium cookies and hot regional snacks throughout the event."
      },
      {
        "title": "Hygienic Executive Packed Lunches",
        "desc": "Spill-proof, eco-friendly segmented meal boxes for swift business lunches."
      },
      {
        "title": "Corporate Buffet with Food Warmers",
        "desc": "Elegantly labeled executive buffet with low-oil, nutritious and delicious options."
      },
      {
        "title": "Corporate Protocol & Billing",
        "desc": "Disciplined uniform staff, non-intrusive service and GST compliant invoices."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Conference Hi-Tea & Lunch",
        "price": "\u20b9450 / Delegate",
        "popular": true,
        "tagline": "Complete Business Day Catering",
        "features": [
          "Morning & Evening Tea/Coffee with 2 Cookies",
          "Buffet Lunch with 2 Sabzi, Dal, Rice & Roti",
          "Dessert of the day",
          "Packaged Mineral Water"
        ]
      },
      {
        "name": "Corporate Gala Dinner",
        "price": "\u20b9850 / Delegate",
        "tagline": "Executive Annual Celebration",
        "features": [
          "Welcome Mocktails & Starters",
          "Multi-Cuisine Continental & Indian Buffet",
          "Live Dessert Counter",
          "VIP Table Service"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya outstation corporate conferences me catering ho sakti hai?",
        "a": "Ji haan, hum resorts aur outstation conclave locations par bhi mobile kitchen ke sath complete catering provide karte hain."
      }
    ]
  },
  {
    "slug": "birthday-party-catering",
    "category": "catering",
    "menuTitle": "Birthday Party Catering",
    "badge": "Kids & Family Fun Treats",
    "title": "Delightful Birthday Party Catering & Interactive Food Stalls",
    "subtitle": "Kids-friendly pizza, pasta, burger sliders, colorful mocktail punch bowls, live chaat aur delicious dessert stations.",
    "heroImage": "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "250+",
        "label": "Birthdays Hosted"
      },
      {
        "number": "Kids",
        "label": "Special Menu"
      },
      {
        "number": "Live",
        "label": "Fun Stalls"
      },
      {
        "number": "100%",
        "label": "Fresh & Tasty"
      }
    ],
    "overview": "Bachhon aur family ke birthday parties me fun, tasty aur colorful food sabse zaroori hota hai. RIWAJ party catering banata hai har birthday party ko super exciting.",
    "features": [
      {
        "title": "Live Wood-Fired Pizza & Pasta",
        "desc": "Cheesy personal pizzas and made-to-order pastas with kids' favorite toppings."
      },
      {
        "title": "Mini Sliders & Finger Foods",
        "desc": "Crispy french fries, potato wedges, paneer nuggets and colorful burger sliders."
      },
      {
        "title": "Artisanal Mocktail Punch Bar",
        "desc": "Fruity lemonades, bubble drinks and smoking mocktails that kids absolutely love."
      },
      {
        "title": "Dessert & Waffle Station",
        "desc": "Fresh Belgian waffles, chocolate fountain with marshmallows and premium ice creams."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1743615467204-8fdaa85ff2db?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Kids Fun Treat",
        "price": "\u20b9350 / Child",
        "popular": true,
        "tagline": "Perfect for Birthday Celebrations",
        "features": [
          "Pizza slices & Burger sliders",
          "French Fries with Cheese Dip",
          "Live Pasta Counter",
          "Chocolate Fountain & Ice Cream",
          "Fresh Mocktail Punch"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya thematic customized birthday cake bhi arrange karte hain?",
        "a": "Ji haan, designer fondant aur photo cakes theme ke hisab se customize kiye jaate hain."
      }
    ]
  },
  {
    "slug": "engagement-catering",
    "category": "catering",
    "menuTitle": "Engagement Catering",
    "badge": "Sophisticated Ring Ceremony Bites",
    "title": "Elegant Engagement & Ring Ceremony High-Tea & Dinner",
    "subtitle": "Gourmet cocktail appetizers, live tandoor tikka counters, fusion desserts aur sophisticated banquet setup.",
    "heroImage": "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "350+",
        "label": "Engagements Done"
      },
      {
        "number": "Gourmet",
        "label": "Appetizers"
      },
      {
        "number": "Live",
        "label": "Cocktail Bar"
      },
      {
        "number": "5\u2605",
        "label": "Service Quality"
      }
    ],
    "overview": "Ring ceremony intimate aur prestigious function hota hai jisme do parivar aapas me milte hain. RIWAJ catering team sophisticated presentation ke sath classy dining experience create karti hai.",
    "features": [
      {
        "title": "Floating Hors d'Oeuvres",
        "desc": "Bite-sized gourmet starters served continuously to seated guests."
      },
      {
        "title": "Live Charcoal Tandoor Stalls",
        "desc": "Paneer tikka, soya chaap, and sizzling kebabs served straight from the clay oven."
      },
      {
        "title": "Fusion Dessert Cups & Shots",
        "desc": "Gulab jamun cheesecake, rabri shots, and artisanal pastries."
      },
      {
        "title": "VIP Senior Family Table Service",
        "desc": "Dedicated stewards for elderly guests so they never have to stand in buffet queues."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1727280376746-b89107a5b0df?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Elegance Engagement Feast",
        "price": "\u20b9550 / Plate",
        "popular": true,
        "tagline": "High-Tea & Dinner Combo",
        "features": [
          "Welcome Fruit Sangrias",
          "4 Floating Starters",
          "Main Course with 3 Gravies",
          "Dal Makhani & Jeera Rice",
          "2 Live Desserts"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya evening high-tea aur dinner dono shamil kar sakte hain?",
        "a": "Ji haan, hum function ke duration ke hisab se customized multi-course schedule plan karte hain."
      }
    ]
  },
  {
    "slug": "reception-catering",
    "category": "catering",
    "menuTitle": "Reception Catering",
    "badge": "Mega Banquet & Multi-Cuisine",
    "title": "Grand Wedding Reception Feast & Mega Banquet Catering",
    "subtitle": "Large-scale opulent dinner spreads for 500 to 5000+ guests with multiple buffet stations and zero waiting time.",
    "heroImage": "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "700+",
        "label": "Receptions Managed"
      },
      {
        "number": "5000+",
        "label": "Capacity per Night"
      },
      {
        "number": "Multi",
        "label": "Station Buffets"
      },
      {
        "number": "0",
        "label": "Waiting Time"
      }
    ],
    "overview": "Reception night me shehar ke sabhi khas mehmaan aate hain. Heavy rush ke dauran bhi khana garam, fresh aur presentation top-notch rakhna RIWAJ Catering ki specialty hai.",
    "features": [
      {
        "title": "Multi-Zone Island Buffets",
        "desc": "Symmetrical food counters avoiding crowd congestion and long queues."
      },
      {
        "title": "Signature Gravies & Dum Pulaos",
        "desc": "Rich Mughlai, Shahi Paneer, Dal Bukhara and fragrant saffron biryanis."
      },
      {
        "title": "Grand Halwai Sweet Pavilion",
        "desc": "Live hot jalebi with lachha rabri, malpua, and traditional regional mithais."
      },
      {
        "title": "Cleanliness & Waste Management",
        "desc": "Instant table bussing, clean plates replacement and strict hygiene protocols."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Imperial Reception Gala",
        "price": "\u20b9750 / Plate",
        "popular": true,
        "tagline": "Recommended for 500+ Guests",
        "features": [
          "8 Live Starters",
          "4 Regional Live Counters",
          "5 Main Gravies",
          "Full Breads & Rice Section",
          "4 Premium Desserts",
          "Live Mukhwas & Pan Counter"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Bade crowd me khana khatam hone ka risk to nahi hota?",
        "a": "Bilkul nahi! Hamare paas 20% backup buffer stock aur real-time kitchen restocking team hoti hai."
      }
    ]
  },
  {
    "slug": "outdoor-catering",
    "category": "catering",
    "menuTitle": "Outdoor Catering",
    "badge": "Lawn & Destination Feasts",
    "title": "Outdoor Lawn & Destination Catering in Rewa & MP",
    "subtitle": "Open-lawn mobile kitchens, live barbecue setups, canopy food stalls aur nature ke beech royal dining ka anubhav.",
    "heroImage": "https://images.unsplash.com/photo-1727280376746-b89107a5b0df?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "400+",
        "label": "Lawn Events"
      },
      {
        "number": "Full",
        "label": "Mobile Kitchen Setup"
      },
      {
        "number": "All-Weather",
        "label": "Warm Food Guarantee"
      },
      {
        "number": "Eco",
        "label": "Friendly Crockery"
      }
    ],
    "overview": "Open lawn ya resort me catering karna ek art hai. Hawa, mausam aur duriyan sabhi ko dhyaan me rakhkar RIWAJ team garam aur lajawab khana deliver karti hai.",
    "features": [
      {
        "title": "Complete Mobile Field Kitchen",
        "desc": "Self-contained cooking units with heavy gas setups and cold storages."
      },
      {
        "title": "Canopy & Pergola Food Stalls",
        "desc": "Thematic wooden and floral food huts blending with outdoor scenery."
      },
      {
        "title": "Wind-Resistant Chafing Systems",
        "desc": "Enclosed flameless food warmers keeping dishes steaming hot in open breezes."
      },
      {
        "title": "Eco-Friendly Waste Protocol",
        "desc": "Clean venue handover with zero litter and 100% biodegradable disposal."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Outdoor Lawn Special",
        "price": "\u20b9600 / Plate",
        "popular": true,
        "tagline": "For Open Farmhouses & Lawns",
        "features": [
          "Live BBQ & Tandoor",
          "3 Street Food Live Huts",
          "Main Course with 4 Gravies",
          "Clay Oven Naan & Roti",
          "Live Hot Desserts"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya farmhouse ya private garden me kitchen setup kar sakte hain?",
        "a": "Ji haan, hamari team paani aur bijli ke connectivity ke sath self-sustained kitchen setup kar leti hai."
      }
    ]
  },
  {
    "slug": "veg-catering",
    "category": "catering",
    "menuTitle": "Veg Catering",
    "badge": "100% Shuddh Shakahari",
    "title": "Pure Vegetarian Shuddh Shakahari Catering Excellence",
    "subtitle": "Desi ghee ki mehak, sattvic & Jain preparations, no onion-garlic options aur traditional Indian culinary heritage.",
    "heroImage": "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "100%",
        "label": "Pure Vegetarian"
      },
      {
        "number": "Desi Ghee",
        "label": "Specialty"
      },
      {
        "number": "Jain",
        "label": "Food Available"
      },
      {
        "number": "500+",
        "label": "Pure Veg Events"
      }
    ],
    "overview": "Hamari pure vegetarian catering me pavitrata aur swad ka perfect milan hai. Har rasoi 100% vegetarian hoti hai jisme traditional recipes ko modern flair ke sath banaya jata hai.",
    "features": [
      {
        "title": "Dedicated 100% Pure Veg Setup",
        "desc": "No meat, separate processing units and verified purity standards."
      },
      {
        "title": "Jain & Sattvic Options",
        "desc": "Delicious no-onion, no-garlic menus that sacrifice zero flavor."
      },
      {
        "title": "Shahi Desi Ghee Curries",
        "desc": "Paneer Lababdar, Malai Kofta, Dal Tadka and royal rich gravies."
      },
      {
        "title": "Authentic Dry Fruit Sweets",
        "desc": "Kaju Katli, Moong Dal Halwa, Rabri and assorted traditional Indian desserts."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1743615467204-8fdaa85ff2db?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Shuddh Shakahari Thaal",
        "price": "\u20b9500 / Plate",
        "popular": true,
        "tagline": "Traditional Pure Veg Banquet",
        "features": [
          "Shahi Paneer & Seasonal Sabzi",
          "Dal Makhani & Pulao",
          "Assorted Naan & Roti",
          "Gulab Jamun & Ice Cream",
          "Salad & Raita Bar"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya Jain mehmaano ke liye alag se counter ban sakta hai?",
        "a": "Ji bilkul, Jain guests ke liye hum alag se labeled counter maintain karte hain."
      }
    ]
  },
  {
    "slug": "buffet-live-counters",
    "category": "catering",
    "menuTitle": "Buffet & Live Counters",
    "badge": "Live Cooking Theatres",
    "title": "Interactive Buffet & Live Cooking Counters",
    "subtitle": "Live Chaat, Wood-Fired Pizza, Mongolian Wok, South Indian Appam, Tandoor aur Liquid Nitrogen dessert stalls.",
    "heroImage": "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "25+",
        "label": "Live Stalls Options"
      },
      {
        "number": "Live",
        "label": "Chef Interactions"
      },
      {
        "number": "Fresh",
        "label": "Made on Order"
      },
      {
        "number": "Popular",
        "label": "Guest Attraction"
      }
    ],
    "overview": "Live food counters event me excitement aur interactive charm laate hain. Guests apni aankhon ke samne customized fresh dishes bante dekhte hain.",
    "features": [
      {
        "title": "Banaras & Delhi Ki Mashhoor Chaat",
        "desc": "Aloo tikki, golgappe with 5 flavored waters, papdi chaat and dahi bhalla."
      },
      {
        "title": "Italian Pizza & Pasta Theatre",
        "desc": "Choice of sauces (Alfredo, Arrabbiata, Pesto) and wood-fired thin crust pizzas."
      },
      {
        "title": "Pan-Asian Wok Station",
        "desc": "Live noodles, dimsums and stir-fried exotic veggies with authentic sauces."
      },
      {
        "title": "Live Dessert & Jalebi Station",
        "desc": "Crispy hot jalebis dipped in sugar syrup served with thickened saffron rabri."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1743615467204-8fdaa85ff2db?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1727280376746-b89107a5b0df?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Live Counter Fiesta",
        "price": "\u20b9450 / Guest",
        "popular": true,
        "tagline": "Add-on to Any Event",
        "features": [
          "4 Custom Live Counters of your choice",
          "Live Chefs & Assistants",
          "Thematic Stall Styling & Lighting",
          "Continuous 3-Hour Service"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kitne live counters arrange karna recommended hai?",
        "a": "Wedding ke liye 4 se 6 live counters guests ko variety aur engagement dene ke liye perfect hote hain."
      }
    ]
  },
  {
    "slug": "regional-cuisines",
    "category": "catering",
    "menuTitle": "Regional Cuisines",
    "badge": "Vindhya, Awadh & Marwar",
    "title": "Authentic Regional Indian Cuisines (MP, Awadh, Marwar & South)",
    "subtitle": "Rewa ke local Bagheli swad, Rajasthani Dal Baati Churma, Lucknowi Awadhi handi aur South Indian delicacies.",
    "heroImage": "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "10+",
        "label": "State Cuisines"
      },
      {
        "number": "Local",
        "label": "Bagheli Flavors"
      },
      {
        "number": "Clay Pot",
        "label": "Cooking"
      },
      {
        "number": "100%",
        "label": "Traditional Spices"
      }
    ],
    "overview": "Desi mitti ki khushbu aur regional recipes ka maza alag hi hota hai. RIWAJ events Rewa, Bundelkhand, Rajasthan aur Awadh ke traditional taste ko wedding banquet me le aata hai.",
    "features": [
      {
        "title": "Local Bagheli Specialties",
        "desc": "Authentic Baghelkhandi kadhi, indori poha-jalebi, and local seasonal favorites."
      },
      {
        "title": "Rajasthani Dal Baati Churma",
        "desc": "Traditional bati baked over cow dung cakes served with pure ghee and panchmel dal."
      },
      {
        "title": "Awadhi Dum Cooking",
        "desc": "Slow-cooked handi curries and aromatic gravies from the royal kitchens of Lucknow."
      },
      {
        "title": "Authentic Clay Pot Presentation",
        "desc": "Food served in traditional earthen pots with brass ladles and vintage styling."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1743615467204-8fdaa85ff2db?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Desi Heritage Thaal",
        "price": "\u20b9600 / Plate",
        "popular": true,
        "tagline": "True Taste of Heritage India",
        "features": [
          "Rajasthani / Bagheli Theme Stall",
          "Desi Ghee Bati & Churma (3 types)",
          "Royal Awadhi Paneer",
          "Live Clay Tawa Rotis",
          "Jaggery Sweets & Kulfi"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya local village traditional cooks bulaye jaate hain?",
        "a": "Ji haan, authentic taste ke liye hum specific regional master cooks ke sath coordinate karte hain."
      }
    ]
  },
  {
    "slug": "premium-catering",
    "category": "catering",
    "menuTitle": "Premium Catering",
    "badge": "5-Star Culinary Luxury",
    "title": "Ultra-Luxury 5-Star Gourmet Catering & Plated Dinners",
    "subtitle": "Master chefs, gold-rimmed chinaware, customized menu cards, white-glove butler service aur international gourmet cuisines.",
    "heroImage": "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "5-Star",
        "label": "Executive Chefs"
      },
      {
        "number": "White Glove",
        "label": "Butler Service"
      },
      {
        "number": "Imported",
        "label": "Artisanal Tableware"
      },
      {
        "number": "Bespoke",
        "label": "Curated Menus"
      }
    ],
    "overview": "Jab aap chahte hain ki aapki shaadi me aane wale dignitaries aur high-profile guests international level ki hospitality dekhein, tab RIWAJ Premium Catering aati hai.",
    "features": [
      {
        "title": "White-Glove Butler Table Service",
        "desc": "Dedicated personal butlers for VIP tables with formal silver service etiquette."
      },
      {
        "title": "Imported Chinaware & Cutlery",
        "desc": "Gold-plated cutlery, crystal goblets and fine bone china presentation."
      },
      {
        "title": "Global Culinary Stations",
        "desc": "Sushi bar, artisanal cheese grazing table, and French patisserie dessert spread."
      },
      {
        "title": "Personal Executive Chef Consultation",
        "desc": "Direct menu curation with our celebrity culinary director."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1727280376746-b89107a5b0df?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Imperial 5-Star Experience",
        "price": "\u20b91,450 / Plate",
        "popular": true,
        "tagline": "Ultra Luxury Curated Banqueting",
        "features": [
          "Unlimited International Live Theatres",
          "Grazing Cheese & Fruit Table",
          "White-Glove Silver Table Service",
          "Molecular Gastronomy Desserts",
          "Gold & Crystal Dinnerware Setup"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya guests ke liye personalized printed menu card milte hain?",
        "a": "Ji haan, har VIP table par couple ke monogram aur gold foil print ke sath menu booklet rakhi jaati hai."
      }
    ]
  },
  {
    "slug": "budget-catering",
    "category": "catering",
    "menuTitle": "Budget Catering",
    "badge": "Smart & Transparent Value",
    "title": "Affordable & Value-for-Money Event Catering Packages",
    "subtitle": "Shandar swad aur budget-friendly per-plate rates \u2014 Zero hidden costs, fresh ingredients aur generous portions.",
    "heroImage": "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "Save 20%",
        "label": "Through Smart Planning"
      },
      {
        "number": "Fixed",
        "label": "Transparent Rates"
      },
      {
        "number": "Unlimited",
        "label": "Refills Guarantee"
      },
      {
        "number": "Zero",
        "label": "Hidden Charges"
      }
    ],
    "overview": "Budget kam hone par swad se compromise karne ki zaroorat nahi hai. RIWAJ Budget Catering smart seasonal menu planning ke sath premium look aur shandar taste provide karti hai.",
    "features": [
      {
        "title": "Smart Seasonal Sourcing",
        "desc": "Local fresh seasonal produce direct from wholesale markets keeping costs low."
      },
      {
        "title": "Crowd-Pleaser Core Dishes",
        "desc": "Dishes that everyone loves: Paneer butter masala, mixed veg, dal tadka, jeera rice."
      },
      {
        "title": "Neat & Clean Buffet Stations",
        "desc": "Sparkling clean food counters with warming burners and paper/cloth napkins."
      },
      {
        "title": "Written Transparent Bill",
        "desc": "No last minute surprise charges \u2014 complete clarity on plates, staff and fuel."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Value Family Buffet",
        "price": "\u20b9380 / Plate",
        "popular": true,
        "tagline": "High Quality at Honest Price",
        "features": [
          "1 Welcome Drink",
          "2 Starters",
          "2 Main Sabzi (Paneer + Seasonal)",
          "Dal Fry & Jeera Rice",
          "Poori & Tawa Roti",
          "1 Sweet (Gulab Jamun)"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya budget package me food quantity limit hoti hai?",
        "a": "Katai nahi! Hamara buffet unlimited refills ke sath chalta hai jab tak sabhi mehmaan satisfy na ho jayein."
      }
    ]
  }
];

export const DECORATION_EVENTS: EventDetail[] = [
  {
    "slug": "wedding-decoration",
    "category": "decoration",
    "menuTitle": "Wedding Decoration",
    "badge": "Grand Venue Artistry",
    "title": "Royal Wedding Decoration & Complete Venue Styling",
    "subtitle": "Grand palace entrance arches, illuminated walkways, majestic mandaps aur bespoke floral setups.",
    "heroImage": "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "800+",
        "label": "Weddings Styled"
      },
      {
        "number": "3D",
        "label": "Design Renders"
      },
      {
        "number": "100%",
        "label": "Custom Themes"
      },
      {
        "number": "Rewa & MP",
        "label": "Top Rated"
      }
    ],
    "overview": "Shaadi ka decor aisa hona chahiye jo sabhi mehmaano ke dil me bas jaye. RIWAJ team ordinary lawn ya banquet ko royal wonderland me transform kar deti hai.",
    "features": [
      {
        "title": "Grand Royal Entrance Gateway",
        "desc": "Multi-tiered floral arches with chandelier drops and red carpet walkway."
      },
      {
        "title": "Centerpiece Mandap & Stage",
        "desc": "Customized architectural columns, cascading imported blooms and royal sofa."
      },
      {
        "title": "Complete Venue Illumination",
        "desc": "Trees, walkways, boundaries and dining area wrapped in warm fairy glow."
      },
      {
        "title": "VIP Lounge & Dining Styling",
        "desc": "Thematic fabric shamianas with chandeliers and luxury round table seating."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Royal Grand Wedding",
        "price": "\u20b91,80,000",
        "popular": true,
        "tagline": "Complete Venue Transformation",
        "features": [
          "50ft Stage Backdrop",
          "Traditional Mandap with Fresh Flowers",
          "Entrance Tunnel & Fairy Light Illumination",
          "Couple Sofa & VIP Seating",
          "Dining Area Styling"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya 3D visualization dekhne ko milti hai booking se pehle?",
        "a": "Ji haan, hum venue ke actual dimensions ke sath 3D render show karte hain."
      }
    ]
  },
  {
    "slug": "stage-decoration",
    "category": "decoration",
    "menuTitle": "Stage Decoration",
    "badge": "Mesmerizing Backdrops",
    "title": "Magnificent Wedding Stage Decoration & Backdrop Artistry",
    "subtitle": "40-60ft wide designer stages, golden pillars, cascading floral arches aur photographer-friendly studio lighting.",
    "heroImage": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "1000+",
        "label": "Stages Designed"
      },
      {
        "number": "60ft",
        "label": "Max Stage Width"
      },
      {
        "number": "HD",
        "label": "LED Backdrops"
      },
      {
        "number": "Studio",
        "label": "Lighting"
      }
    ],
    "overview": "Wedding ke 80% photos main stage par click hote hain. RIWAJ events ka stage decor ensure karta hai ki dulha-dulhan aur family har tasveer me royal lagein.",
    "features": [
      {
        "title": "Geometric & Floral Grand Backdrops",
        "desc": "Carved golden columns, floral mesh walls and neon initial highlights."
      },
      {
        "title": "Flicker-Free Balanced Lighting",
        "desc": "Warm ambient wash with no harsh facial shadows for flawless photography."
      },
      {
        "title": "Plush Velvet Royal Sofa",
        "desc": "Chesterfield and Maharaja throne sofas tailored to the wedding theme."
      },
      {
        "title": "Stage Carpeting & Ramps",
        "desc": "High gloss non-slip red/white carpets with floral side runners."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1760669343328-d84fbde15b65?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Imperial Floral Stage",
        "price": "\u20b965,000",
        "popular": true,
        "tagline": "High-Impact Centerpiece",
        "features": [
          "35x15ft Grand Backdrop",
          "Full Fresh Floral Arches",
          "Royal Sofa Set + Carpet",
          "Intelligent Uplighters (8 pcs)"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya stage me custom couple monogram lag sakta hai?",
        "a": "Ji haan, metallic acrylic ya LED neon me couple name monogram stage par lagaya jata hai."
      }
    ]
  },
  {
    "slug": "mandap-decoration",
    "category": "decoration",
    "menuTitle": "Mandap Decoration",
    "badge": "Sacred & Royal Saat Phere",
    "title": "Sacred & Royal Wedding Mandap Decoration",
    "subtitle": "Vedic traditional rajwadi mandaps, glass water pool mandaps, hanging floral bells aur auspicious hawan setups.",
    "heroImage": "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "600+",
        "label": "Mandaps Executed"
      },
      {
        "number": "100%",
        "label": "Vedic Principles"
      },
      {
        "number": "Fresh",
        "label": "Auspicious Flowers"
      },
      {
        "number": "Safe",
        "label": "Hawan Kund Setup"
      }
    ],
    "overview": "Saat pheron ki pavitra rasam ke liye mandap ka design sanskriti aur shahi shaan ka prateek hota hai. RIWAJ creates temple architecture, glass mandaps and royal domes.",
    "features": [
      {
        "title": "Temple Dome & Pillar Architecture",
        "desc": "Carved rajwadi pillars with sacred kalash and auspicious Vedic elements."
      },
      {
        "title": "Hanging Lotus & Marigold Chandeliers",
        "desc": "Cascading floral strings creating a spiritual and heavenly ceiling."
      },
      {
        "title": "Safe Hawankund & Seating",
        "desc": "Proper ventilation and comfortable wooden bajot seating for panditji and family."
      },
      {
        "title": "360-Degree Guest Sightlines",
        "desc": "Open mandap design ensuring all relatives can clearly witness the vows."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1680490961937-e933bf1ef920?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1771992228552-4cf49506dd7b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Rajwadi Temple Mandap",
        "price": "\u20b975,000",
        "popular": true,
        "tagline": "Authentic & Royal Setup",
        "features": [
          "4-Pillar Carved Dome Mandap",
          "Fresh Marigold & Jasmine Florals",
          "Brass Hawan Kund with Bajots",
          "Mandap Walkway with Floral Urli"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Hawan ke dhuen ke liye kya safety arrangement hota hai?",
        "a": "Hum specialized exhaust stands aur smokeless samagri guide karte hain taaki mandap me suffocation na ho."
      }
    ]
  },
  {
    "slug": "haldi-mehendi-decor",
    "category": "decoration",
    "menuTitle": "Haldi & Mehendi Decor",
    "badge": "Vibrant Yellow & Boho Colors",
    "title": "Vibrant Haldi & Mehendi Thematic D\u00e9cor",
    "subtitle": "Marigold floral curtains, traditional brass urlis, colorful cabanas, dreamcatchers aur bohemian photo swings.",
    "heroImage": "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "500+",
        "label": "Haldi Setups"
      },
      {
        "number": "Bright",
        "label": "Yellow & Orange Drapes"
      },
      {
        "number": "Fun",
        "label": "Photo Booths"
      },
      {
        "number": "100%",
        "label": "Fresh Blooms"
      }
    ],
    "overview": "Haldi aur Mehendi functions me rang, dhol aur masti sabse ahem hoti hai. RIWAJ decor team create karti hai photogenic vibrant setups jo social media par trending banein.",
    "features": [
      {
        "title": "Giant Brass Urli Seating",
        "desc": "Traditional brass urlis filled with rose petals and marigolds for bride and groom."
      },
      {
        "title": "Floral Jhula Swings",
        "desc": "Decorated wooden swings with lush green leaves and marigold chains."
      },
      {
        "title": "Boho Mehendi Cabanas",
        "desc": "Colorful tents with floor cushions, rugs, and dreamcatchers for bridesmaids."
      },
      {
        "title": "Interactive Photobooth with Props",
        "desc": "Rickshaws, cycle props, sunglasses, and quirky neon quotes."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1771992228552-4cf49506dd7b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1756483510767-35245638c057?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Marigold Masti Setup",
        "price": "\u20b935,000",
        "popular": true,
        "tagline": "Complete Haldi Rasam Decor",
        "features": [
          "Genda Phool Backdrop",
          "Brass Urli + Yellow Cushions",
          "Floral Jhula Swing",
          "Welcome Signage & Photo Props"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya flower jewellery bhi decor package me add hoti hai?",
        "a": "Ji haan, bride aur family ke liye fresh flower jewellery add-on ke roop me provide ki jaati hai."
      }
    ]
  },
  {
    "slug": "reception-decoration",
    "category": "decoration",
    "menuTitle": "Reception Decoration",
    "badge": "Glamorous & Imperial Nights",
    "title": "Glamorous Wedding Reception Stage & Ballroom D\u00e9cor",
    "subtitle": "Opulent chandeliers, high-gloss mirror walkway, cascading white floral arches aur ambient mood lighting.",
    "heroImage": "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "650+",
        "label": "Ballrooms Styled"
      },
      {
        "number": "Crystal",
        "label": "Chandeliers"
      },
      {
        "number": "Mirror",
        "label": "Ramps & Walkways"
      },
      {
        "number": "Grand",
        "label": "Photo Moments"
      }
    ],
    "overview": "Reception party ka look formal aur luxurious hona chahiye. RIWAJ reception decoration team champagne, blush pink aur golden lighting ke sath standard set karti hai.",
    "features": [
      {
        "title": "Massive Chandelier Ceilings",
        "desc": "Overhead box trussing with sparkling crystal chandeliers and floral drops."
      },
      {
        "title": "High-Gloss Mirror Aisles",
        "desc": "Reflective white mirror runway with cold pyros and floral side borders."
      },
      {
        "title": "Bespoke Royal Backdrops",
        "desc": "Tufted velvet panels, golden fretwork and imported rose installations."
      },
      {
        "title": "Ambient Banquet Illumination",
        "desc": "Intelligent moving lights creating a warm candle-lit evening vibe."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Imperial Ballroom Setup",
        "price": "\u20b91,20,000",
        "popular": true,
        "tagline": "High-End Reception Styling",
        "features": [
          "45ft Luxury Stage Backdrop",
          "Overhead Chandelier Canopy",
          "Mirror Walkway with Cold Pyros",
          "VIP Table Clusters Styling"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Cold pyro sparklers indoor me safe hain?",
        "a": "Bilkul! Hum smokeless, odorless certified cold sparklers use karte hain jo indoor banquet me safe hote hain."
      }
    ]
  },
  {
    "slug": "engagement-decoration",
    "category": "decoration",
    "menuTitle": "Engagement Decoration",
    "badge": "Modern Romantic Arches",
    "title": "Romantic Engagement & Ring Ceremony Stage D\u00e9cor",
    "subtitle": "Geometric golden frames, pastel floral rings, neon initial lettering ('Better Together') aur magical dry ice fog.",
    "heroImage": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "400+",
        "label": "Sagai Setups"
      },
      {
        "number": "Neon",
        "label": "Signage Highlights"
      },
      {
        "number": "Pastel",
        "label": "Floral Colorways"
      },
      {
        "number": "Dry Ice",
        "label": "Fog Effects"
      }
    ],
    "overview": "Engagement decor me romance aur modern aesthetics ka balance hona chahiye. RIWAJ engagement setups pastel blooms aur fairy lights ke sath fairytale look create karte hain.",
    "features": [
      {
        "title": "Geometric Circular & Hex Arch",
        "desc": "Gilded metallic rings covered in imported blush roses and eucalyptus."
      },
      {
        "title": "Custom Neon Glow Signage",
        "desc": "Quotes like 'Happily Ever After' or customized initials in glowing LED neon."
      },
      {
        "title": "Dramatic Ring Exchange Moment",
        "desc": "Low-lying dry ice clouds and cold pyros as the couple exchanges rings."
      },
      {
        "title": "Romantic Cake Table Setup",
        "desc": "Pedestals with fairy lights and floral garlands for the celebratory cake."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Fairytale Sagai Setup",
        "price": "\u20b945,000",
        "popular": true,
        "tagline": "Most Loved Engagement D\u00e9cor",
        "features": [
          "Pastel Floral Ring Stage",
          "Neon Quote Light",
          "Couple Sofa & Carpeting",
          "Ring Exchange Cold Pyros (4 pcs)"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya indoor banquet aur outdoor lawn dono me setup ho sakta hai?",
        "a": "Ji haan, hum venue type ke mutabiq frames aur lighting scale karte hain."
      }
    ]
  },
  {
    "slug": "floral-decoration",
    "category": "decoration",
    "menuTitle": "Floral Decoration",
    "badge": "Exotic Natural Blooms",
    "title": "Exotic Fresh Floral Styling & Natural Bloom Installations",
    "subtitle": "Imported Dutch roses, orchids, carnations, hydrangeas, baby's breath aur desi genda phool ki khushbudaar sajawat.",
    "heroImage": "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "100%",
        "label": "Fresh Farm Flowers"
      },
      {
        "number": "10+",
        "label": "Exotic Varieties"
      },
      {
        "number": "Master",
        "label": "Floral Architects"
      },
      {
        "number": "Eco",
        "label": "Floral Disposal"
      }
    ],
    "overview": "Phoolon ki taazgi kisi bhi shubh karyakram ko pavitra aur sundar bana deti hai. RIWAJ floral design team Bangalore aur Pune ke fresh farms se direct blooms source karti hai.",
    "features": [
      {
        "title": "Exotic Imported Floral Canopies",
        "desc": "Lush ceilings draped with orchids, gypsophila (baby's breath) and hydrangeas."
      },
      {
        "title": "Traditional Desi Floral Curtains",
        "desc": "Cascading yellow and orange marigold strings for rituals and entryways."
      },
      {
        "title": "Fragrant Jasmine & Rajnigandha Accents",
        "desc": "Natural sweet scents filling the mandap and VIP seating areas."
      },
      {
        "title": "Hydrated Long-Lasting Blooms",
        "desc": "Special water-tubed stems ensuring blooms stay crisp and fresh throughout the function."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1771992228552-4cf49506dd7b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Pure Flora Celebration",
        "price": "\u20b955,000",
        "popular": true,
        "tagline": "100% Fresh Flowers Package",
        "features": [
          "Main Stage Floral Work",
          "Entry Arch with Fresh Blooms",
          "Mandap Floral Accents",
          "Couple Garlands (Jaimala) Included"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya wedding ke baad flowers ka eco-friendly disposal hota hai?",
        "a": "Ji haan, hum waste flowers ko organic compost ya dhoop-batti manufacturing units me recycle karte hain."
      }
    ]
  },
  {
    "slug": "royal-luxury-decor",
    "category": "decoration",
    "menuTitle": "Royal & Luxury Decor",
    "badge": "Heritage Rajwadi Grandeur",
    "title": "Royal Rajwadi & Heritage Palace Wedding D\u00e9cor",
    "subtitle": "Intricately carved jharokhas, velvet shamianas, vintage lanterns, golden pillars aur royal court aesthetics.",
    "heroImage": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "150+",
        "label": "Palace Setups"
      },
      {
        "number": "Handcrafted",
        "label": "Jharokhas & Pillars"
      },
      {
        "number": "Velvet",
        "label": "Drapes & Shamianas"
      },
      {
        "number": "Heritage",
        "label": "MP Excellence"
      }
    ],
    "overview": "Rewa aur Central India ka itihaas shahi shaan se bhara hai. RIWAJ luxury team mahal jaisa darbar tayyar karti hai jisme traditional Rajputana aur Mughal grandeur live ho uthta hai.",
    "features": [
      {
        "title": "Handcrafted Royal Jharokha Sets",
        "desc": "Architectural palace courtyards with carved stone-finish arches."
      },
      {
        "title": "Deep Velvet & Zari Draping",
        "desc": "Maroon, royal blue and emerald velvet fabrics with golden border trims."
      },
      {
        "title": "Vintage Mashaal & Lantern Walkways",
        "desc": "Brass floor lanterns, oil lamps and flame light effects creating regal charm."
      },
      {
        "title": "Elephant & Peacock Art Installations",
        "desc": "Artisanal topiary sculptures welcoming guests at the palace entrance."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Maharaja Royal Court",
        "price": "\u20b92,20,000",
        "popular": true,
        "tagline": "Ultra Luxury Heritage Styling",
        "features": [
          "Full Palace Architecture Set",
          "Handcrafted Jharokhas & Golden Pillars",
          "Velvet Shamiana with Royal Seating",
          "Traditional Shehnai Welcome Stalls"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya normal ground ko mahal jaisa transform kiya ja sakta hai?",
        "a": "Ji haan! Hum complete fabrication aur structural facades lagakar open lawns ko royal palace bana dete hain."
      }
    ]
  },
  {
    "slug": "modern-minimalist-decor",
    "category": "decoration",
    "menuTitle": "Modern Minimalist Decor",
    "badge": "Contemporary Elegance",
    "title": "Contemporary Chic & Modern Minimalist Event D\u00e9cor",
    "subtitle": "Clean geometric lines, monochrome palettes, subtle ambient lighting, Pampas grass aur understated elegance.",
    "heroImage": "https://images.unsplash.com/photo-1760669343328-d84fbde15b65?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "200+",
        "label": "Chic Setups"
      },
      {
        "number": "Sleek",
        "label": "Matte Finishes"
      },
      {
        "number": "Neutral",
        "label": "Beige & White Tones"
      },
      {
        "number": "Modern",
        "label": "Aesthetics"
      }
    ],
    "overview": "Less is more. Modern couples jo over-the-top glitter ke bajaye sophisticated, classy aur chic visual look chahte hain, unke liye RIWAJ minimalist design perfection provide karta hai.",
    "features": [
      {
        "title": "Dried Florals & Pampas Grass",
        "desc": "Earthy bohemian textures, wheat stalks and dried palm leaves."
      },
      {
        "title": "Sleek Matte Black & Gold Metallic Arches",
        "desc": "Clean geometric structures without cluttered fabrics."
      },
      {
        "title": "Warm Edison Bulb Chandeliers",
        "desc": "Industrial chic hanging filaments and delicate fairy lights."
      },
      {
        "title": "Monochrome Linen & High Cocktail Tables",
        "desc": "Crisp white, ivory and grey palettes with minimalist florals."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Nordic Minimalist Chic",
        "price": "\u20b965,000",
        "popular": true,
        "tagline": "Sleek & Understated",
        "features": [
          "Pampas & Neutral Floral Arch",
          "Matte Gold Geometric Frames",
          "Edison Warm Bulb Lighting",
          "Cocktail High Tables Styling"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya evening cocktail parties ke liye minimalist decor best hai?",
        "a": "Bilkul! Evening cocktails aur intimate gatherings me minimalist lighting aur chic furniture sabse premium lagta hai."
      }
    ]
  },
  {
    "slug": "destination-wedding-decor",
    "category": "decoration",
    "menuTitle": "Destination Wedding Decor",
    "badge": "Resort & Scenic Landscapes",
    "title": "Resort & Destination Wedding D\u00e9cor Across Central India",
    "subtitle": "Poolside haldi cabanas, lakeside mandaps, sunset lawn setups, jungle lodge themes aur seamless multi-day transitions.",
    "heroImage": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "100+",
        "label": "Destination Weddings"
      },
      {
        "number": "Resort",
        "label": "Specialists"
      },
      {
        "number": "Multi-Day",
        "label": "Theme Flow"
      },
      {
        "number": "Weather",
        "label": "Proof Fabrication"
      }
    ],
    "overview": "Bandhavgarh jungle resorts, Khajuraho heritage hotels ya Rewa ke scenic lakeside properties me destination wedding decor nature ke sath blend hona chahiye. RIWAJ delivers magic.",
    "features": [
      {
        "title": "Floating Poolside Floral Mandaps",
        "desc": "Stunning water reflections with floating floral diyas and mandap structures."
      },
      {
        "title": "Sunset Lawn Backdrops",
        "desc": "Low-profile archways that showcase the natural horizon and sunset skies."
      },
      {
        "title": "Multi-Day Theme Transformation",
        "desc": "Day 1 Boho Mehendi to Day 2 Royal Sangeet to Day 3 Grand Wedding Mandap."
      },
      {
        "title": "Wind & Weather Resistant Setups",
        "desc": "Heavy engineered rigging safe against open resort winds and sudden rain."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Resort Destination 3-Day Decor",
        "price": "Custom Quote",
        "popular": true,
        "tagline": "End-to-End Resort Takeover",
        "features": [
          "Poolside Haldi Decor",
          "Concert Sangeet Stage with LED",
          "Grand Scenic Wedding Mandap",
          "Guest Welcome Desk & Room Decor"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya outstation resorts me permissions aur setup aap manage karte hain?",
        "a": "Ji haan, resort management ke sath coordination aur advance rigging hamari dedicated team sambhalti hai."
      }
    ]
  },
  {
    "slug": "birthday-theme-parties",
    "category": "decoration",
    "menuTitle": "Birthday & Theme Parties",
    "badge": "Exciting 3D Kids Themes",
    "title": "Exciting Kids & Adult Themed Birthday Party D\u00e9cor",
    "subtitle": "Pastel organic balloon arches, jungle safari, superhero, princess castle ya retro neon nightclub setups.",
    "heroImage": "https://images.unsplash.com/photo-1760669343328-d84fbde15b65?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "300+",
        "label": "Theme Birthdays"
      },
      {
        "number": "Custom",
        "label": "3D Character Cutouts"
      },
      {
        "number": "Organic",
        "label": "Balloon Garlands"
      },
      {
        "number": "Neon",
        "label": "Party Corners"
      }
    ],
    "overview": "Har birthday par kuch naya aur colorful hona chahiye. RIWAJ decor team customized 3D backdrops aur durable premium balloons ke sath dream party create karti hai.",
    "features": [
      {
        "title": "Organic Pastel & Chrome Balloon Arches",
        "desc": "Non-popping high quality balloon garlands with foil starbursts."
      },
      {
        "title": "3D Character Cutouts & Backdrop Panels",
        "desc": "Customized cartoon, superhero, princess, or neon nightclub backdrops."
      },
      {
        "title": "Cake Table Pedestal Clusters",
        "desc": "Cylindrical pedestals with matching dessert stands and personalized name boards."
      },
      {
        "title": "Illuminated Age LED Marquee Numbers",
        "desc": "3ft tall glowing number lights (e.g. '1', '18', '50') for showstopper photos."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Theme Birthday Delight",
        "price": "\u20b918,000",
        "popular": true,
        "tagline": "Complete Kids / Adult Theme",
        "features": [
          "15ft Organic Balloon Arch",
          "Custom 3D Theme Backdrop",
          "Pedestal Cake Table with Props",
          "LED Number Lights",
          "Personalized Welcome Board"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya balloons lambe samay tak fresh aur tight rehte hain?",
        "a": "Ji haan, hum commercial-grade chrome aur matte latex balloons use karte hain jo 24+ ghante tak intact rehte hain."
      }
    ]
  },
  {
    slug: "baby-shower",
    category: "decoration",
    menuTitle: "Baby Shower Decor",
    badge: "Godh Bharai & Baby Shower Decor",
    title: "Pyari Godh Bharai & Baby Shower Celebrations",
    subtitle: "Pastel balloon arches, traditional godh bharai seating, customized cakes aur aane wale nanhe mehmaan ke liye warm blessings.",
    heroImage: "https://images.unsplash.com/photo-1771992228552-4cf49506dd7b?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "180+", label: "Baby Showers Planned" },
      { number: "Pastel", label: "Balloon & Floral Themes" },
      { number: "100%", label: "Safe Non-Toxic Decors" },
      { number: "Joy", label: "Mom-to-Be Comfort Priority" },
    ],
    overview: "Nanhe mehmaan ke aane ki khushi me mom-to-be ke liye ek relaxing aur khushnuma mahaul tayyar karna hamara aim hota hai.",
    features: [
      { title: "Dreamy Pastel Balloon Arches", desc: "Baby pink, pastel blue, peach aur metallic gold balloons ka grand arch." },
      { title: "Comfortable Royal Mom-to-Be Chair", desc: "Extra cushioned floral throne chair taaki mom bilkul aaram se baith sakein." },
      { title: "Fun Baby Games & Props", desc: "Guess the baby date, advice cards, sash aur mom-to-be tiara." },
      { title: "Customized Cake Table Setup", desc: "Thematic dessert table, cupcake towers aur backdrop lettering." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1733937140732-2cc70a1d7017?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Sweet Blessing",
        price: "₹20,000",
        tagline: "Intimate Home / Hall Godh Bharai",
        features: ["Pastel balloon backdrop", "Baby shower neon sign", "Floral mom-to-be chair", "Props & Welcome board"],
      },
      {
        name: "Royal Baby Shower",
        price: "₹45,000",
        popular: true,
        tagline: "Grand Hotel & Banquet Setup",
        features: ["Massive organic balloon & fresh flower installation", "Custom 3D character cutouts", "Designer cake table with pedestals", "Sound system & anchor for games"],
      },
    ],
    faqs: [
      { q: "Kya balloons high quality aur durable hote hain?", a: "Ji haan, hum premium quality non-toxic chrome aur matte latex balloons use karte hain jo lambe time tak fresh rehte hain." },
    ],
  },
  {
    slug: "kitty-party",
    category: "decoration",
    menuTitle: "Kitty Party Decor",
    badge: "Fun & Thematic Party Décor",
    title: "Exciting Theme Kitty Parties & Ladies Get-Together Décor",
    subtitle: "Retro, Bollywood, Floral ya Hawaiian theme — Rewa ki ladies ke liye fun games, customized backdrops aur delicious snacks.",
    heroImage: "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "150+", label: "Kitty Parties Hosted" },
      { number: "Creative", label: "Themes & Dress Codes" },
      { number: "Fun", label: "Interactive Games & Prizes" },
      { number: "Instant", label: "Photo Memories" },
    ],
    overview: "Monthly kitty party ko boring restaurant visit se badalkar ek exciting themed celebration banaiye RIWAJ ke creative planning ke sath.",
    features: [
      { title: "Theme Backdrops & Props", desc: "Bollywood retro, casino, pastel tea party ya floral garden setup." },
      { title: "Fun Hosting & Games", desc: "Exciting tambola, funny quizzes aur customized props." },
      { title: "Finger-Licking Hi-Tea Menu", desc: "Gourmet chaats, artisanal bakery items aur refreshing mocktails." },
      { title: "Photobooth & Reel Corner", desc: "Instagram reels aur status photos ke liye well-lit selfie corner." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1743615467204-8fdaa85ff2db?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Fun Theme Kitty",
        price: "₹15,000",
        popular: true,
        tagline: "Upto 25 Ladies Theme Party",
        features: ["Customized Theme Backdrop", "Tambola & game kits", "Selfie booth with props", "Background music & host assistance"],
      },
    ],
    faqs: [
      { q: "Kya hum theme decide kar sakte hain?", a: "Bilkul, aap jo bhi theme bolein (e.g. Retro 80s, Pink Fairytale, Bollywood) hum wahi create kar denge." },
    ],
  },
  {
    "slug": "corporate-stage-backdrop",
    "category": "decoration",
    "menuTitle": "Corporate Stage & Backdrop",
    "badge": "Executive Brand Styling",
    "title": "Executive Corporate Stage, Backdrop & Exhibition D\u00e9cor",
    "subtitle": "Custom brand logo media walls, modern speaker podiums, sleek aluminum LED frames aur professional lighting.",
    "heroImage": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      {
        "number": "400+",
        "label": "Corporate Stages"
      },
      {
        "number": "High Res",
        "label": "Tension Fabric Walls"
      },
      {
        "number": "P3 LED",
        "label": "Display Integrations"
      },
      {
        "number": "100%",
        "label": "Brand Compliant"
      }
    ],
    "overview": "Corporate events me brand identity aur sophistication sabse ahem hoti hai. RIWAJ corporate stage decor team wrinkle-free media walls, professional podiums aur stage aesthetics provide karti hai.",
    "features": [
      {
        "title": "Wrinkle-Free Tension Fabric Backdrops",
        "desc": "Perfect high-resolution corporate logo branding with zero creases."
      },
      {
        "title": "Modern Acrylic & Wooden Podiums",
        "desc": "Sleek presentation lecterns with branded logo fascia and microphone mounts."
      },
      {
        "title": "LED Screen Framing & Stage Skirting",
        "desc": "Clean aluminum trussing and dark stage masking for executive look."
      },
      {
        "title": "Entrance Step-and-Repeat Media Wall",
        "desc": "Red carpet photo wall for VIP delegates and keynote speakers."
      }
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=75"
    ],
    "packages": [
      {
        "name": "Corporate Summit Stage",
        "price": "\u20b945,000",
        "popular": true,
        "tagline": "Executive Stage & Media Wall",
        "features": [
          "24x10ft Tension Fabric Backdrop",
          "Branded Acrylic Podium",
          "Red Carpet Media Photo Wall",
          "Stage Spotlights & Framing"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Kya company ke branding guidelines aur color codes exact match hote hain?",
        "a": "Ji haan! Hum Pantone / CMYK color codes ke sath digital proof approval ke baad hi print aur fabricate karte hain."
      }
    ]
  }
];

export const WEDDING_EVENTS: EventDetail[] = [
  {
    slug: "haldi-function",
    category: "wedding",
    menuTitle: "Haldi Function",
    badge: "Best Haldi Décor & Planning in Rewa",
    title: "Haldi Rasam Ki Grand Sajawat & Yellow Floral Themes",
    subtitle: "Desi genda phoolon ki barsaat, custom photobooths, traditional peela mandap aur dhamaakedar dhol ke sath manaiye apni Haldi ki rasam.",
    heroImage: "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "450+", label: "Haldi Functions Done" },
      { number: "100%", label: "Fresh Phool & Themes" },
      { number: "4.9★", label: "Happy Family Reviews" },
      { number: "Rewa & MP", label: "Ground Setup Team" },
    ],
    overview: "Haldi rasam shaadi ka sabse rang-biranga aur masti bhara function hota hai. RIWAJ events aapke liye laye hain traditional se lekar modern floral setups jo aapki photo aur video ko bilkul Instagram-worthy bana denge.",
    features: [
      { title: "Genda Phool & Floral Backdrops", desc: "Fresh yellow & orange marigold flowers se sajaya gaya exclusive royal background." },
      { title: "Special Urlis & Seating Setup", desc: "Dulha-Dulhan ke baithne ke liye traditional brass urli aur cushions ka shaandar intazaam." },
      { title: "Phoolon Ki Holi & Props", desc: "Yellow goggles, flower jewellery aur fun props pure parivar ke photo session ke liye." },
      { title: "Live Dhol & Desi Music Setup", desc: "Haldi rasam me energy bharne ke liye energetic live dhol aur sound system." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1771992228552-4cf49506dd7b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1733937140732-2cc70a1d7017?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Standard Haldi",
        price: "₹25,000",
        tagline: "Home & Small Lawn Functions ke liye",
        features: ["Yellow marigold backdrop", "Seating urli setup", "Basic entry arch", "Sound system & selfie frame"],
      },
      {
        name: "Royal Floral Haldi",
        price: "₹55,000",
        popular: true,
        tagline: "Resorts & Big Banquet Halls ke liye",
        features: ["Exotic flowers + Genda combo", "Grand bride/groom brass urli", "Live dhol for 2 hours", "Floral jewellery for 15 guests", "Smoke color effects"],
      },
      {
        name: "Luxury Carnival Haldi",
        price: "₹95,000",
        tagline: "Destination Style Mega Celebration",
        features: ["Complete venue yellow theme", "Phoolon ki holi blast setup", "Customized entry pathway", "Live food & mocktail stations", "Professional DJ & lighting"],
      },
    ],
    faqs: [
      { q: "Kya aap fresh phool hi use karte hain?", a: "Ji haan, hum daily fresh marigold aur exotic flowers use karte hain jisse function me fresh khushboo aur shaandar look aaye." },
      { q: "Kya hum apne customized theme ke hisab se design karwa sakte hain?", a: "Bilkul! Agar aapke paas koi reference photo ya Pinterest board hai, toh hamari design team bilkul waisa hi setup ready karegi." },
    ],
  },
  {
    slug: "mehendi-function",
    category: "wedding",
    menuTitle: "Mehendi Function",
    badge: "Designer Mehendi Artists & Vibrant Décor",
    title: "Mehendi Ki Raat, Sajawat Aur Khaas Andaaz",
    subtitle: "Bright colorful canopies, bohemian floral jhula, fairy light ambience aur Rewa ke best bridal mehendi artists ke sath apni sham banayein yaadgar.",
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "500+", label: "Mehendi Events Crafted" },
      { number: "25+", label: "Expert Mehendi Artists" },
      { number: "Custom", label: "Jhula & Canopy Designs" },
      { number: "100%", label: "Family Fun Guaranteed" },
    ],
    overview: "Mehendi ceremony me rang aur geet sangeet ka alag hi maza hota hai. RIWAJ events Rewa me laata hai colorful Rajasthani aur Bohemian themes jo dulhan aur saheliyon ke photo sessions ke liye perfect hain.",
    features: [
      { title: "Designer Floral Jhula", desc: "Dulhan ke baithne ke liye khubsoorat jhula jisme fresh roses aur orchids ki sajawat hoti hai." },
      { title: "Colorful Drapes & Canopy", desc: "Pink, orange aur parrot green shades ke royal fabric canopies aur floor seating." },
      { title: "Top Mehendi Artists", desc: "Arabic, Marwari aur Portrait bridal mehendi ke trained artists jo fastest speed aur dark rang laate hain." },
      { title: "Evening Fairy Lighting", desc: "Shaam ke waqt glowing fairy lights, lanterns aur warm chandeliers ka jadoo." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1628221482312-439eb2f3367d?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1756483510767-35245638c057?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Classic Mehendi",
        price: "₹30,000",
        tagline: "Compact Lawn / Rooftop setup",
        features: ["Colorful drapes background", "Floral jhula decoration", "Basic lighting & music", "Props for photography"],
      },
      {
        name: "Boho Royal Mehendi",
        price: "₹65,000",
        popular: true,
        tagline: "Sabse Zyada Pasand Kiya Jane Wala Package",
        features: ["Exotic flowers designer jhula", "Moroccan floor cushions & tables", "Fairy light tunnel entry", "2 Senior Mehendi Artists included", "Cold pyros for bride entry"],
      },
    ],
    faqs: [
      { q: "Mehendi artists ka charge alag se hota hai kya?", a: "Hum package ke sath combo me artists provide karte hain jisse aapko best price milta hai." },
    ],
  },
  {
    slug: "ring-ceremony",
    category: "wedding",
    menuTitle: "Ring Ceremony",
    badge: "Two Hearts, One Promise",
    title: "Romantic Sagai & Royal Ring Ceremony Planners",
    subtitle: "Grand engagement stage, ring platter entry, cold pyro sparklers aur magical fairytale floral decor jo dono parivaron ko impress kar de.",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "600+", label: "Ring Ceremonies Managed" },
      { number: "180+", label: "Venues Covered in MP" },
      { number: "4.9★", label: "Average Rating" },
      { number: "100%", label: "Customizable Décor" },
    ],
    overview: "Sagai wo pehla kadam hai jab do parivar ek hote hain. RIWAJ ka royal ring ceremony concept aapke stage aur couple entry ko aisi grandeur deta hai jo hamesha ke liye dil me bas jaye.",
    features: [
      { title: "Dream Stage Backdrop", desc: "Pastel blooms, geometric golden arches aur neon light signage (Better Together / Engagement)." },
      { title: "Dramatic Ring Platter Entry", desc: "Dry ice fog effect, hydraulic platter ya flower chandelier se ring reveal ka special moment." },
      { title: "Cold Pyro & Sparkular Entry", desc: "Safe smokeless indoor cold pyros jab couple ek doosre ko ring pehnate hain." },
      { title: "Cinematic Stage Lighting", desc: "Warm ambient wash, moving beam lights aur spotlight couple portraits ke liye." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Elegance Engagement",
        price: "₹45,000",
        tagline: "Elegant indoor banquet setup",
        features: ["Floral golden frame backdrop", "Couple sofa & stage carpeting", "Ring exchange cold pyros (4 pcs)", "Custom name initials signage"],
      },
      {
        name: "Royal Fairytale Sagai",
        price: "₹85,000",
        popular: true,
        tagline: "Grand Resort & Open Lawn Setup",
        features: ["Massive floral arch stage with LED wall", "Dry ice cloud fog on stage", "8 Cold pyro sparklers on ring moment", "Red carpet floral walkway entry", "Dedicated sound & stage lighting"],
      },
    ],
    faqs: [
      { q: "Ring ceremony me dry ice fog safe rehti hai kya?", a: "Ji haan, hum 100% safe non-toxic food-grade dry ice machines use karte hain jo indoor banquet halls ke liye bilkul safe hoti hain." },
    ],
  },
  {
    slug: "sangeet-ceremony",
    category: "wedding",
    menuTitle: "Sangeet Ceremony",
    badge: "High-Energy Music & Concert Stage",
    title: "Dhamakedar Sangeet Night & Dance Stage Décor",
    subtitle: "Concert-style LED wall, truss lighting, professional DJ sound, energetic anchoring aur Bollywood style dance floor setup.",
    heroImage: "https://images.unsplash.com/photo-1766113483422-7c871de23591?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "350+", label: "Rocking Sangeet Nights" },
      { number: "Top DJs", label: "Rewa & MP Region" },
      { number: "4K LED", label: "Display Screens" },
      { number: "Full", label: "Sound & Lighting Truss" },
    ],
    overview: "Sangeet raat hoti hai dosto aur parivar ke dance performances ke liye. RIWAJ events stage ko kisi Bollywood award function jaisa look aur sound deta hai.",
    features: [
      { title: "High-Definition LED Wall", desc: "Background me live video mixing, family performance visuals aur custom graphics." },
      { title: "Aluminum Truss & Sharpy Lights", desc: "Moving beams, blinder lights aur smoke machines jo pure hall me concert jaisa mahol bana de." },
      { title: "Professional Wedding DJ & Sound", desc: "Line array speakers aur best Bollywood, Punjabi & regional tracks ki playlist." },
      { title: "Stage Floor & Couple Ramp", desc: "Non-slip high gloss dance stage jaha sabhi comfortably perform kar sakein." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1756483510767-35245638c057?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Star Sangeet",
        price: "₹60,000",
        tagline: "Banquet Hall Dance Setup",
        features: ["16x10 ft LED backdrop", "Sharpy moving lights (8 pcs)", "DJ setup with subwoofers", "Smoke fog machine"],
      },
      {
        name: "Mega Concert Sangeet",
        price: "₹1,20,000",
        popular: true,
        tagline: "Large Lawn & Luxury Wedding Venue",
        features: ["Full Aluminum Box Truss System", "24x12 ft P3 HD LED screen", "JBL Line Array Sound", "CO2 jets & cold pyro blasts", "Professional Anchor / Emcee included"],
      },
    ],
    faqs: [
      { q: "Family practice ke liye sound system pehle mil sakta hai kya?", a: "Ji haan, hum function se pehle sound check aur dance rehearsal ke liye time provide karte hain." },
    ],
  },
  {
    slug: "cocktail-party",
    category: "wedding",
    menuTitle: "Cocktail Party",
    badge: "Glamorous Evening & Lounge Soiree",
    title: "Glamorous Cocktail Night & Moody Bar Décor",
    subtitle: "Sleek modern lounge seating, neon glow lighting, signature mocktail/cocktail bars aur acoustic live band setup.",
    heroImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "200+", label: "Cocktail Parties Managed" },
      { number: "Chic", label: "Modern Lounge Themes" },
      { number: "Custom", label: "Illuminated Bar Counters" },
      { number: "VIP", label: "Hospitality Management" },
    ],
    overview: "Youngsters aur dosto ke liye shaadi ka sabse chill function. Modern bar counters, dim romantic ambient lights aur Western aesthetics ke sath RIWAJ events banata hai aisi sham jo log saalo yaad rakhein.",
    features: [
      { title: "Illuminated LED Bar Counter", desc: "Custom acrylic bars with backlighting aur professional flair bartenders." },
      { title: "Plush Velvet Lounge Seating", desc: "Chesterfield sofas, high cocktail tables aur low coffee seating." },
      { title: "Neon Signages & Photo Corners", desc: "Catchy quotes neon signs (Drunk in Love, Pour Some Love) selfie points ke sath." },
      { title: "Acoustic / Live Saxophone Setup", desc: "Subtle background melodies jo party ke mahol ko ultra-luxurious banati hain." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1766113483422-7c871de23591?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1727280376746-b89107a5b0df?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Lounge Cocktail",
        price: "₹50,000",
        tagline: "Intimate Evening with close friends",
        features: ["1 Designer Bar counter", "Lounge sofa clusters", "Mood ambient uplighting", "Neon photo booth"],
      },
      {
        name: "Royal Club Night",
        price: "₹90,000",
        popular: true,
        tagline: "High-Energy Modern Evening",
        features: ["Double island bar counter", "Full venue dark ambient lighting", "Professional Flair Bartenders team", "Dance floor with beam lights", "Live acoustic band setup"],
      },
    ],
    faqs: [
      { q: "Kya aap bar tender aur glassware bhi supply karte hain?", a: "Ji haan, bartender team, designer glassware, ice and syrups sabhi hum arrange karte hain." },
    ],
  },
  {
    slug: "pre-wedding-shoot",
    category: "wedding",
    menuTitle: "Pre Wedding Shoot",
    badge: "Cinematic Love Story in Rewa & MP",
    title: "Filmy Pre-Wedding Shoot Setup & Royal Locations",
    subtitle: "Rewa ke royal palaces, Govindgarh Lake, waterfalls aur custom sets par cinematic drone photography aur 4K video teaser.",
    heroImage: "https://images.unsplash.com/photo-1628315821764-e15c0cec9024?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "300+", label: "Couples Captured" },
      { number: "15+", label: "Secret Scenic Spots" },
      { number: "Drone", label: "4K Aerial Cinematography" },
      { number: "Full", label: "Props & Styling Support" },
    ],
    overview: "Shaadi se pehle couple ka romantic safar capture karna sabse pyaara anubhav hai. RIWAJ team Rewa, Bandhavgarh aur aas-paas ke royal heritage spots par filmy style pre-wedding shoot arrange karti hai.",
    features: [
      { title: "Scenic Location Permits", desc: "Govindgarh Lake, Rewa Fort, Keoti/Chachai falls aur private resorts me hassle-free permission." },
      { title: "Creative Props & Setups", desc: "Smoke bombs, floating boat decor, vintage cars aur fairy light setups." },
      { title: "Drone & Gimbal Videography", desc: "Bollywood teaser style video editing with trending background music." },
      { title: "Outfit Changes & Vanity Support", desc: "Portable changing vanity tents aur on-location stylist support." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Classic Shoot",
        price: "₹35,000",
        tagline: "1 Day / 2 Locations in Rewa",
        features: ["2 Scenic locations", "1 Cinematic Teaser (2-3 min)", "40 Edited High-Res Photos", "Drone shots included"],
      },
      {
        name: "Royal Heritage Shoot",
        price: "₹65,000",
        popular: true,
        tagline: "2 Days Multi-location Experience",
        features: ["Palace & Lake locations", "Full 4K Cinematic Love Story Video", "100+ Edited Photos + Raw data", "Drone 4K aerial shots", "Props & Smoke bombs setup included"],
      },
    ],
    faqs: [
      { q: "Shoot ke kitne din baad video aur photos mil jaate hain?", a: "Teaser video hum 7 dino ke andar aur full edited photos 10 dino ke andar deliver karte hain." },
    ],
  },
  {
    slug: "wedding-package",
    category: "wedding",
    menuTitle: "Wedding Package",
    badge: "All-in-One Wedding Solutions",
    title: "Complete All-in-One Shaadi Packages in Rewa & MP",
    subtitle: "Haldi se lekar Vidai tak — Mandap, Catering, Stage, DJ, Photography sab kuch ek hi transparent package me bina kisi jhanjhat ke.",
    heroImage: "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "750+", label: "Weddings Executed" },
      { number: "All-In-One", label: "Single Vendor Solution" },
      { number: "0", label: "Hidden Charges Guarantee" },
      { number: "10+", label: "Years Experience" },
    ],
    overview: "Alag-alag vendors ke peeche bhagne ki zaroorat nahi hai. RIWAJ events ka all-in-one package aapko stage, mandap, light, sound, hospitality aur coordination sab kuch ek jagah deta hai.",
    features: [
      { title: "Complete Mandap & Stage Décor", desc: "Royal rajwadi, modern floral ya temple architecture mandap aapke choice par." },
      { title: "Wedding Day Logistics & Hospitality", desc: "Baraat welcome, safa tying, room coordination aur VIP guest care." },
      { title: "Complete Lighting & Ambience", desc: "Entire venue entrance, trees, walkways aur parking lighting." },
      { title: "Dedicated Event Director", desc: "Event day par ek senior event manager jo har minute ka coordination sambhalta hai." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Silver Wedding Package",
        price: "₹2,50,000",
        tagline: "Essential 2-Day Wedding Functions",
        features: ["Main Wedding Stage + Mandap", "Haldi/Mehendi basic setup", "Entry gate & pathway lighting", "Sound system & Safa band for 50 guests"],
      },
      {
        name: "Gold Royal Package",
        price: "₹5,00,000",
        popular: true,
        tagline: "Most Loved Complete Wedding Solution",
        features: ["Grand Palace Mandap setup", "Haldi + Mehendi + Sangeet complete setups", "Cold pyros & baraat special effects", "Full venue fairy light illumination", "Dedicated team of 6 coordinators"],
      },
      {
        name: "Diamond Imperial Package",
        price: "₹9,50,000+",
        tagline: "Ultra Luxury 3-Day Celebration",
        features: ["Massive designer stage & glass mandap", "Imported fresh floral installations", "Concert Sangeet with P3 LED wall", "Luxury couple entry with mechanical hydraulic stage", "VIP guest logistics & personal shadow managers"],
      },
    ],
    faqs: [
      { q: "Kya packages me catering bhi shamil hoti hai?", a: "Ji haan, hum catering ke sath custom combo bana sakte hain jisme per-plate menu aapke swad ke mutabiq decide hota hai." },
    ],
  },
  {
    slug: "complete-wedding-planning",
    category: "wedding",
    menuTitle: "Complete Wedding Planning",
    badge: "Zero-Stress Wedding Management",
    title: "Zero-Stress Complete Wedding Planning & Execution",
    subtitle: "Roka se lekar Vidai tak, har rasam ki zimmedari hamari — aap aur aapka parivar sirf khushiyan manaiye aur guest bane rahiye.",
    heroImage: "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "100%", label: "Stress Free Execution" },
      { number: "24x7", label: "Wedding Helpline Support" },
      { number: "Rewa", label: "Deep Local Ground Network" },
      { number: "500+", label: "Success Stories Since 2013" },
    ],
    overview: "Shaadi ke din parivar ko bhaag-daud nahi karni chahiye. RIWAJ ki full-service planning me vendor management, timing sheet, pandit ji coordination aur guest hospitality sab hamari zimmedari hoti hai.",
    features: [
      { title: "Complete Budget Formulation", desc: "Pehle din se clear budget tracker taaki koi unexpected kharcha na ho." },
      { title: "Vendor Negotiations", desc: "Best pandit ji, dhol, ghodi, vintage car, catering aur makeup artists at genuine rates." },
      { title: "Minute-to-Minute Timeline Management", desc: "Muhurat ke hisab se har function time par start aur complete karwana." },
      { title: "Guest Helpdesk & Room Allocation", desc: "Hotel rooms, welcome hampers aur out-of-town guests ka special khayal." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1763553113332-800519753e40?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Full Service Planning Fee",
        price: "Custom Quote",
        popular: true,
        tagline: "Aapke wedding scale ke mutabiq transparent fees",
        features: ["Dedicated Lead Planner", "Vendor contracting & management", "Design & 3D layout planning", "On-site team of 8 coordinators", "Guest RSVP & hotel logistics"],
      },
    ],
    faqs: [
      { q: "Planning process kab start karni chahiye?", a: "Ideally shaadi se 3 se 6 mahine pehle start karne se best venues aur genuine vendor rates milte hain." },
    ],
  },
  {
    slug: "reception",
    category: "wedding",
    menuTitle: "Reception",
    badge: "Grand Royal Entrance & Stage",
    title: "Grand Wedding Reception & Stage Artistry in Rewa",
    subtitle: "Majestic floral arches, royal velvet walkway, grand LED backdrop stage aur premium couple seating jo sabhi guests ko mesmerize kar de.",
    heroImage: "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "700+", label: "Receptions Designed" },
      { number: "Mega", label: "Stage Installations" },
      { number: "Red Carpet", label: "VIP Walkways" },
      { number: "Flawless", label: "Guest Flow Management" },
    ],
    overview: "Reception wo function hai jaha city ke sabhi khas mehmaan aur dignitaries naye jode ko aashirwad dene aate hain. Stage ka grandeur aisa hona chahiye jo standard set kar de.",
    features: [
      { title: "Massive Royal Backdrop Stage", desc: "Up to 50ft wide designer stages with golden pillars, cascading blooms and royal sofas." },
      { title: "Grand Couple Walkway Entry", desc: "Mirror carpet, flower tunnels, cold pyros and soft instrumental live music." },
      { title: "Dignitary & VIP Seating Section", desc: "Special round table sofa zones for senior family members and VIP guests." },
      { title: "Buffet & Dining Hall Illumination", desc: "Food area me appetizing warm lighting aur clean thematic presentation." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Classic Reception",
        price: "₹65,000",
        tagline: "Banquet Hall Stage & Seating",
        features: ["30ft Floral & golden stage", "Royal velvet couple sofa", "Red carpet walkway entry", "Warm stage spot lighting"],
      },
      {
        name: "Imperial Grand Reception",
        price: "₹1,50,000",
        popular: true,
        tagline: "Large Open Lawn & Resort Reception",
        features: ["50ft Palace Architecture Stage", "Full fresh imported floral work", "100ft Flower canopy walkway", "Cold pyro fountain blast for couple entry", "Live Shehnai / Violin welcome artists"],
      },
    ],
    faqs: [
      { q: "Kya stage par photo click karne ke liye professional lighting hoti hai?", a: "Ji haan, hum photographer-friendly balanced flicker-free lights lagate hain jisse photos me face par koi dark shadows na aayein." },
    ],
  },
  {
    slug: "luxury-wedding-planner",
    category: "wedding",
    menuTitle: "Luxury Wedding Planner",
    badge: "Opulent & Royal Celebrations",
    title: "Luxury & High-Profile Wedding Planner in Madhya Pradesh",
    subtitle: "5-star hospitality, customized palace architectural sets, celebrity performers, designer gifting aur bespoke royal execution.",
    heroImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "100+", label: "Elite Luxury Weddings" },
      { number: "VIP", label: "Security & Guest Care" },
      { number: "Exclusive", label: "Celebrity Artist Booking" },
      { number: "3D", label: "Complete Architectural Sets" },
    ],
    overview: "Jab baat ho ek aisi shaadi ki jo saalo tak charcha ka vishay bani rahe, tab RIWAJ luxury team entry leti hai. Hum international level ki aesthetics ko Rewa aur MP ki royal traditions ke sath blend karte hain.",
    features: [
      { title: "Bespoke 3D Venue Fabrication", desc: "Khali zameen ya lawn ko kisi royal palace courtyard me badal dena." },
      { title: "Celebrity & Folk Artists", desc: "Top Rajasthani manganiyar, Sufi singers aur Bollywood singers ki seamless booking." },
      { title: "White-Glove VIP Hospitality", desc: "Personal shadow coordinators har VIP family member aur outstation guests ke liye." },
      { title: "Gourmet Global Catering Concepts", desc: "Live chaat counters, regional delicacies aur international food stations." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Royal Bespoke",
        price: "Customized on Brief",
        popular: true,
        tagline: "Exclusive high-end wedding curation",
        features: ["Complete 3D walkthrough design", "Unlimited custom installations", "Full production & technical team", "End-to-end guest logistics across hotels"],
      },
    ],
    faqs: [
      { q: "Kya aap personal design consultation provide karte hain?", a: "Ji haan, hamare lead creative directors aapke sath baithkar 3D renders aur mood boards tayyar karte hain." },
    ],
  },
  {
    slug: "destination-wedding",
    category: "wedding",
    menuTitle: "Destination Wedding",
    badge: "Exotic Forts & Heritage Resorts",
    title: "Dream Destination Weddings Across Heritage MP & Beyond",
    subtitle: "Bandhavgarh Jungle Resorts, Khajuraho Temple Backdrops, Orchha Palaces ya Varanasi Ghats — Hamare sath plan kijiye apna dream destination wedding.",
    heroImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "80+", label: "Destination Weddings" },
      { number: "Top", label: "Resort Tie-ups in MP" },
      { number: "Complete", label: "Travel & Room Logistics" },
      { number: "Memorable", label: "Holiday Experience" },
    ],
    overview: "Destination wedding ka matlab hai parivar ke sath ek relaxing vacation jaha shaadi ke har pal ko bindass enjoy kiya jaye. RIWAJ team sabhi resort bookings, guest travel aur decor ko smoothly execute karti hai.",
    features: [
      { title: "Top Heritage Resorts Tie-Ups", desc: "Bandhavgarh jungle lodges, Khajuraho 5-star hotels aur Orchha riverside forts me best group rates." },
      { title: "Guest Travel & Safari Coordination", desc: "Airport transfers, local sight-seeing aur jungle safaris guests ke liye." },
      { title: "Multi-Day Thematic Celebrations", desc: "Poolside haldi, jungle safari theme sangeet aur royal palace mandap." },
      { title: "On-Site Command Center", desc: "Hotel me 24/7 helpdesk jo guests ki har zaroorat ka dhyan rakhti hai." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Destination Heritage Package",
        price: "Custom Quote",
        popular: true,
        tagline: "Complete Resort Takeover Planning",
        features: ["Resort venue procurement", "2 Nights / 3 Days multi-event decor", "Guest airport/station pickup fleet", "Logistics & room allocation crew"],
      },
    ],
    faqs: [
      { q: "Kitne guests ke liye destination wedding best rehti hai?", a: "Usually 150 se 300 close family members aur friends ke sath destination weddings sabse entertaining aur memorable hoti hain." },
    ],
  },
  {
    slug: "budget-wedding-planner",
    category: "wedding",
    menuTitle: "Budget Wedding Planner",
    badge: "Affordable & Honest Pricing",
    title: "Budget-Friendly Wedding Planning — Smart & Grand",
    subtitle: "Kam kharche me bhi shandar dikhne wali shaadi — Smart vendor management, honest costing aur zero unnecessary commission.",
    heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "400+", label: "Budget Weddings Managed" },
      { number: "Save 25%", label: "Through Smart Planning" },
      { number: "Fixed", label: "Transparent Packages" },
      { number: "No", label: "Hidden Cost Guarantee" },
    ],
    overview: "Kharcha kam ho iska matlab ye bilkul nahi ki shaadi sadharon dikhe. Hamara smart design approach reusable elements aur local seasonal flowers use karta hai taaki har paisa count kare.",
    features: [
      { title: "Smart Floral Styling", desc: "Seasonal local blooms aur elegant fabric drapes ka smart combination." },
      { title: "Direct Vendor Connections", desc: "Bina kisi middleman commission ke direct wholesale rates par services." },
      { title: "High-Impact Stage Focus", desc: "Jaha sabhi photos click hoti hain us main stage aur mandap ko highlight karna." },
      { title: "Transparent Cost Breakdown", desc: "Har cheez ka written bill aur advance clear commitment." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Smart Budget Wedding",
        price: "₹1,50,000",
        popular: true,
        tagline: "Complete 1-Day Wedding Setup",
        features: ["Main Stage + Mandap floral decor", "Entry gate & pathway lighting", "Couple seating sofa", "Basic sound & Baraat welcome setup"],
      },
    ],
    faqs: [
      { q: "Kya budget package me quality compromise hoti hai?", a: "Katai nahi! Hum design smartly optimize karte hain taaki look royal rahe aur cost control me ho." },
    ],
  },
];

export const CORPORATE_EVENTS: EventDetail[] = [
  {
    slug: "banquet-hall",
    category: "corporate",
    menuTitle: "Banquet Hall",
    badge: "Premium Corporate Venues",
    title: "Banquet Hall Selection & Professional Corporate Setup",
    subtitle: "Rewa aur aas-paas ke top AC banquet halls ki booking, round-table seating, stage backdrop aur customized corporate dining.",
    heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "300+", label: "Banquet Setups Done" },
      { number: "AC", label: "Top Premium Venues" },
      { number: "Round Table", label: "Executive Seating" },
      { number: "Full", label: "Audio-Visual Systems" },
    ],
    overview: "Kisi bhi official function ke liye sahi banquet hall aur disciplined seating arrangement sabse pehli zaroorat hoti hai. RIWAJ team ensure karti hai ki aapka corporate image top class lage.",
    features: [
      { title: "Executive Round Table Layouts", desc: "Crisp white linen, customized table numbers, stationary and mineral water bottles." },
      { title: "Stage & Podium Setup", desc: "Corporate branded backdrop, sleek wooden/acrylic podium and cordless microphones." },
      { title: "Full PA & Sound System", desc: "Echo-free high clarity sound for speeches, presentations and background music." },
      { title: "Corporate Buffet Catering", desc: "Hygienic, multi-course executive lunch and dinner with live counters." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Executive Banquet Setup",
        price: "₹35,000",
        tagline: "Upto 100 Delegates",
        features: ["Corporate stage backdrop", "Podium with mic", "PA Sound system with 2 cordless mics", "Round table seating styling"],
      },
    ],
    faqs: [
      { q: "Kya hall booking bhi aapke through hoti hai?", a: "Ji haan, hum partner banquet halls me negotiated corporate rates par booking karwate hain." },
    ],
  },
  {
    slug: "seminar-hall",
    category: "corporate",
    menuTitle: "Seminar Hall",
    badge: "Academic & Training Sessions",
    title: "Seminar & Workshop Hall Management in Rewa",
    subtitle: "High-lumen projector screens, comfortable classroom seating, clear collar mics aur delegate registration desk.",
    heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "150+", label: "Seminars Executed" },
      { number: "1080p", label: "HD Projectors & Screens" },
      { number: "Clean", label: "Audio & Collar Mics" },
      { number: "Smooth", label: "Registration Desks" },
    ],
    overview: "Doctors, teachers, coaching institutes aur IT companies ke training seminars ke liye RIWAJ provide karta hai focused, professional environment.",
    features: [
      { title: "High-Lumen Projection Screens", desc: "Large format projection ya LED display taaki last bench tak PPT saaf dikhe." },
      { title: "Wireless Collar & Handheld Mics", desc: "Speakers ke free movement ke liye high frequency noise-cancelling mics." },
      { title: "Delegate Welcome & Kit Distribution", desc: "Uniformed hostesses for registration, badges and delegate file distribution." },
      { title: "Tea/Coffee & Cookie Breaks", desc: "Session ke beech me quick hygienic refreshment setups." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Standard Seminar",
        price: "₹25,000",
        popular: true,
        tagline: "Half Day / Full Day Workshop Setup",
        features: ["HD Projector & 10ft Screen", "Podium + 2 Collar Mics + PA System", "Registration Desk with banner", "Technician on-site throughout session"],
      },
    ],
    faqs: [
      { q: "Kya session ke dauran technical assistant present rehta hai?", a: "Ji haan, hamara dedicated AV technician pure session ke dauran stage par present rehta hai." },
    ],
  },
  {
    slug: "party-hall",
    category: "corporate",
    menuTitle: "Party Hall",
    badge: "Corporate Success Celebrations",
    title: "Corporate Party Halls & Success Celebrations",
    subtitle: "Target poora hone par team celebration, promotions party, aur office festival events ke liye energetic party halls.",
    heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "200+", label: "Corporate Parties Done" },
      { number: "High Energy", label: "DJ & Dance Floor" },
      { number: "Custom", label: "Company Logo Themes" },
      { number: "Fun", label: "Team Bonding Games" },
    ],
    overview: "Kaam ke pressure ke baad poori team ko reward karne ke liye ek mast party ki zaroorat hoti hai. RIWAJ events arranges high-energy party setups.",
    features: [
      { title: "DJ & Intelligent Lighting", desc: "Bollywood & club tracks for employees to dance and celebrate." },
      { title: "Thematic Photo Backdrops", desc: "Team photos ke liye customized company branded photo booths." },
      { title: "Cocktail/Mocktail Bars", desc: "Live mocktail mixers, finger foods and delicious starters." },
      { title: "Award & Trophy Stage", desc: "Star performers ko recognize karne ke liye special spotlight stage." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Team Bash Setup",
        price: "₹35,000",
        popular: true,
        tagline: "Corporate Festive / Success Party",
        features: ["DJ with dance floor lighting", "Branded photo wall", "Stage backdrop with company logo", "Emcee / Anchor for team games"],
      },
    ],
    faqs: [
      { q: "Kya team games organize karne ke liye anchor mil sakta hai?", a: "Ji haan, hamare paas corporate-trained anchors hain jo engaging team activities conduct karte hain." },
    ],
  },
  {
    slug: "corporate-events",
    category: "corporate",
    menuTitle: "Corporate Events",
    badge: "End-to-End Corporate Solutions",
    title: "Complete Corporate Event Management in Rewa & MP",
    subtitle: "Brand launches, dealer meets, medical conferences aur business summits ke liye comprehensive professional management.",
    heroImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "400+", label: "Corporate Projects" },
      { number: "Top", label: "National Brands Served" },
      { number: "Complete", label: "AV, Stage & Hospitality" },
      { number: "GST", label: "Compliant Invoicing" },
    ],
    overview: "Corporate events me perfection, timing aur brand identity sabse matter karti hai. RIWAJ events Rewa aur Central India me top companies ka trusted partner hai.",
    features: [
      { title: "Full Event Fabrication", desc: "Custom 3D stage backdrops, entrance arches and branded walkways." },
      { title: "State-of-the-Art AV Production", desc: "P3 LED screens, digital sound consoles, stage lighting and live streaming." },
      { title: "Corporate Gifting & Badges", desc: "Customized promotional gifts, delegate IDs, certificates and hampers." },
      { title: "VIP Transport & Hotel Logistics", desc: "Executive car fleet, hotel room booking and airport coordination." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Brand Summit Package",
        price: "₹75,000",
        popular: true,
        tagline: "Standard Corporate Gathering",
        features: ["Customized stage with LED screen", "Audio setup with 4 cordless mics", "Branded entrance & registration desk", "Professional photography & highlight video"],
      },
    ],
    faqs: [
      { q: "Kya aap GST invoice provide karte hain?", a: "Ji haan, 100% compliant corporate GST billing provide ki jaati hai." },
    ],
  },
  {
    slug: "group-events",
    category: "corporate",
    menuTitle: "Group Events",
    badge: "Team Building & Outings",
    title: "Group Events & Employee Engagement Outings",
    subtitle: "Outstation team outings, leadership retreats, fun sports days aur networking gatherings — energetic activities aur stress-free execution.",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "100+", label: "Team Retreats" },
      { number: "Fun", label: "Interactive Outdoor Games" },
      { number: "Scenic", label: "Top Resort Venues" },
      { number: "Team", label: "Morale Boosting" },
    ],
    overview: "Office cubicles se bahar nikal kar open resort me team ke sath engage karna employee bonding aur productivity ke liye best hota hai. RIWAJ events arranges smooth logistics, interactive games aur memorable outdoor experiences.",
    features: [
      { title: "Team Building Activities", desc: "Tug of war, trust walk, communication games managed by professional corporate trainers." },
      { title: "Resort Day Booking & Meals", desc: "Breakfast, executive lunch, evening high-tea and gala dinner packages at scenic properties." },
      { title: "Recreational Sports & Tournaments", desc: "Cricket matches, badminton, volleyball aur swimming pool games with customized medals." },
      { title: "Campfire & Acoustic Evening", desc: "Night bonfires with live singer, DJ music, barbecue counters aur memorable bonding." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Day-Out Retreat",
        price: "₹40,000",
        popular: true,
        tagline: "Team Outing for 50 Employees",
        features: ["Resort ground activities setup", "Sound setup for games", "Facilitator for team building games", "Evening acoustic music setup"],
      },
    ],
    faqs: [
      { q: "Kya resort me transportation bhi arrange ho sakti hai?", a: "Ji haan, AC luxury buses aur private cabs poori team ke pickup aur drop ke liye arrange ki jaati hain." },
      { q: "Kitne logon ka group event arrange ho sakta hai?", a: "Hum 20 logon ke intimate team outing se lekar 500+ employees ke corporate sports days successfully host karte hain." },
    ],
  },
  {
    slug: "conference-events",
    category: "corporate",
    menuTitle: "Conference Events",
    badge: "National & Regional Summits",
    title: "High-Level Conference & Business Summit Management",
    subtitle: "Multi-delegate conferences, breakout sessions, live webcasting, VIP speaker hospitality aur flawless tech coordination.",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "120+", label: "Conferences Handled" },
      { number: "Multi-Day", label: "Execution Capability" },
      { number: "Live", label: "Hybrid Zoom & Webcast" },
      { number: "500+", label: "Delegate Management" },
    ],
    overview: "Medical conferences, Government summits aur Banking conclaves ke liye hum exact protocol aur standard follow karte hain. RIWAJ team audio-visual, stage, lighting aur hospitality ko seamlessly handle karti hai.",
    features: [
      { title: "Multi-Screen Presentation Setup", desc: "Dual projection ya center LED wall with comfort monitors for stage speakers." },
      { title: "Simultaneous Live Streaming", desc: "Remote attendees ke liye YouTube / Zoom multi-camera broadcast." },
      { title: "Speaker Green Room & Lounge", desc: "VIP guests aur keynote speakers ke liye dedicated hospitality lounge." },
      { title: "Conference Souvenirs & Folders", desc: "Printed agendas, ID cards, custom lanyards and conference kits." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Conference Complete",
        price: "₹85,000",
        popular: true,
        tagline: "Full Day Business Conclave",
        features: ["Stage backdrop with LED display", "Dual comfort monitors for speakers", "Digital audio console with 6 mics", "On-site tech engineers and hostesses"],
      },
    ],
    faqs: [
      { q: "Kya live recording aur edited videos milenge?", a: "Ji haan, session-wise full HD recording aur 3-minute highlight video provide kiya jata hai." },
    ],
  },
  {
    slug: "annual-meet",
    category: "corporate",
    menuTitle: "Annual Meet",
    badge: "Yearly Milestones Celebration",
    title: "Grand Annual General Meeting (AGM) & Celebrations",
    subtitle: "Pichle saal ki uplabdhiyon ka jashn aur aane wale saal ka vision — Royal stage, corporate video showcase aur gala dinner.",
    heroImage: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "180+", label: "Annual Meets Managed" },
      { number: "Grand", label: "LED Stage Presentations" },
      { number: "Awards", label: "Trophy & Recognition Setup" },
      { number: "Celebration", label: "Dinner & Entertainment" },
    ],
    overview: "Annual Meet har company ka sabse prestigious event hota hai. RIWAJ team formal presentations, employee awards aur celebratory gala dinner ko seamlessly execute karti hai.",
    features: [
      {
        title: "Conference & Presentation Setup",
        desc: "Professional conference arrangements with LED screens, podium setup, wireless microphones, presentation support, branded backdrops and seamless event coordination for impactful annual meetings.",
      },
      {
        title: "Employee Recognition Programs",
        desc: "Celebrate achievements with premium award ceremonies, appreciation moments, customised trophies, certificates and engaging recognition experiences for employees and leadership teams.",
      },
      {
        title: "Entertainment & Gala Evening",
        desc: "Live music, DJ nights, cultural performances, celebrity anchors, motivational speakers and interactive entertainment sessions to make your annual meet exciting and memorable.",
      },
      {
        title: "Professional Event Coverage",
        desc: "High-quality photography, cinematic videography, drone coverage, live streaming and highlight videos that capture every important moment of your corporate annual gathering.",
      },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Grand AGM Package",
        price: "₹65,000",
        popular: true,
        tagline: "Annual Meet & Dinner Celebration",
        features: ["Stage backdrop with LED screen", "Complete audio setup with podium", "Trophy presentation table", "Background gala dinner lighting", "Dedicated technical support crew"],
      },
    ],
    faqs: [
      {
        q: "How much does corporate annual meet event management cost?",
        a: "The cost of a corporate annual meet depends on factors such as the number of attendees, venue, event duration, stage setup, decor, audiovisual requirements, entertainment, and catering. At RIWAJ Events, we offer customized event packages to suit different corporate budgets ensuring maximum value without compromising quality.",
      },
      {
        q: "Can you manage both a corporate conference and annual meet celebration on the same day?",
        a: "Yes! Hum morning me formal conference & presentations aur evening me celebration gala dinner, award ceremony & live DJ setup effortlessly manage karte hain.",
      },
      {
        q: "Do you handle employee annual celebration events at outstation and offsite locations?",
        a: "Ji haan! Local city venues ke alawa hum heritage resorts, wildlife properties aur outstation destination locations par bhi complete event management provide karte hain.",
      },
      {
        q: "How early should I book RIWAJ Events for a corporate annual day event?",
        a: "Ideally 3 to 5 weeks pehle book karne se venue, customized branding fabrication aur artist schedules perfectly align ho jaate hain.",
      },
      {
        q: "Can you manage a corporate gala dinner with awards ceremony and live entertainment?",
        a: "Bilkul! Hum red carpet entrance, customized engraved trophies, emcee anchoring, sound & lights, aur executive buffet catering coordination end-to-end provide karte hain.",
      },
    ],
  },
  {
    slug: "award-ceremony",
    category: "corporate",
    menuTitle: "Award Ceremony",
    badge: "Red Carpet & Prestigious Stage",
    title: "Star-Studded Corporate Award Nights & R&R Events",
    subtitle: "Red carpet entrance with media wall, trophy reveal podium, cold pyro stage fountain blasts aur energetic anchoring.",
    heroImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "220+", label: "Award Nights Produced" },
      { number: "Red Carpet", label: "Media Wall Entrance" },
      { number: "Cold Pyros", label: "Winner Moments" },
      { number: "Top", label: "Corporate Anchors" },
    ],
    overview: "Top performers ka samman aisa hona chahiye jo sabhi me nayi energy bhar de. Bollywood style winner announcements aur dramatic music beats ke sath RIWAJ banata hai true celebration.",
    features: [
      { title: "Red Carpet & Media Photo Wall", desc: "Customized step-and-repeat logo photo wall entrance for all attendees." },
      { title: "Winner Celebration Pyros", desc: "Trophy dete waqt safe stage cold pyro sparklers aur celebratory music stingers." },
      { title: "Professional Award Emcees", desc: "Audience ko baandhkar rakhne wale charismatic anchors and stage coordinators." },
      { title: "Customized Trophies & Mementos", desc: "Crystal, wooden and metallic engraved awards and certificates." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Star Award Night",
        price: "₹60,000",
        popular: true,
        tagline: "Awards & Recognition Night",
        features: ["Red carpet & branded media wall", "Stage backdrop with intelligent spotlights", "Cold pyro fountain (4 pcs)", "DJ with victory stingers & background tracks"],
      },
    ],
    faqs: [
      { q: "Kya aap trophies aur certificates bhi print/engrave kar sakte hain?", a: "Ji haan, company logo aur winner ke name ke sath customized trophies provide ki jaati hain." },
    ],
  },
  {
    slug: "target-achievement-events",
    category: "corporate",
    menuTitle: "Target Achievement Events",
    badge: "Sales Milestone Celebration",
    title: "Sales Milestone & Target Achievement Victory Bash",
    subtitle: "Team ke target achieve hone par special celebratory event — Champagne pop, celebratory cake, trophy felicitation aur high-energy party.",
    heroImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "160+", label: "Victory Bashes Managed" },
      { number: "100%", label: "High Morale & Celebration" },
      { number: "Custom", label: "Milestone Branding" },
      { number: "VIP", label: "Corporate Choice" },
    ],
    overview: "Mahino ki kadi mehnat ke baad jab sales targets cross hote hain, toh celebration banta hai! RIWAJ team pure event ko victory aur excitement se bhar deti hai.",
    features: [
      { title: "Milestone Celebration Stage", desc: "Numbers display (e.g. 100 Crore Club, Target Smashed) with neon highlights." },
      { title: "Victory Toast & Cake Setup", desc: "Celebratory cake cutting ceremony with stage fog and sparklers." },
      { title: "DJ & Dance Celebration", desc: "High tempo celebratory music tracks for team enjoyment and celebrations." },
      { title: "Employee Souvenirs & Recognition Hamper", desc: "Customized gift hampers, premium certificates and team photo frames." },
    ],
    "galleryImages": [
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75"
    ],
    packages: [
      {
        name: "Victory Bash",
        price: "₹35,000",
        popular: true,
        tagline: "Sales Celebration Event",
        features: ["Milestone backdrop stage", "Celebratory cold pyros", "Sound system & DJ", "Custom cake table & welcome photo board"],
      },
    ],
    faqs: [
      { q: "Kitne short notice par setup ho sakta hai?", a: "Hum 24 se 48 ghante ke short notice par bhi target achievement party execute kar sakte hain." },
    ],
  },
];

export const ALL_EVENTS: EventDetail[] = [...CATERING_EVENTS, ...DECORATION_EVENTS, ...WEDDING_EVENTS, ...CORPORATE_EVENTS];

const LEGACY_SLUG_MAP: Record<string, string> = {
  "non-veg-catering": "veg-catering",
  "wedding-decoration": "stage-decoration",
  "destination-wedding-decor": "destination-wedding",
  "corporate-stage-backdrop": "stage-decoration",
  "baby-shower-decor": "baby-shower",
};

export const getEventBySlug = (slug: string): EventDetail | undefined => {
  let cleanSlug = slug.toLowerCase().trim();
  if (LEGACY_SLUG_MAP[cleanSlug]) {
    cleanSlug = LEGACY_SLUG_MAP[cleanSlug];
  }
  return ALL_EVENTS.find((e) => e.slug === cleanSlug);
};
