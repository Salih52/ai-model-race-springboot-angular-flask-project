package com.example.backend.services;

import com.example.backend.dto.AssignDto;
import com.example.backend.dto.ScoresDto;
import com.example.backend.entity.Assign;
import com.example.backend.repository.AssignRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignService {
    private final AssignRepository assignRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;
    @Transactional
    public Assign create(AssignDto assignDto) {
        var assign = Assign.builder()
                .title(assignDto.getTitle())
                .description(assignDto.getDescription())
                .subtitle(assignDto.getSubtitle())
                .startDate(assignDto.getStartDate())
                .endDate(assignDto.getEndDate())
                .status(assignDto.getStatus())
                .build();
        createAssignTable(assign);
        return assignRepository.save(assign);
    }

    public List<Assign> getAssigns(){
        return assignRepository.findAll();
    }


    public void delete(String title){
        dropAssignTable(title);
        fileStorageService.deleteDirectory(title);
        assignRepository.deleteAssignByTitle(title);
    }

    public void endAssign(String title){
        Assign assign = assignRepository.getAssignByTitle(title);
        assign.setStatus("inactive");
    }

    public Set<Assign> getUserAssignmentsBySchoolNo(String schoolNo) {
        User user = userRepository.findBySchoolNo(schoolNo);
        if (user == null) {
            throw new RuntimeException("User not found with school number: " + schoolNo);
        }
        return user.getAssigns();
    }

    public Assign updateAssign(String title, AssignDto assignDto)  {
        Assign assign = assignRepository.getAssignByTitle(title);

        assign.setTitle(assignDto.getTitle());
        assign.setStatus(assignDto.getStatus());
        assign.setDescription(assignDto.getDescription());
        assign.setSubtitle(assignDto.getSubtitle());
        assign.setEndDate(assignDto.getEndDate());
        assign.setStartDate(assignDto.getStartDate());

        return assignRepository.save(assign);
    }

    private void createAssignTable(Assign assign) {
        String tableName = assign.getTitle().replaceAll("[^a-zA-Z0-9_]", ""); // Dinamik tablo adı

        String sql = "CREATE TABLE " + tableName + " ("
                + "id BIGSERIAL PRIMARY KEY, "
                + "studentNo VARCHAR(255), "
                + "accuracy FLOAT, "
                + "f1Score FLOAT, "
                + "precision FLOAT, "
                + "recall FLOAT"
                + ")";
        entityManager.createNativeQuery(sql).executeUpdate();
    }

    @Transactional
    public void insertData(String tableName, String studentNo, Double accuracy, Double f1Score, Double precision, Double recall) {
        tableName = tableName.replaceAll("[^a-zA-Z0-9_]", "");
        String sql = "INSERT INTO " + tableName + " ( studentNo, accuracy, f1Score, precision, recall) VALUES (?, ?, ?, ?, ?)";
        entityManager.createNativeQuery(sql)
                .setParameter(1, studentNo)
                .setParameter(2, accuracy)
                .setParameter(3, f1Score)
                .setParameter(4, precision)
                .setParameter(5, recall)
                .executeUpdate();
    }
    @Transactional
    public List<ScoresDto> getAllRecordsSortedByF1Score(String tableName) {
        tableName = tableName.replaceAll("[^a-zA-Z0-9_]", "");
        String sql = "SELECT studentNo, accuracy, f1Score, precision, recall FROM " + tableName + " ORDER BY f1Score DESC";
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new ScoresDto(
                        (String) result[0],
                        (Double) result[1],
                        (Double) result[2],
                        (Double) result[3],
                        (Double) result[4]
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void dropAssignTable(String tableName) {
        // Tablo ismindeki izin verilmeyen karakterleri kaldırarak sadece geçerli karakterleri kullanıyoruz
        String sanitizedTableName = tableName.replaceAll("[^a-zA-Z0-9_]", "");

        String sql = "DROP TABLE IF EXISTS " + sanitizedTableName;
        entityManager.createNativeQuery(sql).executeUpdate();
    }

}
