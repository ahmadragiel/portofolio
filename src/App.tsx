import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { CurrentlyExploring } from './components/CurrentlyExploring';
import { TechStack } from './components/TechStack';
import { Certificates } from './components/Certificates';
import { FeaturedProjects } from './components/FeaturedProjects';
import { Section } from './components/Section';
import { AllProjects } from './components/AllProjects';
import { GithubActivity } from './components/GithubActivity';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import type { Project } from './types';
import { featuredProjects } from './lib/projects';

export default function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      {/* Keyboard users land here first and can jump past the navigation. */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <CurrentlyExploring />
        <TechStack />
        <Certificates />
        <FeaturedProjectsSection onOpen={setActiveProject} />
        <AllProjects onOpen={setActiveProject} />
        <GithubActivity />
        <Contact />
      </main>

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}

/**
 * Featured Projects gets its own wrapper so the section header can describe the
 * selection honestly, and so the modal state stays in one place.
 */
function FeaturedProjectsSection({ onOpen }: { onOpen: (project: Project) => void }) {
  return (
    <Section
      id="featured"
      eyebrow="Highlights"
      title="Featured Projects"
      lead="A small selection I have chosen to highlight because they cover the most ground. Every other repository is in the full list below."
      tone="soft"
    >
      <FeaturedProjects projects={featuredProjects} onOpen={onOpen} />
    </Section>
  );
}
