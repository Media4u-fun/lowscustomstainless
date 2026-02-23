/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

const sectors = ["dining", "qsr", "stadiums", "corporate", "brewery", "institutional"];

// All photos available in /public/portfolio-photos/
// Add new filenames here when you drop photos into the folder
const availablePhotos = [
  "5.jpg", "photo-1.jpg",
];

export default function PortfolioAdminPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Id<"portfolio"> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [photoPickerTarget, setPhotoPickerTarget] = useState<"cover" | "images" | null>(null);

  const projects = useQuery(api.portfolio.list, { sector: filter === "all" ? undefined : filter });
  const createProject = useMutation(api.portfolio.create);
  const updateProject = useMutation(api.portfolio.update);
  const deleteProject = useMutation(api.portfolio.remove);

  const emptyForm = {
    title: "", slug: "", description: "", sector: "dining",
    clientName: "", location: "", year: "", services: "", materials: "",
    images: [] as string[], coverImage: "", caseStudy: "", featured: false, published: false,
  };
  const [form, setForm] = useState(emptyForm);
  const selectedProject = projects?.find((p) => p._id === selected);

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function openCreate() {
    setForm(emptyForm);
    setEditMode(false);
    setShowForm(true);
  }

  function openEdit(p: NonNullable<typeof selectedProject>) {
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      sector: p.sector,
      clientName: p.clientName,
      location: p.location ?? "",
      year: p.year ? String(p.year) : "",
      services: p.services.join(", "),
      materials: p.materials.join(", "),
      images: p.images,
      coverImage: p.coverImage ?? "",
      caseStudy: p.caseStudy ?? "",
      featured: p.featured,
      published: p.published,
    });
    setEditMode(true);
    setShowForm(true);
  }

  function openPhotoPicker(target: "cover" | "images") {
    setPhotoPickerTarget(target);
    setShowPhotoPicker(true);
  }

  function selectPhoto(filename: string) {
    const path = `/portfolio-photos/${filename}`;
    if (photoPickerTarget === "cover") {
      setForm({ ...form, coverImage: path });
    } else if (photoPickerTarget === "images") {
      if (!form.images.includes(path)) {
        setForm({ ...form, images: [...form.images, path] });
      }
    }
    setShowPhotoPicker(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      sector: form.sector,
      clientName: form.clientName,
      location: form.location || undefined,
      year: form.year ? Number(form.year) : undefined,
      services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
      materials: form.materials.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images,
      coverImage: form.coverImage || undefined,
      caseStudy: form.caseStudy || undefined,
      featured: form.featured,
      published: form.published,
    };
    try {
      if (editMode && selected) {
        await updateProject({ id: selected, ...payload });
        toast.success("Project updated");
      } else {
        const id = await createProject(payload);
        setSelected(id);
        toast.success("Project created");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save project");
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject({ id: selected });
      setSelected(null);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function togglePublished() {
    if (!selectedProject) return;
    try {
      await updateProject({ id: selectedProject._id, published: !selectedProject.published });
      toast.success(selectedProject.published ? "Unpublished" : "Published");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function toggleFeatured() {
    if (!selectedProject) return;
    try {
      await updateProject({ id: selectedProject._id, featured: !selectedProject.featured });
      toast.success(selectedProject.featured ? "Removed from featured" : "Added to featured");
    } catch {
      toast.error("Failed to update");
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
      <div style={{ width: "320px", borderRight: "1px solid #1a1a1a", overflowY: "auto", background: "#0a0a0a" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>Portfolio</h1>
            <button
              onClick={openCreate}
              style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" }}
            >
              + Add Project
            </button>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["all", ...sectors].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? "#e53e3e" : "transparent",
                  color: filter === s ? "#fff" : "#555",
                  border: `1px solid ${filter === s ? "#e53e3e" : "#2a2a2a"}`,
                  borderRadius: "3px", padding: "4px 10px", fontSize: "11px",
                  textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {projects === undefined && <div style={{ padding: "24px", color: "#555" }}>Loading...</div>}
        {projects?.length === 0 && <div style={{ padding: "24px", color: "#555" }}>No projects yet. Add your first one!</div>}
        {projects?.map((p) => (
          <div
            key={p._id}
            onClick={() => setSelected(p._id)}
            style={{
              padding: "0",
              borderBottom: "1px solid #111",
              cursor: "pointer",
              background: selected === p._id ? "#1a1a1a" : "transparent",
              borderLeft: `3px solid ${selected === p._id ? "#e53e3e" : "transparent"}`,
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {/* Thumbnail */}
            <div style={{ width: "60px", height: "60px", flexShrink: 0, background: "#111", overflow: "hidden" }}>
              {p.coverImage ? (
                <img src={p.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "9px", color: "#333", letterSpacing: "1px" }}>NO PHOTO</span>
                </div>
              )}
            </div>
            <div style={{ padding: "12px 12px 12px 0", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ fontWeight: 600, color: "#f5f5f5", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                <span style={{ fontSize: "9px", color: p.published ? "#38a169" : "#555", border: `1px solid ${p.published ? "#38a169" : "#555"}`, borderRadius: "3px", padding: "2px 5px", flexShrink: 0 }}>
                  {p.published ? "LIVE" : "DRAFT"}
                </span>
              </div>
              <div style={{ color: "#555", fontSize: "11px", marginTop: "2px", textTransform: "uppercase", letterSpacing: "1px" }}>{p.sector}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px", background: "#0d0d0d" }}>
        {!selectedProject ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px" }}>
            <div style={{ color: "#333", fontSize: "48px" }}>+</div>
            <div style={{ color: "#555", fontSize: "14px" }}>Select a project or add a new one</div>
            <button
              onClick={openCreate}
              style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" }}
            >
              Add First Project
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: "760px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>{selectedProject.title}</h2>
                <div style={{ color: "#666", fontSize: "14px" }}>{selectedProject.clientName}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => openEdit(selectedProject)} style={{ background: "transparent", color: "#888", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "8px 16px", fontSize: "12px", cursor: "pointer" }}>
                  Edit
                </button>
                <button
                  onClick={toggleFeatured}
                  style={{ background: "transparent", color: selectedProject.featured ? "#d69e2e" : "#555", border: `1px solid ${selectedProject.featured ? "#d69e2e" : "#2a2a2a"}`, borderRadius: "4px", padding: "8px 16px", fontSize: "12px", cursor: "pointer" }}
                >
                  {selectedProject.featured ? "Featured" : "Set Featured"}
                </button>
                <button
                  onClick={togglePublished}
                  style={{ background: selectedProject.published ? "#38a169" : "transparent", color: selectedProject.published ? "#fff" : "#555", border: `1px solid ${selectedProject.published ? "#38a169" : "#2a2a2a"}`, borderRadius: "4px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  {selectedProject.published ? "Live" : "Publish"}
                </button>
                <button onClick={handleDelete} style={{ background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "4px", padding: "8px 16px", fontSize: "12px", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>

            {/* Cover image preview */}
            {selectedProject.coverImage && (
              <div style={{ marginBottom: "24px", borderRadius: "6px", overflow: "hidden", height: "280px" }}>
                <img src={selectedProject.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* Details */}
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "24px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#e53e3e", marginBottom: "16px", textTransform: "uppercase" }}>Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Sector", value: selectedProject.sector },
                  { label: "Year", value: selectedProject.year ?? "-" },
                  { label: "Location", value: selectedProject.location ?? "-" },
                  { label: "Status", value: selectedProject.published ? "Live" : "Draft" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{label}</div>
                    <div style={{ color: "#f5f5f5", fontSize: "14px" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "24px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#e53e3e", marginBottom: "12px", textTransform: "uppercase" }}>Description</div>
              <p style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.7 }}>{selectedProject.description}</p>
            </div>

            {/* Gallery images */}
            {selectedProject.images.length > 0 && (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#e53e3e", marginBottom: "16px", textTransform: "uppercase" }}>Gallery ({selectedProject.images.length} photos)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px" }}>
                  {selectedProject.images.map((img, i) => (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: "4px", overflow: "hidden", background: "#0a0a0a" }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "40px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "28px" }}>
              {editMode ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Project Title *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} style={inputStyle} placeholder="e.g. Yard House Bar Top - Santa Monica" />
                </div>

                <div>
                  <label style={labelStyle}>Client Name *</label>
                  <input type="text" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} style={inputStyle} placeholder="e.g. Yard House" />
                </div>

                <div>
                  <label style={labelStyle}>Sector *</label>
                  <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                    {sectors.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={inputStyle} placeholder="2024" />
                </div>

                <div>
                  <label style={labelStyle}>Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="Los Angeles, CA" />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe the project, what was built, and why it stands out." />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Services Provided (comma separated)</label>
                  <input type="text" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} style={inputStyle} placeholder="M5 Finish, Bar Tops, Installation" />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Materials Used (comma separated)</label>
                  <input type="text" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} style={inputStyle} placeholder="304 Stainless, Copper" />
                </div>

                {/* Cover photo picker */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Cover Photo</label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {form.coverImage && (
                      <div style={{ width: "80px", height: "60px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                        <img src={form.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <button
                        type="button"
                        onClick={() => openPhotoPicker("cover")}
                        style={{ background: "#1a1a1a", border: "1px dashed #3a3a3a", borderRadius: "4px", color: "#888", padding: "10px 16px", fontSize: "13px", cursor: "pointer", width: "100%" }}
                      >
                        {form.coverImage ? "Change Cover Photo" : "Choose Cover Photo from Gallery"}
                      </button>
                      {form.coverImage && (
                        <button type="button" onClick={() => setForm({ ...form, coverImage: "" })} style={{ background: "transparent", border: "none", color: "#e53e3e", fontSize: "12px", cursor: "pointer", marginTop: "6px", padding: 0 }}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gallery photos picker */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Gallery Photos</label>
                  {form.images.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {form.images.map((img, i) => (
                        <div key={i} style={{ position: "relative", width: "70px", height: "70px" }}>
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                            style={{ position: "absolute", top: "-6px", right: "-6px", background: "#e53e3e", border: "none", borderRadius: "50%", color: "#fff", width: "18px", height: "18px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => openPhotoPicker("images")}
                    style={{ background: "#1a1a1a", border: "1px dashed #3a3a3a", borderRadius: "4px", color: "#888", padding: "10px 16px", fontSize: "13px", cursor: "pointer", width: "100%" }}
                  >
                    + Add Photos from Gallery
                  </button>
                </div>

                <div style={{ display: "flex", gap: "24px", gridColumn: "1 / -1" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#ccc", fontSize: "14px" }}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                    Mark as Featured
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#ccc", fontSize: "14px" }}>
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                    Publish (show on site)
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                <button type="submit" style={{ flex: 1, background: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  {editMode ? "Save Changes" : "Add Project"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#888", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "14px 24px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Picker Modal */}
      {showPhotoPicker && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => setShowPhotoPicker(false)}
        >
          <div
            style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "700px", maxHeight: "80vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Choose a Photo</h3>
                <p style={{ color: "#555", fontSize: "13px" }}>
                  {photoPickerTarget === "cover" ? "Select the main cover photo for this project" : "Select photos to add to the gallery"}
                </p>
              </div>
              <button onClick={() => setShowPhotoPicker(false)} style={{ background: "transparent", border: "1px solid #2a2a2a", borderRadius: "4px", color: "#666", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>
                Close
              </button>
            </div>

            {availablePhotos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#555" }}>
                <p style={{ marginBottom: "8px" }}>No photos in the gallery yet.</p>
                <p style={{ fontSize: "12px" }}>Drop photos into the <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "3px" }}>/public/portfolio-photos/</code> folder first.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
                {availablePhotos.map((filename) => {
                  const path = `/portfolio-photos/${filename}`;
                  const alreadySelected = photoPickerTarget === "images" && form.images.includes(path);
                  return (
                    <div
                      key={filename}
                      onClick={() => !alreadySelected && selectPhoto(filename)}
                      style={{
                        aspectRatio: "4/3",
                        borderRadius: "4px",
                        overflow: "hidden",
                        cursor: alreadySelected ? "default" : "pointer",
                        border: alreadySelected ? "2px solid #38a169" : "2px solid transparent",
                        opacity: alreadySelected ? 0.6 : 1,
                        position: "relative",
                      }}
                    >
                      <img src={path} alt={filename} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {alreadySelected && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(56,161,105,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>ADDED</span>
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 8px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", fontSize: "10px", color: "#ccc" }}>
                        {filename}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
