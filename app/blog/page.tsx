"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPage() {
  const posts = useQuery(api.blog.list, { published: true });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <Navbar />

      {/* Header */}
      <section style={{ padding: "140px 24px 80px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
            Blog
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: "24px" }}>
            From the Shop.<br />
            <span style={{ color: "#8a8a8a" }}>Trade Knowledge.</span>
          </h1>
          <p style={{ color: "#777", fontSize: "18px", lineHeight: 1.8, maxWidth: "560px" }}>
            33 years of lessons from the field. Finishing techniques, project breakdowns,
            and what it actually takes to do commercial stainless right.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {posts === undefined && (
            <div style={{ color: "#555", textAlign: "center", padding: "80px" }}>Loading...</div>
          )}

          {posts && posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "24px", opacity: 0.3 }}>✍</div>
              <div style={{ color: "#555", fontSize: "16px", marginBottom: "8px" }}>Articles coming soon.</div>
              <p style={{ color: "#444", fontSize: "14px" }}>
                M5 finish technique. Overnight install logistics. How we built SoFi Stadium.
              </p>
            </div>
          )}

          {posts && posts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {posts.map((post, i) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "block",
                    padding: "48px 0",
                    borderBottom: i < posts.length - 1 ? "1px solid #1a1a1a" : "none",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "16px";
                    (e.currentTarget as HTMLAnchorElement).style.borderLeft = "3px solid #e53e3e";
                    (e.currentTarget as HTMLAnchorElement).style.transition = "all 0.2s";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0";
                    (e.currentTarget as HTMLAnchorElement).style.borderLeft = "none";
                  }}
                >
                  {post.tags && post.tags.length > 0 && (
                    <div style={{
                      display: "inline-block",
                      background: "rgba(229,62,62,0.1)",
                      border: "1px solid rgba(229,62,62,0.2)",
                      borderRadius: "3px",
                      padding: "3px 10px",
                      fontSize: "10px",
                      letterSpacing: "2px",
                      color: "#e53e3e",
                      marginBottom: "16px",
                      textTransform: "uppercase",
                    }}>
                      {post.tags[0]}
                    </div>
                  )}
                  <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.3 }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ color: "#777", fontSize: "15px", lineHeight: 1.7, marginBottom: "16px", maxWidth: "640px" }}>
                      {post.excerpt}
                    </p>
                  )}
                  <div style={{ fontSize: "12px", color: "#444", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
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
