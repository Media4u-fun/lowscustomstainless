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
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e53e3e", textTransform: "uppercase", marginBottom: "16px" }}>
              Contact
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-1px", color: "#fff", marginBottom: "24px" }}>
              Let&apos;s Talk
            </h1>
            <p style={{ color: "#777", fontSize: "16px", lineHeight: 1.8, marginBottom: "48px" }}>
              General inquiries, project questions, or just want to know if we can handle
              your scope - reach out and we&apos;ll get back to you within one business day.
            </p>

            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Email</div>
              <div style={{ color: "#ccc", fontSize: "16px" }}>scott@lowscustomstainless.com</div>
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderLeft: "3px solid #d69e2e", borderRadius: "4px", padding: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "#d69e2e", textTransform: "uppercase", marginBottom: "8px" }}>
                ⚡ Emergency Overnight Install
              </div>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.7 }}>
                Need a same-night crew? Call directly. We mobilize for commercial emergencies
                when restaurants and facilities can&apos;t afford downtime.
              </p>
            </div>
          </div>

          <div>
            {done ? (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderLeft: "4px solid #e53e3e", borderRadius: "4px", padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>Message Received</h2>
                <p style={{ color: "#777" }}>We&apos;ll be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                    background: loading ? "#555" : "#e53e3e",
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
