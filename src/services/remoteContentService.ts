import { STORAGE_KEYS } from "./storageService";

type Snapshot = Record<string, any>;

function buildSnapshotFromLocalStorage(): Snapshot {
  const snapshot: Snapshot = {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw != null) {
      try {
        snapshot[key] = JSON.parse(raw);
      } catch {
        snapshot[key] = raw;
      }
    }
  });
  return snapshot;
}

function applySnapshotToLocalStorage(snapshot: Snapshot) {
  if (!snapshot || typeof snapshot !== "object") return;

  Object.entries(snapshot).forEach(([key, value]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      localStorage.setItem(key, String(value));
    }
  });
}

async function loadRemoteSnapshot() {
  const res = await fetch("/api/content", { method: "GET" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.ok) return null;
  return data.data ?? null;
}

async function publishRemoteSnapshot(snapshot: Snapshot) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `publish_failed_${res.status}`);
  }
  const data = await res.json();
  if (!data?.ok) {
    throw new Error(data?.error || "publish_failed");
  }
}

export async function bootstrapFromRemote() {
  try {
    const snapshot = await loadRemoteSnapshot();
    if (snapshot) {
      applySnapshotToLocalStorage(snapshot);
    }
  } catch {
  }
}

export async function publishCurrentToRemote() {
  const snapshot = buildSnapshotFromLocalStorage();
  await publishRemoteSnapshot(snapshot);
}
