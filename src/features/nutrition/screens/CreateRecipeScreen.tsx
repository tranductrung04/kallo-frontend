import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ChevronLeftIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useNutrition } from '../NutritionProvider';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRecipe'>;

type IngredientItem = {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type RecipeStep = {
  id: string;
  instruction: string;
};

export function CreateRecipeScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { foods, saveCustomFood } = useNutrition();

  const [recipeName, setRecipeName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [servings, setServings] = useState(1);
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);

  // Ingredients list
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  // Cooking steps list
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  // Add ingredient modal state
  const [addIngredientVisible, setAddIngredientVisible] = useState(false);
  const [ingName, setIngName] = useState('');
  const [ingGrams, setIngGrams] = useState('100');
  const [ingCalories, setIngCalories] = useState('150');
  const [ingProtein, setIngProtein] = useState('10');
  const [ingCarbs, setIngCarbs] = useState('20');
  const [ingFat, setIngFat] = useState('5');
  const [selectedPresetFoodId, setSelectedPresetFoodId] = useState<string | null>(null);

  // Dynamic theme shortcuts
  const primaryBrand = colors.brandPrimary || '#9E64F7';

  // Pick image from device gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể chọn ảnh từ thiết bị.');
    }
  };

  // Calculations for total nutrients
  const totals = useMemo(() => {
    const cal = ingredients.reduce((sum, item) => sum + item.calories, 0);
    const p = ingredients.reduce((sum, item) => sum + item.protein, 0);
    const c = ingredients.reduce((sum, item) => sum + item.carbs, 0);
    const f = ingredients.reduce((sum, item) => sum + item.fat, 0);
    const weight = ingredients.reduce((sum, item) => sum + item.grams, 0);

    const macroGrams = p + c + f;
    const proteinPct = macroGrams > 0 ? Math.round((p / macroGrams) * 100) : 0;
    const carbsPct = macroGrams > 0 ? Math.round((c / macroGrams) * 100) : 0;
    const fatPct = macroGrams > 0 ? Math.round((f / macroGrams) * 100) : 0;

    return {
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      totalGrams: weight,
      proteinPct,
      carbsPct,
      fatPct,
    };
  }, [ingredients]);

  // Per-serving values
  const perServing = useMemo(() => {
    const s = Math.max(1, servings);
    return {
      calories: Math.round(totals.calories / s),
      protein: Math.round((totals.protein / s) * 10) / 10,
      carbs: Math.round((totals.carbs / s) * 10) / 10,
      fat: Math.round((totals.fat / s) * 10) / 10,
    };
  }, [totals, servings]);

  // Handle adding an ingredient
  const handleConfirmAddIngredient = () => {
    if (!ingName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên nguyên liệu.');
      return;
    }
    const grams = parseFloat(ingGrams) || 100;
    const cal = parseFloat(ingCalories) || 0;
    const p = parseFloat(ingProtein) || 0;
    const c = parseFloat(ingCarbs) || 0;
    const f = parseFloat(ingFat) || 0;

    const newItem: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: ingName.trim(),
      grams,
      calories: Math.round(cal),
      protein: p,
      carbs: c,
      fat: f,
    };

    setIngredients((prev) => [...prev, newItem]);
    setAddIngredientVisible(false);

    // Reset inputs
    setIngName('');
    setIngGrams('100');
    setIngCalories('150');
    setIngProtein('10');
    setIngCarbs('20');
    setIngFat('5');
    setSelectedPresetFoodId(null);
  };

  const handleSelectPresetFood = (foodId: string) => {
    const f = foods.find((item) => item.id === foodId);
    if (!f) return;
    setSelectedPresetFoodId(f.id);
    setIngName(f.name);
    const g = 100;
    setIngGrams(String(g));
    setIngCalories(String(f.calories));
    setIngProtein(String(f.protein));
    setIngCarbs(String(f.carbs));
    setIngFat(String(f.fat));
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  // Cooking steps
  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        instruction: '',
      },
    ]);
  };

  const updateStepInstruction = (id: string, text: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, instruction: text } : s))
    );
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  // Save recipe
  const handleSaveRecipe = () => {
    if (!recipeName.trim()) {
      Alert.alert('Chưa nhập tên món', 'Vui lòng nhập tên món ăn cho công thức.');
      return;
    }

    const servingGrams = totals.totalGrams > 0 ? Math.round(totals.totalGrams / servings) : 100;

    const newFoodId = saveCustomFood({
      name: recipeName.trim(),
      servingGrams,
      calories: perServing.calories,
      protein: perServing.protein,
      carbs: perServing.carbs,
      fat: perServing.fat,
      allergens: [],
    });

    Alert.alert('Thành công', `Đã lưu công thức "${recipeName.trim()}"!`, [
      {
        text: 'Xem chi tiết',
        onPress: () => {
          navigation.replace('FoodDetail', {
            foodId: newFoodId,
            date: route.params.date,
            meal: route.params.meal,
            source: 'CUSTOM',
          });
        },
      },
      {
        text: 'Đóng',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const canSave = recipeName.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.canvasBase }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.canvasBase}
      />

      <SafeAreaView edges={['top']} style={styles.safeContainer}>
        {/* ── 1. Top Header ─────────────────────────────────────────── */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon
              size={24}
              color={isDark ? '#FFFFFF' : colors.textPrimary}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#FFFFFF' : colors.textPrimary },
            ]}
          >
            Tạo mới công thức
          </Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 2. Hình ảnh (Image Upload Section with food_default.webp) ─ */}
          <Text
            style={[
              styles.sectionHeaderTitle,
              { color: isDark ? '#FFFFFF' : colors.textPrimary },
            ]}
          >
            Hình ảnh
          </Text>

          <View style={styles.imageSection}>
            <View
              style={[
                styles.imageBox,
                {
                  backgroundColor: isDark ? '#1E1A2E' : '#F1EFF9',
                  borderColor: isDark ? '#2F2945' : '#E4E0F0',
                },
              ]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              ) : (
                <Image
                  source={images.foodDefault}
                  style={styles.placeholderFoodImage}
                  resizeMode="contain"
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={pickImage}
              activeOpacity={0.7}
              accessibilityLabel="Tải lên ảnh mới"
            >
              <Text style={[styles.uploadBtnText, { color: primaryBrand }]}>
                + Tải lên ảnh mới
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── 3. Tên món ăn (Food Name Input) ───────────────────────── */}
          <View style={styles.foodNameSection}>
            <Text
              style={[
                styles.foodNameLabel,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              Tên món ăn
            </Text>
            <TextInput
              value={recipeName}
              onChangeText={setRecipeName}
              placeholder="Granola sữa chua trái cây"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.foodNameInput,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
              autoCapitalize="sentences"
            />
          </View>

          {/* Thin underline separator */}
          <View
            style={[
              styles.underlineDivider,
              { backgroundColor: isDark ? '#262038' : '#E4E0F0' },
            ]}
          />

          {/* ── 4. Giá trị dinh dưỡng (Nutritional Values) ────────────── */}
          <Text
            style={[
              styles.nutritionNoticeText,
              { color: isDark ? '#C4BED7' : colors.textSecondary },
            ]}
          >
            * Giá trị dinh dưỡng được quy đổi cho 1 khẩu phần.
          </Text>

          {/* Macro Summary Row */}
          <View style={styles.macroSummaryRow}>
            {/* Calorie Ring */}
            <View style={styles.calRingContainer}>
              <View
                style={[
                  styles.calRingCircle,
                  {
                    backgroundColor: isDark ? '#161224' : '#FFFFFF',
                    borderColor: isDark ? '#2A2440' : '#E4E0F0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.calRingNumber,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {perServing.calories}
                </Text>
                <Text style={styles.calRingLabel}>Cal</Text>
              </View>
            </View>

            {/* Protein */}
            <View style={styles.macroCol}>
              <View style={[styles.macroPctPill, { backgroundColor: '#FF5252' }]}>
                <Text style={styles.macroPctText}>{totals.proteinPct} %</Text>
              </View>
              <Text
                style={[
                  styles.macroValueText,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                {perServing.protein} g
              </Text>
              <Text style={styles.macroLabelText}>⚡ CHẤT ĐẠM</Text>
            </View>

            {/* Carbs */}
            <View style={styles.macroCol}>
              <View style={[styles.macroPctPill, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.macroPctText}>{totals.carbsPct} %</Text>
              </View>
              <Text
                style={[
                  styles.macroValueText,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                {perServing.carbs} g
              </Text>
              <Text style={styles.macroLabelText}>🌾 ĐƯỜNG BỘT</Text>
            </View>

            {/* Fat */}
            <View style={styles.macroCol}>
              <View style={[styles.macroPctPill, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.macroPctText}>{totals.fatPct} %</Text>
              </View>
              <Text
                style={[
                  styles.macroValueText,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                {perServing.fat} g
              </Text>
              <Text style={styles.macroLabelText}>💧 CHẤT BÉO</Text>
            </View>
          </View>

          {/* Dropdown: Hiển thị giá trị dinh dưỡng ∨ */}
          <TouchableOpacity
            style={[
              styles.detailsToggleBtn,
              {
                backgroundColor: isDark ? '#1E1A2E' : '#EDE8F8',
                borderColor: isDark ? '#2D2742' : '#DDD5F3',
              },
            ]}
            onPress={() => setShowNutritionDetails((prev) => !prev)}
            activeOpacity={0.8}
            accessibilityLabel="Hiển thị giá trị dinh dưỡng"
          >
            <Text style={[styles.detailsToggleText, { color: primaryBrand }]}>
              Hiển thị giá trị dinh dưỡng
            </Text>
            <Text style={[styles.detailsToggleChevron, { color: primaryBrand }]}>
              {showNutritionDetails ? '∧' : '∨'}
            </Text>
          </TouchableOpacity>

          {/* Expanded extra nutrients */}
          {showNutritionDetails && (
            <View
              style={[
                styles.expandedNutrientCard,
                {
                  backgroundColor: isDark ? '#171324' : '#F1EFF9',
                  borderColor: isDark ? '#28223B' : '#E4E0F0',
                },
              ]}
            >
              <View style={styles.nutrientRow}>
                <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
                  Tổng trọng lượng
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {totals.totalGrams} g (1 phần: {Math.round(totals.totalGrams / Math.max(1, servings))} g)
                </Text>
              </View>
              <View style={styles.nutrientRow}>
                <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
                  Chất xơ (ước tính)
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {Math.round((perServing.carbs * 0.1) * 10) / 10} g
                </Text>
              </View>
              <View style={styles.nutrientRow}>
                <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
                  Đường tự nhiên
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {Math.round((perServing.carbs * 0.2) * 10) / 10} g
                </Text>
              </View>
              <View style={styles.nutrientRow}>
                <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
                  Natri
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  ~85 mg
                </Text>
              </View>
            </View>
          )}

          {/* ── 5. Nguyên liệu của công thức này (Ingredients Section) ─ */}
          <View style={styles.sectionHeaderWrap}>
            <Text
              style={[
                styles.sectionLargeTitle,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              Nguyên liệu của công thức này
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                { color: isDark ? '#9C95B3' : colors.textSecondary },
              ]}
            >
              Nhập nguyên liệu cho món ăn mà bạn tạo mới
            </Text>
          </View>

          {/* Portion Stepper Row */}
          <View style={styles.portionRow}>
            <Text
              style={[
                styles.portionLabel,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              Khẩu phần
            </Text>

            <View
              style={[
                styles.stepperPill,
                {
                  backgroundColor: isDark ? '#1E1A2E' : '#FFFFFF',
                  borderColor: isDark ? '#2D2742' : '#E4E0F0',
                },
              ]}
            >
              {/* Minus */}
              <TouchableOpacity
                style={[
                  styles.stepperMinusBtn,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                  },
                  servings <= 1 && styles.stepperBtnDisabled,
                ]}
                onPress={() => setServings((prev) => Math.max(1, prev - 1))}
                disabled={servings <= 1}
                accessibilityLabel="Giảm khẩu phần"
              >
                <Text
                  style={[
                    styles.stepperMinusText,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    servings <= 1 && styles.stepperTextDisabled,
                  ]}
                >
                  —
                </Text>
              </TouchableOpacity>

              {/* Number */}
              <Text
                style={[
                  styles.stepperNumberText,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                {servings}
              </Text>

              {/* Plus */}
              <TouchableOpacity
                style={[styles.stepperPlusBtn, { backgroundColor: primaryBrand }]}
                onPress={() => setServings((prev) => prev + 1)}
                accessibilityLabel="Tăng khẩu phần"
              >
                <Text style={styles.stepperPlusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredients list if any */}
          {ingredients.length > 0 && (
            <View style={styles.ingredientsList}>
              {ingredients.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.ingredientCard,
                    {
                      backgroundColor: isDark ? '#1A1629' : '#FFFFFF',
                      borderColor: isDark ? '#2B2540' : '#E4E0F0',
                    },
                  ]}
                >
                  <View style={styles.ingredientInfo}>
                    <Text
                      style={[
                        styles.ingredientName,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.ingredientMeta,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.grams}g • {item.calories} kcal (P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g)
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeIngredient(item.id)}
                    style={styles.ingredientDeleteBtn}
                    accessibilityLabel="Xóa nguyên liệu"
                  >
                    <Text style={styles.ingredientDeleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* "+ Thêm" button */}
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setAddIngredientVisible(true)}
            activeOpacity={0.7}
            accessibilityLabel="Thêm nguyên liệu"
          >
            <Text style={[styles.addItemBtnText, { color: primaryBrand }]}>
              + Thêm
            </Text>
          </TouchableOpacity>

          {/* Horizontal section divider */}
          <View
            style={[
              styles.sectionDividerLine,
              { backgroundColor: isDark ? '#262038' : '#E4E0F0' },
            ]}
          />

          {/* ── 6. Hướng dẫn thực hiện (Cooking Instructions Section) ── */}
          <View style={styles.sectionHeaderWrap}>
            <Text
              style={[
                styles.sectionLargeTitle,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              Hướng dẫn thực hiện
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                { color: isDark ? '#9C95B3' : colors.textSecondary },
              ]}
            >
              Thêm hướng dẫn cách nấu của món ăn
            </Text>
          </View>

          {/* Steps list */}
          {steps.map((step, idx) => (
            <View
              key={step.id}
              style={[
                styles.stepItemWrap,
                {
                  backgroundColor: isDark ? '#1A1629' : '#FFFFFF',
                  borderColor: isDark ? '#2B2540' : '#E4E0F0',
                },
              ]}
            >
              <View style={styles.stepHeaderRow}>
                <Text style={[styles.stepNumberTitle, { color: primaryBrand }]}>
                  Bước {idx + 1}
                </Text>
                <TouchableOpacity
                  onPress={() => removeStep(step.id)}
                  style={styles.stepRemoveBtn}
                >
                  <Text style={styles.stepRemoveText}>Xóa</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={step.instruction}
                onChangeText={(text) => updateStepInstruction(step.id, text)}
                placeholder={`Mô tả bước ${idx + 1}...`}
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.stepInput,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
                multiline
              />
            </View>
          ))}

          {/* "+ Thêm bước hướng dẫn" button */}
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={addStep}
            activeOpacity={0.7}
            accessibilityLabel="Thêm bước hướng dẫn"
          >
            <Text style={[styles.addItemBtnText, { color: primaryBrand }]}>
              + Thêm bước hướng dẫn
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── 7. Bottom CTA Button: Lưu công thức ───────────────────────── */}
        <View
          style={[
            styles.bottomBarContainer,
            {
              backgroundColor: isDark
                ? 'rgba(13, 11, 20, 0.95)'
                : 'rgba(248, 247, 252, 0.95)',
              borderTopColor: isDark ? '#1F1A2E' : '#E4E0F0',
              paddingBottom: Math.max(insets.bottom, 16) + 4,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.saveRecipeBtn,
              canSave
                ? [styles.saveRecipeBtnActive, { backgroundColor: primaryBrand, shadowColor: primaryBrand }]
                : isDark
                ? styles.saveRecipeBtnDisabledDark
                : styles.saveRecipeBtnDisabledLight,
            ]}
            disabled={!canSave}
            onPress={handleSaveRecipe}
            activeOpacity={0.85}
            accessibilityLabel="Lưu công thức"
          >
            <Text
              style={[
                styles.saveRecipeBtnText,
                canSave
                  ? styles.saveRecipeTextActive
                  : isDark
                  ? styles.saveRecipeTextDisabledDark
                  : styles.saveRecipeTextDisabledLight,
              ]}
            >
              Lưu công thức
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Add Ingredient Modal (Theme Adaptive) ─────────────────────── */}
      <Modal
        visible={addIngredientVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddIngredientVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheetContent,
              {
                backgroundColor: isDark ? '#181427' : '#FFFFFF',
                borderColor: isDark ? '#2E2744' : '#E4E0F0',
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              Thêm nguyên liệu
            </Text>

            {/* Quick preset suggestions */}
            <Text
              style={[
                styles.modalSubtitle,
                { color: isDark ? '#9C95B3' : colors.textSecondary },
              ]}
            >
              Gợi ý nhanh từ danh mục:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetScroll}
            >
              {foods.slice(0, 8).map((f) => {
                const isSelected = selectedPresetFoodId === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isSelected
                          ? primaryBrand
                          : isDark
                          ? '#241E36'
                          : '#F1EFF9',
                        borderColor: isSelected
                          ? primaryBrand
                          : isDark
                          ? '#362E4F'
                          : '#E4E0F0',
                      },
                    ]}
                    onPress={() => handleSelectPresetFood(f.id)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark
                            ? '#C4BED7'
                            : colors.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {f.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Manual input fields */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: isDark ? '#A59EBD' : colors.textSecondary },
                ]}
              >
                Tên nguyên liệu
              </Text>
              <TextInput
                value={ingName}
                onChangeText={setIngName}
                placeholder="Ví dụ: Yến mạch, sữa chua, mật ong..."
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: isDark ? '#201A33' : '#F8F7FC',
                    borderColor: isDark ? '#322A4E' : '#E4E0F0',
                    color: isDark ? '#FFFFFF' : colors.textPrimary,
                  },
                ]}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: isDark ? '#A59EBD' : colors.textSecondary },
                  ]}
                >
                  Khối lượng (g)
                </Text>
                <TextInput
                  value={ingGrams}
                  onChangeText={setIngGrams}
                  keyboardType="decimal-pad"
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? '#201A33' : '#F8F7FC',
                      borderColor: isDark ? '#322A4E' : '#E4E0F0',
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: isDark ? '#A59EBD' : colors.textSecondary },
                  ]}
                >
                  Calo (kcal)
                </Text>
                <TextInput
                  value={ingCalories}
                  onChangeText={setIngCalories}
                  keyboardType="decimal-pad"
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? '#201A33' : '#F8F7FC',
                      borderColor: isDark ? '#322A4E' : '#E4E0F0',
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: isDark ? '#A59EBD' : colors.textSecondary },
                  ]}
                >
                  Protein (g)
                </Text>
                <TextInput
                  value={ingProtein}
                  onChangeText={setIngProtein}
                  keyboardType="decimal-pad"
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? '#201A33' : '#F8F7FC',
                      borderColor: isDark ? '#322A4E' : '#E4E0F0',
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: isDark ? '#A59EBD' : colors.textSecondary },
                  ]}
                >
                  Carbs (g)
                </Text>
                <TextInput
                  value={ingCarbs}
                  onChangeText={setIngCarbs}
                  keyboardType="decimal-pad"
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? '#201A33' : '#F8F7FC',
                      borderColor: isDark ? '#322A4E' : '#E4E0F0',
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: isDark ? '#A59EBD' : colors.textSecondary },
                  ]}
                >
                  Fat (g)
                </Text>
                <TextInput
                  value={ingFat}
                  onChangeText={setIngFat}
                  keyboardType="decimal-pad"
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? '#201A33' : '#F8F7FC',
                      borderColor: isDark ? '#322A4E' : '#E4E0F0',
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[
                  styles.modalCancelBtn,
                  {
                    backgroundColor: isDark ? '#241E36' : '#F1EFF9',
                  },
                ]}
                onPress={() => setAddIngredientVisible(false)}
              >
                <Text
                  style={[
                    styles.modalCancelText,
                    { color: isDark ? '#C4BED7' : colors.textSecondary },
                  ]}
                >
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  { backgroundColor: primaryBrand },
                ]}
                onPress={handleConfirmAddIngredient}
              >
                <Text style={styles.modalConfirmText}>Thêm vào công thức</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  headerRightPlaceholder: {
    width: 44,
  },

  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  // 1. Hình ảnh
  sectionHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    marginBottom: 14,
  },
  imageSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageBox: {
    width: 125,
    height: 125,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderFoodImage: {
    width: 82,
    height: 82,
  },
  uploadBtn: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  uploadBtnText: {
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // 2. Tên món ăn
  foodNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  foodNameLabel: {
    fontSize: 15,
    fontWeight: '600',
    width: 100,
  },
  foodNameInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  underlineDivider: {
    height: 1,
    marginBottom: 16,
  },

  // 3. Giá trị dinh dưỡng
  nutritionNoticeText: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 16,
  },
  macroSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  calRingContainer: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calRingCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calRingNumber: {
    fontSize: 17.5,
    fontWeight: '700',
  },
  calRingLabel: {
    fontSize: 11.5,
    color: '#A59EBD',
    marginTop: -2,
  },
  macroCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  macroPctPill: {
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroPctText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  macroValueText: {
    fontSize: 17,
    fontWeight: '700',
  },
  macroLabelText: {
    fontSize: 10.5,
    color: '#A59EBD',
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Dropdown Button
  detailsToggleBtn: {
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 6,
    borderWidth: 1,
  },
  detailsToggleText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  detailsToggleChevron: {
    fontSize: 13,
    fontWeight: '700',
  },
  expandedNutrientCard: {
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  nutrientLabel: {
    fontSize: 13.5,
  },
  nutrientValue: {
    fontSize: 13.5,
    fontWeight: '600',
  },

  // 4. Nguyên liệu của công thức này
  sectionHeaderWrap: {
    marginTop: 26,
    marginBottom: 14,
  },
  sectionLargeTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  portionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  portionLabel: {
    fontSize: 15.5,
    fontWeight: '500',
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 6,
    height: 44,
  },
  stepperMinusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.35,
  },
  stepperMinusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepperTextDisabled: {
    color: '#8E88A8',
  },
  stepperNumberText: {
    fontSize: 16.5,
    fontWeight: '700',
    paddingHorizontal: 18,
  },
  stepperPlusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperPlusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },

  // Ingredients List
  ingredientsList: {
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  ingredientInfo: {
    flex: 1,
    gap: 2,
  },
  ingredientName: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  ingredientMeta: {
    fontSize: 12.5,
  },
  ingredientDeleteBtn: {
    padding: 8,
  },
  ingredientDeleteText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '700',
  },

  addItemBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 6,
  },
  addItemBtnText: {
    fontSize: 15.5,
    fontWeight: '600',
  },
  sectionDividerLine: {
    height: 1,
    marginTop: 22,
    marginBottom: 4,
  },

  // 5. Hướng dẫn thực hiện
  stepItemWrap: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    gap: 8,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepNumberTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepRemoveBtn: {
    padding: 4,
  },
  stepRemoveText: {
    color: '#FF6B6B',
    fontSize: 12.5,
  },
  stepInput: {
    fontSize: 14,
    minHeight: 40,
    textAlignVertical: 'top',
    padding: 0,
  },

  // Bottom Fixed Button
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  saveRecipeBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveRecipeBtnActive: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveRecipeBtnDisabledDark: {
    backgroundColor: '#1E1A2E',
    borderWidth: 1,
    borderColor: '#2D2742',
  },
  saveRecipeBtnDisabledLight: {
    backgroundColor: '#EDE8F8',
    borderWidth: 1,
    borderColor: '#DDD5F3',
  },
  saveRecipeBtnText: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  saveRecipeTextActive: {
    color: '#FFFFFF',
  },
  saveRecipeTextDisabledDark: {
    color: '#5E5970',
  },
  saveRecipeTextDisabledLight: {
    color: '#9C95B3',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalSheetContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  presetScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 12.5,
    marginBottom: 4,
  },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1.6,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
