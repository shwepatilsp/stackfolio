import React from 'react';

interface Article {
  id: number;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  url: string;
}

const Writing: React.FC = () => {
  const articles: Article[] = [
    {
      id: 1,
      title: "Building Scalable Microservices with Spring Boot",
      description: "A comprehensive guide to building and deploying microservices using Spring Boot, Docker, and Kubernetes.",
      publishedAt: "2024",
      readTime: "8 min read",
      url: "#"
    },
    {
      id: 2,
      title: "Modern React Patterns and Best Practices",
      description: "Exploring advanced React patterns, hooks optimization, and performance tuning techniques.",
      publishedAt: "2024",
      readTime: "6 min read",
      url: "#"
    },
    {
      id: 3,
      title: "Database Optimization Strategies",
      description: "Practical tips for optimizing database performance, indexing strategies, and query optimization.",
      publishedAt: "2024",
      readTime: "10 min read",
      url: "#"
    }
  ];

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Writing</h2>
      </div>
      <div>
        <ul className="group/list">
          {articles.map((article) => (
            <li key={article.id} className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2" aria-label={article.publishedAt}>
                  {article.publishedAt}
                </header>
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-200">
                    <div>
                      <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-accent focus-visible:text-teal-accent group/link text-base" href={article.url} target="_blank" rel="noreferrer">
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>
                          {article.title}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path></svg>
                        </span>
                      </a>
                    </div>
                  </h3>
                  <p className="mt-2 text-sm leading-normal">
                    {article.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Writing;
