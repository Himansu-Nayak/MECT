package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PaymentReconciliationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentReconciliationLogRepository extends JpaRepository<PaymentReconciliationLog, Long> {
    List<PaymentReconciliationLog> findByDonationIdOrderByCreatedAtDesc(Long donationId);
}

