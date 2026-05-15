import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-mono">
            Hi, I'm{' '}
            <span className="text-blue-600 dark:text-blue-400">Your Name</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-12 font-light">
            Full-Stack Developer + Software Engineer
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            I build accessible, inclusive products and digital experiences for the web. 
            Specializing in modern JavaScript frameworks, cloud architecture, and enterprise-grade applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a 
              href="#projects" 
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View My Projects
            </a>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
