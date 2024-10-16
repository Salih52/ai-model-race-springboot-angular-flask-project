package com.example.backend.controller;

import java.util.*;
import java.util.stream.Collectors;

import com.example.backend.dto.ModelPathDto;
import com.example.backend.dto.ScoresDto;
import com.example.backend.messages.ResponseMessage;
import com.example.backend.model.FileInfo;
import com.example.backend.services.AssignService;
import com.example.backend.services.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;


@Controller
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
public class FilesController {

    private  final RestTemplate restTemplate;
    @Autowired
    FileStorageService storageService;

    private final AssignService assignService;

    @PostMapping("/uploadAdmin")
    public ResponseEntity<ResponseMessage> uploadFiles(@RequestParam(value = "file" , required = false) MultipartFile[] files ,
                                                       @RequestParam(value = "title") String title,
                                                       @RequestParam(value = "testFile") MultipartFile[] testFile) {
        String message = "";
        try {
            List<String> fileNames = new ArrayList<>();

            storageService.createDirectory(title);

            if (files != null) {
                Arrays.asList(files).stream().forEach(file -> {
                    storageService.save(file, title);
                    fileNames.add(file.getOriginalFilename());
                });
            }

            Arrays.asList(testFile).stream().forEach(file -> {
                storageService.uploadTestFile(file, title);
            });

            if (!fileNames.isEmpty()) {
                message = "Uploaded the files successfully: " + fileNames;
            } else {
                message = "No files to upload, but test files uploaded successfully.";
            }

            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Fail to upload files!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @PostMapping("/uploadUser")
    public ResponseEntity<ResponseMessage> uploadFilesUser(@RequestParam(value = "file") MultipartFile[] files,
                                                           @RequestParam(value = "title") String title,
                                                           @RequestParam(value = "assignTitle") String assignTitle) {
        final ObjectMapper objectMapper = new ObjectMapper();
        String message = "";
        try {
            List<String> fileNames = new ArrayList<>();
            String dataPath = null;
            String modelPath = null;

            for (MultipartFile file : files) {
                storageService.saveUser(file, title, assignTitle);
                fileNames.add(file.getOriginalFilename());

                // Burada dosya adlarını kontrol ederek dataPath ve modelPath'yi ayarlayın


                if (file.getOriginalFilename().endsWith(".pkl")) {
                    modelPath = storageService.getModelPath(assignTitle,title);
                    dataPath = storageService.getDataPath(assignTitle);
                }
            }

            if (dataPath != null && modelPath != null) {
                // getModelScore metodunu çağır
                String flaskResponse = getModelScore(dataPath, modelPath);
                try {
                    ScoresDto result = objectMapper.readValue(flaskResponse, ScoresDto.class);
                    result.setStudentNo(title);
                    assignService.insertData(assignTitle,result.getStudentNo(), result.getAccuracy(), result.getF1Score(), result.getPrecision(), result.getRecall());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                message = "Uploaded the files successfully: " + fileNames + " and Flask response: " + flaskResponse;
                return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
            } else {
                message = "Files uploaded but dataPath or modelPath is missing!";
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
            }
        } catch (Exception e) {
            message = "Fail to upload files!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @PostMapping("/getFilesUser")
    public ResponseEntity<List<FileInfo>> getListFilesUser(@RequestParam(value = "fileName") String folderName,
                                                           @RequestParam(value = "assignTitle") String assignTitle) {
        try {
            List<FileInfo> fileInfos = storageService.loadAllUser(folderName,assignTitle).map(path -> {
                String filename = path.getFileName().toString();
                String url = MvcUriComponentsBuilder
                        .fromMethodName(FilesController.class, "getFile", assignTitle,folderName, filename).build().toString();


                return new FileInfo(filename, url);
            }).collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/getFilesAdmin")
    public ResponseEntity<List<FileInfo>> getListFilesAdmin(@RequestParam(value = "fileName") String folderName) {
        try {
            List<FileInfo> fileInfos = storageService.loadAllAdmin(folderName).map(path -> {
                String filename = path.getFileName().toString();
                String url = MvcUriComponentsBuilder
                        .fromMethodName(FilesController.class, "getFileAdmin",folderName, filename).build().toString();

                return new FileInfo(filename, url);
            }).collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/files/{assignTitle}/{studentNo}/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String assignTitle,
                                            @PathVariable String studentNo,
                                            @PathVariable String filename) {
        Resource file = storageService.load(assignTitle, studentNo, filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("/files/{assignTitle}/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFileAdmin(@PathVariable String assignTitle,
                                            @PathVariable String filename) {
        Resource file = storageService.loadAdmin(assignTitle, filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }


    @PostMapping("/delete")
    public ResponseEntity<ResponseMessage> deleteAll(){
        String message = "";
        try {
            storageService.deleteAll();

            message = "All files deleted ";
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not delete files "  + ". Error: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @PostMapping("/getScore")
    @ResponseBody
    public String getModelScore(String dataPath , String modelPath){
        //String jsonData = "{\"veriYolu\": \"C:\\Users\\salih\\Desktop\\project\\python\\train.csv\", \"modelYolu\": \"C:\\Users\\salih\\Desktop\\project\\python\\model1_gb.pkl.csv\"}";

        JSONObject jo = new JSONObject();
        jo.put("dataPath", dataPath);
        jo.put("modelPath", modelPath);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jo.toString(), headers);

        try {
            // Flask API'den gelen sonucu döndürme
            String flaskApiUrl = "http://python:5000/veriAl"; //local için "http://127.0.0.1:5000/veriAl" , docker için "http://python:5000/veriAl"
            return restTemplate.postForObject(flaskApiUrl, request, String.class);
        } catch (RestClientException e) {
            // Hata durumunda loglama ve uygun yanıt döndürme
            e.printStackTrace();
            return "Internal Server Error: " + e.getMessage() + jo;
        }
    }
}

