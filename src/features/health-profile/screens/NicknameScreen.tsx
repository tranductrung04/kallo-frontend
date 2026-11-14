import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';

interface NicknameScreenProps {
  navigation?: any;
  onNext?: (nickname: string) => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

export function NicknameScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: NicknameScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { draft, updateDraft } = useHealthProfileDraft();
  const [nickname, setNickname] = useState(draft.nickname || '');

  const isValid = nickname.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;
    const cleanName = nickname.trim();
    updateDraft('nickname', cleanName);

    if (onNext) {
      onNext(cleanName);
    } else if (navigation?.navigate) {
      navigation.navigate('GenderSelection');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

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
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Top Bar ────────────────────────────────────────────── */}
        {!hideHeader && (
          <>
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

            {/* ── Progress Bar ───────────────────────────────────────── */}
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: isDark
                    ? '#272049'
                    : theme.colors.surfaceBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.brandPrimary,
                    width: '10%',
                  },
                ]}
              />
            </View>
          </>
        )}

        {/* ── Avatar & Speech Bubble Row ─────────────────────────── */}
        <View style={styles.bubbleRow}>
          <View
            style={[
              styles.avatarWrap,
              {
                backgroundColor: isDark ? '#2E2654' : '#EDE5FF',
                borderColor: isDark ? '#4A3D7E' : '#D4C7F8',
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
              !isDark && {
                borderWidth: 1,
                borderColor: theme.colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                styles.bubbleTail,
                !isDark && {
                  borderLeftWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: theme.colors.surfaceBorder,
                },
              ]}
            />
            <AppText style={styles.bubbleText}>
              Và Kallo sẽ gọi bạn là...
            </AppText>
          </View>
        </View>

        {/* ── Input Section ──────────────────────────────────────── */}
        <View style={styles.inputSection}>
          <AppText
            style={[
              styles.inputPrompt,
              {
                color: isDark ? '#9CA3AF' : theme.colors.textSecondary,
              },
            ]}
          >
            Nhập nickname mà bạn muốn sử dụng
          </AppText>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Nickname"
            placeholderTextColor={isDark ? '#453E65' : theme.colors.textDisabled}
            style={[
              styles.textInput,
              {
                color: isDark ? '#FFFFFF' : theme.colors.textPrimary,
                borderBottomColor: isDark
                  ? '#302854'
                  : theme.colors.surfaceBorder,
              },
            ]}
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            selectionColor={theme.colors.brandPrimary}
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />
        </View>

        {/* ── Bottom Action Button ───────────────────────────────── */}
        <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isValid
                ? {
                    backgroundColor: theme.colors.brandAction,
                    shadowColor: theme.colors.brandPrimary,
                  }
                : {
                    backgroundColor: isDark ? '#252044' : '#E4E0F0',
                  },
            ]}
            onPress={handleNext}
            disabled={!isValid}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục"
            accessibilityState={{ disabled: !isValid }}
          >
            <AppText
              style={[
                styles.buttonText,
                isValid
                  ? styles.buttonTextActive
                  : { color: isDark ? '#655D85' : '#A6A1B8' },
              ]}
            >
              Tiếp tục
            </AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  keyboardContainer: {
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
    height: 4,
    backgroundColor: '#272049',
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 2,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2E2654',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#4A3D7E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 52,
    height: 52,
  },
  bubble: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexShrink: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    top: 18,
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  inputSection: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 38,
  },
  inputPrompt: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  textInput: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#302854',
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#9358F7',
    shadowColor: '#9358F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonDisabled: {
    backgroundColor: '#252044',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: '#655D85',
  },
});
