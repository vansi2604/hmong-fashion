"use client";

import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary cấp cao nhất trong Next.js App Router.
 * Kích hoạt khi chính Root Layout (app/layout.tsx) hoặc các Provider gốc gặp sự cố.
 * BẮT BUỘC phải tự định nghĩa thẻ <html> và <body> độc lập.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("HMONG.MALL Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#faf8f5",
          color: "#1c1917",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            backgroundColor: "#ffffff",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "32px 24px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            textAlign: "center",
          }}
        >
          {/* Logo / Biểu tượng nhận diện */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#fef3c7",
              color: "#b45309",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              fontSize: "24px",
            }}
          >
            ⚠️
          </div>

          <h1
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1c1917",
              margin: "0 0 8px 0",
            }}
          >
            Lỗi Hệ Thống Nghiêm Trọng
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#78716c",
              lineHeight: 1.6,
              margin: "0 0 24px 0",
            }}
          >
            Giao diện gốc của hệ thống HMONG.MALL gặp sự cố không thể tự phục hồi.
            Vui lòng thử kích hoạt lại hoặc tải lại toàn bộ trình duyệt.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: "#1c1917",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Khôi phục phiên làm việc
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              style={{
                backgroundColor: "#f5f5f4",
                color: "#292524",
                border: "1px solid #d6d3d1",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Tải lại trang (F5)
            </button>
          </div>

          {error?.digest && (
            <div
              style={{
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #f5f5f4",
                fontSize: "11px",
                color: "#a8a29e",
                fontFamily: "monospace",
              }}
            >
              Digest: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
