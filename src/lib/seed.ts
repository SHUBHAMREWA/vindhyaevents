import bcrypt from "bcryptjs";
import connectToDatabase from "./db";
import { AdminUser, Blog, GalleryItem, Service, SiteSetting, Testimonial, TeamMember } from "./models";
import { galleryImages, stats } from "@/data/staticData";

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
        title: "Full Wedding Planning",
        slug: "full-wedding-planning",
        shortDescription: "Comprehensive planning from start to finish. We handle every detail so you can enjoy your engagement stress-free.",
        iconName: "Calendar",
        category: "Planning",
        features: ["Budget management", "Vendor negotiation", "Day-of coordination", "Timeline management"],
        order: 1,
        coverImage: {
          url: "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?w=800&q=75",
        },
      },
      {
        title: "Mandap & Floral Décor",
        slug: "mandap-floral-decor",
        shortDescription: "Custom floral arrangements, grand stage designs, and mesmerizing mandaps that bring your dream aesthetic to life.",
        iconName: "Flower2",
        category: "Decor",
        features: ["Theme conceptualization", "Exotic floral arrangements", "Custom stage lighting", "Entrance gate styling"],
        order: 2,
        coverImage: {
          url: "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?w=800&q=75",
        },
      },
      {
        title: "Photography & Cinematography",
        slug: "photography-cinematography",
        shortDescription: "Top wedding cinematographers to capture candid emotions, royal portraits, and cinematic teaser films.",
        iconName: "Camera",
        category: "Media",
        features: ["Drone 4K aerial shots", "Traditional & candid", "Pre-wedding shoot", "Same-day edit trailers"],
        order: 3,
        coverImage: {
          url: "https://images.unsplash.com/photo-1628221482312-439eb2f3367d?w=800&q=75",
        },
      },
      {
        title: "Entertainment & Sangeet",
        slug: "entertainment-sangeet",
        shortDescription: "Curated live artists, celebrity DJs, sound engineering, choreographers, and theme lighting.",
        iconName: "Music",
        category: "Entertainment",
        features: ["Live band & Sufi singers", "Celebrity DJ setups", "Dance choreography", "Cold pyro & special effects"],
        order: 4,
        coverImage: {
          url: "https://images.unsplash.com/photo-1766113483422-7c871de23591?w=800&q=75",
        },
      },
      {
        title: "Royal Catering & Hospitality",
        slug: "royal-catering-hospitality",
        shortDescription: "Multi-cuisine gourmet experiences, traditional royal thalis, live counters, and high-standard hygiene.",
        iconName: "Utensils",
        category: "Catering",
        features: ["Traditional MP royal cuisine", "Global live food stations", "Custom mocktail bars", "Uniformed service staff"],
        order: 5,
        coverImage: {
          url: "https://images.unsplash.com/photo-1732259495388-af40b972c311?w=800&q=75",
        },
      },
      {
        title: "Venue & Guest Logistics",
        slug: "venue-guest-logistics",
        shortDescription: "Seamless guest pickup, hospitality desks at hotels, RSVP management, and luxury vintage car baraats.",
        iconName: "Sparkles",
        category: "Logistics",
        features: ["Baraat management", "Airport & station shuttles", "Hotel check-in desks", "Gift hamper distributions"],
        order: 6,
        coverImage: {
          url: "https://images.unsplash.com/photo-1763553113332-800519753e40?w=800&q=75",
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
}
