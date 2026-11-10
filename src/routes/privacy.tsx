import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — The Faisa Edit" },
      { name: "description", content: "How The Faisa Edit collects, uses and protects the personal information you share with us." },
      { property: "og:title", content: "Privacy Policy — The Faisa Edit" },
      { property: "og:description", content: "How we handle the information you share with The Faisa Edit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        Your privacy matters to us. This policy explains what information The Faisa Edit collects through this website
        and how it is used. We aim to handle personal information in line with South Africa&apos;s Protection of Personal
        Information Act (POPIA).
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Mailing list: your first name and email address.</li>
        <li>Contact form: your name, email address, enquiry type and message.</li>
        <li>
          Vendor applications: business and contact details, Instagram and website links, category and space
          requirements, uploaded logos, photographs and documents, and your answers to our application questions.
        </li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To send market updates and announcements you signed up for.</li>
        <li>To respond to your enquiries.</li>
        <li>To review vendor applications and contact shortlisted or approved vendors.</li>
      </ul>
      <h2>How it is stored</h2>
      <p>
        Information is stored securely and is only accessible to authorised members of The Faisa Edit team. Uploaded
        vendor files are kept private and are never published without permission.
      </p>
      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete your information, or to remove you from our mailing list, at any
        time by <Link to="/contact" className="font-semibold text-pink-deep underline">contacting us</Link>.
      </p>
      <h2>Updates</h2>
      <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
    </LegalPage>
  );
}
