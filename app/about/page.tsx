import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const timeline = [
  { year: "1976", event: "Scott Low begins union sheet metal apprenticeship at age 15." },
  { year: "1981", event: "Challenges journeyman test early. Achieves 'A mechanic' status - the highest field classification." },
  { year: "Late 80s", event: "Begins dual schedule: daytime fabrication shop, overnight installs for Claim Jumper and national chains. Reinvests every dollar." },
  { year: "1991", event: "Low's Custom Stainless incorporated. Moves from sole proprietorship to full commercial operation." },
  { year: "2000s", event: "Becomes Yard House exclusive stainless partner. The M5 Oracle Sand Finish becomes an industry benchmark." },
  { year: "2010s", event: "Portfolio expands to stadiums, hospitals, Fortune 500. 70-80 In-N-Out locations completed." },
  { year: "Today", event: "33 years in. Shane Low joins leadership. Decentralized structure. A-players only. The work speaks for itself." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "140px 24px 80px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "24px" }}>
            About
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", marginBottom: "32px", lineHeight: 1 }}>
            Built by a Man<br />
            <span style={{ color: "#8a8a8a" }}>Who Doesn&apos;t Miss.</span>
          </h1>
          <p style={{ fontSize: "20px", color: "#888", lineHeight: 1.8, maxWidth: "600px" }}>
            Scott Low started at 15 with a union card and a tape measure. Thirty-three years
            later, his work is in Yard House locations from coast to coast, SoFi Stadium,
            Apple campuses, and 80 In-N-Out restaurants. Not because of marketing. Because
            of precision.
          </p>
        </div>
      </section>

      {/* Founder block */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "24px" }}>
              Scott Low - Founder
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "#fff", marginBottom: "24px", lineHeight: 1.2 }}>
              An A Mechanic Before He Was 21
            </h2>
            <p style={{ color: "#888", fontSize: "16px", lineHeight: 1.8, marginBottom: "20px" }}>
              Scott entered a union sheet metal apprenticeship at 15. He didn&apos;t wait to be ready
              - he challenged the journeyman exam early and earned the highest field classification:
              A mechanic. That competitive mentality never left.
            </p>
            <p style={{ color: "#888", fontSize: "16px", lineHeight: 1.8, marginBottom: "20px" }}>
              For years he worked two shifts: building precision stainless in the shop by day,
              doing overnight installs for Claim Jumper by night. Every dollar went back in.
              When he finally incorporated Low&apos;s Custom Stainless in 1991, it wasn&apos;t a startup -
              it was a decade of proven work made official.
            </p>
            <p style={{ color: "#888", fontSize: "16px", lineHeight: 1.8 }}>
              His philosophy is simple: &quot;Sheet metal fabrication is fundamentally applied
              mathematics and spatial geometry. Get it wrong by a millimeter and nothing fits.
              We don&apos;t get it wrong.&quot;
            </p>
          </div>
          <div>
            <div
              style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "4px",
                padding: "48px",
                borderLeft: "4px solid #e53e3e",
              }}
            >
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "24px" }}>
                By the Numbers
              </div>
              {[
                { n: "33+", label: "Years in Operation" },
                { n: "70-80", label: "In-N-Out Locations" },
                { n: "20+", label: "Years as Yard House Partner" },
                { n: "6", label: "Industry Sectors Served" },
                { n: "0", label: "Compromises" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "16px 0",
                    borderBottom: "1px solid #1a1a1a",
                  }}
                >
                  <span style={{ fontSize: "36px", fontWeight: 900, color: "#e53e3e" }}>{stat.n}</span>
                  <span style={{ fontSize: "13px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
            Timeline
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: "64px" }}>
            33 Years of Earned Reputation
          </h2>
          <div style={{ position: "relative", paddingLeft: "40px", borderLeft: "2px solid #1a1a1a" }}>
            {timeline.map((item) => (
              <div key={item.year} style={{ position: "relative", marginBottom: "48px" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "-49px",
                    top: "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#e53e3e",
                    border: "2px solid #0a0a0a",
                  }}
                />
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "8px" }}>
                  {item.year}
                </div>
                <p style={{ color: "#888", fontSize: "15px", lineHeight: 1.7 }}>{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next gen */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
            The Next Chapter
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: "24px" }}>
            Shane Low is Taking the Helm
          </h2>
          <p style={{ color: "#888", fontSize: "16px", lineHeight: 1.8, marginBottom: "20px" }}>
            The transition from founder-led to decentralized isn&apos;t common in trades. Scott is
            making it happen anyway. Shane Low is bringing in A-players across operations,
            estimating, and project management - building the infrastructure for the next 33 years.
          </p>
          <p style={{ color: "#888", fontSize: "16px", lineHeight: 1.8, marginBottom: "40px" }}>
            Legacy clients: the standards don&apos;t change. The capacity does.
          </p>
          <Link
            href="/quote"
            style={{
              display: "inline-block",
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
            Work With Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
