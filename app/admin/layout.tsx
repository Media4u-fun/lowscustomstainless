"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { signOut, useSession } from "@/lib/auth-client";
import {
  LayoutDashboard, Image, MessageSquare, FileText,
  ShoppingBag, Package, Users, Mail, Settings, BarChart3, LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: BarChart3 },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const isAdmin = useQuery(api.auth.isAdmin);

  // Redirect to login if not authenticated (must be before early returns)
  useEffect(() => {
    if (!sessionLoading && !session && path !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [session, sessionLoading, router, path]);

  // Login page gets its own layout — no sidebar, no auth check
  if (path === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state
  if (sessionLoading || isAdmin === undefined) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#C8A951", letterSpacing: "2px", textTransform: "uppercase" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "48px", fontWeight: 900, color: "#C8A951", marginBottom: "16px" }}>403</div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Access Denied</h1>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.7, marginBottom: "32px" }}>
            Your account does not have admin privileges. Contact Scott Low to request access.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/" style={{ color: "#C8A951", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              Back to Site
            </Link>
            <button
              onClick={async () => { await signOut(); router.push("/admin/login"); }}
              style={{ background: "transparent", border: "none", color: "#666", fontSize: "13px", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

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
          <div style={{ fontSize: "10px", color: "#C8A951", letterSpacing: "2px", marginTop: "2px" }}>
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
                  background: active ? "rgba(200,169,81,0.1)" : "transparent",
                  color: active ? "#C8A951" : "#666",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                  borderLeft: active ? "2px solid #C8A951" : "2px solid transparent",
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Sign Out */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session.user.email}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link
              href="/"
              style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}
            >
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: 0 }}
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: "240px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
