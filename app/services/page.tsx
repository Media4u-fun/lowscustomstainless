import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const responsiveStyles = `
  .service-row { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  @media (max-width: 768px) {
    .service-row { grid-template-columns: 1fr; gap: 32px; }
  }
`;

const services = [
  {
    id: "m5-finish",
    tag: "SIGNATURE",
    title: "M5 Oracle Sand Finish",
    subtitle: "The finish that built our name.",
    desc: "The M5 Oracle Sand finish is a proprietary multi-directional abrasive technique that creates a unique light-scattering pattern on stainless steel. Unlike standard directional brushing, M5 finish produces consistent appearance from any viewing angle - critical for large bar tops and commercial surfaces seen under restaurant lighting. We've been Yard House's exclusive provider of this finish for over 20 years.",
    specs: [
      "Metallic value: 1.0 (full reflectance)",
      "Proprietary Voronoi noise pattern",
      "Multi-directional light scatter",
      "Available on 304 and 316 grade stainless",
    ],
  },
  {
    id: "overnight",
    tag: "24/7",
    title: "Overnight Emergency Installation",
    subtitle: "Restaurants open. Period.",
    desc: "Our overnight install service was forged doing 15+ years of post-close service work for Claim Jumper. When a commercial kitchen has an equipment failure or a restaurant remodel has to happen without losing a day of revenue, we mobilize after close and finish before open. This isn't a sideline - it's built into our operational DNA.",
    specs: [
      "Mobilize same night for critical failures",
      "Crew available 7 days a week",
      "Full install, not patch repair",
      "Kitchen inspection-ready by morning",
    ],
  },
  {
    id: "consulting",
    tag: "FULL SERVICE",
    title: "End-to-End Consulting & Design",
    subtitle: "From napkin sketch to final inspection.",
    desc: "We run the full project - initial site assessment, CAD design, material selection, laser cutting, fabrication, installation, and sign-off. General contractors and architects bring us in early because our field knowledge prevents the expensive surprises that come from design-only firms who've never held a wrench.",
    specs: [
      "SOLIDWORKS CAD design",
      "Laser cutting capabilities",
      "Material and finish consulting",
      "Site measurement and verification",
      "Final inspection and punch list",
    ],
  },
  {
    id: "copper",
    tag: "SPECIALTY",
    title: "Hammered Copper & Rustic Steel",
    subtitle: "Materials most shops won't touch.",
    desc: "We source hammered copper from international partners and fabricate chemically-aged rustic steel panels through controlled oxidation. These are specialty materials that require deep expertise in both sourcing and application. Most shops subcontract this out or turn it down. We do it in-house.",
    specs: [
      "Imported hammered copper sheet",
      "Controlled chemical oxidation process",
      "Custom wear pattern simulation",
      "Compatible with standard mounting systems",
    ],
  },
  {
    id: "bar-tops",
    tag: "SIGNATURE",
    title: "Custom Bar Tops",
    subtitle: "Measured to the millimeter. Built to outlast the lease.",
    desc: "Our bar tops are the centerpiece of every space they go into. M5-finished, precision-cut, and installed without seams in places most fabricators would use three pieces. We've built bar tops for the most recognized restaurant brands in the country. The detail work shows.",
    specs: [
      "Single-piece fabrication where possible",
      "M5, straight grain, or custom finish",
      "Integrated mounting and edge profiles",
      "ADA-compliant configurations available",
    ],
  },
  {
    id: "maintenance",
    tag: "ONGOING",
    title: "Lifecycle Maintenance & Refurbishment",
    subtitle: "We built it. We stand behind it.",
    desc: "Stainless steel lasts decades - but it needs care. Scratches, oxidation, finish wear, and impact damage happen in commercial environments. Our maintenance service restores the original finish and structural integrity. For Yard House, we've maintained the same locations for 20 years. That's the relationship we want with every client.",
    specs: [
      "Finish restoration to original spec",
      "Dent and impact repair",
      "Weld inspection and rework",
      "Scheduled preventive maintenance programs",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <style>{responsiveStyles}</style>
      <Navbar />

      {/* Header */}
      <section style={{ padding: "140px 24px 80px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "24px" }}>
            Services
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: "24px" }}>
            Every Service.<br />
            <span style={{ color: "#8a8a8a" }}>One Name: Low&apos;s Custom Stainless.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#888", lineHeight: 1.8, maxWidth: "560px" }}>
            Low&apos;s Custom Stainless doesn&apos;t subcontract specialty work out. We don&apos;t hand projects off at installation.
            We own every step because that&apos;s the only way to control the outcome.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {services.map((s, i) => (
            <div
              key={s.id}
              className="service-row"
              style={{
                padding: "80px 0",
                borderBottom: i < services.length - 1 ? "1px solid #1a1a1a" : "none",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(200,169,81,0.1)",
                    border: "1px solid rgba(200,169,81,0.2)",
                    borderRadius: "3px",
                    padding: "4px 12px",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    color: "#C8A951",
                    marginBottom: "20px",
                    textTransform: "uppercase",
                  }}
                >
                  {s.tag}
                </div>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#fff", marginBottom: "8px", lineHeight: 1.1 }}>
                  {s.title}
                </h2>
                <div style={{ fontSize: "15px", color: "#C8A951", marginBottom: "24px", fontStyle: "italic" }}>
                  {s.subtitle}
                </div>
                <p style={{ color: "#888", fontSize: "15px", lineHeight: 1.8 }}>{s.desc}</p>
              </div>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "16px" }}>
                  Specifications
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.specs.map((spec) => (
                    <li
                      key={spec}
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #1a1a1a",
                        color: "#888",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ color: "#C8A951", fontWeight: 700 }}>-</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "#111", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>
            Not Sure What You Need From Low&apos;s Custom Stainless?
          </h2>
          <p style={{ color: "#777", fontSize: "16px", marginBottom: "40px" }}>
            Tell us about your project and we&apos;ll figure it out together.
          </p>
          <Link
            href="/quote"
            style={{
              display: "inline-block",
              background: "#C8A951",
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
            Commission Your Kitchen
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
