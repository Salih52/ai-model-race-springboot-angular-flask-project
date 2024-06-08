package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssignDto {
    private String title;
    private String description;
    private String subtitle;
    private Date startDate;
    private Date endDate;
    private String status;
}
