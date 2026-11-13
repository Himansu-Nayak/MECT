package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    Optional<MediaAsset> findByAssetKey(String assetKey);
    List<MediaAsset> findAllByOrderByCreatedAtDesc();
}

