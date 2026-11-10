package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PortalRefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortalRefreshTokenRepository extends JpaRepository<PortalRefreshToken, Long> {
    Optional<PortalRefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE PortalRefreshToken t SET t.revoked = true WHERE t.portalUser.id = :userId AND t.revoked = false")
    void revokeAllForUser(@Param("userId") Long userId);
}

