package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassificationScoresDto {
    private String studentNo;
    private Double accuracy;
    private Double f1Score;
    private Double precision;
    private Double recall;
}
