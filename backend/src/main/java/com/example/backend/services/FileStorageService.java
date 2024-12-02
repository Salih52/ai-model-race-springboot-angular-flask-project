package com.example.backend.services;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.nio.file.Path;
import java.util.stream.Stream;


public interface FileStorageService {

    public void init();

    public void save(MultipartFile file,String title);
    public void uploadTestFile(MultipartFile file,String title);
    public void saveUser(MultipartFile file,String title, String assignTitle);

    public Resource load(String filename,String assignTitle,String studentNo);
    public Resource loadAdmin(String assignTitle,String filename);
    public void deleteAll();

    public Stream<Path> loadAllUser(String fileName, String assignTitle);

    public Stream<Path> loadAllAdmin(String fileName);
    public String getDataPath(String assignTitle);
    public String getModelPath(String assignTitle, String studentNo);
    public void createDirectory(String assignTitle);
    public void deleteDirectory(String title);
    public void deleteUserFile(String studentNo , String assignTitle);
}
