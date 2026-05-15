import React from 'react';
import './App.css';
import Header from './components/Header';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Spotlight from './components/Spotlight';

const App: React.FC = () => {
  return (
    <div className="relative bg-background leading-relaxed text-slate-secondary selection:bg-brand-glow/30 selection:text-brand-glow">
      <Spotlight />
      
      <div className="mx-auto min-h-screen max-w-4xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-8 lg:py-0">
        <Header onNavigate={() => {}} currentPage="home" />
        
        <main id="content" className="pt-12">
          <section id="about" className="mb-24 scroll-mt-24">
            <Profile />
          </section>
          
          <section id="experience" className="mb-24 scroll-mt-24">
            <Experience />
          </section>
          
          <section id="projects" className="mb-24 scroll-mt-24">
            <Projects />
          </section>
          
          <section id="contact" className="mb-24 scroll-mt-24">
            <Contact />
          </section>

          <footer className="pb-16 text-center text-sm text-slate-500">
            <p>
              Built with React, TypeScript, and Tailwind CSS.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
