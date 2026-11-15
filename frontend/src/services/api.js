/**
 * Smart Anganwadi API Client with Offline-First Synchronisation Queue
 */

const API_BASE = '/api';
const SYNC_QUEUE_KEY = 'anganwadi_offline_sync_queue';
const CACHE_PREFIX = 'anganwadi_cached_';

// Retrieve offline sync queue from localStorage
export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Add an item to the offline sync queue
export function queueOfflineAction(endpoint, method, payload, description) {
  const queue = getOfflineQueue();
  const newItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    endpoint,
    method,
    payload,
    description: description || `${method} ${endpoint}`,
    timestamp: new Date().toISOString()
  };
  queue.push(newItem);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  window.dispatchEvent(new CustomEvent('anganwadi_sync_queue_updated', { detail: { count: queue.length } }));
  return newItem;
}

// Clear or update queue
export function setOfflineQueue(queue) {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  window.dispatchEvent(new CustomEvent('anganwadi_sync_queue_updated', { detail: { count: queue.length } }));
}

// Cache helper for offline reads
function setLocalCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    // quota exceeded or private mode
  }
}

function getLocalCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Generic fetch wrapper with offline resilience
async function request(endpoint, options = {}, description = '') {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('anganwadi_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If browser is explicitly offline and this is a write (POST/PUT/DELETE)
  if (!navigator.onLine && (options.method && options.method !== 'GET')) {
    queueOfflineAction(endpoint, options.method, options.body ? JSON.parse(options.body) : null, description);
    // Return an optimistic fake response
    return {
      offlineQueued: true,
      message: 'Saved offline. Will synchronize automatically when connection is restored.',
      data: options.body ? JSON.parse(options.body) : {}
    };
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }

    const data = await res.json();

    // Cache successful GET requests for offline browsing
    if (!options.method || options.method === 'GET') {
      setLocalCache(endpoint, data);
    }

    return data;
  } catch (error) {
    console.warn(`[API] Request failed for ${endpoint}:`, error.message);

    // If it's a GET request, check if we have cached data
    if (!options.method || options.method === 'GET') {
      const cached = getLocalCache(endpoint);
      if (cached) {
        console.log(`[API] Returning cached data for ${endpoint}`);
        return cached;
      }
    }

    // If it's a write request that failed due to network, queue it!
    if (options.method && options.method !== 'GET') {
      queueOfflineAction(endpoint, options.method, options.body ? JSON.parse(options.body) : null, description);
      return {
        offlineQueued: true,
        message: 'Network unavailable. Action saved locally and queued for synchronization.',
        data: options.body ? JSON.parse(options.body) : {}
      };
    }

    throw error;
  }
}

// Sync all pending offline actions with backend
export async function syncPendingQueue() {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  const remaining = [];
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const url = `${API_BASE}${item.endpoint}`;
      const token = localStorage.getItem('anganwadi_token');
      const res = await fetch(url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: item.payload ? JSON.stringify(item.payload) : undefined
      });

      if (res.ok) {
        synced++;
      } else {
        remaining.push(item);
        failed++;
      }
    } catch (err) {
      remaining.push(item);
      failed++;
    }
  }

  setOfflineQueue(remaining);
  return { synced, failed, remainingCount: remaining.length };
}

// Listen for network reconnect and auto-sync
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Network] Back online! Triggering synchronization...');
    syncPendingQueue();
  });
}

// --- Specific API Resource Methods ---

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }, 'User Login'),
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }, 'User Registration'),
  getMe: () => request('/auth/me')
};

export const centersApi = {
  getAll: () => request('/centers'),
  getById: (id) => request(`/centers/${id}`)
};

export const childrenApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/children${q ? `?${q}` : ''}`);
  },
  getById: (id) => request(`/children/${id}`),
  create: (child) => request('/children', {
    method: 'POST',
    body: JSON.stringify(child)
  }, `Register Child: ${child.name}`),
  update: (id, updates) => request(`/children/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }, `Update Child: ${updates.name || id}`),
  delete: (id) => request(`/children/${id}`, {
    method: 'DELETE'
  }, `Delete Child: ${id}`)
};

export const attendanceApi = {
  getForDate: (centerId, date) => request(`/attendance?centerId=${centerId}&date=${date}`),
  getHistory: (centerId, limit = 30) => request(`/attendance/history?centerId=${centerId}&limit=${limit}`),
  save: (payload) => request('/attendance', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, `Save Attendance (${payload.date})`)
};

export const mealsApi = {
  getForDate: (centerId, date) => request(`/meals?centerId=${centerId}&date=${date}`),
  getHistory: (centerId, limit = 30) => request(`/meals/history?centerId=${centerId}&limit=${limit}`),
  save: (payload) => request('/meals', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, `Save Meal Distribution (${payload.date})`)
};

export const growthApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/growth${q ? `?${q}` : ''}`);
  },
  record: (payload) => request('/growth', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, `Record Growth: ${payload.childName || payload.childId}`)
};

export const activitiesApi = {
  getAll: (centerId) => request(`/activities?centerId=${centerId || 'aw-102'}`),
  record: (payload) => request('/activities', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, `Record Activity: ${payload.title}`)
};

export const alertsApi = {
  getAll: (centerId) => request(`/alerts${centerId && centerId !== 'all' ? `?centerId=${centerId}` : ''}`),
  updateStatus: (id, statusData) => request(`/alerts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  }, `Update Alert: ${id}`)
};

export const supervisorApi = {
  getDashboard: () => request('/supervisor/dashboard'),
  getMprReport: (centerId, month) => request(`/supervisor/reports/mpr?centerId=${centerId || 'all'}&month=${encodeURIComponent(month || '')}`)
};
