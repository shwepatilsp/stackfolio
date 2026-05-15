package com.stackfolio.profileservice.repository;

import com.stackfolio.profileservice.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, String> {
    List<WorkExperience> findByProfileIdOrderByStartDateDesc(String profileId);
}