import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getProjects, getSkills, getExperience, getTestimonials } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, skills, experience, testimonials] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getTestimonials(),
  ]);

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <ProjectsSection projects={projects} />
        <SkillsSection skills={skills} />
        <ExperienceSection experience={experience} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
