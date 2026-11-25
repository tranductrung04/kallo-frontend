import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { normalizeSearch, todayKey } from '../utils';
import type { Food, MealSlot } from '../types';
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

export function FoodSearchScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { foods, state, cacheFood } = useNutrition();

  const initialDate = route.params?.date === 'today' || !route.params?.date ? todayKey() : route.params.date;
  const [date, setDate] = useState(initialDate);
  const [selectedHour, setSelectedHour] = useState(route.params.hour || '11:00');
  const [meal, setMeal] = useState<MealSlot>(
    route.params.meal || getMealSlotForHour(selectedHour)
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('recent');
  const [hourPickerVisible, setHourPickerVisible] = useState(false);
  const [nutritionNoteVisible, setNutritionNoteVisible] = useState(false);
  const [apiResults, setApiResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Query backend search API on debounced query
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setApiResults([]);
      setIsSearching(false);
      return;
    }

    let isCurrent = true;
    setIsSearching(true);

    searchFoodsApi({ q, page: 0, size: 30 })
      .then((pageData) => {
        if (!isCurrent) return;
        const mapped = (pageData.items ?? []).map(mapFoodSearchItemToFood);
        setApiResults(mapped);
        cacheFood(mapped);
      })
      .catch(() => {
        // Fallback gracefully on network error (will use local filtering)
        if (isCurrent) setApiResults([]);
      })
      .finally(() => {
        if (isCurrent) setIsSearching(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery, cacheFood]);

  // Fallback local search
  const localSearchResults = useMemo(() => {
    const term = normalizeSearch(debouncedQuery);
    if (!term) return [];
    return foods.filter((food) => normalizeSearch(food.name).includes(term));
  }, [debouncedQuery, foods]);

  // Combine API results and local results (avoiding duplicates)
  const searchResults = useMemo(() => {
    if (apiResults.length > 0) {
      const apiIds = new Set(apiResults.map((f) => f.id));
      const remainingLocal = localSearchResults.filter((f) => !apiIds.has(f.id));
      return [...apiResults, ...remainingLocal];
    }
    return localSearchResults;
  }, [apiResults, localSearchResults]);

  // Tab foods when query is empty
  const tabFoods = useMemo(() => {
    if (activeTab === 'recent') {
      return foods.filter((f) => state.recentFoodIds.includes(f.id));
    }
    if (activeTab === 'mine') {
      return foods.filter((f) => f.isCustom);
    }
    if (activeTab === 'favorite') {
      return foods.filter((f) => state.favoriteFoodIds.includes(f.id));
    }
    return [];
  }, [activeTab, foods, state.recentFoodIds, state.customFoods, state.favoriteFoodIds]);

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
  const isSearchActive = query.trim().length > 0;
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
