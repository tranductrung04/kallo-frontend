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
  Circle,
  Ellipse,
  Text as SvgText,
} from 'react-native-svg';

export type ChampionMascotMode = 'idle' | 'burst' | 'victory';

export interface ChampionMascotRNProProps {
  /** Kích thước chiều ngang của mascot (mặc định 300) */
  size?: number;
  /** Chế độ hiển thị: 'idle' | 'burst' | 'victory' */
  mode?: ChampionMascotMode;
  /** Cho phép chạm vào linh vật để kích hoạt hiệu ứng bùng nổ năng lượng */
  interactive?: boolean;
  /** Callback khi người dùng chạm vào linh vật */
  onPress?: () => void;
  /** Style bổ sung cho container */
  style?: StyleProp<ViewStyle>;
  /** Nhãn accessibility cho linh vật */
  accessibilityLabel?: string;
  testID?: string;
}

export function ChampionMascotRNPro({
  size = 300,
  mode = 'idle',
  interactive = true,
  onPress,
  style,
  accessibilityLabel = 'Linh vật Champion Kallo',
  testID,
}: ChampionMascotRNProProps) {
  const [currentMode, setCurrentMode] = useState<ChampionMascotMode>(mode);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Giữ nguyên 100% các biến Animated chạy trên Native UI Thread
  const charFloat = useRef(new Animated.Value(0)).current;
  const charScale = useRef(new Animated.Value(1)).current;
  const pillarPulse = useRef(new Animated.Value(0)).current;
  const laurelSway = useRef(new Animated.Value(0)).current;
  const jetFlicker = useRef(new Animated.Value(0)).current;
  const cloudWaveA = useRef(new Animated.Value(0)).current;
  const cloudWaveB = useRef(new Animated.Value(0)).current;
  const sparkGroupA = useRef(new Animated.Value(0)).current;
  const sparkGroupB = useRef(new Animated.Value(0)).current;
  const shockwave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    const isBurst = currentMode === 'burst';
    const isVictory = currentMode === 'victory';
    const baseDur = isBurst ? 420 : isVictory ? 550 : 1500;

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
      createLoop(charFloat, baseDur),
      createLoop(pillarPulse, baseDur * 1.1),
      createLoop(laurelSway, baseDur * 1.25),
      createLoop(jetFlicker, isBurst ? 140 : 260, Easing.linear),
      createLoop(cloudWaveA, baseDur * 0.95),
      createLoop(cloudWaveB, baseDur * 1.3),
      createLoop(sparkGroupA, baseDur * 0.8),
      createLoop(sparkGroupB, baseDur * 1.15),
    ];

    loops.forEach((l) => l.start());

    let shockLoop: Animated.CompositeAnimation | undefined;
    if (isBurst) {
      shockwave.setValue(0);
      shockLoop = Animated.loop(
        Animated.timing(shockwave, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );
      shockLoop.start();
    } else {
      shockwave.setValue(0);
    }

    return () => {
      loops.forEach((l) => l.stop());
      if (shockLoop) shockLoop.stop();
    };
  }, [
    currentMode,
    charFloat,
    pillarPulse,
    laurelSway,
    jetFlicker,
    cloudWaveA,
    cloudWaveB,
    sparkGroupA,
    sparkGroupB,
    shockwave,
  ]);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) {
        clearTimeout(burstTimerRef.current);
      }
    };
  }, []);

  const triggerBurstEffect = () => {
    if (onPress) onPress();
    if (!interactive) return;

    if (burstTimerRef.current) {
      clearTimeout(burstTimerRef.current);
    }

    setCurrentMode('burst');
    shockwave.setValue(0);

    Animated.sequence([
      Animated.timing(charScale, {
        toValue: 0.9,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(charScale, {
        toValue: 1.12,
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
    }, 2000);
  };

  const renderLaurelLeaves = (side: 'left' | 'right' = 'left') => {
    const isLeft = side === 'left';
    const leaves = [];
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const angle = (1 - t) * 0.95 - 0.25;
      const cx = isLeft
        ? 150 - Math.sin(angle) * 58
        : 350 + Math.sin(angle) * 58;
      const cy = 315 - t * 175;
      const rot = isLeft ? -35 + i * 7 : 35 - i * 7;

      leaves.push(
        <G
          key={`${side}-${i}`}
          transform={`translate(${cx}, ${cy}) rotate(${rot})`}
        >
          <Path
            d="M 0,0 C -10,-8 -14,-20 -4,-28 C 4,-20 6,-8 0,0 Z"
            fill="#C7A6FF"
          />
          <Path
            d="M 2,-2 C 12,-8 18,-18 10,-26 C 2,-18 0,-8 2,-2 Z"
            fill="#B388FF"
          />
        </G>
      );
    }
    return leaves;
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={triggerBurstEffect}
      style={[styles.container, { width: size, height: size * 1.04 }, style]}
    >
      {/* 1. LỚP CỘT NĂNG LƯỢNG TÍM (ĐÃ BỎ VIỀN ĐEN, THAY BẰNG VIỀN ÁNH TÍM TRONG SUỐT) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                scale: pillarPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.98, currentMode === 'burst' ? 1.05 : 1.02],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Defs>
            <LinearGradient id="pillarGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#733FE0" />
              <Stop offset="65%" stopColor="#4B1FA1" />
              <Stop offset="100%" stopColor="#311173" />
            </LinearGradient>
            <LinearGradient id="pillarStrokeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#B388FF" stopOpacity="0.6" />
              <Stop offset="50%" stopColor="#7C4DFF" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#451B96" stopOpacity="0.1" />
            </LinearGradient>
            <RadialGradient id="bgBloom" cx="50%" cy="48%" r="45%">
              <Stop offset="0%" stopColor="#9D6BFF" stopOpacity="0.28" />
              <Stop offset="60%" stopColor="#7C4DFF" stopOpacity="0.08" />
              <Stop offset="85%" stopColor="#6A35D4" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Quầng sáng nền tan mịn vào cả nền Trắng lẫn Tối */}
          <Circle cx="250" cy="250" r="220" fill="url(#bgBloom)" />

          {/* Cột năng lượng chính với viền sáng tím bán trong suốt */}
          <Path
            d="M 74,122 C 74,105 95,105 108,128 L 140,185 L 360,185 L 392,128 C 405,105 426,105 426,122 L 426,370 C 426,398 398,416 360,416 L 140,416 C 102,416 74,398 74,370 Z"
            fill="url(#pillarGrad)"
            stroke="url(#pillarStrokeGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>

      {/* 2. LỚP VÒNG NGUYỆT QUẾ */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                scaleX: laurelSway.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.98, 1.03],
                }),
              },
              {
                translateY: laurelSway.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, -4],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          {renderLaurelLeaves('left')}
          {renderLaurelLeaves('right')}
        </Svg>
      </Animated.View>

      {/* 3. LỚP LUỒNG PHẢN LỰC DƯỚI CHÂN */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: jetFlicker.interpolate({
              inputRange: [0, 1],
              outputRange: [0.72, 1],
            }),
            transform: [
              {
                scaleX: jetFlicker.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1.06],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Defs>
            <LinearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <Stop offset="35%" stopColor="#B388FF" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#4F21A8" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 205,330 Q 250,315 295,330 L 360,445 Q 250,465 140,445 Z"
            fill="url(#beamGrad)"
          />
        </Svg>
      </Animated.View>

      {/* 4. LỚP VÒNG SÓNG XUNG KÍCH (SHOCKWAVE) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: shockwave.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 0.9, 0],
            }),
            transform: [
              {
                scale: shockwave.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.45, 1.45],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Circle
            cx="250"
            cy="225"
            r="120"
            fill="none"
            stroke="#B388FF"
            strokeWidth="5"
          />
          <Circle
            cx="250"
            cy="225"
            r="95"
            fill="none"
            stroke="#2EF2A8"
            strokeWidth="3"
          />
        </Svg>
      </Animated.View>

      {/* 5. LỚP MÂY NĂNG LƯỢNG TẦNG SAU (KHÔNG VIỀN ĐEN) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateX: cloudWaveA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-5, 5],
                }),
              },
              {
                scaleY: cloudWaveA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, 1.04],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Path
            d="M 30,442 Q 95,398 182,415 Q 250,368 318,415 Q 405,398 470,442 Q 415,460 350,450 Q 250,482 150,450 Q 85,460 30,442 Z"
            fill="#5D2EC2"
            stroke="#9D75F8"
            strokeWidth="2"
            strokeOpacity="0.35"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>

      {/* 6. LỚP MÂY NĂNG LƯỢNG TẦNG TRƯỚC */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateX: cloudWaveB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, -6],
                }),
              },
              {
                translateY: cloudWaveB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, -4],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Path
            d="M 75,460 Q 150,420 250,432 Q 350,420 425,460 Q 345,485 250,478 Q 155,485 75,460 Z"
            fill="#431B96"
            stroke="#7C4DFF"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
        </Svg>
      </Animated.View>

      {/* 7. LỚP HẠT NĂNG LƯỢNG & TIA CHỚP NHÓM A (THAY VIỀN ĐEN BẰNG HÀO QUANG TÍM) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: sparkGroupA.interpolate({
              inputRange: [0, 1],
              outputRange: [0.55, 1],
            }),
            transform: [
              {
                translateY: sparkGroupA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, -10],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Circle cx="76" cy="144" r="11" fill="#7C4DFF" fillOpacity="0.25" />
          <Circle cx="76" cy="144" r="6.5" fill="#8C5CFF" />

          <Circle cx="395" cy="123" r="9.5" fill="#7C4DFF" fillOpacity="0.25" />
          <Circle cx="395" cy="123" r="5.5" fill="#8C5CFF" />

          <Circle cx="442" cy="179" r="9" fill="#7C4DFF" fillOpacity="0.25" />
          <Circle cx="442" cy="179" r="5" fill="#8C5CFF" />

          <Circle cx="164" cy="364" r="5" fill="#A675FF" />

          {/* Tia tốc độ trên phải: Dùng viền tím dịu thay cho viền đen */}
          <Path
            d="M 340,110 L 376,74"
            stroke="#8A5CF5"
            strokeOpacity="0.45"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <Path
            d="M 340,110 L 376,74"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* 8. LỚP HẠT NĂNG LƯỢNG & TIA CHỚP NHÓM B */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: sparkGroupB.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.5],
            }),
            transform: [
              {
                translateY: sparkGroupB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 6],
                }),
              },
              {
                translateX: sparkGroupB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-3, 4],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Circle cx="148" cy="105" r="9" fill="#7C4DFF" fillOpacity="0.25" />
          <Circle cx="148" cy="105" r="5" fill="#8C5CFF" />

          <Circle cx="426" cy="118" r="11" fill="#7C4DFF" fillOpacity="0.25" />
          <Circle cx="426" cy="118" r="6.5" fill="#8C5CFF" />

          <Circle cx="332" cy="348" r="6.5" fill="#A675FF" />

          {/* Tia tốc độ dưới phải & trái */}
          <Path
            d="M 412,365 L 466,312"
            stroke="#8A5CF5"
            strokeOpacity="0.45"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <Path
            d="M 412,365 L 466,312"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 126,370 L 160,336"
            stroke="#E2D4FF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* 9. LỚP NHÂN VẬT MASCOT TRUNG TÂM (VIỀN KÉP NỔI BẬT TRÊN CẢ NỀN TRẮNG & TỐI) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: charFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, currentMode === 'victory' ? -20 : -12],
                }),
              },
              {
                scale: charScale,
              },
              {
                scale: charFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, currentMode === 'burst' ? 1.06 : 1.02],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 520">
          <Defs>
            <LinearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#8A5CF5" />
              <Stop offset="100%" stopColor="#6C3CE0" />
            </LinearGradient>
            <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#7B4AE8" />
              <Stop offset="70%" stopColor="#9D75F8" />
              <Stop offset="100%" stopColor="#FFFFFF" />
            </LinearGradient>
            <RadialGradient id="auraGlowOuter" cx="50%" cy="44%" r="40%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <Stop offset="50%" stopColor="#D8C2FF" stopOpacity="0.45" />
              <Stop offset="80%" stopColor="#9D6BFF" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#7C4DFF" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="footJetGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="50%" stopColor="#D6BFFF" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#9D6BFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Hào quang quanh thân & Phản lực bàn chân */}
          <Ellipse cx="250" cy="205" rx="135" ry="155" fill="url(#auraGlowOuter)" />
          <Ellipse cx="226" cy="356" rx="26" ry="18" fill="url(#footJetGlow)" />
          <Ellipse cx="274" cy="356" rx="26" ry="18" fill="url(#footJetGlow)" />

          {/* Lớp 1 của Viền Sticker: Viền tím dịu ngoài cùng giúp không bị chìm khi sang Nền Trắng */}
          <Path
            d="M 212,48 C 212,22 246,22 250,48 C 254,22 288,22 288,48 C 292,68 294,78 294,85 C 342,96 368,135 368,185 C 368,222 342,248 308,255 C 320,272 328,296 322,312 C 316,322 302,320 295,314 L 292,352 C 290,375 262,375 256,352 L 250,332 L 244,352 C 238,375 210,375 208,352 L 205,314 C 198,320 184,322 178,312 C 172,296 180,272 192,255 C 158,248 132,222 132,185 C 132,135 158,96 206,85 C 206,78 208,68 212,48 Z"
            fill="none"
            stroke="#8A5CF5"
            strokeOpacity="0.28"
            strokeWidth="16"
            strokeLinejoin="round"
          />

          {/* Lớp 2 của Viền Sticker: Viền trắng chính của Mascot */}
          <Path
            d="M 212,48 C 212,22 246,22 250,48 C 254,22 288,22 288,48 C 292,68 294,78 294,85 C 342,96 368,135 368,185 C 368,222 342,248 308,255 C 320,272 328,296 322,312 C 316,322 302,320 295,314 L 292,352 C 290,375 262,375 256,352 L 250,332 L 244,352 C 238,375 210,375 208,352 L 205,314 C 198,320 184,322 178,312 C 172,296 180,272 192,255 C 158,248 132,222 132,185 C 132,135 158,96 206,85 C 206,78 208,68 212,48 Z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinejoin="round"
          />

          {/* Thân & Tay Chân */}
          <Path
            d="M 205,248 L 295,248 C 312,265 322,290 315,308 C 308,315 298,310 293,298 L 288,348 C 286,364 264,364 258,348 L 250,318 L 242,348 C 236,364 214,364 212,348 L 207,298 C 202,310 192,315 185,308 C 178,290 188,265 205,248 Z"
            fill="url(#bodyGrad)"
          />

          {/* Cổ áo & Móng tay */}
          <Path
            d="M 202,252 Q 250,258 298,252"
            stroke="#161224"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <Path
            d="M 186,304 L 188,298 M 193,306 L 195,300 M 314,304 L 312,298 M 307,306 L 305,300"
            stroke="#161224"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Đôi tai */}
          <Path d="M 216,95 C 212,42 246,42 250,90 Z" fill="url(#headGrad)" />
          <Path d="M 284,95 C 288,42 254,42 250,90 Z" fill="url(#headGrad)" />
          <Path d="M 225,92 C 224,62 242,62 244,90 Z" fill="#1C162B" />
          <Path d="M 275,92 C 276,62 258,62 256,90 Z" fill="#1C162B" />

          {/* Đầu & Má trắng */}
          <Path
            d="M 144,185 C 144,115 190,82 250,82 C 310,82 356,115 356,185 C 356,228 318,252 250,252 C 182,252 144,228 144,185 Z"
            fill="url(#headGrad)"
          />
          <Path
            d="M 144,186 C 144,172 175,165 205,172 C 228,176 238,162 250,162 C 262,162 272,176 295,172 C 325,165 356,172 356,186 C 356,228 318,252 250,252 C 182,252 144,228 144,186 Z"
            fill="#FFFFFF"
          />

          {/* Đôi mắt sắc lạnh */}
          <Path
            d="M 186,142 Q 218,148 242,162 C 244,186 226,198 205,196 C 186,194 180,174 186,142 Z"
            fill="#FFFFFF"
          />
          <Path
            d="M 194,146 Q 220,152 240,162 C 240,184 224,194 206,192 C 192,190 188,172 194,146 Z"
            fill="#14111F"
          />
          <Path
            d="M 314,142 Q 282,148 258,162 C 256,186 274,198 295,196 C 314,194 320,174 314,142 Z"
            fill="#FFFFFF"
          />
          <Path
            d="M 306,146 Q 280,152 260,162 C 260,184 276,194 294,192 C 308,190 312,172 306,146 Z"
            fill="#14111F"
          />

          {/* Chân mày, Mũi, Miệng & Râu */}
          <Path
            d="M 232,138 L 245,150 M 268,138 L 255,150"
            stroke="#14111F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Path
            d="M 244,174 C 244,170 250,170 250,173 C 250,170 256,170 256,174 C 256,178 250,182 250,182 C 250,182 244,178 244,174 Z"
            fill="#14111F"
          />
          <Path
            d="M 250,181 L 241,192 M 250,181 L 259,192"
            stroke="#14111F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Path
            d="M 162,188 L 185,190 M 164,200 L 186,198 M 338,188 L 315,190 M 336,200 L 314,198"
            stroke="#14111F"
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* Huy chương #1 */}
          <G transform="translate(278, 282)">
            <Path
              d="M -12,14 L -14,32 L -4,26 L 6,32 L 10,14 Z"
              fill="#2CE59B"
            />
            <Circle
              cx="0"
              cy="0"
              r="21"
              fill="#10D48E"
              stroke="#2EF2A8"
              strokeWidth="3"
            />
            <Circle cx="0" cy="0" r="15" fill="#FFFFFF" />
            <SvgText
              x="0"
              y="7"
              fill="#10D48E"
              fontSize="21"
              fontWeight="900"
              textAnchor="middle"
            >
              1
            </SvgText>
          </G>
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

export default ChampionMascotRNPro;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
