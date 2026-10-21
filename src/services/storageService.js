const DB_NAME = 'VoxSalesDB';
const DB_VERSION = 1;
const STORE_NAME = 'call_records';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('salesStatus', 'salesStatus', { unique: false });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function saveCallRecord(record) {
  const db = await openDB();
  const persisted = { ...record };
  delete persisted.audioUrl;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(persisted);
    request.onsuccess = () => resolve(record);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function getAllCallRecords() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const sanitized = (request.result || []).map(r => {
        const copy = { ...r };
        delete copy.audioUrl;
        return copy;
      });
      const sorted = sanitized.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      resolve(sorted);
    };
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function deleteCallRecord(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function clearAllCallRecords() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve(true);
    request.onerror = (event) => reject(event.target.error);
  });
}
