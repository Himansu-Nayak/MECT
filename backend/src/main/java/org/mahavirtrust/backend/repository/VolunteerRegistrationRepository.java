package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.VolunteerRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerRegistrationRepository extends JpaRepository<VolunteerRegistration, Long> {
    List<VolunteerRegistration> findByEmailOrderByIdDesc(String email);
    List<VolunteerRegistration> findByEmailOrderByCreatedAtDesc(String email);
    List<VolunteerRegistration> findByDistrict(String district);
    long countByVerificationStatus(String verificationStatus);
}
