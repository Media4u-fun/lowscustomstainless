/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const categories = [
  { key: "all", label: "All Products" },
  { key: "bar-tops", label: "Bar Tops" },
  { key: "countertops", label: "Countertops" },
  { key: "shelving", label: "Shelving" },
  { key: "accessories", label: "Accessories" },
  { key: "custom", label: "Custom" },
];

export default function StorePage() {
  const [category, setCategory] = useState("all");
  const products = useQuery(api.products.list, { published: true, category: category === "all" ? undefined : category });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <Navbar />

      {/* Header */}
      <section style={{ padding: "140px 24px 60px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
            Store
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: "24px" }}>
            Custom Builds.<br />
            <span style={{ color: "#8a8a8a" }}>Ready to Order.</span>
          </h1>
          <p style={{ color: "#777", fontSize: "18px", maxWidth: "500px", lineHeight: 1.7 }}>
            Select from our standard product lines or configure a custom build. All
            products fabricated in-house to our commercial grade standards.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: "0 24px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              style={{
                background: category === c.key ? "#e53e3e" : "transparent",
                color: category === c.key ? "#fff" : "#666",
                border: `1px solid ${category === c.key ? "#e53e3e" : "#2a2a2a"}`,
                borderRadius: "3px",
                padding: "8px 20px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {products === undefined && (
            <div style={{ color: "#555", textAlign: "center", padding: "80px" }}>Loading products...</div>
          )}
          {products && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙</div>
              <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Products Coming Soon</h2>
              <p style={{ color: "#666", marginBottom: "32px" }}>
                We&apos;re loading our standard product catalog. In the meantime, get a custom quote.
              </p>
              <Link
                href="/quote"
                style={{
                  display: "inline-block",
                  background: "#e53e3e",
                  color: "#fff",
                  padding: "14px 32px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Request Custom Quote
              </Link>
            </div>
          )}
          {products && products.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {products.map((p) => (
                <Link
                  key={p._id}
                  href={`/store/${p.slug}`}
                  style={{
                    background: "#111",
                    border: "1px solid #1a1a1a",
                    borderRadius: "4px",
                    overflow: "hidden",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div style={{ height: "220px", background: "#1a1a1a", overflow: "hidden" }}>
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "40px", opacity: 0.2 }}>⚙</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>
                      {p.material} {p.finish ? `- ${p.finish}` : ""}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{p.name}</div>
                    <div style={{ fontSize: "13px", color: "#777", marginBottom: "16px", lineHeight: 1.5 }}>{p.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "#e53e3e" }}>
                        ${p.price.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          letterSpacing: "1px",
                          color: p.inStock ? "#22c55e" : "#e53e3e",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {p.inStock ? "In Stock" : "Made to Order"}
                      </div>
                    </div>
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
