"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Plus, X, ImagePlus, Star, Eye, EyeOff, Edit, Trash } from "lucide-react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface AdminProductsClientProps {
  categories: Category[];
  initialProducts: any[];
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  padding: "10px 12px",
  background: "var(--bg)",
  fontSize: 14,
  color: "var(--ink)",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
};

export function AdminProductsClient({ categories, initialProducts }: AdminProductsClientProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<ProductImage[]>([{ url: "", alt: "", isPrimary: true }]);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Product name is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0)
      e.price = "Enter a valid price (e.g. 499).";
    if (!categoryId) e.categoryId = "Select a category.";
    const validImages = images.filter((i) => i.url.trim());
    if (validImages.length === 0) e.images = "Add at least one image URL.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addImage = () => setImages((prev) => [...prev, { url: "", alt: "", isPrimary: false }]);

  const removeImage = (idx: number) =>
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (prev[idx].isPrimary && next.length > 0) next[0].isPrimary = true;
      return next;
    });

  const updateImage = (idx: number, field: keyof ProductImage, value: string | boolean) =>
    setImages((prev) =>
      prev.map((img, i) => {
        if (i !== idx) return field === "isPrimary" && value ? { ...img, isPrimary: false } : img;
        return { ...img, [field]: value };
      })
    );

  const setPrimary = (idx: number) =>
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === idx })));

  const handleFileUpload = async (idx: number, file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateImage(idx, "url", data.url);
      if (!images[idx].alt) {
        updateImage(idx, "alt", name || file.name);
      }
    } catch {
      toast("Image upload failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const validImages = images
        .filter((i) => i.url.trim())
        .map((img, idx) => ({ ...img, position: idx }));

      const method = editingId ? "PUT" : "POST";
      const payload = { id: editingId, name, description, price, categoryId, isFeatured, isActive, images: validImages };

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast(editingId ? "Product updated successfully!" : "Product created successfully!", "success");
        router.refresh();
        cancelEdit();
      } else {
        const data = await res.json();
        toast(data.error ?? "Failed to save product.", "error");
      }
    } catch {
      toast("Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setCategoryId(prod.categoryId);
    setIsFeatured(prod.isFeatured);
    setIsActive(prod.isActive);
    if (prod.images && prod.images.length > 0) {
      setImages(
        prod.images
          .sort((a: any, b: any) => a.position - b.position)
          .map((i: any) => ({ url: i.url, alt: i.alt, isPrimary: i.isPrimary }))
      );
    } else {
      setImages([{ url: "", alt: "", isPrimary: true }]);
    }
    window.scrollTo({ top: document.getElementById("product-form")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId(categories[0]?.id ?? "");
    setIsFeatured(false);
    setIsActive(true);
    setImages([{ url: "", alt: "", isPrimary: true }]);
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Product deleted", "success");
        router.refresh();
        if (editingId === id) cancelEdit();
      } else {
        toast("Failed to delete", "error");
      }
    } catch {
      toast("Error deleting product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* Existing Products List */}
      <div className="box" style={{ overflowX: "auto" }}>
        <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Existing Products ({initialProducts.length})</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
              <th style={{ padding: "12px 8px" }}>Image</th>
              <th style={{ padding: "12px 8px" }}>Name</th>
              <th style={{ padding: "12px 8px" }}>Price</th>
              <th style={{ padding: "12px 8px" }}>Status</th>
              <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialProducts.map((p) => {
              const primaryImg = p.images?.find((i: any) => i.isPrimary) || p.images?.[0];
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "8px" }}>
                    <div style={{ width: 40, height: 40, background: "#eee", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                      {primaryImg && <Image src={primaryImg.url} alt={primaryImg.alt} fill style={{ objectFit: "cover" }} />}
                    </div>
                  </td>
                  <td style={{ padding: "8px", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: "8px" }}>₹{Number(p.price)}</td>
                  <td style={{ padding: "8px" }}>
                    <span style={{ 
                      background: p.isActive ? "var(--mint)" : "var(--surface)", 
                      color: p.isActive ? "#fff" : "var(--mute)", 
                      padding: "4px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700 
                    }}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    <button onClick={() => handleEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pri)", marginRight: 12 }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {initialProducts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "var(--mute)" }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div id="product-form" style={{ maxWidth: 720, background: editingId ? "color-mix(in srgb, var(--pri) 5%, transparent)" : "transparent", padding: editingId ? 20 : 0, borderRadius: 16 }}>
        <h2 className="text-section" style={{ marginBottom: 16 }}>
          {editingId ? `Editing: ${name}` : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Basic info */}
          <div className="box" style={{ marginBottom: 16 }}>
            <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Basic info</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <label style={labelStyle}>
                Product name *
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Teddy Bear Amigurumi"
                  style={{ ...inputStyle, borderColor: errors.name ? "var(--pink)" : undefined }}
                />
                {errors.name && <span style={{ color: "var(--pink)", fontSize: 12, fontWeight: 400 }}>{errors.name}</span>}
              </label>

              <label style={labelStyle}>
                Category *
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.categoryId ? "var(--pink)" : undefined }}
                >
                  {categories.length === 0 && <option value="">No categories found</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <span style={{ color: "var(--pink)", fontSize: 12, fontWeight: 400 }}>{errors.categoryId}</span>}
              </label>

              <label style={labelStyle}>
                Price (₹) *
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 499"
                  style={{ ...inputStyle, borderColor: errors.price ? "var(--pink)" : undefined }}
                />
                {errors.price && <span style={{ color: "var(--pink)", fontSize: 12, fontWeight: 400 }}>{errors.price}</span>}
              </label>

              <label style={labelStyle}>
                Description *
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product — materials, size, customisation options..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", borderColor: errors.description ? "var(--pink)" : undefined }}
                />
                {errors.description && <span style={{ color: "var(--pink)", fontSize: 12, fontWeight: 400 }}>{errors.description}</span>}
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="box" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 className="text-box-h2">Images</h2>
              <button type="button" className="btn btn-sm btn-alt" onClick={addImage}>
                <Plus size={14} /> Add image
              </button>
            </div>

            {errors.images && (
              <p style={{ color: "var(--pink)", fontSize: 12, marginBottom: 12 }}>{errors.images}</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    border: `1.5px solid ${img.isPrimary ? "var(--pri)" : "var(--line)"}`,
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    background: img.isPrimary ? "color-mix(in srgb, var(--pri) 6%, var(--bg))" : "var(--bg)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ImagePlus size={15} style={{ color: "var(--mute)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                      Image {idx + 1}{img.isPrimary && <span style={{ color: "var(--pri)", marginLeft: 6 }}>· Primary</span>}
                    </span>
                    <button
                      type="button"
                      title="Set as primary"
                      onClick={() => setPrimary(idx)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: img.isPrimary ? "var(--pri)" : "var(--mute)", padding: 4 }}
                    >
                      <Star size={15} fill={img.isPrimary ? "currentColor" : "none"} />
                    </button>
                    {images.length > 1 && (
                      <button type="button" onClick={() => removeImage(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mute)", padding: 4 }}>
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        placeholder="Image URL or upload file..."
                        value={img.url}
                        onChange={(e) => updateImage(idx, "url", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <label style={{ 
                      background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, 
                      padding: "10px 14px", cursor: "pointer", fontSize: 14, fontWeight: 500, flexShrink: 0 
                    }}>
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(idx, e.target.files[0]);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  
                  {img.url && (
                    <div style={{ height: 100, width: 100, position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
                      <Image src={img.url} alt="Preview" fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                  )}

                  <input
                    placeholder="Alt text (e.g. Teddy bear in pink yarn)"
                    value={img.alt}
                    onChange={(e) => updateImage(idx, "alt", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="box" style={{ marginBottom: 24 }}>
            <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Visibility</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: isActive ? "color-mix(in srgb, var(--pri) 10%, var(--bg))" : "var(--surface)",
                  border: `1.5px solid ${isActive ? "var(--pri)" : "var(--line)"}`,
                  borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                  textAlign: "left", fontFamily: "inherit",
                }}
              >
                {isActive ? <Eye size={16} style={{ color: "var(--pri)" }} /> : <EyeOff size={16} style={{ color: "var(--mute)" }} />}
                <span style={{ flex: 1 }}>
                  <b style={{ display: "block", fontSize: 14, color: isActive ? "var(--pri)" : "var(--ink)" }}>
                    {isActive ? "Active — visible in shop" : "Inactive — hidden from shop"}
                  </b>
                  <small style={{ color: "var(--mute)" }}>Click to toggle</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsFeatured((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: isFeatured ? "color-mix(in srgb, var(--pink) 10%, var(--bg))" : "var(--surface)",
                  border: `1.5px solid ${isFeatured ? "var(--pink)" : "var(--line)"}`,
                  borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                  textAlign: "left", fontFamily: "inherit",
                }}
              >
                <Star size={16} fill={isFeatured ? "currentColor" : "none"} style={{ color: isFeatured ? "var(--pink)" : "var(--mute)" }} />
                <span style={{ flex: 1 }}>
                  <b style={{ display: "block", fontSize: 14, color: isFeatured ? "var(--pink)" : "var(--ink)" }}>
                    {isFeatured ? "Featured — shown on homepage" : "Not featured"}
                  </b>
                  <small style={{ color: "var(--mute)" }}>Click to toggle</small>
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn" disabled={loading} style={{ flex: 1, fontSize: 15, padding: "14px" }}>
              {loading ? "Saving…" : editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn btn-alt" style={{ padding: "14px" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
