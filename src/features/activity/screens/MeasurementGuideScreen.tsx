import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  Path,
  Rect,
} from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import { CloseXIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MeasurementGuide'>;

const { width: SCREEN_W } = Dimensions.get('window');
const ILLUS_W = SCREEN_W - 48;
const ILLUS_H = Math.round(ILLUS_W * 0.62);

// ─── Sparkle / star decoration ───────────────────────────────────────────────
function Sparkle({ x, y, size = 10, color = '#7C5CFC' }: { x: number; y: number; size?: number; color?: string }) {
  const h = size / 2;
  return (
    <>
      <Path
        d={`M${x},${y - size} L${x + h * 0.3},${y - h * 0.3} L${x + size},${y} L${x + h * 0.3},${y + h * 0.3} L${x},${y + size} L${x - h * 0.3},${y + h * 0.3} L${x - size},${y} L${x - h * 0.3},${y - h * 0.3} Z`}
        fill={color}
      />
    </>
  );
}

// ─── Small hollow circle decoration ──────────────────────────────────────────
function HollowDot({ cx, cy, r = 4, color = '#7C5CFC' }: { cx: number; cy: number; r?: number; color?: string }) {
  return <Circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.5} />;
}

// ─── Dashed measurement line ──────────────────────────────────────────────────
function DashLine({ x1, y1, x2, y2, color = '#7C5CFC' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="6,4" />;
}

// ─── Illustrations (SVG) per category ────────────────────────────────────────
const W = ILLUS_W;
const H = ILLUS_H;
const CX = W / 2;

function IllustrationBodyFat() {
  // Upper body silhouette for fat/muscle measurement (machine-based)
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Upper body outline */}
      <Path
        d={`M${CX - 60},${H - 20} L${CX - 70},${H * 0.4} Q${CX - 80},${H * 0.15} ${CX},${H * 0.1} Q${CX + 80},${H * 0.15} ${CX + 70},${H * 0.4} L${CX + 60},${H - 20}`}
        fill="none"
        stroke="#8A8A9A"
        strokeWidth={2}
      />
      {/* Arms outline left */}
      <Path
        d={`M${CX - 70},${H * 0.4} Q${CX - 110},${H * 0.5} ${CX - 100},${H * 0.75}`}
        fill="none"
        stroke="#8A8A9A"
        strokeWidth={2}
      />
      {/* Arms outline right */}
      <Path
        d={`M${CX + 70},${H * 0.4} Q${CX + 110},${H * 0.5} ${CX + 100},${H * 0.75}`}
        fill="none"
        stroke="#8A8A9A"
        strokeWidth={2}
      />
      {/* Sparkles */}
      <Sparkle x={CX - 55} y={H * 0.42} size={9} />
      <Sparkle x={CX + 25} y={H * 0.28} size={7} />
      {/* Hollow dots */}
      <HollowDot cx={CX - 80} cy={H * 0.42} />
      <HollowDot cx={CX - 68} cy={H * 0.42} />
    </Svg>
  );
}

function IllustrationNeck() {
  // Front view: shoulders + neck with dashed circle around neck
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Shoulder silhouette */}
      <Path
        d={`M${CX - 90},${H - 10} Q${CX - 85},${H * 0.55} ${CX - 55},${H * 0.4} Q${CX - 30},${H * 0.32} ${CX - 20},${H * 0.25}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      <Path
        d={`M${CX + 90},${H - 10} Q${CX + 85},${H * 0.55} ${CX + 55},${H * 0.4} Q${CX + 30},${H * 0.32} ${CX + 20},${H * 0.25}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Neck */}
      <Path
        d={`M${CX - 20},${H * 0.25} Q${CX - 22},${H * 0.12} ${CX},${H * 0.08} Q${CX + 22},${H * 0.12} ${CX + 20},${H * 0.25}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Dashed ellipse around neck */}
      <Ellipse
        cx={CX}
        cy={H * 0.3}
        rx={28}
        ry={12}
        fill="none"
        stroke="#7C5CFC"
        strokeWidth={1.5}
        strokeDasharray="6,4"
      />
      {/* Sparkles */}
      <Sparkle x={CX - 65} y={H * 0.4} size={9} />
      <Sparkle x={CX + 30} y={H * 0.3} size={8} />
      {/* Hollow dots */}
      <HollowDot cx={CX - 75} cy={H * 0.42} />
      <HollowDot cx={CX + 42} cy={H * 0.3} />
    </Svg>
  );
}

function IllustrationChest() {
  // Front torso, dashed line across chest
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Body left */}
      <Path
        d={`M${CX - 30},${H - 10} L${CX - 40},${H * 0.5} Q${CX - 80},${H * 0.4} ${CX - 90},${H * 0.6} L${CX - 100},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Body right */}
      <Path
        d={`M${CX + 30},${H - 10} L${CX + 40},${H * 0.5} Q${CX + 80},${H * 0.4} ${CX + 90},${H * 0.6} L${CX + 100},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Dashed line across chest */}
      <DashLine x1={CX - 90} y1={H * 0.42} x2={CX + 90} y2={H * 0.42} />
      {/* Tick marks at ends */}
      <Line x1={CX - 90} y1={H * 0.42 - 6} x2={CX - 90} y2={H * 0.42 + 6} stroke="#7C5CFC" strokeWidth={1.5} />
      <Line x1={CX + 90} y1={H * 0.42 - 6} x2={CX + 90} y2={H * 0.42 + 6} stroke="#7C5CFC" strokeWidth={1.5} />
      {/* Sparkles */}
      <Sparkle x={CX - 55} y={H * 0.3} size={9} />
      <Sparkle x={CX + 25} y={H * 0.56} size={8} />
      {/* Hollow dots */}
      <HollowDot cx={CX - 55} cy={H * 0.5} />
      <HollowDot cx={CX + 10} cy={H * 0.3} />
    </Svg>
  );
}

function IllustrationArm() {
  // Side view: arm with dashed ellipse around bicep
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Body left side */}
      <Path
        d={`M${CX - 10},${H * 0.05} Q${CX - 25},${H * 0.15} ${CX - 30},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Arm outer */}
      <Path
        d={`M${CX - 10},${H * 0.05} Q${CX + 50},${H * 0.1} ${CX + 55},${H * 0.5} Q${CX + 55},${H * 0.75} ${CX + 35},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Arm inner */}
      <Path
        d={`M${CX - 10},${H * 0.05} Q${CX + 20},${H * 0.12} ${CX + 25},${H * 0.5} Q${CX + 25},${H * 0.75} ${CX + 35},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Dashed ellipse (bicep circumference) */}
      <Ellipse
        cx={CX + 40}
        cy={H * 0.35}
        rx={18}
        ry={12}
        fill="none"
        stroke="#7C5CFC"
        strokeWidth={1.5}
        strokeDasharray="6,4"
      />
      {/* Sparkles */}
      <Sparkle x={CX - 20} y={H * 0.42} size={9} />
      <HollowDot cx={CX + 10} cy={H * 0.42} />
      <HollowDot cx={CX + 55} cy={H * 0.3} />
      <HollowDot cx={CX + 70} cy={H * 0.42} />
    </Svg>
  );
}

function IllustrationWaist() {
  // Front torso + dashed line at waist
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Torso left */}
      <Path
        d={`M${CX - 25},${H * 0.05} Q${CX - 55},${H * 0.2} ${CX - 50},${H * 0.5} Q${CX - 55},${H * 0.75} ${CX - 70},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Torso right */}
      <Path
        d={`M${CX + 25},${H * 0.05} Q${CX + 55},${H * 0.2} ${CX + 50},${H * 0.5} Q${CX + 55},${H * 0.75} ${CX + 70},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Dashed waist line */}
      <DashLine x1={CX - 50} y1={H * 0.52} x2={CX + 50} y2={H * 0.52} />
      {/* Tick marks */}
      <Line x1={CX - 50} y1={H * 0.52 - 5} x2={CX - 50} y2={H * 0.52 + 5} stroke="#7C5CFC" strokeWidth={1.5} />
      <Line x1={CX + 50} y1={H * 0.52 - 5} x2={CX + 50} y2={H * 0.52 + 5} stroke="#7C5CFC" strokeWidth={1.5} />
      {/* Sparkles */}
      <Sparkle x={CX + 35} y={H * 0.38} size={9} />
      <Sparkle x={CX - 55} y={H * 0.62} size={8} />
      <HollowDot cx={CX - 55} cy={H * 0.52} />
      <HollowDot cx={CX - 42} cy={H * 0.62} />
    </Svg>
  );
}

function IllustrationHip() {
  // Lower body + dashed ellipse around hip
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Hip/pelvis area */}
      <Path
        d={`M${CX - 20},${H * 0.05} Q${CX - 70},${H * 0.15} ${CX - 75},${H * 0.5} L${CX - 55},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      <Path
        d={`M${CX + 20},${H * 0.05} Q${CX + 70},${H * 0.15} ${CX + 75},${H * 0.5} L${CX + 55},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Inner legs */}
      <Path d={`M${CX - 10},${H * 0.5} L${CX - 10},${H - 10}`} fill="none" stroke="#8A8A9A" strokeWidth={2} />
      <Path d={`M${CX + 10},${H * 0.5} L${CX + 10},${H - 10}`} fill="none" stroke="#8A8A9A" strokeWidth={2} />
      {/* Vertical bar */}
      <Rect x={CX - 8} y={H * 0.5} width={16} height={H * 0.1} fill="#8A8A9A" opacity={0.3} />
      {/* Dashed ellipse around hip */}
      <Ellipse
        cx={CX}
        cy={H * 0.38}
        rx={72}
        ry={18}
        fill="none"
        stroke="#7C5CFC"
        strokeWidth={1.5}
        strokeDasharray="6,4"
      />
      {/* Sparkles */}
      <Sparkle x={CX - 55} y={H * 0.22} size={9} />
      <Sparkle x={CX + 45} y={H * 0.42} size={8} />
      <HollowDot cx={CX + 55} cy={H * 0.3} />
      <HollowDot cx={CX + 68} cy={H * 0.42} />
    </Svg>
  );
}

function IllustrationGlute() {
  // Side lower body — buttocks + dashed line
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Body */}
      <Path
        d={`M${CX - 10},${H * 0.05} Q${CX + 55},${H * 0.1} ${CX + 65},${H * 0.4} Q${CX + 65},${H * 0.65} ${CX + 25},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      <Path
        d={`M${CX - 10},${H * 0.05} Q${CX - 25},${H * 0.15} ${CX - 20},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Dashed ellipse across glute */}
      <Ellipse
        cx={CX + 30}
        cy={H * 0.42}
        rx={40}
        ry={16}
        fill="none"
        stroke="#7C5CFC"
        strokeWidth={1.5}
        strokeDasharray="6,4"
      />
      {/* Sparkles */}
      <Sparkle x={CX - 30} y={H * 0.22} size={9} />
      <HollowDot cx={CX - 10} cy={H * 0.42} />
      <HollowDot cx={CX + 10} cy={H * 0.3} />
    </Svg>
  );
}

function IllustrationThigh() {
  // Front: two legs, dashed ellipse on one thigh
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Left leg outer */}
      <Path
        d={`M${CX - 60},${H * 0.05} Q${CX - 75},${H * 0.4} ${CX - 65},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Left leg inner */}
      <Path
        d={`M${CX - 10},${H * 0.05} Q${CX - 25},${H * 0.4} ${CX - 30},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Right leg outer */}
      <Path
        d={`M${CX + 60},${H * 0.05} Q${CX + 75},${H * 0.4} ${CX + 65},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Right leg inner */}
      <Path
        d={`M${CX + 10},${H * 0.05} Q${CX + 25},${H * 0.4} ${CX + 30},${H - 10}`}
        fill="none" stroke="#8A8A9A" strokeWidth={2}
      />
      {/* Dashed ellipse on left thigh */}
      <Ellipse
        cx={CX - 42}
        cy={H * 0.35}
        rx={30}
        ry={12}
        fill="none"
        stroke="#7C5CFC"
        strokeWidth={1.5}
        strokeDasharray="6,4"
      />
      {/* Sparkles */}
      <Sparkle x={CX - 85} y={H * 0.22} size={9} />
      <HollowDot cx={CX - 70} cy={H * 0.42} />
      <HollowDot cx={CX - 12} cy={H * 0.42} />
    </Svg>
  );
}

// ─── Guide data ───────────────────────────────────────────────────────────────
interface GuideTab {
  id: string;
  label: string;
  illustration: React.ReactNode;
  isSpecial?: boolean; // machine-based: no Tư thế/Vị trí
  description?: string;
  posture?: string;
  position?: string;
  extra?: string;
}

const GUIDES: GuideTab[] = [
  {
    id: 'fat',
    label: 'Tỉ lệ mỡ/Khối lượng cơ',
    illustration: <IllustrationBodyFat />,
    isSpecial: true,
    description:
      'Đây là các chỉ số chuyên sâu được đo và phân tích bằng máy đo chuyên dụng. Hãy nhập chính xác các thông số bạn nhận được từ máy đo nhé!',
  },
  {
    id: 'neck',
    label: 'Vòng cổ',
    illustration: <IllustrationNeck />,
    posture: 'Đứng thẳng giữ lưng và cổ thẳng tự nhiên. Đừng cúi xuống hoặc ngửa cổ quá cao.',
    position:
      'Đặt thước dây ôm sát da nhưng không siết chặt ở phần hẹp nhất của cổ (thường nằm ngay dưới yết hầu đối với nam hoặc đoạn giữa cổ với nữ).',
  },
  {
    id: 'chest',
    label: 'Vòng ngực',
    illustration: <IllustrationChest />,
    posture: 'Đứng thẳng, thả lỏng vai và hai chân khép sát.',
    position:
      'Đặt thước quanh phần nở nhất của ngực. Đảm bảo thước dây ở sau lưng nằm ngang bằng với phía trước, không bị trễ xuống.',
    extra: 'Hãy thở ra tự nhiên và đo ngay khi hết chu kỳ thở đầu tiên.',
  },
  {
    id: 'arm',
    label: 'Bắp tay',
    illustration: <IllustrationArm />,
    posture: 'Đứng thẳng, thả lỏng cánh tay xuôi theo thân, không gồng cơ bắp tay.',
    position:
      'Ưu tiên tay thuận. Đặt thước ôm sát đều không quá siết quanh phần nở nhất của bắp tay (thường nằm ở điểm giữa tính từ đỉnh vai đến khuỷu tay).',
  },
  {
    id: 'waist',
    label: 'Vòng eo',
    illustration: <IllustrationWaist />,
    posture: 'Đứng thẳng, hai chân rộng bằng vai, không hóp bụng.',
    position:
      'Đặt thước dây quanh phần eo nằm giữa điểm thấp nhất xương sườn và đỉnh của xương hông.',
  },
  {
    id: 'hip',
    label: 'Vòng hông',
    illustration: <IllustrationHip />,
    posture:
      'Đứng thẳng, khép sát hai chân (không đứng rộng bằng vai vì sẽ làm số đo bị nhỏ hơn thực tế).',
    position:
      'Đặt thước dây quanh phần nở nhất của hông. Đảm bảo thước dây song song với mặt đất, không siết quá chặt.',
  },
  {
    id: 'glute',
    label: 'Vòng mông',
    illustration: <IllustrationGlute />,
    posture: 'Đứng thẳng, thả lỏng cơ thể và dồn đều trọng lượng lên hai chân.',
    position: 'Quấn thước quanh phần nở nhất của mông.',
    extra: 'Giữ thước nằm ngang, ôm sát da nhưng không siết chặt để số đo chính xác hơn.',
  },
  {
    id: 'thigh',
    label: 'Bắp đùi',
    illustration: <IllustrationThigh />,
    posture: 'Đứng thẳng, thả lỏng chân',
    position: 'Đo quanh phần to nhất của đùi. Giữ thước ngang,không siết chặt.',
    extra: 'Nên đo cùng một vị trí mỗi lần để theo dõi chính xác hơn.',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export function MeasurementGuideScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeIdx, setActiveIdx] = useState(0);
  const tabScrollRef = useRef<ScrollView>(null);
  const pageListRef = useRef<FlatList>(null);

  const bg = theme.colors.canvasBase ?? (theme.scheme === 'dark' ? '#1A1A2E' : '#FFFFFF');
  const surface = theme.scheme === 'dark' ? '#23233A' : '#F3F3FA';
  const border = theme.scheme === 'dark' ? '#3A3A5A' : '#E0E0EF';
  const purple = theme.colors.brandPrimary ?? '#7C5CFC';
  const textColor = theme.colors.textPrimary ?? (theme.scheme === 'dark' ? '#FFFFFF' : '#111111');
  const textMuted = theme.colors.textSecondary ?? (theme.scheme === 'dark' ? '#AAAACC' : '#666688');

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= GUIDES.length) return;
    setActiveIdx(idx);
    pageListRef.current?.scrollToIndex({ index: idx, animated: true });
    // scroll tab strip so active is visible
    tabScrollRef.current?.scrollTo({ x: Math.max(0, idx * 110 - 60), animated: true });
  };

  const onPageScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      tabScrollRef.current?.scrollTo({ x: Math.max(0, idx * 110 - 60), animated: true });
    }
  };

  const guide = GUIDES[activeIdx];

  return (
    <View style={[styles.root, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <AppText style={[styles.headerTitle, { color: textColor }]}>Hướng dẫn đo lường</AppText>
        <Pressable
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <CloseXIcon size={22} color={textColor} />
        </Pressable>
      </View>

      {/* Tab strip */}
      <ScrollView
        ref={tabScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabStrip}
        style={{ flexGrow: 0 }}
      >
        {GUIDES.map((g, i) => {
          const active = i === activeIdx;
          return (
            <Pressable
              key={g.id}
              onPress={() => goTo(i)}
              style={[
                styles.tab,
                { borderColor: active ? purple : 'transparent', backgroundColor: active ? purple : surface },
              ]}
            >
              <AppText style={[styles.tabLabel, { color: active ? '#FFFFFF' : textMuted }]} numberOfLines={1}>
                {g.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Paged content */}
      <FlatList
        ref={pageListRef}
        data={GUIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onPageScroll}
        getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
        renderItem={({ item }) => (
          <ScrollView
            style={{ width: SCREEN_W }}
            contentContainerStyle={[styles.pageContent, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Illustration box */}
            <View
              style={[
                styles.illustrationBox,
                { borderColor: purple, backgroundColor: theme.scheme === 'dark' ? '#1E1B3A' : '#F5F3FF' },
              ]}
            >
              {item.illustration}
            </View>

            {/* Text content */}
            {item.isSpecial ? (
              <AppText style={[styles.bodyText, { color: textColor }]}>{item.description}</AppText>
            ) : (
              <View style={styles.textBlock}>
                {item.posture ? (
                  <AppText style={[styles.bodyText, { color: textColor }]}>
                    <AppText style={[styles.bodyBold, { color: textColor }]}>Tư thế: </AppText>
                    {item.posture}
                  </AppText>
                ) : null}
                {item.position ? (
                  <AppText style={[styles.bodyText, { color: textColor, marginTop: 14 }]}>
                    <AppText style={[styles.bodyBold, { color: textColor }]}>Vị trí: </AppText>
                    {item.position}
                  </AppText>
                ) : null}
                {item.extra ? (
                  <AppText style={[styles.bodyText, { color: textColor, marginTop: 14 }]}>
                    {item.extra}
                  </AppText>
                ) : null}
              </View>
            )}
          </ScrollView>
        )}
      />

      {/* Prev / Next nav */}
      <View style={[styles.navRow, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.navBtn,
            { backgroundColor: surface, opacity: activeIdx === 0 ? 0.4 : 1 },
          ]}
          onPress={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
        >
          <AppText style={[styles.navArrow, { color: textColor }]}>‹</AppText>
        </Pressable>

        <Pressable
          style={[
            styles.navBtn,
            { backgroundColor: surface, opacity: activeIdx === GUIDES.length - 1 ? 0.4 : 1 },
          ]}
          onPress={() => goTo(activeIdx + 1)}
          disabled={activeIdx === GUIDES.length - 1}
        >
          <AppText style={[styles.navArrow, { color: textColor }]}>›</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerSpacer: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '600', textAlign: 'center', flex: 4 },
  closeBtn: { flex: 1, alignItems: 'flex-end' },
  tabStrip: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tabLabel: { fontSize: 13, fontWeight: '500' },
  pageContent: { paddingHorizontal: 24, paddingTop: 4 },
  illustrationBox: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 20,
  },
  textBlock: { gap: 0 },
  bodyText: { fontSize: 15, lineHeight: 23 },
  bodyBold: { fontWeight: '700' },
  navRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: { fontSize: 26, fontWeight: '400', lineHeight: 30 },
});
