import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { normalizeSearch, todayKey } from '../utils';
import type { Food, FoodCategory, MealSlot } from '../types';
import { FOOD_CATEGORY_LABELS } from '../foodTypes';
import { searchFoodsApi } from '../foodApi';
import { mapFoodSearchItemToFood } from '../foodTypes';
import { getDateTitle, getMealSlotForHour } from './FoodDiary';
import {
  createStyles,
  DateTimePickerModal,
  FoodRowItem,
  FoodSearchBar,
  FoodSearchEmptyState,
  FoodSearchHeader,
  FoodSearchTabs,
  FoodSearchActionCards,
  NutritionistNoteModal,
  type SearchTab,
} from './FoodSearch';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodSearch'>;

const CATEGORY_CHIPS: Array<{ key: FoodCategory | null; label: string }> = [
  { key: null, label: 'Tất cả' },
  { key: 'RICE', label: FOOD_CATEGORY_LABELS.RICE },
  { key: 'NOODLE', label: FOOD_CATEGORY_LABELS.NOODLE },
  { key: 'STAPLE', label: FOOD_CATEGORY_LABELS.STAPLE },
  { key: 'SOUP', label: FOOD_CATEGORY_LABELS.SOUP },
  { key: 'MEAT', label: FOOD_CATEGORY_LABELS.MEAT },
  { key: 'SEAFOOD', label: FOOD_CATEGORY_LABELS.SEAFOOD },
  { key: 'VEGETABLE', label: FOOD_CATEGORY_LABELS.VEGETABLE },
  { key: 'SNACK', label: FOOD_CATEGORY_LABELS.SNACK },
  { key: 'BEVERAGE', label: FOOD_CATEGORY_LABELS.BEVERAGE },
  { key: 'OTHER', label: FOOD_CATEGORY_LABELS.OTHER },
];

export function FoodSearchScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { foods, state, cacheFood, recentServerFoods, refreshRecentFoods } = useNutrition();

  const initialDate = route.params?.date === 'today' || !route.params?.date ? todayKey() : route.params.date;
  const [date, setDate] = useState(initialDate);
  const [selectedHour, setSelectedHour] = useState(route.params.hour || '11:00');
  const [meal, setMeal] = useState<MealSlot>(
    route.params.meal || getMealSlotForHour(selectedHour)
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>('recent');
  const [hourPickerVisible, setHourPickerVisible] = useState(false);
  const [nutritionNoteVisible, setNutritionNoteVisible] = useState(false);
  const [apiResults, setApiResults] = useState<Food[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Refresh recent foods from server when opening recent tab
  useEffect(() => {
    if (activeTab === 'recent') {
      void refreshRecentFoods?.(15);
    }
  }, [activeTab, refreshRecentFoods]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Query backend search API on debounced query or category change
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q && !selectedCategory) {
      setApiResults([]);
      setPage(0);
      setHasMore(false);
      setIsSearching(false);
      return;
    }

    let isCurrent = true;
    setIsSearching(true);
    setPage(0);

    searchFoodsApi({
      q: q || undefined,
      category: selectedCategory ?? undefined,
      page: 0,
      size: 20,
    })
      .then((pageData) => {
        if (!isCurrent) return;
        const mapped = (pageData.items ?? []).map(mapFoodSearchItemToFood);
        setApiResults(mapped);
        setHasMore((pageData.page ?? 0) + 1 < (pageData.totalPages ?? 1));
        cacheFood(mapped);
      })
      .catch(() => {
        if (isCurrent) {
          setApiResults([]);
          setHasMore(false);
        }
      })
      .finally(() => {
        if (isCurrent) setIsSearching(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery, selectedCategory, cacheFood]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const pageData = await searchFoodsApi({
        q: debouncedQuery.trim() || undefined,
        category: selectedCategory ?? undefined,
        page: nextPage,
        size: 20,
      });
      const mapped = (pageData.items ?? []).map(mapFoodSearchItemToFood);
      cacheFood(mapped);
      setApiResults((prev) => {
        const existingIds = new Set(prev.map((f) => f.id));
        return [...prev, ...mapped.filter((f) => !existingIds.has(f.id))];
      });
      setPage(nextPage);
      setHasMore((pageData.page ?? nextPage) + 1 < (pageData.totalPages ?? 1));
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Fallback local search
  const localSearchResults = useMemo(() => {
    const term = normalizeSearch(debouncedQuery);
    if (!term && !selectedCategory) return [];
    return foods.filter((food) => {
      const matchesTerm = !term || normalizeSearch(food.name).includes(term);
      const matchesCat = !selectedCategory || food.category === selectedCategory;
      return matchesTerm && matchesCat;
    });
  }, [debouncedQuery, selectedCategory, foods]);

  // Combine API results and local results (avoiding duplicates)
  const searchResults = useMemo(() => {
    if (apiResults.length > 0) {
      const apiIds = new Set(apiResults.map((f) => f.id));
      const remainingLocal = localSearchResults.filter((f) => !apiIds.has(f.id));
      return [...apiResults, ...remainingLocal];
    }
    return localSearchResults;
  }, [apiResults, localSearchResults]);

  // Tab foods when query and category are empty
  const tabFoods = useMemo(() => {
    if (activeTab === 'recent') {
      if (recentServerFoods && recentServerFoods.length > 0) {
        const serverIds = new Set(recentServerFoods.map((f) => f.id));
        const localOnly = foods.filter(
          (f) => state.recentFoodIds.includes(f.id) && !serverIds.has(f.id)
        );
        return [...recentServerFoods, ...localOnly];
      }
      return foods.filter((f) => state.recentFoodIds.includes(f.id));
    }
    if (activeTab === 'mine') {
      return foods.filter((f) => f.isCustom);
    }
    if (activeTab === 'favorite') {
      return foods.filter((f) => state.favoriteFoodIds.includes(f.id));
    }
    return [];
  }, [activeTab, foods, recentServerFoods, state.recentFoodIds, state.favoriteFoodIds]);

  const openFood = (food: Food) => {
    cacheFood(food);
    navigation.navigate('FoodDetail', {
      foodId: food.id,
      date,
      meal,
      source: food.isCustom ? 'CUSTOM' : 'SEARCH',
    });
  };

  const handleConfirmDateTime = (newDate: string, newHour: string) => {
    setDate(newDate);
    setSelectedHour(newHour);
    setMeal(getMealSlotForHour(newHour));
    setHourPickerVisible(false);
  };

  const dateTitle = getDateTitle(date);
  const isSearchActive = query.trim().length > 0 || selectedCategory !== null;
  const currentList = isSearchActive ? searchResults : tabFoods;

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.colors.canvasBase }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.canvasBase}
      />

      {/* ── 1. Top Header: <  Hôm nay • 11:00 ▾  ⓘ ──────────────────────────── */}
      <FoodSearchHeader
        dateTitle={dateTitle}
        selectedHour={selectedHour}
        onGoBack={() => navigation.goBack()}
        onOpenPicker={() => setHourPickerVisible(true)}
        onOpenInfo={() => setNutritionNoteVisible(true)}
      />

      {/* ── 2. Search Input Bar ────────────────────────────────────────────── */}
      <FoodSearchBar
        query={query}
        onChangeQuery={setQuery}
        onOpenBarcode={() => navigation.navigate('BarcodeScanner', { date, meal })}
      />

      {/* ── 3. Tabs: Gần đây | Tạo bởi tôi | Yêu thích (Căn giữa) ───────────── */}
      <FoodSearchTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* ── 3b. Category Filter Chips ─────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 42, marginBottom: 4 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
      >
        {CATEGORY_CHIPS.map((chip) => {
          const active = selectedCategory === chip.key;
          return (
            <TouchableOpacity
              key={chip.key ?? 'ALL'}
              onPress={() => setSelectedCategory(chip.key)}
              activeOpacity={0.75}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: active ? theme.colors.brandPrimary : theme.colors.surfaceBorder,
                backgroundColor: active ? theme.colors.brandSoftTint : theme.colors.surfaceMid,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: active ? '600' : '400',
                  color: active ? theme.colors.brandPrimary : theme.colors.textSecondary,
                }}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── 4. Action Cards (Quét mã / AI / Giọng nói hoặc Tạo công thức / Tạo thực phẩm) ── */}
      <FoodSearchActionCards
        activeTab={activeTab}
        onBarcodeScan={() => navigation.navigate('BarcodeScanner', { date, meal })}
        onAIMealScan={() => navigation.navigate('AIMealScan', { date, meal })}
        onVoiceLog={() => navigation.navigate('VoiceLogModal', { date, meal })}
        onCreateRecipe={() => navigation.navigate('CreateRecipe', { date, meal })}
        onCreateFood={() => navigation.navigate('CustomFoodForm', { date, meal })}
      />

      {/* ── 5. Main Content Area: Search Results or Empty State ────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isSearching && (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
        {currentList.length > 0 ? (
          <View style={styles.resultsList}>
            {currentList.map((food) => (
              <FoodRowItem
                key={food.id}
                food={food}
                onPress={() => openFood(food)}
              />
            ))}
            {isSearchActive && hasMore && (
              <TouchableOpacity
                onPress={() => void handleLoadMore()}
                disabled={isLoadingMore}
                style={{
                  paddingVertical: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLoadingMore ? (
                  <ActivityIndicator size="small" color={theme.colors.brandPrimary} />
                ) : (
                  <Text style={{ color: theme.colors.brandPrimary, fontWeight: '600', fontSize: 13 }}>
                    Tải thêm kết quả
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : !isSearching ? (
          <FoodSearchEmptyState
            isSearchActive={isSearchActive}
            activeTab={activeTab}
            onCreateCustom={() => navigation.navigate('CustomFoodForm', { date, meal })}
          />
        ) : null}
      </ScrollView>

      {/* ── 6. Hour / Meal Picker Dropdown Modal ────────────────────────────── */}
      <DateTimePickerModal
        visible={hourPickerVisible}
        initialDate={date}
        initialHour={selectedHour}
        onClose={() => setHourPickerVisible(false)}
        onConfirm={handleConfirmDateTime}
      />

      {/* ── 7. Nutritionist Note Modal ─────────────────────────────────────── */}
      <NutritionistNoteModal
        visible={nutritionNoteVisible}
        onClose={() => setNutritionNoteVisible(false)}
      />
    </SafeAreaView>
  );
}
