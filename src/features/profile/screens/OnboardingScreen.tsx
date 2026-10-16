import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppInput, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import type { ColorTokens } from '@/theme/colors';

import { saveHealthProfile, getApiErrorMessage } from '@/features/auth/api';
import { useAuth } from '@/features/auth/AuthProvider';
import { calculateHealthProfile, defaultMacroPercentages, updateMacroPercentage, type ActivityLevel, type Gender, type GoalType, type MacroName, type MacroPercentages, isValidAge, isValidHeight, isValidWeight, isValidWeeklyRate } from '../utils/calculations';
export { OnboardingCarouselScreen } from '@/features/auth/screens/OnboardingCarouselScreen';

type Draft = { dependent: string; gender: Gender; age: string; height: string; weight: string; activity: ActivityLevel; goal: GoalType; targetWeight: string; weeklyRate: string; allergies: string[]; customAllergy: string; macros: MacroPercentages };
const DRAFT_KEY = '@kallo/onboarding-draft';
const initialDraft: Draft = { dependent: 'me', gender: 'female', age: '', height: '', weight: '', activity: 'moderate', goal: 'maintain', targetWeight: '', weeklyRate: '0', allergies: [], customAllergy: '', macros: defaultMacroPercentages('maintain') };
const allergies = ['Hải sản', 'Đậu phộng', 'Sữa', 'Trứng', 'Gluten'];
const activityOptions: Array<[ActivityLevel, string]> = [['sedentary', 'Ít vận động'], ['light', 'Nhẹ'], ['moderate', 'Vừa'], ['high', 'Nhiều'], ['veryHigh', 'Rất nhiều']];
const goalOptions: Array<[GoalType, string]> = [['lose', 'Giảm cân'], ['maintain', 'Giữ cân'], ['gain', 'Tăng cân']];

export function OnboardingScreen() {
  const theme = useTheme();
  const { refreshProfileStatus } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    void AsyncStorage.getItem(DRAFT_KEY)
      .then((value) => {
        if (!value) return;
        try { setDraft({ ...initialDraft, ...JSON.parse(value) }); }
        catch { setDraft(initialDraft); }
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) void AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft)).catch(() => undefined);
  }, [draft, loaded]);
  const age = Number(draft.age);
  const height = Number(draft.height);
  const weight = Number(draft.weight);
  const targetWeight = Number(draft.targetWeight || draft.weight);
  const weeklyRate = Number(draft.weeklyRate || 0);
  const result = useMemo(() => isValidAge(age) && isValidHeight(height) && isValidWeight(weight) && isValidWeight(targetWeight) && isValidWeeklyRate(weeklyRate) ? calculateHealthProfile({ gender: draft.gender, age, heightCm: height, weightKg: weight, activityLevel: draft.activity, goalType: draft.goal, weeklyRateKg: weeklyRate, macroPercentages: draft.macros }) : undefined, [age, height, weight, targetWeight, weeklyRate, draft.gender, draft.activity, draft.goal, draft.macros]);
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateMacro = (name: MacroName, value: number) => setDraft((current) => ({ ...current, macros: updateMacroPercentage(current.macros, name, value) }));
  const validateStep = () => { if (step === 2 && !isValidAge(age)) return 'Tuổi phải từ 13 đến 120.'; if (step === 3 && !isValidHeight(height)) return 'Chiều cao phải từ 100 đến 250 cm.'; if (step === 3 && !isValidWeight(weight)) return 'Cân nặng phải từ 20 đến 300 kg.'; if (step === 5 && (!isValidWeight(targetWeight) || !isValidWeeklyRate(weeklyRate))) return 'Cân nặng mục tiêu hoặc tốc độ thay đổi không hợp lệ.'; return undefined; };
  const next = () => { const validationError = validateStep(); if (validationError) { setError(validationError); return; } setError(undefined); setStep((current) => Math.min(9, current + 1)); };
  const save = async () => {
    if (!result) { setError('Vui lòng hoàn tất thông tin hồ sơ hợp lệ.'); return; }
    setSaving(true);
    setError(undefined);
    try {
      await saveHealthProfile({ gender: draft.gender, birthDate: `${new Date().getFullYear() - age}-01-01`, heightCm: height, weightKg: weight, activityLevel: draft.activity, goalType: draft.goal, targetWeightKg: targetWeight, weeklyRateKg: weeklyRate, allergies: draft.allergies, bmi: result.bmi, bmr: result.bmr, tdee: result.tdee, dailyCalorieGoal: result.dailyCalorieGoal, proteinGoalGrams: result.macros.proteinGrams, carbsGoalGrams: result.macros.carbsGrams, fatGoalGrams: result.macros.fatGrams, waterGoalMl: Math.round(weight * 35) });
      await AsyncStorage.removeItem(DRAFT_KEY);
      await refreshProfileStatus();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };
  if (!loaded) return <View style={[styles.safe, { backgroundColor: theme.colors.background }]} />;
  return <ScrollView style={[styles.safe, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}><ProgressBar value={(step + 1) / 10} /><AppText variant="caption" color={theme.colors.textMuted}>Bước {step + 1}/10</AppText>{renderStep(step, draft, update, theme.colors, result, updateMacro)}{error ? <AppText variant="caption" color={theme.colors.danger} accessibilityLiveRegion="polite">{error}</AppText> : null}<View style={styles.actions}>{step > 0 ? <AppButton label="Quay lại" variant="ghost" onPress={() => { setError(undefined); setStep((current) => current - 1); }} /> : null}{step < 9 ? <AppButton label="Tiếp tục" onPress={next} /> : <AppButton label="Lưu hồ sơ và bắt đầu" loading={saving} onPress={save} />}</View></ScrollView>;
}

function renderStep(step: number, draft: Draft, update: <K extends keyof Draft>(key: K, value: Draft[K]) => void, colors: ColorTokens, result: ReturnType<typeof calculateHealthProfile> | undefined, updateMacro: (name: MacroName, value: number) => void) {
  if (step === 0) return <IntroStep image={images.onboardingMascot} title="Chào mừng bạn đến Kallo" text="Cùng xây dựng thói quen khỏe mạnh từng ngày." />;
  if (step === 1) return <ChoiceStep title="Bạn đang thiết lập cho ai?" options={[['me', images.dependentMe, 'Cho tôi'], ['sister', images.dependentSister, 'Người thân'], ['son', images.dependentSon, 'Con của tôi']]} value={draft.dependent} onChange={(value) => update('dependent', value)} />;
  if (step === 2) return <View style={styles.section}><IntroStep image={draft.gender === 'female' ? images.genderFemale : images.genderMale} title="Thông tin cơ bản" text="Chọn giới tính và nhập tuổi của bạn." /><ChoicePills options={[['female', 'Nữ'], ['male', 'Nam'], ['other', 'Khác']]} value={draft.gender} onChange={(value) => update('gender', value as Gender)} /><AppInput label="Tuổi" value={draft.age} onChangeText={(value) => update('age', value)} keyboardType="number-pad" placeholder="Ví dụ: 28" /></View>;
  if (step === 3) return <View style={styles.section}><IntroStep image={images.weightScale} title="Chiều cao và cân nặng" text="Thông tin giúp tính chỉ số cơ thể chính xác hơn." /><AppInput label="Chiều cao (cm)" value={draft.height} onChangeText={(value) => update('height', value)} keyboardType="decimal-pad" placeholder="100 - 250" /><AppInput label="Cân nặng (kg)" value={draft.weight} onChangeText={(value) => update('weight', value)} keyboardType="decimal-pad" placeholder="20 - 300" /></View>;
  if (step === 4) return <View style={styles.section}><AppText variant="heading">Mức độ vận động</AppText><ChoicePills options={activityOptions} value={draft.activity} onChange={(value) => update('activity', value as ActivityLevel)} /><AppText variant="heading">Mục tiêu</AppText><ChoicePills options={goalOptions} value={draft.goal} onChange={(value) => { const goal = value as GoalType; update('goal', goal); update('macros', defaultMacroPercentages(goal)); }} /></View>;
  if (step === 5) return <View style={styles.section}><IntroStep image={draft.goal === 'gain' ? images.weightGain : images.weightLoss} title="Đặt mục tiêu cụ thể" text="Tốc độ thay đổi an toàn tối đa là 1 kg mỗi tuần." /><AppInput label="Cân nặng mục tiêu (kg)" value={draft.targetWeight} onChangeText={(value) => update('targetWeight', value)} keyboardType="decimal-pad" placeholder="Ví dụ: 60" /><AppInput label="Tốc độ thay đổi mỗi tuần (kg)" value={draft.weeklyRate} onChangeText={(value) => update('weeklyRate', value)} keyboardType="decimal-pad" placeholder="0 - 1" /></View>;
  if (step === 6) return <IntroStep image={images.deficitStep0} title="Hiểu về thâm hụt calo" text="Mục tiêu phù hợp giúp thay đổi bền vững. Kallo luôn ưu tiên giới hạn an toàn." />;
  if (step === 7) return <View style={styles.section}><AppText variant="heading">Dị ứng hoặc kiêng kỵ</AppText><AppText color={colors.textMuted}>Chọn mọi thành phần bạn muốn tránh.</AppText><ChoicePills options={allergies.map((item) => [item, item] as [string, string])} value="" multi values={draft.allergies} onChange={(value) => update('allergies', draft.allergies.includes(value) ? draft.allergies.filter((item) => item !== value) : [...draft.allergies, value])} /><AppInput label="Thành phần khác" value={draft.customAllergy} onChangeText={(value) => update('customAllergy', value)} placeholder="Nhập và bấm Thêm" /><AppButton label="Thêm dị ứng" variant="outline" onPress={() => { if (draft.customAllergy.trim() && !draft.allergies.includes(draft.customAllergy.trim())) { update('allergies', [...draft.allergies, draft.customAllergy.trim()]); update('customAllergy', ''); } }} /></View>;
  if (step === 8) return <View style={styles.section}><IntroStep image={images.notificationBackground} title="Bật nhắc nhở hữu ích" text="Cho phép thông báo và dữ liệu sức khỏe để Kallo hỗ trợ tốt hơn. Bạn có thể bật sau trong Cài đặt." /></View>;
  return <SummaryStep result={result} macros={draft.macros} colors={colors} onMacroChange={updateMacro} />;
}

function IntroStep({ image, title, text }: { image: ImageSourcePropType; title: string; text: string }) { const theme = useTheme(); return <View style={styles.intro}><Image source={image} style={styles.stepImage} resizeMode="contain" accessibilityLabel={title} /><AppText variant="title" align="center">{title}</AppText><AppText align="center" color={theme.colors.textMuted}>{text}</AppText></View>; }

function ChoiceStep({ title, options, value, onChange }: { title: string; options: Array<[string, ImageSourcePropType, string]>; value: string; onChange: (value: string) => void }) {
  const theme = useTheme();
  return <View style={styles.section}><AppText variant="heading">{title}</AppText><View style={styles.choiceGrid}>{options.map(([key, image, label]) => {
    const isSelected = value === key;
    return <Pressable key={key} onPress={() => onChange(key)} accessibilityRole="radio" accessibilityState={{ selected: isSelected }} style={[styles.choice, { borderColor: isSelected ? theme.colors.primary : theme.colors.border, backgroundColor: isSelected ? theme.colors.primarySurface : theme.colors.surface }]}><Image source={image} style={styles.choiceImage} resizeMode="contain" accessibilityLabel={label} /><AppText align="center" color={isSelected ? theme.colors.primaryPressed : theme.colors.text}>{label}</AppText></Pressable>;
  })}</View></View>;
}
function ChoicePills({ options, value, values, multi, onChange }: { options: Array<[string, string]>; value: string; values?: string[]; multi?: boolean; onChange: (value: string) => void }) { const theme = useTheme(); return <View style={styles.pills}>{options.map(([key, label]) => { const selected = multi ? Boolean(values?.includes(key)) : value === key; return <Pressable key={key} onPress={() => onChange(key)} accessibilityRole="radio" accessibilityState={{ selected }} style={[styles.pill, { borderColor: selected ? theme.colors.primary : theme.colors.border, backgroundColor: selected ? theme.colors.primarySurface : theme.colors.surface }]}><AppText color={selected ? theme.colors.primaryPressed : theme.colors.text}>{label}</AppText></Pressable>; })}</View>; }
function SummaryStep({ result, macros, colors, onMacroChange }: { result: ReturnType<typeof calculateHealthProfile> | undefined; macros: MacroPercentages; colors: ColorTokens; onMacroChange: (name: MacroName, value: number) => void }) { if (!result) return <AppText>Chưa đủ dữ liệu để tính kết quả.</AppText>; const macroTotal = macros.protein + macros.carbs + macros.fat; return <View style={styles.section}><IntroStep image={images.onboardingWaiting} title="Hồ sơ của bạn đã sẵn sàng" text="Các chỉ số được tính theo thông tin bạn cung cấp." /><View style={styles.metrics}>{[['BMI', result.bmi.toFixed(1)], ['BMR', `${Math.round(result.bmr)} kcal`], ['TDEE', `${Math.round(result.tdee)} kcal`], ['Mục tiêu calo', `${result.dailyCalorieGoal} kcal`]].map(([label, value]) => <AppCard key={label}><AppText variant="caption" color={colors.textMuted}>{label}</AppText><AppText variant="heading">{value}</AppText></AppCard>)}</View>{result.unsafe ? <AppText color={colors.warning}>Mức giảm đã vượt giới hạn an toàn. Kallo đã điều chỉnh calo tối thiểu.</AppText> : null}<AppText variant="heading">Tỷ lệ macro</AppText>{(['protein', 'carbs', 'fat'] as MacroName[]).map((name) => <AppInput key={name} label={`${name === 'protein' ? 'Protein' : name === 'carbs' ? 'Carbs' : 'Fat'} (%)`} value={String(Math.round(macros[name]))} onChangeText={(value) => onMacroChange(name, Number(value))} keyboardType="number-pad" />)}<AppText variant="caption" color={colors.textMuted}>Tổng macro: {Math.round(macroTotal)}%.</AppText></View>; }

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 20, gap: 12, paddingBottom: 36 }, section: { gap: 14 }, intro: { alignItems: 'center', gap: 10, marginBottom: 8 }, stepImage: { width: '100%', height: 180 }, choiceGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' }, choice: { flex: 1, minWidth: 96, borderWidth: 1, borderColor: '#D8E5DD', borderRadius: 14, padding: 10, alignItems: 'center', gap: 8 }, choiceSelected: { borderColor: '#2ECC71', backgroundColor: '#EAFAF1' }, choiceImage: { width: 72, height: 72 }, pills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }, pill: { minHeight: 44, borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 10 } });
