package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PaymentConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentConfigurationRepository extends JpaRepository<PaymentConfiguration, Long> {
}

