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
  G,
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
function Sparkle({
  x,
  y,
  size = 10,
  color = '#7C5CFC',
  stroke,
  inner,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  stroke?: string;
  inner?: number; // inner-point ratio of size (default keeps the original thin look)
}) {
  const h = inner != null ? inner * size : (size / 2) * 0.3;
  return (
    <Path
      d={`M${x},${y - size} L${x + h},${y - h} L${x + size},${y} L${x + h},${y + h} L${x},${y + size} L${x - h},${y + h} L${x - size},${y} L${x - h},${y - h} Z`}
      fill={color}
      stroke={stroke}
      strokeWidth={stroke ? 1.5 : 0}
      strokeLinejoin="round"
    />
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

// Design space for the first three illustrations (matches the reference images)
const VB_W = 330;
const VB_H = 205;
const VB = `0 0 ${VB_W} ${VB_H}`;

function useIllusColors() {
  const theme = useTheme();
  const dark = theme.scheme === 'dark';
  return {
    dash: dark ? '#FFFFFF' : '#4A4A68',
    body: dark ? '#C9C9D6' : '#8A8A9A',
    faint: dark ? '#8A8A9A' : '#B5B5C8',
    spark: '#5B3FC4',
    sparkStroke: dark ? '#FFFFFF' : '#FFFFFF',
    dot: dark ? '#FFFFFF' : '#4A4A68',
  };
}

const MIRROR = `translate(${VB_W}, 0) scale(-1, 1)`;

function IllustrationBodyFat() {
  const c = useIllusColors();
  const dashedOutline = 'M128,4 C105,20 75,22 58,42 C50,52 50,70 48,90 L44,158 L34,190';
  const innerContour = 'M133,22 C90,40 64,56 62,80 L61,130 C60,150 55,170 52,196';
  return (
    <Svg width={W} height={H} viewBox={VB}>
      {/* Faint inner body contours */}
      <G opacity={0.5}>
        <Path d={innerContour} fill="none" stroke={c.faint} strokeWidth={1.5} />
        <Path d="M98,123 L86,196 M98,123 L106,196" fill="none" stroke={c.faint} strokeWidth={1.5} />
      </G>
      <G opacity={0.5} transform={MIRROR}>
        <Path d={innerContour} fill="none" stroke={c.faint} strokeWidth={1.5} />
        <Path d="M98,123 L86,196 M98,123 L106,196" fill="none" stroke={c.faint} strokeWidth={1.5} />
      </G>
      {/* Dashed outline (shoulders + arms) */}
      <Path d={dashedOutline} fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      <G transform={MIRROR}>
        <Path d={dashedOutline} fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      </G>
      {/* Decorations */}
      <Circle cx={253} cy={81} r={3} fill="#1A1A2E" opacity={0.8} />
      <HollowDot cx={36} cy={110} r={4} color={c.dot} />
      <HollowDot cx={78} cy={119} r={4} color={c.dot} />
      <Sparkle x={61} y={130} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
      <Sparkle x={233} y={69} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationNeck() {
  const c = useIllusColors();
  const neck = 'M115,2 C122,15 134,30 134,55 L133,73';
  const shoulder = 'M133,73 C128,80 100,86 70,100 C40,114 26,150 23,204';
  return (
    <Svg width={W} height={H} viewBox={VB}>
      {/* Neck (faint) */}
      <G opacity={0.5}>
        <Path d={neck} fill="none" stroke={c.faint} strokeWidth={1.5} />
      </G>
      <G opacity={0.5} transform={MIRROR}>
        <Path d={neck} fill="none" stroke={c.faint} strokeWidth={1.5} />
      </G>
      {/* Shoulders */}
      <Path d={shoulder} fill="none" stroke={c.body} strokeWidth={2} />
      <G transform={MIRROR}>
        <Path d={shoulder} fill="none" stroke={c.body} strokeWidth={2} />
      </G>
      {/* Dashed ellipse around neck */}
      <Ellipse
        cx={165}
        cy={62}
        rx={46}
        ry={14}
        fill="none"
        stroke={c.dash}
        strokeWidth={2}
        strokeDasharray="7,5"
      />
      {/* Decorations */}
      <HollowDot cx={60} cy={93} r={3} color={c.dot} />
      <HollowDot cx={225} cy={60} r={5} color={c.dot} />
      <HollowDot cx={245} cy={93} r={3} color={c.dot} />
      <Sparkle x={78} y={75} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
      <Sparkle x={224} y={80} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationChest() {
  const c = useIllusColors();
  const side = 'M25,4 C26,40 22,75 20,100 L18,138 C12,150 8,165 4,185';
  const vee = 'M73,75 C68,110 55,160 51,203 M73,75 C82,110 88,160 86,203';
  return (
    <Svg width={W} height={H} viewBox={VB}>
      {/* Body contours */}
      <G opacity={0.7}>
        <Path d={side} fill="none" stroke={c.faint} strokeWidth={1.5} />
        <Path d={vee} fill="none" stroke={c.body} strokeWidth={1.5} />
      </G>
      <G opacity={0.7} transform={MIRROR}>
        <Path d={side} fill="none" stroke={c.faint} strokeWidth={1.5} />
        <Path d={vee} fill="none" stroke={c.body} strokeWidth={1.5} />
      </G>
      {/* Dashed measurement curve */}
      <Path d="M64,96 Q165,142 266,96" fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      {/* Decorations */}
      <HollowDot cx={116} cy={70} r={4} color={c.dot} />
      <HollowDot cx={113} cy={102} r={3} color={c.dot} />
      <HollowDot cx={206} cy={181} r={4} color={c.dot} />
      <Sparkle x={92} y={93} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
      <Sparkle x={224} y={163} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationArm() {
  const c = useIllusColors();
  return (
    <Svg width={W} height={H} viewBox={VB}>
      {/* Faint torso edge on the right */}
      <Path d="M327,95 C320,125 315,170 317,202 C322,165 326,125 327,95 Z" fill={c.faint} opacity={0.6} />
      {/* Arm contour (left) */}
      <Path
        d="M89,5 L88,54 L80,73 L80,136 C72,150 66,178 63,202"
        fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9}
      />
      {/* Body / armpit V (right) */}
      <Path d="M115,202 C118,160 128,110 137,70" fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9} />
      <Path d="M137,70 C146,100 152,140 148,202" fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9} />
      {/* Dashed ellipse (bicep circumference) */}
      <Ellipse cx={104} cy={112} rx={34} ry={7} fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="6,4" />
      {/* Decorations */}
      <HollowDot cx={37} cy={103} r={3} color={c.dot} />
      <HollowDot cx={27} cy={124} r={4} color={c.dot} />
      <HollowDot cx={155} cy={92} r={4.5} color={c.dot} />
      <HollowDot cx={173} cy={107} r={3} color={c.dot} />
      <Sparkle x={54} y={137} size={8} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationWaist() {
  const c = useIllusColors();
  const outer = 'M47,7 C45,35 44,55 36,72 C30,88 29,106 26,130 C23,160 20,185 18,204';
  const vee = 'M88,15 C82,45 78,80 74,106 C68,130 62,150 60,161 C55,178 48,192 41,204 M88,15 C95,45 100,70 102,87 C103,105 101,118 100,130 C96,160 92,185 88,204';
  return (
    <Svg width={W} height={H} viewBox={VB}>
      <G opacity={0.55}>
        <Path d={outer} fill="none" stroke={c.faint} strokeWidth={1.5} />
      </G>
      <G opacity={0.55} transform={MIRROR}>
        <Path d={outer} fill="none" stroke={c.faint} strokeWidth={1.5} />
      </G>
      <G opacity={0.9}>
        <Path d={vee} fill="none" stroke={c.body} strokeWidth={1.8} />
      </G>
      <G opacity={0.9} transform={MIRROR}>
        <Path d={vee} fill="none" stroke={c.body} strokeWidth={1.8} />
      </G>
      {/* Dashed waist curve */}
      <Path d="M92,104 Q165,142 238,104" fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      <HollowDot cx={91} cy={127} r={2.5} color={c.dot} />
      <HollowDot cx={86} cy={142} r={3.5} color={c.dot} />
      <HollowDot cx={200} cy={112} r={3} color={c.dot} />
      <Sparkle x={215} y={95} size={8} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
      <Sparkle x={110} y={136} size={8} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationHip() {
  const c = useIllusColors();
  const side = 'M84,3 C82,25 80,35 77,55 C72,85 68,110 68,134 C68,165 69,185 69,202';
  return (
    <Svg width={W} height={H} viewBox={VB}>
      <Path d={side} fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9} />
      <G transform={MIRROR}>
        <Path d={side} fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9} />
      </G>
      {/* Centre bar */}
      <Path d="M161,150 L169,150 L171,204 L160,204 Z" fill={c.faint} opacity={0.75} />
      {/* Dashed ellipse around hip */}
      <Ellipse cx={165} cy={88} rx={120} ry={20} fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      <HollowDot cx={234} cy={66} r={4} color={c.dot} />
      <HollowDot cx={244} cy={88} r={3} color={c.dot} />
      <HollowDot cx={36} cy={134} r={3} color={c.dot} />
      <Sparkle x={219} y={86} size={10} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
      <Sparkle x={52} y={118} size={7} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationGlute() {
  const c = useIllusColors();
  return (
    <Svg width={W} height={H} viewBox={VB}>
      <Path
        d="M135,7 C134,18 130,28 122,44 C112,62 108,80 111,95 C114,115 128,125 129,141 C129,165 127,180 126,197"
        fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9}
      />
      <Path
        d="M208,2 C205,30 207,50 213,70 C219,95 222,115 220,135 C219,160 214,180 208,197"
        fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9}
      />
      {/* Dashed curve across glute */}
      <Path d="M110,78 Q163,119 216,80" fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      <HollowDot cx={83} cy={82} r={3} color={c.dot} />
      <HollowDot cx={224} cy={67} r={4} color={c.dot} />
      <HollowDot cx={237} cy={79} r={3} color={c.dot} />
      <Sparkle x={97} y={62} size={8} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
    </Svg>
  );
}

function IllustrationThigh() {
  const c = useIllusColors();
  return (
    <Svg width={W} height={H} viewBox={VB}>
      <Path
        d="M69,3 C62,40 62,90 66,130 C68,160 71,180 73,199"
        fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9}
      />
      <Path
        d="M260,3 C265,40 267,100 263,140 C260,170 258,185 256,199"
        fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9}
      />
      {/* Inner legs (inverted U) */}
      <Path
        d="M147,204 C150,160 156,110 159,68 Q165,64 171,68 C172,100 176,150 181,204"
        fill="none" stroke={c.body} strokeWidth={1.8} opacity={0.9}
      />
      {/* Dashed thigh curve */}
      <Path d="M62,89 Q111,120 161,90" fill="none" stroke={c.dash} strokeWidth={2} strokeDasharray="7,5" />
      <HollowDot cx={35} cy={84} r={3} color={c.dot} />
      <HollowDot cx={150} cy={85} r={4} color={c.dot} />
      <HollowDot cx={138} cy={115} r={3} color={c.dot} />
      <Sparkle x={49} y={68} size={8} color={c.spark} stroke={c.sparkStroke} inner={0.32} />
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