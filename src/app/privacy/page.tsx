import PageLayout from "@/components/PageLayout";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "RIWAJ Weddings & Events";
  const phone = settings.primaryPhone || "+91 98935 18332";
  const email = settings.primaryEmail || "riwajweddingplanner@gmail.com";
  const address = settings.address || "Rewa, Madhya Pradesh — 486001, India";

  return (
    <PageLayout
      badge="Legal & Trust"
      title="Privacy Policy"
      subtitle={`How ${siteName} safeguards your personal data and celebration details`}
    >
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-gray-700 leading-relaxed space-y-6 text-sm">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs">
            <strong>Last Updated:</strong> January 2026 | <strong>Organization:</strong> {siteName} (Rewa, Madhya Pradesh)
          </div>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-6">1. Introduction</h2>
          <p>
            At <strong>{siteName}</strong>, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, and safeguard your details when you visit our website, submit an inquiry, or book our wedding and event planning services.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">2. Information We Collect</h2>
          <p>
            When you request a wedding consultation, inquire about packages, or communicate with us, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Your Name and Contact Information (Phone Number, WhatsApp Number, Email Address)</li>
            <li>Event Information (Tentative Date, Venue Location, Event Type e.g., Haldi, Mehndi, Sangeet, Wedding, Corporate)</li>
            <li>Guest Count and Budget Range</li>
            <li>Custom Decor, Floral, and Catering Preferences</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">3. How We Use Your Details</h2>
          <p>
            Your information is strictly used by <strong>{siteName}</strong> to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Connect with you regarding your event planning requirements and provide accurate price estimates.</li>
            <li>Coordinate site visits, 3D decor mockups, and vendor arrangements in Rewa and across Madhya Pradesh.</li>
            <li>Send booking confirmations, schedules, and WhatsApp updates regarding your celebration.</li>
          </ul>
          <p className="mt-2 font-medium text-emerald-800">
            ✓ We never sell, rent, or trade your personal details with third-party telemarketers or advertisers.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">4. Data Security</h2>
          <p>
            We implement industry-standard administrative and technical security measures to ensure your event details and confidential information remain protected against unauthorized access.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">5. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding our privacy practices, please contact us directly:
          </p>
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-gray-800 space-y-2 mt-3">
            <p className="font-bold text-base text-gray-900">{siteName}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Phone / WhatsApp:</strong> {phone}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
