import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
        padding: "60px 24px 40px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "60px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
              <Image
                src="/logo.jpg"
                alt="Low's Custom Stainless"
                width={48}
                height={48}
                style={{ borderRadius: "4px" }}
              />
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  color: "#fff",
                  textTransform: "uppercase",
                }}
              >
                Low&apos;s Custom Stainless
              </div>
            </div>
            <div style={{ fontSize: "11px", color: "#C8A951", letterSpacing: "2px", marginBottom: "16px" }}>
              Est. 1991
            </div>
            <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.7 }}>
              45+ years of experience. 33 years in business. Elite commercial stainless
              fabrication and installation. Built by craftsmen. Trusted by the best.
            </p>
          </div>

          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                color: "#555",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Company
            </div>
            {[
              { href: "/about", label: "About Scott" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/gallery", label: "Gallery" },
              { href: "/services", label: "Services" },
              { href: "/blog", label: "Blog" },
            ].map((l) => (
              <div key={l.href} style={{ marginBottom: "10px" }}>
                <Link
                  href={l.href}
                  style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}
                >
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                color: "#555",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Get Started
            </div>
            {[
              { href: "/quote", label: "Commission Your Kitchen" },
              { href: "/store", label: "Commission Custom Work" },
              { href: "/contact", label: "Contact" },
              { href: "/login", label: "Client Portal" },
            ].map((l) => (
              <div key={l.href} style={{ marginBottom: "10px" }}>
                <Link
                  href={l.href}
                  style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}
                >
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                color: "#555",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Contact
            </div>
            <div style={{ color: "#666", fontSize: "14px", lineHeight: 1.8 }}>
              <div>scott@lowscustomstainless.com</div>
              <div style={{ marginTop: "4px" }}>
                <a href="tel:9099387628" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>
                  (909) 938-7628
                </a>
              </div>
              <div style={{ marginTop: "8px" }}>
                <a
                  href="tel:9099387628"
                  style={{ color: "#C8A951", textDecoration: "none", fontSize: "14px" }}
                >
                  Emergency overnight install? Call now
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ color: "#444", fontSize: "12px" }}>
            &copy; {new Date().getFullYear()} Low&apos;s Custom Stainless. All rights reserved.
          </div>
          <div style={{ color: "#444", fontSize: "12px" }}>
            Serving California & National Accounts Since 1991
          </div>
        </div>
      </div>
    </footer>
  );
}
