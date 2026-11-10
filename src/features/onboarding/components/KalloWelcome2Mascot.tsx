import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
  Text as SvgText,
} from 'react-native-svg';

export interface KalloWelcome2MascotProps {
  /** Kích thước chiều ngang/dọc của mascot (mặc định 320) */
  size?: number;
  /** Chế độ hiển thị: 'idle' | 'burst' */
  mode?: 'idle' | 'burst';
  /** Cho phép chạm vào để kích hoạt hiệu ứng bùng nổ */
  interactive?: boolean;
  /** Callback khi người dùng chạm vào */
  onPress?: () => void;
  /** Style bổ sung cho container */
  style?: StyleProp<ViewStyle>;
  /** Nhãn accessibility */
  accessibilityLabel?: string;
  testID?: string;
}

export function KalloWelcome2Mascot({
  size = 320,
  mode = 'idle',
  interactive = true,
  onPress,
  style,
  accessibilityLabel = 'Linh vật Kallo tính calo và dinh dưỡng',
  testID,
}: KalloWelcome2MascotProps) {
  const [currentMode, setCurrentMode] = useState<'idle' | 'burst'>(mode);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Các biến Animated độc lập chạy 100% trên Native UI Thread
  const flameOuter = useRef(new Animated.Value(0)).current;
  const flameInner = useRef(new Animated.Value(0)).current;
  const emberGroupA = useRef(new Animated.Value(0)).current;
  const emberGroupB = useRef(new Animated.Value(0)).current;
  const charBob = useRef(new Animated.Value(0)).current;
  const charScale = useRef(new Animated.Value(1)).current;
  const pillLeft = useRef(new Animated.Value(0)).current;
  const pillTopRight = useRef(new Animated.Value(0)).current;
  const pillBotRight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    const isBurst = currentMode === 'burst';
    const baseDur = isBurst ? 420 : 1400;

    const createLoop = (
      animVal: Animated.Value,
      duration: number,
      easing: (value: number) => number = Easing.inOut(Easing.sin)
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animVal, {
            toValue: 1,
            duration,
            easing,
            useNativeDriver: true,
          }),
          Animated.timing(animVal, {
            toValue: 0,
            duration,
            easing,
            useNativeDriver: true,
          }),
        ])
      );

    const loops = [
      createLoop(flameOuter, baseDur * 0.85),
      createLoop(flameInner, baseDur * 0.65),
      createLoop(emberGroupA, baseDur * 0.9),
      createLoop(emberGroupB, baseDur * 1.15),
      createLoop(charBob, baseDur * 0.95),
      createLoop(pillLeft, baseDur * 1.05),
      createLoop(pillTopRight, baseDur * 1.2),
      createLoop(pillBotRight, baseDur * 0.9),
    ];

    loops.forEach((l) => l.start());

    return () => {
      loops.forEach((l) => l.stop());
    };
  }, [
    currentMode,
    flameOuter,
    flameInner,
    emberGroupA,
    emberGroupB,
    charBob,
    pillLeft,
    pillTopRight,
    pillBotRight,
  ]);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) {
        clearTimeout(burstTimerRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    if (onPress) onPress();
    if (!interactive) return;

    if (burstTimerRef.current) {
      clearTimeout(burstTimerRef.current);
    }

    setCurrentMode('burst');
    Animated.sequence([
      Animated.timing(charScale, {
        toValue: 0.93,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(charScale, {
        toValue: 1.08,
        friction: 3,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(charScale, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    burstTimerRef.current = setTimeout(() => {
      setCurrentMode(mode);
    }, 1800);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      style={[styles.container, { width: size, height: size }, style]}
    >
      {/* 1. LỚP LỬA HÀO QUANG TẦNG NGOÀI (XÁM BẠC CHUYỂN SẮC) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                scaleY: flameOuter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, currentMode === 'burst' ? 1.08 : 1.04],
                }),
              },
              {
                scaleX: flameOuter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.02, 0.97],
                }),
              },
              {
                translateY: flameOuter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [3, -6],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Defs>
            <RadialGradient id="bgSoftGlow" cx="50%" cy="52%" r="46%">
              <Stop offset="0%" stopColor="#8A5CF5" stopOpacity="0.22" />
              <Stop offset="65%" stopColor="#6C3CE0" stopOpacity="0.06" />
              <Stop offset="90%" stopColor="#6C3CE0" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="outerFlameGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F1F3F9" />
              <Stop offset="35%" stopColor="#C5C9D6" />
              <Stop offset="100%" stopColor="#6E7385" />
            </LinearGradient>
          </Defs>

          <Circle cx="250" cy="260" r="220" fill="url(#bgSoftGlow)" />

          <Path
            d="M 102,425 C 68,350 75,270 108,235 C 98,262 118,270 128,255 C 110,190 140,125 182,88 C 178,125 198,138 212,125 C 228,72 260,34 282,18 C 276,75 292,125 316,162 C 334,132 365,112 385,102 C 368,148 378,188 394,218 C 412,195 432,186 444,182 C 432,238 438,340 400,425 Z"
            fill="url(#outerFlameGrad)"
            stroke="#9499AB"
            strokeWidth="2"
            strokeOpacity="0.35"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>

      {/* 2. LỚP LỬA HÀO QUANG TẦNG TRONG (XÁM THAN ĐẬM) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                scaleY: flameInner.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.03, 0.96],
                }),
              },
              {
                translateY: flameInner.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-4, 4],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Defs>
            <LinearGradient id="innerFlameGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#525668" />
              <Stop offset="60%" stopColor="#3F4354" />
              <Stop offset="100%" stopColor="#2E3240" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 122,425 C 94,355 98,285 124,252 C 116,275 132,282 142,268 C 128,205 154,148 188,116 C 185,148 202,158 216,145 C 232,96 258,64 276,46 C 270,96 286,145 308,180 C 325,152 350,136 368,128 C 355,168 364,205 378,232 C 394,212 410,206 420,202 C 412,252 416,345 384,425 Z"
            fill="url(#innerFlameGrad)"
          />
        </Svg>
      </Animated.View>

      {/* 3. LỚP TÀN LỬA BAY LƠ LỬNG NHÓM A & B */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: emberGroupA.interpolate({
              inputRange: [0, 1],
              outputRange: [0.65, 1],
            }),
            transform: [
              {
                translateY: emberGroupA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, -10],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Path
            d="M 138,85 C 142,62 154,48 164,52 C 166,58 152,72 138,85 Z"
            fill="#484C5E"
          />
          <Path
            d="M 42,320 C 34,292 40,262 52,264 C 58,270 46,296 42,320 Z"
            fill="#3D4152"
          />
          <Path
            d="M 398,116 C 396,95 385,82 378,86 C 375,92 388,104 398,116 Z"
            fill="#484C5E"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: emberGroupB.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.6],
            }),
            transform: [
              {
                translateY: emberGroupB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 6],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Path
            d="M 304,58 C 302,38 308,24 315,26 C 318,32 308,45 304,58 Z"
            fill="#484C5E"
          />
          <Path
            d="M 454,258 C 460,235 454,210 442,212 C 436,218 448,238 454,258 Z"
            fill="#3D4152"
          />
        </Svg>
      </Animated.View>

      {/* 4. LỚP NHÂN VẬT KALLO & CỐC NƯỚC TÍM (ĐÃ CĂN CHỈNH LẠI MẮT, MŨI, MIỆNG, RÂU) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: charBob.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, currentMode === 'burst' ? -10 : -5],
                }),
              },
              { scale: charScale },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Defs>
            <LinearGradient id="kalloHeadGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#8555F0" />
              <Stop offset="100%" stopColor="#6B3CE0" />
            </LinearGradient>
            <LinearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#B894FF" />
              <Stop offset="100%" stopColor="#8C5CF2" />
            </LinearGradient>
          </Defs>

          {/* Đôi tai mèo/thỏ */}
          <Path d="M 212,180 C 208,125 246,118 256,172 Z" fill="url(#kalloHeadGrad)" />
          <Path d="M 298,175 C 304,112 256,112 252,172 Z" fill="url(#kalloHeadGrad)" />
          <Path d="M 224,174 C 222,144 242,142 246,170 Z" fill="#181524" />
          <Path d="M 286,170 C 288,136 264,136 262,170 Z" fill="#181524" />

          {/* Phần Thân Tím */}
          <Path
            d="M 192,350 L 315,350 C 330,375 338,405 332,430 L 178,430 C 174,405 180,375 192,350 Z"
            fill="#6E3FE3"
          />
          {/* Đường viền cổ đen */}
          <Path
            d="M 196,356 Q 254,364 312,356"
            stroke="#161324"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Đầu Kallo (Nửa trên tím, nửa dưới má trắng xoay 3/4 về phía laptop) */}
          <Path
            d="M 140,275 C 140,192 188,162 255,162 C 322,162 370,192 370,275 C 370,328 326,356 255,356 C 184,356 140,328 140,275 Z"
            fill="url(#kalloHeadGrad)"
          />
          <Path
            d="M 141,280 C 141,264 172,258 205,264 C 222,268 228,262 236,262 C 244,262 252,268 272,264 C 310,258 348,262 354,280 C 358,325 318,356 250,356 C 182,356 141,326 141,280 Z"
            fill="#FFFFFF"
            stroke="#8555F0"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* MẮT TRÁI (Có khoảng cách sống mũi rõ ràng, không đè lên mũi) */}
          <Path
            d="M 160,234 Q 196,240 222,255 C 224,283 206,298 184,296 C 163,294 155,268 160,234 Z"
            fill="#FFFFFF"
            stroke="#D4D4D8"
            strokeWidth="1.2"
          />
          <Path
            d="M 170,237 Q 198,242 216,254 C 218,280 203,296 185,294 C 169,292 164,268 170,237 Z"
            fill="#14111F"
          />

          {/* MẮT PHẢI (Tách khỏi mắt trái 28px tạo sống mũi thoáng) */}
          <Path
            d="M 312,234 Q 276,240 250,255 C 248,283 266,298 288,296 C 309,294 317,268 312,234 Z"
            fill="#FFFFFF"
            stroke="#D4D4D8"
            strokeWidth="1.2"
          />
          <Path
            d="M 302,237 Q 274,242 256,254 C 254,280 269,296 287,294 C 303,292 308,268 302,237 Z"
            fill="#14111F"
          />

          {/* Chân mày nhíu chữ V sắc nét trên trán tím */}
          <Path
            d="M 214,226 L 229,242 M 258,226 L 243,242"
            stroke="#14111F"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* MŨI TIM ĐEN (Đã hạ xuống y=280..291 nằm gọn giữa phần dưới 2 mắt) */}
          <Path
            d="M 228,281 C 228,275 236,275 236,280 C 236,275 244,275 244,281 C 244,286 236,291 236,291 C 236,291 228,286 228,281 Z"
            fill="#14111F"
          />

          {/* MIỆNG CHỮ Y NGƯỢC (Đã hạ xuống y=290..304, tách biệt hoàn toàn khỏi mắt) */}
          <Path
            d="M 236,290 L 224,304 M 236,290 L 248,304"
            stroke="#14111F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* RÂU MÈO 2 BÊN MÁ (Đã đẩy râu phải ra ngoài để không chạm vào mắt) */}
          <Path
            d="M 140,290 L 166,293 M 142,305 L 168,301 M 300,293 L 328,290 M 298,302 L 326,306"
            stroke="#14111F"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Cốc nước tím & Bàn tay trái cầm cốc */}
          <G>
            <Path
              d="M 266,368 L 314,368 L 308,426 C 306,434 274,434 272,426 Z"
              fill="url(#cupGrad)"
            />
            <Ellipse cx="298" cy="390" rx="14" ry="8" fill="#7846EB" stroke="#47229C" strokeWidth="2" />
            <Ellipse cx="294" cy="404" rx="15" ry="8.5" fill="#7846EB" stroke="#47229C" strokeWidth="2" />
            <Ellipse cx="298" cy="418" rx="14" ry="8" fill="#7846EB" stroke="#47229C" strokeWidth="2" />
          </G>
        </Svg>
      </Animated.View>

      {/* 5. LỚP MẶT BÀN & LAPTOP IN DẤU CHÂN MÈO */}
      <Animated.View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Defs>
            <LinearGradient id="laptopGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#E5D1FF" />
              <Stop offset="100%" stopColor="#CFAFFF" />
            </LinearGradient>
          </Defs>

          <Rect
            x="16"
            y="424"
            width="468"
            height="62"
            rx="31"
            fill="#232230"
            stroke="#5E5B78"
            strokeWidth="2"
            strokeOpacity="0.45"
          />

          <Ellipse cx="205" cy="448" rx="125" ry="7" fill="#14131D" />

          <Path
            d="M 60,312 C 60,305 66,300 74,300 L 212,300 C 220,300 226,305 228,312 L 244,435 L 76,435 Z"
            fill="url(#laptopGrad)"
          />
          <Path d="M 95,435 L 175,300 L 198,300 L 118,435 Z" fill="#FFFFFF" fillOpacity="0.3" />
          <Path d="M 128,435 L 208,300 L 218,300 L 138,435 Z" fill="#FFFFFF" fillOpacity="0.2" />

          <G transform="translate(152, 376) rotate(-10)">
            <Path
              d="M -18,6 C -22,-8 22,-8 18,6 C 22,18 12,24 0,22 C -12,24 -22,18 -18,6 Z"
              fill="#B388FF"
              stroke="#9061F9"
              strokeWidth="2"
            />
            <Ellipse cx="-20" cy="-10" rx="6.5" ry="9" transform="rotate(-20 -20 -10)" fill="#B388FF" stroke="#9061F9" strokeWidth="2" />
            <Ellipse cx="-7" cy="-18" rx="6.5" ry="9.5" transform="rotate(-6 -7 -18)" fill="#B388FF" stroke="#9061F9" strokeWidth="2" />
            <Ellipse cx="8" cy="-18" rx="6.5" ry="9.5" transform="rotate(8 8 -18)" fill="#B388FF" stroke="#9061F9" strokeWidth="2" />
            <Ellipse cx="21" cy="-8" rx="6.5" ry="9" transform="rotate(22 21 -8)" fill="#B388FF" stroke="#9061F9" strokeWidth="2" />
          </G>

          <Rect x="74" y="432" width="238" height="14" rx="6" fill="#C49EFF" />
          <Rect x="74" y="432" width="168" height="14" rx="4" fill="#D8BAFF" />
        </Svg>
      </Animated.View>

      {/* 6. LỚP 3 THẺ MÓN ĂN TRÔI NỔI ("cơm tấm", "phở gà", "bún bò") */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: pillLeft.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, -9],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Rect
            x="26"
            y="185"
            width="116"
            height="42"
            rx="21"
            fill="#05DF72"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <SvgText
            x="84"
            y="212"
            fill="#0F172A"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
          >
            cơm tấm
          </SvgText>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: pillTopRight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-7, 7],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Rect
            x="352"
            y="148"
            width="102"
            height="42"
            rx="21"
            fill="#05DF72"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <SvgText
            x="403"
            y="175"
            fill="#0F172A"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
          >
            phở gà
          </SvgText>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: pillBotRight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, -8],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Rect
            x="370"
            y="355"
            width="102"
            height="42"
            rx="21"
            fill="#05DF72"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <SvgText
            x="421"
            y="382"
            fill="#0F172A"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
          >
            bún bò
          </SvgText>
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

export default KalloWelcome2Mascot;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
