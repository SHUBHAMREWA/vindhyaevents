"use client";

import PageLayout from "@/components/PageLayout";
import { motion } from "motion/react";
import Image from "next/image";
import { Heart, Award, Users, Star, CheckCircle } from "lucide-react";
import { stats, teamMembers } from "@/data/staticData";
import Link from "next/link";

const values = [
  { icon: Heart,       title: "Passion",      desc: "We pour our heart into every wedding, treating each event as if it were our own." },
  { icon: Award,       title: "Excellence",   desc: "Uncompromising quality in every detail, from grand décor to the smallest flower." },
  { icon: Users,       title: "Partnership",  desc: "We work closely with couples to bring their unique vision to life." },
  { icon: Star,        title: "Innovation",   desc: "Blending timeless traditions with fresh, modern ideas for unforgettable celebrations." },
];

const milestones = [
  { year: "2013", event: "Founded Vindhya Events in Rewa, MP" },
  { year: "2015", event: "Expanded services across Vindhya region" },
  { year: "2017", event: "Celebrated 100th wedding milestone" },
  { year: "2019", event: "Launched premium décor studio" },
  { year: "2021", event: "500+ weddings successfully planned" },
  { year: "2024", event: "Recognized as Top Wedding Planner, MP" },
];

export default function AboutPage() {
  return (
    <PageLayout
      badge="Our Story"
      title="About Vindhya Events"
      subtitle="Over a decade of crafting unforgettable wedding experiences in the heart of Madhya Pradesh"
    >
      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75"
                  alt="About Vindhya Events"
                  fill className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
                style={{ background: "var(--c-bg-soft)" }}>
                <Heart className="w-10 h-10" style={{ color: "var(--c-primary)" }} />
              </div>
              {/* Stats card overlay */}
              <div className="absolute -bottom-8 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 4).map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-xl font-bold font-serif" style={{ color: "var(--c-primary)" }}>{s.value}</div>
                      <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}>
                Who We Are
              </span>
              <h2 className="text-4xl font-serif mb-6" style={{ color: "var(--c-footer-from)" }}>
                Crafting Love Stories Since 2013
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>For over a decade, Vindhya Events has been crafting unforgettable wedding experiences that celebrate love in its purest form. What started as a passion project in Rewa has blossomed into one of the most trusted names in wedding planning across Madhya Pradesh.</p>
                <p>We believe every couple deserves a wedding that reflects their unique story. Our dedicated team of creative professionals works tirelessly to transform dreams into reality, ensuring every detail is meticulously planned and beautifully executed.</p>
                <p>From intimate garden ceremonies to grand ballroom celebrations, we specialize in creating magical moments rooted in your culture and traditions — आपना के रीति रिवाज सजावत के साथ।</p>
              </div>
              <div className="mt-8 space-y-3">
                {["100% customized planning for every couple", "Traditional & modern fusion expertise", "Trusted by 500+ families across MP", "On-ground Rewa-based team"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--c-primary)" }} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/#consultation">
                <button className="mt-8 px-8 py-3 rounded-full text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))` }}>
                  Book a Consultation
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: "var(--c-bg-soft)" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-block px-5 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: "var(--c-bg)", color: "var(--c-primary)" }}>
              What Drives Us
            </span>
            <h2 className="text-3xl font-serif" style={{ color: "var(--c-footer-from)" }}>Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--c-bg-soft)" }}>
                  <v.icon className="w-7 h-7" style={{ color: "var(--c-primary)" }} />
                </div>
                <h3 className="font-serif text-xl mb-2" style={{ color: "var(--c-footer-from)" }}>{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif" style={{ color: "var(--c-footer-from)" }}>Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5" style={{ background: "var(--c-border)" }} />
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-center mb-10 ${i % 2 === 0 ? "justify-end md:pr-[55%]" : "justify-start md:pl-[55%]"}`}>
                <div className="bg-white border-2 rounded-2xl p-5 shadow-sm max-w-xs w-full" style={{ borderColor: "var(--c-border)" }}>
                  <div className="font-serif text-lg font-bold mb-1" style={{ color: "var(--c-primary)" }}>{m.year}</div>
                  <p className="text-gray-600 text-sm">{m.event}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow"
                  style={{ background: "var(--c-primary)" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20" style={{ background: "var(--c-bg-soft)" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif" style={{ color: "var(--c-footer-from)" }}>Meet Our Team</h2>
            <p className="text-gray-600 mt-3">The passionate people behind every perfect wedding</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="relative h-56 overflow-hidden">
                  <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" loading="lazy" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-serif text-lg font-semibold" style={{ color: "var(--c-footer-from)" }}>{member.name}</h3>
                  <p className="text-sm font-medium mt-1" style={{ color: "var(--c-primary)" }}>{member.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{member.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
