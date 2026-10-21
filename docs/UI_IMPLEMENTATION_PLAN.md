# KẾ HOẠCH TRIỂN KHAI GIAO DIỆN NGƯỜI DÙNG (UI IMPLEMENTATION PLAN)

## Dự án: Kallo — Ứng dụng Chăm sóc Sức khỏe & Dinh dưỡng Tích hợp AI

| Hạng mục | Chi tiết |
|---|---|
| **Nền tảng** | React Native (Expo Managed/Prebuild Workflow) — Android $8.0+$ & iOS $15+$ |
| **Ngôn ngữ** | TypeScript |
| **Tài liệu tham chiếu** | `DESIGN.md` (*Nocturne & Daylight Vitality*) & `REQUIREMENT.md` (SRS v1.2) |
| **Phạm vi khung nhìn** | Điện thoại màn hình dọc $5\text{–}7\text{ inch}$ ($< 600\text{ px}$) cho bản MVP v1.0 |
| **Thời gian dự kiến** | $13$ tuần (chia làm $7$ Phase) |

---

## Mục lục

1. [Tổng quan kiến trúc UI & Công nghệ](#1-tổng-quan-kiến-trúc-ui--công-nghệ)
2. [Cấu trúc thư mục Frontend](#2-cấu-trúc-thư-mục-frontend)
3. [Quy chuẩn Kỹ thuật Giao diện & Quản lý Tài nguyên](#3-quy-chuẩn-kỹ-thuật-giao-diện--quản-lý-tài-nguyên)
   - [3.1. Liên kết Hệ thống Thiết kế (`DESIGN.md` là Single Source of Truth)](#31-liên-kết-hệ-thống-thiết-kế-designmd-là-single-source-of-truth)
   - [3.2. Quy tắc Địa phương hóa & Hiển thị Số liệu](#32-quy-tắc-địa-phương-hóa--hiển-thị-số-liệu)
   - [3.3. Quy chuẩn Quản lý Placeholder, Thẻ nền & Bản quyền Hình ảnh](#33-quy-chuẩn-quản-lý-placeholder-thẻ-nền--bản-quyền-hình-ảnh)
4. [Cấu trúc Điều hướng (Navigation Architecture)](#4-cấu-trúc-điều-hướng-navigation-architecture)
5. [Lộ trình triển khai chi tiết theo từng Phase](#5-lộ-trình-triển-khai-chi-tiết-theo-từng-phase)
   - [Phase 1: Khởi tạo, Theme Tokens, Core UI & Khung điều hướng (Tuần 1–2)](#phase-1-khởi-tạo-theme-tokens-core-ui--khung-điều-hướng-tuần-12)
   - [Phase 2: Onboarding V2, Xác thực (kèm OTP) & Thiết lập Hồ sơ Sức khỏe (Tuần 3–4)](#phase-2-onboarding-v2-xác-thực-kèm-otp--thiết-lập-hồ-sơ-sức-khỏe-tuần-34)
   - [Phase 3: Trang chủ (Dashboard), Quick Utility Dock, Nhật ký, Nước & Cân nặng (Tuần 5–6)](#phase-3-trang-chủ-dashboard-quick-utility-dock-nhật-ký-nước--cân-nặng-tuần-56)
   - [Phase 4: AI Meal Scan (Camera nhận diện món Việt) & Quét Mã vạch Lai (Tuần 6–8)](#phase-4-ai-meal-scan-camera-nhận-diện-món-việt--quét-mã-vạch-lai-tuần-68)
   - [Phase 5: Theo dõi Vận động, Đồng bộ Sức khỏe & Biểu đồ Báo cáo (Tuần 8–9)](#phase-5-theo-dõi-vận-động-đồng-bộ-sức-khỏe--biểu-đồ-báo-cáo-tuần-89)
   - [Phase 6: Thực đơn AI, Trợ lý Chatbot & Gamification / Xã hội (Tuần 9–11)](#phase-6-thực-đơn-ai-trợ-lý-chatbot--gamification--xã-hội-tuần-911)
   - [Phase 7: Tiện ích Hệ thống, Ngoại tuyến (Offline-first) & Tinh chỉnh UX (Tuần 11–13)](#phase-7-tiện-ích-hệ-thống-ngoại-tuyến-offline-first--tinh-chỉnh-ux-tuần-1113)
6. [Bảng ánh xạ Tài nguyên Hình ảnh & Trạng thái Chuẩn hóa (Asset Mapping Matrix)](#6-bảng-ánh-xạ-tài-nguyên-hình-ảnh--trạng-thái-chuẩn-hóa-asset-mapping-matrix)
7. [Tiêu chuẩn Hiệu năng, Truy cập (Accessibility) & Kiểm thử UI](#7-tiêu-chuẩn-hiệu-năng-truy-cập-accessibility--kiểm-thử-ui)

---

## 1. Tổng quan kiến trúc UI & Công nghệ

Để đáp ứng các yêu cầu phi chức năng trong `REQUIREMENT.md` (mở ứng dụng $\le 3$ giây, tải Dashboard $\le 2$ giây, ghi nhật ký bằng ảnh tối đa $3$ thao tác chạm sau khi chụp) và hiện thực hóa chính xác ngôn ngữ thiết kế **Nocturne & Daylight Vitality** trong `DESIGN.md`, tầng UI sử dụng bộ thư viện sau:

| Nhóm chức năng | Thư viện sử dụng | Mục đích trong Kallo |
|---|---|---|
| **Core & Build** | Expo SDK 52+, React Native, TypeScript | Hỗ trợ Custom Dev Client để tích hợp module native (Camera, Health) |
| **Điều hướng** | `@react-navigation/native`, `native-stack`, `bottom-tabs` | Quản lý luồng Auth (+ Email OTP), Onboarding, Main Bottom Tabs và Modal Stack |
| **Quản lý State** | `Zustand` + `react-native-mmkv` | State cục bộ (Auth, Theme Dark/Light, Onboarding draft, Offline Queue) tốc độ cao |
| **Server State & Cache** | `@tanstack/react-query` (+ Persister) | Đồng bộ REST API, caching cho chế độ ngoại tuyến (`FR-SYS-05`) |
| **Hiệu ứng Kính mờ & Gradient** | `expo-blur`, `expo-linear-gradient` | Blur $20\text{ px}$ cho Modal/Overlay và Bottom Tab Bar ($90\%$ Dark / $92\%$ Light); dải chuyển màu nút Primary CTA |
| **Hoạt ảnh & Gesture** | `react-native-reanimated`, `react-native-gesture-handler` | Vòng Calo phân đoạn $60\text{ fps}$, hiệu ứng nhấn nút (`scale: 0.98`, `opacity: 0.85`), thước kéo cân nặng |
| **Đồ họa, Glow & Biểu đồ** | `victory-native`, `@shopify/react-native-skia`, `react-native-svg` | Vẽ biểu đồ, vòng Calo đa sắc, Bounding Box AI và **vẽ hào quang/bóng đổ màu (Colored Glow/Shadow) đồng nhất trên Android & iOS** |
| **Font chữ chuẩn** | `@expo-google-fonts/plus-jakarta-sans`, `expo-font` | Cung cấp duy nhất họ font **Plus Jakarta Sans** (`400`, `600`, `700`, `800`) |
| **Bottom Sheet & Modal** | `@gorhom/bottom-sheet` | Ghi nhanh lượng nước, chỉnh khẩu phần món ăn, xác nhận kết quả AI |
| **Camera & Barcode** | `react-native-vision-camera`, `vision-camera-code-scanner` | Chụp ảnh nhận diện món ăn (`FR-NUT-02`) và quét mã vạch (`FR-NUT-05`) |
| **Nén & Hiển thị ảnh** | `expo-image`, `expo-image-manipulator` | Hiển thị ảnh `.webp` mượt mà, resize ảnh cạnh dài $\le 1280\text{ px}$ ($\le 2\text{ MB}$) trước khi gửi AI |
| **Cảm biến & Sức khỏe** | `react-native-health-connect`, `react-native-health`, `expo-sensors`, `expo-location` | Đồng bộ bước chân/nhịp tim, đếm bước cảm biến, vẽ lộ trình chạy bộ |
| **Biểu mẫu & Kiểm tra** | `react-hook-form` + `zod` | Kiểm tra tức thì dữ liệu đầu vào (chiều cao, cân nặng, email, OTP $6$ số, món tùy chỉnh) |

---

## 2. Cấu trúc thư mục Frontend

```text
src/
├── assets/
│   ├── brand/                   # Logo, wordmark, mascot nguyên bản của Kallo (SVG/WebP theo palette Tím)
│   ├── images/                  # Các tệp minh họa .webp/.png đã qua kiểm duyệt bản quyền & đồng bộ màu
│   │   ├── account/             # communitybanner.webp, target.webp
│   │   ├── artworks/            # applehealth.webp, healthconnect.webp...
│   │   ├── bodymetric/          # introartwork.webp, whrhint.webp
│   │   ├── course/              # artwork.webp, empty01.webp, empty02.webp
│   │   ├── dependents/          # me.webp, sister.webp, son.webp
│   │   ├── mealplanai/          # mealplan_step1..3.webp, new_ai_banner.webp, recipe_suggestion.webp...
│   │   ├── mealscan/            # corner*.png, mealscan01..02.webp, mealscanbg.webp, scannotfound.webp...
│   │   ├── onboarding/          # deficitstep0..4.webp, deficitic1..5.png, *scale.webp, weight*.png...
│   │   ├── onboardingv2/        # welcome1..3.webp, male.webp, female.webp, mascot.webp...
│   │   ├── report/              # lampicon.webp
│   │   ├── scanbarcode/         # barcodescanintro.webp, scangrid.webp, scanline.webp
│   │   ├── streak/              # streakactivebg.webp, streakachievedart1..2.webp, freezestreakart1.webp...
│   │   ├── tracker/             # droplet.webp, fill_*.webp, fire.webp, weight.webp...
│   │   ├── voicelog/            # bg.webp, voicelogmascot.webp
│   │   ├── walkthrough/         # arrowtop01.png, arrowtop02.png
│   │   └── water/               # waterbottle.webp, watercup.webp
│   └── fonts/                   # PlusJakartaSans-Regular.ttf, SemiBold.ttf, Bold.ttf, ExtraBold.ttf
├── components/
│   ├── common/                  # AppText, PrimaryButton (52px), SecondaryPillButton (36px), FloatingLogButton (56x56),
│   │                            # SurfaceCard (Level 1/2 + Skia Glow/Shadow), AppInput, StatusBanner, EmptyState
│   ├── dashboard/               # QuickUtilityDock (4 ô), DateSelectorStrip (T2-CN), MacroProgressSliders
│   ├── charts/                  # SegmentedCalorieRing, WeightLineChart, CalorieGroupedBarChart
│   ├── feedback/                # OfflineBanner, Toast, BlurLoadingOverlay, ErrorBoundary, WalkthroughTooltip
│   └── modals/                  # ForceUpdateModal, MaintenanceModal, AllergyWarningModal, CongratulationModal
├── navigation/
│   ├── RootNavigator.tsx        # Chuyển đổi Auth / EmailVerify / Onboarding / Main + Global Modals
│   ├── AuthNavigator.tsx        # Welcome, Login, Register, EmailVerification (OTP), Forgot/ResetPassword
│   ├── OnboardingNavigator.tsx  # Luồng thiết lập hồ sơ sức khỏe 10 bước
│   └── MainTabNavigator.tsx     # 5 vị trí: Trang chủ, Nhật ký, Nút (+) 56x56 có glow tím, Thống kê, Cá nhân
├── features/                    # Chia theo đúng 9 module trong REQUIREMENT.md (v1.2)
│   ├── auth/                    # FR-AUTH-01..09 (bao gồm xác minh OTP bắt buộc)
│   ├── profile/                 # FR-PRO-01..08 (Onboarding V2 & Body Metrics)
│   ├── nutrition/               # FR-NUT-01..13, FR-FD-01..07b (Diary, AI Scan, Barcode lai OFF, Water, Voice)
│   ├── meal-plan/               # FR-PLAN-01..06 (3-step AI Wizard, Swap Food)
│   ├── assistant/               # FR-CHAT-01..06 (Chatbot streaming WebSocket)
│   ├── activity/                # FR-ACT-01..08 (Exercise log, Health Connect / HealthKit, Weight log)
│   ├── report/                  # FR-REP-01..08 (Dashboard, Charts, Weight Forecast)
│   ├── gamification/            # FR-GAM-01..07 (Streak, Badges, Challenges, Friends, Leaderboard)
│   └── system/                  # FR-SYS-01..09 (Notifications, Reminders, Offline Sync, Ghi nguồn ODbL)
├── services/
│   ├── api/                     # Axios client + JWT Refresh + Interceptor bắt 403 EMAIL_NOT_VERIFIED
│   ├── websocket/               # STOMP/WebSocket client cho Chat & Leaderboard
│   └── offline/                 # SyncManager, Queue processor với client_uuid
├── store/                       # Zustand stores (useAuthStore, useThemeStore, useOfflineQueueStore)
├── theme/                       # tokens.ts (import 1:1 từ DESIGN.md), ThemeProvider.tsx
└── utils/                       # Công thức BMI/BMR/TDEE, định dạng ngày/tiền tệ VNĐ, bỏ dấu tiếng Việt
```

---

## 3. Quy chuẩn Kỹ thuật Giao diện & Quản lý Tài nguyên

### 3.1. Liên kết Hệ thống Thiết kế (`DESIGN.md` là Single Source of Truth)
Toàn bộ thông số trực quan gồm Bảng màu (`semantic-tokens` cho cả hai chế độ **Dark — Nocturne** và **Light — Daylight**), Thang chữ (**Plus Jakarta Sans**), Khoảng cách (`spacing`), Bo góc (`rounded`), Độ sâu (`elevation`) và Đặc tả thành phần tuân thủ tuyệt đối theo tài liệu **`DESIGN.md`**. Kế hoạch này không lặp lại bảng mã màu hay kích thước chữ để tránh lệch phiên bản; lập trình viên thực thi theo các quy tắc kỹ thuật sau:

- **Ánh xạ Token 1:1 (`src/theme/tokens.ts`):**
  - Định nghĩa các khóa token trùng khớp hoàn toàn với phần front-matter của `DESIGN.md` (`canvas-base`, `surface-mid`, `surface-high`, `surface-border`, `brand-primary`, `brand-action`, `brand-secondary`, `macro-protein`, `macro-carbs`, `macro-fats`, `quick-scanner`, `vip-streak`, `tracker-water`, `status-warning`, `status-danger`, `data-display`, v.v.).
  - Nghiêm cấm gán cứng (hardcode) mã màu Hex/RGBA hoặc cỡ chữ trực tiếp bên trong các file màn hình/component.
  - Trên biểu đồ so sánh Calo nạp vào / tiêu hao (`FR-REP-02`), sử dụng `brand-primary` cho Calo nạp vào và `brand-secondary` cho Calo tiêu hao để tách biệt rõ ràng, không trùng màu với các chỉ số Macro hay cảnh báo.
- **Đồng bộ ưu tiên Giao diện Sáng/Tối (`DESIGN.md` vs `FR-SYS-08` trong `REQUIREMENT.md`):**
  - Toàn bộ bộ token `dark` và `light` được nạp sẵn vào `useThemeStore()` ngay từ **Phase 1**, giúp mọi component tự động thích ứng với cả hai chế độ mà không tốn công sửa lại.
  - Đề xuất nâng `FR-SYS-08` từ mức **C (Could)** lên **S (Should)**. Trong trường hợp cần rút gọn thời gian kiểm thử giao diện ở cuối dự án (theo mục 10 của `REQUIREMENT.md`), có thể khóa mặc định một theme qua cờ cấu hình mà không ảnh hưởng kiến trúc.
- **Giải pháp kỹ thuật cho giới hạn nền tảng trên React Native:**
  - *Hào quang & Bóng đổ màu (`glow`, `glow-strong`) trên Android:* Do thuộc tính `elevation` mặc định của Android chỉ tạo bóng xám và không hỗ trợ hào quang màu tím, bắt buộc xây dựng `<GlowSurface />` bằng `@shopify/react-native-skia` hoặc `react-native-svg` để vẽ hiệu ứng phát sáng cho nút nổi `+` ($56 \times 56\text{ px}$), viên thuốc chọn ngày (`T2`–`CN`) và nút CTA.
  - *Hiệu ứng Kính mờ & Dải màu:* Sử dụng `expo-blur` (Gaussian blur $20\text{ px}$) cho `tab-bar` và lớp phủ `overlay` của Modal/Bottom Sheet; sử dụng `expo-linear-gradient` cho nút Primary CTA (chuyển màu từ `brand-action` sang tông đậm hơn để giữ độ tương phản chữ trắng $\ge 4.5:1$).
- **Phạm vi khung nhìn (Viewport Scope):**
  - Bản phát hành đầu tiên (MVP v1.0) chỉ triển khai bố cục dọc $1$ cột cho điện thoại ($< 600\text{ px}$, màn hình $5\text{–}7\text{ inch}$ theo mục 9.5 của `REQUIREMENT.md`). Bố cục $2$ cột cho máy tính bảng ($\ge 600\text{ px}$) thuộc phạm vi mở rộng sau MVP (Post-MVP).

### 3.2. Quy tắc Địa phương hóa & Hiển thị Số liệu
- **Nhãn & Đơn vị chuẩn Việt Nam (Mục 9.8 `REQUIREMENT.md`):**
  - Hiển thị mặc định tên 3 nhóm chất đa lượng bằng tiếng Việt trên toàn ứng dụng: **Chất đạm** (Protein), **Đường bột** (Carbs), **Chất béo** (Fat).
  - Định dạng chuẩn: Chiều cao ($\text{cm}$), Cân nặng ($\text{kg}$, lấy $1$ chữ số thập phân, ví dụ $62,5\text{ kg}$), Năng lượng ($\text{kcal}$), Nước ($\text{ml}$), Tiền tệ ($\text{VNĐ}$, ví dụ $45.000\text{ đ}$), múi giờ mặc định `Asia/Ho_Chi_Minh`.
- **Chống lệch cột số & Vỡ khung chữ:**
  - Bật `fontVariant: ['tabular-nums']` cho mọi thành phần hiển thị con số (Calo trung tâm `data-display`, số gram Macro, bộ đếm ngược OTP).
  - Giới hạn `maxFontSizeMultiplier={1.3}` trên các thành phần thẻ hẹp và thanh điều hướng để không vỡ bố cục khi người dùng bật cỡ chữ hệ thống lớn.

### 3.3. Quy chuẩn Quản lý Placeholder, Thẻ nền & Bản quyền Hình ảnh
- **Component `<AppImage />` (bọc ngoài `expo-image`):** Tự động hiển thị placeholder theo tỷ lệ khung hình:
  - Tỷ lệ $1:1$ (ảnh món ăn $48 \times 48\text{ px}$, avatar): `placeholder_11.webp`, `fooddefault.webp`, `defaultavatar.webp`.
  - Tỷ lệ $16:9$ (banner thực đơn, thử thách): `placeholder_169.webp`.
  - Tỷ lệ $4:3$ & $3:4$ (ảnh chụp nhật ký bữa ăn): `placeholder_43.webp`, `placeholder_34.webp`.
- **Kiểm duyệt bản quyền & Đồng bộ bảng màu Tím cho tài nguyên:**
  - **Loại bỏ tuyệt đối các tệp chứa thương hiệu bên thứ ba (WAO):** Không đưa vào dự án các tệp `waologo.png`, `logowhite.webp`, `tracker_logo.webp`, `premium_waoawardbackground.webp`. Thay thế bằng wordmark và biểu tượng nguyên bản của **Kallo** (màn hình Splash dùng nền `brand-action` `#8B57E8` với chữ **Kallo** trắng ở chính giữa theo `DESIGN.md`).
  - **Thay thế ảnh nền thẻ tĩnh bằng Code UI:** Không dùng các ảnh nền đóng cứng màu cũ (`home_headerbg.webp`, `tracker_rectangle.webp`, `report_chartbg.webp`, `report_wlcardbg.webp`, `account_cardbg.webp`). Toàn bộ thẻ và khung chứa được dựng bằng `<SurfaceCard />` sử dụng token `surface-mid`, `surface-high` và `surface-border`.
  - **Đồng bộ sắc độ Tím cho ảnh minh họa:** Các ảnh minh họa giữ lại (trong `onboardingv2/`, `mealplanai/`, `streak/`...) được xử lý dịch hệ màu (Hue-shift sang tông Tím $265^\circ\text{–}270^\circ$) trước khi đưa vào sử dụng.

---

## 4. Cấu trúc Điều hướng (Navigation Architecture)

Đáp ứng mục 7.1, 7.2 của `REQUIREMENT.md` (v1.2 — bổ sung xác minh email bằng OTP bắt buộc) và cấu trúc điều hướng của `DESIGN.md`:

```text
RootNavigator (Native Stack)
├── Splash & System Check (Nền #8B57E8 + Kallo Wordmark trắng; kiểm tra JWT & email_verified)
├── AuthStack (Khi chưa đăng nhập)
│   ├── WelcomeCarouselScreen (3 slide giới thiệu Kallo)
│   ├── LoginScreen (Email + Google OAuth2)
│   ├── RegisterScreen (Đăng ký Email -> tự động gửi OTP 6 chữ số)
│   ├── EmailVerificationScreen (BẮT BUỘC cho tài khoản có email_verified = false - FR-AUTH-09)
│   └── ForgotPasswordScreen & ResetPasswordScreen (Nhập OTP 6 chữ số + mật khẩu mới)
├── OnboardingStack (Khi đã xác minh email nhưng chưa có UserHealthProfile)
│   ├── Step 1: Hello & Kallo Mascot Intro
│   ├── Step 2: Chọn đối tượng hồ sơ
│   ├── Step 3: Giới tính & Ngày sinh
│   ├── Step 4: Chiều cao & Cân nặng hiện tại (Interactive Ruler Picker)
│   ├── Step 5: Mức độ vận động & Mục tiêu (Giảm cân / Giữ cân / Tăng cân)
│   ├── Step 6: Cân nặng mục tiêu & Tốc độ thay đổi/tuần
│   ├── Step 7: Giải thích cơ chế Thâm hụt Calo
│   ├── Step 8: Khai báo Dị ứng / Kiêng kỵ (Danh mục chuẩn + nhập tự do)
│   ├── Step 9: Xin quyền Thông báo & Sức khỏe (Health Connect / HealthKit)
│   └── Step 10: Màn chờ tính toán & Kết quả BMI/BMR/TDEE + Chia tỷ lệ Chất đạm/Đường bột/Chất béo
├── MainTabNavigator (Bottom Tabs — 5 vị trí, nền kính mờ tab-bar + expo-blur)
│   ├── Tab 1: Trang chủ (HomeDashboardScreen — tích hợp QuickUtilityDock 4 ô phía trên Tab Bar)
│   ├── Tab 2: Nhật ký (FoodDiaryScreen)
│   ├── Tab 3: [FloatingLogButton (+) 56x56px, nền brand-primary, có glow tím] -> Mở nhanh AI Scan / Quick Log
│   ├── Tab 4: Thống kê (ReportOverviewScreen)
│   └── Tab 5: Cá nhân (AccountProfileScreen)
└── Global Modal / FullScreen Stack (Lớp phủ overlay + Gaussian blur 20px)
    ├── AIMealScanScreen (Camera nhận diện món Việt) -> MealScanResultScreen
    ├── BarcodeScannerScreen (Quét mã vạch: CSDL nội bộ -> Open Food Facts -> Tạo món mới)
    ├── VoiceLogModal (Ghi nhận nhanh bằng giọng nói — mở từ ô thứ 4 của QuickUtilityDock)
    ├── FoodSearchScreen & FoodDetailScreen & CustomFoodFormScreen
    ├── MealPlanWizardScreen (3 bước) & MealPlanDetailScreen
    ├── NutritionChatScreen (Trợ lý AI streaming qua WebSocket)
    ├── ActivityTrackerScreen & HealthSyncScreen & BodyMetricScreen
    ├── StreakDetailModal & BadgesChallengesScreen & FriendsLeaderboardScreen
    └── NotificationCenterScreen, ReminderSettingsScreen & DataAttributionScreen (Ghi nguồn ODbL)
```

---

## 5. Lộ trình triển khai chi tiết theo từng Phase

### Phase 1: Khởi tạo, Theme Tokens, Core UI & Khung điều hướng (Tuần 1–2)
**Mục tiêu:** Xây dựng nền móng dự án, cài đặt hệ thống token từ `DESIGN.md`, bộ Core Components và khung điều hướng.

1. **Thiết lập dự án, Thư viện & Tài nguyên:**
   - Khởi tạo dự án Expo + TypeScript, cấu hình path alias (`@/components`, `@/assets`, `@/features`, `@/theme`).
   - Cài đặt và cấu hình `expo-blur`, `expo-linear-gradient`, `@shopify/react-native-skia`, `react-native-svg`, `react-native-reanimated` và font **Plus Jakarta Sans**.
   - Tạo `src/theme/tokens.ts` và `ThemeProvider` ánh xạ đầy đủ `semantic-tokens` (Dark & Light), `typography`, `rounded`, `spacing` từ `DESIGN.md`.
2. **Xây dựng Core UI Components (`src/components/`):**
   - **Hệ thống Nút bấm:** `<PrimaryButton />` (cao $52\text{ px}$, pill-rounded, nền `brand-action` kèm hiệu ứng nhấn `opacity: 0.85`, `scale: 0.98`), `<SecondaryPillButton />` (cao $36\text{ px}$, nền `surface-high`, viền `surface-border`), và `<FloatingLogButton />` (nút tròn `+` $56 \times 56\text{ px}$ ở giữa Tab Bar, nền `brand-primary` kèm hào quang `glow-strong` vẽ bằng Skia/SVG).
   - **Bề mặt & Thông báo:** `<SurfaceCard />` (Level 1 `surface-mid` và Level 2 `surface-high`, bo góc $16\text{ px}$), `<StatusBanner />` (biểu ngữ `status-warning` và `status-danger` luôn đi kèm icon cảnh báo + tiêu đề + nội dung), `<EmptyStateView />` và `<BlurModalWrapper />` (lớp phủ `overlay` + blur $20\text{ px}$).
   - **Thành phần Dashboard nền tảng:** `<QuickUtilityDock />` ($4$ ô: *Tìm kiếm, Mã vạch, Quét AI, Giọng nói*), `<DateSelectorStrip />` (`T2`–`CN`), `<SegmentedCalorieRing />` và `<MacroProgressSliders />` (*Chất đạm, Đường bột, Chất béo*).
3. **Khung điều hướng & Interceptor xác thực:**
   - Cấu hình `RootNavigator` và `MainTabNavigator` (thanh Tab Bar kính mờ `expo-blur`).
   - Thiết lập Axios Interceptor tự động đính kèm `Bearer <JWT>`, làm mới token khi nhận mã `401` (`FR-AUTH-06`) và **tự động chuyển hướng sang `EmailVerificationScreen` khi nhận mã lỗi `403 EMAIL_NOT_VERIFIED`** (`FR-AUTH-09`, AC7 mục 4.1).

**Tiêu chí hoàn thành Phase 1 (Deliverables):**
- Màn hình `ComponentShowcaseScreen` hiển thị chuẩn xác cả 2 chế độ **Dark (Nocturne)** và **Light (Daylight)** theo đúng `DESIGN.md`.

---

### Phase 2: Onboarding V2, Xác thực (kèm OTP) & Thiết lập Hồ sơ Sức khỏe (Tuần 3–4)
**Mục tiêu:** Hoàn thiện luồng đăng ký, **xác minh email bắt buộc bằng OTP** (`FR-AUTH-01..09`) và thiết lập hồ sơ sức khỏe (`FR-PRO-01..08`).

1. **Màn hình Giới thiệu & Xác thực (Module AUTH):**
   - **Welcome Carousel, Login & Register Screen:** Hỗ trợ đăng ký/đăng nhập bằng Email + mật khẩu ($\ge 8$ ký tự gồm chữ và số) hoặc Google OAuth2 (`POST /api/auth/google`).
   - **Màn hình Xác minh Email bằng OTP (`EmailVerificationScreen` — `FR-AUTH-09`):**
     - Ngay sau khi đăng ký bằng Email (hoặc khi đăng nhập tài khoản có `email_verified = false`), chuyển thẳng tới màn nhập mã OTP **$6$ chữ số** (`tabular-nums`, hiệu lực $15$ phút).
     - Tích hợp nút gửi lại mã kèm đồng hồ đếm ngược ($\ge 60$ giây giữa hai lần gửi, tối đa $3$ mã/giờ — `POST /api/auth/resend-verification`).
     - Xử lý thông báo lỗi khi mã sai, hết hạn hoặc bị khóa sau $5$ lần nhập sai (AC5, AC6 mục 4.1). Khi xác minh thành công (`POST /api/auth/verify-email`), cập nhật access token mới có `email_verified = true` và chuyển vào Onboarding.
   - **Forgot / Reset Password Screen (`FR-AUTH-04`):** Gửi yêu cầu khôi phục và đặt lại mật khẩu bằng mã OTP $6$ chữ số.
2. **Luồng Thiết lập Hồ sơ Sức khỏe (Module PROFILE — Onboarding V2):**
   - Xây dựng 10 bước thiết lập: Giới tính, Ngày sinh, Thước kéo Chiều cao ($[100, 250]\text{ cm}$) & Cân nặng ($[20, 300]\text{ kg}$ — AC2 mục 4.2), Mức độ vận động, Mục tiêu cân nặng, Giải thích cơ chế Thâm hụt Calo và Khai báo Dị ứng (`FR-PRO-04`).
   - **Màn hình Tính toán & Kết quả (`CalculatingTDEEScreen` — `FR-PRO-05`, `FR-PRO-06`):**
     - Hiển thị kết quả tức thì ($\le 1$ giây):
       $$\text{BMI} = \frac{W}{H^2}$$
       $$\text{BMR (Nam)} = 10W + 6.25H - 5A + 5 \quad | \quad \text{BMR (Nữ)} = 10W + 6.25H - 5A - 161$$
       $$\text{TDEE} = \text{BMR} \times \text{Hệ số vận động}$$
       $$\text{Calo mục tiêu} = \text{TDEE} \pm \frac{\text{Tốc độ (kg/tuần)} \times 7700}{7}$$
     - Hiển thị `<StatusBanner type="warning" />` nếu mục tiêu Calo thấp hơn BMR hoặc dưới ngưỡng an toàn ($< 1200\text{ kcal}$ với nữ, $< 1500\text{ kcal}$ với nam — AC3 mục 4.2).
     - Cho phép chỉnh tay tỷ lệ **Chất đạm / Đường bột / Chất béo** với tổng khóa ở $100\%$.

**Tiêu chí hoàn thành Phase 2 (Deliverables):**
- Luồng Đăng ký Email $\rightarrow$ Xác minh OTP $6$ số $\rightarrow$ Thiết lập hồ sơ $\rightarrow$ Tính ra BMI/TDEE/Macro lưu thành công xuống `PUT /api/users/me/profile`.

---

### Phase 3: Trang chủ (Dashboard), Quick Utility Dock, Nhật ký, Nước & Cân nặng (Tuần 5–6)
**Mục tiêu:** Xây dựng các màn hình sử dụng hằng ngày của người dùng (`FR-REP-01`, `FR-NUT-01`, `FR-NUT-04`, `FR-NUT-06..11`, `FR-ACT-04`).

1. **Màn hình Trang chủ — Home Dashboard (`HomeDashboardScreen`):**
   - **Header & Dải chọn ngày (`<DateSelectorStrip />`):** Hiển thị lời chào, avatar, huy hiệu Streak (`vip-streak`), nút Thông báo và dải chọn thứ trong tuần (`T2`–`CN`).
   - **Thẻ Vòng Tiến độ Calo & 3 Nhóm Chất (`<SegmentedCalorieRing />` + `<MacroProgressSliders />`):**
     - Vòng Calo trung tâm hiển thị số Calo còn lại bằng kiểu chữ `data-display`, đường tròn phân đoạn theo tỷ lệ **Chất đạm (`macro-protein`), Đường bột (`macro-carbs`), Chất béo (`macro-fats`)** đã nạp. Khi vượt $> 100\%$ mục tiêu, hiển thị chỉ báo `status-danger` kèm icon và nhãn cảnh báo.
     - Bên dưới là 3 thanh tiến độ ngang cho **Chất đạm**, **Đường bột**, **Chất béo**.
   - **Widget Nước uống (`WaterTrackerCard`) & Cân nặng (`WeightTrackerCard`):**
     - Theo dõi tiến độ nước với màu `tracker-water`, bấm cộng nhanh $+250\text{ ml}$ hoặc mở Bottom Sheet nhập số $\text{ml}$ (`FR-NUT-11`).
     - Cập nhật nhanh cân nặng trong ngày và đề xuất tính lại TDEE khi cân nặng thay đổi (`FR-PRO-08`).
   - **Thanh Công cụ Tiện ích Nhanh (`<QuickUtilityDock />`):**
     - Đặt phía trên thanh Tab Bar với $4$ ô truy cập nhanh: **Tìm kiếm** (`FoodSearchScreen`), **Mã vạch** (`BarcodeScannerScreen`), **Quét AI** (`AIMealScanScreen`) và **Giọng nói** (`VoiceLogModal`).
2. **Màn hình Nhật ký Dinh dưỡng (`FoodDiaryScreen`):**
   - Danh sách 4 nhóm bữa ăn (**Bữa sáng, Bữa trưa, Bữa tối, Ăn vặt** — `FR-NUT-01`) đặt trong thẻ Level 1 (`surface-mid`), bên trong chứa các dòng `<FoodLogListItem />` (Level 2 `surface-high`), hỗ trợ sửa/xoá và sao chép bữa ăn từ ngày khác (`FR-NUT-08`).
3. **Tìm kiếm Món ăn, Chi tiết Món & Món ăn Tuỳ chỉnh (`FR-NUT-04`, `FR-NUT-06`, `FR-NUT-09`, `FR-NUT-10`):**
   - Thanh tìm kiếm không dấu (debounce $300\text{ ms}$), chia 3 tab: *Tất cả*, *Gần đây & Yêu thích*, *Món của tôi*.
   - Tính toán dinh dưỡng theo khẩu phần thực tế:
     $$\text{Dinh dưỡng thực tế} = \text{Dinh dưỡng trên } 100\text{g} \times \frac{\text{Khối lượng ăn (g)}}{100}$$
   - Hiển thị `<StatusBanner type="danger" />` cảnh báo nổi bật nếu món ăn chứa chất gây dị ứng nằm trong hồ sơ người dùng (`FR-NUT-10`), và hiển thị nhãn nguồn dữ liệu nếu món có `source = OFF` (`FR-SYS-09`).

**Tiêu chí hoàn thành Phase 3 (Deliverables):**
- Người dùng mở được cả 4 tiện ích từ `QuickUtilityDock`, ghi nhận bữa ăn, nước uống, cân nặng và cập nhật tức thì lên Dashboard.

---

### Phase 4: AI Meal Scan (Camera nhận diện món Việt) & Quét Mã vạch Lai (Tuần 6–8)
**Mục tiêu:** Hiện thực hóa tính năng cốt lõi chụp ảnh nhận diện 68 món ăn Việt Nam (`FR-NUT-02`, `FR-NUT-03`, `FR-NUT-12`, `FR-NUT-13`) và quét mã vạch lai (`FR-NUT-05`, `FR-FD-07a/07b`).

1. **Màn hình Camera AI Nhận diện Món ăn (`AIMealScanScreen`):**
   - Giao diện Camera toàn màn hình với khung ngắm 4 góc (`mealscan/corner*.png`), nút thu phóng, bật đèn Flash, chọn ảnh từ thư viện và hướng dẫn chụp lần đầu (`mealscan01..02.webp`).
   - Nén ảnh phía client bằng `expo-image-manipulator` (cạnh dài $\le 1280\text{ px}$, dung lượng $\le 2\text{ MB}$) trước khi gửi `POST /api/food-logs/recognize`.
2. **Màn hình Kết quả Nhận diện & Xác nhận (`MealScanResultScreen`):**
   - Vẽ các **Bounding Box** bằng `react-native-svg` theo tọa độ $(x, y, w, h)$ trả về từ FastAPI YOLOv11m, hiển thị tên món, độ tin cậy ($\%$) và khẩu phần ước lượng ($\text{gram}$, hệ số `size_factor` $\in [0.5, 2.0]$).
   - **Bottom Sheet Xác nhận nhanh ($\le 3$ thao tác chạm — AC1 mục 4.3):**
     - Xem danh sách món nhận diện kèm tổng Calo và **Chất đạm / Đường bột / Chất béo** $\rightarrow$ chỉnh nhanh hệ số khẩu phần hoặc sửa tên món $\rightarrow$ bấm **"Lưu vào nhật ký"** (hiển thị trạng thái thành công màu `quick-scanner`).
   - Khi không nhận diện được món nào (`items: []` — AC2 mục 4.3), hiển thị minh họa `scannotfound.webp` kèm nút tìm kiếm thủ công.
   - Khi người dùng sửa nhãn món ăn, hiển thị hộp thoại xin phép đóng góp ảnh cải thiện mô hình (`FR-NUT-13`).
3. **Màn hình Quét Mã vạch Lai (`BarcodeScannerScreen` — `FR-NUT-05`, `FR-FD-07a/07b`):**
   - Kiểm tra định dạng mã vạch hợp lệ (EAN-8, UPC-A, EAN-13, GTIN-14) trước khi gọi `GET /api/foods/barcode/{code}`.
   - Xử lý 3 kịch bản phản hồi theo cơ chế lai (Q2 trong SRS v1.2):
     - **Có trong CSDL nội bộ (AC4):** Hiển thị kết quả trong $\le 1$ giây.
     - **Tra cứu dự phòng từ Open Food Facts (AC5):** Trả kết quả trong $\le 3$ giây kèm nhãn nguồn `Open Food Facts (ODbL)` (`source = OFF`); nếu người dùng chỉnh sửa thông số thì lưu thành món tùy chỉnh mới.
     - **Không tìm thấy (`404`) hoặc thiếu dữ liệu Calo/Macro (AC6):** Hiển thị thông báo nhã nhặn và nút **"Tạo món từ mã vạch này"** mở thẳng form tạo món tùy chỉnh với mã vạch đã điền sẵn.

**Tiêu chí hoàn thành Phase 4 (Deliverables):**
- Chụp ảnh món Việt $\rightarrow$ hiển thị Bounding Box $\rightarrow$ lưu log trong $\le 3$ chạm ($\le 5$ giây trên mạng 4G); quét mã vạch hoạt động trơn tru ở cả 3 kịch bản.

---

### Phase 5: Theo dõi Vận động, Đồng bộ Sức khỏe & Biểu đồ Báo cáo (Tuần 8–9)
**Mục tiêu:** Hoàn thiện module Vận động (`FR-ACT-01..08`) và module Thống kê / Dự báo xu hướng (`FR-REP-02..08`).

1. **Màn hình Vận động & Chỉ số cơ thể (Module ACT):**
   - Ghi nhận hoạt động tập luyện thủ công (`FR-ACT-01`), tính Calo tiêu hao theo công thức:
     $$\text{Calo tiêu hao} = \text{MET} \times \text{Cân nặng (kg)} \times \frac{\text{Thời lượng (phút)}}{60}$$
   - Đồng bộ bước chân và nhịp tim từ **Health Connect** (Android) và **Apple HealthKit** (iOS) (`FR-ACT-02`, `FR-ACT-03`), khử trùng lặp bản ghi theo `external_id` và khung thời gian (`FR-ACT-08`).
2. **Màn hình Báo cáo & Thống kê (`ReportOverviewScreen` — Module REPORT):**
   - Bộ chuyển đổi kỳ báo cáo: **Ngày | Tuần | Tháng**.
   - **Biểu đồ Calo Nạp vào / Tiêu hao (`FR-REP-02`):** Biểu đồ cột đôi dùng màu `brand-primary` (Nạp vào) và `brand-secondary` (Tiêu hao) kèm đường mục tiêu ngang.
   - **Biểu đồ Macro (`FR-REP-03`):** Biểu đồ tròn và cột chồng hiển thị tỷ lệ $\%$ **Chất đạm / Đường bột / Chất béo** thực tế so với mục tiêu.
   - **Biểu đồ Cân nặng & Dự báo xu hướng (`FR-REP-04`, `FR-REP-05`):**
     - Vẽ đường cân nặng thực tế, đường mục tiêu và đường xu hướng dự báo bằng trung bình động hàm mũ (EMA) hoặc hồi quy tuyến tính trên cửa sổ $14\text{–}28$ ngày.
     - Khi chưa đủ $\ge 14$ ngày dữ liệu (AC3 mục 4.6), hiển thị thẻ hướng dẫn số ngày cần ghi thêm để mở khóa dự báo thay vì hiển thị kết quả sai.

**Tiêu chí hoàn thành Phase 5 (Deliverables):**
- Đồng bộ bước chân không bị trùng lặp; các biểu đồ render mượt ở $60\text{ fps}$ trên cả hai chế độ Sáng/Tối.

---

### Phase 6: Thực đơn AI, Trợ lý Chatbot & Gamification / Xã hội (Tuần 9–11)
**Mục tiêu:** Triển khai lập kế hoạch bữa ăn bằng AI (`FR-PLAN-01..06`), trợ lý Chatbot (`FR-CHAT-01..06`) và hệ thống động lực / xếp hạng thời gian thực (`FR-GAM-01..07`).

1. **Lập kế hoạch Bữa ăn bằng AI (`MealPlanWizardScreen` — Module PLAN):**
   - **Wizard 3 bước:** (1) Chọn thời gian ($1$ ngày hoặc $7$ ngày) & mục tiêu Calo, (2) Nhập ngân sách dự kiến ($\text{VNĐ/ngày}$), (3) Kiểm tra bộ lọc cứng dị ứng (`FR-PLAN-05`).
   - **Màn hình Chi tiết Thực đơn (`MealPlanDetailScreen`):** Hiển thị 4 buổi ăn (tổng Calo nằm trong $\pm 5\%$ mục tiêu) kèm chi phí ước tính, nút `<SecondaryPillButton />` **"Đổi món"** (`FR-PLAN-03`) và nút `<PrimaryButton />` **"Áp dụng vào Nhật ký ngày"** (`FR-PLAN-04`).
2. **Trợ lý Dinh dưỡng AI Chatbot (`NutritionChatScreen` — `FR-CHAT-01..06`):**
   - Giao diện hội thoại hỗ trợ nhận phản hồi streaming theo thời gian thực qua WebSocket (`/ws`).
   - Thanh câu hỏi gợi ý nhanh (`FR-CHAT-05`) và biểu ngữ miễn trừ y khoa cố định ở đầu khung chat (`FR-CHAT-06`).
3. **Hệ thống Streak, Huy hiệu, Thử thách & Bảng xếp hạng (`Module GAME`):**
   - Màn hình & Modal Streak (`FR-GAM-01`), Huy hiệu (`FR-GAM-02`) và Thử thách (`FR-GAM-03`) với điểm nhấn màu `vip-streak`.
   - Tìm kiếm bạn bè, quản lý lời mời kết bạn (`FR-GAM-04`) và **Bảng xếp hạng bạn bè thời gian thực** qua WebSocket (độ trễ $\le 3$ giây — `FR-GAM-05`), có công tắc ẩn/hiện chỉ số cá nhân và tuyệt đối không hiển thị cân nặng tuyệt đối (`FR-GAM-07`).

**Tiêu chí hoàn thành Phase 6 (Deliverables):**
- Thực đơn AI tôn trọng tuyệt đối dị ứng và ngân sách; Chatbot trả lời khớp với `DailySummary`; Bảng xếp hạng tự cập nhật thứ hạng qua WebSocket.

---

### Phase 7: Tiện ích Hệ thống, Ngoại tuyến (Offline-first) & Tinh chỉnh UX (Tuần 11–13)
**Mục tiêu:** Đảm bảo độ tin cậy khi mất mạng (`FR-SYS-05`, `FR-SYS-06`), thông báo thông minh (`FR-SYS-01..04`), ghi nguồn dữ liệu mở (`FR-SYS-09`) và hoàn thiện nghiệm thu.

1. **Giao diện Ngoại tuyến & Đồng bộ (Offline-First UI):**
   - Khi mất mạng, hiển thị `<StatusBanner type="warning" />` nhỏ gọn thông báo chế độ ngoại tuyến và số mục đang chờ đồng bộ.
   - Cho phép ghi log bữa ăn (từ bộ nhớ đệm), nước uống, cân nặng, vận động kèm khoá định danh `client_uuid` tạo sẵn dưới máy; tự động đẩy dữ liệu idempotent (`POST /api/sync/push`) khi có mạng trở lại (AC1 mục 4.8).
2. **Thông báo đẩy & Nhắc nhở Thông minh (`FR-SYS-01..04`):**
   - Trung tâm thông báo (`NotificationCenterScreen`) và màn hình cài đặt khung giờ nhắc uống nước, nhắc ghi bữa ăn, cảnh báo vượt $100\%$ Calo mục tiêu cùng chế độ *Không làm phiền*.
3. **Màn hình Cá nhân, Cài đặt Giao diện & Ghi nguồn Dữ liệu (`FR-AUTH-07/08`, `FR-SYS-08/09`):**
   - Quản lý hồ sơ cá nhân, đổi ảnh đại diện, đổi mật khẩu, chuyển đổi chế độ giao diện **Tối (Nocturne) / Sáng (Daylight)** (`FR-SYS-08`) và nút **Xoá tài khoản** (`FR-AUTH-07`).
   - Bổ sung màn hình/mục **"Nguồn dữ liệu & Giấy phép"** trong phần Giới thiệu/Cài đặt để ghi nguồn **Open Food Facts (ODbL)**, Viện Dinh dưỡng Quốc gia (NIN) và FAO/INFOODS theo đúng yêu cầu bắt buộc `FR-SYS-09`.

**Tiêu chí hoàn thành Phase 7 (Deliverables):**
- Vượt qua kịch bản kiểm thử tắt mạng $\rightarrow$ ghi $3$ log nước + $1$ bữa ăn $\rightarrow$ bật mạng $\rightarrow$ đồng bộ thành công không trùng lặp; đạt $100\%$ tiêu chí nghiệm thu tại mục 11.2 của `REQUIREMENT.md`.

---

## 6. Bảng ánh xạ Tài nguyên Hình ảnh & Trạng thái Chuẩn hóa (Asset Mapping Matrix)

Bảng dưới đây đối chiếu các tệp hình ảnh trong kho tài nguyên với màn hình sử dụng, mã yêu cầu (`FR-*`) và quy tắc xử lý bản quyền / màu sắc:

| Nhóm Module | Tên tệp tài nguyên (`drawable-mdpi-v4/...`) | Trạng thái & Quy tắc xử lý | Màn hình / Component sử dụng | Mã FR liên quan |
|---|---|---|---|---|
| **Thương hiệu & Splash (Loại bỏ WAO)** | `src_assets_images_waologo.png`<br>`src_assets_images_logowhite.webp`<br>`src_assets_images_tracker_logo.webp`<br>`src_assets_images_premium_waoawardbackground.webp` | ❌ **LOẠI BỎ** (Rủi ro bản quyền thương hiệu WAO). Thay bằng bộ wordmark/logo nguyên bản của **Kallo** (`src/assets/brand/`). | `SplashScreen` (nền `#8B57E8` + chữ Kallo trắng), `WelcomeScreen` | `FR-AUTH-01`..`03` |
| **Ảnh nền thẻ tĩnh (Thay bằng Code)** | `src_assets_images_home_headerbg.webp`<br>`src_assets_images_tracker_rectangle.webp`<br>`src_assets_images_report_chartbg.webp`, `wlcardbg.webp`<br>`src_assets_images_account_cardbg.webp`<br>`src_assets_images_introbackground.webp`, `loginbg.webp` | 🔄 **THAY BẰNG CODE UI** (`<SurfaceCard />`, `expo-linear-gradient`, `<GlowSurface />` dùng `semantic-tokens` Dark/Light). | `HomeDashboardScreen`, `ReportOverviewScreen`, `AccountProfileScreen` | `FR-REP-01`..`04`, `FR-SYS-08` |
| **Onboarding V2** | `src_assets_images_onboardingv2_welcome1..3.webp`<br>`src_assets_images_onboarding_introducev201..03.webp`<br>`src_assets_images_onboardingv2_mascot.webp`<br>`src_assets_images_onboarding_onboardinghello.webp`<br>`src_assets_images_onboarding_onboardingquote.webp` | 🎨 **GIỮ & ĐỒNG BỘ MÀU TÍM** (Hue-shift sang dải Tím $265^\circ\text{–}270^\circ$; thay mascot bằng Kallo Mascot). | `WelcomeCarouselScreen`, `OnboardingWelcomeStep` | `FR-PRO-01` |
| **Thiết lập Thể trạng** | `src_assets_images_onboardingv2_male.webp`, `female.webp`<br>`src_assets_images_dependents_me.webp`, `sister.webp`, `son.webp`<br>`src_assets_images_onboarding_weightscale.webp`, `appscale.webp`<br>`src_assets_images_onboarding_weightloss.png`, `weightgain.png`<br>`src_assets_images_onboarding_onboardingwaiting.webp` | 🎨 **GIỮ & ĐỒNG BỘ MÀU TÍM** | `GenderStep`, `BodyMeasureStep`, `GoalSelectionStep`, `CalculatingTDEEScreen` | `FR-PRO-01`..`06` |
| **Cơ chế Thâm hụt** | `src_assets_images_onboarding_deficitstep0..4.webp`<br>`src_assets_images_onboarding_deficitic1..5.png` | 🎨 **GIỮ & ĐỒNG BỘ MÀU TÍM** | `CalorieDeficitEducationModal` | `FR-PRO-05` |
| **Nhật ký & Nước** | `src_assets_images_fooddiaryintroduce.webp`, `fooddiaryartwork.png`<br>`src_assets_images_fooddefault.webp`<br>`src_assets_images_favoritefood_empty.webp`<br>`src_assets_images_water_watercup.webp`, `waterbottle.webp`<br>`src_assets_images_tracker_droplet.webp`, `fill_empty/full.webp`<br>`src_assets_images_tracker_fire.webp` | ✅ **SỬ DỤNG** (Kết hợp token `tracker-water` và `brand-primary`). | `FoodDiaryScreen`, `FoodSearchScreen`, `WaterTrackerCard`, `SegmentedCalorieRing` | `FR-NUT-01`, `FR-NUT-04`, `FR-NUT-09`, `FR-NUT-11` |
| **AI Meal Scan** | `src_assets_images_mealscan_mealscanbg.webp`<br>`src_assets_images_mealscan_cornertopleft/right.png`<br>`src_assets_images_mealscan_cornerbottomleft/right.png`<br>`src_assets_images_mealscan_scaleup.png`, `scaledown.png`<br>`src_assets_images_mealscan_mealscan01..02.webp`<br>`src_assets_images_mealscan_scannotfound.webp`<br>`src_assets_images_mealscan_mealscanfeedback.webp` | ✅ **SỬ DỤNG** (Khung quét AI dùng điểm nhấn `quick-scanner` `#22C55E` / `#16A34A`). | `AIMealScanScreen`, `MealScanGuideModal`, `MealScanResultScreen`, `AICorrectionFeedbackSheet` | `FR-NUT-02`, `FR-NUT-03`, `FR-NUT-12`, `FR-NUT-13` |
| **Barcode & Voice** | `src_assets_images_scanbarcode_barcodescanintro.webp`<br>`src_assets_images_scanbarcode_scangrid.webp`, `scanline.webp`<br>`src_assets_images_voicelog_bg.webp`, `voicelogmascot.webp` | 🎨 **GIỮ & ĐỒNG BỘ MÀU TÍM** (Truy cập từ `QuickUtilityDock`). | `BarcodeScannerScreen`, `VoiceLogModal` | `FR-NUT-05`, `FR-FD-07a/07b` |
| **Thực đơn AI** | `src_assets_images_mealplanai_new_ai_banner.webp`<br>`src_assets_images_mealplanai_mealplan_step1..3.webp`<br>`src_assets_images_mealplanai_recipe_suggestion.webp`<br>`src_assets_images_mealplan_empty.webp` | 🎨 **GIỮ & ĐỒNG BỘ MÀU TÍM** | `MealPlanOverviewScreen`, `MealPlanWizardScreen` ($3$ bước) | `FR-PLAN-01`..`06` |
| **Vận động & Báo cáo** | `src_assets_images_artworks_healthconnect.webp`<br>`src_assets_images_artworks_applehealth.webp`<br>`src_assets_images_tracker_syncicon.png`, `weight.webp`<br>`src_assets_images_bodymetric_introartwork.webp`, `whrhint.webp`<br>`src_assets_images_report_lampicon.webp` | ✅ **SỬ DỤNG** | `ActivityTrackerScreen`, `HealthSyncScreen`, `BodyMetricScreen`, `WeightForecastCard` | `FR-ACT-01`..`08`, `FR-REP-05` |
| **Streak & Động lực** | `src_assets_images_streak_streakactivebg.webp`, `streakinactivebg.webp`<br>`src_assets_images_streak_streakachievedart1..2.webp`<br>`src_assets_images_streak_freezestreakart1.webp`<br>`src_assets_images_congratulation.webp`, `course_artwork.webp` | ✅ **SỬ DỤNG** (Đồng bộ với token `vip-streak` `#F59E0B` / `#D97706`). | `StreakDetailModal`, `BadgeUnlockedModal`, `ChallengesScreen` | `FR-GAM-01`..`07` |
| **Hệ thống & Trạng thái** | `src_assets_images_account_communitybanner.webp`, `target.webp`<br>`src_assets_images_onboarding_maintenance.png`<br>`src_assets_images_forceupdateappthumbnail.webp`<br>`src_assets_images_emptystate.webp`, `searchnotfound.webp` | 🎨 **GIỮ & ĐỒNG BỘ MÀU TÍM** | `AccountProfileScreen`, `MaintenanceModal`, `ForceUpdateModal`, `EmptyStateView` | `FR-AUTH-08`, `FR-SYS-01`..`09` |

---

## 7. Tiêu chuẩn Hiệu năng, Truy cập (Accessibility) & Kiểm thử UI

### 7.1. Danh mục Kiểm tra Hiệu năng UI (`NFR-PERF-01..05`)
- **Khởi động ứng dụng $\le 3$ giây:** Preload4 trọng số font **Plus Jakarta Sans** và các icon chính trong lúc hiển thị `SplashScreen`; trì hoãn (lazy load) các màn hình nặng như Biểu đồ, Camera, Chatbot.
- **Danh sách mượt mà:** Sử dụng `@shopify/flash-list` thay cho `FlatList` truyền thống tại màn hình Tra cứu món ăn (`FoodSearchScreen`), Lịch sử hội thoại (`NutritionChatScreen`) và Bảng xếp hạng.
- **Tối ưu bộ nhớ ảnh:** Toàn bộ ảnh `.webp` được render qua `<AppImage />` (`expo-image`) với chính sách `cachePolicy="memory-disk"`.

### 7.2. Tiêu chuẩn Truy cập (Accessibility — `NFR-USAB` & `DESIGN.md`)
- **Độ tương phản đạt chuẩn WCAG AA ($\ge 4.5:1$):** Mọi nút có nhãn chữ bắt buộc dùng nền `brand-action` (`#8B57E8` Dark / `#7B4FE0` Light) với chữ trắng `#FFFFFF`; không dùng `brand-primary` (`#9E64F7`) làm nền dưới chữ trắng.
- **Không phụ thuộc đơn độc vào màu sắc:** Mọi thông báo cảnh báo (`status-warning`, `status-danger`) và trạng thái vượt $100\%$ Calo trên vòng tiến độ đều phải hiển thị kèm biểu tượng cảnh báo và văn bản mô tả rõ ràng.
- **Nhãn đọc màn hình & Vùng chạm:** Gắn đầy đủ `accessibilityLabel` và `accessibilityRole` bằng tiếng Việt cho các nút hành động chính (ví dụ: `"Chụp ảnh nhận diện món ăn"`, `"Thêm 250 ml nước"`, `"Lưu bữa ăn vào nhật ký"`); đảm bảo diện tích chạm tối thiểu đạt $44 \times 44\text{ pt}$ trên cả Android và iOS.

### 7.3. Kịch bản Kiểm thử Giao diện Tự động (E2E với Maestro / Detox)
1. **Flow 01 (Auth OTP, Onboarding & TDEE):** Đăng ký tài khoản mới bằng Email $\rightarrow$ Nhập mã OTP $6$ chữ số tại `EmailVerificationScreen` $\rightarrow$ Điền thông tin thể trạng $\rightarrow$ Kiểm tra màn kết quả hiển thị đúng BMI, TDEE, tỷ lệ **Chất đạm / Đường bột / Chất béo** và chuyển vào Dashboard.
2. **Flow 02 (AI Food Recognition):** Từ Dashboard bấm ô **Quét AI** trên `QuickUtilityDock` (hoặc nút nổi `+` $56 \times 56\text{ px}$) $\rightarrow$ Chọn ảnh mẫu món "Phở bò" $\rightarrow$ Kiểm tra hiển thị Bounding Box và Calo/Macro $\rightarrow$ Bấm Lưu ($\le 3$ chạm) $\rightarrow$ Kiểm tra vòng Calo phân đoạn trên Dashboard tăng đúng giá trị.
3. **Flow 03 (Hybrid Barcode Lookup):** Mở màn hình Quét mã vạch $\rightarrow$ Quét mã sản phẩm có sẵn (kiểm tra phản hồi $\le 1\text{ s}$), mã từ Open Food Facts (kiểm tra hiển thị nhãn nguồn `ODbL`) và mã chưa tồn tại (kiểm tra nút *"Tạo món từ mã vạch này"*).
4. **Flow 04 (Offline Sync):** Bật chế độ máy bay $\rightarrow$ Thêm $250\text{ ml}$ nước và $1$ bản ghi cân nặng $\rightarrow$ Kiểm tra hiển thị `OfflineBanner` $\rightarrow$ Tắt chế độ máy bay $\rightarrow$ Kiểm tra trạng thái đồng bộ hoàn tất và không nhân đôi bản ghi.