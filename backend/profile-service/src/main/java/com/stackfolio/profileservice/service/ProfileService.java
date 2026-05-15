package com.stackfolio.profileservice.service;

import com.stackfolio.profileservice.entity.Profile;
import com.stackfolio.profileservice.entity.Skill;
import com.stackfolio.profileservice.entity.WorkExperience;
import com.stackfolio.profileservice.repository.ProfileRepository;
import com.stackfolio.profileservice.repository.SkillRepository;
import com.stackfolio.profileservice.repository.WorkExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final WorkExperienceRepository workExperienceRepository;

    public Optional<Profile> getProfile() {
        // For demo, return first profile or create default
        List<Profile> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            return Optional.of(createDefaultProfile());
        }
        return Optional.of(profiles.get(0));
    }

    public List<Skill> getSkills() {
        Optional<Profile> profile = getProfile();
        return profile.map(p -> skillRepository.findByProfileId(p.getId()))
                     .orElse(List.of());
    }

    public List<WorkExperience> getWorkExperience() {
        Optional<Profile> profile = getProfile();
        return profile.map(p -> workExperienceRepository.findByProfileIdOrderByStartDateDesc(p.getId()))
                     .orElse(List.of());
    }

    public Profile updateProfile(Profile updatedProfile) {
        Optional<Profile> existing = getProfile();
        if (existing.isPresent()) {
            Profile profile = existing.get();
            profile.setName(updatedProfile.getName());
            profile.setTitle(updatedProfile.getTitle());
            profile.setBio(updatedProfile.getBio());
            profile.setEmail(updatedProfile.getEmail());
            profile.setPhone(updatedProfile.getPhone());
            profile.setLocation(updatedProfile.getLocation());
            profile.setProfilePictureUrl(updatedProfile.getProfilePictureUrl());
            profile.setSocialLinks(updatedProfile.getSocialLinks());
            return profileRepository.save(profile);
        }
        return profileRepository.save(updatedProfile);
    }

    private Profile createDefaultProfile() {
        Profile profile = new Profile();
        profile.setName("Your Name");
        profile.setTitle("Full Stack Developer");
        profile.setBio("Passionate full-stack developer with expertise in Spring Boot, React.js, microservices, and cloud technologies.");
        profile.setEmail("your.email@example.com");
        profile.setPhone("+1-555-0123");
        profile.setLocation("Your City, Country");

        // Create default skills
        Skill skill1 = new Skill();
        skill1.setSkillName("Java");
        skill1.setCategory("backend");
        skill1.setProficiencyLevel("expert");
        skill1.setYearsOfExperience(5);
        skill1.setEndorsements(25);

        Skill skill2 = new Skill();
        skill2.setSkillName("Spring Boot");
        skill2.setCategory("backend");
        skill2.setProficiencyLevel("expert");
        skill2.setYearsOfExperience(4);
        skill2.setEndorsements(30);

        Skill skill3 = new Skill();
        skill3.setSkillName("React.js");
        skill3.setCategory("frontend");
        skill3.setProficiencyLevel("intermediate");
        skill3.setYearsOfExperience(2);
        skill3.setEndorsements(15);

        // Create default work experience
        WorkExperience exp1 = new WorkExperience();
        exp1.setCompanyName("Tech Company Inc.");
        exp1.setJobTitle("Senior Software Engineer");
        exp1.setDescription("Led development of microservices architecture serving 10k+ users.");
        exp1.setStartDate(java.time.LocalDate.of(2022, 3, 15));
        exp1.setCurrentlyWorking(true);
        exp1.setTechnologies(List.of("Java", "Spring Boot", "Kafka", "Docker"));

        // Set up bidirectional relationships
        profile.setSkills(List.of(skill1, skill2, skill3));
        profile.setWorkExperiences(List.of(exp1));
        
        skill1.setProfile(profile);
        skill2.setProfile(profile);
        skill3.setProfile(profile);
        exp1.setProfile(profile);

        return profileRepository.save(profile);
    }
}