import { SectionLabel } from "./SectionLabel";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20">
      <SectionLabel index="§05" title="Contact" />
      <div className="max-w-md">
        <ContactForm />
      </div>
    </section>
  );
}
