# KẾ HOẠCH TRIỂN KHAI GIAO DIỆN NGƯỜI DÙNG (UI IMPLEMENTATION PLAN)
## Dự án: Kallo — Ứng dụng Chăm sóc Sức khỏe & Dinh dưỡng Tích hợp AI

| Hạng mục | Chi tiết |
|---|---|
| **Nền tảng** | React Native (Expo Managed/Prebuild Workflow) — Android & iOS |
| **Ngôn ngữ** | TypeScript |
| **Tài liệu tham chiếu** | `REQUIREMENT.md` (SRS v1.1) & Bộ tài nguyên `res*` |
| **Thời gian dự kiến** | 13 tuần (chia làm 7 Phase) |

---

## Mục lục

1. [Tổng quan kiến trúc UI & Công nghệ](#1-tổng-quan-kiến-trúc-ui--công-nghệ)
2. [Cấu trúc thư mục Frontend](#2-cấu-trúc-thư-mục-frontend)
3. [Hệ thống Thiết kế (Design System) & Quy chuẩn tài nguyên](#3-hệ-thống-thiết-kế-design-system--quy-chuẩn-tài-nguyên)
4. [Cấu trúc Điều hướng (Navigation Architecture)](#4-cấu-trúc-điều-hướng-navigation-architecture)
5. [Lộ trình triển khai chi tiết theo từng Phase](#5-lộ-trình-triển-khai-chi-tiết-theo-từng-phase)
   - [Phase 1: Khởi tạo, Design System & Khung điều hướng (Tuần 1–2)](#phase-1-khởi-tạo-design-system--khung-điều-hướng-tuần-12)
   - [Phase 2: Onboarding V2, Xác thực & Thiết lập Hồ sơ Sức khỏe (Tuần 3–4)](#phase-2-onboarding-v2-xác-thực--thiết-lập-hồ-sơ-sức-khỏe-tuần-34)
   - [Phase 3: Trang chủ (Dashboard), Nhật ký Dinh dưỡng, Nước & Cân nặng (Tuần 5–6)](#phase-3-trang-chủ-dashboard-nhật-ký-dinh-dưỡng-nước--cân-nặng-tuần-56)
   - [Phase 4: AI Meal Scan (Camera nhận diện món Việt) & Quét Mã vạch (Tuần 6–8)](#phase-4-ai-meal-scan-camera-nhận-diện-món-việt--quét-mã-vạch-tuần-68)
   - [Phase 5: Theo dõi Vận động, Đồng bộ Sức khỏe & Biểu đồ Báo cáo (Tuần 8–9)](#phase-5-theo-dõi-vận-động-đồng-bộ-sức-khỏe--biểu-đồ-báo-cáo-tuần-89)
   - [Phase 6: Thực đơn AI, Trợ lý Chatbot & Gamification / Xã hội (Tuần 9–11)](#phase-6-thực-đơn-ai-trợ-lý-chatbot--gamification--xã-hội-tuần-911)
   - [Phase 7: Tiện ích Hệ thống, Ngoại tuyến (Offline-first) & Tinh chỉnh UX (Tuần 11–13)](#phase-7-tiện-ích-hệ-thống-ngoại-tuyến-offline-first--tinh-chỉnh-ux-tuần-1113)
6. [Bảng ánh xạ Tài nguyên Hình ảnh (Asset Mapping Matrix)](#6-bảng-ánh-xạ-tài-nguyên-hình-ảnh-asset-mapping-matrix)
7. [Tiêu chuẩn Hiệu năng, Truy cập (Accessibility) & Kiểm thử UI](#7-tiêu-chuẩn-hiệu-năng-truy-cập-accessibility--kiểm-thử-ui)

---

## 1. Tổng quan kiến trúc UI & Công nghệ

Để đáp ứng các yêu cầu phi chức năng trong `REQUIREMENT.md` (mở ứng dụng $\le 3$ giây, tải Dashboard $\le 2$ giây, ghi nhật ký bằng ảnh tối đa $3$ thao tác chạm sau khi chụp), tầng UI được xây dựng với bộ thư viện tối ưu hiệu năng:

| Nhóm chức năng | Thư viện sử dụng | Mục đích trong Kallo |
|---|---|---|
| **Core & Build** | Expo SDK 52+, React Native, TypeScript | Hỗ trợ Custom Dev Client để tích hợp module native (Camera, Health) |
| **Điều hướng** | `@react-navigation/native`, `native-stack`, `bottom-tabs` | Quản lý luồng Auth, Onboarding, Main Bottom Tabs và Modal Stack |
| **Quản lý State** | `Zustand` + `react-native-mmkv` | State cục bộ (Auth, Theme, Onboarding draft, Offline Queue) tốc độ cao |
| **Server State & Cache** | `@tanstack/react-query` (+ Persister) | Đồng bộ REST API, caching cho chế độ ngoại tuyến (FR-SYS-05) |
| **Hoạt ảnh & Gesture** | `react-native-reanimated`, `react-native-gesture-handler` | Vòng tiến độ Calo 60fps, thước kéo cân nặng/chiều cao, hiệu ứng Streak |
| **Đồ họa & Biểu đồ** | `victory-native` + `@shopify/react-native-skia`, `react-native-svg` | Vẽ biểu đồ Calo, Macro, Cân nặng, đường xu hướng dự báo và Bounding Box AI |
| **Bottom Sheet & Modal** | `@gorhom/bottom-sheet` | Ghi nhanh lượng nước, chỉnh khẩu phần món ăn, xác nhận kết quả AI |
| **Camera & Barcode** | `react-native-vision-camera`, `vision-camera-code-scanner` | Chụp ảnh nhận diện món ăn (FR-NUT-02) và quét mã vạch (FR-NUT-05) |
| **Nén & Hiển thị ảnh** | `expo-image`, `expo-image-manipulator` | Hiển thị ảnh `.webp` mượt mà, resize ảnh cạnh dài $\le 1280\text{ px}$ ($\le 2\text{ MB}$) trước khi gửi AI |
| **Cảm biến & Sức khỏe** | `react-native-health-connect`, `react-native-health`, `expo-sensors`, `expo-location` | Đồng bộ bước chân/nhịp tim, đếm bước cảm biến, vẽ lộ trình chạy bộ |
| **Biểu mẫu & Kiểm tra** | `react-hook-form` + `zod` | Kiểm tra tức thì dữ liệu đầu vào (chiều cao, cân nặng, email, món ăn tùy chỉnh) |

---

## 2. Cấu trúc thư mục Frontend

```text
src/
├── assets/
│   ├── images/                  # Toàn bộ file .webp và .png được chuẩn hóa theo module
│   │   ├── account/             # cardbg.webp, communitybanner.webp, target.webp
│   │   ├── artworks/            # applehealth.webp, healthconnect.webp, facebook.webp...
│   │   ├── bodymetric/          # introartwork.webp, whrhint.webp
│   │   ├── course/              # artwork.webp, empty01.webp, empty02.webp
│   │   ├── dependents/          # me.webp, sister.webp, son.webp
│   │   ├── home/                # headerbg.webp
│   │   ├── mealplanai/          # mealplan_step1..3.webp, new_ai_banner.webp, recipe_suggestion.webp...
│   │   ├── mealscan/            # corner*.png, mealscan01..02.webp, mealscanbg.webp, scannotfound.webp...
│   │   ├── onboarding/          # deficitstep0..4.webp, deficitic1..5.png, *scale.webp, weight*.png...
│   │   ├── onboardingv2/        # welcome1..3.webp, male.webp, female.webp, mascot.webp...
│   │   ├── premium/             # paywall*.webp, trialbannerartwork.webp...
│   │   ├── recipescan/          # recipescanintroductionartwork.webp
│   │   ├── report/              # chartbg.webp, lampicon.webp, wlcardbg.webp
│   │   ├── scanbarcode/         # barcodescanintro.webp, scangrid.webp, scanline.webp
│   │   ├── streak/              # streakactivebg.webp, streakachievedart1..2.webp, freezestreakart1.webp...
│   │   ├── tracker/             # caloriesburnedchart.webp, droplet.webp, fill_*.webp, fire.webp, weight.webp...
│   │   ├── voicelog/            # bg.webp, voicelogmascot.webp
│   │   ├── walkthrough/         # arrowtop01.png, arrowtop02.png
│   │   └── water/               # waterbottle.webp, watercup.webp
│   └── fonts/                   # Font chữ hỗ trợ tiếng Việt đầy đủ (Be Vietnam Pro / Plus Jakarta Sans)
├── components/
│   ├── common/                  # Button, Text, Input, Card, Badge, Avatar, EmptyState, Skeleton
│   ├── charts/                  # CalorieRing, MacroProgressBar, WeightLineChart, CalorieBarChart
│   ├── feedback/                # OfflineBanner, Toast, LoadingOverlay, ErrorBoundary, WalkthroughTooltip
│   └── modals/                  # ForceUpdateModal, MaintenanceModal, AllergyWarningModal,CongratulationModal
├── navigation/
│   ├── RootNavigator.tsx        # Chuyển đổi Auth / Onboarding / Main + Global Modals
│   ├── AuthNavigator.tsx        # Login, Register, ForgotPassword, ResetPassword
│   ├── OnboardingNavigator.tsx  # Luồng thiết lập hồ sơ sức khỏe 10 bước
│   └── MainTabNavigator.tsx     # 5 Bottom Tabs (Home, Diary, [AI Scan CTA], Report, Profile)
├── features/                    # Chia theo đúng 9 module trong REQUIREMENT.md
│   ├── auth/                    # FR-AUTH-01..08
│   ├── profile/                 # FR-PRO-01..08 (Bao gồm Onboarding V2 & Body Metrics)
│   ├── nutrition/               # FR-NUT-01..13, FR-FD-01..07 (Diary, AI Scan, Barcode, Water, Custom Food)
│   ├── meal-plan/               # FR-PLAN-01..06 (3-step AI Wizard, Swap Food)
│   ├── assistant/               # FR-CHAT-01..06 (Chatbot streaming WebSocket)
│   ├── activity/                # FR-ACT-01..08 (Exercise log, Health Connect / HealthKit, Weight log)
│   ├── report/                  # FR-REP-01..08 (Dashboard, Charts, Weight Forecast)
│   ├── gamification/            # FR-GAM-01..07 (Streak, Badges, Challenges, Friends, Leaderboard)
│   └── system/                  # FR-SYS-01..08 (Notifications, Reminders, Offline Sync Queue)
├── services/
│   ├── api/                     # Axios client + JWT Refresh Interceptor
│   ├── websocket/               # STOMP/WebSocket client cho Chat & Leaderboard
│   └── offline/                 # SyncManager, Queue processor với client_uuid
├── store/                       # Zustand stores
├── theme/                       # Colors, Typography, Spacing, Shadows, Dark/Light tokens
└── utils/                       # Công thức BMI/BMR/TDEE, định dạng ngày/tiền tệ VNĐ, bỏ dấu tiếng Việt
```

---

## 3. Hệ thống Thiết kế (Design System) & Quy chuẩn tài nguyên

### 3.1. Bảng màu chuẩn hóa (Color Tokens)
Đảm bảo độ tương phản đạt chuẩn **WCAG AA** ($\ge 4.5:1$ cho văn bản thường) và nhất quán cho 3 nhóm chất đa lượng (Macro) xuyên suốt toàn bộ ứng dụng:

| Nhóm | Token | Mã màu (Light / Dark) | Ứng dụng trong UI |
|---|---|---|---|
| **Thương hiệu (Brand)** | `primary.main` | `#2ECC71` / `#27AE60` | Nút hành động chính (CTA), tab đang chọn, trạng thái đạt mục tiêu |
| | `primary.surface` | `#EAFAF1` / `#143022` | Nền thẻ gợi ý AI, nền highlight |
| **Năng lượng (Calories)** | `calorie.in` | `#FF7675` / `#FF6B6B` | Vòng tiến độ Calo nạp, biểu tượng lửa (`tracker_fire.webp`) |
| | `calorie.burned` | `#FDCB6E` / `#F39C12` | Calo tiêu hao từ vận động |
| **3 Nhóm Macro** | `macro.protein` | `#E84393` (Hồng/Đỏ) | Thanh tiến độ & biểu đồ chất đạm ($4\text{ kcal/g}$) |
| | `macro.carbs` | `#0984E3` (Xanh dương) | Thanh tiến độ & biểu đồ tinh bột ($4\text{ kcal/g}$) |
| | `macro.fat` | `#FDCB6E` (Vàng cam) | Thanh tiến độ & biểu đồ chất béo ($9\text{ kcal/g}$) |
| **Tiện ích theo dõi** | `tracker.water` | `#00CEC9` (Xanh ngọc) | Thẻ uống nước (`tracker_droplet.webp`, `water_watercup.webp`) |
| | `tracker.streak` | `#FF9F43` (Cam lửa) | Chuỗi ngày Streak, huy hiệu |
| **Trạng thái (Semantic)** | `status.warning` | `#F39C12` | Cảnh báo sắp vượt calo, dị ứng nhẹ |
| | `status.danger` | `#D63031` | Cảnh báo vượt $100\%$ calo mục tiêu (FR-SYS-02), chứa chất dị ứng (FR-NUT-10) |

### 3.2. Typography & Địa phương hóa
- **Font chữ:** `Be Vietnam Pro` hoặc `Plus Jakarta Sans` (hiển thị rõ dấu tiếng Việt, số liệu bảng biểu dùng `fontVariant: ['tabular-nums']` để các con số nhảy mượt không bị lệch cột).
- **Hỗ trợ cỡ chữ hệ thống:** Giới hạn `maxFontSizeMultiplier={1.3}` trên các thành phần thẻ hẹp để không vỡ bố cục khi người dùng bật chữ lớn.
- **Định dạng chuẩn Việt Nam (Mục 9.8):**
  - Chiều cao: $\text{cm}$, Cân nặng: $\text{kg}$ (lấy $1$ chữ số thập phân, ví dụ $62,5\text{ kg}$).
  - Năng lượng: $\text{kcal}$, Nước: $\text{ml}$, Tiền tệ: $\text{VNĐ}$ (ví dụ $45.000\text{ đ}$).

### 3.3. Quy chuẩn Quản lý Placeholder & Hình ảnh
Dựa trên bộ tài nguyên đã trích xuất, hệ thống sử dụng component `<AppImage />` bọc ngoài `expo-image` với placeholder tự động theo tỷ lệ khung hình:
- Tỷ lệ $1:1$ (ảnh món ăn, avatar): `src_assets_images_placeholder_11.webp`, `src_assets_images_fooddefault.webp`, `src_assets_images_defaultavatar.webp`.
- Tỷ lệ $16:9$ (banner thực đơn, thử thách): `src_assets_images_placeholder_169.webp`.
- Tỷ lệ $4:3$ & $3:4$ (ảnh chụp nhật ký bữa ăn): `src_assets_images_placeholder_43.webp`, `src_assets_images_placeholder_34.webp`.

---

## 4. Cấu trúc Điều hướng (Navigation Architecture)

Đáp ứng mục 7.2 của `REQUIREMENT.md`:

```text
RootNavigator (Native Stack)
├── Splash & System Check (Kiểm tra token, trạng thái bảo trì / bắt buộc cập nhật)
├── AuthStack (Khi chưa đăng nhập)
│   ├── Intro / Welcome Carousel (3 màn: welcome1..3.webp)
│   ├── LoginScreen (Email + Google OAuth2)
│   ├── RegisterScreen
│   └── ForgotPasswordScreen & ResetPasswordScreen
├── OnboardingStack (Khi đăng nhập lần đầu chưa có UserHealthProfile)
│   ├── Step 1: Hello & Mascot Intro (onboarding_onboardinghello.webp)
│   ├── Step 2: Chọn đối tượng hồ sơ (dependents_me / sister / son.webp)
│   ├── Step 3: Giới tính & Ngày sinh (onboardingv2_male.webp / female.webp)
│   ├── Step 4: Chiều cao & Cân nặng hiện tại (onboarding_weightscale.webp)
│   ├── Step 5: Mức độ vận động & Mục tiêu (weightloss.png / weightgain.png)
│   ├── Step 6: Cân nặng mục tiêu & Tốc độ thay đổi/tuần
│   ├── Step 7: Giải thích cơ chế Thâm hụt Calo (deficitstep0..4.webp + deficitic1..5.png)
│   ├── Step 8: Khai báo Dị ứng / Kiêng kỵ
│   ├── Step 9: Xin quyền Thông báo & Sức khỏe (onboardingv2_notificationbg.webp)
│   └── Step 10: Màn chờ tính toán & Kết quả BMI/BMR/TDEE (onboarding_onboardingwaiting.webp)
├── MainTabNavigator (Bottom Tabs — 5 vị trí)
│   ├── Tab 1: Trang chủ (HomeDashboardScreen)
│   ├── Tab 2: Nhật ký (FoodDiaryScreen)
│   ├── Tab 3: [Nút nổi giữa (+) Quick Log / AI Camera Scan] -> Mở Modal nhanh
│   ├── Tab 4: Thống kê (ReportOverviewScreen)
│   └── Tab 5: Cá nhân (AccountProfileScreen)
└── Global Modal / FullScreen Stack (Truy cập từ bất kỳ đâu)
    ├── AIMealScanScreen (Camera nhận diện món Việt) -> MealScanResultScreen
    ├── BarcodeScannerScreen (Quét mã vạch)
    ├── VoiceLogModal (Ghi nhận nhanh bằng giọng nói - voicelog_bg.webp)
    ├── FoodSearchScreen & FoodDetailScreen & CustomFoodFormScreen
    ├── MealPlanWizardScreen (3 bước) & MealPlanDetailScreen
    ├── NutritionChatScreen (Trợ lý AI)
    ├── ActivityTrackerScreen & HealthSyncScreen & BodyMetricScreen
    ├── StreakDetailModal & BadgesChallengesScreen & FriendsLeaderboardScreen
    └── NotificationCenterScreen & ReminderSettingsScreen
```

---

## 5. Lộ trình triển khai chi tiết theo từng Phase

### Phase 1: Khởi tạo, Design System & Khung điều hướng (Tuần 1–2)
**Mục tiêu:** Xây dựng nền móng dự án, cấu hình toàn bộ tài nguyên hình ảnh, tạo bộ UI Kit dùng chung và khung điều hướng hoàn chỉnh.

1. **Thiết lập dự án & Tài nguyên (Assets):**
   - Khởi tạo dự án Expo + TypeScript, cấu hình `babel-plugin-module-resolver` (`@/components`, `@/assets`, `@/features`).
   - Chuẩn hóa và tạo file `src/assets/images/index.ts` export toàn bộ hình ảnh từ `drawable-mdpi-v4` để sử dụng có gợi ý kiểu (type-safe).
   - Tích hợp custom back icon (`node_modules_reactnavigation_elements_lib_module_assets_backiconmask.png`) và logo (`src_assets_images_logowhite.webp`, `src_assets_images_waologo.png`).
2. **Xây dựng Core UI Components (`src/components/common`):**
   - `AppText`, `AppButton` (Primary, Secondary, Outline, Ghost, Loading state).
   - `AppInput` (hỗ trợ icon trái/phải, ẩn/hiện mật khẩu, hiển thị lỗi tiếng Việt tức thì).
   - `AppCard`, `ProgressBar`, `CircularProgress` (dùng SVG + Reanimated).
   - `EmptyStateView`: Tích hợp sẵn các ảnh trạng thái rỗng (`src_assets_images_emptystate.webp`, `src_assets_images_searchnotfound.webp`, `src_assets_images_favoritefood_empty.webp`, `src_assets_images_mealplan_empty.webp`).
   - `LoadingOverlay`: Sử dụng `src_assets_images_loading.webp` và `src_assets_images_appointment_loading.webp`.
3. **Khung điều hướng & State nền tảng:**
   - Cấu hình `RootNavigator`, `MainTabNavigator` với nút chụp ảnh AI nổi bật ở giữa.
   - Thiết lập Axios Interceptor tự động đính kèm `Bearer <JWT>` và làm mới token khi nhận mã `401` (FR-AUTH-06).

**Tiêu chí hoàn thành Phase 1 (Deliverables):**
- Storybook hoặc màn hình `ComponentShowcaseScreen` hiển thị đầy đủ màu sắc, font chữ, nút bấm, thẻ, biểu tượng và trạng thái rỗng/đang tải.
- Chuyển tab mượt mà, hỗ trợ chế độ Sáng/Tối cơ bản (FR-SYS-08).

---

### Phase 2: Onboarding V2, Xác thực & Thiết lập Hồ sơ Sức khỏe (Tuần 3–4)
**Mục tiêu:** Hoàn thiện luồng thu hút người dùng mới, đăng nhập/đăng ký (`FR-AUTH-01..08`) và tính toán chỉ số cơ thể chuẩn xác (`FR-PRO-01..08`).

1. **Màn hình Giới thiệu & Xác thực (Module AUTH):**
   - **Welcome / Intro Carousel:** Sử dụng hình nền `src_assets_images_introbackground.webp`, `src_assets_images_onboarding_introducebg.webp` kết hợp bộ minh họa `src_assets_images_onboardingv2_welcome1..3.webp` và `src_assets_images_onboarding_introducev201..03.webp`.
   - **Login / Register Screen:** Nền `src_assets_images_onboarding_loginbg.webp`, nút đăng nhập mạng xã hội (`src_assets_images_appleicon2.webp`, `src_assets_images_facebookicon2.webp`, Google OAuth2).
   - **Forgot / Reset Password Screen:** Nhập email nhận OTP/liên kết (hiệu lực $15$ phút), màn đặt lại mật khẩu mới.
2. **Luồng Thiết lập Hồ sơ Sức khỏe (Module PROFILE — Onboarding V2):**
   - **Màn chào mừng & Linh vật:** Hiển thị `src_assets_images_onboardingv2_mascot.webp`, `src_assets_images_onboarding_onboardinghello.webp` và trích dẫn tạo động lực `src_assets_images_onboarding_onboardingquote.webp`.
   - **Chọn giới tính & Thể trạng:** Sử dụng minh họa `src_assets_images_onboardingv2_male.webp`, `src_assets_images_onboardingv2_female.webp`.
   - **Thước kéo Chiều cao & Cân nặng (Interactive Ruler Picker):** Minh họa bằng `src_assets_images_onboarding_weightscale.webp`, `src_assets_images_onboarding_appscale.webp`. Kiểm tra miền hợp lệ: chiều cao $[100, 250]\text{ cm}$, cân nặng $[20, 300]\text{ kg}$ (AC2 mục 4.2).
   - **Chọn Mục tiêu & Tốc độ thay đổi:** Minh họa Giảm cân (`src_assets_images_onboarding_weightloss.png`), Tăng cân (`src_assets_images_onboarding_weightgain.png`), Giữ cân (`src_assets_images_account_target.webp`).
   - **Slide giải thích Thâm hụt Calo:** Sử dụng nền `src_assets_images_onboarding_deficitstepbg.webp`, chuỗi hình `src_assets_images_onboarding_deficitstep0..4.webp` và bộ icon `src_assets_images_onboarding_deficitic1..5.png`.
   - **Chọn Dị ứng thực phẩm:** Chip selector đa lựa chọn (Hải sản, Đậu phộng, Sữa, Trứng, Gluten...) + ô nhập tự do (FR-PRO-04).
   - **Màn hình Tính toán & Kết quả (Summary Screen):**
     - Hiệu ứng chờ xử lý với `src_assets_images_onboarding_onboardingwaiting.webp`.
     - Hiển thị kết quả tức thì ($\le 1$ giây):
       $$\text{BMI} = \frac{W}{H^2}$$
       $$\text{BMR (Nam)} = 10W + 6.25H - 5A + 5 \quad | \quad \text{BMR (Nữ)} = 10W + 6.25H - 5A - 161$$
       $$\text{TDEE} = \text{BMR} \times \text{Hệ số vận động}$$
       $$\text{Calo mục tiêu} = \text{TDEE} \pm \frac{\text{Tốc độ (kg/tuần)} \times 7700}{7}$$
     - Hiển thị hộp cảnh báo màu cam nếu người dùng chọn mức giảm cân vượt ngưỡng an toàn (calo mục tiêu thấp hơn BMR hoặc $< 1200\text{ kcal}$ với nữ, $< 1500\text{ kcal}$ với nam — AC3 mục 4.2).
     - Cho phép chỉnh tay tỷ lệ Macro (Protein / Carbs / Fat) với tổng luôn khóa ở $100\%$ (FR-PRO-06).

**Tiêu chí hoàn thành Phase 2 (Deliverables):**
- Luồng Đăng ký $\rightarrow$ Thiết lập hồ sơ $\rightarrow$ Tính ra BMI/TDEE/Macro hoạt động trơn tru, lưu thành công xuống API `PUT /api/users/me/profile`.

---

### Phase 3: Trang chủ (Dashboard), Nhật ký Dinh dưỡng, Nước & Cân nặng (Tuần 5–6)
**Mục tiêu:** Xây dựng các màn hình sử dụng hằng ngày của người dùng (`FR-REP-01`, `FR-NUT-01`, `FR-NUT-04`, `FR-NUT-06..11`, `FR-ACT-04`).

1. **Màn hình Trang chủ — Home Dashboard (`HomeDashboardScreen`):**
   - **Header:** Hình nền `src_assets_images_home_headerbg.webp`, hiển thị lời chào, avatar (`src_assets_images_avatar.webp`), huy hiệu Streak hiện tại và nút Thông báo.
   - **Thẻ Tổng quan Năng lượng (Calorie & Macro Card):**
     - Nền `src_assets_images_tracker_rectangle.webp`.
     - Vòng tròn tiến độ trung tâm: Hiển thị **Calo còn lại** $= \text{Mục tiêu} - \text{Đã nạp} + \text{Tiêu hao}$ (kèm tuỳ chọn bật/tắt cộng calo vận động).
     - Hai cột bên: Đã nạp (`src_assets_images_tracker_fire.webp`) và Tiêu hao.
     - 3 thanh tiến độ ngang cho **Protein, Carbs, Fat** (hiển thị $\text{đã ăn} / \text{mục tiêu (g)}$).
   - **Widget Theo dõi Nước uống (Water Tracker Card):**
     - Hiển thị hàng cốc nước tương tác bằng `src_assets_images_water_watercup.webp`, `src_assets_images_water_waterbottle.webp`, `src_assets_images_tracker_droplet.webp` và hiệu ứng làm đầy `src_assets_images_tracker_fill_empty.webp` $\rightarrow$ `src_assets_images_tracker_fill_full.webp`.
     - Bấm một chạm vào cốc để cộng nhanh $+250\text{ ml}$ hoặc mở Bottom Sheet nhập số $\text{ml}$ tuỳ ý (FR-NUT-11).
   - **Widget Cân nặng & Chỉ số cơ thể:**
     - Sử dụng `src_assets_images_tracker_weight.webp`, hiển thị cân nặng gần nhất so với mục tiêu, nút cập nhật nhanh cân nặng hôm nay.
2. **Màn hình Nhật ký Dinh dưỡng (`FoodDiaryScreen`):**
   - Banner giới thiệu lần đầu: `src_assets_images_fooddiaryintroduce.webp`, `src_assets_images_fooddiaryartwork.png`.
   - Bộ chọn ngày dạng lịch ngang (Horizontal Week Calendar) ở đầu màn hình.
   - Danh sách 4 buổi ăn (**Sáng, Trưa, Tối, Bữa phụ** — FR-NUT-01):
     - Mỗi buổi hiển thị tổng calo đã nạp / calo khuyến nghị, nút `+ Thêm món` và nút `Sao chép bữa ăn` từ ngày khác (FR-NUT-08).
     - Vuốt sang trái (Swipe-to-delete/edit) trên từng mục `UserFoodLog` để sửa khẩu phần hoặc xoá.
3. **Tìm kiếm Món ăn, Chi tiết Món & Món ăn Tuỳ chỉnh:**
   - **Food Search Screen (`FR-NUT-04`):** Thanh tìm kiếm có debounce $300\text{ ms}$, hỗ trợ tìm không dấu, chia 3 tab: *Tất cả*, *Gần đây & Yêu thích* (`FR-NUT-09`, trạng thái rỗng dùng `src_assets_images_favoritefood_empty.webp`), *Món của tôi* (`FR-NUT-06`).
   - **Food Detail & Portion Sheet:** Chọn đơn vị khẩu phần (tô, đĩa, chén, hoặc nhập số $\text{gram}$), tự động nhân tỷ lệ Calo/Macro theo công thức:
     $$\text{Dinh dưỡng thực tế} = \text{Dinh dưỡng trên } 100\text{g} \times \frac{\text{Khối lượng ăn (g)}}{100}$$
   - **Cảnh báo Dị ứng (`FR-NUT-10`):** Nếu `food.allergens` giao với `userProfile.allergies`, hiển thị banner cảnh báo đỏ nổi bật trước nút "Lưu vào nhật ký".
   - **Custom Food Form (`FR-NUT-06`):** Biểu mẫu tạo/sửa món ăn cá nhân kèm tải ảnh lên MinIO.

**Tiêu chí hoàn thành Phase 3 (Deliverables):**
- Người dùng ghi được bữa ăn thủ công, ghi nước, ghi cân nặng; mọi thay đổi cập nhật ngay lập tức lên vòng tròn Calo trên Dashboard.
- Hỗ trợ Hướng dẫn người dùng mới (Walkthrough) lần đầu vào Home bằng mũi tên chỉ dẫn `src_assets_images_walkthrough_arrowtop01.png` và `arrowtop02.png`.

---

### Phase 4: AI Meal Scan (Camera nhận diện món Việt) & Quét Mã vạch (Tuần 6–8)
**Mục tiêu:** Hiện thực hóa tính năng cốt lõi của đồ án — chụp ảnh nhận diện 68 món ăn Việt Nam (`FR-NUT-02`, `FR-NUT-03`, `FR-NUT-12`, `FR-NUT-13`) và quét mã vạch (`FR-NUT-05`).

1. **Màn hình Camera AI Nhận diện Món ăn (`AIMealScanScreen`):**
   - Giao diện Camera toàn màn hình sử dụng `react-native-vision-camera`.
   - Khung ngắm (Viewfinder) ghép từ 4 góc: `src_assets_images_mealscan_cornertopleft.png`, `cornertopright.png`, `cornerbottomleft.png`, `cornerbottomright.png` trên nền hướng dẫn `src_assets_images_mealscan_mealscanbg.webp`.
   - Nút thu phóng khẩu phần/khung ngắm (`src_assets_images_mealscan_scaleup.png`, `scaledown.png`), nút bật đèn Flash, nút chọn ảnh từ thư viện, và nút chuyển nhanh sang chế độ **Quét mã vạch**.
   - Modal hướng dẫn chụp ảnh đúng chuẩn lần đầu: sử dụng `src_assets_images_mealscan_mealscan01.webp` và `mealscan02.webp`.
   - **Luồng xử lý ảnh phía Client:** Chụp ảnh $\rightarrow$ `expo-image-manipulator` nén ảnh về cạnh dài $\le 1280\text{ px}$ (JPEG quality $0.8$, dung lượng $\le 2\text{ MB}$) $\rightarrow$ gửi `POST /api/food-logs/recognize`.
2. **Màn hình Kết quả Nhận diện & Xác nhận (`MealScanResultScreen`):**
   - Hiển thị ảnh vừa chụp kèm các **Bounding Box (hộp giới hạn)** vẽ bằng `react-native-svg` dựa theo tọa độ chuẩn hóa $(x, y, w, h)$ trả về từ FastAPI YOLOv11m.
   - Trên mỗi Bounding Box gắn nhãn: `Tên món (ví dụ: Phở bò) • 91%` và ước lượng khẩu phần ($\text{gram}$ + hệ số kích thước `size_factor` $\in [0.5, 2.0]$).
   - **Bottom Sheet Xác nhận nhanh (Tối ưu UX $\le 3$ thao tác chạm — AC1 mục 4.3):**
     - Thao tác 1: Xem danh sách các món phát hiện được (tự động chọn buổi ăn theo giờ hiện tại).
     - Thao tác 2 (Tuỳ chọn): Bấm thanh trượt chỉnh nhanh hệ số khẩu phần ($0.5\times$, $1.0\times$, $1.5\times$) hoặc bấm đổi tên món nếu AI nhận diện sai.
     - Thao tác 3: Bấm **"Lưu nhật ký"** $\rightarrow$ hoàn tất và hiển thị hiệu ứng thành công (`src_assets_images_tracker_successelement.webp`).
   - **Trường hợp không nhận diện được món (`items: []` — AC2 mục 4.3):** Hiển thị minh họa `src_assets_images_mealscan_scannotfound.webp` kèm nút "Tìm kiếm món thủ công" hoặc "Chụp lại".
   - **Đóng góp dữ liệu cải thiện AI (`FR-NUT-13`):** Khi người dùng sửa nhãn món ăn, hiển thị hộp thoại nhẹ nhàng (`src_assets_images_mealscan_mealscanfeedback.webp`) xin phép đóng góp ảnh đã gán nhãn đúng.
3. **Màn hình Quét Mã vạch (`BarcodeScannerScreen` — `FR-NUT-05`):**
   - Màn giới thiệu lần đầu: `src_assets_images_scanbarcode_barcodescanintro.webp`.
   - Khung quét hiển thị lưới `src_assets_images_scanbarcode_scangrid.webp` và tia quét chạy dọc liên tục bằng Reanimated `src_assets_images_scanbarcode_scanline.webp`.
   - Quét thành công $\rightarrow$ rung phản hồi (Haptic feedback) $\rightarrow$ gọi `GET /api/foods/barcode/{code}`. Nếu mã vạch chưa có trong CSDL, mở ngay form tạo món mới với mã vạch đã điền sẵn.

**Tiêu chí hoàn thành Phase 4 (Deliverables):**
- Chụp ảnh món ăn Việt Nam $\rightarrow$ vẽ đúng vị trí Bounding Box $\rightarrow$ lưu log trong $\le 3$ chạm, tổng thời gian phản hồi trên mạng 4G $\le 5$ giây (`NFR-PERF-02`).

---

### Phase 5: Theo dõi Vận động, Đồng bộ Sức khỏe & Biểu đồ Báo cáo (Tuần 8–9)
**Mục tiêu:** Hoàn thiện module Vận động (`FR-ACT-01..08`) và module Thống kê / Dự báo xu hướng (`FR-REP-02..08`).

1. **Màn hình Vận động & Chỉ số cơ thể (Module ACT):**
   - **Ghi nhận tập luyện thủ công (`FR-ACT-01`):** Chọn môn tập (Đi bộ, Chạy bộ, Đạp xe, Bơi, Gym, Yoga, Cầu lông...), nhập thời lượng (phút) $\rightarrow$ tự động tính Calo tiêu hao theo công thức:
     $$\text{Calo tiêu hao} = \text{MET} \times \text{Cân nặng (kg)} \times \frac{\text{Thời lượng (phút)}}{60}$$
   - **Đồng bộ Health Connect (Android) & Apple HealthKit (iOS) (`FR-ACT-02`, `FR-ACT-03`):**
     - Thẻ kết nối hiển thị logo `src_assets_images_artworks_healthconnect.webp` / `src_assets_images_tracker_healthconnect.png` (Android) và `src_assets_images_artworks_applehealth.webp` / `src_assets_images_tracker_applehealth.png` (iOS), cùng biểu tượng đồng bộ xoay `src_assets_images_tracker_syncicon.png`.
     - Hiển thị rõ trạng thái quyền: *Đã kết nối*, *Chưa cấp quyền*, hoặc *Thiết bị không hỗ trợ* (ứng dụng vẫn cho nhập tay bình thường khi từ chối quyền).
   - **Chỉ số cơ thể nâng cao (Body Metrics):** Sử dụng `src_assets_images_bodymetric_introartwork.webp` và hướng dẫn đo tỷ lệ vòng eo/mông `src_assets_images_bodymetric_whrhint.webp`.
2. **Màn hình Báo cáo & Thống kê (`ReportOverviewScreen` — Module REPORT):**
   - Bộ chuyển đổi kỳ báo cáo: **Ngày | Tuần | Tháng**.
   - **Biểu đồ Calo Nạp vào / Tiêu hao (`FR-REP-02`):** Biểu đồ cột đôi (Grouped Bar Chart) kết hợp đường mục tiêu ngang, tham chiếu phong cách từ `src_assets_images_tracker_trackingcalorieschart.webp` và `src_assets_images_tracker_caloriesburnedchart.webp` trên nền `src_assets_images_report_chartbg.webp`.
   - **Biểu đồ Macro (`FR-REP-03`):** Biểu đồ tròn (Donut Chart) và cột chồng (Stacked Bar) hiển thị tỷ lệ $\%$ Protein / Carbs / Fat thực tế so với mục tiêu.
   - **Biểu đồ Cân nặng & Dự báo xu hướng (`FR-REP-04`, `FR-REP-05`):**
     - Nền thẻ `src_assets_images_report_wlcardbg.webp`.
     - Vẽ đường cân nặng thực tế (nét liền), đường mục tiêu (nét đứt ngang) và **đường xu hướng dự báo** (nét chấm mờ) tính bằng trung bình động hàm mũ (EMA) hoặc hồi quy tuyến tính trên cửa sổ $14\text{–}28$ ngày.
     - Thẻ thông tin thông minh gắn icon bóng đèn `src_assets_images_report_lampicon.webp`:
       - Khi đủ $\ge 14$ ngày dữ liệu và xu hướng đúng chiều: *"Với tốc độ giảm $0,45\text{ kg/tuần}$, dự kiến bạn sẽ đạt mục tiêu $58\text{ kg}$ vào ngày **12/12/2026**."*
       - Khi chưa đủ dữ liệu (AC3 mục 4.6): Hiển thị thanh tiến độ *"Cần ghi nhận thêm $X/14$ ngày cân nặng để AI mở khóa dự báo xu hướng."*

**Tiêu chí hoàn thành Phase 5 (Deliverables):**
- Đồng bộ bước chân từ Health Connect/HealthKit không bị nhân đôi bản ghi khi bấm đồng bộ nhiều lần (AC2 mục 4.5).
- Các biểu đồ render mượt ở $60\text{ fps}$, có tooltip xem chi tiết từng ngày khi chạm giữ.

---

### Phase 6: Thực đơn AI, Trợ lý Chatbot & Gamification / Xã hội (Tuần 9–11)
**Mục tiêu:** Triển khai các tính năng thông minh tạo giá trị gia tăng và giữ chân người dùng (`FR-PLAN-01..06`, `FR-CHAT-01..06`, `FR-GAM-01..07`).

1. **Lập kế hoạch Bữa ăn bằng AI (`MealPlanWizardScreen` — Module PLAN):**
   - Banner giới thiệu trên màn hình Kế hoạch: `src_assets_images_mealplanai_new_ai_banner.webp`, `src_assets_images_mealplanai_recipe_suggestion.webp`, `src_assets_images_mealplanai_recipescanbanner.webp` (và `src_assets_images_recipescan_recipescanintroductionartwork.webp`).
   - **Wizard tạo thực đơn 3 bước** sử dụng đúng bộ minh họa:
     - **Bước 1 (`src_assets_images_mealplanai_mealplan_step1.webp`):** Chọn thời gian (1 ngày hoặc 7 ngày) và xác nhận mục tiêu Calo/Macro.
     - **Bước 2 (`src_assets_images_mealplanai_mealplan_step2.webp`):** Nhập **Ngân sách dự kiến** ($\text{VNĐ/ngày}$, ví dụ $100.000\text{ đ}$) bằng thanh trượt hoặc ô nhập.
     - **Bước 3 (`src_assets_images_mealplanai_mealplan_step3.webp`):** Kiểm tra lại danh sách dị ứng/kiêng kỵ (lọc cứng `FR-PLAN-05`) $\rightarrow$ Bấm "Tạo thực đơn AI".
   - **Màn hình Chi tiết Thực đơn (`MealPlanDetailScreen`):**
     - Hiển thị 4 buổi ăn kèm tổng Calo (nằm trong khoảng $\pm 5\%$ mục tiêu) và tổng chi phí ước tính ($\text{VNĐ}$).
     - Nút **Đổi món (Swap — `FR-PLAN-03`)** bên cạnh từng món ăn để thay bằng món tương đương Calo/Macro.
     - Nút **"Áp dụng vào Nhật ký ngày"** (`FR-PLAN-04`) để ghi log hàng loạt.
2. **Trợ lý Dinh dưỡng AI Chatbot (`NutritionChatScreen` — `FR-CHAT-01..06`):**
   - Giao diện hội thoại hiện đại: Danh sách hội thoại (`Conversation`), khung chat hỗ trợ **nhận phản hồi streaming theo thời gian thực qua WebSocket** (`FR-CHAT-03`).
   - Thanh **Câu hỏi gợi ý nhanh (Quick Prompts — `FR-CHAT-05`):** *"Hôm nay tôi còn bao nhiêu calo?"*, *"Gợi ý bữa tối dưới $400\text{ kcal}$ không có tôm"*, *"Đánh giá tỷ lệ macro tuần này"*.
   - **Banner miễn trừ y khoa (`FR-CHAT-06`):** Luôn hiển thị dòng nhắc nhỏ ở đầu khung chat: *"Trợ lý AI dựa trên dữ liệu dinh dưỡng tham khảo, không thay thế chẩn đoán hoặc chỉ định của bác sĩ."*
3. **Hệ thống Streak, Huy hiệu, Thử thách & Bảng xếp hạng (`Module GAME`):**
   - **Màn hình & Modal Streak (`FR-GAM-01`):**
     - Sử dụng bộ hình nền và hiệu ứng phong phú theo từng trạng thái chuỗi ngày:
       - Đang duy trì: `src_assets_images_streak_streakactivebg.webp`, `src_assets_images_streak_streakchainbg.webp`.
       - Chưa hoàn thành hôm nay: `src_assets_images_streak_streakinactivebg.webp`.
       - Đạt mốc mới: `src_assets_images_streak_streakachievedbg.webp`, `src_assets_images_streak_achievechainbg.webp`, `src_assets_images_streak_streakachievedart1.webp`, `streakachievedart2.webp`.
       - Đóng băng / Bảo vệ chuỗi: `src_assets_images_streak_streakfreezebg.webp`, `src_assets_images_streak_streakprotectedbg.webp`, `src_assets_images_streak_freezestreakart1.webp`.
       - Chia sẻ thành tích: `src_assets_images_streak_sharechainbg.webp`.
   - **Huy hiệu & Thử thách (`FR-GAM-02`, `FR-GAM-03`):**
     - Popup chúc mừng khi mở khóa huy hiệu mới: `src_assets_images_congratulation.webp`, `src_assets_images_premium_paywalltrophy.webp`, `src_assets_images_premium_waoawardbackground.webp`.
     - Danh sách thử thách cộng đồng dùng banner `src_assets_images_course_artwork.webp` (trạng thái trống dùng `src_assets_images_course_empty01.webp`, `empty02.webp`).
   - **Bạn bè & Bảng xếp hạng Thời gian thực (`FR-GAM-04`, `FR-GAM-05`):**
     - Tìm kiếm bạn bè, gửi/chấp nhận lời mời kết bạn, minh họa nhóm bằng `src_assets_images_premium_groupusers.webp` và `src_assets_images_account_communitybanner.webp`.
     - Bảng xếp hạng cập nhật trực tiếp qua WebSocket (độ trễ $\le 3$ giây), có công tắc ẩn/hiện thông tin cá nhân (`FR-GAM-07`, tuyệt đối không hiển thị cân nặng tuyệt đối của người dùng).

**Tiêu chí hoàn thành Phase 6 (Deliverables):**
- Sinh được thực đơn 1 ngày tuân thủ đúng ngân sách và không chứa chất dị ứng.
- Chatbot trả lời đúng số Calo còn lại của người dùng trong ngày; Bảng xếp hạng tự nhảy thứ hạng khi có thay đổi qua WebSocket.

---

### Phase 7: Tiện ích Hệ thống, Ngoại tuyến (Offline-first) & Tinh chỉnh UX (Tuần 11–13)
**Mục tiêu:** Đảm bảo độ tin cậy khi mất mạng (`FR-SYS-05`, `FR-SYS-06`), thông báo thông minh (`FR-SYS-01..04`) và hoàn thiện toàn bộ trạng thái hệ thống để nghiệm thu.

1. **Giao diện Ngoại tuyến & Đồng bộ (Offline-First UI):**
   - **Offline Status Banner:** Khi mất kết nối mạng, hiển thị thanh trạng thái nhỏ gọn trên đầu màn hình: *"Đang ở chế độ ngoại tuyến • $3$ mục chờ đồng bộ"*.
   - Cho phép người dùng ghi log bữa ăn (từ bộ nhớ đệm món ăn), nước uống, cân nặng, vận động kèm khoá định danh `client_uuid` tạo sẵn dưới máy.
   - Với tính năng **Chụp ảnh AI khi mất mạng**: Lưu ảnh vào hàng đợi cục bộ với nhãn *"Đang chờ mạng để phân tích AI"* hoặc cho phép chuyển sang nhập tay ngay lập tức.
   - Khi có mạng trở lại: Hiển thị tiến trình tự động đẩy dữ liệu (`POST /api/sync/push`) hoàn toàn idempotent (AC1 mục 4.8).
2. **Thông báo đẩy & Nhắc nhở Thông minh (`FR-SYS-01..04`):**
   - **Notification Center Screen:** Danh sách thông báo trong ứng dụng, chấm đỏ chưa đọc, vuốt để xoá hoặc bấm "Đánh dấu đã đọc tất cả".
   - **Smart Reminder Settings Screen:** Giao diện bật/tắt và chọn khung giờ nhắc uống nước, nhắc ghi 3 bữa chính, bật cảnh báo khi vượt $100\%$ calo mục tiêu và thiết lập khung giờ *Không làm phiền (Do Not Disturb)*.
3. **Màn hình Cá nhân (`AccountProfileScreen`) & Trạng thái Hệ thống:**
   - Thẻ hồ sơ cá nhân sử dụng nền `src_assets_images_account_cardbg.webp`, hỗ trợ đổi ảnh đại diện, đổi mật khẩu, xem lại lộ trình cân nặng (`src_assets_images_onboardingv2_reonboarding.webp`) và nút **Xoá tài khoản** (`FR-AUTH-07`).
   - Liên kết cộng đồng mạng xã hội dùng bộ logo `src_assets_images_thirdapplogo_facebooklogo.webp`, `instagramlogo.webp`, `tiktoklogo.webp` và `src_assets_images_introduce_fbgroup.webp`.
   - **System Modals:**
     - Bảo trì hệ thống: `src_assets_images_onboarding_maintenance.png`.
     - Bắt buộc cập nhật / Thông báo bản mới: `src_assets_images_forceupdateappthumbnail.webp`, `src_assets_images_informupdateappthumbnail.webp`.

**Tiêu chí hoàn thành Phase 7 (Deliverables):**
- Vượt qua kịch bản kiểm thử tắt mạng $\rightarrow$ ghi 3 log nước + 1 bữa ăn $\rightarrow$ bật mạng $\rightarrow$ đồng bộ thành công không trùng lặp.
- Đạt toàn bộ chỉ tiêu nghiệm thu ở mục 11.2 của `REQUIREMENT.md`.

---

## 6. Bảng ánh xạ Tài nguyên Hình ảnh (Asset Mapping Matrix)

Bảng dưới đây đối chiếu toàn bộ các tệp hình ảnh trong thư mục tài nguyên của dự án với đúng màn hình và mã yêu cầu (`FR-*`) để lập trình viên Frontend tra cứu nhanh khi code:

| Nhóm Module | Tên tệp tài nguyên (`drawable-mdpi-v4/...`) | Màn hình / Component sử dụng | Mã FR liên quan |
|---|---|---|---|
| **Auth & Intro** | `src_assets_images_introbackground.webp`<br>`src_assets_images_onboarding_loginbg.webp`<br>`src_assets_images_logowhite.webp`, `waologo.png`<br>`src_assets_images_appleicon2.webp`, `facebookicon2.webp` | `WelcomeScreen`, `LoginScreen`, `RegisterScreen` | `FR-AUTH-01`..`03` |
| **Onboarding V2** | `src_assets_images_onboardingv2_welcome1..3.webp`<br>`src_assets_images_onboarding_introduce01..03.webp`<br>`src_assets_images_onboarding_introducev201..03.webp`<br>`src_assets_images_onboardingv2_bg.webp`<br>`src_assets_images_onboardingv2_mascot.webp`<br>`src_assets_images_onboarding_onboardinghello.webp`<br>`src_assets_images_onboarding_onboardingquote.webp` | `OnboardingCarousel`, `OnboardingWelcomeStep` | `FR-PRO-01` |
| **Thiết lập Thể trạng** | `src_assets_images_onboardingv2_male.webp`, `female.webp`<br>`src_assets_images_dependents_me.webp`, `sister.webp`, `son.webp`<br>`src_assets_images_onboarding_weightscale.webp`<br>`src_assets_images_onboarding_foodscale.webp`, `appscale.webp`<br>`src_assets_images_onboarding_weightloss.png`, `weightgain.png`<br>`src_assets_images_onboarding_onboardingstep1..4.webp`<br>`src_assets_images_onboarding_onboardingwaiting.webp` | `GenderStep`, `BodyMeasureStep`, `GoalSelectionStep`, `CalculatingTDEEScreen` | `FR-PRO-01`..`06` |
| **Cơ chế Thâm hụt** | `src_assets_images_onboarding_deficitstepbg.webp`<br>`src_assets_images_onboarding_deficitstep0..4.webp`<br>`src_assets_images_onboarding_deficitic1..5.png` | `CalorieDeficitEducationModal` (trong Onboarding & Hồ sơ) | `FR-PRO-05` |
| **Home Dashboard** | `src_assets_images_home_headerbg.webp`<br>`src_assets_images_tracker_rectangle.webp`<br>`src_assets_images_tracker_fire.webp`, `tracker_logo.webp`<br>`src_assets_images_walkthrough_arrowtop01..02.png` | `HomeDashboardScreen`, `CalorieSummaryCard`, `WalkthroughOverlay` | `FR-REP-01` |
| **Nhật ký & Nước** | `src_assets_images_fooddiaryintroduce.webp`, `fooddiaryartwork.png`<br>`src_assets_images_fooddefault.webp`<br>`src_assets_images_favoritefood_empty.webp`<br>`src_assets_images_water_watercup.webp`, `waterbottle.webp`<br>`src_assets_images_tracker_droplet.webp`, `fill_empty/full.webp` | `FoodDiaryScreen`, `FoodSearchScreen`, `WaterTrackerCard` | `FR-NUT-01`, `FR-NUT-04`, `FR-NUT-09`, `FR-NUT-11` |
| **AI Meal Scan** | `src_assets_images_mealscan_mealscanbg.webp`<br>`src_assets_images_mealscan_cornertopleft/right.png`<br>`src_assets_images_mealscan_cornerbottomleft/right.png`<br>`src_assets_images_mealscan_scaleup.png`, `scaledown.png`<br>`src_assets_images_mealscan_mealscan01..02.webp`<br>`src_assets_images_mealscan_scannotfound.webp`<br>`src_assets_images_mealscan_mealscanfeedback.webp` | `AIMealScanScreen`, `MealScanGuideModal`, `MealScanResultScreen`, `AICorrectionFeedbackSheet` | `FR-NUT-02`, `FR-NUT-03`, `FR-NUT-12`, `FR-NUT-13` |
| **Barcode & Voice** | `src_assets_images_scanbarcode_barcodescanintro.webp`<br>`src_assets_images_scanbarcode_scangrid.webp`, `scanline.webp`<br>`src_assets_images_voicelog_bg.webp`, `voicelogmascot.webp` | `BarcodeScannerScreen`, `VoiceLogModal` | `FR-NUT-05` |
| **Thực đơn AI** | `src_assets_images_mealplanai_new_ai_banner.webp`<br>`src_assets_images_mealplanai_mealplan_step1..3.webp`<br>`src_assets_images_mealplanai_recipe_suggestion.webp`<br>`src_assets_images_mealplanai_recipescanbanner.webp`<br>`src_assets_images_mealplan_empty.webp` | `MealPlanOverviewScreen`, `MealPlanWizardScreen` (3 bước) | `FR-PLAN-01`..`06` |
| **Vận động & Sức khỏe** | `src_assets_images_artworks_healthconnect.webp`<br>`src_assets_images_artworks_applehealth.webp`<br>`src_assets_images_tracker_syncicon.png`, `weight.webp`<br>`src_assets_images_bodymetric_introartwork.webp`, `whrhint.webp` | `ActivityTrackerScreen`, `HealthSyncScreen`, `BodyMetricScreen` | `FR-ACT-01`..`08` |
| **Báo cáo & Biểu đồ** | `src_assets_images_report_chartbg.webp`, `wlcardbg.webp`<br>`src_assets_images_report_lampicon.webp`<br>`src_assets_images_tracker_trackingcalorieschart.webp`<br>`src_assets_images_tracker_caloriesburnedchart.webp` | `ReportOverviewScreen`, `WeightForecastCard` | `FR-REP-02`..`08` |
| **Streak & Động lực** | `src_assets_images_streak_streakactivebg.webp`, `streakinactivebg.webp`<br>`src_assets_images_streak_streakachievedbg.webp`, `achievechainbg.webp`<br>`src_assets_images_streak_streakachievedart1..2.webp`<br>`src_assets_images_streak_streakfreezebg.webp`, `freezestreakart1.webp`<br>`src_assets_images_streak_sharechainbg.webp`<br>`src_assets_images_congratulation.webp`, `course_artwork.webp` | `StreakDetailModal`, `BadgeUnlockedModal`, `ChallengesScreen` | `FR-GAM-01`..`07` |
| **Cá nhân & Hệ thống** | `src_assets_images_account_cardbg.webp`, `communitybanner.webp`<br>`src_assets_images_account_target.webp`<br>`src_assets_images_onboarding_maintenance.png`<br>`src_assets_images_forceupdateappthumbnail.webp`<br>`src_assets_images_emptystate.webp`, `searchnotfound.webp` | `AccountProfileScreen`, `MaintenanceModal`, `ForceUpdateModal`, `EmptyStateView` | `FR-AUTH-08`, `FR-SYS-01`..`08` |

---

## 7. Tiêu chuẩn Hiệu năng, Truy cập (Accessibility) & Kiểm thử UI

### 7.1. Danh mục Kiểm tra Hiệu năng UI (`NFR-PERF-01..05`)
- **Khởi động ứng dụng $\le 3$ giây:** Preload các font chữ chính và nhóm ảnh Dashboard trong lúc hiển thị `SplashScreen`; trì hoãn (lazy load) các màn hình nặng như Biểu đồ, Camera, Chatbot.
- **Danh sách mượt mà:** Sử dụng `@shopify/flash-list` thay cho `FlatList` truyền thống tại màn hình Tra cứu món ăn (`FoodSearchScreen`), Lịch sử hội thoại (`NutritionChatScreen`) và Bảng xếp hạng.
- **Tối ưu bộ nhớ ảnh:** Toàn bộ ảnh `.webp` được render qua `expo-image` với chính sách `cachePolicy="memory-disk"`.

### 7.2. Tiêu chuẩn Truy cập (Accessibility — `NFR-USAB`)
- Gắn đầy đủ `accessibilityLabel` và `accessibilityRole` bằng tiếng Việt cho các nút hành động chính (ví dụ: `"Chụp ảnh nhận diện món ăn"`, `"Thêm 250 ml nước"`, `"Lưu bữa ăn vào nhật ký"`).
- Vùng chạm tối thiểu (Touch Target) đạt $44 \times 44\text{ pt}$ trên cả Android và iOS (sử dụng `hitSlop` cho các icon nhỏ).

### 7.3. Kịch bản Kiểm thử Giao diện Tự động (E2E với Maestro / Detox)
1. **Flow 01 (Onboarding & TDEE):** Đăng ký tài khoản mới $\rightarrow$ Điền thông tin thể trạng $\rightarrow$ Kiểm tra màn kết quả hiển thị đúng BMI, TDEE và chuyển vào Dashboard.
2. **Flow 02 (AI Food Recognition):** Từ Dashboard bấm nút Camera AI $\rightarrow$ Chọn ảnh mẫu món "Phở bò" $\rightarrow$ Kiểm tra hiển thị Bounding Box và Calo/Macro $\rightarrow$ Bấm Lưu $\rightarrow$ Kiểm tra tổng Calo trên Dashboard tăng đúng giá trị.
3. **Flow 03 (Offline Sync):** Bật chế độ máy bay $\rightarrow$ Thêm $250\text{ ml}$ nước và $1$ bản ghi cân nặng $\rightarrow$ Kiểm tra hiển thị `OfflineBanner` $\rightarrow$ Tắt chế độ máy bay $\rightarrow$ Kiểm tra trạng thái đồng bộ hoàn tất.