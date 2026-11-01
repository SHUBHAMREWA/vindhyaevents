import PageLayout from "@/components/PageLayout";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "RIWAJ Weddings & Events";
  const phone = settings.primaryPhone || "+91 98935 18332";
  const email = settings.primaryEmail || "riwajweddingplanner@gmail.com";
  const address = settings.address || "Rewa, Madhya Pradesh — 486001, India";

  return (
    <PageLayout
      badge="Legal & Terms"
      title="Terms of Service"
      subtitle={`Terms and conditions for event planning and decoration with ${siteName}`}
    >
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-gray-700 leading-relaxed space-y-6 text-sm">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs">
            <strong>Last Updated:</strong> January 2026 | <strong>Organization:</strong> {siteName} (Rewa, Madhya Pradesh)
          </div>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-6">1. Booking and Reservations</h2>
          <p>
            All event dates are reserved upon mutual confirmation and receipt of the advance booking deposit. Consultation requests through the website are inquiries and do not constitute a confirmed calendar reservation until mutually signed and acknowledged by <strong>{siteName}</strong>.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">2. Decor and Customization</h2>
          <p>
            Decor concepts, theme selections, floral specifications, and stage arrangements are tailored according to client approvals and finalized timelines.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">3. Cancellations & Rescheduling</h2>
          <p>
            In the event of date changes or unforeseen circumstances, rescheduling is subject to calendar availability and advance notice provided to <strong>{siteName}</strong>.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-8">4. Contact Information</h2>
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
