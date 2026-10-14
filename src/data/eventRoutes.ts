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
  category: "wedding" | "corporate";
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
    galleryImages: [
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
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
    slug: "get-together",
    category: "wedding",
    menuTitle: "Get Together",
    badge: "Family Bonding & Milni Functions",
    title: "Warm Family Get-Together & Milni Celebrations",
    subtitle: "Parivar ke sath hansi-khushi, khoobsurat sham, light music aur lajawab swadisht catering ka perfect intazaam.",
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { number: "250+", label: "Get Togethers Hosted" },
      { number: "100%", label: "Cozy & Welcoming Vibe" },
      { number: "Pure", label: "Traditional Hospitality" },
      { number: "Rewa", label: "Indoor & Lawn Options" },
    ],
    overview: "Shaadi ke dauran jab do parivaron ke rishtedaar aate hain, toh ek casual aur comfortable milni zaroori hoti hai. RIWAJ team cozy seating aur family games ke sath isse yaadgar banati hai.",
    features: [
      { title: "Cozy Baithak & Shamiana", desc: "Comfortable low seating, bolsters, carpets aur warm lighting." },
      { title: "Live Chaat & Snacks Counters", desc: "Rewa ke famous chaat, hot chai, coffee aur tandoor snacks." },
      { title: "Acoustic Karaoke & Music", desc: "Old classical hits aur antakshari ke liye sound setup." },
      { title: "Family Photo Souvenir Booth", desc: "Instant photo prints sabhi rishtedaaro ko gift karne ke liye." },
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=75",
    ],
    packages: [
      {
        name: "Cozy Milni",
        price: "₹25,000",
        tagline: "Upto 50 Guests Family Reunion",
        features: ["Warm garden/terrace decor", "Acoustic music setup", "Chaat counter styling", "Family photo corner"],
      },
    ],
    faqs: [
      { q: "Kya hum ghar ke lawn ya terrace par kar sakte hain?", a: "Haan, hum residential spaces ko bhi bilkul luxury resort jaisa transform kar dete hain." },
    ],
  },
  {
    slug: "baby-shower",
    category: "wedding",
    menuTitle: "Baby Shower",
    badge: "Godh Bharai Ki Shubh Shuruaat",
    title: "Pyari Godh Bharai & Baby Shower Celebrations",
    subtitle: "Pastel balloon arches, traditional godh bharai seating, customized cakes aur aane wale nanhe mehmaan ke liye warm blessings.",
    heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=75",
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
    slug: "wedding-package",
    category: "wedding",
    menuTitle: "Wedding Package",
    badge: "All-in-One Wedding Solutions",
    title: "Complete All-in-One Shaadi Packages in Rewa & MP",
    subtitle: "Haldi se lekar Vidai tak — Mandap, Catering, Stage, DJ, Photography sab kuch ek hi transparent package me bina kisi jhanjhat ke.",
    heroImage: "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=75",
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
  {
    slug: "kitty-party",
    category: "wedding",
    menuTitle: "Kitty Party",
    badge: "Fun & Thematic Gatherings",
    title: "Exciting Theme Kitty Parties & Ladies Get-Together",
    subtitle: "Retro, Bollywood, Floral ya Hawaiian theme — Rewa ki ladies ke liye fun games, customized backdrops aur delicious snacks.",
    heroImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=75",
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
];

export const CORPORATE_EVENTS: EventDetail[] = [
  {
    slug: "banquet-hall",
    category: "corporate",
    menuTitle: "Banquet Hall",
    badge: "Premium Corporate Venues",
    title: "Banquet Hall Selection & Professional Corporate Setup",
    subtitle: "Rewa aur aas-paas ke top AC banquet halls ki booking, round-table seating, stage backdrop aur customized corporate dining.",
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=75",
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
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=75",
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
    galleryImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=75",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=75",
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

export const ALL_EVENTS: EventDetail[] = [...WEDDING_EVENTS, ...CORPORATE_EVENTS];

export const getEventBySlug = (slug: string): EventDetail | undefined => {
  const cleanSlug = slug.toLowerCase().trim();
  return ALL_EVENTS.find((e) => e.slug === cleanSlug);
};
