"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const submit = useMutation(api.contactSubmissions.submit);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await submit({ name: form.name, email: form.email, phone: form.phone || undefined, subject: form.subject || "General Inquiry", message: form.message });
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "14px 16px",
    color: "#f5f5f5",
    fontSize: "15px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#666",
    marginBottom: "8px",
    fontWeight: 600,
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f5" }}>
      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 24px 80px" }}>
        <div className="contact-grid">
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#C8A951", textTransform: "uppercase", marginBottom: "16px" }}>
              Contact
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-1px", color: "#fff", marginBottom: "24px" }}>
              Talk to Low&apos;s Custom Stainless
            </h1>
            <p style={{ color: "#777", fontSize: "16px", lineHeight: 1.8, marginBottom: "48px" }}>
              General inquiries, project questions, or just want to know if Low&apos;s Custom Stainless can handle
              your scope — reach out and we&apos;ll get back to you within one business day.
            </p>

            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Email</div>
              <div style={{ color: "#ccc", fontSize: "16px" }}>scott@lowscustomstainless.com</div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Phone</div>
              <a href="tel:9099387628" style={{ color: "#ccc", fontSize: "16px", textDecoration: "none" }}>(909) 938-7628</a>
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderLeft: "3px solid #C8A951", borderRadius: "4px", padding: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "#C8A951", textTransform: "uppercase", marginBottom: "8px" }}>
                ⚡ Emergency Overnight Install
              </div>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.7, marginBottom: "12px" }}>
                Need a same-night crew? Call directly. Low&apos;s Custom Stainless mobilizes for
                commercial emergencies when restaurants and facilities can&apos;t afford downtime.
              </p>
              <a href="tel:9099387628" style={{ color: "#C8A951", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}>
                (909) 938-7628
              </a>
            </div>
          </div>

          <div>
            {done ? (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderLeft: "4px solid #C8A951", borderRadius: "4px", padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>Low&apos;s Custom Stainless Got Your Message</h2>
                <p style={{ color: "#777" }}>We&apos;ll be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="form-row">
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input style={inputStyle} value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="What's this about?" />
                </div>
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea style={{ ...inputStyle, height: "140px", resize: "vertical", fontFamily: "inherit" }} value={form.message} onChange={(e) => set("message", e.target.value)} required />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? "#555" : "#C8A951",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "16px",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
