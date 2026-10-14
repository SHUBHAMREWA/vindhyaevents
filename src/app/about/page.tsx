"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Heart,
  Award,
  Users,
  Star,
  CheckCircle,
  Volume2,
  Sparkles,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

interface TeamMemberItem {
  _id?: string;
  name: string;
  role: string;
  experience?: string;
  image?: {
    url: string;
    alt?: string;
  };
  bio?: string;
  order?: number;
}

// Fallback initial team if DB is empty or loading
const fallbackTeam: TeamMemberItem[] = [
  {
    name: "Shivam Patel",
    role: "Founder & Event Director",
    experience: "Started from Sound & DJ (2021)",
    bio: "2021 mein DJ sounds se shuruat ki. Industry ko ground-level se samajhkar Vindhya Events ko leading wedding brand banaya.",
    image: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75",
    },
  },
  {
    name: "Pooja Singh",
    role: "Lead Wedding & Theme Designer",
    experience: "4+ Years Experience",
    bio: "Specializes in royal mandap setups, traditional aesthetics, flower decor, and personalized stage themes.",
    image: {
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=75",
    },
  },
  {
    name: "Aman Tiwari",
    role: "Technical, Audio & Lighting Head",
    experience: "Since 2021 (Sound & FX)",
    bio: "Expert in concert-grade DJ sound, ambient truss lighting, cold pyros, and dynamic sangeet production.",
    image: {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=75",
    },
  },
  {
    name: "Ritika Mishra",
    role: "Client Coordination & Logistics",
    experience: "3+ Years Experience",
    bio: "Ensures flawless on-ground coordination between families, vendors, and management across Rewa & nearby cities.",
    image: {
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=75",
    },
  },
];

const values = [
  {
    icon: Volume2,
    title: "Ground-Level Experience",
    desc: "2021 se har event ko ground-level par khud manage kiya hai, jisse sound se lekar decor tak har execution flawless hota hai.",
  },
  {
    icon: Heart,
    title: "Aapke Riwaj, Dil Se",
    desc: "Har parivaar ke reeti-riwaj aur sanskriti ko ahem maan kar, poore prem aur samarpan ke sath wedding plan karte hain.",
  },
  {
    icon: Sparkles,
    title: "Creative & Royal Decor",
    desc: "Timeless traditional themes ke sath fresh modern designs, lighting aur grand floral mandap jo shaadi ko royal banate hain.",
  },
  {
    icon: MapPin,
    title: "Vindhya Region Reach",
    desc: "Rewa ke alawa Satna, Maihar, Sidhi, Shahdol aur aas-paas ke shehron tak hamari team dedicated services deliver karti hai.",
  },
];

const milestones = [
  {
    year: "2021",
    title: "Shuruat with DJ Sounds & Music",
    event:
      "We started our journey in Rewa from DJ sounds and audio setups. Being on-ground at parties and weddings, we closely learned how the event industry works and what families truly desire.",
    highlight: "Ground Zero Learning",
  },
  {
    year: "2022",
    title: "Truss Lighting & Audio-Visuals",
    event:
      "Client expectations ko samajhte hue humne sound ke sath dynamic truss lighting, cold pyros, LED screens aur entry effects add kiye.",
    highlight: "Tech & FX Upgrade",
  },
  {
    year: "2023",
    title: "Full Floral & Mandap Decor Launch",
    event:
      "Stage decoration, exotic flower mandaps, haldi-mehndi backdrops aur complete theme-based wedding decor ka formal launch kiya.",
    highlight: "Complete Decor Services",
  },
  {
    year: "2024",
    title: "Regional Reach to Nearby Cities",
    event:
      "Rewa ke bahar Satna, Maihar, Sidhi aur Shahdol jaise aas-paas ke shehron mein bhi shaadiyon aur corporate events ko successfully host karna shuru kiya.",
    highlight: "Expansion Across MP",
  },
  {
    year: "2025 - Present",
    title: "300+ Royal Celebrations & Trust",
    event:
      "Aaj 300+ se zyada successful weddings ke sath Vindhya Events (RIWAJ) region ka ek highly trusted, all-in-one wedding planning & decor brand ban chuka hai.",
    highlight: "Premier Brand",
  },
];

const aboutStats = [
  { value: "300+", label: "Weddings & Events" },
  { value: "2021", label: "Year Started" },
  { value: "99%", label: "Happy Families" },
  { value: "10+", label: "Cities Served" },
];

export default function AboutPage() {
  const { siteName } = useSettings();
  const brandTitle = siteName || "RIWAJ";

  const [teamList, setTeamList] = useState<TeamMemberItem[]>(fallbackTeam);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch("/api/public/team");
        const data = await res.json();
        if (data.success && Array.isArray(data.team) && data.team.length > 0) {
          setTeamList(data.team);
        }
      } catch (err) {
        console.error("Failed to fetch team, using fallback:", err);
      } finally {
        setLoadingTeam(false);
      }
    }
    loadTeam();
  }, []);

  return (
    <PageLayout
      badge="Hamari Kahani • Our Journey"
      title={`About ${brandTitle}`}
      subtitle="2021 mein DJ sounds se lekar aaj pure Rewa aur Vindhya region mein Royal Weddings aur grand decor tak ka anokha safar."
    >
      {/* ── Story Section ─────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[420px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75"
                  alt={`About ${brandTitle} Wedding Events`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-2">
                    Sound to Royal Weddings • Est. 2021
                  </span>
                  <p className="font-serif text-lg font-bold leading-tight">
                    Aapke Reeti Riwaj Sajawat Ke Sath
                  </p>
                </div>
              </div>

              {/* Sound Icon Badge */}
              <div
                className="absolute -top-5 -left-5 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-xl rotate-[-6deg]"
                style={{ background: "var(--c-primary)", color: "#ffffff" }}
              >
                <Volume2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Stats card overlay */}
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-5 border border-gray-100 max-w-[280px]">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {aboutStats.map((s) => (
                    <div key={s.label} className="text-center">
                      <div
                        className="text-lg md:text-xl font-bold font-serif"
                        style={{ color: "var(--c-primary)" }}
                      >
                        {s.value}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
                style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Authentic Journey</span>
              </span>

              <h2
                className="text-2xl md:text-4xl font-serif font-bold mb-5 leading-tight"
                style={{ color: "var(--c-footer-from)" }}
              >
                DJ Sound Se Shuruat, Royal Weddings Tak Ka Safar
              </h2>

              <div className="space-y-3.5 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>
                  Hamne saal <strong className="text-gray-900 font-semibold">2021</strong> mein apni journey ek energetic <strong>DJ sounds aur audio setup</strong> ke sath Rewa mein shuru ki thi. Ground-level par har event mein participate karte hue humne shaadi aur celebrations ki industry ko gehrayi se samjha — logon ki ummeedein, unke jazbaat aur har function ki unique vibes.
                </p>
                <p>
                  Dhire-dhire humne sound ke sath-sath <strong>ambient lighting, stage setups, floral decor, traditional mandap aur complete wedding planning</strong> ko joda. Ground experience hone ki wajah se har vendor coordination aur execution hamare liye natural aur stress-free ban gaya.
                </p>
                <p>
                  Aaj hum sirf Rewa hi nahi, balki <strong>Satna, Maihar, Sidhi, Shahdol</strong> aur poore Vindhya region ke shehron mein top-tier wedding and event decor services deliver kar rahe hain — <em>&ldquo;Aapke Reeti Riwaj Sajawat Ke Sath&rdquo;</em>.
                </p>
              </div>

              {/* Key Points */}
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {[
                  "Started in 2021 with deep on-ground event expertise",
                  "Sound, Stage, Floral & Mandap under one roof",
                  "Serving Rewa, Satna, Maihar, Sidhi & nearby cities",
                  "100% in-house execution with zero hidden costs",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--c-primary)" }}
                    />
                    <span className="text-xs md:text-sm text-gray-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/contact">
                  <button
                    className="px-7 py-3 rounded-full text-white font-bold text-xs md:text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                    style={{
                      background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))`,
                    }}
                  >
                    <span>Book Free Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/gallery">
                  <button
                    className="px-6 py-3 rounded-full font-bold text-xs md:text-sm border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "var(--c-border)", color: "var(--c-footer-from)" }}
                  >
                    View Our Real Decor
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values / Why Choose Us ────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "var(--c-bg-soft)" }}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
              style={{ background: "var(--c-bg)", color: "var(--c-primary)" }}
            >
              Humari Pehchan
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold" style={{ color: "var(--c-footer-from)" }}>
              What Makes Our Journey Special
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-2 max-w-2xl mx-auto">
              Real experience, raw passion, and heartfelt dedication to every family&apos;s special celebration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
                    style={{ background: "var(--c-bg-soft)" }}
                  >
                    <v.icon className="w-6 h-6" style={{ color: "var(--c-primary)" }} />
                  </div>
                  <h3
                    className="font-serif font-bold text-base md:text-lg mb-2"
                    style={{ color: "var(--c-footer-from)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey Timeline ──────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
              style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
            >
              2021 Se Aaj Tak
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold" style={{ color: "var(--c-footer-from)" }}>
              Our Journey (Humara Safar)
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-2 max-w-xl mx-auto">
              Started from sound and party audio in Rewa, growing step-by-step into a full-scale wedding decor & planning brand across Vindhya.
            </p>
          </div>

          <div className="relative">
            {/* Center Line for desktop */}
            <div
              className="hidden md:block absolute left-1/2 -translate-x-px top-2 bottom-2 w-0.5"
              style={{ background: "var(--c-border)" }}
            />

            {/* Left Line for mobile */}
            <div
              className="md:hidden absolute left-4 top-2 bottom-2 w-0.5"
              style={{ background: "var(--c-border)" }}
            />

            <div className="space-y-8 md:space-y-12">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-center ${
                      isEven
                        ? "md:justify-start md:pr-[52%]"
                        : "md:justify-end md:pl-[52%]"
                    } pl-10 md:pl-0`}
                  >
                    {/* Timeline Node Dot */}
                    <div
                      className="absolute left-2.5 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-md z-10"
                      style={{ background: "var(--c-primary)" }}
                    />

                    {/* Milestone Card */}
                    <div
                      className="bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow w-full"
                      style={{ borderColor: "var(--c-border)" }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className="font-serif text-lg font-bold"
                          style={{ color: "var(--c-primary)" }}
                        >
                          {m.year}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                          {m.highlight}
                        </span>
                      </div>
                      <h4
                        className="font-serif font-bold text-sm md:text-base mb-1.5"
                        style={{ color: "var(--c-footer-from)" }}
                      >
                        {m.title}
                      </h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                        {m.event}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet Our Team ─────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: "var(--c-bg-soft)" }}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
              style={{ background: "var(--c-bg)", color: "var(--c-primary)" }}
            >
              Humari Team
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold" style={{ color: "var(--c-footer-from)" }}>
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-2 max-w-xl mx-auto">
              The passionate professionals, technical heads, and creative planners behind every memorable celebration in Rewa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamList.map((member, i) => (
              <motion.div
                key={member._id || member.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    {member.image?.url ? (
                      <Image
                        src={member.image.url}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-rose-50/50">
                        <Users className="w-12 h-12 text-rose-300 mb-1" />
                        <span className="text-xs font-semibold">{member.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 text-center">
                    <h3
                      className="font-serif text-lg font-bold"
                      style={{ color: "var(--c-footer-from)" }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="text-xs font-semibold mt-1"
                      style={{ color: "var(--c-primary)" }}
                    >
                      {member.role}
                    </p>
                    {member.experience && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                        {member.experience}
                      </span>
                    )}
                    {member.bio && (
                      <p className="text-xs text-gray-500 mt-2.5 line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
