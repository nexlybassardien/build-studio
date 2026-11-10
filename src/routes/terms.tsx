import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — The Faisa Edit" },
      { name: "description", content: "Website and vendor application terms for The Faisa Edit pop-up market." },
      { property: "og:title", content: "Terms & Conditions — The Faisa Edit" },
      { property: "og:description", content: "Website and vendor application terms for The Faisa Edit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms & conditions">
      <p>By using this website or submitting a vendor application, you agree to the terms below.</p>
      <h2>Vendor applications</h2>
      <ul>
        <li>Submitting an application does not guarantee a stall, space or participation at any event.</li>
        <li>All applications are subject to review and availability.</li>
        <li>
          Applications are currently being collected for future editions and are not tied to a specific event date or
          placement.
        </li>
        <li>
          Details regarding stall fees, availability and event arrangements will be communicated to shortlisted or
          approved vendors.
        </li>
        <li>You confirm that the information and files you submit are accurate and that you have the right to share them.</li>
        <li>
          You allow The Faisa Edit team to review the files and links you submit for the purpose of evaluating your
          application.
        </li>
      </ul>
      <h2>Website content</h2>
      <p>
        Photographs, videos, logos and other content on this website belong to The Faisa Edit or their respective owners
        and may not be reused without permission.
      </p>
      <h2>Event information</h2>
      <p>
        Event dates, venues and details are only confirmed once officially published on this website or our Instagram
        account, and may change.
      </p>
      <h2>Questions</h2>
      <p>
        Questions about these terms? <Link to="/contact" className="font-semibold text-pink-deep underline">Get in touch</Link>.
      </p>
    </LegalPage>
  );
}
