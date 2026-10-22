import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronLeftIcon,
  EmptyFolderIllustration,
  InfoIcon,
  QuickBarcodeIcon,
  QuickSparklesIcon,
  QuickVoiceIcon,
  SearchIcon,
  ViewfinderBarcodeIcon,
} from '@/components/icons';
import type { Food } from '../../types';
import { styles } from './FoodSearchScreen.styles';

export type SearchTab = 'recent' | 'mine' | 'favorite';

// ─── 1. FoodSearchHeader ─────────────────────────────────────────────────────
export type FoodSearchHeaderProps = {
  dateTitle: string;
  selectedHour: string;
  onGoBack: () => void;
  onOpenPicker: () => void;
  onOpenInfo: () => void;
};

export function FoodSearchHeader({
  dateTitle,
  selectedHour,
  onGoBack,
  onOpenPicker,
  onOpenInfo,
}: FoodSearchHeaderProps) {
  return (
    <View style={styles.headerBar}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={onGoBack}
        style={styles.headerIconButton}
        accessibilityLabel="Quay lại"
      >
        <ChevronLeftIcon size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Center: Hôm nay • 11:00 ▾ */}
      <TouchableOpacity
        onPress={onOpenPicker}
        style={styles.headerCenterButton}
        activeOpacity={0.7}
        accessibilityLabel="Chọn giờ và bữa ăn"
      >
        <Text style={styles.headerTitleText}>
          {dateTitle} • {selectedHour}
        </Text>
        <Text style={styles.headerCaret}>▾</Text>
      </TouchableOpacity>

      {/* Right: Info Button ⓘ */}
      <TouchableOpacity
        onPress={onOpenInfo}
        style={styles.headerIconButton}
        accessibilityLabel="Thông tin"
      >
        <InfoIcon size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ─── 2. FoodSearchBar ────────────────────────────────────────────────────────
export type FoodSearchBarProps = {
  query: string;
  onChangeQuery: (text: string) => void;
  onOpenBarcode: () => void;
};

export function FoodSearchBar({
  query,
  onChangeQuery,
  onOpenBarcode,
}: FoodSearchBarProps) {
  return (
    <View style={styles.searchBarWrapper}>
      <View style={styles.searchBarContainer}>
        {/* Magnifying Glass Icon */}
        <SearchIcon size={20} color="#FFFFFF" strokeWidth={2.2} />

        {/* Text Input */}
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Tìm thực phẩm hoặc món ăn"
          placeholderTextColor="#7A758D"
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
      </View>

      {/* Barcode Viewfinder Icon on the right */}
      <TouchableOpacity
        onPress={onOpenBarcode}
        style={styles.barcodeIconBtn}
        accessibilityLabel="Quét mã vạch"
        activeOpacity={0.75}
      >
        <ViewfinderBarcodeIcon size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ─── 3. FoodSearchTabs ───────────────────────────────────────────────────────
export type FoodSearchTabsProps = {
  activeTab: SearchTab;
  onSelectTab: (tab: SearchTab) => void;
};

export function FoodSearchTabs({
  activeTab,
  onSelectTab,
}: FoodSearchTabsProps) {
  return (
    <View style={styles.tabsRow}>
      {/* Tab 1: Gần đây */}
      <TouchableOpacity
        onPress={() => onSelectTab('recent')}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabLabel, activeTab === 'recent' && styles.tabLabelActive]}>
          Gần đây
        </Text>
        {activeTab === 'recent' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      {/* Tab 2: Tạo bởi tôi */}
      <TouchableOpacity
        onPress={() => onSelectTab('mine')}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabLabel, activeTab === 'mine' && styles.tabLabelActive]}>
          Tạo bởi tôi
        </Text>
        {activeTab === 'mine' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      {/* Tab 3: Yêu thích */}
      <TouchableOpacity
        onPress={() => onSelectTab('favorite')}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabLabel, activeTab === 'favorite' && styles.tabLabelActive]}>
          Yêu thích
        </Text>
        {activeTab === 'favorite' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
    </View>
  );
}

// ─── 4. FoodSearchActionCards ────────────────────────────────────────────────
export type FoodSearchActionCardsProps = {
  onBarcodeScan: () => void;
  onAIMealScan: () => void;
  onVoiceLog: () => void;
};

export function FoodSearchActionCards({
  onBarcodeScan,
  onAIMealScan,
  onVoiceLog,
}: FoodSearchActionCardsProps) {
  return (
    <View style={styles.actionCardsRow}>
      {/* Card 1: Quét mã vạch */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.75}
        onPress={onBarcodeScan}
      >
        <View style={[styles.actionCircle, { backgroundColor: '#2563EB' }]}>
          <QuickBarcodeIcon size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.actionCardTitle}>Quét mã{'\n'}vạch</Text>
      </TouchableOpacity>

      {/* Card 2: Nhận diện món ăn (AI) */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.75}
        onPress={onAIMealScan}
      >
        <View style={[styles.actionCircle, { backgroundColor: '#22C55E' }]}>
          <QuickSparklesIcon size={24} color="#0D0B14" />
        </View>
        <Text style={styles.actionCardTitle}>Nhận diện{'\n'}món ăn</Text>
      </TouchableOpacity>

      {/* Card 3: Ghi bằng giọng nói */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.75}
        onPress={onVoiceLog}
      >
        <View style={[styles.actionCircle, { backgroundColor: '#F87171' }]}>
          <QuickVoiceIcon size={24} color="#0D0B14" cutoutColor="#F87171" />
        </View>
        <Text style={styles.actionCardTitle}>Ghi bằng{'\n'}giọng nói</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── 5. FoodRowItem ──────────────────────────────────────────────────────────
export type FoodRowItemProps = {
  food: Food;
  onPress: () => void;
};

export function FoodRowItem({ food, onPress }: FoodRowItemProps) {
  return (
    <TouchableOpacity
      style={styles.foodRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.foodRowInfo}>
        <Text style={styles.foodRowName}>{food.name}</Text>
        <Text style={styles.foodRowSubtitle}>
          {food.calories} kcal / 100g • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
        </Text>
      </View>
      <View style={styles.foodRowAction}>
        <Text style={styles.foodRowActionText}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── 6. FoodSearchEmptyState ─────────────────────────────────────────────────
export type FoodSearchEmptyStateProps = {
  isSearchActive: boolean;
  activeTab: SearchTab;
  onCreateCustom: () => void;
};

export function FoodSearchEmptyState({
  isSearchActive,
  activeTab,
  onCreateCustom,
}: FoodSearchEmptyStateProps) {
  if (isSearchActive) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyFolderIllustration size={120} />
        <Text style={styles.emptyTitle}>Không tìm thấy món</Text>
        <Text style={styles.emptySubtitle}>
          Thử tìm với tên không dấu hoặc tạo món ăn mới.
        </Text>
        <TouchableOpacity
          style={styles.createCustomBtn}
          onPress={onCreateCustom}
        >
          <Text style={styles.createCustomBtnText}>+ Tạo món ăn tùy chỉnh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <EmptyFolderIllustration size={130} />
      <Text style={styles.emptyTitle}>Chưa có thông tin</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'recent'
          ? 'Hệ thống chưa ghi nhận thông tin bạn\nđã nhập gần đây'
          : activeTab === 'mine'
          ? 'Bạn chưa tạo món ăn tùy chỉnh nào'
          : 'Danh sách món ăn yêu thích hiện đang trống'}
      </Text>

      {activeTab === 'mine' && (
        <TouchableOpacity
          style={styles.createCustomBtn}
          onPress={onCreateCustom}
        >
          <Text style={styles.createCustomBtnText}>+ Tạo món ăn tùy chỉnh</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
