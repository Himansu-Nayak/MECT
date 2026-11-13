package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.ContentRevision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRevisionRepository extends JpaRepository<ContentRevision, Long> {
    List<ContentRevision> findByContentPageIdOrderByRevisionNumberDesc(Long contentPageId);
}

