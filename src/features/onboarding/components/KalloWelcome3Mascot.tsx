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
  Line,
  Text as SvgText,
} from 'react-native-svg';

export interface KalloWelcome3MascotProps {
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

export function KalloWelcome3Mascot({
  size = 320,
  mode = 'idle',
  interactive = true,
  onPress,
  style,
  accessibilityLabel = 'Linh vật Kallo chuyên gia dinh dưỡng',
  testID,
}: KalloWelcome3MascotProps) {
  const [currentMode, setCurrentMode] = useState<'idle' | 'burst'>(mode);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Các biến Animated chạy 100% trên Native UI Thread
  const raysPulse = useRef(new Animated.Value(0)).current;
  const badgeSwing = useRef(new Animated.Value(0)).current;
  const badgeFloat = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;
  const starsPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    const isBurst = currentMode === 'burst';
    const baseDur = isBurst ? 500 : 1600;

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
      createLoop(raysPulse, baseDur * 0.9),
      createLoop(badgeSwing, baseDur * 1.15),
      createLoop(badgeFloat, baseDur * 0.85),
      createLoop(starsPulse, baseDur * 0.6),
    ];

    loops.forEach((l) => l.start());

    return () => {
      loops.forEach((l) => l.stop());
    };
  }, [currentMode, raysPulse, badgeSwing, badgeFloat, starsPulse]);

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
      Animated.timing(badgeScale, {
        toValue: 0.94,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(badgeScale, {
        toValue: 1.08,
        friction: 3,
        tension: 110,
        useNativeDriver: true,
      }),
      Animated.spring(badgeScale, {
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

  // Góc đung đưa con lắc của thẻ
  const swingRotate = badgeSwing.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3.5deg', '3.5deg'],
  });

  // Render ngôi sao 5 cánh bo góc mềm và giãn đều khoảng cách
  const renderStar = (cx: number, cy: number, index: number) => (
    <G key={index} transform={`translate(${cx}, ${cy})`}>
      <Path
        d="M 0,-13.5 L 4,-4.4 L 14,-3 L 6.8,4 L 8.5,13.8 L 0,9 L -8.5,13.8 L -6.8,4 L -14,-3 L -4,-4.4 Z"
        fill="#05DF72"
        stroke="#05DF72"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </G>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      style={[styles.container, { width: size, height: size }, style]}
    >
      {/* 1. LỚP CHÙM TIA HÀO QUANG PHÍA SAU */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: raysPulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.65, 1],
            }),
            transform: [
              {
                scale: raysPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, currentMode === 'burst' ? 1.08 : 1.03],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Defs>
            <RadialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#8C859B" stopOpacity="0.45" />
              <Stop offset="65%" stopColor="#948DA6" stopOpacity="0.18" />
              <Stop offset="95%" stopColor="#948DA6" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <G transform="translate(250, 265)">
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, idx) => (
              <Path
                key={idx}
                d="M -14,0 L -38,-235 L 38,-235 L 14,0 Z"
                fill="url(#rayGrad)"
                transform={`rotate(${deg})`}
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      {/* 2. LỚP THẺ CHUYÊN GIA DINH DƯỠNG ĐUNG ĐƯA CON LẮC */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: badgeFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [3, -8],
                }),
              },
              { rotate: swingRotate },
              { scale: badgeScale },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <Defs>
            <LinearGradient id="cardFrameGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="100%" stopColor="#6D37E0" />
            </LinearGradient>
            <LinearGradient id="avatarHeadGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#8A5CF5" />
              <Stop offset="100%" stopColor="#6E3FE3" />
            </LinearGradient>
          </Defs>

          {/* Cụm thẻ nghiêng -8 độ chuẩn theo ảnh gốc */}
          <G transform="translate(250, 265) rotate(-8) translate(-250, -265)">
            {/* Khung thẻ tím phía ngoài */}
            <Path
              d="M 182,115 C 184,98 196,90 212,90 L 288,90 C 304,90 316,98 318,115 L 325,135 L 420,135 C 456,135 482,162 482,198 L 482,365 C 482,402 456,428 420,428 L 80,428 C 44,428 18,402 18,365 L 18,198 C 18,162 44,135 80,135 L 175,135 Z"
              fill="url(#cardFrameGrad)"
              stroke="#A78BFA"
              strokeWidth="2.5"
              strokeOpacity="0.55"
            />

            {/* Khe móc dây đeo trên đỉnh thẻ */}
            <Rect
              x="212"
              y="108"
              width="76"
              height="12"
              rx="6"
              fill="#E2E8F0"
            />

            {/* Dây đeo chữ V màu xám than phía trên */}
            <Path d="M 232,116 L 246,16 L 286,16 L 270,116 Z" fill="#2A2736" />
            <Path d="M 218,116 L 196,20 L 238,20 L 258,116 Z" fill="#3D394D" />

            {/* Nền thẻ màu kem vàng nhạt bên trong */}
            <Rect
              x="36"
              y="154"
              width="428"
              height="256"
              rx="38"
              fill="#FEFCE8"
            />

            {/* Thanh tiêu đề màu tím nhạt phía trên mặt thẻ */}
            <Path
              d="M 36,192 C 36,168 54,154 78,154 L 422,154 C 446,154 464,168 464,192 L 464,202 L 36,202 Z"
              fill="#9B6BFF"
            />

            {/* Vệt bóng kính chéo qua thanh tiêu đề */}
            <Path
              d="M 118,202 L 154,154 L 210,154 L 174,202 Z"
              fill="#FFFFFF"
              fillOpacity="0.28"
            />
            <Path
              d="M 184,202 L 220,154 L 242,154 L 206,202 Z"
              fill="#FFFFFF"
              fillOpacity="0.22"
            />

            {/* KHUNG AVATAR KALLO BÊN TRÁI (ĐÃ CĂN CHỈNH LẠI MŨI, MIỆNG & VAI ÁO) */}
            <G transform="translate(56, 224)">
              {/* Nền khung ảnh tím pastel */}
              <Rect
                x="0"
                y="0"
                width="146"
                height="146"
                rx="32"
                fill="#EDE4FF"
              />

              {/* Tai mèo/thỏ Kallo */}
              <Path d="M 48,42 C 45,10 68,10 72,38 Z" fill="url(#avatarHeadGrad)" />
              <Path d="M 98,42 C 101,10 78,10 74,38 Z" fill="url(#avatarHeadGrad)" />
              <Path d="M 55,39 C 54,20 66,20 68,37 Z" fill="#1C1829" />
              <Path d="M 91,39 C 92,20 80,20 78,37 Z" fill="#1C1829" />

              {/* Thân áo tím dưới đáy khung avatar (Mở rộng vai giống ảnh gốc) */}
              <Path
                d="M 38,116 L 108,116 C 114,126 118,136 120,146 L 26,146 C 28,136 32,126 38,116 Z"
                fill="#7B4AE8"
              />
              <Path
                d="M 42,120 Q 73,125 104,120"
                stroke="#181424"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Nếp áo 2 bên */}
              <Path
                d="M 42,135 L 46,146 M 104,135 L 100,146"
                stroke="#181424"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Đầu Kallo */}
              <Path
                d="M 14,82 C 14,42 40,28 73,28 C 106,28 132,42 132,82 C 132,110 108,122 73,122 C 38,122 14,110 14,82 Z"
                fill="url(#avatarHeadGrad)"
              />
              {/* Má trắng */}
              <Path
                d="M 14,86 C 14,76 34,72 52,76 C 64,78 68,72 73,72 C 78,72 82,78 94,76 C 112,72 132,76 132,86 C 132,110 108,122 73,122 C 38,122 14,110 14,86 Z"
                fill="#FFFFFF"
              />

              {/* Mắt trái & Mắt phải (Cách nhau rõ ràng ở sống mũi) */}
              <Path
                d="M 35,60 Q 53,64 65,73 C 66,87 57,95 45,93 C 35,91 31,78 35,60 Z"
                fill="#FFFFFF"
                stroke="#D4D4D8"
                strokeWidth="0.8"
              />
              <Path
                d="M 40,62 Q 55,66 64,73 C 65,85 56,93 46,91 C 38,89 36,76 40,62 Z"
                fill="#161321"
              />

              <Path
                d="M 111,60 Q 93,64 81,73 C 80,87 89,95 101,93 C 111,91 115,78 111,60 Z"
                fill="#FFFFFF"
                stroke="#D4D4D8"
                strokeWidth="0.8"
              />
              <Path
                d="M 106,62 Q 91,66 82,73 C 81,85 90,93 100,91 C 108,89 110,76 106,62 Z"
                fill="#161321"
              />

              {/* Chân mày nhíu chữ V */}
              <Path
                d="M 62,56 L 69,64 M 84,56 L 77,64"
                stroke="#161321"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Mũi tim đen & Miệng chữ Y ngược (Đã hạ xuống đúng vị trí dưới mắt) */}
              <Path
                d="M 69,83 C 69,80 73,80 73,82.5 C 73,80 77,80 77,83 C 77,86 73,89 73,89 C 73,89 69,86 69,83 Z"
                fill="#161321"
              />
              <Path
                d="M 73,88 L 66,96 M 73,88 L 80,96"
                stroke="#161321"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Râu mèo 2 bên */}
              <Path
                d="M 20,90 L 34,92 M 21,98 L 35,96 M 126,90 L 112,92 M 125,98 L 111,96"
                stroke="#161321"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Vệt sáng bóng chéo trên khung ảnh */}
              <Path
                d="M 18,125 L 92,15 L 116,15 L 42,125 Z"
                fill="#FFFFFF"
                fillOpacity="0.22"
              />
            </G>

            {/* NỘI DUNG CHỮ BÊN PHẢI THẺ (ĐÃ TÁCH RIÊNG 2 THẺ SVGTEXT ĐỂ KHÔNG BỊ ĐÈ CHỮ) */}
            <G transform="translate(218, 246)">
              {/* Dòng 1: Họ tên: Kallo (Tách thành 2 tọa độ x độc lập) */}
              <SvgText
                x="0"
                y="0"
                fill="#262638"
                fontSize="20"
                fontWeight="500"
              >
                Họ tên:
              </SvgText>
              <SvgText
                x="74"
                y="0"
                fill="#0F0F17"
                fontSize="21"
                fontWeight="900"
              >
                Kallo
              </SvgText>

              <Line
                x1="0"
                y1="12"
                x2="224"
                y2="12"
                stroke="#D6D3C4"
                strokeWidth="1.5"
              />

              {/* Dòng 2: Chức vụ: */}
              <SvgText
                x="0"
                y="42"
                fill="#262638"
                fontSize="20"
                fontWeight="500"
              >
                Chức vụ:
              </SvgText>

              <Line
                x1="0"
                y1="52"
                x2="224"
                y2="52"
                stroke="#D6D3C4"
                strokeWidth="1.5"
              />

              {/* Dòng 3: CHUYÊN GIA DINH DƯỠNG */}
              <SvgText
                x="0"
                y="79"
                fill="#0F0F17"
                fontSize="18.5"
                fontWeight="900"
              >
                CHUYÊN GIA DINH DƯỠNG
              </SvgText>

              <Line
                x1="0"
                y1="89"
                x2="224"
                y2="89"
                stroke="#D6D3C4"
                strokeWidth="1.5"
              />
            </G>
          </G>
        </Svg>
      </Animated.View>

      {/* 3. LỚP 5 NGÔI SAO XANH LÁ LẤP LÁNH TRÊN THẺ (ĐÃ GIÃN ĐỀU KHOẢNG CÁCH) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: badgeFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [3, -8],
                }),
              },
              { rotate: swingRotate },
              {
                scale: starsPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.98, 1.04],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 500 500">
          <G transform="translate(250, 265) rotate(-8) translate(-250, -265)">
            {renderStar(236, 374, 0)}
            {renderStar(275, 374, 1)}
            {renderStar(314, 374, 2)}
            {renderStar(353, 374, 3)}
            {renderStar(392, 374, 4)}
          </G>
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

export default KalloWelcome3Mascot;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
