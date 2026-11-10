import { business } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";

export const metadata = pageMeta({
  title: "Privacy Policy | Mike's Automotive Detailing",
  description: "How Mike's Automotive Detailing handles information you send through the website quote form.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="pt-40 pb-24 sm:pt-48">
      <Container className="max-w-3xl">
        <p className="eyebrow text-red-text">Legal</p>
        <h1 className="mt-4 text-4xl font-black uppercase sm:text-5xl">
          <span className="chrome">Privacy policy</span>
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated November 2026</p>
        <div className="mt-10 grid gap-8 text-lg leading-relaxed text-chrome/90 [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase">
          <div>
            <h2>The short version</h2>
            <p className="mt-2">
              We only use what you send us to reply to your quote and do the work. We don&apos;t sell or share it with marketers. Period.
            </p>
          </div>
          <div>
            <h2>What we collect</h2>
            <p className="mt-2">
              When you use the quote form we receive what you type — your name, phone, email, vehicle details, the services you&apos;re interested in, notes, a preferred date —
              and any photos you choose to upload. The form is delivered to {business.name} by email through our email provider (Resend). If you text or call us, your carrier
              handles that like any other message.
            </p>
          </div>
          <div>
            <h2>How we use it</h2>
            <p className="mt-2">To contact you about your quote, schedule your appointment, and do the work you asked for. That&apos;s it.</p>
          </div>
          <div>
            <h2>Analytics</h2>
            <p className="mt-2">
              We use Vercel Web Analytics to count page views and clicks on buttons like “Call” or “Get a Quote.” It doesn&apos;t use cookies and doesn&apos;t identify you personally.
              Our map is a drawing hosted on this site (map data © OpenStreetMap contributors), so it doesn&apos;t send anything to a map provider.
              The “Directions” button opens Google Maps, where Google&apos;s own privacy policy applies.
            </p>
          </div>
          <div>
            <h2>Keeping or deleting your info</h2>
            <p className="mt-2">
              Want us to delete what you sent? Email{" "}
              <a href={`mailto:${business.email}`} className="text-white underline">
                {business.email}
              </a>{" "}
              or text {business.phone.display} and we&apos;ll take care of it.
            </p>
          </div>
          <div>
            <h2>Contact</h2>
            <p className="mt-2">
              {business.name}, {business.address.street}, {business.address.city}, {business.address.region} {business.address.postalCode} · {business.phone.display}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
