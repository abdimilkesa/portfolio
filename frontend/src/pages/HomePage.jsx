import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { Experience } from '../components/sections/Experience';
import { Hero } from '../components/sections/Hero';
import { Projects } from '../components/sections/Projects';
import { Skills } from '../components/sections/Skills';

export function HomePage() {
  return (
    <div className="kinetic-page">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}
