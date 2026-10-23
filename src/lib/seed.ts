import bcrypt from "bcryptjs";
import connectToDatabase from "./db";
import { AdminUser, Blog, GalleryItem, Service, SiteSetting, Testimonial, TeamMember, Vendor, SubCategory } from "./models";
import { stats } from "@/data/staticData";
import { ALL_EVENTS } from "@/data/eventRoutes";

/**
 * Purges all predefined hardcoded / demo seed records from the database
 * so the admin starts with a completely clean database.
 */
export async function purgePredefinedDemoData() {
  try {
    await connectToDatabase();

    // 1. Delete Demo Team Members
    const demoTeamNames = [
      "Shivam Patel",
      "Pooja Singh",
      "Aman Tiwari",
      "Ritika Mishra",
      "Priya Sharma",
      "Rahul Verma",
      "Ananya Desai",
      "Karan Mehta",
    ];
    await TeamMember.deleteMany({
      $or: [
        { name: { $in: demoTeamNames } },
        { "image.url": { $regex: "unsplash.com", $options: "i" } },
      ],
    });

    // 2. Delete Demo Testimonials
    const demoCouples = [
      "Aditya & Priya",
      "Rohan & Sneha",
      "Vikas & Ananya",
      "Abhishek & Pooja",
    ];
    await Testimonial.deleteMany({
      $or: [
        { coupleName: { $in: demoCouples } },
        { "image.url": { $regex: "unsplash.com", $options: "i" } },
      ],
    });

    // 3. Delete Demo Blogs
    const demoBlogSlugs = [
      "10-essential-tips-for-planning-your-dream-indian-wedding",
      "wedding-planning-timeline-your-12-month-checklist",
      "2025-wedding-decoration-trends-you-ll-love",
    ];
    await Blog.deleteMany({
      $or: [
        { slug: { $in: demoBlogSlugs } },
        { "coverImage.url": { $regex: "unsplash.com", $options: "i" } },
      ],
    });

    // 4. Delete Demo Gallery Items (un-uploaded unsplash stock items)
    const demoGalleryTitles = [
      "Romantic Ceremony",
      "Garden Wedding",
      "Elegant Reception",
      "Floral Arrangements",
      "Wedding Details",
      "Bridal Moments",
      "Golden Hour",
      "Sangeet Night",
      "Mehndi Ceremony",
      "Wedding Decor",
      "Couple Portrait",
      "Venue Setup",
    ];
    await GalleryItem.deleteMany({
      $or: [
        { title: { $in: demoGalleryTitles } },
        { "image.url": { $regex: "unsplash.com", $options: "i" } },
      ],
    });

    // 5. Delete Demo Vendors
    const demoVendorNames = [
      "Ramesh Sound & DJ System",
      "Shree Krishna Royal Caterers",
      "Vindhya Royal Safa & Turban House",
      "Cinematic Lens Wedding Studio",
    ];
    await Vendor.deleteMany({
      name: { $in: demoVendorNames },
    });

    // 6. Clean SiteSetting heroSlides and demo testimonials
    const settings = await SiteSetting.findOne();
    if (settings) {
      let modified = false;
      if (Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0) {
        settings.heroSlides = settings.heroSlides.filter(
          (s: any) =>
            s.image?.url &&
            !s.image.url.includes("unsplash.com") &&
            !s.image.url.includes("girlsimg") &&
            !s.image.url.includes("dercoration1")
        );
        modified = true;
      }
      if (Array.isArray(settings.testimonials) && settings.testimonials.length > 0) {
        settings.testimonials = settings.testimonials.filter(
          (t: any) => !demoCouples.includes(t.coupleName)
        );
        modified = true;
      }
      if (modified) {
        await settings.save();
      }
    }

    console.log("Predefined demo data successfully purged from database");
  } catch (err) {
    console.error("Error purging predefined demo data:", err);
  }
}

export async function seedDatabaseIfEmpty() {
  await connectToDatabase();

  // Purge any lingering demo data
  await purgePredefinedDemoData();

  const existingSetting = await SiteSetting.findOne();
  const adminCount = await AdminUser.countDocuments();

  // 1. Seed Superadmin User if none exists (required for admin login)
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
    console.log(`Default admin created: ${defaultEmail}`);
  }

  // 2. Seed basic SiteSettings if empty
  if (!existingSetting) {
    await SiteSetting.create({
      siteName: "RIWAJ Events",
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
      heroSlides: [],
      testimonials: [],
      defaultTheme: "rose",
    });
    console.log("SiteSetting initialized cleanly");
  }

  // 3. Seed Navbar SubCategories if empty (for wedding, catering, decoration, corporate event routes)
  await seedSubCategoriesIfEmpty();
}

// Deprecated empty stub to avoid breaking imports
export async function seedDefaultTeamIfEmpty() {
  // Intentionally does NOT seed fake team members
  return;
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
  }
}
