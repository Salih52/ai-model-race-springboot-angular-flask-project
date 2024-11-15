package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegressionScoresDto {
    private String studentNo;
    private Double meanAbsoluteError;
    private Double meanSquaredError;
    private Double r2Score;
}
