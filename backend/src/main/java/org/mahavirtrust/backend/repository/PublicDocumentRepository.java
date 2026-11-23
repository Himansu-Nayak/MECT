package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PublicDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublicDocumentRepository extends JpaRepository<PublicDocument, Long> {

    Optional<PublicDocument> findByDocumentKey(String documentKey);

    List<PublicDocument> findByStatusAndVisibilityOrderByDisplayOrderAscCreatedAtDesc(String status, String visibility);

    List<PublicDocument> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
