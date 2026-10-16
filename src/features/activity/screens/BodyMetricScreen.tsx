import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { todayKey } from '@/features/nutrition/utils';
import { calculateWhr, classifyWhrRisk } from '../utils';
import { useActivity } from '../ActivityProvider';

export function BodyMetricScreen() {
  const theme = useTheme();
  const { state, addBodyMetricLog } = useActivity();

  const [waistStr, setWaistStr] = useState('72');
  const [hipStr, setHipStr] = useState('92');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const waistNum = parseFloat(waistStr) || 0;
  const hipNum = parseFloat(hipStr) || 0;

  const currentWhr = calculateWhr(waistNum, hipNum);
  const currentRisk = classifyWhrRisk(currentWhr, gender);

  const handleSave = () => {
    if (waistNum <= 0 || hipNum <= 0) return;
    addBodyMetricLog(waistNum, hipNum, gender, todayKey());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const riskColor =
    currentRisk.riskLevel === 'low'
      ? theme.colors.primary
      : currentRisk.riskLevel === 'moderate'
      ? theme.colors.warning
      : theme.colors.danger;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <AppText variant="title">Chỉ số Cơ thể Nâng cao</AppText>
          <AppText color={theme.colors.textMuted}>
            Tỷ lệ Vòng eo / Vòng mông (WHR) đánh giá phân bố mỡ nội tạng
          </AppText>
        </View>

        {/* Intro Artwork */}
        <AppCard style={styles.introCard}>
          <Image
            source={images.bodyMetricIntro}
            style={styles.introArtwork}
            resizeMode="contain"
            accessibilityLabel="Minh họa đo chỉ số cơ thể"
          />
          <AppText variant="heading">Tỷ lệ Vòng eo / Mông (WHR)</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Theo Tổ chức Y tế Thế giới (WHO), tỷ lệ WHR giúp cảnh báo sớm nguy cơ bệnh chuyển hoá,
            đái tháo đường type 2 và tim mạch chính xác hơn chỉ số BMI thông thường.
          </AppText>
        </AppCard>

        {/* Input Form */}
        <AppCard style={styles.formCard}>
          <AppText variant="heading">Nhập số đo hôm nay</AppText>

          <View style={styles.genderRow}>
            <AppButton
              label="Nam"
              variant={gender === 'male' ? 'primary' : 'outline'}
              onPress={() => setGender('male')}
              style={styles.genderBtn}
            />
            <AppButton
              label="Nữ"
              variant={gender === 'female' ? 'primary' : 'outline'}
              onPress={() => setGender('female')}
              style={styles.genderBtn}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <AppInput
                label="Vòng eo (cm)"
                value={waistStr}
                onChangeText={setWaistStr}
                keyboardType="decimal-pad"
                placeholder="Ví dụ: 72"
              />
            </View>
            <View style={styles.inputCol}>
              <AppInput
                label="Vòng mông (cm)"
                value={hipStr}
                onChangeText={setHipStr}
                keyboardType="decimal-pad"
                placeholder="Ví dụ: 92"
              />
            </View>
          </View>

          {/* Instant WHR Calculation Result */}
          {currentWhr > 0 ? (
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor:
                    currentRisk.riskLevel === 'low'
                      ? theme.colors.primarySurface
                      : currentRisk.riskLevel === 'moderate'
                      ? '#FEF9E7'
                      : '#FDEDED',
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  Tỷ lệ WHR tính được:
                </AppText>
                <AppText variant="display" color={riskColor}>
                  {currentWhr}
                </AppText>
              </View>
              <View style={styles.riskBadge}>
                <AppText variant="caption" color={riskColor} style={{ fontWeight: '700' }}>
                  ● {currentRisk.riskLabel}
                </AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {gender === 'female'
                  ? 'Chuẩn nữ: < 0.80 là bình thường, ≥ 0.85 có nguy cơ cao'
                  : 'Chuẩn nam: < 0.90 là bình thường, ≥ 1.00 có nguy cơ cao'}
              </AppText>
            </View>
          ) : null}

          {savedSuccess ? (
            <AppText color={theme.colors.primary} align="center" variant="caption">
              ✓ Đã lưu kết quả đo hôm nay!
            </AppText>
          ) : null}

          <AppButton
            label="Lưu kết quả đo"
            onPress={handleSave}
            disabled={waistNum <= 0 || hipNum <= 0}
          />
        </AppCard>

        {/* Measurement Hint Guide */}
        <AppCard style={styles.hintCard}>
          <View style={styles.hintHeader}>
            <Image
              source={images.bodyMetricWhrHint}
              style={styles.hintIcon}
              resizeMode="contain"
              accessibilityLabel="Hướng dẫn đo eo mông"
            />
            <AppText variant="heading">Cách đo chuẩn xác</AppText>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted}>
            • <AppText style={{ fontWeight: '700' }}>Vòng eo:</AppText> Đo ngang rốn hoặc phần hẹp
            nhất của thân mình khi thở ra tự nhiên.
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            • <AppText style={{ fontWeight: '700' }}>Vòng mông:</AppText> Đo quanh phần nở rộng nhất
            của mông, giữ thước dây nằm ngang.
          </AppText>
        </AppCard>

        {/* Measurement History */}
        <View style={styles.historySection}>
          <AppText variant="heading">Lịch sử số đo ({state.bodyMetricLogs.length})</AppText>
          {state.bodyMetricLogs.length === 0 ? (
            <AppCard style={styles.emptyCard}>
              <AppText color={theme.colors.textMuted} align="center">
                Chưa có số đo nào được lưu.
              </AppText>
            </AppCard>
          ) : (
            state.bodyMetricLogs.map((log) => (
              <AppCard key={log.id} style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <View>
                    <AppText variant="heading">WHR: {log.whr}</AppText>
                    <AppText variant="caption" color={theme.colors.textMuted}>
                      Eo {log.waistCm} cm • Mông {log.hipCm} cm • Ngày {log.date}
                    </AppText>
                  </View>
                  <View
                    style={[
                      styles.historyRiskBadge,
                      {
                        backgroundColor:
                          log.riskLevel === 'low'
                            ? theme.colors.primarySurface
                            : log.riskLevel === 'moderate'
                            ? '#FEF9E7'
                            : '#FDEDED',
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={
                        log.riskLevel === 'low'
                          ? theme.colors.primary
                          : log.riskLevel === 'moderate'
                          ? theme.colors.warning
                          : theme.colors.danger
                      }
                    >
                      {log.riskLevel === 'low'
                        ? 'Tốt'
                        : log.riskLevel === 'moderate'
                        ? 'Chú ý'
                        : 'Nguy cơ'}
                    </AppText>
                  </View>
                </View>
              </AppCard>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  header: { gap: 4 },
  introCard: { alignItems: 'center', gap: 10, paddingVertical: 18 },
  introArtwork: { width: 140, height: 110 },
  formCard: { gap: 14 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { flex: 1 },
  inputRow: { flexDirection: 'row', gap: 12 },
  inputCol: { flex: 1 },
  resultBox: { padding: 14, borderRadius: 12, gap: 6 },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  riskBadge: { alignSelf: 'flex-start', paddingVertical: 2 },
  hintCard: { gap: 8 },
  hintHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hintIcon: { width: 28, height: 28 },
  historySection: { gap: 10, marginTop: 8 },
  emptyCard: { padding: 20, alignItems: 'center' },
  historyCard: { paddingVertical: 12, paddingHorizontal: 14 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyRiskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
});
