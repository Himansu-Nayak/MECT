package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.DonationReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonationReceiptRepository extends JpaRepository<DonationReceipt, Long> {
    Optional<DonationReceipt> findByDonationId(Long donationId);
    Optional<DonationReceipt> findByReceiptNumber(String receiptNumber);
}

