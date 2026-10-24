import React, { useMemo, useRef, useState } from 'react';
import {
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ChevronLeftIcon, PlusIcon, SearchIcon } from '@/components/icons';
import { useActivity } from '../ActivityProvider';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import {
  ActivityItemMeta,
  ActivitySection,
  ALPHABET,
  EXTENDED_ACTIVITIES,
} from '../extendedActivities';
import {
  ActivityRowItem,
  AlphabetIndexSidebar,
  AutoTrackBanner,
  CreateCustomActivityModal,
} from '../components';

// Re-export for external backwards compatibility
export { EXTENDED_ACTIVITIES, ActivityItemMeta, ActivitySection };

type Props = NativeStackScreenProps<RootStackParamList, 'AddActivity'>;

export function AddActivityScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { addActivityLog } = useActivity();
  const { state: nutritionState } = useNutrition();

  const selectedDate = route.params?.date || nutritionState.selectedDate || todayKey();

  const userWeight =
    nutritionState.weightLogs.length > 0
      ? nutritionState.weightLogs[nutritionState.weightLogs.length - 1].weightKg
      : 65;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('B');
  const [customModalVisible, setCustomModalVisible] = useState(false);

  const sectionListRef = useRef<SectionList<ActivityItemMeta, ActivitySection>>(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return EXTENDED_ACTIVITIES;
    const q = searchQuery.toLowerCase().trim();
    return EXTENDED_ACTIVITIES.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchQuery]);

  // Group by letter
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItemMeta[]> = {};
    filteredActivities.forEach((item) => {
      if (!groups[item.letter]) {
        groups[item.letter] = [];
      }
      groups[item.letter].push(item);
    });
    return groups;
  }, [filteredActivities]);

  const availableLetters = useMemo(() => Object.keys(groupedActivities).sort(), [groupedActivities]);

  const hasItemsMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    ALPHABET.forEach((letter) => {
      map[letter] = !!groupedActivities[letter] && groupedActivities[letter].length > 0;
    });
    return map;
  }, [groupedActivities]);

  const sections = useMemo<ActivitySection[]>(() => {
    return availableLetters.map((letter) => ({
      letter,
      data: groupedActivities[letter] || [],
    }));
  }, [availableLetters, groupedActivities]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      const first = viewableItems[0];
      const letter = first.section?.letter || first.item?.letter;
      if (letter) {
        setSelectedLetter(letter);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 10,
  }).current;

  const handleLetterPress = (letter: string) => {
    setSelectedLetter(letter);
    const sectionIndex = sections.findIndex((s) => s.letter === letter);
    if (sectionIndex !== -1 && sectionListRef.current) {
      try {
        sectionListRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          viewOffset: 0,
          animated: true,
        });
      } catch (err) {
        // Fallback safe catch
      }
    }
  };

  const handleItemPress = (item: ActivityItemMeta) => {
    if (item.id === 'c_badminton') {
      navigation.navigate('BadmintonWorkout', { date: selectedDate, activityName: item.name });
      return;
    }
    if (item.id === 'y_yoga') {
      navigation.navigate('YogaWorkout', { date: selectedDate, activityName: item.name });
      return;
    }
    if (item.id === 'p_pickleball') {
      navigation.navigate('PickleballWorkout', { date: selectedDate, activityName: item.name });
      return;
    }
    if (item.id === 'c_running') {
      navigation.navigate('RunningWorkout', { date: selectedDate, activityName: item.name });
      return;
    }
    if (item.id === 'd_cycling') {
      navigation.navigate('CyclingWorkout', { date: selectedDate, activityName: item.name });
      return;
    }

    navigation.navigate('ActivityWorkout', {
      activityId: item.id,
      activityName: item.name,
      met: item.met,
      date: selectedDate,
    });
  };

  const handleSaveCustomActivity = (
    name: string,
    durationMinutes: number,
    caloriesBurned: number
  ) => {
    addActivityLog({
      date: selectedDate,
      type: 'other',
      name,
      durationMinutes,
      caloriesBurned,
      source: 'MANUAL',
    });

    setCustomModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(8, insets.top) }]}>
      <StatusBar barStyle="light-content" backgroundColor="#120E22" />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thêm hoạt động</Text>

        <TouchableOpacity
          onPress={() => setCustomModalVisible(true)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.plusButton}
          accessibilityRole="button"
          accessibilityLabel="Tạo mới hoạt động"
        >
          <PlusIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerDivider} />

      {/* ── Fixed Top Section: Search Bar & Auto Track ─────── */}
      <View style={styles.fixedTopSection}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SearchIcon size={18} color="#7A7490" strokeWidth={2.4} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm hoạt động"
            placeholderTextColor="#68627D"
            style={styles.searchInput}
            selectionColor="#9E64F7"
          />
        </View>

        {/* THEO DÕI TỰ ĐỘNG Section */}
        {!searchQuery && (
          <AutoTrackBanner
            onPress={() => navigation.navigate('HealthSync')}
          />
        )}
      </View>

      {/* ── Scrollable Activities List & Alphabet Index ────── */}
      <View style={styles.contentRow}>
        <SectionList<ActivityItemMeta, ActivitySection>
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={80}
          maxToRenderPerBatch={80}
          windowSize={21}
          style={styles.sectionList}
          contentContainerStyle={[
            styles.sectionListContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              sectionListRef.current?.scrollToLocation({
                sectionIndex: info.index,
                itemIndex: 0,
                animated: true,
              });
            }, 60);
          }}
          renderSectionHeader={({ section: { letter } }) => (
            <View style={styles.letterHeaderWrapper}>
              <Text style={styles.letterHeader}>{letter}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ActivityRowItem item={item} onPress={handleItemPress} />
          )}
        />

        {/* ── Alphabet Sidebar Index on the Right ───────────── */}
        <AlphabetIndexSidebar
          alphabet={ALPHABET}
          selectedLetter={selectedLetter}
          hasItemsMap={hasItemsMap}
          onSelectLetter={handleLetterPress}
        />
      </View>

      {/* ── Fullscreen Modal: Tạo mới hoạt động ─────────────── */}
      <CreateCustomActivityModal
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
        onSave={handleSaveCustomActivity}
        userWeight={userWeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E22',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    textAlign: 'center',
  },
  plusButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  fixedTopSection: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#201A38',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginLeft: 10,
    paddingVertical: 0,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sectionList: {
    flex: 1,
  },
  sectionListContent: {
    paddingLeft: 18,
    paddingRight: 6,
  },
  letterHeaderWrapper: {
    backgroundColor: '#120E22',
    paddingTop: 10,
    paddingBottom: 6,
  },
  letterHeader: {
    color: '#9E9AA7',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
});
