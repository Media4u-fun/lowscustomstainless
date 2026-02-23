/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const sectorFilters = [
  { key: "all", label: "All Work" },
  { key: "dining", label: "Fine Dining" },
  { key: "qsr", label: "Quick Service" },
  { key: "stadiums", label: "Stadiums" },
  { key: "corporate", label: "Corporate" },
  { key: "institutional", label: "Institutional" },
  { key: "brewery", label: "Specialty" },
];

export default function PortfolioPage() {
  const [sector, setSector] = useState("all");
  const projects = useQuery(api.portfolio.list, { published: true, sector: sector === "all" ? undefined : sector });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <Navbar />

      {/* Header */}
      <section style={{ padding: "140px 24px 60px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
            Portfolio
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: "24px" }}>
            33 Years.<br />
            <span style={{ color: "#8a8a8a" }}>In the Field.</span>
          </h1>
          <p style={{ color: "#777", fontSize: "18px", maxWidth: "500px", lineHeight: 1.7 }}>
            Yard House. In-N-Out. SoFi Stadium. Apple. Kaiser. Every project built by the
            same team. Every finish held to the same standard.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section style={{ padding: "0 24px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {sectorFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setSector(f.key)}
                style={{
                  background: sector === f.key ? "#e53e3e" : "transparent",
                  color: sector === f.key ? "#fff" : "#666",
                  border: `1px solid ${sector === f.key ? "#e53e3e" : "#2a2a2a"}`,
                  borderRadius: "3px",
                  padding: "8px 20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {projects === undefined && (
            <div style={{ color: "#555", textAlign: "center", padding: "80px" }}>Loading portfolio...</div>
          )}
          {projects && projects.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px" }}>
              <div style={{ color: "#555", fontSize: "16px", marginBottom: "24px" }}>Portfolio projects coming soon.</div>
              <p style={{ color: "#444", fontSize: "14px" }}>
                Yard House. In-N-Out. SoFi Stadium. Full case studies being added now.
              </p>
            </div>
          )}
          {projects && projects.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2px", background: "#1a1a1a" }}>
              {projects.map((p) => (
                <Link
                  key={p._id}
                  href={`/portfolio/${p.slug}`}
                  style={{
                    background: "#0a0a0a",
                    display: "block",
                    textDecoration: "none",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "320px",
                  }}
                >
                  {p.coverImage ? (

                    <img src={p.coverImage} alt={p.title} style={{ width: "100%", height: "320px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "320px", background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "48px", opacity: 0.3 }}>⚙</span>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
                    }}
                  >
                    <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "6px" }}>
                      {p.sector}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{p.title}</div>
                    <div style={{ fontSize: "13px", color: "#999", marginTop: "4px" }}>{p.clientName}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
