import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const STORAGE_KEY = '@kallo/offline-sync-queue-v1';

const OfflineSyncContext = createContext<OfflineSyncContextValue | null>(null);

export function OfflineSyncProvider({ children }: React.PropsWithChildren) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | undefined>(undefined);

  // Restore queue from local storage
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (!data) return;
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.queue)) setQueue(deduplicateQueue(parsed.queue));
        if (parsed.lastSyncedAt) setLastSyncedAt(parsed.lastSyncedAt);
      } catch {
        /* Ignore parse error */
      }
    });
  }, []);

  // Persist queue
  useEffect(() => {
    void AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ queue, lastSyncedAt })
    ).catch(() => undefined);
  }, [queue, lastSyncedAt]);

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
    if (isOnline && queue.some((i) => i.status === 'PENDING')) {
      void syncNow();
    }
  }, [isOnline, queue, syncNow]);

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
