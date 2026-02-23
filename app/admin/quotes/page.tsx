"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

const statuses = ["all", "new", "reviewing", "quoted", "won", "lost"];

export default function QuotesAdminPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Id<"quoteRequests"> | null>(null);
  const quotes = useQuery(api.quoteRequests.list, { status: filter === "all" ? undefined : filter });
  const updateStatus = useMutation(api.quoteRequests.updateStatus);
  const markRead = useMutation(api.quoteRequests.markRead);

  const selectedQuote = quotes?.find((q) => q._id === selected);

  async function handleStatus(id: Id<"quoteRequests">, status: string) {
    try {
      await updateStatus({ id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  }

  const statusColor: Record<string, string> = {
    new: "#e53e3e", reviewing: "#d69e2e", quoted: "#3182ce", won: "#38a169", lost: "#555",
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* List */}
      <div style={{ width: "380px", borderRight: "1px solid #1a1a1a", overflowY: "auto", background: "#0a0a0a" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #1a1a1a" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Quote Requests</h1>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? "#e53e3e" : "transparent",
                  color: filter === s ? "#fff" : "#666",
                  border: `1px solid ${filter === s ? "#e53e3e" : "#2a2a2a"}`,
                  borderRadius: "3px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          {quotes?.map((q) => (
            <div
              key={q._id}
              onClick={async () => {
                setSelected(q._id);
                if (!q.read) await markRead({ id: q._id });
              }}
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #1a1a1a",
                cursor: "pointer",
                background: selected === q._id ? "#111" : "transparent",
                borderLeft: selected === q._id ? "3px solid #e53e3e" : "3px solid transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: q.read ? "#ccc" : "#fff" }}>{q.name}</div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: !q.read ? "#e53e3e" : "transparent", alignSelf: "center" }} />
              </div>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{q.projectType} {q.company ? `- ${q.company}` : ""}</div>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: statusColor[q.status] ?? "#666",
                  borderRadius: "3px",
                  padding: "2px 8px",
                  background: `${statusColor[q.status]}20`,
                }}
              >
                {q.status}
              </div>
            </div>
          ))}
          {quotes?.length === 0 && <div style={{ padding: "40px 24px", color: "#555", fontSize: "14px" }}>No quotes found.</div>}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        {!selectedQuote ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444" }}>
            Select a quote request to view details
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "32px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{selectedQuote.name}</h2>
                <div style={{ color: "#666", fontSize: "14px" }}>{selectedQuote.email} {selectedQuote.phone ? `- ${selectedQuote.phone}` : ""}</div>
              </div>
              <select
                value={selectedQuote.status}
                onChange={(e) => handleStatus(selectedQuote._id, e.target.value)}
                style={{
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: "4px",
                  color: "#fff",
                  padding: "8px 12px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {["new", "reviewing", "quoted", "won", "lost"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {[
                { label: "Company", value: selectedQuote.company },
                { label: "Project Type", value: selectedQuote.projectType },
                { label: "Sector", value: selectedQuote.sector },
                { label: "Budget", value: selectedQuote.budget },
                { label: "Timeline", value: selectedQuote.timeline },
              ].filter((f) => f.value).map((f) => (
                <div key={f.label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "6px" }}>{f.label}</div>
                  <div style={{ color: "#ccc", fontSize: "14px" }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "12px" }}>Description</div>
              <p style={{ color: "#ccc", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedQuote.description}</p>
            </div>

            <a
              href={`mailto:${selectedQuote.email}?subject=Re: Your Quote Request - Low's Custom Stainless`}
              style={{
                display: "inline-block",
                background: "#e53e3e",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Reply by Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
