package com.example.backend.services;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Stream;

import com.example.backend.entity.Assign;
import com.example.backend.repository.AssignRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FilesStorageServiceImpl implements FileStorageService {

    private final Path root = Paths.get("uploads");
    private final Path admin = root.resolve("admin");
    private final Path user = root.resolve("user");
    private final UserRepository  userRepository;
    private final AssignRepository assignRepository;

    @Override
    public void init() {
        try {
            Files.createDirectories(root);
            Files.createDirectory(admin);
            Files.createDirectory(user);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    private void validateFileType(MultipartFile file) { //Burası dosya türünü kontrol ediyor
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "pdf", "xlsx", "pkl", "csv", "doc");

            if (!allowedExtensions.contains(fileExtension)) {
                throw new RuntimeException("Dosya türü desteklenmiyor.");
            }
        } else {
            throw new RuntimeException("Dosya adı alınamadı.");
        }
    }

    @Override
    public void save(MultipartFile file,String title) { //admin için dosya yükleme kısmı
        try {
            validateFileType(file);
            Path adminWithTitleDir = admin.resolve(title);

            Files.copy(file.getInputStream(), adminWithTitleDir.resolve(Objects.requireNonNull(file.getOriginalFilename())));
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void uploadTestFile(MultipartFile file,String title) { // admin içi test dosyası yani modellerin test etmek için kullanılacak data nın yüklendiği yer
        try {
            validateFileType(file);
            Path adminWithTitleDir = admin.resolve(title).resolve("test");
            Files.createDirectory(adminWithTitleDir);
            Files.copy(file.getInputStream(), adminWithTitleDir.resolve(Objects.requireNonNull(file.getOriginalFilename())));
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void saveUser(MultipartFile file, String studentNo, String assignTitle) {
        try {
            validateFileType(file);

            String originalFilename = file.getOriginalFilename();
            Path userWithTitleDir = user.resolve(assignTitle).resolve(studentNo);
            Files.createDirectories(userWithTitleDir);

            Files.copy(file.getInputStream(), userWithTitleDir.resolve(Objects.requireNonNull(originalFilename)));

            User user = userRepository.findBySchoolNo(studentNo).orElseThrow();
            Assign assign = assignRepository.getAssignByTitle(assignTitle);

            // Ensure the user's assignments list is initialized
            if (user.getAssigns() == null) {
                user.setAssigns(new HashSet<>());
            }

            // Add the assignment to the user's list if not already present
            if (!user.getAssigns().contains(assign)) {
                user.getAssigns().add(assign);
            }

            // Save the updated user
            userRepository.save(user);

        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("Bu ada sahip bir dosya zaten var.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }



    @Override
    public Resource load(String assignTitle, String studentNo, String filename) {
        try {

            Path file = user.resolve(assignTitle).resolve(studentNo).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public Resource loadAdmin(String assignTitle, String filename) {
        try {
            Path file = admin.resolve(assignTitle).resolve(filename);

            // Check if the path points to a file and not a directory
            if (Files.isRegularFile(file)) {
                Resource resource = new UrlResource(file.toUri());

                if (resource.exists() || resource.isReadable()) {
                    return resource;
                } else {
                    throw new RuntimeException("Could not read the file!");
                }
            } else {
                throw new RuntimeException("The specified path is not a file.");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public Stream<Path> loadAllUser(String fileName, String assignTitle) {
        try {
            Path userDirectory = user.resolve(assignTitle).resolve(fileName);

            if (!Files.exists(userDirectory) || !Files.isDirectory(userDirectory)) {
                throw new IllegalArgumentException("Directory not found: " + fileName);
            }

            return Files.walk(userDirectory, 1)
                    .filter(path -> !path.equals(userDirectory))
                    .map(userDirectory::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }
    @Override
    public Stream<Path> loadAllAdmin(String fileName) {
        try {
            Path userDirectory = admin.resolve(fileName);

            if (!Files.exists(userDirectory) || !Files.isDirectory(userDirectory)) {
                throw new IllegalArgumentException("Directory not found: " + fileName);
            }

            return Files.walk(userDirectory, 1)
                    .filter(path -> !path.equals(userDirectory) && Files.isRegularFile(path)) // Only include regular files
                    .map(userDirectory::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    @Override
    public String getDataPath(String assignTitle) {
        Path p = admin.resolve(assignTitle).resolve("test");

        try (Stream<Path> files = Files.list(p)) {
            return files
                    .filter(file -> !Files.isDirectory(file))
                    .filter(file -> file.toString().endsWith(".csv"))
                    .map(file -> file.toAbsolutePath().toString())
                    .findFirst()
                    .orElse(null);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    @Override
    public String getModelPath(String assignTitle, String studentNo){
        Path p = user.resolve(assignTitle).resolve(studentNo);
        try (Stream<Path> files = Files.list(p)) {
            return files
                    .filter(file -> !Files.isDirectory(file))
                    .filter(file -> file.toString().endsWith(".pkl"))
                    .map(file -> file.toAbsolutePath().toString())
                    .findFirst()
                    .orElse(null);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void createDirectory(String title){
        try {
            Path adminWithTitleDir = admin.resolve(title);
            Path userAssignTitle = user.resolve(title);
            Files.createDirectory(userAssignTitle);
            Files.createDirectories(adminWithTitleDir);

        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }

    public void deleteDirectory(String title) {
        Path directory = admin.resolve(title);
        Path userDirectory= user.resolve(title);

        if(Files.exists(directory) && Files.exists(userDirectory)){
            try {
                Files.walk(directory)
                        .sorted(Comparator.reverseOrder()) // Dosyaları ve dizinleri önce içten dışa doğru sıralar
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to delete file: " + path, e);
                            }
                        });
            } catch (NoSuchFileException e) {
                throw new RuntimeException("No such directory: " + directory, e);
            } catch (DirectoryNotEmptyException e) {
                throw new RuntimeException("Directory is not empty: " + directory, e);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete directory: " + directory, e);
            }
            try {
                Files.walk(userDirectory)
                        .sorted(Comparator.reverseOrder()) // Dosyaları ve dizinleri önce içten dışa doğru sıralar
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to delete file: " + path, e);
                            }
                        });
            } catch (NoSuchFileException e) {
                throw new RuntimeException("No such directory: " + directory, e);
            } catch (DirectoryNotEmptyException e) {
                throw new RuntimeException("Directory is not empty: " + directory, e);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete directory: " + directory, e);
            }
        }

    }


}