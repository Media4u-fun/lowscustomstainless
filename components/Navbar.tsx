"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; gap: 32px; align-items: center; }
        .nav-toggle { display: none; background: none; border: none; color: #fff; cursor: pointer; padding: 4px; }
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-toggle { display: block; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,10,10,0.95)",
          borderBottom: "1px solid #1a1a1a",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "2px", color: "#fff", textTransform: "uppercase" }}>
              Low&apos;s Custom
            </span>
            <span style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase" }}>
              Stainless
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: "#999",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#999"; }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/quote"
              style={{
                background: "#e53e3e",
                color: "#fff",
                padding: "8px 20px",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="nav-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              background: "#111",
              borderTop: "1px solid #1a1a1a",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              style={{
                background: "#e53e3e",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: "3px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              Get Quote
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
