package com.stackfolio.projectservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    private Integer id;
    private String title;
    private String description;
    private List<String> technologies;
    private String githubLink;
    private String liveUrl;
    private String imageUrl;
    private List<String> highlights;
    private String detailedDescription;
    private ProjectMetrics metrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectMetrics {
        private Integer linesOfCode;
        private String codeQuality;
        private Integer testCoverage;
        private Integer deploymentFrequency;
    }
}