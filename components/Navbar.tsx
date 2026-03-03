"use client";
import Link from "next/link";
import Image from "next/image";
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
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Image
              src="/logo.jpg"
              alt="Low's Custom Stainless"
              width={44}
              height={44}
              style={{ borderRadius: "4px" }}
              priority
            />
            <div style={{ lineHeight: 1.1 }}>
              <span style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "2px", color: "#fff", textTransform: "uppercase", display: "block" }}>
                Low&apos;s Custom
              </span>
              <span style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", display: "block" }}>
                Stainless
              </span>
            </div>
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
            <a
              href="tel:9099387628"
              style={{
                color: "#999",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "1px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#999"; }}
            >
              (909) 938-7628
            </a>
            <Link
              href="/quote"
              style={{
                background: "#C8A951",
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
              Commission
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
            <a
              href="tel:9099387628"
              onClick={() => setOpen(false)}
              style={{
                color: "#C8A951",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "1px",
                textAlign: "center",
                marginTop: "8px",
                padding: "14px 24px",
                border: "1px solid rgba(200,169,81,0.3)",
                borderRadius: "3px",
              }}
            >
              Call (909) 938-7628
            </a>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              style={{
                background: "#C8A951",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: "3px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Commission
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
