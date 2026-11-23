package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.WhatsAppRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppRecipientRepository extends JpaRepository<WhatsAppRecipient, Long> {
    Optional<WhatsAppRecipient> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);
    List<WhatsAppRecipient> findByActiveTrue();
    List<WhatsAppRecipient> findByRole(String role);
}
