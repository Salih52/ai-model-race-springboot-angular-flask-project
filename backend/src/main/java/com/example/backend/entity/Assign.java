package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Assign {
    @Id
    @GeneratedValue()
    private Long id;
    private String title;
    private String subtitle;
    private Date startDate;
    private Date endDate;
    @Column(length = 1024)
    private String description;
    private String status;
}
