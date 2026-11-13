import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/components/icons';
import { images } from '@/assets/images';
import { useNutrition } from '../NutritionProvider';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomFoodForm'>;

type ServingUnit = 'g' | 'ml' | 'phần';
type EnergyUnit = 'cal' | 'kJ';
type SodiumType = 'Muối' | 'Natri';

export function CustomFoodFormScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { findFood, saveCustomFood, addFoodLog } = useNutrition();

  const existing = route.params.foodId ? findFood(route.params.foodId) : undefined;

  // Wizard Step: 1 = Basic Info & Photo, 2 = Nutrition & Serving
  const [step, setStep] = useState<1 | 2>(1);

  // ── Step 1 State ────────────────────────────────────────────────────────
  const [name, setName] = useState(existing?.name ?? '');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // ── Step 2 State ────────────────────────────────────────────────────────
  // Giá trị dinh dưỡng được tính cho
  const [servingAmount, setServingAmount] = useState(
    existing ? String(existing.servingGrams) : '100',
  );
  const [servingUnit, setServingUnit] = useState<ServingUnit>('g');

  // Giá trị dinh dưỡng
  const [calories, setCalories] = useState(
    existing ? String(existing.calories) : '200',
  );
  const [energyUnit, setEnergyUnit] = useState<EnergyUnit>('cal');

  const [carbs, setCarbs] = useState(
    existing ? String(existing.carbs) : '10',
  );
  const [fiber, setFiber] = useState('2');
  const [sugar, setSugar] = useState('5');

  const [fat, setFat] = useState(
    existing ? String(existing.fat) : '10',
  );
  const [protein, setProtein] = useState(
    existing ? String(existing.protein) : '10',
  );

  const [sodiumType, setSodiumType] = useState<SodiumType>('Muối');
  const [sodium, setSodium] = useState('5');

  // Hiển thị thêm thông tin accordion
  const [showMore, setShowMore] = useState(false);
  const [saturatedFat, setSaturatedFat] = useState('');
  const [transFat, setTransFat] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [potassium, setPotassium] = useState('');
  const [calcium, setCalcium] = useState('');
  const [iron, setIron] = useState('');
  const [barcode, setBarcode] = useState(
    route.params.barcode ?? existing?.barcode ?? '',
  );

  // Unit Modals
  const [servingUnitModalVisible, setServingUnitModalVisible] = useState(false);
  const [energyUnitModalVisible, setEnergyUnitModalVisible] = useState(false);
  const [sodiumModalVisible, setSodiumModalVisible] = useState(false);

  const [error, setError] = useState('');

  // Dynamic theme shortcut
  const primaryBrand = colors.brandPrimary || '#9E64F7';

  // ── Pick Image ─────────────────────────────────────────────────────────
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

  // ── Step Navigation ────────────────────────────────────────────────────
  const handleNextStep = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên thực phẩm.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigation.goBack();
    }
  };

  // Hardware back button on Android
  useEffect(() => {
    if (step !== 2) return;
    const onBackPress = () => {
      setStep(1);
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [step]);

  // ── Validate & Extract Data ────────────────────────────────────────────
  const validateAndGetValues = () => {
    const sGrams = Number(servingAmount);
    let calVal = Number(calories);
    // If energy unit is kJ, convert to kcal (1 kcal ≈ 4.184 kJ)
    if (energyUnit === 'kJ') {
      calVal = Math.round(calVal / 4.184);
    }
    const pVal = Number(protein || '0');
    const cVal = Number(carbs || '0');
    const fVal = Number(fat || '0');

    if (!name.trim()) {
      setError('Vui lòng nhập tên thực phẩm.');
      setStep(1);
      return null;
    }
    if (!Number.isFinite(sGrams) || sGrams <= 0 || sGrams > 5000) {
      setError('Khối lượng chuẩn phải lớn hơn 0 và không quá 5.000 g.');
      return null;
    }
    if (
      !Number.isFinite(calVal) ||
      calVal < 0 ||
      pVal < 0 ||
      cVal < 0 ||
      fVal < 0
    ) {
      setError('Calo và các chỉ số dinh dưỡng phải là số không âm.');
      return null;
    }

    return {
      servingGrams: sGrams,
      calories: Math.round(calVal),
      protein: Math.round(pVal * 10) / 10,
      carbs: Math.round(cVal * 10) / 10,
      fat: Math.round(fVal * 10) / 10,
    };
  };

  // ── Action: Lưu thực phẩm (Chỉ lưu vào món tự tạo) ─────────────────────
  const handleSaveOnly = () => {
    const parsed = validateAndGetValues();
    if (!parsed) return;

    setError('');
    saveCustomFood({
      id: existing?.id,
      name: name.trim(),
      servingGrams: parsed.servingGrams,
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fat,
      allergens: [],
      barcode: barcode.trim() || undefined,
    });

    Alert.alert('Thành công', 'Đã lưu thực phẩm của bạn.', [
      {
        text: 'Đóng',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  // ── Action: Lưu và ghi (Lưu & thêm vào nhật ký bữa ăn ngay) ────────────
  const handleSaveAndLog = () => {
    const parsed = validateAndGetValues();
    if (!parsed) return;

    setError('');
    const foodId = saveCustomFood({
      id: existing?.id,
      name: name.trim(),
      servingGrams: parsed.servingGrams,
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fat,
      allergens: [],
      barcode: barcode.trim() || undefined,
    });

    addFoodLog({
      foodId,
      foodName: name.trim(),
      grams: parsed.servingGrams,
      date: route.params.date,
      meal: route.params.meal,
      source: 'CUSTOM',
      nutritionSnapshot: {
        calories: parsed.calories,
        protein: parsed.protein,
        carbs: parsed.carbs,
        fat: parsed.fat,
      },
    });

    Alert.alert('Thành công', 'Đã lưu và ghi thực phẩm vào nhật ký.', [
      {
        text: 'Xem nhật ký',
        onPress: () => {
          navigation.navigate('MainTabs', { screen: 'Diary' });
        },
      },
    ]);
  };

  const isStep2Valid =
    name.trim().length > 0 &&
    Number(servingAmount) > 0 &&
    Number(calories) >= 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.canvasBase }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.canvasBase}
      />

      <SafeAreaView edges={['top']} style={styles.safeContainer}>
        {/* ── Top Header: <  Tạo thực phẩm ─────────────────────────── */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBack}
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
            Tạo thực phẩm
          </Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* ── Top Progress Bar (Step 1 = 50%, Step 2 = 100%) ────────── */}
        <View style={styles.progressBarWrapper}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: isDark ? '#262038' : '#E4E0F0' },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: primaryBrand,
                  width: step === 1 ? '50%' : '100%',
                },
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 ? (
            /* ══════════════════════════════════════════════════════════
               STEP 1: Hình ảnh & Thông tin thực phẩm (Theo ảnh 1)
               ══════════════════════════════════════════════════════════ */
            <View style={styles.stepContainer}>
              {/* Mục: Hình ảnh */}
              <Text
                style={[
                  styles.sectionTitle,
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
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.uploadedImage}
                    />
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
                  accessibilityLabel="Tải ảnh mới"
                >
                  <Text style={[styles.uploadBtnText, { color: primaryBrand }]}>
                    + Tải ảnh mới
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Mục: Thông tin thực phẩm */}
              <Text
                style={[
                  styles.sectionTitleWithMargin,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Thông tin thực phẩm
              </Text>

              <View style={styles.foodNameRow}>
                <View style={styles.fieldLabelWrap}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    Tên thực phẩm
                  </Text>
                  <Text style={styles.requiredStar}> *</Text>
                </View>

                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (error) setError('');
                  }}
                  placeholder="Nhập tên thực phẩm"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.foodNameInput,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                  autoCapitalize="sentences"
                  autoFocus
                />
              </View>

              {/* Đường kẻ tím toàn chiều rộng */}
              <View
                style={[
                  styles.purpleUnderline,
                  { backgroundColor: primaryBrand },
                ]}
              />

              {error ? (
                <Text style={styles.errorText} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              ) : null}
            </View>
          ) : (
            /* ══════════════════════════════════════════════════════════
               STEP 2: Giá trị dinh dưỡng (Theo ảnh 2 & 3)
               ══════════════════════════════════════════════════════════ */
            <View style={styles.stepContainer}>
              {/* ── Section 1: Giá trị dinh dưỡng được tính cho ───────── */}
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Giá trị dinh dưỡng được tính cho
              </Text>

              <View style={styles.nutritionRow}>
                <View style={styles.rowLeftUnderlined}>
                  <View style={styles.rowLabelGroup}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Khối lượng
                    </Text>
                    <Text style={styles.requiredStar}> *</Text>
                  </View>
                  <TextInput
                    value={servingAmount}
                    onChangeText={setServingAmount}
                    keyboardType="decimal-pad"
                    placeholder="100"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.valueInput,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  />
                  <View
                    style={[
                      styles.itemUnderline,
                      { backgroundColor: isDark ? '#28233C' : '#E4E0F0' },
                    ]}
                  />
                </View>

                {/* Unit pill button: g > */}
                <TouchableOpacity
                  style={[
                    styles.unitPillButton,
                    {
                      backgroundColor: isDark ? '#251F3A' : '#EDE8F8',
                      borderColor: isDark ? '#362D50' : '#DDD5F3',
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setServingUnitModalVisible(true)}
                  accessibilityLabel={`Đơn vị khối lượng: ${servingUnit}`}
                >
                  <Text
                    style={[
                      styles.unitPillText,
                      { color: isDark ? '#FFFFFF' : primaryBrand },
                    ]}
                  >
                    {servingUnit}
                  </Text>
                  <ChevronRightIcon
                    size={14}
                    color={isDark ? '#A59EBD' : primaryBrand}
                  />
                </TouchableOpacity>
              </View>

              {/* ── Section 2: Giá trị dinh dưỡng ────────────────────── */}
              <Text
                style={[
                  styles.sectionTitleWithMargin,
                  { color: isDark ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Giá trị dinh dưỡng
              </Text>

              {/* Row 1: Năng lượng * + cal > */}
              <View style={styles.nutritionRow}>
                <View style={styles.rowLeftUnderlined}>
                  <View style={styles.rowLabelGroup}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Năng lượng
                    </Text>
                    <Text style={styles.requiredStar}> *</Text>
                  </View>
                  <TextInput
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="decimal-pad"
                    placeholder="200"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.valueInput,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  />
                  <View
                    style={[
                      styles.itemUnderline,
                      { backgroundColor: isDark ? '#28233C' : '#E4E0F0' },
                    ]}
                  />
                </View>

                {/* Unit pill button: cal > */}
                <TouchableOpacity
                  style={[
                    styles.unitPillButton,
                    {
                      backgroundColor: isDark ? '#251F3A' : '#EDE8F8',
                      borderColor: isDark ? '#362D50' : '#DDD5F3',
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setEnergyUnitModalVisible(true)}
                  accessibilityLabel={`Đơn vị năng lượng: ${energyUnit}`}
                >
                  <Text
                    style={[
                      styles.unitPillText,
                      { color: isDark ? '#FFFFFF' : primaryBrand },
                    ]}
                  >
                    {energyUnit}
                  </Text>
                  <ChevronRightIcon
                    size={14}
                    color={isDark ? '#A59EBD' : primaryBrand}
                  />
                </TouchableOpacity>
              </View>

              {/* Row 2: Đường bột */}
              <View style={styles.standardNutrientRow}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  Đường bột
                </Text>
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="decimal-pad"
                  placeholder="10"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.nutrientValueInput,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                />
                <Text
                  style={[
                    styles.unitLabelBold,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  gram
                </Text>
                <View
                  style={[
                    styles.rowBottomBorder,
                    { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                  ]}
                />
              </View>

              {/* Row 3: Chất xơ (Thụt lề) */}
              <View style={styles.standardNutrientRow}>
                <Text
                  style={[
                    styles.fieldLabel,
                    styles.indentedLabel,
                    { color: isDark ? '#C7C2DD' : colors.textSecondary },
                  ]}
                >
                  Chất xơ
                </Text>
                <TextInput
                  value={fiber}
                  onChangeText={setFiber}
                  keyboardType="decimal-pad"
                  placeholder="2"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.nutrientValueInput,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                />
                <Text
                  style={[
                    styles.unitLabelBold,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  gram
                </Text>
                <View
                  style={[
                    styles.rowBottomBorder,
                    { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                  ]}
                />
              </View>

              {/* Row 4: Tổng lượng đường (Thụt lề) */}
              <View style={styles.standardNutrientRow}>
                <Text
                  style={[
                    styles.fieldLabel,
                    styles.indentedLabel,
                    { color: isDark ? '#C7C2DD' : colors.textSecondary },
                  ]}
                >
                  Tổng lượng đường
                </Text>
                <TextInput
                  value={sugar}
                  onChangeText={setSugar}
                  keyboardType="decimal-pad"
                  placeholder="5"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.nutrientValueInput,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                />
                <Text
                  style={[
                    styles.unitLabelBold,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  gram
                </Text>
                <View
                  style={[
                    styles.rowBottomBorder,
                    { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                  ]}
                />
              </View>

              {/* Row 5: Chất béo */}
              <View style={styles.standardNutrientRow}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  Chất béo
                </Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="decimal-pad"
                  placeholder="10"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.nutrientValueInput,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                />
                <Text
                  style={[
                    styles.unitLabelBold,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  gram
                </Text>
                <View
                  style={[
                    styles.rowBottomBorder,
                    { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                  ]}
                />
              </View>

              {/* Row 6: Chất đạm */}
              <View style={styles.standardNutrientRow}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  Chất đạm
                </Text>
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="decimal-pad"
                  placeholder="10"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.nutrientValueInput,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                />
                <Text
                  style={[
                    styles.unitLabelBold,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  gram
                </Text>
                <View
                  style={[
                    styles.rowBottomBorder,
                    { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                  ]}
                />
              </View>

              {/* Row 7: Muối > / Natri > */}
              <View style={styles.sodiumRow}>
                <TouchableOpacity
                  style={[
                    styles.leftPillButton,
                    {
                      backgroundColor: isDark ? '#251F3A' : '#EDE8F8',
                      borderColor: isDark ? '#362D50' : '#DDD5F3',
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSodiumModalVisible(true)}
                  accessibilityLabel={`Chọn loại: ${sodiumType}`}
                >
                  <Text
                    style={[
                      styles.leftPillText,
                      { color: isDark ? '#FFFFFF' : primaryBrand },
                    ]}
                  >
                    {sodiumType}
                  </Text>
                  <ChevronRightIcon
                    size={14}
                    color={isDark ? '#A59EBD' : primaryBrand}
                  />
                </TouchableOpacity>

                <View style={styles.sodiumInputWrap}>
                  <TextInput
                    value={sodium}
                    onChangeText={setSodium}
                    keyboardType="decimal-pad"
                    placeholder="5"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.nutrientValueInput,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  />
                  <Text
                    style={[
                      styles.unitLabelBold,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    {sodiumType === 'Muối' ? 'gram' : 'mg'}
                  </Text>
                  <View
                    style={[
                      styles.rowBottomBorder,
                      { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                    ]}
                  />
                </View>
              </View>

              {/* ── Accordion: Hiển thị thêm thông tin ───────────────── */}
              <TouchableOpacity
                style={[
                  styles.accordionButton,
                  {
                    backgroundColor: isDark ? '#1E1831' : '#EDE8F8',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => setShowMore(!showMore)}
                accessibilityLabel="Hiển thị thêm thông tin dinh dưỡng"
              >
                <Text
                  style={[
                    styles.accordionButtonText,
                    { color: primaryBrand },
                  ]}
                >
                  {showMore
                    ? 'Thu gọn thông tin'
                    : 'Hiển thị thêm thông tin'}
                </Text>
                {showMore ? (
                  <ChevronUpIcon size={16} color={primaryBrand} />
                ) : (
                  <ChevronDownIcon size={16} color={primaryBrand} />
                )}
              </TouchableOpacity>

              {/* Expanded extra fields */}
              {showMore ? (
                <View style={styles.expandedSection}>
                  {/* Chất béo bão hòa */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        styles.indentedLabel,
                        { color: isDark ? '#C7C2DD' : colors.textSecondary },
                      ]}
                    >
                      Chất béo bão hòa
                    </Text>
                    <TextInput
                      value={saturatedFat}
                      onChangeText={setSaturatedFat}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      gram
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>

                  {/* Chất béo chuyển hóa */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        styles.indentedLabel,
                        { color: isDark ? '#C7C2DD' : colors.textSecondary },
                      ]}
                    >
                      Chất béo chuyển hóa
                    </Text>
                    <TextInput
                      value={transFat}
                      onChangeText={setTransFat}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      gram
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>

                  {/* Cholesterol */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Cholesterol
                    </Text>
                    <TextInput
                      value={cholesterol}
                      onChangeText={setCholesterol}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      mg
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>

                  {/* Kali */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Kali
                    </Text>
                    <TextInput
                      value={potassium}
                      onChangeText={setPotassium}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      mg
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>

                  {/* Canxi */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Canxi
                    </Text>
                    <TextInput
                      value={calcium}
                      onChangeText={setCalcium}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      mg
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>

                  {/* Sắt */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Sắt
                    </Text>
                    <TextInput
                      value={iron}
                      onChangeText={setIron}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      mg
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>

                  {/* Mã vạch */}
                  <View style={styles.standardNutrientRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      Mã vạch (Barcode)
                    </Text>
                    <TextInput
                      value={barcode}
                      onChangeText={setBarcode}
                      keyboardType="number-pad"
                      placeholder="893..."
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.nutrientValueInput,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    />
                    <Text
                      style={[
                        styles.unitLabelBold,
                        { color: isDark ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      code
                    </Text>
                    <View
                      style={[
                        styles.rowBottomBorder,
                        { backgroundColor: isDark ? '#231D36' : '#E4E0F0' },
                      ]}
                    />
                  </View>
                </View>
              ) : null}

              {error ? (
                <Text style={styles.errorText} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              ) : null}
            </View>
          )}
        </ScrollView>

        {/* ── Bottom Action Bar ─────────────────────────────────────── */}
        <View
          style={[
            styles.bottomBarContainer,
            {
              backgroundColor: isDark ? '#0D0B14' : colors.canvasBase,
              borderTopColor: isDark ? '#171324' : '#E4E0F0',
              paddingBottom: Math.max(insets.bottom, 16) + 4,
            },
          ]}
        >
          {step === 1 ? (
            /* Step 1: Nút "Tiếp tục" toàn chiều rộng */
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: primaryBrand }]}
              activeOpacity={0.85}
              onPress={handleNextStep}
              accessibilityLabel="Tiếp tục"
            >
              <Text style={styles.primaryBtnText}>Tiếp tục</Text>
            </TouchableOpacity>
          ) : (
            /* Step 2: Hai nút song song "Lưu thực phẩm" & "Lưu và ghi" (Theo ảnh 3) */
            <View style={styles.dualButtonsRow}>
              {/* Nút: Lưu thực phẩm */}
              <TouchableOpacity
                style={[
                  styles.dualButton,
                  isStep2Valid
                    ? isDark
                      ? styles.saveOnlyBtnActiveDark
                      : styles.saveOnlyBtnActiveLight
                    : isDark
                    ? styles.dualButtonDisabledDark
                    : styles.dualButtonDisabledLight,
                  isStep2Valid && { borderColor: primaryBrand },
                ]}
                activeOpacity={0.85}
                onPress={handleSaveOnly}
                accessibilityLabel="Lưu thực phẩm"
              >
                <Text
                  style={[
                    styles.dualButtonText,
                    isStep2Valid
                      ? isDark
                        ? styles.saveOnlyBtnTextActiveDark
                        : [styles.saveOnlyBtnTextActiveLight, { color: primaryBrand }]
                      : isDark
                      ? styles.dualButtonTextDisabledDark
                      : styles.dualButtonTextDisabledLight,
                  ]}
                >
                  Lưu thực phẩm
                </Text>
              </TouchableOpacity>

              {/* Nút: Lưu và ghi */}
              <TouchableOpacity
                style={[
                  styles.dualButton,
                  isStep2Valid
                    ? [styles.saveAndLogBtnActive, { backgroundColor: primaryBrand }]
                    : isDark
                    ? styles.dualButtonDisabledDark
                    : styles.dualButtonDisabledLight,
                ]}
                activeOpacity={0.85}
                onPress={handleSaveAndLog}
                accessibilityLabel="Lưu và ghi vào nhật ký"
              >
                <Text
                  style={[
                    styles.dualButtonText,
                    isStep2Valid
                      ? styles.saveAndLogBtnTextActive
                      : isDark
                      ? styles.dualButtonTextDisabledDark
                      : styles.dualButtonTextDisabledLight,
                  ]}
                >
                  Lưu và ghi
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Modals Chọn đơn vị (Theme Adaptive) ───────────────────── */}
        {/* Modal Đơn vị Khối lượng */}
        <Modal
          visible={servingUnitModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setServingUnitModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setServingUnitModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalSheet,
                    {
                      backgroundColor: isDark ? '#1A152B' : '#FFFFFF',
                      borderTopColor: isDark ? '#2E2744' : '#E4E0F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalTitle,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    Chọn đơn vị khối lượng
                  </Text>
                  {(['g', 'ml', 'phần'] as ServingUnit[]).map((u) => {
                    const isSelected = servingUnit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.modalOptionItem,
                          {
                            backgroundColor: isSelected
                              ? isDark
                                ? '#352B52'
                                : '#EDE5FF'
                              : isDark
                              ? '#241E38'
                              : '#F1EFF9',
                            borderColor: isSelected ? primaryBrand : 'transparent',
                            borderWidth: isSelected ? 1 : 0,
                          },
                        ]}
                        onPress={() => {
                          setServingUnit(u);
                          setServingUnitModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            {
                              color: isSelected
                                ? primaryBrand
                                : isDark
                                ? '#FFFFFF'
                                : colors.textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {u === 'g'
                            ? 'Gram (g)'
                            : u === 'ml'
                            ? 'Mililít (ml)'
                            : 'Phần / Khẩu phần'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal Đơn vị Năng lượng */}
        <Modal
          visible={energyUnitModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEnergyUnitModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setEnergyUnitModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalSheet,
                    {
                      backgroundColor: isDark ? '#1A152B' : '#FFFFFF',
                      borderTopColor: isDark ? '#2E2744' : '#E4E0F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalTitle,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    Chọn đơn vị năng lượng
                  </Text>
                  {(['cal', 'kJ'] as EnergyUnit[]).map((u) => {
                    const isSelected = energyUnit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.modalOptionItem,
                          {
                            backgroundColor: isSelected
                              ? isDark
                                ? '#352B52'
                                : '#EDE5FF'
                              : isDark
                              ? '#241E38'
                              : '#F1EFF9',
                            borderColor: isSelected ? primaryBrand : 'transparent',
                            borderWidth: isSelected ? 1 : 0,
                          },
                        ]}
                        onPress={() => {
                          setEnergyUnit(u);
                          setEnergyUnitModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            {
                              color: isSelected
                                ? primaryBrand
                                : isDark
                                ? '#FFFFFF'
                                : colors.textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {u === 'cal' ? 'Calo (cal / kcal)' : 'Kilojoules (kJ)'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal Loại Muối / Natri */}
        <Modal
          visible={sodiumModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSodiumModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setSodiumModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalSheet,
                    {
                      backgroundColor: isDark ? '#1A152B' : '#FFFFFF',
                      borderTopColor: isDark ? '#2E2744' : '#E4E0F0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalTitle,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    Chọn chỉ số
                  </Text>
                  {(['Muối', 'Natri'] as SodiumType[]).map((t) => {
                    const isSelected = sodiumType === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.modalOptionItem,
                          {
                            backgroundColor: isSelected
                              ? isDark
                                ? '#352B52'
                                : '#EDE5FF'
                              : isDark
                              ? '#241E38'
                              : '#F1EFF9',
                            borderColor: isSelected ? primaryBrand : 'transparent',
                            borderWidth: isSelected ? 1 : 0,
                          },
                        ]}
                        onPress={() => {
                          setSodiumType(t);
                          setSodiumModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            {
                              color: isSelected
                                ? primaryBrand
                                : isDark
                                ? '#FFFFFF'
                                : colors.textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {t === 'Muối' ? 'Muối (gram)' : 'Natri (mg)'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
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

  // Progress Bar
  progressBarWrapper: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  progressTrack: {
    height: 3.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  stepContainer: {
    flex: 1,
  },

  // Section titles
  sectionTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitleWithMargin: {
    fontSize: 17.5,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 16,
  },

  // ── Step 1: Hình ảnh ──────────────────────────────────────────────────
  imageSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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

  // ── Step 1: Thông tin thực phẩm ───────────────────────────────────────
  foodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  fieldLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 130,
  },
  fieldLabel: {
    fontSize: 15.5,
    fontWeight: '500',
  },
  indentedLabel: {
    paddingLeft: 20,
  },
  requiredStar: {
    color: '#FF5252',
    fontSize: 15.5,
    fontWeight: '700',
  },
  foodNameInput: {
    flex: 1,
    fontSize: 15.5,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  purpleUnderline: {
    height: 1.5,
    marginTop: 6,
    marginBottom: 14,
  },

  // ── Step 2: Rows with Underline ───────────────────────────────────────
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  rowLeftUnderlined: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 6,
  },
  rowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 125,
  },
  valueInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    paddingRight: 6,
    paddingVertical: 4,
  },
  itemUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  unitPillButton: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    minWidth: 64,
    justifyContent: 'center',
  },
  unitPillText: {
    fontSize: 14.5,
    fontWeight: '600',
  },

  // Standard Nutrient Row (Đường bột, Chất xơ, Chất béo, Chất đạm)
  standardNutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  nutrientValueInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    paddingRight: 10,
    paddingVertical: 4,
  },
  unitLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    width: 46,
    textAlign: 'right',
  },
  rowBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },

  // Sodium row (Muối pill on the left)
  sodiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  leftPillButton: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  leftPillText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  sodiumInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 2,
  },

  // Accordion Button
  accordionButton: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  accordionButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  expandedSection: {
    marginBottom: 16,
  },

  // Error Text
  errorText: {
    color: '#FF5252',
    fontSize: 13.5,
    marginTop: 12,
  },

  // ── Bottom Action Bar ─────────────────────────────────────────────────
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
  },

  // Step 1 Button
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
  },

  // Step 2 Dual Buttons (Lưu thực phẩm / Lưu và ghi)
  dualButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dualButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dualButtonDisabledDark: {
    backgroundColor: '#1E192D',
  },
  dualButtonDisabledLight: {
    backgroundColor: '#EDE8F8',
  },
  dualButtonText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  dualButtonTextDisabledDark: {
    color: '#655E77',
  },
  dualButtonTextDisabledLight: {
    color: '#A6A1B8',
  },
  saveOnlyBtnActiveDark: {
    backgroundColor: '#261F3C',
    borderWidth: 1.2,
  },
  saveOnlyBtnActiveLight: {
    backgroundColor: '#EDE8F8',
    borderWidth: 1.2,
  },
  saveOnlyBtnTextActiveDark: {
    color: '#FFFFFF',
  },
  saveOnlyBtnTextActiveLight: {},
  saveAndLogBtnActive: {},
  saveAndLogBtnTextActive: {
    color: '#FFFFFF',
  },

  // ── Modals ────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOptionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 15.5,
  },
});
