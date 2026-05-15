package com.stackfolio.projectservice.service;

import com.stackfolio.projectservice.entity.Project;
import com.stackfolio.projectservice.mapper.ProjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectMapper projectMapper;

    public List<Project> getAllProjects() {
        return projectMapper.findAll();
    }

    public Project getProjectById(Integer id) {
        return projectMapper.findById(id);
    }

    @Transactional
    public Project createProject(Project project) {
        projectMapper.insert(project);

        if (project.getTechnologies() != null && !project.getTechnologies().isEmpty()) {
            projectMapper.insertTechnologies(project.getId(), project.getTechnologies());
        }

        return project;
    }

    @Transactional
    public Project updateProject(Integer id, Project project) {
        project.setId(id);
        projectMapper.update(project);

        // Update technologies
        projectMapper.deleteTechnologies(id);
        if (project.getTechnologies() != null && !project.getTechnologies().isEmpty()) {
            projectMapper.insertTechnologies(id, project.getTechnologies());
        }

        return project;
    }

    @Transactional
    public void deleteProject(Integer id) {
        projectMapper.deleteTechnologies(id);
        projectMapper.delete(id);
    }
}