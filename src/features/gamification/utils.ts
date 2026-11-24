import type {
  Badge,
  Challenge,
  Friend,
  FriendRequest,
  GameSettings,
  LeaderboardEntry,
  LeaderboardMetric,
  StreakInfo,
  UserSearchResult,
} from './types';

// Rule per REQUIREMENT.md (line 453):
// Daily goal achieved if >= 2 meals logged AND calories within +-10% of goal
export function checkDailyGoalAchieved(
  mealsLoggedCount: number,
  caloriesIn: number,
  caloriesGoal: number
): boolean {
  if (mealsLoggedCount < 2 || caloriesGoal <= 0) return false;
  const tolerance = caloriesGoal * 0.1;
  return Math.abs(caloriesIn - caloriesGoal) <= tolerance;
}

export interface BadgeVisualConfig {
  iconName: 'book-open' | 'flame' | 'users' | 'calendar' | 'trophy' | 'crown' | 'badge-check';
  primaryColor: string;
  secondaryColor: string;
  darkCanvasColor: string;
  glowColor: string;
  glyph: string;
  condition: string;
  pointsText: string;
}

export function getBadgeVisualConfig(badge: Badge): BadgeVisualConfig {
  const code = (badge.code || '').toUpperCase();
  const id = (badge.id || '').toLowerCase();

  // 1. First Log: Book/Diary - Cyan/Sky
  if (code === 'FIRST_LOG' || id === 'badge-first-log') {
    return {
      iconName: 'book-open',
      primaryColor: '#06B6D4',
      secondaryColor: '#0284C7',
      darkCanvasColor: '#0E7490',
      glowColor: 'rgba(6, 182, 212, 0.35)',
      glyph: '📝',
      condition: badge.condition || '1 lần ghi nhật ký',
      pointsText: `+${badge.points || 10} điểm`,
    };
  }

  // 2. Streak 7: Flame - Amber/Orange
  if (code === 'STREAK_7' || id === 'badge-streak-7' || id === 'streak-7') {
    return {
      iconName: 'flame',
      primaryColor: '#F97316',
      secondaryColor: '#EA580C',
      darkCanvasColor: '#9A3412',
      glowColor: 'rgba(249, 115, 22, 0.35)',
      glyph: '🔥',
      condition: badge.condition || '7 ngày liên tiếp',
      pointsText: `+${badge.points || 20} điểm`,
    };
  }

  // 3. First Friend: Users - Purple/Violet
  if (code === 'FIRST_FRIEND' || id === 'badge-first-friend' || id.includes('friend')) {
    return {
      iconName: 'users',
      primaryColor: '#8B5CF6',
      secondaryColor: '#6D28D9',
      darkCanvasColor: '#4C1D95',
      glowColor: 'rgba(139, 92, 246, 0.35)',
      glyph: '👥',
      condition: badge.condition || 'Kết bạn với 1 người',
      pointsText: `+${badge.points || 10} điểm`,
    };
  }

  // 4. Streak 30: Calendar - Emerald Green
  if (code === 'STREAK_30' || id === 'badge-streak-30' || id.includes('30')) {
    return {
      iconName: 'calendar',
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      darkCanvasColor: '#065F46',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      glyph: '📅',
      condition: badge.condition || '30 ngày liên tiếp',
      pointsText: `+${badge.points || 50} điểm`,
    };
  }

  // 5. Challenger: Trophy - Amber/Gold
  if (code === 'CHALLENGER' || id === 'badge-challenger') {
    return {
      iconName: 'trophy',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      darkCanvasColor: '#78350F',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      glyph: '🏆',
      condition: badge.condition || 'Hoàn thành 1 thử thách',
      pointsText: `+${badge.points || 20} điểm`,
    };
  }

  // 6. Streak 100: Crown - Ruby/Rose
  if (code === 'STREAK_100' || id === 'badge-streak-100' || id.includes('100')) {
    return {
      iconName: 'crown',
      primaryColor: '#E11D48',
      secondaryColor: '#BE123C',
      darkCanvasColor: '#881337',
      glowColor: 'rgba(225, 29, 72, 0.35)',
      glyph: '👑',
      condition: badge.condition || '100 ngày liên tiếp',
      pointsText: `+${badge.points || 150} điểm`,
    };
  }

  // 7. Challenger 5-Star: BadgeCheck - Indigo/Royal Violet
  if (code === 'CHALLENGER_5STAR' || id === 'badge-challenger-5star' || id.includes('5star') || id.includes('star')) {
    return {
      iconName: 'badge-check',
      primaryColor: '#6366F1',
      secondaryColor: '#4338CA',
      darkCanvasColor: '#312E81',
      glowColor: 'rgba(99, 102, 241, 0.35)',
      glyph: '⭐',
      condition: badge.condition || 'Hoàn thành 5 thử thách',
      pointsText: `+${badge.points || 60} điểm`,
    };
  }

  return {
    iconName: (badge.iconName as any) || 'trophy',
    primaryColor: badge.accentColor || '#F59E0B',
    secondaryColor: badge.secondaryColor || '#D97706',
    darkCanvasColor: badge.darkCanvasColor || '#78350F',
    glowColor: badge.glowColor || 'rgba(245, 158, 11, 0.35)',
    glyph: badge.iconGlyph || '🏆',
    condition: badge.condition || 'Hoàn thành mục tiêu',
    pointsText: `+${badge.points || 20} điểm`,
  };
}

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-log',
    code: 'FIRST_LOG',
    title: 'Lần ghi đầu tiên',
    description: 'Ghi nhận bữa ăn hoặc vận động đầu tiên vào nhật ký Kallo để bắt đầu hành trình sức khỏe.',
    category: 'nutrition',
    isUnlocked: true,
    unlockedAt: '10/11/2026',
    iconGlyph: '📝',
    iconName: 'book-open',
    accentColor: '#06B6D4',
    secondaryColor: '#0284C7',
    darkCanvasColor: '#0E7490',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    points: 10,
    condition: '1 lần ghi nhật ký',
  },
  {
    id: 'badge-streak-7',
    code: 'STREAK_7',
    title: 'Chuỗi 7 ngày',
    description: 'Hoàn thành mục tiêu hằng ngày 7 ngày liên tiếp để xây dựng thói quen chăm sóc sức khỏe vững vàng.',
    category: 'streak',
    isUnlocked: true,
    unlockedAt: '12/11/2026',
    iconGlyph: '🔥',
    iconName: 'flame',
    accentColor: '#F97316',
    secondaryColor: '#EA580C',
    darkCanvasColor: '#9A3412',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    points: 20,
    condition: '7 ngày liên tiếp',
  },
  {
    id: 'badge-first-friend',
    code: 'FIRST_FRIEND',
    title: 'Người bạn đầu tiên',
    description: 'Kết nối người bạn đầu tiên để cùng nhau thi đua và rèn luyện thói quen dinh dưỡng lành mạnh.',
    category: 'milestone',
    isUnlocked: true,
    unlockedAt: '14/11/2026',
    iconGlyph: '👥',
    iconName: 'users',
    accentColor: '#8B5CF6',
    secondaryColor: '#6D28D9',
    darkCanvasColor: '#4C1D95',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    points: 10,
    condition: 'Kết bạn với 1 người',
  },
  {
    id: 'badge-streak-30',
    code: 'STREAK_30',
    title: 'Chuỗi 30 ngày',
    description: 'Duy trì chuỗi hoàn thành mục tiêu 30 ngày liên tục không gián đoạn để biến kỷ luật thành lối sống.',
    category: 'streak',
    isUnlocked: false,
    iconGlyph: '📅',
    iconName: 'calendar',
    accentColor: '#10B981',
    secondaryColor: '#059669',
    darkCanvasColor: '#065F46',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    points: 50,
    condition: '30 ngày liên tiếp',
  },
  {
    id: 'badge-challenger',
    code: 'CHALLENGER',
    title: 'Thử thách gia',
    description: 'Hoàn thành thử thách cộng đồng đầu tiên để chứng minh ý chí bứt phá giới hạn bản thân.',
    category: 'milestone',
    isUnlocked: false,
    iconGlyph: '🏆',
    iconName: 'trophy',
    accentColor: '#F59E0B',
    secondaryColor: '#D97706',
    darkCanvasColor: '#78350F',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    points: 20,
    condition: 'Hoàn thành 1 thử thách',
  },
  {
    id: 'badge-streak-100',
    code: 'STREAK_100',
    title: 'Chuỗi 100 ngày',
    description: 'Kỷ lục bền bỉ với 100 ngày kiên trì rèn luyện sức khỏe, ghi danh vào bảng vàng kiên định.',
    category: 'streak',
    isUnlocked: false,
    iconGlyph: '🎖️',
    iconName: 'crown',
    accentColor: '#E11D48',
    secondaryColor: '#BE123C',
    darkCanvasColor: '#881337',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    points: 150,
    condition: '100 ngày liên tiếp',
  },
  {
    id: 'badge-challenger-5star',
    code: 'CHALLENGER_5STAR',
    title: 'Thử thách gia 5 sao',
    description: 'Chinh phục thành công 5 thử thách sức khỏe khác nhau trên Kallo và nhận danh hiệu cao quý.',
    category: 'milestone',
    isUnlocked: false,
    iconGlyph: '⭐',
    iconName: 'badge-check',
    accentColor: '#6366F1',
    secondaryColor: '#4338CA',
    darkCanvasColor: '#312E81',
    glowColor: 'rgba(99, 102, 241, 0.35)',
    points: 60,
    condition: 'Hoàn thành 5 thử thách',
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-water-7d',
    title: 'Uống đủ 2L nước 7 ngày',
    description: 'Uống đủ lượng nước mục tiêu mỗi ngày trong 7 ngày để duy trì sự cân bằng năng lượng và cải thiện làn da.',
    durationDays: 7,
    currentDay: 4,
    targetProgress: 7,
    currentProgress: 4,
    unit: 'ngày',
    rewardPoints: 150,
    isJoined: true,
    isCompleted: false,
    daysLeft: 3,
    startDate: '23/11',
    endDate: '29/11',
    metric: '2.0L / ngày',
    category: 'water',
    rewardBadgeTitle: 'Chiến binh Thủy hợp',
    highlightBadge: 'Gần xong!',
  },
  {
    id: 'challenge-steps-50k',
    title: 'Tuần lễ 50.000 bước chân',
    description: 'Tích lũy vận động hàng ngày để tiêu hao calo và cải thiện sức khỏe tim mạch.',
    durationDays: 7,
    currentDay: 4,
    targetProgress: 50000,
    currentProgress: 24800,
    unit: 'bước',
    rewardPoints: 200,
    isJoined: true,
    isCompleted: false,
    daysLeft: 3,
    startDate: '23/11',
    endDate: '29/11',
    metric: '50.000 bước',
    category: 'steps',
    rewardBadgeTitle: 'Chiến binh Thủy hợp',
  },
  {
    id: 'challenge-log-5d',
    title: 'Ghi nhật ký 5 ngày liên tục',
    description: 'Duy trì thói quen ghi lại các bữa ăn hàng ngày trong 5 ngày liên tiếp để theo dõi dinh dưỡng chuẩn xác.',
    durationDays: 5,
    currentDay: 3,
    targetProgress: 5,
    currentProgress: 3,
    unit: 'ngày',
    rewardPoints: 50,
    isJoined: false,
    isCompleted: false,
    daysLeft: 1,
    startDate: '23/11',
    endDate: '29/11',
    metric: '5 ngày',
    category: 'log',
    rewardBadgeTitle: 'Bút ký kiên trì',
    highlightBadge: 'Hôm nay',
  },
  {
    id: 'challenge-calorie-10d',
    title: 'Đạt mục tiêu calo 10 ngày',
    description: 'Kiểm soát calo nạp vào nằm trong phạm vi mục tiêu tiêu chuẩn trong 10 ngày liên tục.',
    durationDays: 10,
    currentDay: 4,
    targetProgress: 10,
    currentProgress: 4,
    unit: 'ngày',
    rewardPoints: 100,
    isJoined: false,
    isCompleted: false,
    daysLeft: 5,
    startDate: '20/11',
    endDate: '29/11',
    metric: '10 ngày',
    category: 'calorie',
    rewardBadgeTitle: 'Bậc thầy Calo',
  },
  {
    id: 'challenge-clean-eating',
    title: 'Ăn lành mạnh 14 ngày',
    description: 'Ghi nhật ký đủ 3 bữa chính và không vượt calo mục tiêu liên tục 2 tuần.',
    durationDays: 14,
    currentDay: 0,
    targetProgress: 14,
    currentProgress: 0,
    unit: 'ngày',
    rewardPoints: 500,
    isJoined: true,
    isCompleted: false,
    daysLeft: 3,
    startDate: '23/11',
    endDate: '29/11',
    metric: '14 ngày',
    category: 'eating',
    rewardBadgeTitle: 'Thực thần thanh khiết',
  },
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'friend-linh-chi',
    name: 'Linh Chi',
    username: 'linh_chi',
    avatarGlyph: '🏃‍♀️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsnS3icm-H4kgZ7UG_ZiI-E1NKmP9ib_AWBW--b2iAcAgNIyBb-OQD00poxIMyQUlyqwjcpOtq_MgZH4Xd5PP3Hgxx_dT-AcTMiYwX_ZW3l__PdvIV9LT2RSt0Mol6STQJfRGx379nX52EuQqsu-h9lG00bhRThglNSu2Bh9JrBMEUF8K8UIUnCIQ8UGsmeCvMbbOGbavm5URWtu71dC8-ENQ67rU-Z2Q1iKp-zR8',
    streak: 18,
    challengeScore: 1240,
    weeklySteps: 68500,
    isSharing: true,
    status: 'friend',
    tag: 'Quán quân',
    activityStatus: 'Chuỗi 18 ngày',
  },
  {
    id: 'friend-hoang-nam',
    name: 'Hoàng Nam',
    username: 'hoang_nam',
    avatarGlyph: '🏃‍♂️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc-t6xwG5W9BspgP0Zd1zuvVIOQGiuvipANMEvohdi6OOHQ1BUv0xeyMIv5oPQSjaiZJ_LZJqEk1g2XlK9yc1M-W5rnNsUoHekXM6RvYaJV4qmp7Os-qF_hfIsf0Y_lTVp2drvuxHJdRrOBu47W7tMU9ouiqnIEp7YqC34jsykrW8Wb1sHjiRqrEdVpYDVhD9bL6dODyLLiRkIz7w_Rk23MOxxsaDp69_svT-z8vU',
    streak: 12,
    challengeScore: 1080,
    weeklySteps: 59200,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Chuỗi 12 ngày',
  },
  {
    id: 'friend-tuan-kiet',
    name: 'Tuấn Kiệt',
    username: 'tuan_kiet',
    avatarGlyph: '👓',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF3uitS9DITnLiw5Crjmm5uTJyklDgDBEILrmXncDSnx7I7faOB6Mb4X1y3jXjRXkBD8r4SSiNPjPMJnSQSR6ZL5X6TWE9oF5xDa8XzG4D0cKcBPMNGX0VxwgEdAPGrHc8CvVCkzjRQ6vntXuY8trt9GrfrVYaVV7-NidmvX1gFwnZxxpVy1upcCmRvbNLUOLDMUgxaVjKQ19aq_eMuKDW_QkDVw3s4ipPFbKzn40',
    streak: 9,
    challengeScore: 940,
    weeklySteps: 54100,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Chuỗi 9 ngày',
    rankJump: '▲+2',
  },
  {
    id: 'friend-minh-anh',
    name: 'Minh Anh',
    username: 'minh_anh',
    avatarGlyph: '🏃‍♀️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1aTdkJDNGKx_5OhRn6LJi4hQ1VHkZdF-VDNFKPcn_WKc_TBJG305tX_31MpkplDDvxqcSSe_rWcT7_RddZ5HCgtTspKxEpR8psw5Nld5D5EU94SA38UVtyG-awkm24egqGMJuDQnF964IHUnNmA3xkGOlnNBy07bjAnIYVrObXgJ3MQ_VO0STouY1h2XuGQj-WpijBzPdVSUuqIgHyg-8VvPx7WB-rjr6s7CWAY',
    streak: 7,
    challengeScore: 860,
    weeklySteps: 51200,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Hoàn thành sáng nay',
    since: '12/10/2026',
    online: true,
  },
  {
    id: 'friend-quoc-bao',
    name: 'Quốc Bảo',
    username: 'quoc_bao',
    avatarGlyph: '👕',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5gkNVQRjoPw8FldJHb0CcEhtB4ZOUU5kx-IygiJBeiplldwupYgVf6O2yGT68jTvmjSKwAyby6_9Z9Il7__lgtlG3hSFVGKkJ-WZcd_GvHTvQWzba-ZWq17wZ6JH8DUziimXMmkzTdSLdqcyIV4JL4GB9NcBv6-0jeE8ZyzK3lfmMc_USTKTjJwkEXfJv7ZQxV4MflzF3g76i9PdBf5nPDfL55PzsybXvon-ln70',
    streak: 6,
    challengeScore: 860,
    weeklySteps: 49800,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Đồng hạng 4',
    since: '15/10/2026',
    online: true,
  },
  {
    id: 'friend-thu-ha',
    name: 'Thu Hà',
    username: 'thu_ha',
    avatarGlyph: '🧘‍♀️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8v6XmrMrt0YvMCs-48eQswp7xpbEjABNm8tMyeuDePBoVRnFfH1A5iaSP-tbChGYac2gA77_Xzg4V6BV-3VNaF44KoxiOSvNw-AbKqcWrzL4Piv6MXY1xKCUFV2JqTeYUmEy2yP3wZPTZRKffGC8Ws7cGu5Ozlh_CgKJM-6xotyeEnnKYBpkONRsYl0ZuynUO-A5StJHhDsmat-Br-oO-S4RbzPNzetaK_WBpsE0',
    streak: 8,
    challengeScore: 810,
    weeklySteps: 48500,
    isSharing: true,
    status: 'friend',
    since: '22/10/2026',
    online: false,
  },
  {
    id: 'friend-gia-huy',
    name: 'Gia Huy',
    username: 'gia_huy',
    avatarGlyph: '🎧',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZD-M3taDjS5kFUo5KV2uNtY3UkEvBREJ4N9Jp5k6NakObKEKBl_8e-hXR38h3BMoqn5wYPnQfygOY3Z68HORyCNYHNCAxKHgVcoWcTlnd8xnWVip9FVKMbtZJlhMEUH7IU9AQsAkHOmZQf5EA-mToElY57CmUkM2DfS_2cguRsH2uvJNUhumu85OecapxviNOHmtNxqVdWZ_LUQmGgG02RxdNCXmJpBDWMBY_So8',
    streak: 5,
    challengeScore: 780,
    weeklySteps: 46200,
    isSharing: true,
    status: 'friend',
    since: '28/10/2026',
    online: true,
  },
  {
    id: 'friend-ngoc-lan',
    name: 'Ngọc Lan',
    username: 'ngoc_lan',
    avatarGlyph: '🌸',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiC1H0HUEiPDOx04W9E2d96yjZDQArE7YztL3tIE7DYSUsmLSUAkMGzj5mNdhULifTQXXcJe73ygbKF-6EImbnLeh3_vQlfwq0llcaSJiN2dp8goLrwCzHvQrwE0d8qXWNDzTNlXi8vYEOXbmnniU_z3hjnSdVCr902dZLCEKaQkQZS_v6ZW5HFl5KJ2pqSgVp7iTuDSwimQuxjj6CwMKUXcu0lM6Yd6z_mG_SmnM',
    streak: 4,
    challengeScore: 710,
    weeklySteps: 43500,
    isSharing: true,
    status: 'friend',
    since: '02/11/2026',
    online: false,
  },
  {
    id: 'friend-duc-anh',
    name: 'Đức Anh',
    username: 'duc_anh',
    avatarGlyph: '🏃‍♂️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZdKaXvlNBPaw6ilgnei1O_x_rQonF2tvKSbzRha5Gous9WZTC5fcEegar4QM_nBbLiXF3xHuJF7-TnVJJJgxZHGV1FNKFVCACLsEQIdCnWnspuks1RnKMihCediHyBgcGjq_Fq96S7zeOSDgWix5eq9cU8A42KGbp7B-WxWDuCfHKaAQ3i5lztD8_78JA3UMYezPYTptKVmAcRYA7C9k7eGhlYGC_X-uwo-2Ppg',
    streak: 6,
    challengeScore: 680,
    weeklySteps: 41800,
    isSharing: true,
    status: 'friend',
    since: '09/11/2026',
    online: false,
  },
  {
    id: 'friend-phuong-linh',
    name: 'Phương Linh',
    username: 'phuong_linh',
    avatarGlyph: '🌿',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo_IIvCBH27t7ygBTLTFT8v_BGEcTme3amvBDWIqgPidJMivOB2uQKM47gQ62yOOw-X9Ykxc54t-A7i1j0QWjVLC_e1U0m0ZyQDNoMcO_6sEDSwPPpxjCACNOqvyB6fQjRFpTlE6ZerfJf9XE6yGMH9wT_DrSkZaFgxdoB7kcnASRDvsYhKsxXi56YNDHsS3k3Ly8VzdBhXLgMUpWA2zx0NcXs5O0_pa1apkylGJs',
    streak: 7,
    challengeScore: 650,
    weeklySteps: 39500,
    isSharing: true,
    status: 'friend',
    since: '18/11/2026',
    online: true,
  },
  {
    id: 'friend-thao-vy',
    name: 'Thảo Vy',
    username: 'thao_vy',
    avatarGlyph: '✨',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEw3NXbRQ2PoAtKcjuCkaoOs5WrUyofnof1fXLeKoQuM6mMu2T_Ivk7FXMzQHY72xA9OwuUez9Y2j0PrC8ZNDddgHYqfT5IDlAbaNx5wmxzptjNeQDvzIjb3DVrki-Bp-m6_RY_uV0d6OR_5l-imiMezW2G2cwunBZ92APG6e905dLoffiBMs_NaNVHXnVdTU74yQcz_ARjlBrv17V9hcVJxIOLtiCDxmiCXkXTX0',
    streak: 8,
    challengeScore: 790,
    weeklySteps: 47600,
    isSharing: true,
    status: 'friend',
    rankJump: '+2',
    activityStatus: 'Vừa tăng 2 hạng',
  },
  {
    id: 'friend-duc-huy',
    name: 'Đức Huy',
    username: 'duc_huy',
    avatarGlyph: '🎧',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx84lWGZPeaP018UIPBjtoG6CK9YGbD-TAf3wxTeU6KCMQYZYwOxFotpZob5Evj56CyCHb-uUtX5aeHa1RjHDqBFMR49ub2Df53AHrIm2iSVs4A0-EgrDP4u0tLFga8rVgBFu3zhbVyJGKpBlbGq0btZrbzIuvNWU6NoADj5AlO28e98vjmFifUxdrAeLn1SmVdr4osNiG7oF5JEvlEFp9VmUQUzyn1thqJBnj27A',
    streak: 5,
    challengeScore: 680,
    weeklySteps: 42100,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Giữ hạng',
  },
  {
    id: 'friend-ngoc-han',
    name: 'Ngọc Hân',
    username: 'ngoc_han',
    avatarGlyph: '🏃‍♀️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2qb-uc8fdhreEmSWDxAP_uGuJ559gZOtwfKoTy2C5u1LXH-OakzdNo7zqw_2xjLtMXsQxjqyJI-OKSp8aT9Q5orYJTeQBlwYUnfLD6c3oC2WHrz_IDOTeUe4E2WBK9m_1V1UewSImij-rdLza2Kqcn0eHyd7kcOWAxdnhC3IRstbqjTbA8tBitnqTZSwaB5ppzC-jzbGZ13s3OUxIjbd2EY4MihEz3wfNQKP0ZKc',
    streak: 4,
    challengeScore: 615,
    weeklySteps: 38400,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Giữ hạng',
  },
  {
    id: 'friend-gia-bao',
    name: 'Gia Bảo',
    username: 'gia_bao',
    avatarGlyph: '⚽',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpkB3HpP8BlV3RFyPp4UGe1wlImE569cMQGStCeUMpJLimQrmw2opv7TJ9dUA7cvbVfhdJ4c8hLCPpe0vuLnCGVK6oV90md7HnnsQXE1aJSB3mlXzBp_Nuxmw09mTXCmrK_vJ6GWx9uupHiOhOSenEgUOOLaMBlMoP2mp63vXw1vCPbWUnnUh6H0VaFFx9RoahshoctkCeHP0jNre6WHau-YgTMKVg5Klw4NYJJ14',
    streak: 7,
    challengeScore: 540,
    weeklySteps: 35100,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Giữ hạng',
  },
  {
    id: 'friend-thao-nhi',
    name: 'Thảo Nhi',
    username: 'thao_nhi',
    avatarGlyph: '👑',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARHzABot6wN-MBzMjTleRhxV7MyLAbjAdvv4TVXaugtS1fSqegYKwYltSJ8kRU7V7ApkhK5H6TUEE6V_NKFPCk7P6nSGS3uDDeYZJireSNn4JXS4fLFs-eJC9vNXcqm8ZjWBf8rNnyL4oELB33BmM9X7RQGO8LNdBMiRdQfPbONgA2eScOaca1E8Gf26fX9xYLW1HA7fvw8ulyrtzJuLe3ATWQUjOA-RcTDIxT6iI',
    streak: 12,
    challengeScore: 920,
    weeklySteps: 53000,
    isSharing: true,
    status: 'friend',
  },
  {
    id: 'friend-minh-khoi',
    name: 'Minh Khôi',
    username: 'minh_khoi',
    avatarGlyph: '💪',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN7YGrQRumGdA-gwdN2Q4lWHbFKzU-hwmUUy-AHaOOK_9lQfHJ4bQeHcMIAR6_lAOvSe5bRVJDCeW7Z34k8RYcoqqy5ISLLhPmUZ8X-KYIvQyCxgEl3v_9eEDDq-5SdPpV9Qvw0vjQv5lo4BtjzgpfT8_mqE6JNMh5WvzhIpICjDO54bBbstpJbLzdjcExPSwZQvDbSo6ZhZMeRgCCP-i5W39DwoGtvGuyYeFqEL4',
    streak: 9,
    challengeScore: 880,
    weeklySteps: 50400,
    isSharing: true,
    status: 'friend',
  },
  {
    id: 'friend-lan-phuong',
    name: 'Lan Phương',
    username: 'lan_phuong',
    avatarGlyph: '🥤',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbEDIqs-BxQK8eMKC0ZuzdqdyBmirdF3Y8Xk2j2dlEhKkW4sazJgxFLIY9-pgZafRdhBBIoxI34XoLH_0agVTV66zPnit20w5T6qWpc5XtrFCt6G77MgtwFrERx4Bh95sdYzehl6tELt43wSf0uTNwrlrc7fFeyR2gZqL4P6KGEvLcFk2fsvTwvn-39U64onCykZRCu0pqkahUijfBterzTqJyZR17S8_Wl5ukjj4',
    streak: 5,
    challengeScore: 650,
    weeklySteps: 41200,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Đã ghi nhận bữa tối',
  },
  {
    id: 'friend-khanh-linh',
    name: 'Khánh Linh',
    username: 'khanh_linh',
    avatarGlyph: '🧘‍♀️',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL6Xh0VuC5EGdamIqJKT_qmGufRrGBTKQ7MK6OjL_9Tby7rtgwIA58aXAYKvKsqqMCWYMh5r9BkbzLUnvwco991CgH_uGzo4G11i1O5ulin94L347kjXFJ9k9Eyl4pZ8QcFF93Zl7qD4zfyLgu7aogoM58WyqN5awOxi-2Om2S9xxExH3x9ThWurYFjtapxcP_3YUfJSZncej4cmJtBEMGi3k9GU1hUkmh0sppfzI',
    streak: 3,
    challengeScore: 580,
    weeklySteps: 33400,
    isSharing: true,
    status: 'friend',
    activityStatus: 'Hoàn thành yoga 30p',
  },
];

export function buildLeaderboard(
  metric: LeaderboardMetric,
  friends: Friend[],
  currentUser: { name: string; streak: number; challengeScore: number; weeklySteps: number; isSharing: boolean }
): LeaderboardEntry[] {
  const visibleFriends = friends.filter((f) => f.status === 'friend' && f.isSharing);

  const rawList: Array<{
    id: string;
    name: string;
    avatarGlyph: string;
    avatarUrl?: string;
    score: number;
    isCurrentUser?: boolean;
    streakDays?: number;
    tag?: string;
    rankChange?: string;
    subtitle?: string;
  }> = [];

  // Add current user if sharing enabled
  if (currentUser.isSharing) {
    const userScore =
      metric === 'streak'
        ? currentUser.streak
        : metric === 'challenge'
        ? currentUser.challengeScore
        : currentUser.weeklySteps;

    rawList.push({
      id: 'current-user',
      name: `${currentUser.name} (Bạn)`,
      avatarGlyph: '⭐',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2laVb9iFB3y3SIuPYJcpVmutzk1UN6JrJRzolxoAtMHhJaNHIA6CuPYFDMrCFxktUnR-esFhPAkyJ20eIlQ2G7mZ-NlNmEKmFu-CnWHEi6d2dCe_0eIA9qgmqfUGXjQVGNOkt7fOf2CSA-b6ERKMQIcIfzLKe46HbjkdGWOhilNzCs5BQJLBifmv8eUod7J9RITrqLuo7U-v51ab2bBoPtQPSiZeN1f5vSaZfDV4',
      score: userScore,
      isCurrentUser: true,
      streakDays: currentUser.streak,
      rankChange: '+1 hôm nay',
      subtitle: 'Chuỗi lửa đang cháy ổn định',
    });
  }

  // Add friends
  for (const f of visibleFriends) {
    const score =
      metric === 'streak'
        ? f.streak
        : metric === 'challenge'
        ? f.challengeScore
        : f.weeklySteps;

    rawList.push({
      id: f.id,
      name: f.name,
      avatarGlyph: f.avatarGlyph,
      avatarUrl: f.avatarUrl,
      score,
      isCurrentUser: false,
      streakDays: f.streak,
      tag: f.tag,
      rankChange: f.rankJump,
      subtitle: f.activityStatus ?? `Chuỗi ${f.streak} ngày`,
    });
  }

  // Sort descending
  rawList.sort((a, b) => b.score - a.score);

  const unit =
    metric === 'streak' ? 'ngày' : metric === 'challenge' ? 'điểm' : 'bước';

  return rawList.map((item, index) => ({
    rank: index + 1,
    id: item.id,
    name: item.name,
    avatarGlyph: item.avatarGlyph,
    avatarUrl: item.avatarUrl,
    score: item.score,
    unit,
    isCurrentUser: item.isCurrentUser,
    streakDays: item.streakDays,
    tag: item.tag,
    rankChange: item.rankChange,
    subtitle: item.subtitle,
  }));
}

export const INITIAL_GAME_SETTINGS: GameSettings = {
  friendCode: 'KALLO888',
  discoverable: true,
  shareStreak: true,
  sharePoints: true,
  shareSteps: false,
};

export const INITIAL_INCOMING_REQUESTS: FriendRequest[] = [
  {
    id: 'req-in-1',
    user: {
      id: 'user-in-1',
      displayName: 'Hoàng Bách',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVV0zTn30QRI2L0sNHbXWCocKhld18HJZcJ5bvEalvh8Mt5n3In_eWNOecgHxAYr7GDsEfrbNuvFPbxLOLpHoMudGL-X_ovZF5Wj9zkmWFON-8Pobtl4cEvCJY7sIn3TiEgH7i_7Ab0PsKwdUwCqvTIr7fEd00UB5sp_gsEN3j8HxX-hUFkX0Gt31euxKfGsNw0mu4CaTtHnYrXhfO3hr81TPFw8K3gO55lc1uNNw',
      verified: true,
      online: true,
      mutualFriendsCount: 4,
    },
    status: 'PENDING',
    createdAt: 'Gửi 2 giờ trước · Có 4 bạn chung',
  },
  {
    id: 'req-in-2',
    user: {
      id: 'user-in-2',
      displayName: 'Mai Chi',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9r17IwXh9fVg5ZH5ndIvuq9nw19oTyMQFkJJ1PzkUMt0ptDG0B3zg4xMoE8pf-EnIGHNcKjndHOvVtvc0hXNSAaOilvMVtKj3CnQTSTAnHyCAtWGSqdnH-6adXm-l0Fzr_2tpbLJIQja3kyGumRjzna2YgB6v2MsbUBd9E3dMTS2FvbFpGUcZP-nOZtwnW4AlJH9TPq_37f60gYH6nMXEOEhebdVjUZtJLOWQ_Qc',
      verified: false,
      online: false,
      mutualFriendsCount: 1,
    },
    status: 'PENDING',
    createdAt: 'Gửi hôm qua · Có 1 bạn chung',
  },
];

export const INITIAL_OUTGOING_REQUESTS: FriendRequest[] = [
  {
    id: 'req-out-1',
    user: {
      id: 'user-out-1',
      displayName: 'Thanh Tùng',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGD2JFb6JTcniEIg2eekvUg2EarN8Lb3phs2fxPSZpqYBJc4yZqi3Fw03qxHtRysWJHFWTa13UknyCOWwwA0LBwqjyp7u97-x_LRTwO7-3dgCTZG7_-fsEDQ4hUa5JsfU_i072xw80-9QXsJ8AviUgqUtn7HWNE3poUCPRHPrXF0gswXoT0BT06zCGhItSaoQF2yCoKWjHl5QuMdSGYTSxbUSoK6IhCmqYI_xD_10',
      online: false,
    },
    status: 'PENDING',
    createdAt: 'Đang chờ phản hồi',
  },
];

export const MOCK_SEARCH_USERS: UserSearchResult[] = [
  {
    id: 'search-1',
    displayName: 'Ngọc Mai',
    relationship: 'NONE',
  },
  {
    id: 'search-2',
    displayName: 'Quốc Bảo',
    relationship: 'PENDING_OUT',
  },
  {
    id: 'search-3',
    displayName: 'Thanh Hằng',
    relationship: 'PENDING_IN',
  },
  {
    id: 'search-4',
    displayName: 'Hải Đăng',
    relationship: 'NONE',
  },
  {
    id: 'search-5',
    displayName: 'Minh Hoàng',
    relationship: 'FRIENDS',
  },
];
