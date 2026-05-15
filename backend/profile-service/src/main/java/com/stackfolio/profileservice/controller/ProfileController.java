package com.stackfolio.profileservice.controller;

import com.stackfolio.profileservice.entity.Profile;
import com.stackfolio.profileservice.entity.Skill;
import com.stackfolio.profileservice.entity.WorkExperience;
import com.stackfolio.profileservice.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<Profile> getProfile() {
        Optional<Profile> profile = profileService.getProfile();
        return profile.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        List<Skill> skills = profileService.getSkills();
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/experience")
    public ResponseEntity<List<WorkExperience>> getWorkExperience() {
        List<WorkExperience> experiences = profileService.getWorkExperience();
        return ResponseEntity.ok(experiences);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        Profile updated = profileService.updateProfile(profile);
        return ResponseEntity.ok(updated);
    }
}