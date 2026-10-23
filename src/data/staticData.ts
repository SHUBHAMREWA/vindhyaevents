// Shared static data for the whole app
// ─────────────────────────────────────────────────────────────

// ── Gallery (Empty by default; populated via Admin Media / Gallery) ──
export const galleryImages: { url: string; title: string; category: string }[] = [];

// ── About / Team (Empty by default; populated via Admin Meet Our Team) ──
export const teamMembers: { name: string; role: string; experience: string; image: string }[] = [];

export const stats = [
  { value: "300+", label: "Weddings Planned" },
  { value: "5+", label: "Years Experience" },
  { value: "99%", label: "Happy Families" },
  { value: "10+", label: "Cities Served" },
];
