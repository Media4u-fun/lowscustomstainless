/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

export default function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = useQuery(api.portfolio.getBySlug, { slug });
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (project === undefined) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
        <Navbar />
        <div style={{ padding: "200px 24px", textAlign: "center", color: "#555" }}>Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
        <Navbar />
        <div style={{ padding: "200px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "48px", fontWeight: 900, color: "#C8A951", marginBottom: "16px" }}>Project Not Found</h1>
          <p style={{ color: "#666", marginBottom: "32px" }}>This project doesn&apos;t exist or hasn&apos;t been published yet.</p>
          <Link href="/portfolio" style={{ color: "#C8A951", textDecoration: "none", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
            Back to Portfolio
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = [project.coverImage, ...project.images].filter(Boolean) as string[];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <style>{`
        .project-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .project-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 4px; }
        @media (max-width: 768px) {
          .project-meta { grid-template-columns: 1fr; gap: 40px; }
          .project-gallery { grid-template-columns: 1fr 1fr; gap: 2px; }
        }
      `}</style>
      <Navbar />

      {/* Hero image */}
      {project.coverImage && (
        <div style={{ width: "100%", height: "60vh", minHeight: "400px", maxHeight: "600px", overflow: "hidden", marginTop: "64px" }}>
          <img
            src={project.coverImage}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Header */}
      <section style={{ padding: project.coverImage ? "60px 24px" : "160px 24px 60px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "16px" }}>
            {project.sector} {project.year ? `— ${project.year}` : ""}
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1.1, marginBottom: "16px" }}>
            {project.title}
          </h1>
          <div style={{ fontSize: "18px", color: "#888" }}>{project.clientName}{project.location ? ` — ${project.location}` : ""}</div>
        </div>
      </section>

      {/* Description + Details */}
      <section style={{ padding: "80px 24px" }}>
        <div className="project-meta" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "16px" }}>
              About This Project
            </div>
            <p style={{ color: "#ccc", fontSize: "16px", lineHeight: 1.8 }}>
              {project.description}
            </p>
            {project.caseStudy && (
              <div style={{ marginTop: "24px", padding: "24px", background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", borderLeft: "4px solid #C8A951" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#C8A951", textTransform: "uppercase", marginBottom: "12px" }}>Case Study</div>
                <p style={{ color: "#999", fontSize: "14px", lineHeight: 1.8 }}>{project.caseStudy}</p>
              </div>
            )}
          </div>

          <div>
            {/* Details card */}
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "32px" }}>
              {[
                { label: "Client", value: project.clientName },
                { label: "Sector", value: project.sector.charAt(0).toUpperCase() + project.sector.slice(1) },
                ...(project.year ? [{ label: "Year", value: String(project.year) }] : []),
                ...(project.location ? [{ label: "Location", value: project.location }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "14px 0", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
                  <span style={{ color: "#f5f5f5", fontSize: "14px", fontWeight: 600 }}>{value}</span>
                </div>
              ))}

              {project.services.length > 0 && (
                <div style={{ paddingTop: "20px", marginTop: "8px" }}>
                  <div style={{ color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Services</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {project.services.map((s) => (
                      <span key={s} style={{ background: "rgba(200,169,81,0.1)", color: "#C8A951", padding: "4px 12px", borderRadius: "3px", fontSize: "12px", fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.materials.length > 0 && (
                <div style={{ paddingTop: "16px" }}>
                  <div style={{ color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Materials</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {project.materials.map((m) => (
                      <span key={m} style={{ background: "#1a1a1a", color: "#999", padding: "4px 12px", borderRadius: "3px", fontSize: "12px" }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {allImages.length > 1 && (
        <section style={{ padding: "0 24px 80px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "24px" }}>
              Project Gallery — {allImages.length} Photos
            </div>
            <div className="project-gallery">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  style={{ aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", background: "#111" }}
                >
                  <img
                    src={img}
                    alt={`${project.title} - ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "#111", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "16px" }}>
            Low&apos;s Custom Stainless
          </div>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>
            Your Project Could Be Next.
          </h2>
          <p style={{ color: "#777", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
            Same precision. Same team. Same standard that built this project.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/quote"
              style={{ background: "#C8A951", color: "#fff", padding: "16px 32px", borderRadius: "4px", fontWeight: 700, fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}
            >
              Commission Your Kitchen
            </Link>
            <Link
              href="/portfolio"
              style={{ background: "transparent", color: "#C8A951", padding: "16px 32px", borderRadius: "4px", fontWeight: 700, fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", border: "1px solid #C8A951" }}
            >
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
            style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "1px solid #333", borderRadius: "50%", width: "48px", height: "48px", color: "#fff", fontSize: "20px", cursor: "pointer" }}
          >
            ‹
          </button>
          <img
            src={allImages[lightbox]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: "4px" }}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(allImages.length - 1, lightbox + 1)); }}
            style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "1px solid #333", borderRadius: "50%", width: "48px", height: "48px", color: "#fff", fontSize: "20px", cursor: "pointer" }}
          >
            ›
          </button>
          <button
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: "24px", right: "24px", background: "transparent", border: "none", color: "#666", fontSize: "32px", cursor: "pointer" }}
          >
            ×
          </button>
          <div style={{ position: "absolute", bottom: "24px", color: "#555", fontSize: "13px" }}>
            {lightbox + 1} / {allImages.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
