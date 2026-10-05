"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Plus, X, ImagePlus, Star, Eye, EyeOff } from "lucide-react";

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

export function AdminProductsClient({ categories }: AdminProductsClientProps) {
  const { toast } = useToast();
  const router = useRouter();

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

  const addImage = () =>
    setImages((prev) => [...prev, { url: "", alt: "", isPrimary: false }]);

  const removeImage = (idx: number) =>
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // If we removed the primary, make first one primary
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const validImages = images
        .filter((i) => i.url.trim())
        .map((img, idx) => ({ ...img, position: idx }));

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, categoryId, isFeatured, isActive, images: validImages }),
      });

      if (res.ok) {
        toast("Product created successfully!", "success");
        router.refresh();
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId(categories[0]?.id ?? "");
        setIsFeatured(false);
        setIsActive(true);
        setImages([{ url: "", alt: "", isPrimary: true }]);
        setErrors({});
      } else {
        const data = await res.json();
        toast(data.error ?? "Failed to create product.", "error");
      }
    } catch {
      toast("Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <form onSubmit={handleSubmit} noValidate>
        {/* Basic info */}
        <div className="box" style={{ marginBottom: 16 }}>
          <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Basic info</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Name */}
            <label style={labelStyle}>
              Product name *
              <input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Teddy Bear Amigurumi"
                style={{ ...inputStyle, borderColor: errors.name ? "var(--pink)" : undefined }}
              />
              {errors.name && <span style={{ color: "var(--pink)", fontSize: 12, fontWeight: 400 }}>{errors.name}</span>}
            </label>

            {/* Category */}
            <label style={labelStyle}>
              Category *
              <select
                id="product-category"
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

            {/* Price */}
            <label style={labelStyle}>
              Price (₹) *
              <input
                id="product-price"
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

            {/* Description */}
            <label style={labelStyle}>
              Description *
              <textarea
                id="product-description"
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
            <button type="button" className="btn btn-sm btn-alt" onClick={addImage} id="add-image-btn">
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
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: img.isPrimary ? "var(--pri)" : "var(--mute)", padding: 4,
                    }}
                  >
                    <Star size={15} fill={img.isPrimary ? "currentColor" : "none"} />
                  </button>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mute)", padding: 4 }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <input
                  placeholder="Image URL (Cloudinary, https://...)"
                  value={img.url}
                  onChange={(e) => updateImage(idx, "url", e.target.value)}
                  style={inputStyle}
                  id={`image-url-${idx}`}
                />
                <input
                  placeholder="Alt text (e.g. Teddy bear in pink yarn)"
                  value={img.alt}
                  onChange={(e) => updateImage(idx, "alt", e.target.value)}
                  style={inputStyle}
                  id={`image-alt-${idx}`}
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
              id="toggle-active"
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
              id="toggle-featured"
              onClick={() => setIsFeatured((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: isFeatured ? "color-mix(in srgb, var(--pink) 10%, var(--bg))" : "var(--surface)",
                border: `1.5px solid ${isFeatured ? "var(--pink)" : "var(--line)"}`,
                borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                textAlign: "left", fontFamily: "inherit",
              }}
            >
              <Star
                size={16}
                fill={isFeatured ? "currentColor" : "none"}
                style={{ color: isFeatured ? "var(--pink)" : "var(--mute)" }}
              />
              <span style={{ flex: 1 }}>
                <b style={{ display: "block", fontSize: 14, color: isFeatured ? "var(--pink)" : "var(--ink)" }}>
                  {isFeatured ? "Featured — shown on homepage" : "Not featured"}
                </b>
                <small style={{ color: "var(--mute)" }}>Click to toggle</small>
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          id="create-product-btn"
          disabled={loading}
          style={{ width: "100%", fontSize: 15, padding: "14px" }}
        >
          {loading ? "Creating…" : "Create product"}
        </button>
      </form>
    </div>
  );
}
