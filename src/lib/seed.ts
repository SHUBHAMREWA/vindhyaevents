import bcrypt from "bcryptjs";
import connectToDatabase from "./db";
import { AdminUser, Blog, GalleryItem, Service, SiteSetting, Testimonial, TeamMember, Vendor, SubCategory } from "./models";
import { galleryImages, stats } from "@/data/staticData";
import { ALL_EVENTS } from "@/data/eventRoutes";

export async function seedDatabaseIfEmpty() {
  await connectToDatabase();

  const existingSetting = await SiteSetting.findOne();
  const adminCount = await AdminUser.countDocuments();

  // If already initialized once, do not re-seed or override admin-managed data
  if (existingSetting && adminCount > 0) {
    return;
  }

  // 1. Seed Admin User
  if (adminCount === 0) {
    const defaultEmail = process.env.ADMIN_EMAIL || "admin@riwaj.in";
    const defaultPassword = process.env.ADMIN_PASSWORD || "Riwaj@Admin2026";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    await AdminUser.create({
      email: defaultEmail,
      passwordHash,
      name: "RIWAJ Admin",
      role: "superadmin",
    });
    console.log(`Default admin seeded: ${defaultEmail}`);
  }

  // 2. Seed Services if empty
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const defaultServices = [
      {
        title: "Full Wedding Planning & Coordination",
        slug: "full-wedding-planning",
        shortDescription: "Comprehensive planning from Roka to Vidai. Complete budget management, royal venue styling, vendor negotiation, and flawless day-of coordination.",
        iconName: "Calendar",
        category: "Planning",
        features: ["Custom 12-month wedding timeline & rasam checklist", "Venue selection & contract negotiations across Rewa & MP", "Dedicated lead wedding coordinator on event day", "Guest RSVP, hotel room allocations & welcome hampers"],
        order: 1,
        isActive: true,
        coverImage: {
          url: "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?auto=format&fit=crop&w=1200&q=80",
          alt: "Royal Indian Wedding Planning & Coordination",
        },
      },
      {
        title: "Floral & Mandap Stage Décor",
        slug: "mandap-floral-decor",
        shortDescription: "Mesmerizing royal mandap setups, marigold and red rose cascades, illuminated entrance walkways, and majestic VIP stage seating.",
        iconName: "Flower2",
        category: "Decor",
        features: ["Traditional Shahi & modern pastel theme mandap setups", "Fresh exotic orchids, desi genda & red rose arrangements", "Intelligent warm LED chandeliers & fairy light ambience", "Thematic photobooths, selfie zones & floral arches"],
        order: 2,
        isActive: true,
        coverImage: {
          url: "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=1200&q=80",
          alt: "Royal Indian Wedding Mandap & Stage Decor",
        },
      },
      {
        title: "Photography & Cinematic Videography",
        slug: "photography-cinematography",
        shortDescription: "Top-tier Indian wedding photography capturing raw candid emotions, bridal portraits, drone aerial coverage, and Bollywood-style cinematic trailers.",
        iconName: "Camera",
        category: "Media",
        features: ["Royal bridal portraits & candid emotional ceremony moments", "4K cinematic wedding trailer & full documentary films", "Pre-wedding shoot at scenic heritage spots in Rewa & MP", "Luxury velvet & leather-bound customized photo albums"],
        order: 3,
        isActive: true,
        coverImage: {
          url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
          alt: "Indian Bride and Wedding Photography",
        },
      },
      {
        title: "Sangeet, DJ & Live Entertainment",
        slug: "entertainment-sangeet",
        shortDescription: "Concert-grade line array sound systems, dynamic truss lighting, celebrity DJs, family dance choreographers, and traditional energetic Punjabi Dhol troupes.",
        iconName: "Music",
        category: "Entertainment",
        features: ["Bollywood choreographers for family sangeet performances", "Concert-style LED stage walls & intelligent beam lighting", "Cold pyros, dry ice low fog & celebratory paper blast effects", "Traditional energetic Shehnai & Dhol Tasha teams"],
        order: 4,
        isActive: true,
        coverImage: {
          url: "https://images.unsplash.com/photo-1766113483422-7c871de23591?auto=format&fit=crop&w=1200&q=80",
          alt: "Indian Sangeet Night and Dance Celebration",
        },
      },
      {
        title: "Royal Catering & Gourmet Banquets",
        slug: "royal-catering-hospitality",
        shortDescription: "Authentic Indian wedding feasts crafted by master chefs — Bundelkhandi royal delicacies, live chaat stalls, North Indian curries, and gourmet dessert counters.",
        iconName: "Utensils",
        category: "Catering",
        features: ["100% pure vegetarian & customized royal gourmet menus", "Authentic Bundelkhandi, Awadhi & Mughlai royal delicacies", "Live chaat counters, tandoori breads, mocktail bars & mithai", "Gleaming copper chafing dishes & trained white-glove staff"],
        order: 5,
        isActive: true,
        coverImage: {
          url: "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=1200&q=80",
          alt: "Royal Indian Wedding Catering and Feast",
        },
      },
      {
        title: "Royal Baraat & Vintage Hospitality",
        slug: "venue-guest-logistics",
        shortDescription: "Make the groom's entry legendary with vintage convertibles, royal decorated chariots, synchronized brass bands, and royal aarti guest reception.",
        iconName: "Sparkles",
        category: "Logistics",
        features: ["Vintage open cars & decorated royal chariot / horse setups", "Synchronized royal brass band & percussion musicians", "Traditional aarti, ittar spray & flower shower swagat team", "Custom royal safa & pagdi tying masters for all baratis"],
        order: 6,
        isActive: true,
        coverImage: {
          url: "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=1200&q=80",
          alt: "Royal Indian Baraat Procession and Hospitality",
        },
      },
    ];
    await Service.insertMany(defaultServices);
    console.log("Services seeded");
  }

  // 3. Seed Blogs if empty
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    const initialSeedBlogs = [
      {
        title: "10 Essential Tips for Planning Your Dream Indian Wedding",
        slug: "10-essential-tips-for-planning-your-dream-indian-wedding",
        excerpt: "From choosing the perfect venue to coordinating multiple ceremonies, discover the secrets to planning a flawless Indian wedding celebration that honors tradition while embracing modern elegance.",
        content: "From choosing the perfect venue to coordinating multiple ceremonies, discover the secrets to planning a flawless Indian wedding celebration that honors tradition while embracing modern elegance.\n\nPlanning a wedding is one of the most exciting journeys in life. At RIWAJ, our specialized team in Rewa, Madhya Pradesh brings decades of expertise to craft unforgettable memories.\n\n### Key Takeaways\n- Plan well in advance\n- Coordinate your themes with traditional roots\n- Trust experienced professionals on the ground",
        coverImage: { url: "https://images.unsplash.com/photo-1680490961937-e933bf1ef920?w=800&q=75" },
        category: "Planning",
        author: { name: "Priya Sharma", role: "Wedding Specialist" },
        readTime: "8 min read",
        featured: true,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "Wedding Planning Timeline: Your 12-Month Checklist",
        slug: "wedding-planning-timeline-your-12-month-checklist",
        excerpt: "Stay organized and stress-free with our comprehensive month-by-month wedding planning guide. Learn what to prioritize at each stage of your journey.",
        content: "Stay organized and stress-free with our comprehensive month-by-month wedding planning guide. Learn what to prioritize at each stage of your journey.\n\nPlanning a wedding is one of the most exciting journeys in life. At RIWAJ, our specialized team in Rewa, Madhya Pradesh brings decades of expertise to craft unforgettable memories.\n\n### Key Takeaways\n- Plan well in advance\n- Coordinate your themes with traditional roots\n- Trust experienced professionals on the ground",
        coverImage: { url: "https://images.unsplash.com/photo-1760669343328-d84fbde15b65?w=800&q=75" },
        category: "Planning",
        author: { name: "Rahul Verma", role: "Wedding Specialist" },
        readTime: "10 min read",
        featured: false,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "2025 Wedding Decoration Trends You'll Love",
        slug: "2025-wedding-decoration-trends-you-ll-love",
        excerpt: "Discover the hottest decoration trends for 2025, from sustainable florals to innovative lighting designs that create magical atmospheres.",
        content: "Discover the hottest decoration trends for 2025, from sustainable florals to innovative lighting designs that create magical atmospheres.\n\nPlanning a wedding is one of the most exciting journeys in life. At RIWAJ, our specialized team in Rewa, Madhya Pradesh brings decades of expertise to craft unforgettable memories.\n\n### Key Takeaways\n- Plan well in advance\n- Coordinate your themes with traditional roots\n- Trust experienced professionals on the ground",
        coverImage: { url: "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?w=800&q=75" },
        category: "Decor",
        author: { name: "Ananya Desai", role: "Wedding Specialist" },
        readTime: "6 min read",
        featured: false,
        isPublished: true,
        publishedAt: new Date(),
      },
    ];
    await Blog.insertMany(initialSeedBlogs);
    console.log("Blogs seeded");
  }

  // 4. Seed Gallery if empty
  const galleryCount = await GalleryItem.countDocuments();
  if (galleryCount === 0) {
    const formattedGallery = galleryImages.map((g, idx) => ({
      title: g.title,
      image: { url: g.url },
      category: g.category,
      order: idx + 1,
      isActive: true,
    }));
    await GalleryItem.insertMany(formattedGallery);
    console.log("Gallery seeded");
  }

  // 5. Seed SiteSettings if empty
  if (!existingSetting) {
    await SiteSetting.create({
      siteName: "Vindhya Events",
      tagline: "Wedding & Luxury Event Specialists",
      taglineHindi: "✨ आपके रीति रिवाज सजावट के साथ ✨",
      primaryPhone: "7898522932",
      secondaryPhone: "",
      whatsAppNumber: "7898522932",
      primaryEmail: "vindhyaevent@gmail.com",
      address: "Rewa, Madhya Pradesh — 486001, India",
      socialLinks: {
        instagram: "https://instagram.com/vindhyaevents",
        facebook: "https://facebook.com/vindhyaevents",
      },
      stats: stats.map((s, idx) => ({ label: s.label, value: s.value, order: idx + 1 })),
      heroSlides: [
        {
          title: "Wedding Planner in Rewa, Madhya Pradesh",
          subtitle: "500+ Love Stories Crafted Since 2013 — Your Dream Wedding Awaits",
          image: { url: "/girlsimg.webp" },
          order: 1,
        },
        {
          title: "Celebrating Every Tradition",
          subtitle: "आपके रीति-रिवाज़ को खूबसूरत सजावट के साथ मनाएं",
          image: { url: "/dercoration1.webp" },
          order: 2,
        },
      ],
      testimonials: [
        {
          coupleName: "Aditya & Priya",
          weddingType: "Royal Rewa Palace Wedding",
          reviewText: "RIWAJ made our wedding day absolutely magical! From the mesmerizing mandap floral décor to seamless baraat management, every moment was perfection.",
          rating: 5,
        },
        {
          coupleName: "Rohan & Sneha",
          weddingType: "Grand Sangeet & Reception",
          reviewText: "The team understood our exact vision. Our guests are still talking about how beautiful the entrance and stage lighting looked. Best wedding planners in MP!",
          rating: 5,
        },
      ],
      defaultTheme: "rose",
    });
    console.log("SiteSetting seeded");
  }

  // 6. Seed Testimonials if collection is empty
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    const defaultTestimonials = [
      {
        coupleName: "Aditya & Priya",
        weddingType: "Royal Rewa Palace Wedding",
        reviewText: "RIWAJ made our wedding day in Rewa absolutely perfect! From the royal mandap floral arrangements to seamless stage coordination, every detail exceeded our expectations.",
        rating: 5,
        image: {
          url: "https://images.unsplash.com/photo-1707191585137-4553ae4b762d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
          public_id: "",
        },
        location: "Rewa, MP",
        order: 1,
        isActive: true,
      },
      {
        coupleName: "Rohan & Sneha",
        weddingType: "Grand Sangeet & Reception",
        reviewText: "Working with the RIWAJ team was a dream come true. They understood our rituals and brought them to life with breathtaking elegance.",
        rating: 5,
        image: {
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
          public_id: "",
        },
        location: "Rewa, MP",
        order: 2,
        isActive: true,
      },
      {
        coupleName: "Vikas & Ananya",
        weddingType: "Royal Destination Celebration",
        reviewText: "Professional, creative, and on-ground in Rewa. They handled every aspect with grace and made sure our sangeet and reception were stress-free and magical.",
        rating: 5,
        image: {
          url: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
          public_id: "",
        },
        location: "Rewa, MP",
        order: 3,
        isActive: true,
      },
      {
        coupleName: "Abhishek & Pooja",
        weddingType: "Traditional Mandap & Baraat",
        reviewText: "The attention to detail was phenomenal. Every ceremony was managed with care, and the venue decor looked like a royal fairy tale. Highly recommended in MP!",
        rating: 5,
        image: {
          url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
          public_id: "",
        },
        location: "Rewa, MP",
        order: 4,
        isActive: true,
      },
    ];
    await Testimonial.insertMany(defaultTestimonials);
    console.log("Testimonials seeded");
  }

  // Also seed team members if empty
  await seedDefaultTeamIfEmpty();
}

export async function seedDefaultTeamIfEmpty() {
  await connectToDatabase();
  const teamCount = await TeamMember.countDocuments();
  if (teamCount === 0) {
    const defaultTeam = [
      {
        name: "Shivam Patel",
        role: "Founder & Event Director",
        experience: "Started from Sound & DJ (2021)",
        bio: "Started in 2021 with DJ sounds & technical production. Expanded into full-scale wedding planning, royal decor, and seamless event management across Vindhya.",
        image: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75",
          public_id: "",
        },
        order: 1,
        isActive: true,
      },
      {
        name: "Pooja Singh",
        role: "Lead Wedding & Theme Designer",
        experience: "4+ Years Experience",
        bio: "Brings royal cultural aesthetics, flower mandap setups, and modern themes to life with meticulous attention to detail.",
        image: {
          url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=75",
          public_id: "",
        },
        order: 2,
        isActive: true,
      },
      {
        name: "Aman Tiwari",
        role: "Technical, Audio & Lighting Head",
        experience: "Since 2021 (Sound & FX)",
        bio: "Manages concert-level DJ setups, ambient truss lighting, entry cold pyros, and dynamic audio-visuals for sangeet and baraat.",
        image: {
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=75",
          public_id: "",
        },
        order: 3,
        isActive: true,
      },
      {
        name: "Ritika Mishra",
        role: "Client Coordination & Logistics",
        experience: "3+ Years Experience",
        bio: "Ensures smooth coordination between families, vendors, and on-ground management across Rewa, Satna, and nearby cities.",
        image: {
          url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=75",
          public_id: "",
        },
        order: 4,
        isActive: true,
      },
    ];
    await TeamMember.insertMany(defaultTeam);
    console.log("Team members seeded");
  }

  // 8. Seed Vendors if empty
  const vendorCount = await Vendor.countDocuments();
  if (vendorCount === 0) {
    const defaultVendors = [
      {
        name: "Ramesh Sound & DJ System",
        phone: "9826123456",
        whatsappNumber: "9826123456",
        state: "Madhya Pradesh",
        city: "Rewa",
        address: "Sirmour Chowk, Rewa",
        services: ["DJ & Sounds", "Stage Lighting", "Generator Setup"],
        rateEstimate: "₹12,000 / event",
        rating: 5,
        experienceYears: 6,
        upiId: "rameshsound@upi",
        notes: "Owns JBL line-array speakers, sharpy lights, and heavy generator. Very punctual for Baraat & Sangeet.",
        isActive: true,
        totalEventsDone: 34,
      },
      {
        name: "Shree Krishna Royal Caterers",
        phone: "9425198765",
        whatsappNumber: "9425198765",
        state: "Madhya Pradesh",
        city: "Rewa",
        address: "Kothi Road, Rewa",
        services: ["Catering & Food", "Live Food Counters", "Uniformed Staff"],
        rateEstimate: "₹380 - ₹550 / plate",
        rating: 5,
        experienceYears: 10,
        upiId: "krishnacaterers@upi",
        notes: "Best for MP royal thali, multi-cuisine counters, chaat stalls. High hygiene standards.",
        isActive: true,
        totalEventsDone: 52,
      },
      {
        name: "Vindhya Royal Safa & Turban House",
        phone: "7000123987",
        whatsappNumber: "7000123987",
        state: "Madhya Pradesh",
        city: "Rewa",
        address: "Venkat Road, Rewa",
        services: ["Safa Tying", "Baggi & Horse Entry", "Atishbaji & Cold Pyro"],
        rateEstimate: "₹70 / safa, ₹15,000 / Baggi",
        rating: 4.9,
        experienceYears: 8,
        upiId: "royalsafa@upi",
        notes: "Expert Jodhpuri & Banarasi safa tying for 200+ guests. Provides decorated vintage baggi & cold pyros.",
        isActive: true,
        totalEventsDone: 45,
      },
      {
        name: "Cinematic Lens Wedding Studio",
        phone: "9111456789",
        whatsappNumber: "9111456789",
        state: "Madhya Pradesh",
        city: "Satna",
        address: "Circuit House Road, Satna",
        services: ["Photography & Video", "Drone 4K Shoots"],
        rateEstimate: "₹35,000 / 2-day wedding",
        rating: 4.8,
        experienceYears: 5,
        upiId: "cinematiclens@upi",
        notes: "Sony FX3 cameras, 4K DJI drone, candid specialists with fast 7-day teaser delivery.",
        isActive: true,
        totalEventsDone: 28,
      },
    ];
    await Vendor.insertMany(defaultVendors);
    console.log("Default vendors seeded");
  }

  // 9. Seed Navbar SubCategories if empty
  await seedSubCategoriesIfEmpty();
}

export async function seedSubCategoriesIfEmpty() {
  await connectToDatabase();
  const count = await SubCategory.countDocuments();
  if (count === 0) {
    const docs = ALL_EVENTS.map((event, index) => ({
      slug: event.slug,
      category: event.category,
      menuTitle: event.menuTitle,
      title: event.title,
      badge: event.badge || "",
      mainImage: {
        url: event.heroImage,
        public_id: "",
        alt: `${event.title} - RIWAJ Events`,
      },
      relevantImages: (event.galleryImages || []).map((url, i) => ({
        url,
        public_id: "",
        alt: `${event.menuTitle} Real Event Setup ${i + 1} - RIWAJ Events`,
      })),
      isActive: true,
      order: index + 1,
    }));

    await SubCategory.insertMany(docs);
    console.log(`Seeded ${docs.length} navbar subcategories into MongoDB.`);
  } else {
    // If any event from ALL_EVENTS is not in DB, add it
    for (const [index, event] of ALL_EVENTS.entries()) {
      const exists = await SubCategory.exists({ slug: event.slug });
      if (!exists) {
        await SubCategory.create({
          slug: event.slug,
          category: event.category,
          menuTitle: event.menuTitle,
          title: event.title,
          badge: event.badge || "",
          mainImage: {
            url: event.heroImage,
            public_id: "",
            alt: `${event.title} - RIWAJ Events`,
          },
          relevantImages: (event.galleryImages || []).map((url, i) => ({
            url,
            public_id: "",
            alt: `${event.menuTitle} Real Event Setup ${i + 1} - RIWAJ Events`,
          })),
          isActive: true,
          order: index + 1,
        });
      }
    }
  }
}


