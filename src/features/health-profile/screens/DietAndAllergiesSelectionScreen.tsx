import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { CheckIcon, ChevronLeftIcon, CloseXIcon, PlusIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { AnimatedCard, AnimatedRadio } from '../components';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import { COMMON_ALLERGIES } from '../types';

interface DietAndAllergiesSelectionScreenProps {
  navigation?: any;
  onNext?: () => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

interface DietPreferenceItem {
  key: string;
  label: string;
  desc: string;
}

const DIET_PREFERENCES: DietPreferenceItem[] = [
  { key: 'standard', label: 'Ăn đa dạng', desc: 'Không kiêng khem, ăn đầy đủ nhóm chất' },
  { key: 'eat_clean', label: 'Eat Clean', desc: 'Ưu tiên đồ tươi sống, ít chế biến, ít gia vị' },
  { key: 'flexitarian', label: 'Ăn chay linh hoạt', desc: 'Chủ yếu ăn chay, thỉnh thoảng có thịt cá' },
  { key: 'vegan', label: 'Ăn chay thuần', desc: '100% nguồn gốc thực vật, không thịt sữa trứng' },
  { key: 'keto', label: 'Keto / Low-Carb', desc: 'Giảm tối đa tinh bột, tăng chất béo tốt' },
  { key: 'mediterranean', label: 'Địa Trung Hải', desc: 'Nhiều cá, dầu ô liu, rau củ và ngũ cốc nguyên hạt' },
];

export function DietAndAllergiesSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: DietAndAllergiesSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const {
    draft,
    toggleAllergy,
    addCustomAllergy,
    updateDraft,
    setDietaryPreference,
  } = useHealthProfileDraft();

  const [selectedDiet, setSelectedDiet] = useState<string>(
    draft.dietaryPreference || 'standard'
  );
  const [customInput, setCustomInput] = useState('');

  const handleSelectDiet = (key: string) => {
    setSelectedDiet(key);
    setDietaryPreference(key);
  };

  const handleToggleAllergy = (allergy: string) => {
    toggleAllergy(allergy);
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed) {
      updateDraft('customAllergy', trimmed);
      addCustomAllergy();
      setCustomInput('');
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (navigation?.navigate) {
      navigation.navigate('HealthConditionsSelection');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar & Speech Bubble Row ─────────────────────────── */}
        <View style={styles.bubbleRow}>
          <View
            style={[
              styles.avatarWrap,
              {
                backgroundColor: isDark ? '#302657' : '#EDE5FF',
                borderColor: isDark ? '#9D6CFA' : '#D4C7F8',
              },
            ]}
          >
            <Image
              source={images.mascotAvatar}
              style={styles.avatarImage}
              resizeMode="cover"
              accessibilityLabel="Mascot Kallo"
            />
          </View>
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: '#FFFFFF',
                borderColor: isDark ? '#382D61' : theme.colors.surfaceBorder,
                borderWidth: 1,
              },
            ]}
          >
            <View
              style={[
                styles.bubbleTail,
                {
                  borderRightColor: '#FFFFFF',
                },
              ]}
            />
            <AppText
              style={[
                styles.bubbleText,
                { color: '#111827' },
              ]}
            >
              Sở thích ăn uống & dị ứng của bạn?
            </AppText>
          </View>
        </View>

        {/* ── Section 1: Chế độ ăn uống yêu thích ─────────────────── */}
        <View style={styles.section}>
          <AppText
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Chế độ ăn ưa thích
          </AppText>
          <AppText
            style={[
              styles.sectionSubtitle,
              { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
            ]}
          >
            Chọn chế độ ăn bạn muốn duy trì để Kallo gợi ý thực đơn phù hợp nhất
          </AppText>

          <View style={styles.dietList}>
            {DIET_PREFERENCES.map((item) => {
              const isSelected = selectedDiet === item.key;
              return (
                <AnimatedCard
                  key={item.key}
                  selected={isSelected}
                  onPress={() => handleSelectDiet(item.key)}
                  style={styles.dietCard}
                  selectedBorderColor={theme.colors.brandPrimary}
                  selectedBgColor={isDark ? '#231742' : theme.colors.brandSoftTint}
                  unselectedBorderColor={isDark ? '#2E2352' : theme.colors.surfaceBorder}
                  unselectedBgColor={isDark ? '#1A1433' : theme.colors.surfaceMid}
                  activeScale={0.97}
                  accessibilityRole="radio"
                  accessibilityLabel={`${item.label}, ${item.desc}`}
                >
                  <View style={styles.dietInner}>
                    <View style={styles.dietTextWrap}>
                      <AppText
                        style={[
                          styles.dietLabel,
                          {
                            color: isSelected
                              ? isDark
                                ? '#E9D5FF'
                                : theme.colors.brandPrimary
                              : isDark
                              ? '#E2E8F0'
                              : theme.colors.textPrimary,
                          },
                        ]}
                      >
                        {item.label}
                      </AppText>
                      <AppText
                        style={[
                          styles.dietDesc,
                          { color: isDark ? '#A098BD' : theme.colors.textSecondary },
                        ]}
                      >
                        {item.desc}
                      </AppText>
                    </View>
                    <AnimatedRadio
                      selected={isSelected}
                      activeColor={theme.colors.brandPrimary}
                      inactiveColor={isDark ? '#473B6B' : theme.colors.surfaceBorder}
                      size={22}
                    />
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        </View>

        {/* ── Section 2: Dị ứng thực phẩm ────────────────────────── */}
        <View style={styles.section}>
          <AppText
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Dị ứng & Kiêng kỵ thực phẩm
          </AppText>
          <AppText
            style={[
              styles.sectionSubtitle,
              { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
            ]}
          >
            Kallo sẽ tự động gắn cờ cảnh báo trong thực đơn nếu có món chứa các thành phần này
          </AppText>

          <View style={styles.pillsContainer}>
            {COMMON_ALLERGIES.map((allergy) => {
              const isSelected = draft.allergies.includes(allergy);
              return (
                <AnimatedCard
                  key={allergy}
                  selected={isSelected}
                  onPress={() => handleToggleAllergy(allergy)}
                  style={styles.allergyPill}
                  selectedBorderColor={theme.colors.brandPrimary}
                  selectedBgColor={theme.colors.brandPrimary}
                  unselectedBorderColor={isDark ? '#382C63' : theme.colors.surfaceBorder}
                  unselectedBgColor={isDark ? '#1F173B' : theme.colors.surfaceMid}
                  activeScale={0.93}
                  accessibilityRole="checkbox"
                  accessibilityLabel={allergy}
                >
                  <View style={styles.allergyPillInner}>
                    {isSelected ? (
                      <CheckIcon size={13} color="#FFFFFF" strokeWidth={2.4} />
                    ) : (
                      <PlusIcon
                        size={12}
                        color={isDark ? '#CBD5E1' : theme.colors.textSecondary}
                        strokeWidth={2.4}
                      />
                    )}
                    <AppText
                      style={[
                        styles.allergyPillText,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark
                            ? '#CBD5E1'
                            : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {allergy}
                    </AppText>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>

          {/* Custom Allergy Input */}
          <View
            style={[
              styles.customInputRow,
              {
                backgroundColor: isDark ? '#1E173C' : theme.colors.surfaceMid,
                borderColor: isDark ? '#34285D' : theme.colors.surfaceBorder,
              },
            ]}
          >
            <TextInput
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="Thành phần dị ứng khác (ví dụ: Thịt bò, mè...)"
              placeholderTextColor={isDark ? '#5B537F' : theme.colors.textDisabled}
              style={[
                styles.customTextInput,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
              returnKeyType="done"
              onSubmitEditing={handleAddCustom}
            />
            <TouchableOpacity
              onPress={handleAddCustom}
              activeOpacity={0.8}
              style={[
                styles.addCustomBtn,
                { backgroundColor: theme.colors.brandAction },
                !customInput.trim() && {
                  backgroundColor: isDark ? '#3D3163' : '#E4E0F0',
                },
              ]}
              disabled={!customInput.trim()}
            >
              <AppText
                style={[
                  styles.addCustomBtnText,
                  !customInput.trim() && !isDark && { color: '#A6A1B8' },
                ]}
              >
                Thêm
              </AppText>
            </TouchableOpacity>
          </View>

          {/* List of custom added allergies */}
          {draft.allergies.filter((a) => !COMMON_ALLERGIES.includes(a)).length > 0 && (
            <View style={styles.customPillsList}>
              <AppText
                style={[
                  styles.customPillsLabel,
                  { color: isDark ? '#94A3B8' : theme.colors.textSecondary },
                ]}
              >
                Đã thêm:
              </AppText>
              <View style={styles.pillsContainer}>
                {draft.allergies
                  .filter((a) => !COMMON_ALLERGIES.includes(a))
                  .map((customAllergy) => (
                    <TouchableOpacity
                      key={customAllergy}
                      onPress={() => handleToggleAllergy(customAllergy)}
                      activeOpacity={0.8}
                      style={[
                        styles.customAddedPill,
                        {
                          backgroundColor: theme.colors.brandPrimary,
                          borderColor: theme.colors.brandPrimary,
                        },
                      ]}
                    >
                      <CloseXIcon size={12} color="#FFFFFF" strokeWidth={2.4} />
                      <AppText style={styles.customAddedPillText}>
                        {customAllergy}
                      </AppText>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          )}
        </View>

        {/* ── Bottom Action Button ───────────────────────────────── */}
        <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.brandAction,
                shadowColor: theme.colors.brandPrimary,
              },
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục"
          >
            <AppText style={styles.buttonText}>Tiếp tục</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (hideHeader) {
    return <View style={styles.innerContainer}>{content}</View>;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: isDark ? '#120E29' : theme.colors.canvasBase,
        },
      ]}
    >
      {/* ── Top Bar ────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon
            size={26}
            color={isDark ? '#FFFFFF' : theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* ── Progress Bar: 92% ────────────────────────────────── */}
      <View
        style={[
          styles.progressTrack,
          {
            backgroundColor: isDark ? '#261F45' : theme.colors.surfaceBorder,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.brandPrimary,
              width: '92%',
            },
          ]}
        />
      </View>

      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  innerContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#261F45',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 3,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#302657',
    borderWidth: 2,
    borderColor: '#9D6CFA',
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#241B42',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#382D61',
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#241B42',
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 14,
  },
  dietList: {
    gap: 12,
  },
  dietCard: {
    padding: 16,
  },
  dietInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dietTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  dietLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 3,
  },
  dietLabelSelected: {
    color: '#E9D5FF',
  },
  dietDesc: {
    fontSize: 12.5,
    color: '#A098BD',
    lineHeight: 17,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  allergyPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  allergyPillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allergyPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  allergyPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E173C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#34285D',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  customTextInput: {
    flex: 1,
    height: 42,
    color: '#FFFFFF',
    fontSize: 14,
  },
  addCustomBtn: {
    backgroundColor: '#9D6CFA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addCustomBtnDisabled: {
    backgroundColor: '#3D3163',
  },
  addCustomBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  customPillsList: {
    marginTop: 12,
  },
  customPillsLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  customAddedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A78BFA',
  },
  customAddedPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: '#9D6CFA',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9D6CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
