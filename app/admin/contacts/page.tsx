"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function ContactsAdminPage() {
  const [selected, setSelected] = useState<Id<"contactSubmissions"> | null>(null);
  const contacts = useQuery(api.contactSubmissions.list, {});
  const markRead = useMutation(api.contactSubmissions.markRead);
  const markReplied = useMutation(api.contactSubmissions.markReplied);

  const selectedContact = contacts?.find((c) => c._id === selected);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "380px", borderRight: "1px solid #1a1a1a", overflowY: "auto", background: "#0a0a0a" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #1a1a1a" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>Contact Messages</h1>
        </div>
        {contacts?.map((c) => (
          <div
            key={c._id}
            onClick={async () => {
              setSelected(c._id as Id<"contactSubmissions">);
              if (!c.read) await markRead({ id: c._id as Id<"contactSubmissions"> });
            }}
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #1a1a1a",
              cursor: "pointer",
              background: selected === c._id ? "#111" : "transparent",
              borderLeft: selected === c._id ? "3px solid #C8A951" : "3px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: c.read ? "#ccc" : "#fff" }}>{c.name}</div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: !c.read ? "#C8A951" : "transparent", alignSelf: "center" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>{c.subject}</div>
            <div style={{ fontSize: "11px", color: "#444" }}>{c.email}</div>
            {c.replied && <div style={{ fontSize: "10px", color: "#38a169", marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>Replied</div>}
          </div>
        ))}
        {contacts?.length === 0 && <div style={{ padding: "40px 24px", color: "#555", fontSize: "14px" }}>No messages yet.</div>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        {!selectedContact ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444" }}>
            Select a message to read
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{selectedContact.name}</h2>
              <div style={{ color: "#666", fontSize: "14px" }}>{selectedContact.email}{selectedContact.phone ? ` - ${selectedContact.phone}` : ""}</div>
            </div>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "12px" }}>{selectedContact.subject}</div>
              <p style={{ color: "#ccc", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedContact.message}</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                onClick={() => markReplied({ id: selectedContact._id as Id<"contactSubmissions"> })}
                style={{
                  display: "inline-block",
                  background: "#C8A951",
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
              {!selectedContact.replied && (
                <button
                  onClick={() => markReplied({ id: selectedContact._id as Id<"contactSubmissions"> })}
                  style={{
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    color: "#666",
                    padding: "12px 24px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Mark as Replied
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
