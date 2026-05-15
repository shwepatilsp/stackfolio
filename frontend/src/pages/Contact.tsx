import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Get In Touch</h2>
      </div>
      
      <h2 className="mb-4 font-mono text-sm font-normal text-brand-accent">04. What's Next?</h2>
      <h3 className="mb-6 text-4xl font-bold tracking-tight text-slate-primary sm:text-5xl">Get In Touch</h3>
      
      <p className="mb-10 max-w-md text-slate-secondary">
        I'm currently looking for new opportunities and my inbox is always open. 
        Whether you have a question or just want to say hi, I'll try my best to get back to you!
      </p>
      
      <a
        href="mailto:shwepatilsp@gmail.com"
        className="rounded border border-brand-accent px-10 py-4 font-mono text-sm text-brand-accent hover:bg-brand-accent/10 transition-colors"
      >
        Say Hello
      </a>
    </div>
  );
};

export default Contact;
