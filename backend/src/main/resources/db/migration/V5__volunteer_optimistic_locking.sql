-- V5__volunteer_optimistic_locking.sql
-- MAHAVIR TRUST - Optimistic Concurrency Control for Volunteer Registrations
-- Prevents lost updates and ensures status transitions cannot silently overwrite concurrent modifications.

ALTER TABLE volunteer_registrations ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
