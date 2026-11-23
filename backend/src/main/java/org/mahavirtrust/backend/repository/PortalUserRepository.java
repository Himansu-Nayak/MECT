package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PortalUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortalUserRepository extends JpaRepository<PortalUser, Long> {
    Optional<PortalUser> findByUserUuid(String userUuid);
    Optional<PortalUser> findByPrimaryEmailIgnoreCase(String email);
    Optional<PortalUser> findByPrimaryPhone(String phone);

    @Query("SELECT u FROM PortalUser u WHERE LOWER(COALESCE(u.primaryEmail, '')) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR COALESCE(u.primaryPhone, '') LIKE CONCAT('%', :q, '%') " +
           "OR EXISTS (SELECT p FROM PortalUserProfile p WHERE p.portalUser = u AND LOWER(p.fullName) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<PortalUser> searchUsers(@Param("q") String q, Pageable pageable);
}

