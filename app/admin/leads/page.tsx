"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

const statusColor: Record<string, string> = {
  new: "#C8A951",
  contacted: "#C8A951",
  qualified: "#3182ce",
  proposal: "#805ad5",
  won: "#38a169",
  lost: "#555",
};

export default function LeadsAdminPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Id<"leads"> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  const leads = useQuery(api.leads.list, { status: filter === "all" ? undefined : filter });
  const createLead = useMutation(api.leads.create);
  const updateLead = useMutation(api.leads.update);
  const deleteLead = useMutation(api.leads.remove);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", source: "",
    status: "new", notes: "", value: "", website: "",
  });

  const selectedLead = leads?.find((l) => l._id === selected);

  function openCreate() {
    setForm({ name: "", email: "", phone: "", company: "", source: "", status: "new", notes: "", value: "", website: "" });
    setEditMode(false);
    setShowForm(true);
  }

  function openEdit(lead: NonNullable<typeof selectedLead>) {
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      source: lead.source ?? "",
      status: lead.status,
      notes: lead.notes ?? "",
      value: lead.value ? String(lead.value) : "",
      website: lead.website ?? "",
    });
    setEditMode(true);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editMode && selected) {
        await updateLead({
          id: selected,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          source: form.source || undefined,
          status: form.status,
          notes: form.notes || undefined,
          value: form.value ? Number(form.value) : undefined,
          website: form.website || undefined,
        });
        toast.success("Lead updated");
      } else {
        const id = await createLead({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          source: form.source || undefined,
          status: form.status,
          notes: form.notes || undefined,
          value: form.value ? Number(form.value) : undefined,
          website: form.website || undefined,
        });
        setSelected(id);
        toast.success("Lead created");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save lead");
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLead({ id: selected });
      setSelected(null);
      toast.success("Lead deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleStatus(id: Id<"leads">, status: string) {
    try {
      await updateLead({ id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead) return;
    setSending(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedLead.email,
          subject: replySubject,
          body: replyBody,
          sourceType: "lead",
          sourceId: selectedLead._id,
        }),
      });
      toast.success("Email sent");
      setReplyOpen(false);
      setReplySubject("");
      setReplyBody("");
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a",
    borderRadius: "4px", padding: "10px 12px", color: "#f5f5f5",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", color: "#888", fontSize: "11px",
    letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px",
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* List panel */}
      <div style={{ width: "380px", borderRight: "1px solid #1a1a1a", overflowY: "auto", background: "#0a0a0a" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>Leads</h1>
            <button
              onClick={openCreate}
              style={{
                background: "#C8A951", color: "#fff", border: "none", borderRadius: "4px",
                padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                letterSpacing: "1px",
              }}
            >
              + ADD LEAD
            </button>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["all", "new", "contacted", "qualified", "proposal", "won", "lost"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? "#C8A951" : "transparent",
                  color: filter === s ? "#fff" : "#666",
                  border: `1px solid ${filter === s ? "#C8A951" : "#2a2a2a"}`,
                  borderRadius: "3px", padding: "5px 12px", fontSize: "11px",
                  textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {leads === undefined && (
          <div style={{ padding: "24px", color: "#555", fontSize: "14px" }}>Loading...</div>
        )}
        {leads?.length === 0 && (
          <div style={{ padding: "24px", color: "#555", fontSize: "14px" }}>No leads found.</div>
        )}
        {leads?.map((lead) => (
          <div
            key={lead._id}
            onClick={() => setSelected(lead._id)}
            style={{
              padding: "20px 24px", borderBottom: "1px solid #111", cursor: "pointer",
              background: selected === lead._id ? "#1a1a1a" : "transparent",
              borderLeft: `3px solid ${selected === lead._id ? "#C8A951" : "transparent"}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 600, color: "#f5f5f5", fontSize: "14px" }}>{lead.name}</div>
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                color: statusColor[lead.status] ?? "#555",
                border: `1px solid ${statusColor[lead.status] ?? "#555"}`,
                borderRadius: "3px", padding: "2px 8px",
              }}>
                {lead.status}
              </span>
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{lead.email}</div>
            {lead.company && <div style={{ color: "#555", fontSize: "12px", marginTop: "2px" }}>{lead.company}</div>}
            {lead.value && (
              <div style={{ color: "#38a169", fontSize: "12px", marginTop: "4px", fontWeight: 600 }}>
                ${lead.value.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px", background: "#0d0d0d" }}>
        {!selectedLead ? (
          <div style={{ color: "#555", fontSize: "14px", marginTop: "40px", textAlign: "center" }}>
            Select a lead or click &ldquo;+ Add Lead&rdquo; to get started
          </div>
        ) : (
          <div style={{ maxWidth: "720px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>{selectedLead.name}</h2>
                {selectedLead.company && <div style={{ color: "#888", fontSize: "15px" }}>{selectedLead.company}</div>}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => openEdit(selectedLead)} style={{ background: "transparent", color: "#888", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "8px 16px", fontSize: "12px", cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => setReplyOpen(true)} style={{ background: "#C8A951", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Send Email
                </button>
                <button onClick={handleDelete} style={{ background: "transparent", color: "#C8A951", border: "1px solid #C8A951", borderRadius: "4px", padding: "8px 16px", fontSize: "12px", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#C8A951", marginBottom: "16px", textTransform: "uppercase" }}>Contact Info</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Email</div>
                  <div style={{ color: "#f5f5f5", fontSize: "14px" }}>{selectedLead.email}</div>
                </div>
                {selectedLead.phone && (
                  <div>
                    <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Phone</div>
                    <div style={{ color: "#f5f5f5", fontSize: "14px" }}>{selectedLead.phone}</div>
                  </div>
                )}
                {selectedLead.website && (
                  <div>
                    <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Website</div>
                    <a href={selectedLead.website} target="_blank" rel="noreferrer" style={{ color: "#3182ce", fontSize: "14px" }}>{selectedLead.website}</a>
                  </div>
                )}
                {selectedLead.source && (
                  <div>
                    <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Source</div>
                    <div style={{ color: "#f5f5f5", fontSize: "14px" }}>{selectedLead.source}</div>
                  </div>
                )}
                {selectedLead.value && (
                  <div>
                    <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Est. Value</div>
                    <div style={{ color: "#38a169", fontSize: "14px", fontWeight: 700 }}>${selectedLead.value.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#C8A951", marginBottom: "16px", textTransform: "uppercase" }}>Pipeline Stage</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["new", "contacted", "qualified", "proposal", "won", "lost"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatus(selectedLead._id, s)}
                    style={{
                      background: selectedLead.status === s ? statusColor[s] : "transparent",
                      color: selectedLead.status === s ? "#fff" : "#666",
                      border: `1px solid ${selectedLead.status === s ? statusColor[s] : "#2a2a2a"}`,
                      borderRadius: "3px", padding: "6px 14px", fontSize: "11px",
                      textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {selectedLead.notes && (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#C8A951", marginBottom: "16px", textTransform: "uppercase" }}>Notes</div>
                <p style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedLead.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Lead Modal */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "40px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "24px" }}>
              {editMode ? "Edit Lead" : "Add New Lead"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {([
                  { label: "Name *", key: "name", required: true, span: false },
                  { label: "Email *", key: "email", required: true, type: "email", span: false },
                  { label: "Phone", key: "phone", span: false },
                  { label: "Company", key: "company", span: false },
                  { label: "Source (e.g. Referral)", key: "source", span: false },
                  { label: "Est. Value ($)", key: "value", type: "number", span: false },
                  { label: "Website", key: "website", span: false },
                ] as Array<{ label: string; key: string; required?: boolean; type?: string; span: boolean }>).map(({ label, key, required, type }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type ?? "text"}
                      required={required}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {["new", "contacted", "qualified", "proposal", "won", "lost"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button type="submit" style={{ flex: 1, background: "#C8A951", color: "#fff", border: "none", borderRadius: "4px", padding: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  {editMode ? "Save Changes" : "Add Lead"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#888", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "12px 24px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {replyOpen && selectedLead && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => setReplyOpen(false)}
        >
          <div
            style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "40px", width: "100%", maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Email {selectedLead.name}</h2>
            <div style={{ color: "#666", fontSize: "13px", marginBottom: "24px" }}>{selectedLead.email}</div>
            <form onSubmit={handleSendEmail}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Subject</label>
                <input type="text" required value={replySubject} onChange={(e) => setReplySubject(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Message</label>
                <textarea required rows={8} value={replyBody} onChange={(e) => setReplyBody(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" disabled={sending} style={{ flex: 1, background: "#C8A951", color: "#fff", border: "none", borderRadius: "4px", padding: "12px", fontSize: "14px", fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1 }}>
                  {sending ? "Sending..." : "Send Email"}
                </button>
                <button type="button" onClick={() => setReplyOpen(false)} style={{ background: "transparent", color: "#888", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "12px 24px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
