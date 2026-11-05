/**
 * MAHAVIR TRUST - Intelligent AI Gateway Circuit Breaker
 * 
 * Manages operational state and automatic hot-standby failover between
 * the local independent Python AI engine (127.0.0.1:8082) and Groq Cloud.
 * 
 * Circuit States:
 * - CLOSED: Normal operation. Requests probe local engine first.
 * - OPEN: Tripped after 3 consecutive qualifying failures. Bypasses local engine
 *   for 60s cooldown, routing immediately to Groq hot-standby with zero wait.
 * - HALF_OPEN: 60s cooldown elapsed. Sends a single controlled trial request.
 *   If successful, resets to CLOSED. If failed, re-opens for another 60s cooldown.
 * 
 * Multi-Worker Architecture Note:
 * In PM2 multi-instance cluster configurations, state is tracked per-process.
 * Each worker operates with its own consistent local event loop state.
 */

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerConfig {
  failureThreshold?: number; // Default: 3
  cooldownMs?: number;        // Default: 60,000ms (60 seconds)
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private consecutiveFailures: number = 0;
  private lastFailureTime: number = 0;
  private nextProbeTime: number = 0;
  private halfOpenTrialInProgress: boolean = false;

  private readonly failureThreshold: number;
  private readonly cooldownMs: number;

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold ?? 3;
    this.cooldownMs = config.cooldownMs ?? 60_000;
  }

  /**
   * Evaluates whether the gateway should attempt local engine inference
   * or bypass directly to Groq hot-standby.
   */
  public canAttemptLocal(): boolean {
    const now = Date.now();

    if (this.state === "CLOSED") {
      return true;
    }

    if (this.state === "OPEN") {
      if (now >= this.nextProbeTime) {
        // Cooldown period elapsed -> transition to HALF_OPEN for a single controlled trial
        this.state = "HALF_OPEN";
        this.halfOpenTrialInProgress = true;
        return true;
      }
      // Circuit is OPEN and cooling down -> bypass local engine immediately
      return false;
    }

    if (this.state === "HALF_OPEN") {
      // Allow only one concurrent trial probe during HALF_OPEN to prevent dogpiling
      if (!this.halfOpenTrialInProgress) {
        this.halfOpenTrialInProgress = true;
        return true;
      }
      return false;
    }

    return true;
  }

  /**
   * Records a successful response from the local engine.
   * Closes the circuit and resets consecutive failure counters.
   */
  public recordSuccess(): void {
    this.state = "CLOSED";
    this.consecutiveFailures = 0;
    this.halfOpenTrialInProgress = false;
    this.nextProbeTime = 0;
  }

  /**
   * Records an engine failure (connection refused, timeout, or 5xx).
   */
  public recordFailure(reason?: string): void {
    const now = Date.now();
    this.consecutiveFailures += 1;
    this.lastFailureTime = now;
    this.halfOpenTrialInProgress = false;

    if (this.state === "HALF_OPEN" || this.consecutiveFailures >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextProbeTime = now + this.cooldownMs;
    }
  }

  /**
   * Manual reset for administrative recovery and testing.
   */
  public reset(): void {
    this.state = "CLOSED";
    this.consecutiveFailures = 0;
    this.lastFailureTime = 0;
    this.nextProbeTime = 0;
    this.halfOpenTrialInProgress = false;
  }

  /**
   * Returns sanitized telemetry for health diagnostics.
   */
  public getStatus() {
    const now = Date.now();
    const remainingCooldownMs = this.state === "OPEN" ? Math.max(0, this.nextProbeTime - now) : 0;

    return {
      state: this.state,
      consecutiveFailures: this.consecutiveFailures,
      failureThreshold: this.failureThreshold,
      cooldownMs: this.cooldownMs,
      remainingCooldownSeconds: Math.ceil(remainingCooldownMs / 1000),
      isCoolingDown: this.state === "OPEN" && remainingCooldownMs > 0,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }
}

// Global process-level singleton instance
export const aiGatewayCircuitBreaker = new CircuitBreaker();

