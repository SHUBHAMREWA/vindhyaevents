import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "riwaj_events_idb_cache";
const DB_VERSION = 2; // Incremented for offline_queue store support
const STORE_SITE_DATA = "site_data";
const STORE_OFFLINE_QUEUE = "offline_queue";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB(): Promise<IDBPDatabase> | null {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains(STORE_SITE_DATA)) {
          db.createObjectStore(STORE_SITE_DATA, { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains(STORE_OFFLINE_QUEUE)) {
          db.createObjectStore(STORE_OFFLINE_QUEUE, { keyPath: "id", autoIncrement: true });
        }
      },
    });
  }

  return dbPromise;
}

/**
 * Cache an item into IndexedDB with a TTL (Time To Live in seconds). Default: 24 hours.
 */
export async function setCachedItem(
  key: string,
  data: unknown,
  ttlSeconds: number = 86400
): Promise<void> {
  const db = await getDB();
  if (!db) return;

  const item = {
    key,
    data,
    updatedAt: Date.now(),
    expiry: Date.now() + ttlSeconds * 1000,
  };

  await db.put(STORE_SITE_DATA, item);
}

/**
 * Retrieve cached item from IndexedDB. If ignoreExpiry is true, returns even if expired (Stale-While-Revalidate).
 */
export async function getCachedItem<T = unknown>(
  key: string,
  ignoreExpiry: boolean = true
): Promise<{ data: T; isExpired: boolean; updatedAt: number } | null> {
  const db = await getDB();
  if (!db) return null;

  try {
    const item = await db.get(STORE_SITE_DATA, key);
    if (!item) return null;

    const isExpired = !!(item.expiry && Date.now() > item.expiry);

    // If strictly checking expiry and it is expired, delete and return null
    if (!ignoreExpiry && isExpired) {
      await db.delete(STORE_SITE_DATA, key);
      return null;
    }

    return {
      data: item.data as T,
      isExpired,
      updatedAt: item.updatedAt || 0,
    };
  } catch (error) {
    console.warn("[IndexedDB] Read error:", error);
    return null;
  }
}

/**
 * Clear all cached items in the site_data store
 */
export async function clearAllCachedItems(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.clear(STORE_SITE_DATA);
}

// ─────────────────────────────────────────────────────────────
// High-Level Instant Fetch with IndexedDB Stale-While-Revalidate
// ─────────────────────────────────────────────────────────────

export interface PublicContentData {
  services: any[];
  blogs: any[];
  gallery: any[];
  settings: any;
  testimonials: any[];
}

export const CACHE_KEY_PUBLIC_CONTENT = "riwaj_public_content";

/**
 * Instantly fetches content from IndexedDB (0ms delay), then revalidates over network in the background.
 * Calls onFreshData callback when server returns updated content.
 */
export async function getInstantPublicContent(
  onFreshData?: (data: PublicContentData) => void
): Promise<PublicContentData | null> {
  // 1. Instant read from IndexedDB
  const cached = await getCachedItem<PublicContentData>(CACHE_KEY_PUBLIC_CONTENT, true);
  const initialData = cached?.data || null;

  // 2. Background network revalidation
  if (typeof window !== "undefined" && navigator.onLine) {
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && serverData.success) {
          const freshData: PublicContentData = {
            services: serverData.services || [],
            blogs: serverData.blogs || [],
            gallery: serverData.gallery || [],
            settings: serverData.settings || null,
            testimonials: serverData.testimonials || [],
          };

          // Update IndexedDB cache for next instant load (TTL: 24h)
          setCachedItem(CACHE_KEY_PUBLIC_CONTENT, freshData, 86400);

          // Dispatch browser event so any listening component can update seamlessly
          window.dispatchEvent(
            new CustomEvent("riwaj-content-updated", { detail: freshData })
          );

          if (onFreshData) {
            onFreshData(freshData);
          }
        }
      })
      .catch((err) => {
        console.warn("[IndexedDB] Background revalidation skipped (offline or network error):", err);
      });
  }

  return initialData;
}

// ─────────────────────────────────────────────────────────────
// Offline Consultation Inquiries Queue (PWA Resilience)
// ─────────────────────────────────────────────────────────────

export interface OfflineInquiry {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  date?: string;
  eventType?: string;
  message?: string;
  createdAt: number;
}

/**
 * Queue an inquiry in IndexedDB when user is offline
 */
export async function queueOfflineInquiry(inquiry: Omit<OfflineInquiry, "id" | "createdAt">): Promise<number | null> {
  const db = await getDB();
  if (!db) return null;

  const item: OfflineInquiry = {
    ...inquiry,
    createdAt: Date.now(),
  };

  const id = (await db.add(STORE_OFFLINE_QUEUE, item)) as number;
  console.log("[IndexedDB] Queued consultation inquiry offline, ID:", id);
  return id;
}

/**
 * Get all queued offline inquiries
 */
export async function getQueuedOfflineInquiries(): Promise<OfflineInquiry[]> {
  const db = await getDB();
  if (!db) return [];
  return (await db.getAll(STORE_OFFLINE_QUEUE)) as OfflineInquiry[];
}

/**
 * Flush and sync all queued offline inquiries to the server when connection returns
 */
export async function syncOfflineInquiries(): Promise<{ synced: number; failed: number }> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const db = await getDB();
  if (!db) return { synced: 0, failed: 0 };

  const queued = (await db.getAll(STORE_OFFLINE_QUEUE)) as OfflineInquiry[];
  if (!queued || queued.length === 0) {
    return { synced: 0, failed: 0 };
  }

  console.log(`[IndexedDB] Attempting to sync ${queued.length} offline inquiries...`);
  let synced = 0;
  let failed = 0;

  for (const item of queued) {
    try {
      const res = await fetch("/api/bookconsultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          phone: item.phone,
          email: item.email || "",
          date: item.date || "",
          eventType: item.eventType || "Wedding",
          message: `${item.message || ""} (Sent while offline on ${new Date(item.createdAt).toLocaleString("en-IN")})`,
        }),
      });

      if (res.ok) {
        if (item.id) {
          await db.delete(STORE_OFFLINE_QUEUE, item.id);
        }
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  console.log(`[IndexedDB] Sync finished. Synced: ${synced}, Failed: ${failed}`);
  return { synced, failed };
}
