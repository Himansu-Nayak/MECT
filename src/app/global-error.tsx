"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Root Application Level Failure:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: "#FDFBF7",
          color: "#1C2421",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
            margin: "24px",
            padding: "36px 32px",
            textAlign: "center",
            border: "1px solid rgba(10, 25, 47, 0.15)",
            borderRadius: "4px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#7A5E24",
              backgroundColor: "rgba(197, 160, 89, 0.15)",
              border: "1px solid rgba(197, 160, 89, 0.35)",
              borderRadius: "2px",
              marginBottom: "16px",
            }}
          >
            Critical System Notice
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "26px",
              fontWeight: 700,
              color: "#0A192F",
              margin: "0 0 14px 0",
            }}
          >
            MAHAVIR TRUST Portal Interrupted
          </h1>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#4A5568",
              margin: "0 0 24px 0",
            }}
          >
            A root-level layout interruption prevented this page from loading. Our engineering team has been alerted. Please retry rendering or return to the main entry point.
          </p>
          {error.digest && (
            <div
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#7A5E24",
                backgroundColor: "#F4EFE6",
                padding: "8px 12px",
                borderRadius: "2px",
                marginBottom: "20px",
              }}
            >
              Incident Digest: {error.digest}
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "#0A192F",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              Retry Render
            </button>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0A192F",
                backgroundColor: "#F4EFE6",
                border: "1px solid rgba(10, 25, 47, 0.15)",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

