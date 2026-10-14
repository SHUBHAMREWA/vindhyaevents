import PageLayout from "@/components/PageLayout";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "Vindhya Events";
  const phone = settings.primaryPhone || "7898522932";
  const email = settings.primaryEmail || "vindhyaevent@gmail.com";
  const address = settings.address || "Rewa, Madhya Pradesh — 486001, India";

  return (
    <PageLayout
      badge="Legal"
      title="Terms of Service"
      subtitle={`Terms and conditions for event planning and decoration with ${siteName}`}
    >
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-gray-700 leading-relaxed space-y-6 text-sm">
          <h2 className="font-serif text-2xl font-bold text-gray-900">1. Booking and Reservations</h2>
          <p>
            All event dates are reserved upon confirmation and advance booking deposit. Consultation requests through the website are inquiries and do not constitute a confirmed calendar reservation until mutually signed.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">2. Decor and Customization</h2>
          <p>
            Decor concepts, 3D layouts, floral specifications, and stage arrangements are tailored according to client approvals.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">3. Reach Us</h2>
          <p>
            <strong>{siteName}</strong>
            <br />
            {address}
            <br />
            Phone: {phone} | Email: {email}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
