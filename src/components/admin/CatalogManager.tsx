"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { compressImageToWebP } from "@/lib/imageCompression";

type CatalogType = "occasion" | "entertainment";

interface CatalogImage {
  url: string;
  public_id?: string;
  alt?: string;
  title?: string;
}

interface CatalogItem {
  _id?: string;
  type: CatalogType;
  title: string;
  slug: string;
  description: string;
  coverImage: CatalogImage;
  images: CatalogImage[];
  order: number;
  isActive: boolean;
}

const TYPE_LABELS: Record<CatalogType, string> = {
  occasion: "Occasion",
  entertainment: "Entertainment",
};

const emptyItem = (type: CatalogType, order: number): CatalogItem => ({
  type,
  title: "",
  slug: "",
  description: "",
  coverImage: { url: "", public_id: "", alt: "" },
  images: [],
  order,
  isActive: true,
});

async function uploadImage(file: File): Promise<CatalogImage | null> {
  const webpFile = await compressImageToWebP(file, 1600);
  const formData = new FormData();
  formData.append("file", webpFile);
  formData.append("folder", "riwaj_events/catalog");
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success || !data.data?.url) {
    throw new Error(data.message || "Upload failed");
  }
  return { url: data.data.url, public_id: data.data.public_id || "", alt: "" };
}

// Deletes photos from Cloudinary that were uploaded in the form but never saved.
function discardUploads(images: CatalogImage[]) {
  for (const image of images) {
    const query = image.public_id
      ? `public_id=${encodeURIComponent(image.public_id)}`
      : `url=${encodeURIComponent(image.url)}`;
    fetch(`/api/upload?${query}`, { method: "DELETE" }).catch(() => {});
  }
}

export default function CatalogManager({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | CatalogType>("all");
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  // Photos uploaded since the form was opened. Saved photos are cleaned up by
  // the API; these exist only in Cloudinary until the item is saved.
  const sessionUploads = useRef<CatalogImage[]>([]);
  // Changes each time the form opens or closes, so an upload that finishes
  // after the form was closed can be recognised and deleted.
  const formSession = useRef(0);

  const startSession = () => {
    formSession.current += 1;
    sessionUploads.current = [];
  };

  // Closes the form. `kept` is the saved item, or null when cancelling.
  const closeEditor = (kept: CatalogItem | null) => {
    const keptUrls = new Set(kept ? [kept.coverImage?.url, ...kept.images.map((image) => image.url)] : []);
    discardUploads(sessionUploads.current.filter((image) => !keptUrls.has(image.url)));
    startSession();
    setEditing(null);
  };

  const load = async () => {
    try {
      const res = await fetch("/api/admin/catalog");
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        onCountChange?.((data.items || []).length);
      }
    } catch (err) {
      console.error("Error fetching catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.type === filter)),
    [items, filter]
  );

  const openNew = (type: CatalogType) => {
    const sameType = items.filter((item) => item.type === type);
    const nextOrder = sameType.reduce((max, item) => Math.max(max, item.order), 0) + 1;
    setError("");
    startSession();
    setEditing(emptyItem(type, nextOrder));
  };

  const openEdit = (item: CatalogItem) => {
    setError("");
    startSession();
    setEditing({
      ...emptyItem(item.type, item.order),
      ...item,
      coverImage: item.coverImage || { url: "" },
      images: item.images || [],
    });
  };

  const save = async (item: CatalogItem) => {
    const res = await fetch("/api/admin/catalog", {
      method: item._id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item._id ? { ...item, id: item._id } : item),
    });
    return res.json();
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = await save(editing);
      if (!data.success) {
        setError(data.message || "Could not save this item.");
        return;
      }
      closeEditor(editing);
      await load();
    } catch {
      setError("Could not save this item. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: CatalogItem) => {
    if (!item._id) return;
    if (!confirm(`Delete "${item.title}" and all its photos? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/catalog?id=${item._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Could not delete this item.");
      return;
    }
    await load();
  };

  const handleToggle = async (item: CatalogItem) => {
    const data = await save({ ...item, isActive: !item.isActive });
    if (!data.success) alert(data.message || "Could not update this item.");
    await load();
  };

  // Swaps display order with the neighbouring item of the same type.
  const handleMove = async (item: CatalogItem, direction: -1 | 1) => {
    const sameType = items
      .filter((other) => other.type === item.type)
      .sort((a, b) => a.order - b.order);
    const index = sameType.findIndex((other) => other._id === item._id);
    const neighbour = sameType[index + direction];
    if (!neighbour) return;

    const renumbered = sameType.map((other, i) => ({ ...other, order: i + 1 }));
    renumbered[index].order = index + direction + 1;
    renumbered[index + direction].order = index + 1;
    await Promise.all(
      renumbered.filter((other, i) => other.order !== sameType[i].order).map((other) => save(other))
    );
    await load();
  };

  const handleCoverUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !editing) return;
    const session = formSession.current;
    setUploadStatus("Uploading cover photo...");
    try {
      const image = await uploadImage(file);
      if (image && session !== formSession.current) discardUploads([image]);
      else if (image) {
        sessionUploads.current.push(image);
        setEditing((prev) => (prev ? { ...prev, coverImage: image } : prev));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadStatus("");
      if (coverInput.current) coverInput.current.value = "";
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    const list = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (list.length === 0 || !editing) return;
    const session = formSession.current;
    const uploaded: CatalogImage[] = [];
    for (let i = 0; i < list.length; i++) {
      if (session !== formSession.current) break;
      setUploadStatus(`Uploading photo ${i + 1} of ${list.length}...`);
      try {
        const image = await uploadImage(list[i]);
        if (image) uploaded.push(image);
      } catch (err) {
        setError(`${list[i].name}: ${(err as Error).message}`);
      }
    }
    if (session !== formSession.current) {
      discardUploads(uploaded);
    } else {
      sessionUploads.current.push(...uploaded);
      setEditing((prev) => (prev ? { ...prev, images: [...prev.images, ...uploaded] } : prev));
    }
    setUploadStatus("");
    if (galleryInput.current) galleryInput.current.value = "";
  };

  const removeGalleryImage = (index: number) =>
    setEditing((prev) => (prev ? { ...prev, images: prev.images.filter((_, i) => i !== index) } : prev));

  const setGalleryTitle = (index: number, title: string) =>
    setEditing((prev) =>
      prev ? { ...prev, images: prev.images.map((image, i) => (i === index ? { ...image, title } : image)) } : prev
    );

  const coverOf = (item: CatalogItem) => item.coverImage?.url || item.images?.[0]?.url || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Catalog</h2>
          <p className="text-sm text-gray-500">
            Occasions and entertainment shown on the{" "}
            <a href="/catalog" target="_blank" className="font-semibold text-rose-600 hover:underline">
              /catalog page
            </a>
            . Hidden items stay saved but don&apos;t appear on the website.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openNew("occasion")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <Plus className="h-4 w-4" /> Occasion
          </button>
          <button
            onClick={() => openNew("entertainment")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" /> Entertainment
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "occasion", "entertainment"] as const).map((key) => {
          const count = key === "all" ? items.length : items.filter((item) => item.type === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                filter === key ? "bg-rose-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {key === "all" ? "All" : TYPE_LABELS[key]} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-semibold text-gray-700">No catalog items yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add occasions like Wedding, Haldi or Sangeet, and entertainment like DJ, Dhol or Anchor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible
            .slice()
            .sort((a, b) => (a.type === b.type ? a.order - b.order : a.type.localeCompare(b.type)))
            .map((item) => (
              <div
                key={item._id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${item.isActive ? "border-gray-200" : "border-dashed border-gray-300 opacity-60"}`}
              >
                <div className="relative h-40 bg-gray-100">
                  {coverOf(item) ? (
                    <Image src={coverOf(item)} alt={item.title} fill sizes="400px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">No photo yet</div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                    {TYPE_LABELS[item.type]}
                  </span>
                  {!item.isActive && (
                    <span className="absolute right-2 top-2 rounded-full bg-gray-900/80 px-2.5 py-0.5 text-xs font-semibold text-white">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">
                    {item.images?.length || 0} photos · /catalog/{item.slug}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => handleToggle(item)} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200">
                      {item.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {item.isActive ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => handleMove(item, -1)} className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200" aria-label="Move earlier">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleMove(item, 1)} className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200" aria-label="Move later">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    {item.isActive && (
                      <a href={`/catalog/${item.slug}`} target="_blank" className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200" aria-label="View on website">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button onClick={() => handleDelete(item)} className="ml-auto rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editing._id ? "Edit" : "New"} {TYPE_LABELS[editing.type].toLowerCase()}
              </h3>
              <button onClick={() => closeEditor(null)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Title *</span>
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder={editing.type === "occasion" ? "e.g. Haldi" : "e.g. Dhol"}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Section</span>
                  <select
                    value={editing.type}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value as CatalogType })}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                  >
                    <option value="occasion">Occasion (tall photo card)</option>
                    <option value="entertainment">Entertainment (small tile)</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Short description</span>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  placeholder="Shown under the title on this item's photo page"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Page address (optional)</span>
                <div className="mt-1 flex items-center rounded-xl border border-gray-300 text-sm focus-within:border-rose-500">
                  <span className="pl-3 text-gray-400">/catalog/</span>
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="made from the title if left empty"
                    className="w-full rounded-r-xl px-1 py-2 focus:outline-none"
                  />
                </div>
              </label>

              <div>
                <span className="text-sm font-medium text-gray-700">Cover photo</span>
                <p className="text-xs text-gray-500">Shown on the catalog card. If empty, the first gallery photo is used.</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-gray-100">
                    {editing.coverImage?.url ? (
                      <Image src={editing.coverImage.url} alt="Cover" fill sizes="80px" className="object-cover" />
                    ) : (
                      <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverUpload(e.target.files)} />
                  <button
                    type="button"
                    onClick={() => coverInput.current?.click()}
                    disabled={!!uploadStatus}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" /> {editing.coverImage?.url ? "Change" : "Upload"}
                  </button>
                  {editing.coverImage?.url && (
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, coverImage: { url: "", public_id: "", alt: "" } })}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Gallery photos ({editing.images.length})</span>
                  <input ref={galleryInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleGalleryUpload(e.target.files)} />
                  <button
                    type="button"
                    onClick={() => galleryInput.current?.click()}
                    disabled={!!uploadStatus}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" /> Add photos
                  </button>
                </div>
                {editing.images.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {editing.images.map((image, index) => (
                      <div key={`${image.url}-${index}`}>
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                          <Image src={image.url} alt="" fill sizes="200px" className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-red-600"
                            aria-label="Remove photo"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input
                          value={image.title || ""}
                          onChange={(e) => setGalleryTitle(index, e.target.value)}
                          maxLength={120}
                          placeholder="Photo title (optional)"
                          aria-label={`Title for photo ${index + 1}`}
                          className="mt-1.5 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">No photos yet. You can select several at once, then give each one a title.</p>
                )}
              </div>

              {uploadStatus && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> {uploadStatus}
                </p>
              )}
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="h-4 w-4 accent-rose-600"
                />
                Show on website
              </label>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-5 py-4">
              <button onClick={() => closeEditor(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !!uploadStatus}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
