import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get dynamic values from query params
    const title = searchParams.get("title") || siteConfig.name;
    const description =
      searchParams.get("description") || siteConfig.description;
    const type = searchParams.get("type") || "default";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            backgroundImage:
              "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)",
          }}
        >
          {/* Pattern Background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 25px 25px, #d1d5db 2%, transparent 2%),
                radial-gradient(circle at 75px 75px, #d1d5db 2%, transparent 2%)`,
              backgroundSize: "100px 100px",
              opacity: 0.3,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Type Badge */}
            {type !== "default" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1f2937",
                    color: "#ffffff",
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {type}
                </div>
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: "60px",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.2,
                marginBottom: "20px",
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "24px",
                color: "#6b7280",
                lineHeight: 1.4,
                maxWidth: "800px",
                marginBottom: "40px",
              }}
            >
              {description}
            </p>

            {/* Site Name and Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                }}
              />
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                {siteConfig.name}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation failed:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
