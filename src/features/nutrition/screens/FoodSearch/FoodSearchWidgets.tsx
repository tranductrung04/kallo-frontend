import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BowlFoodPlusIcon,
  ChevronLeftIcon,
  EmptyFolderIllustration,
  InfoIcon,
  QuickBarcodeIcon,
  QuickSparklesIcon,
  QuickVoiceIcon,
  RecipeBookPlusIcon,
  SearchIcon,
  ViewfinderBarcodeIcon,
} from '@/components/icons';
import type { Food } from '../../types';
import { useFoodSearchStyles } from './FoodSearchScreen.styles';

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
  const { theme, styles } = useFoodSearchStyles();
  const { colors: c } = theme;

  return (
    <View style={styles.headerBar}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={onGoBack}
        style={styles.headerIconButton}
        accessibilityLabel="Quay lại"
      >
        <ChevronLeftIcon size={22} color={c.textPrimary} />
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
        <InfoIcon size={22} color={c.textPrimary} />
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
  const { theme, styles } = useFoodSearchStyles();
  const { colors: c } = theme;

  return (
    <View style={styles.searchBarWrapper}>
      <View style={styles.searchBarContainer}>
        {/* Magnifying Glass Icon */}
        <SearchIcon size={20} color={c.textPrimary} strokeWidth={2.2} />

        {/* Text Input */}
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Tìm thực phẩm hoặc món ăn"
          placeholderTextColor={c.textSecondary}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* Barcode Scanner Icon Button */}
      <TouchableOpacity
        onPress={onOpenBarcode}
        style={styles.barcodeIconBtn}
        accessibilityLabel="Quét mã vạch"
      >
        <ViewfinderBarcodeIcon size={28} color={c.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

// ─── 3. FoodSearchTabs (Centered) ────────────────────────────────────────────
export type FoodSearchTabsProps = {
  activeTab: SearchTab;
  onSelectTab: (tab: SearchTab) => void;
};

export function FoodSearchTabs({ activeTab, onSelectTab }: FoodSearchTabsProps) {
  const { styles } = useFoodSearchStyles();

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
  activeTab?: SearchTab;
  onBarcodeScan: () => void;
  onAIMealScan: () => void;
  onVoiceLog: () => void;
  onCreateRecipe?: () => void;
  onCreateFood?: () => void;
};

export function FoodSearchActionCards({
  activeTab = 'recent',
  onBarcodeScan,
  onAIMealScan,
  onVoiceLog,
  onCreateRecipe,
  onCreateFood,
}: FoodSearchActionCardsProps) {
  const { theme, styles } = useFoodSearchStyles();
  const { colors: c } = theme;

  // Khi ở tab "Tạo bởi tôi" -> Hiển thị 2 thẻ: Tạo công thức & Tạo thực phẩm
  if (activeTab === 'mine') {
    return (
      <View style={styles.actionCardsRow}>
        {/* Card 1: Tạo công thức */}
        <TouchableOpacity
          style={styles.customActionCard}
          activeOpacity={0.75}
          onPress={onCreateRecipe ?? onCreateFood}
          accessibilityLabel="Tạo công thức"
        >
          <View style={[styles.customActionCircle, { backgroundColor: c.quickScanner }]}>
            <RecipeBookPlusIcon size={26} color="#0D0B14" cutoutColor={c.quickScanner} />
          </View>
          <Text style={styles.customActionCardTitle} numberOfLines={1}>
            Tạo công thức
          </Text>
        </TouchableOpacity>

        {/* Card 2: Tạo thực phẩm */}
        <TouchableOpacity
          style={styles.customActionCard}
          activeOpacity={0.75}
          onPress={onCreateFood ?? onCreateRecipe}
          accessibilityLabel="Tạo thực phẩm"
        >
          <View style={[styles.customActionCircle, { backgroundColor: c.macroProtein }]}>
            <BowlFoodPlusIcon size={26} color="#0D0B14" cutoutColor={c.macroProtein} />
          </View>
          <Text style={styles.customActionCardTitle} numberOfLines={1}>
            Tạo thực phẩm
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Khi ở tab "Gần đây" hoặc "Yêu thích" -> Hiển thị 3 thẻ thao tác nhanh chuẩn
  return (
    <View style={styles.actionCardsRow}>
      {/* Card 1: Quét mã vạch */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.75}
        onPress={onBarcodeScan}
      >
        <View style={[styles.actionCircle, { backgroundColor: c.macroCarbs }]}>
          <QuickBarcodeIcon size={24} color={c.onBrand} />
        </View>
        <Text style={styles.actionCardTitle}>Quét mã{'\n'}vạch</Text>
      </TouchableOpacity>

      {/* Card 2: Nhận diện món ăn (AI) */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.75}
        onPress={onAIMealScan}
      >
        <View style={[styles.actionCircle, { backgroundColor: c.quickScanner }]}>
          <QuickSparklesIcon size={24} color={c.onQuickTile} />
        </View>
        <Text style={styles.actionCardTitle}>Nhận diện{'\n'}món ăn</Text>
      </TouchableOpacity>

      {/* Card 3: Ghi bằng giọng nói */}
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.75}
        onPress={onVoiceLog}
      >
        <View style={[styles.actionCircle, { backgroundColor: c.macroProtein }]}>
          <QuickVoiceIcon size={24} color={c.onQuickTile} cutoutColor={c.macroProtein} />
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
  const { styles } = useFoodSearchStyles();

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
  const { styles } = useFoodSearchStyles();

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

  // Khi ở tab "Tạo bởi tôi" chưa có món
  if (activeTab === 'mine') {
    return (
      <View style={styles.emptyContainer}>
        <EmptyFolderIllustration size={140} />
        <Text style={styles.emptyTitle}>Tạo mới thực phẩm</Text>
        <Text style={styles.emptySubtitle}>
          {'Tạo mới thực phẩm của riêng mình và sử\ndụng trong quá trình theo dõi cân nặng\nmột cách dễ dàng'}
        </Text>
      </View>
    );
  }

  // Khi ở tab "Yêu thích" chưa có món
  if (activeTab === 'favorite') {
    return (
      <View style={styles.emptyContainer}>
        <EmptyFolderIllustration size={140} />
        <Text style={styles.emptyTitle}>Bạn chưa có mục yêu thích</Text>
        <Text style={styles.emptySubtitle}>
          {'Để truy cập nhanh hơn trong các lần tới.\nChỉ cần nhấn vào biểu tượng 💜 khi xem\nthông tin thực phẩm!'}
        </Text>
      </View>
    );
  }

  // Mặc định: tab "Gần đây" chưa có thông tin
  return (
    <View style={styles.emptyContainer}>
      <EmptyFolderIllustration size={140} />
      <Text style={styles.emptyTitle}>Chưa có thông tin</Text>
      <Text style={styles.emptySubtitle}>
        {'Hệ thống chưa ghi nhận thông tin bạn\nđã nhập gần đây'}
      </Text>
    </View>
  );
}
