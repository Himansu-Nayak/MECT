package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.ScholarshipDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipDocumentRepository extends JpaRepository<ScholarshipDocument, Long> {
    List<ScholarshipDocument> findByApplicationId(Long applicationId);
}
