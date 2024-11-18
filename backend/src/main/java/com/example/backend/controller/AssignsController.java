package com.example.backend.controller;

import com.example.backend.dto.ClassificationScoresDto;
import com.example.backend.dto.RegressionScoresDto;
import com.example.backend.messages.ResponseMessage;
import com.example.backend.services.AssignService;
import com.example.backend.dto.AssignDto;
import com.example.backend.entity.Assign;
import com.example.backend.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/v1/assign")
@RequiredArgsConstructor
public class AssignsController {
    private final AssignService assignService;
    private final AuthenticationService userService;

    @PostMapping("/create")
    public ResponseEntity<Assign> createAssign(
            @RequestBody AssignDto request
    ){
       return ResponseEntity.ok(assignService.create(request));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Assign>> getAssigns(){
        return ResponseEntity.ok(assignService.getAssigns());
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        try {
            assignService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid table name", e);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting the table", e);
        }
    }

    @PostMapping("/getClassificationScoreList")
    public ResponseEntity<List<ClassificationScoresDto>> getClassificationScoreList(@RequestParam(value = "tableName") String tableName){
         return ResponseEntity.ok(assignService.getClassificationRecordsSortedByMetric(tableName));
    }

    @PostMapping("/getRegressionScoreList")
    public ResponseEntity<List<RegressionScoresDto>> getRegressionScoreList(@RequestParam(value = "tableName") String tableName){
        return ResponseEntity.ok(assignService.getRegressionRecordsSortedByMetric(tableName));
    }



    @PostMapping("/endAssign")
    public  ResponseEntity<ResponseMessage> endAssign(@RequestParam(value = "title") String title){
        String message = "";
        try {
            assignService.endAssign(title);

            message = title + "Assign has ended ";
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = title + "Could not end assign "  + ". Error: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }
    @PutMapping("/updateAssign/{title}")
    public ResponseEntity<Assign> updateAssign(@PathVariable String title, @RequestBody AssignDto assignDto) {
        return ResponseEntity.ok( assignService.updateAssign(title, assignDto));
    }

    @GetMapping("/getAssignsBySchoolNo/{schoolNo}")
    public ResponseEntity<Set<Assign>> getUserAssignments(@PathVariable String schoolNo) {
        return ResponseEntity.ok( assignService.getUserAssignmentsBySchoolNo(schoolNo));
    }

}
