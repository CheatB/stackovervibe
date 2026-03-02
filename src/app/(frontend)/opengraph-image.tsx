import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stackovervibe — База знаний по вайбкодингу";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a0a",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      {/* Скенлайны */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, rgba(0,255,65,0.03) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Рамка */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #1a1a1a",
          borderRadius: "12px",
          padding: "60px 80px",
          backgroundColor: "#111111",
          boxShadow: "0 0 60px rgba(0,255,65,0.08)",
        }}
      >
        {/* Терминальная строка */}
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            color: "#888888",
            marginBottom: "24px",
          }}
        >
          visitor@stackovervibe:~$
        </div>

        {/* Логотип */}
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#00ff41",
            letterSpacing: "-2px",
            textShadow: "0 0 20px rgba(0,255,65,0.4)",
            marginBottom: "20px",
          }}
        >
          STACKOVERVIBE
        </div>

        {/* Описание */}
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#e0e0e0",
            marginBottom: "32px",
          }}
        >
          База знаний по вайбкодингу
        </div>

        {/* Теги */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["tools/", "framework/", "path/", "questions/"].map((item) => (
            <div
              key={item}
              style={{
                padding: "6px 14px",
                fontSize: "16px",
                color: "#00ffff",
                border: "1px solid #1a1a1a",
                borderRadius: "6px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* URL внизу */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          fontSize: "18px",
          color: "#888888",
          display: "flex",
        }}
      >
        stackovervibe.ru
      </div>
    </div>,
    { ...size },
  );
}
