"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// To add new photos: drop them in /public/portfolio-photos/ and add the filename here
const photos = [
  "5.jpg", "BJLY5000.JPG", "BSXG5456.JPG", "IMG_0029.jpg", "IMG_0144.jpg", "IMG_0150.jpg",
  "IMG_0274.jpg", "IMG_0278.jpg", "IMG_0439.jpg", "IMG_0736.JPG", "IMG_0739.JPG", "IMG_0758.JPG",
  "IMG_0827.JPG", "IMG_2210.jpg", "IMG_2413.JPG", "IMG_2479.jpg", "IMG_2480.jpg", "IMG_2483.jpg",
  "IMG_2610.JPG", "IMG_2682.JPG", "IMG_2866.JPG", "IMG_2907.jpg", "IMG_3224.JPG", "IMG_3243.jpg",
  "IMG_3481.jpg", "IMG_3482.jpg", "IMG_3483.jpg", "IMG_3484.jpg", "IMG_3599.jpg", "IMG_3887.JPG",
  "IMG_3907.JPG", "IMG_3910.JPG", "IMG_3959.JPG", "IMG_4795.JPG", "IMG_5471.JPG", "IMG_5529.JPG",
  "IMG_5532.JPG", "IMG_5555.JPG", "IMG_5604.JPG", "IMG_5620.JPG", "IMG_5843.jpg", "IMG_8657.jpg",
  "IMG_8664.JPG", "IMG_8680.JPG", "IMG_8685.JPG", "IMG_8740.JPG", "IMG_8799.JPG", "IMG_9226.jpg",
  "IMG_9228.jpg", "IMG_9715.JPG", "IMG_9865.JPG", "IMG_9927.JPG", "IMG_9993.JPG",
  "custommetal3.JPG", "photo-1.jpg",
];

// To add new videos: drop them in /public/portfolio-photos/ and add the filename here
const videos = [
  "1.mp4", "3.mp4",
  "photo-6.mp4", "photo-15.mp4", "photo-27.mp4",
  "photo-28.mp4", "photo-30.mp4", "photo-31.mp4",
];

type MediaItem =
  | { type: "photo"; src: string }
  | { type: "video"; src: string };

const allMedia: MediaItem[] = [
  ...videos.map((v) => ({ type: "video" as const, src: `/portfolio-photos/${v}` })),
  ...photos.map((p) => ({ type: "photo" as const, src: `/portfolio-photos/${p}` })),
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<"all" | "photos" | "videos">("all");

  const filtered = allMedia.filter((m) => {
    if (filter === "photos") return m.type === "photo";
    if (filter === "videos") return m.type === "video";
    return true;
  });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 3px;
        }
        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
          }
        }
        .gallery-item .hover-overlay { opacity: 0; transition: opacity 0.2s; }
        @media (hover: none) {
          .gallery-item .hover-overlay { opacity: 1; background: rgba(0,0,0,0.2) !important; }
        }
        .gallery-item:hover .hover-overlay { opacity: 1; }
      `}</style>
      <Navbar />

      {/* Header */}
      <section style={{ padding: "140px 24px 60px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "16px" }}>
            Gallery
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: "24px" }}>
            The Work.<br />
            <span style={{ color: "#8a8a8a" }}>Up Close.</span>
          </h1>
          <p style={{ color: "#777", fontSize: "18px", maxWidth: "500px", lineHeight: 1.7 }}>
            33 years of precision fabrication. Every finish held to the same standard.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["all", "photos", "videos"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#C8A951" : "transparent",
                  color: filter === f ? "#fff" : "#555",
                  border: `1px solid ${filter === f ? "#C8A951" : "#2a2a2a"}`,
                  borderRadius: "3px",
                  padding: "8px 20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f === "all" ? `All (${allMedia.length})` : f === "photos" ? `Photos (${photos.length})` : `Videos (${videos.length})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="gallery-grid">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="gallery-item"
                onClick={() => setLightbox(item)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#111",
                  aspectRatio: "4/3",
                }}
              >
                {item.type === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt="Low's Custom Stainless work"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                ) : (
                  <video
                    src={item.src}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLVideoElement).play(); }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLVideoElement).pause(); }}
                  />
                )}

                {/* Hover overlay */}
                <div
                  className="hover-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{
                    border: "1px solid rgba(255,255,255,0.6)",
                    borderRadius: "2px",
                    padding: "8px 20px",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#fff",
                  }}>
                    {item.type === "video" ? "Play" : "View"}
                  </div>
                </div>

                {/* Video badge */}
                {item.type === "video" && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(200,169,81,0.9)",
                    borderRadius: "2px",
                    padding: "3px 8px",
                    fontSize: "9px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#fff",
                    fontWeight: 700,
                  }}>
                    Video
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "transparent",
              border: "1px solid #333",
              borderRadius: "2px",
              color: "#999",
              padding: "8px 16px",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Close
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "1200px", maxHeight: "90vh", width: "100%" }}
          >
            {lightbox.type === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lightbox.src}
                alt="Low's Custom Stainless work"
                style={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <video
                src={lightbox.src}
                style={{ width: "100%", maxHeight: "90vh", display: "block" }}
                controls
                autoPlay
                preload="metadata"
              />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
