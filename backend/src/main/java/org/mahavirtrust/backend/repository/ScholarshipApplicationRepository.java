package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.ApplicationStatus;
import org.mahavirtrust.backend.entity.ScholarshipApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScholarshipApplicationRepository extends JpaRepository<ScholarshipApplication, Long> {

    Optional<ScholarshipApplication> findByApplicationNumber(String applicationNumber);

    Optional<ScholarshipApplication> findByApplicationNumberAndPhone(String applicationNumber, String phone);

    List<ScholarshipApplication> findByStatus(ApplicationStatus status);

    List<ScholarshipApplication> findByDistrict(String district);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT COALESCE(SUM(s.tuitionFeeDemanded), 0) FROM ScholarshipApplication s WHERE s.status = :status")
    BigDecimal sumTuitionFeeByStatus(@Param("status") ApplicationStatus status);

    @Query("SELECT COALESCE(SUM(s.tuitionFeeDemanded), 0) FROM ScholarshipApplication s")
    BigDecimal sumTotalTuitionFee();
}
