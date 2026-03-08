import { ImageResponse } from "next/og";

interface OgOptions {
  заголовок: string;
  описание?: string;
  бейдж: string;
  цветБейджа: string;
  slug: string;
  путь: string;
}

export const ogSize = { width: 1200, height: 630 };

export function генерироватьOg({
  заголовок,
  описание,
  бейдж,
  цветБейджа,
  slug,
  путь,
}: OgOptions) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
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

      {/* Бейдж */}
      <div style={{ display: "flex", marginBottom: "24px" }}>
        <div
          style={{
            padding: "8px 20px",
            fontSize: "20px",
            color: цветБейджа,
            border: `2px solid ${цветБейджа}`,
            borderRadius: "8px",
            letterSpacing: "2px",
          }}
        >
          {бейдж}
        </div>
      </div>

      {/* Заголовок */}
      <div
        style={{
          display: "flex",
          fontSize: заголовок.length > 50 ? "38px" : "48px",
          fontWeight: "bold",
          color: "#ffffff",
          lineHeight: 1.2,
          marginBottom: "20px",
        }}
      >
        {заголовок.length > 80 ? заголовок.slice(0, 80) + "..." : заголовок}
      </div>

      {/* Описание */}
      {описание && (
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#888888",
            lineHeight: 1.4,
          }}
        >
          {описание.length > 130 ? описание.slice(0, 130) + "..." : описание}
        </div>
      )}

      {/* Футер */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "80px",
          right: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: "20px", color: "#00ff41" }}>
          STACKOVERVIBE
        </div>
        <div style={{ display: "flex", fontSize: "18px", color: "#555555" }}>
          stackovervibe.ru/{путь}/{slug}
        </div>
      </div>
    </div>,
    { ...ogSize },
  );
}
