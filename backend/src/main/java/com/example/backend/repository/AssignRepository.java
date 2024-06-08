package com.example.backend.repository;

import com.example.backend.entity.Assign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignRepository extends JpaRepository<Assign, String> {

    void deleteAssignByTitle(String title);
    Assign getAssignByTitle(String title);
}
