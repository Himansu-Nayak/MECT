package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.DonationProgramme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationProgrammeRepository extends JpaRepository<DonationProgramme, Long> {
    List<DonationProgramme> findByActiveTrueOrderByDisplayOrderAsc();
    List<DonationProgramme> findAllByOrderByDisplayOrderAsc();
    Optional<DonationProgramme> findByCode(String code);
}

