import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Get In Touch' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 py-4 backdrop-blur-md shadow-lg' : 'bg-transparent py-8'}`}>
        <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-8 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold tracking-tight text-white font-sans">SP.</a>
          
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  className={`text-xs font-bold uppercase tracking-widest transition-all ${activeSection === item.id ? 'text-brand-accent' : 'text-slate-500 hover:text-white'}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a 
                href={`${process.env.PUBLIC_URL}/resume.html`}
                target="_blank"
                className="rounded border border-brand-accent px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-accent hover:bg-brand-accent/10 transition-all"
              >
                Résumé
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-primary sm:text-7xl">
          Shweta Patil
        </h1>
        <h2 className="mt-4 text-xl font-medium tracking-tight text-brand-accent sm:text-2xl">
          Full Stack Developer
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-normal text-slate-secondary">
          I build scalable backend systems and robust frontends. Currently exploring new opportunities.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-6">
          <a className="hover:text-white transition-colors" href="https://github.com/shwepatilsp" target="_blank" rel="noreferrer">
            <span className="sr-only">GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          </a>
          <a className="hover:text-white transition-colors" href="https://www.linkedin.com/in/shwepatilsp/" target="_blank" rel="noreferrer">
            <span className="sr-only">LinkedIn</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path></svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
