package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PublicInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicInquiryRepository extends JpaRepository<PublicInquiry, Long> {
    List<PublicInquiry> findByEmailOrderByIdDesc(String email);
    List<PublicInquiry> findByEmailOrderByCreatedAtDesc(String email);
}
