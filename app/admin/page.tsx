"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { FileText, MessageSquare, BarChart3, ShoppingBag, Package, Image } from "lucide-react";

export default function AdminDashboard() {
  const quotes = useQuery(api.quoteRequests.list, {});
  const contacts = useQuery(api.contactSubmissions.list, {});
  const products = useQuery(api.products.list, {});
  const orders = useQuery(api.orders.list, {});
  const leads = useQuery(api.leads.list, {});
  const portfolio = useQuery(api.portfolio.list, {});

  const newQuotes = quotes?.filter((q) => q.status === "new").length ?? 0;
  const unreadContacts = contacts?.filter((c) => !c.read).length ?? 0;
  const newLeads = leads?.filter((l) => l.status === "new").length ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length ?? 0;

  const cards = [
    { label: "New Quotes", value: newQuotes, href: "/admin/quotes", color: "#C8A951", Icon: FileText },
    { label: "Unread Contacts", value: unreadContacts, href: "/admin/contacts", color: "#C8A951", Icon: MessageSquare },
    { label: "New Leads", value: newLeads, href: "/admin/leads", color: "#3182ce", Icon: BarChart3 },
    { label: "Pending Orders", value: pendingOrders, href: "/admin/orders", color: "#38a169", Icon: ShoppingBag },
    { label: "Total Products", value: products?.length ?? 0, href: "/admin/products", color: "#805ad5", Icon: Package },
    { label: "Portfolio Items", value: portfolio?.length ?? 0, href: "/admin/portfolio", color: "#319795", Icon: Image },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", marginBottom: "4px" }}>Dashboard</h1>
        <p style={{ color: "#666", fontSize: "14px" }}>Low&apos;s Custom Stainless - Admin Overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "4px",
              padding: "24px",
              textDecoration: "none",
              display: "block",
              borderTop: `3px solid ${c.color}`,
            }}
          >
            <c.Icon size={20} color={c.color} style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", marginBottom: "4px" }}>{c.value}</div>
            <div style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent quotes */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Recent Quotes</h2>
            <Link href="/admin/quotes" style={{ color: "#C8A951", fontSize: "12px", textDecoration: "none" }}>View all</Link>
          </div>
          {quotes?.slice(0, 5).map((q) => (
            <div key={q._id} style={{ padding: "12px 0", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: "#ccc", fontSize: "14px", fontWeight: 600 }}>{q.name}</div>
                <div style={{ color: "#555", fontSize: "12px" }}>{q.projectType}</div>
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "3px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  background: q.status === "new" ? "rgba(200,169,81,0.1)" : "rgba(255,255,255,0.05)",
                  color: q.status === "new" ? "#C8A951" : "#666",
                  alignSelf: "center",
                }}
              >
                {q.status}
              </div>
            </div>
          ))}
          {!quotes?.length && <div style={{ color: "#555", fontSize: "14px" }}>No quotes yet</div>}
        </div>

        {/* Recent contacts */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Recent Contacts</h2>
            <Link href="/admin/contacts" style={{ color: "#C8A951", fontSize: "12px", textDecoration: "none" }}>View all</Link>
          </div>
          {contacts?.slice(0, 5).map((c) => (
            <div key={c._id} style={{ padding: "12px 0", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: "#ccc", fontSize: "14px", fontWeight: 600 }}>{c.name}</div>
                <div style={{ color: "#555", fontSize: "12px" }}>{c.subject}</div>
              </div>
              {!c.read && (
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C8A951", alignSelf: "center" }} />
              )}
            </div>
          ))}
          {!contacts?.length && <div style={{ color: "#555", fontSize: "14px" }}>No contacts yet</div>}
        </div>
      </div>
    </div>
  );
}
