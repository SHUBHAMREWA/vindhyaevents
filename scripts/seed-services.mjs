import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local if present
const envPath = path.resolve(__dirname, "../.env.local");
let mongoUri = "mongodb://localhost:27017/vindhyaevents";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MONGODB_URI=")) {
      mongoUri = trimmed.replace("MONGODB_URI=", "").trim();
      break;
    }
  }
}

if (process.env.MONGODB_URI) {
  mongoUri = process.env.MONGODB_URI;
}

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, default: "" },
    iconName: { type: String, default: "Sparkles" },
    coverImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    features: { type: [String], default: [] },
    category: { type: String, default: "Planning" },
    startingPrice: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export const defaultIndianServices = [
  {
    title: "Full Wedding Planning & Coordination",
    slug: "full-wedding-planning",
    shortDescription: "Comprehensive planning from Roka to Vidai. Complete budget management, royal venue styling, vendor negotiation, and flawless day-of coordination.",
    detailedDescription: "Complete wedding management tailored for traditional Indian rituals and grand royal celebrations across Rewa and Madhya Pradesh.",
    iconName: "Calendar",
    category: "Planning",
    features: [
      "Custom 12-month wedding timeline & rasam checklist",
      "Venue selection & contract negotiations across Rewa & MP",
      "Dedicated lead wedding coordinator on event day",
      "Guest RSVP, hotel room allocations & welcome hampers",
    ],
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
    detailedDescription: "Grand palace mandaps, fresh floral arches, royal stage furniture and theme decoration designed for Indian weddings.",
    iconName: "Flower2",
    category: "Decor",
    features: [
      "Traditional Shahi & modern pastel theme mandap setups",
      "Fresh exotic orchids, desi genda & red rose arrangements",
      "Intelligent warm LED chandeliers & fairy light ambience",
      "Thematic photobooths, selfie zones & floral arches",
    ],
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
    detailedDescription: "4K cinematic wedding documentary, royal bridal portraits, and candid coverage by experienced Indian wedding photographers.",
    iconName: "Camera",
    category: "Media",
    features: [
      "Royal bridal portraits & candid emotional ceremony moments",
      "4K cinematic wedding trailer & full documentary films",
      "Pre-wedding shoot at scenic heritage spots in Rewa & MP",
      "Luxury velvet & leather-bound customized photo albums",
    ],
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
    detailedDescription: "Electrifying Sangeet night with high-energy Punjabi Dhol, stage sound, intelligent truss lights, and choreography.",
    iconName: "Music",
    category: "Entertainment",
    features: [
      "Bollywood choreographers for family sangeet performances",
      "Concert-style LED stage walls & intelligent beam lighting",
      "Cold pyros, dry ice low fog & celebratory paper blast effects",
      "Traditional energetic Shehnai & Dhol Tasha teams",
    ],
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
    detailedDescription: "Royal Shahi Dawat with authentic regional curries, live chaat counters, and traditional copper handi buffet service.",
    iconName: "Utensils",
    category: "Catering",
    features: [
      "100% pure vegetarian & customized royal gourmet menus",
      "Authentic Bundelkhandi, Awadhi & Mughlai royal delicacies",
      "Live chaat counters, tandoori breads, mocktail bars & mithai",
      "Gleaming copper chafing dishes & trained white-glove staff",
    ],
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
    detailedDescription: "Grand Indian Baraat management with decorated chariots, vintage cars, brass bands, and traditional welcome tilak.",
    iconName: "Sparkles",
    category: "Logistics",
    features: [
      "Vintage open cars & decorated royal chariot / horse setups",
      "Synchronized royal brass band & percussion musicians",
      "Traditional aarti, ittar spray & flower shower swagat team",
      "Custom royal safa & pagdi tying masters for all baratis",
    ],
    order: 6,
    isActive: true,
    coverImage: {
      url: "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=1200&q=80",
      alt: "Royal Indian Baraat Procession and Hospitality",
    },
  },
];

async function run() {
  console.log("Connecting to MongoDB at:", mongoUri);
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully.");

    for (const service of defaultIndianServices) {
      const res = await Service.findOneAndUpdate(
        { slug: service.slug },
        { $set: service },
        { upsert: true, new: true }
      );
      console.log(`Saved service: ${res.title} (${res.slug})`);
    }

    console.log("All Indian wedding services have been saved to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect or save to MongoDB:", err.message);
    console.log("Note: Make sure your MongoDB service is running (e.g. net start MongoDB) or your MONGODB_URI points to an active MongoDB Atlas cluster.");
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
