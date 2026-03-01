// Shared static data for the whole app
// ─────────────────────────────────────────────────────────────

// ── Gallery ──────────────────────────────────────────────────
export const galleryImages = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75", title: "Romantic Ceremony", category: "Ceremony" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=75", title: "Garden Wedding", category: "Outdoor" },
  { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=75", title: "Elegant Reception", category: "Reception" },
  { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=75", title: "Floral Arrangements", category: "Decor" },
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=75", title: "Wedding Details", category: "Details" },
  { url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=75", title: "Bridal Moments", category: "Bride" },
  { url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=75", title: "Golden Hour", category: "Outdoor" },
  { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=75", title: "Sangeet Night", category: "Ceremony" },
  { url: "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?w=800&q=75", title: "Mehndi Ceremony", category: "Ceremony" },
  { url: "https://images.unsplash.com/photo-1600428853876-fb3179bec3b2?w=800&q=75", title: "Wedding Decor", category: "Decor" },
  { url: "https://images.unsplash.com/photo-1628315821764-e15c0cec9024?w=800&q=75", title: "Couple Portrait", category: "Bride" },
  { url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=75", title: "Venue Setup", category: "Reception" },
];

// ── Blog Posts ────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Essential Tips for Planning Your Dream Indian Wedding",
    excerpt: "From choosing the perfect venue to coordinating multiple ceremonies, discover the secrets to planning a flawless Indian wedding celebration that honors tradition while embracing modern elegance.",
    image: "https://images.unsplash.com/photo-1680490961937-e933bf1ef920?w=800&q=75",
    category: "Planning",
    date: "December 20, 2024",
    readTime: "8 min read",
    author: "Priya Sharma",
    featured: true,
  },
  {
    id: 2,
    title: "Wedding Planning Timeline: Your 12-Month Checklist",
    excerpt: "Stay organized and stress-free with our comprehensive month-by-month wedding planning guide. Learn what to prioritize at each stage of your journey.",
    image: "https://images.unsplash.com/photo-1760669343328-d84fbde15b65?w=800&q=75",
    category: "Planning",
    date: "December 18, 2024",
    readTime: "10 min read",
    author: "Rahul Verma",
  },
  {
    id: 3,
    title: "2025 Wedding Decoration Trends You'll Love",
    excerpt: "Discover the hottest decoration trends for 2025, from sustainable florals to innovative lighting designs that create magical atmospheres.",
    image: "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?w=800&q=75",
    category: "Decor",
    date: "December 15, 2024",
    readTime: "6 min read",
    author: "Ananya Desai",
  },
  {
    id: 4,
    title: "Choosing the Perfect Wedding Venue: A Complete Guide",
    excerpt: "Your venue sets the tone for your entire celebration. Learn how to choose a location that reflects your style and accommodates your guest list.",
    image: "https://images.unsplash.com/photo-1578730169862-749bbdc763a8?w=800&q=75",
    category: "Venue",
    date: "December 12, 2024",
    readTime: "7 min read",
    author: "Karan Mehta",
  },
  {
    id: 5,
    title: "Bridal Fashion: Finding Your Perfect Wedding Look",
    excerpt: "From traditional lehengas to contemporary fusion wear, explore how to choose wedding attire that makes you feel confident and beautiful.",
    image: "https://images.unsplash.com/photo-1637829855946-0795557bfb69?w=800&q=75",
    category: "Fashion",
    date: "December 10, 2024",
    readTime: "9 min read",
    author: "Meera Kapoor",
  },
  {
    id: 6,
    title: "Floral Design Trends: Creating Stunning Wedding Arrangements",
    excerpt: "Discover how to incorporate seasonal blooms and unique arrangements to create breathtaking floral designs for your special day.",
    image: "https://images.unsplash.com/photo-1664312696723-173130983e27?w=800&q=75",
    category: "Decor",
    date: "December 8, 2024",
    readTime: "5 min read",
    author: "Sanjay Patel",
  },
];

export const blogCategories = ["All", "Planning", "Decor", "Venue", "Fashion"];

// ── About / Team ──────────────────────────────────────────────
export const teamMembers = [
  { name: "Priya Sharma", role: "Lead Wedding Planner", experience: "8 years", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=75" },
  { name: "Rahul Verma", role: "Decor Director", experience: "6 years", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75" },
  { name: "Ananya Desai", role: "Floral Designer", experience: "5 years", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=75" },
  { name: "Karan Mehta", role: "Logistics Manager", experience: "7 years", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=75" },
];

export const stats = [
  { value: "500+", label: "Weddings Planned" },
  { value: "10+", label: "Years Experience" },
  { value: "98%", label: "Happy Couples" },
  { value: "50+", label: "Expert Staff" },
];
