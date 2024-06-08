package com.example.backend.user;

import com.example.backend.entity.Assign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {

    Optional<User> findByEmail(String email);
    User findBySchoolNo(String schoolNo);
}
