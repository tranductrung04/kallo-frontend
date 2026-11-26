import { randomUUID } from 'expo-crypto';
import { api } from '@/services/api/client';
import { getApiErrorCode, getApiErrorStatus } from '@/services/api/apiUtils';
import type { SyncQueueItem } from './types';

export function generateClientUuid(_prefix = 'kallo'): string {
  return randomUUID();
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

function isTerminalConflictOrBadPayload(error: unknown): boolean {
  const status = getApiErrorStatus(error);
  const code = getApiErrorCode(error);
  if (status === 409 && code === 'RECORD_DELETED') return true;
  if (status === 400 || status === 404 || status === 403) return true;
  return false;
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
  const otherItems: SyncQueueItem[] = [];

  for (const item of pendingItems) {
    if (item.type === 'FOOD_LOG') {
      try {
        await api.post('/food-logs', {
          ...(item.payload as Record<string, unknown>),
          clientUuid: (item.payload as { clientUuid?: string })?.clientUuid ?? item.clientUuid,
        });
        successUuids.push(item.clientUuid);
      } catch (err) {
        if (isTerminalConflictOrBadPayload(err)) {
          successUuids.push(item.clientUuid);
        } else {
          failedUuids.push(item.clientUuid);
        }
      }
    } else if (item.type === 'WATER_LOG') {
      try {
        await api.post('/water-logs', {
          ...(item.payload as Record<string, unknown>),
          clientUuid: (item.payload as { clientUuid?: string })?.clientUuid ?? item.clientUuid,
        });
        successUuids.push(item.clientUuid);
      } catch (err) {
        if (isTerminalConflictOrBadPayload(err)) {
          successUuids.push(item.clientUuid);
        } else {
          failedUuids.push(item.clientUuid);
        }
      }
    } else {
      otherItems.push(item);
    }
  }

  if (otherItems.length > 0) {
    try {
      await api
        .post('/sync/push', {
          batch: otherItems.map((item) => ({
            clientUuid: item.clientUuid,
            type: item.type,
            payload: item.payload,
            clientTimestamp: item.timestamp,
          })),
        })
        .catch(() => undefined);

      for (const item of otherItems) {
        successUuids.push(item.clientUuid);
      }
    } catch {
      for (const item of otherItems) {
        failedUuids.push(item.clientUuid);
      }
    }
  }

  return { successUuids, failedUuids };
}
