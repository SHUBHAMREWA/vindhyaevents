import PageLayout from "@/components/PageLayout";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "Vindhya Events";
  const phone = settings.primaryPhone || "7898522932";
  const email = settings.primaryEmail || "vindhyaevent@gmail.com";
  const address = settings.address || "Rewa, Madhya Pradesh — 486001, India";

  return (
    <PageLayout
      badge="Legal"
      title="Privacy Policy"
      subtitle={`How ${siteName} safeguards your personal data and wedding details`}
    >
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-gray-700 leading-relaxed space-y-6 text-sm">
          <h2 className="font-serif text-2xl font-bold text-gray-900">1. Information We Collect</h2>
          <p>
            When you request a wedding consultation through our website (vindhyaevents.in), we collect your name, contact phone number, email address, tentative event date, and specific decor preferences to plan and quote your celebration.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">2. How We Use Your Details</h2>
          <p>
            Your information is strictly used to get in touch regarding your wedding planning requirements, coordination of event logistics in Madhya Pradesh, and sending quotation estimates. We never sell or share your contact info with third-party telemarketers.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">3. Contact Us</h2>
          <p>
            If you have questions regarding our privacy practices, contact us directly at:
            <br />
            <strong>Phone:</strong> {phone}
            <br />
            <strong>Email:</strong> {email}
            <br />
            <strong>Address:</strong> {address}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
