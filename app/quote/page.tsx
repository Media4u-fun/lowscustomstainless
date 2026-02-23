"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const projectTypes = [
  "Bar Tops", "Commercial Kitchen Equipment", "Countertops & Surfaces",
  "Custom Fabrication", "Overnight Emergency Install", "Maintenance & Refurbishment",
  "Consulting & Design", "Other",
];

const sectors = [
  "Fine & Casual Dining", "Quick Service / Fast Casual", "Stadium / Entertainment",
  "Corporate / Tech", "Institutional / Healthcare", "Brewery / Specialty", "Other",
];

const budgets = [
  "Under $10K", "$10K - $50K", "$50K - $150K", "$150K - $500K", "$500K+", "Not sure yet",
];

const timelines = [
  "ASAP / Emergency", "Within 30 days", "1-3 months", "3-6 months", "6+ months",
];

export default function QuotePage() {
  const submit = useMutation(api.quoteRequests.submit);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    projectType: "", sector: "", description: "",
    budget: "", timeline: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.description || !form.projectType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await submit({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        projectType: form.projectType,
        sector: form.sector || undefined,
        description: form.description,
        budget: form.budget || undefined,
        timeline: form.timeline || undefined,
      });
      setDone(true);
      toast.success("Quote request submitted!");
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
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
            Get a Quote
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-1px", color: "#fff", marginBottom: "16px" }}>
            Tell Us About Your Project
          </h1>
          <p style={{ color: "#777", fontSize: "16px", lineHeight: 1.7 }}>
            We respond within one business day. For emergency overnight installs, call us directly.
          </p>
        </div>

        {done ? (
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderLeft: "4px solid #e53e3e", borderRadius: "4px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>Quote Request Received</h2>
            <p style={{ color: "#777" }}>We&apos;ll be in touch within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Scott Low" required />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" required />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Your Company" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Project Type *</label>
                <select style={inputStyle} value={form.projectType} onChange={(e) => set("projectType", e.target.value)} required>
                  <option value="">Select type...</option>
                  {projectTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Sector / Industry</label>
                <select style={inputStyle} value={form.sector} onChange={(e) => set("sector", e.target.value)}>
                  <option value="">Select sector...</option>
                  {sectors.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Budget Range</label>
                <select style={inputStyle} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
                  <option value="">Select budget...</option>
                  {budgets.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Timeline</label>
                <select style={inputStyle} value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                  <option value="">Select timeline...</option>
                  {timelines.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={labelStyle}>Project Description *</label>
              <textarea
                style={{ ...inputStyle, height: "160px", resize: "vertical", fontFamily: "inherit" }}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe your project - dimensions, materials, location, any special requirements..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#555" : "#e53e3e",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "18px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
