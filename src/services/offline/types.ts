export type SyncItemType = 'FOOD_LOG' | 'WATER_LOG' | 'WEIGHT_LOG' | 'ACTIVITY_LOG' | 'AI_PHOTO';

export type SyncItemStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export type SyncQueueItem<T = any> = {
  clientUuid: string;
  type: SyncItemType;
  payload: T;
  timestamp: string;
  status: SyncItemStatus;
  retryCount: number;
  lastError?: string;
};

export type OfflineSyncState = {
  isOnline: boolean;
  isSyncing: boolean;
  queue: SyncQueueItem[];
  lastSyncedAt?: string;
};

export type OfflineSyncContextValue = {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  queue: SyncQueueItem[];
  lastSyncedAt?: string;
  setOnlineStatus: (online: boolean) => void;
  toggleOnlineStatus: () => void;
  enqueueItem: <T>(type: SyncItemType, payload: T, clientUuid?: string) => string;
  syncNow: () => Promise<number>;
  clearCompleted: () => void;
  clearAllQueue: () => void;
};
