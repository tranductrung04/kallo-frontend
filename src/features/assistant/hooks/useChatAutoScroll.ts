import { useCallback, useEffect, useRef } from 'react';
import type { FlatList, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const AUTO_SCROLL_THRESHOLD_PX = 80;
const INITIAL_SETTLE_DELAY_MS = 250;
const AUTO_SCROLL_LOCK_ANIMATED_MS = 650;
const AUTO_SCROLL_LOCK_INSTANT_MS = 100;

type UseChatAutoScrollOptions = {
  /** Changes whenever messages are added or their visible content/status updates. */
  messageKey: string;
  /** True while conversation history is loading and the list is hidden. */
  isLoading: boolean;
};

/**
 * Keeps a chat FlatList scrolled to the latest message when appropriate:
 * - Scrolls only when content overflows the viewport.
 * - Preserves scroll position if the user scrolled up to read earlier messages.
 * - Forces scroll-to-bottom when the user sends/retries a message.
 * - Snaps without animation on initial conversation load and animates subsequent updates.
 */
export function useChatAutoScroll<T>({ messageKey, isLoading }: UseChatAutoScrollOptions) {
  const flatListRef = useRef<FlatList<T>>(null);
  const layoutHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const isNearBottomRef = useRef(true);
  const forceScrollRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const hasCompletedInitialScrollRef = useRef(false);
  const prevMessageKeyRef = useRef(messageKey);
  const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const clearAutoScrollTimer = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  const clearPendingRaf = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const scrollToBottom = useCallback((animated: boolean) => {
    const list = flatListRef.current;
    const layoutHeight = layoutHeightRef.current;
    const contentHeight = contentHeightRef.current;
    if (!list || layoutHeight <= 0 || contentHeight <= layoutHeight) {
      if (layoutHeight > 0 && contentHeight <= layoutHeight) {
        isNearBottomRef.current = true;
        forceScrollRef.current = false;
      }
      return;
    }

    clearAutoScrollTimer();
    isAutoScrollingRef.current = true;
    list.scrollToEnd({ animated });
    forceScrollRef.current = false;

    autoScrollTimerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
      autoScrollTimerRef.current = null;
    }, animated ? AUTO_SCROLL_LOCK_ANIMATED_MS : AUTO_SCROLL_LOCK_INSTANT_MS);
  }, [clearAutoScrollTimer]);

  const requestScrollToBottom = useCallback(() => {
    hasCompletedInitialScrollRef.current = true;
    forceScrollRef.current = true;
    isNearBottomRef.current = true;
  }, []);

  useEffect(() => {
    if (initialSettleTimerRef.current) {
      clearTimeout(initialSettleTimerRef.current);
      initialSettleTimerRef.current = null;
    }

    if (isLoading) {
      hasCompletedInitialScrollRef.current = false;
      layoutHeightRef.current = 0;
      contentHeightRef.current = 0;
      scrollOffsetRef.current = 0;
      isNearBottomRef.current = true;
      isAutoScrollingRef.current = false;
      return;
    }

    initialSettleTimerRef.current = setTimeout(() => {
      hasCompletedInitialScrollRef.current = true;
      initialSettleTimerRef.current = null;
    }, INITIAL_SETTLE_DELAY_MS);

    return () => {
      if (initialSettleTimerRef.current) {
        clearTimeout(initialSettleTimerRef.current);
        initialSettleTimerRef.current = null;
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (prevMessageKeyRef.current === messageKey) return;
    prevMessageKeyRef.current = messageKey;

    if (!forceScrollRef.current && !isNearBottomRef.current) {
      return;
    }

    clearPendingRaf();
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (forceScrollRef.current || isNearBottomRef.current) {
        scrollToBottom(hasCompletedInitialScrollRef.current);
      }
    });
  }, [clearPendingRaf, isLoading, messageKey, scrollToBottom]);

  useEffect(() => {
    return () => {
      clearAutoScrollTimer();
      clearPendingRaf();
      if (initialSettleTimerRef.current) {
        clearTimeout(initialSettleTimerRef.current);
      }
    };
  }, [clearAutoScrollTimer, clearPendingRaf]);

  const handleScrollBeginDrag = useCallback(() => {
    isAutoScrollingRef.current = false;
    forceScrollRef.current = false;
    clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const prevOffset = scrollOffsetRef.current;
    scrollOffsetRef.current = contentOffset.y;
    layoutHeightRef.current = layoutMeasurement.height;

    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);

    if (distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX) {
      isNearBottomRef.current = true;
      isAutoScrollingRef.current = false;
      return;
    }

    const scrolledUp = contentOffset.y < prevOffset - 2;
    const sameContentSize = Math.abs(contentSize.height - contentHeightRef.current) < 1;
    if (scrolledUp || (!isAutoScrollingRef.current && sameContentSize)) {
      isNearBottomRef.current = false;
      isAutoScrollingRef.current = false;
    }
  }, []);

  const handleContentSizeChange = useCallback((_width: number, height: number) => {
    const prevHeight = contentHeightRef.current;
    contentHeightRef.current = height;

    if (layoutHeightRef.current <= 0) return;

    if (height <= layoutHeightRef.current) {
      isNearBottomRef.current = true;
      forceScrollRef.current = false;
      return;
    }

    if (!forceScrollRef.current && !isNearBottomRef.current) {
      return;
    }

    if (forceScrollRef.current || height !== prevHeight || !hasCompletedInitialScrollRef.current) {
      clearPendingRaf();
      scrollToBottom(hasCompletedInitialScrollRef.current);
    }
  }, [clearPendingRaf, scrollToBottom]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    const prevHeight = layoutHeightRef.current;
    layoutHeightRef.current = nextHeight;

    if (nextHeight <= 0) return;

    if (contentHeightRef.current <= nextHeight) {
      isNearBottomRef.current = true;
      return;
    }

    const justMountedWithContent = prevHeight === 0 && contentHeightRef.current > nextHeight;
    const viewportShrank = prevHeight > 0 && nextHeight < prevHeight;
    if ((justMountedWithContent || viewportShrank) && (forceScrollRef.current || isNearBottomRef.current)) {
      clearPendingRaf();
      scrollToBottom(hasCompletedInitialScrollRef.current);
    }
  }, [clearPendingRaf, scrollToBottom]);

  return {
    flatListRef,
    requestScrollToBottom,
    listScrollProps: {
      onLayout: handleLayout,
      onContentSizeChange: handleContentSizeChange,
      onScroll: handleScroll,
      onScrollBeginDrag: handleScrollBeginDrag,
      scrollEventThrottle: 16,
    },
  };
}
