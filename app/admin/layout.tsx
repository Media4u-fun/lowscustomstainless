"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderImage, MessageSquare, FileText,
  ShoppingBag, Package, Users, Mail, Settings, BarChart3, UserPlus,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: BarChart3 },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderImage },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#111",
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "2px", color: "#fff", textTransform: "uppercase" }}>
            Low&apos;s Custom Stainless
          </div>
          <div style={{ fontSize: "10px", color: "#e53e3e", letterSpacing: "2px", marginTop: "2px" }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map((item) => {
            const active = item.exact ? path === item.href : path.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "4px",
                  marginBottom: "2px",
                  textDecoration: "none",
                  background: active ? "rgba(229,62,62,0.1)" : "transparent",
                  color: active ? "#e53e3e" : "#666",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                  borderLeft: active ? "2px solid #e53e3e" : "2px solid transparent",
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a" }}>
          <Link
            href="/"
            style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}
          >
            View Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: "240px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
