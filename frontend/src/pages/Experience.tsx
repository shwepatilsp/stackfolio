import React from 'react';

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
}

const Experience: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      id: 1,
      title: "Software Developer (Contract)",
      company: "Avensys Consulting - BOS",
      location: "Singapore",
      startDate: "Oct 2025",
      endDate: "Feb 2026",
      description: "Developed microservices for client onboarding within a Client Lifecycle Management (CLM) system. Built RESTful APIs to integrate CRM, reporting systems, and internal platforms. Implemented business logic and validation rules for compliance.",
      technologies: ["Java 21", "Spring Boot", "Microservices", "Kafka", "MyBatis", "PostgreSQL"]
    },
    {
      id: 2,
      title: "Application Developer (Contract)",
      company: "Optimum Solutions – UOB Bank",
      location: "Singapore",
      startDate: "Aug 2025",
      endDate: "Sep 2025",
      description: "Contributed to development and enhancement of a digital banking application (TMRW). Maintained microservices architecture and implemented Kafka-based messaging for efficient data exchange.",
      technologies: ["Java 17", "Spring Boot", "Microservices", "Kafka", "Apache Camel", "API Gateway", "Oracle"]
    },
    {
      id: 3,
      title: "Senior Engineer",
      company: "Deutsche Bank",
      location: "Pune, India",
      startDate: "Sep 2024",
      endDate: "Jul 2025",
      description: "Built a reconciliation module (Ack-Nack) using Java 17 and Spring Boot, enhancing financial data accuracy by 35%. Implemented a Pub/Sub system for real-time data sync, speeding up transaction reconciliation by 40%.",
      technologies: ["Java 17", "Spring Boot", "Pub/Sub", "ReactJS", "API Gateway", "Oracle"]
    },
    {
      id: 4,
      title: "Application Developer",
      company: "Eviden (Atos-Syntel) | Client - Fedex",
      location: "Remote",
      startDate: "Jan 2022",
      endDate: "Aug 2024",
      description: "Led client collaborations to deliver high-quality software solutions. Developed scalable applications using Spring Boot and Spring Batch (PX-Updater). Migrated legacy Golang modules to Java 11 microservices.",
      technologies: ["Java 11", "Spring Boot", "Spring Batch", "JPA", "Oracle", "CI/CD", "SonarQube"]
    },
    {
      id: 5,
      title: "Senior Software Engineer",
      company: "Capgemini | Client – Rockwell Automation",
      location: "Remote",
      startDate: "Mar 2021",
      endDate: "Jan 2022",
      description: "Debugged and resolved code defects in Spring Boot Java applications, achieving a 95% bug-free release rate. Performed root cause analyses and optimized codebase for improved response times.",
      technologies: ["Java", "Spring Boot", "SAP-Hybris", "Oracle"]
    },
    {
      id: 6,
      title: "Java Developer",
      company: "C–Edge (A TCS-SBI Enterprise)",
      location: "Mumbai, India",
      startDate: "May 2017",
      endDate: "Mar 2021",
      description: "Designed and implemented applications using JSP, Servlets, and Spring Framework. Developed the Code Promoter Tool to automate code deployment from the frontend.",
      technologies: ["Java", "Spring", "JSP", "Servlets", "JDBC", "Bootstrap", "MySQL"]
    }
  ];

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-primary">Experience</h2>
      <div className="space-y-6">
        {experiences.map((experience) => (
          <div key={experience.id} className="glass-card group relative p-6 hover:border-brand-accent/50">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-primary group-hover:text-brand-accent transition-colors">
                {experience.title} · {experience.company}
              </h3>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {experience.startDate} — {experience.endDate || 'Present'}
              </span>
            </div>
            <p className="text-sm leading-normal text-slate-secondary mb-4">
              {experience.description}
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
              {experience.technologies.map((tech, idx) => (
                <li key={idx} className="flex items-center rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium leading-5 text-brand-accent">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
