import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fetch — Dog Park Network";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0D2137",
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          FETCH
        </span>
      </div>
    ),
    { ...size }
  );
}
