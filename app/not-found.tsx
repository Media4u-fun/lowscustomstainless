import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f5f5f5",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "600px" }}>
        <div
          style={{
            fontSize: "120px",
            fontWeight: 900,
            color: "#C8A951",
            lineHeight: 1,
            marginBottom: "16px",
            letterSpacing: "-4px",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "16px",
          }}
        >
          This Page Was Cut Away.
        </h1>
        <p
          style={{
            color: "#777",
            fontSize: "16px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          Like precision metalwork, every piece on this site has a purpose.
          This one doesn&apos;t exist — let&apos;s get you back to something that does.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#C8A951",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Back to Low&apos;s Custom Stainless
          </Link>
          <Link
            href="/quote"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#C8A951",
              padding: "16px 32px",
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "1px solid #C8A951",
            }}
          >
            Commission Your Kitchen
          </Link>
        </div>
        <div style={{ marginTop: "60px", color: "#333", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" }}>
          Low&apos;s Custom Stainless — From Nothing to Everything
        </div>
      </div>
    </div>
  );
}
