package com.stackfolio.projectservice.mapper;

import com.stackfolio.projectservice.entity.Project;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProjectMapper {

    @Select("SELECT id, title, description, github_link, live_url, image_url, created_at, updated_at FROM projects ORDER BY created_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "title"),
        @Result(property = "description", column = "description"),
        @Result(property = "githubLink", column = "github_link"),
        @Result(property = "liveUrl", column = "live_url"),
        @Result(property = "imageUrl", column = "image_url"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "technologies", javaType = List.class, column = "id",
                many = @Many(select = "findTechnologiesByProjectId"))
    })
    List<Project> findAll();

    @Select("SELECT id, title, description, github_link, live_url, image_url, created_at, updated_at FROM projects WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "title"),
        @Result(property = "description", column = "description"),
        @Result(property = "githubLink", column = "github_link"),
        @Result(property = "liveUrl", column = "live_url"),
        @Result(property = "imageUrl", column = "image_url"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "technologies", javaType = List.class, column = "id",
                many = @Many(select = "findTechnologiesByProjectId")),
        @Result(property = "highlights", javaType = List.class, column = "id",
                many = @Many(select = "findHighlightsByProjectId"))
    })
    Project findById(Integer id);

    @Select("SELECT technology FROM project_technologies WHERE project_id = #{projectId}")
    List<String> findTechnologiesByProjectId(Integer projectId);

    @Select("SELECT highlight FROM project_highlights WHERE project_id = #{projectId}")
    List<String> findHighlightsByProjectId(Integer projectId);

    @Insert("INSERT INTO projects (title, description, github_link, live_url, image_url) VALUES (#{title}, #{description}, #{githubLink}, #{liveUrl}, #{imageUrl})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Project project);

    @Update("UPDATE projects SET title = #{title}, description = #{description}, github_link = #{githubLink}, live_url = #{liveUrl}, image_url = #{imageUrl}, updated_at = NOW() WHERE id = #{id}")
    void update(Project project);

    @Delete("DELETE FROM projects WHERE id = #{id}")
    void delete(Integer id);

    @Insert("<script>" +
            "INSERT INTO project_technologies (project_id, technology) VALUES " +
            "<foreach collection='technologies' item='tech' separator=','>" +
            "(#{id}, #{tech})" +
            "</foreach>" +
            "</script>")
    void insertTechnologies(@Param("id") Integer projectId, @Param("technologies") List<String> technologies);

    @Delete("DELETE FROM project_technologies WHERE project_id = #{projectId}")
    void deleteTechnologies(Integer projectId);
}