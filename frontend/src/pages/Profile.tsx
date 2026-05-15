import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/profile/me');
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) return null;

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">About</h2>
      </div>
      <div>
        <p className="mb-4">
          I am a <strong>Full Stack Developer</strong> with 8+ years of experience crafting high-performance, scalable applications. My expertise lies at the intersection of robust backend architectures and intuitive, interactive frontends. Over the years, I've had the privilege of building critical systems for <strong>banking, e-commerce, and logistics</strong> leaders.
        </p>
        <p className="mb-4">
          My technical journey has evolved from mastering <strong>Java and Spring Boot</strong> to embracing the full stack with <strong>React</strong> and modern cloud-native architectures. Whether it's optimizing reconciliation modules at <strong>Deutsche Bank</strong> or building high-volume data pipelines, I thrive on solving complex technical challenges.
        </p>
        <p className="mb-8 font-medium text-brand-accent italic">
          Currently, I am looking to join a forward-thinking team where I can contribute my skills to build next-generation software.
        </p>
        
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
          {profile.skills.map((skill, index) => (
            <li key={index} className="flex items-center rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium leading-5 text-brand-accent">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
