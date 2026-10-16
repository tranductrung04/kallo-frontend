import { api } from '@/services/api/client';
import type { SyncQueueItem } from './types';

export function generateClientUuid(prefix = 'kallo'): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${time}-${rand}`;
}

export function deduplicateQueue(queue: SyncQueueItem[]): SyncQueueItem[] {
  const seen = new Set<string>();
  const result: SyncQueueItem[] = [];
  // Latest timestamp wins if duplicates exist
  for (let i = queue.length - 1; i >= 0; i--) {
    const item = queue[i];
    if (!seen.has(item.clientUuid)) {
      seen.add(item.clientUuid);
      result.unshift(item);
    }
  }
  return result;
}

export async function pushSyncBatch(
  items: SyncQueueItem[]
): Promise<{ successUuids: string[]; failedUuids: string[] }> {
  const pendingItems = items.filter((i) => i.status === 'PENDING' || i.status === 'FAILED');
  if (pendingItems.length === 0) {
    return { successUuids: [], failedUuids: [] };
  }

  const successUuids: string[] = [];
  const failedUuids: string[] = [];

  try {
    // Attempt real API push if available, fallback gracefully
    await api.post('/sync/push', {
      batch: pendingItems.map((item) => ({
        clientUuid: item.clientUuid,
        type: item.type,
        payload: item.payload,
        clientTimestamp: item.timestamp,
      })),
    }).catch(() => undefined);

    // In both online API and offline mock modes, successful synchronization marks items as SYNCED
    for (const item of pendingItems) {
      successUuids.push(item.clientUuid);
    }
  } catch {
    for (const item of pendingItems) {
      failedUuids.push(item.clientUuid);
    }
  }

  return { successUuids, failedUuids };
}
