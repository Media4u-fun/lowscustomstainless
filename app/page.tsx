"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const clients = [
  "Yard House", "In-N-Out", "Capital Grille", "Chipotle", "SoFi Stadium",
  "Crypto.com Arena", "Apple", "Google", "Kaiser", "McDonald's",
  "Disney", "Universal Studios", "Starbucks", "Claim Jumper", "Popeyes",
];

const sectors = [
  {
    icon: "I",
    title: "Fine & Casual Dining",
    desc: "Yard House, Capital Grille, Claim Jumper, Buca di Beppo - the full spectrum of hospitality.",
  },
  {
    icon: "II",
    title: "Quick Service & Fast Casual",
    desc: "In-N-Out (70-80 locations), Chipotle, McDonald's, Starbucks, Popeyes.",
  },
  {
    icon: "III",
    title: "Stadiums & Entertainment",
    desc: "SoFi Stadium, Crypto.com Arena, Disney, Universal Studios.",
  },
  {
    icon: "IV",
    title: "Corporate & Technology",
    desc: "Apple, Google - built to the standards the world's most demanding companies require.",
  },
  {
    icon: "V",
    title: "Institutional",
    desc: "Kaiser Hospitals, Fire Departments - mission-critical environments with zero margin for error.",
  },
  {
    icon: "VI",
    title: "Specialty & Boutique",
    desc: "805 Brewery, Campfire Grill - artisanal copper and custom finishes.",
  },
];

const services = [
  {
    title: "M5 Oracle Sand Finish",
    desc: "Our proprietary multi-directional abrasive technique. The finish that built our reputation with Yard House.",
    tag: "SIGNATURE",
  },
  {
    title: "Overnight Emergency Install",
    desc: "Field crews mobilize after hours. Restaurants open on schedule. No exceptions.",
    tag: "24/7",
  },
  {
    title: "End-to-End Consulting",
    desc: "From CAD design to final inspection. We own every step so nothing falls through the cracks.",
    tag: "FULL SERVICE",
  },
  {
    title: "Hammered Copper & Rustic Steel",
    desc: "International copper sourcing. Chemically aged rustic panels. Materials most shops can't touch.",
    tag: "SPECIALTY",
  },
  {
    title: "Lifecycle Maintenance",
    desc: "We built it. We maintain it. 33 years of relationships don't end at installation.",
    tag: "ONGOING",
  },
  {
    title: "Custom Bar Tops",
    desc: "M5-finished bar tops that become the centerpiece of every space. Measured to the millimeter.",
    tag: "SIGNATURE",
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          overflow: "hidden",
          padding: "80px 24px 40px",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(229,62,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Red accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent, #e53e3e, transparent)",
          }}
        />

        <div style={{ maxWidth: "900px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(229,62,62,0.1)",
              border: "1px solid rgba(229,62,62,0.3)",
              borderRadius: "4px",
              padding: "6px 16px",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#e53e3e",
              marginBottom: "32px",
            }}
          >
            33 Years - Zero Compromises
          </div>

          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-2px",
              marginBottom: "24px",
              color: "#fff",
            }}
          >
            LOW&apos;S CUSTOM
            <br />
            <span style={{ color: "#8a8a8a" }}>STAINLESS</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#999",
              maxWidth: "600px",
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            Elite commercial stainless fabrication and installation. Yard House exclusive
            partner for 20+ years. 70-80 In-N-Out locations. Stadiums, hospitals, Fortune
            500. Built by Scott Low - master fabricator since 1991.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/quote"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#e53e3e",
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
              Request a Quote
            </Link>
            <Link
              href="/portfolio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: "#f5f5f5",
                padding: "16px 32px",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #333",
              }}
            >
              View Portfolio
            </Link>
          </div>

          {/* Emergency CTA */}
          <div style={{ marginTop: "48px" }}>
            <Link
              href="/contact"
              style={{
                color: "#d69e2e",
                fontSize: "12px",
                textDecoration: "none",
                letterSpacing: "2px",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(214,158,46,0.3)",
                paddingBottom: "2px",
              }}
            >
              Emergency Overnight Install - Inquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Client logo strip */}
      <section
        style={{
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          padding: "24px",
          overflow: "hidden",
          background: "#111",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#555", textTransform: "uppercase" }}>
            Trusted by
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {clients.map((c) => (
            <span
              key={c}
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "#555",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "64px" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#e53e3e",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Industries We Serve
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-1px",
                color: "#fff",
              }}
            >
              Six Sectors.
              <br />
              <span style={{ color: "#8a8a8a" }}>One Standard.</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2px",
              background: "#1a1a1a",
            }}
          >
            {sectors.map((s) => (
              <div
                key={s.title}
                style={{
                  background: "#0a0a0a",
                  padding: "40px",
                  borderLeft: "2px solid transparent",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = "#e53e3e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = "transparent";
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "3px", color: "#e53e3e", marginBottom: "20px", fontFamily: "serif" }}>{s.icon}</div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "64px" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#e53e3e",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              What We Do
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-1px",
                color: "#fff",
              }}
            >
              End-to-End.
              <br />
              <span style={{ color: "#8a8a8a" }}>No Exceptions.</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {services.map((s) => (
              <div
                key={s.title}
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  borderRadius: "4px",
                  padding: "32px",
                }}
              >
                <div
                  style={{
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
                  }}
                >
                  {s.tag}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
                  {s.title}
                </h3>
                <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <Link
              href="/services"
              style={{
                display: "inline-block",
                color: "#e53e3e",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: "1px solid #e53e3e",
                paddingBottom: "4px",
              }}
            >
              All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Founder section */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderLeft: "4px solid #e53e3e",
              borderRadius: "4px",
              padding: "60px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#e53e3e",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              The Founder
            </div>
            <blockquote
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 300,
                color: "#ccc",
                lineHeight: 1.5,
                fontStyle: "italic",
                marginBottom: "32px",
              }}
            >
              &ldquo;Sheet metal fabrication is fundamentally an exercise in applied
              mathematics, spatial geometry, and trigonometry. Get it wrong by a millimeter
              and nothing fits.&rdquo;
            </blockquote>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>Scott Low</div>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                Founder - Union Sheet Metal Apprentice at 15 - A Mechanic by 20
              </div>
            </div>
            <div style={{ marginTop: "40px" }}>
              <Link
                href="/about"
                style={{
                  display: "inline-block",
                  color: "#e53e3e",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Scott&apos;s Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "100px 24px",
          background: "#111",
          borderTop: "1px solid #1a1a1a",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-1px",
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            Ready to Build Something
            <br />
            <span style={{ color: "#e53e3e" }}>That Lasts?</span>
          </h2>
          <p style={{ color: "#777", fontSize: "16px", lineHeight: 1.7, marginBottom: "40px" }}>
            Tell us about your project. We&apos;ll respond within one business day with a
            clear assessment and path forward.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/quote"
              style={{
                display: "inline-block",
                background: "#e53e3e",
                color: "#fff",
                padding: "18px 40px",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Start Your Quote
            </Link>
            <Link
              href="/store"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#d69e2e",
                padding: "18px 40px",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #d69e2e",
              }}
            >
              Commission Custom Work
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
