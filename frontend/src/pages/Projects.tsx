import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githuLink: string;
  liveUrl?: string;
  image?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/api/projects');
        setProjects(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return null;

  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-primary">Projects</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {displayedProjects.map((project) => (
          <div key={project.id} className="glass-card group flex flex-col overflow-hidden hover:border-brand-accent/50">
            <div className="relative aspect-video overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900/50 text-slate-500">
                  <span className="text-xs font-mono">Backend System</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-slate-primary group-hover:text-brand-accent transition-colors mb-2">
                <a href={project.liveUrl || project.githuLink} target="_blank" rel="noreferrer">
                  {project.title}
                </a>
              </h3>
              <p className="text-sm leading-normal text-slate-secondary mb-4 flex-1">
                {project.description}
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
                {project.technologies.map((tech, idx) => (
                  <li key={idx} className="flex items-center rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium leading-5 text-brand-accent">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {!showAll && projects.length > 4 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setShowAll(true)}
            className="group flex items-center gap-2 font-semibold text-slate-primary hover:text-brand-accent transition-colors"
          >
            <span>View All Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transition-transform group-hover:translate-y-1">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
