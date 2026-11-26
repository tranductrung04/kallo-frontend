import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/features/auth/AuthProvider';
import { getUserScopedStorageKey } from '@/services/storage/userStorage';
import type {
  OfflineSyncContextValue,
  SyncItemType,
  SyncQueueItem,
} from './types';
import {
  deduplicateQueue,
  generateClientUuid,
  pushSyncBatch,
} from './syncManager';

const STORAGE_KEY_PREFIX = '@kallo/offline-sync-queue-v1';

const OfflineSyncContext = createContext<OfflineSyncContextValue | null>(null);

export function OfflineSyncProvider({ children }: React.PropsWithChildren) {
  const { status, user } = useAuth();
  const activeUserId = status === 'signedIn' ? (user?.id ?? null) : null;
  const storageKey = getUserScopedStorageKey(STORAGE_KEY_PREFIX, activeUserId);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | undefined>(undefined);
  const loadedKeyRef = useRef<string | null>(null);

  // Restore queue from local storage
  useEffect(() => {
    let active = true;
    loadedKeyRef.current = null;
    setQueue([]);
    setLastSyncedAt(undefined);

    if (!storageKey) {
      return () => {
        active = false;
      };
    }

    void AsyncStorage.getItem(storageKey)
      .then((data) => {
        if (!active) return;
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed.queue)) setQueue(deduplicateQueue(parsed.queue));
            if (parsed.lastSyncedAt) setLastSyncedAt(parsed.lastSyncedAt);
          } catch {
            /* Ignore parse error */
          }
        }
        loadedKeyRef.current = storageKey;
      })
      .catch(() => {
        if (active) {
          loadedKeyRef.current = storageKey;
        }
      });

    return () => {
      active = false;
    };
  }, [storageKey]);

  // Persist queue
  useEffect(() => {
    if (storageKey && loadedKeyRef.current === storageKey) {
      void AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ queue, lastSyncedAt })
      ).catch(() => undefined);
    }
  }, [storageKey, queue, lastSyncedAt]);

  const enqueueItem = useCallback(
    <T,>(type: SyncItemType, payload: T, clientUuid?: string): string => {
      const uuid = clientUuid || generateClientUuid(type.toLowerCase());
      const item: SyncQueueItem<T> = {
        clientUuid: uuid,
        type,
        payload,
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        retryCount: 0,
      };

      setQueue((prev) => deduplicateQueue([...prev, item]));
      return uuid;
    },
    []
  );

  const syncNow = useCallback(async (): Promise<number> => {
    if (isSyncing || queue.length === 0) return 0;
    setIsSyncing(true);

    const pending = queue.filter((i) => i.status === 'PENDING' || i.status === 'FAILED');
    if (pending.length === 0) {
      setIsSyncing(false);
      return 0;
    }

    // Set status to SYNCING
    setQueue((prev) =>
      prev.map((item) =>
        item.status === 'PENDING' ? { ...item, status: 'SYNCING' } : item
      )
    );

    const { successUuids } = await pushSyncBatch(pending);

    const now = new Date().toISOString();
    setLastSyncedAt(now);

    setQueue((prev) =>
      prev.map((item) =>
        successUuids.includes(item.clientUuid)
          ? { ...item, status: 'SYNCED' }
          : item.status === 'SYNCING'
          ? { ...item, status: 'FAILED', retryCount: item.retryCount + 1 }
          : item
      )
    );

    setIsSyncing(false);
    return successUuids.length;
  }, [isSyncing, queue]);

  // Auto sync when coming back online
  useEffect(() => {
    if (status === 'signedIn' && isOnline && queue.some((i) => i.status === 'PENDING')) {
      void syncNow();
    }
  }, [status, isOnline, queue, syncNow]);

  const toggleOnlineStatus = useCallback(() => {
    setIsOnline((prev) => !prev);
  }, []);

  const setOnlineStatus = useCallback((online: boolean) => {
    setIsOnline(online);
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((i) => i.status !== 'SYNCED'));
  }, []);

  const clearAllQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const pendingCount = useMemo(
    () => queue.filter((i) => i.status === 'PENDING' || i.status === 'FAILED').length,
    [queue]
  );

  const value: OfflineSyncContextValue = {
    isOnline,
    isSyncing,
    pendingCount,
    queue,
    lastSyncedAt,
    setOnlineStatus,
    toggleOnlineStatus,
    enqueueItem,
    syncNow,
    clearCompleted,
    clearAllQueue,
  };

  return (
    <OfflineSyncContext.Provider value={value}>
      {children}
    </OfflineSyncContext.Provider>
  );
}

export function useOfflineSync() {
  const ctx = useContext(OfflineSyncContext);
  if (!ctx) throw new Error('useOfflineSync must be used inside OfflineSyncProvider');
  return ctx;
}
