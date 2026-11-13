# Kế hoạch cập nhật icon sang Lucide React Native

> **Dự án:** `kallo-frontend` (package `kallo-mobile`) — nhánh nền `feat/ui-core`
> **Mục tiêu:** Thay hệ icon SVG tự vẽ trong `src/components/icons/AppIcons.tsx` bằng [`lucide-react-native`](https://lucide.dev/guide/packages/lucide-react-native), giữ lại các icon/illustration đặc thù thương hiệu.
> **Đề xuất vị trí file:** `docs/ICON_MIGRATION_PLAN.md`

---

## 1. Hiện trạng (đã khảo sát trên nhánh `feat/ui-core`)

| Hạng mục | Số liệu |
|---|---|
| Stack | Expo SDK 57, React Native 0.86.3, React 19.2.3, TypeScript strict, `react-native-svg` 15.15.4 |
| Thư viện icon bên thứ ba | **Chưa có** (không có `@expo/vector-icons`, `lucide`, ...) |
| File icon tập trung | `src/components/icons/AppIcons.tsx` — **1.750 dòng**, **72** `export function`, kèm alias (`HomeIcon = HomeTabIcon`, ...) |
| Cách import | `import { ... } from '@/components/icons'` (re-export qua `index.ts`) |
| Số file đang import icon | **70 file** (screens, modals, navigators, `components/common`) |
| Props hiện tại | `IconProps = { size?: number; color: string }` (+ `strokeWidth` ở `PlusIcon`/`CloseXIcon`/`SearchIcon`; prop màu phụ ở `WheatIcon`, `SaltIcon`, `FiberIcon`, `ScaleIcon`) |
| Icon dạng *fill* | Bốn icon tab bar (`HomeTabIcon`, `DiaryTabIcon`, `MealPlanTabIcon`, `ProfileTabIcon`) vẽ bằng `fill={color}` |
| SVG inline ngoài thư mục icons | ~29 file có `react-native-svg` (phần lớn là chart, background, mascot, logo social) |

### Mức dùng nhiều nhất

Số lần xuất hiện của tên icon (đã gồm dòng `import`) / số file:

| Icon | Lần / file | Icon | Lần / file |
|---|---|---|---|
| `ChevronLeftIcon` | 93 / 44 | `InfoIcon` | 16 / 7 |
| `CloseXIcon` | 34 / 18 | `BookIcon` | 12 / 6 |
| `ChevronRightIcon` | 34 / 12 | `TrophyIcon` | 10 / 5 |
| `FlameIcon` | 18 / 8 | `UserSingleIcon`, `SparklesIcon` | 9 / 4 |
| `PlusIcon` | 16 / 8 | `WheatIcon`, `LightningIcon`, `DropletIcon` | 8 / 4 |

→ Chỉ cần thay đúng nhóm *chevron / close / plus / info / flame* là đã phủ phần lớn call site.

### Export không còn được dùng (18)

`HomeIcon`, `DiaryIcon`, `MealPlanIcon`, `ProfileIcon`, `BookOpenIcon`, `KnowledgeBookIcon`, `BowlAddIcon`, `RecipeAddIcon`, `PartyPopperBadge`, `WaoShieldIcon` (đều là **alias**), cùng `CheckIcon`, `EmptyCupIcon`, `FullCupIcon`, `CloudAddIcon`, `BarcodeSquareIcon`, `RecipeBowlPlaceholderIcon`, `HealthConnectIcon`, `KalloShieldIcon`.
→ Xoá hoặc giữ tuỳ quyết định ở Phase 5 (xem lưu ý `HealthConnectIcon` / `KalloShieldIcon` là icon thương hiệu).

---

## 2. Điều kiện kỹ thuật (đã đối chiếu)

- Bản `lucide-react-native` mới nhất tại thời điểm khảo sát: **1.48.0**.
- `peerDependencies`: `react ^16.5.1 || … || ^19.0.0`, `react-native: *`, `react-native-svg ^12 || ^13 || ^14 || ^15`.
  → **Tương thích** với React 19.2.3 và `react-native-svg` 15.15.4 của dự án, không cần `--legacy-peer-deps`. (Các bản cũ ~0.50x từng lỗi `ERESOLVE` với React 19, nay đã khắc phục.)
- Props chính: `size` (mặc định 24), `color`, `strokeWidth` (mặc định 2), `nonScalingStroke`; các thuộc tính SVG khác (vd. `fill`) truyền thẳng được.
- Lucide là bộ icon **outline một màu**. Hệ quả:
  - Icon *fill* (tab bar) sẽ đổi phong cách nếu không xử lý.
  - Icon **hai tông màu** (`WheatIcon` + `creaseColor`, `SaltIcon` + `capColor`, `FiberIcon`, `ScaleIcon` + `innerColor`) mất phần màu phụ.

> ⚠️ **Chưa đối chiếu được:** danh sách tên icon trong bảng mapping (mục 4) lấy từ hiểu biết sẵn có, chưa tra từng tên trên catalog. Bước **0.2** bắt buộc kiểm tra lại trên <https://lucide.dev/icons> trước khi code. Các ô đánh dấu 🔶 là xấp xỉ, cần designer duyệt.

---

## 3. Chiến lược

**Giữ nguyên tên và props của API hiện tại (`@/components/icons`), chỉ đổi phần cài đặt bên trong.**

- 70 file call site gần như **không phải sửa** → diff nhỏ, dễ review, dễ rollback theo từng đợt.
- Tạo một lớp adapter duy nhất bọc component Lucide, ép đúng `IconProps { size, color, strokeWidth }`.
- Chia thành các *đợt (wave)* theo mức rủi ro thị giác; mỗi đợt một commit/PR.
- Icon thương hiệu, illustration, badge, mascot **không** chuyển sang Lucide.
- Đổi tên sang tên Lucide ở call site (nếu muốn) là bước **tuỳ chọn**, làm sau cùng.

Phân loại ký hiệu dùng trong mapping: ✅ thay trực tiếp · 🔶 xấp xỉ / cần duyệt thiết kế · ⛔ giữ custom.

---

## 4. Bảng mapping

> Cột "Dùng" = số lần / số file (xem mục 1).

### 4.1 Điều hướng & thao tác chung

| Icon hiện tại | Dùng | Lucide | Ghi chú |
|---|---|---|---|
| `ChevronLeftIcon` | 93 / 44 | `ChevronLeft` | ✅ |
| `ChevronRightIcon` | 34 / 12 | `ChevronRight` | ✅ |
| `ChevronDownIcon` | 4 / 2 | `ChevronDown` | ✅ |
| `ChevronUpIcon` | 2 / 1 | `ChevronUp` | ✅ |
| `CloseXIcon` | 34 / 18 | `X` | ✅ giữ `strokeWidth` 2.2–2.4 như call site |
| `PlusIcon` | 16 / 8 | `Plus` | ✅ call site dùng `strokeWidth` 2–2.6 |
| `CirclePlusIcon` | 2 / 1 | `CirclePlus` | ✅ |
| `CheckIcon` | 0 | `Check` | ✅ (đang không dùng) |
| `InfoIcon` | 16 / 7 | `Info` | ✅ |
| `MenuIcon` | 2 / 1 | `Menu` | ✅ |
| `SearchIcon`, `QuickSearchIcon` | 7 / 3, 4 / 2 | `Search` | ✅ gộp thành một nguồn |
| `SunIcon` / `MoonIcon` | 6 / 3 mỗi icon | `Sun` / `Moon` | ✅ |
| `CalendarIcon` | 7 / 4 | `Calendar` (hoặc `CalendarDays`) | ✅ |
| `FlagIcon` | 3 / 2 | `Flag` | ✅ |
| `GearSettingsIcon` | 3 / 1 | `Settings` | ✅ |
| `ShareNodesIcon` | 4 / 2 | `Share2` | ✅ |
| `ClipboardCopyIcon` | 2 / 1 | `ClipboardCopy` | ✅ |
| `LockClosedIcon` | 4 / 2 | `Lock` | ✅ |
| `MailInboxIcon` | 4 / 2 | `Mail` (hoặc `Inbox`) | ✅ chọn theo ngữ cảnh |
| `ShieldSecurityIcon` | 2 / 1 | `ShieldCheck` | ✅ |
| `UsersIcon` | 6 / 3 | `Users` | ✅ |
| `UserSingleIcon` | 9 / 4 | `User` | ✅ |
| `TrophyIcon` | 10 / 5 | `Trophy` | ✅ |
| `BookIcon` (+ alias) | 12 / 6 | `BookOpen` | ✅ |
| `FlameIcon` | 18 / 8 | `Flame` | ✅ |

### 4.2 Tab bar & hành động nhanh

| Icon hiện tại | Dùng | Lucide | Ghi chú |
|---|---|---|---|
| `HomeTabIcon` | 2 / 1 | `House` | 🔶 đang *fill* → xem quyết định D1 |
| `DiaryTabIcon` | 2 / 1 | `Utensils` | 🔶 hiện là thìa & dĩa |
| `MealPlanTabIcon` | 2 / 1 | `CalendarDays` hoặc `ClipboardList` | 🔶 designer chọn |
| `ProfileTabIcon` | 2 / 1 | `User` | 🔶 |
| `QuickBarcodeIcon`, `ViewfinderBarcodeIcon` | 7 / 3, 2 / 1 | `ScanBarcode` | ✅ |
| `QuickSparklesIcon`, `SparklesIcon` | 6 / 3, 9 / 4 | `Sparkles` | ✅ |
| `QuickVoiceIcon` | 6 / 3 | `Mic` | ✅ |
| `ScannerSparkleFlashIcon` | 4 / 2 | `Zap` / `ZapOff` hoặc `Flashlight` | 🔶 dùng làm nút bật/tắt flash máy quét |
| `GalleryAddIcon` | 6 / 2 | `ImagePlus` | ✅ |
| `AppleScanIcon` | 2 / 1 | `ScanSearch` hoặc ghép `Apple` + `ScanLine` | 🔶 |

### 4.3 Dinh dưỡng & macro

| Icon hiện tại | Dùng | Lucide | Ghi chú |
|---|---|---|---|
| `LightningIcon` (Protein) | 8 / 4 | `Zap` | ✅ |
| `LightningBoltIcon` | 2 / 1 | `Zap` | ✅ trùng nghĩa với `LightningIcon` → gộp |
| `DropletIcon` (Fat) | 8 / 4 | `Droplet` | ✅ |
| `WheatIcon` (Carbs) | 8 / 4 | `Wheat` | 🔶 mất `creaseColor` (1 call site truyền prop này) |
| `SugarIcon` | 4 / 2 | `Candy` | ✅ |
| `SaltIcon` | 4 / 2 | ⛔ giữ custom | Chưa thấy icon lọ muối phù hợp — tra lại ở bước 0.2; 2 call site truyền `capColor` |
| `FiberIcon` | 4 / 2 | ⛔ giữ custom (hoặc `Leaf`/`Sprout`) | Hiện là súp lơ hai tông màu |
| `ScaleIcon` | 3 / 2 | `Scale` hoặc `Weight` | 🔶 `Scale` của Lucide là cân thăng bằng, khác cân sức khoẻ |
| `CutleryIcon` | 2 / 1 | `Utensils` | ✅ |
| `WaterGlassPlusIcon` | 2 / 1 | `GlassWater` (+ badge `Plus` nếu cần) | 🔶 |
| `BowlFoodPlusIcon` | 6 / 3 | `Soup`/`CookingPot` + badge `Plus`, hoặc giữ custom | 🔶 |
| `RecipeBookPlusIcon` | 4 / 2 | `BookPlus` | 🔶 kiểm tra tên trên catalog |
| `SaladBowlIcon` | 1 / 1 | `Salad` hoặc giữ custom | 🔶 |
| `BodyStickFigureIcon` | 2 / 1 | `PersonStanding` | 🔶 |

### 4.4 Hoạt động thể chất

| Icon hiện tại | Dùng | Lucide | Ghi chú |
|---|---|---|---|
| `RunningIcon` | 6 / 3 | 🔶 tra catalog (`Footprints`/`PersonStanding`) | Nếu không có icon chạy bộ → giữ custom |
| `BicycleIcon` | 2 / 1 | `Bike` | ✅ |
| `ShuttlecockIcon`, `PickleballIcon`, `YogaIcon` | 2 / 1 mỗi icon | ⛔ giữ custom | Lucide không có icon môn này |
| `MoreActivitiesIcon` | 2 / 1 | `Ellipsis` / `LayoutList` | 🔶 |

### 4.5 Giữ nguyên (thương hiệu / minh hoạ / badge) — ⛔

`EmptyFolderIllustration` (7 / 2), `TimelineDiaryPhoneIllustration`, `CelebrationPopperBadge`, `MilestoneCalendarBadge`, `StreakGoalFlagIcon`\*, `CampfireFlameIcon`\*, `KalloShieldIcon`, `HealthConnectIcon` (màu thương hiệu Google), logo social trong `SocialLoginScreen`, các mascot (`ChampionMascotRNPro`, `KalloWelcome2Mascot`, `KalloWelcome3Mascot`).

\* Hai icon này có thể thay bằng `Flag`/`Flame` nếu designer đồng ý — mặc định giữ custom vì thuộc nhóm streak/gamification.

→ Chuyển nhóm này sang thư mục riêng (Phase 5) để `AppIcons.tsx` không còn là "bãi chung".

---

## 5. Các quyết định cần chốt (Phase 0)

| # | Câu hỏi | Gợi ý |
|---|---|---|
| **D1** | Tab bar: giữ trạng thái *fill* khi active hay chuyển hẳn sang outline? | Dùng prop `focused` của `tabBarIcon`: active → `fill={color}` hoặc tăng `strokeWidth`; inactive → outline. `docs/DESIGN.md` chỉ quy định màu active/inactive, không quy định kiểu nét. |
| **D2** | `strokeWidth` mặc định toàn app | 2 (mặc định Lucide) hay 1.75/2.2 cho hợp phong cách? Chốt một hằng `ICON_STROKE_DEFAULT` rồi mọi chỗ dùng chung. |
| **D3** | Icon macro hai tông màu (Wheat/Salt/Fiber) | Chấp nhận đơn sắc, hay giữ bản custom để giữ nhận diện macro? Gợi ý: giữ custom cho Salt/Fiber, dùng Lucide cho Wheat/Sugar/Droplet/Zap nhưng đồng bộ cách tô màu. |
| **D4** | Icon thể thao không có trong Lucide | Giữ custom và vẽ lại theo cùng grid 24×24, stroke tương đương để không lệch phong cách. |
| **D5** | Trạng thái cảnh báo | `docs/DESIGN.md` yêu cầu status luôn đi kèm icon (tam giác cảnh báo / vòng tròn cảnh báo) → thêm `TriangleAlert`, `CircleAlert`, `CircleCheck` vào lớp adapter. |

---

## 6. Các giai đoạn thực hiện

### Phase 0 — Chuẩn bị (0,5 ngày)

- [x] **0.1** Tạo nhánh làm việc từ `feat/ui-core`: `feat/lucide-icons`.
- [x] **0.2** Tra từng tên Lucide ở mục 4 trên <https://lucide.dev/icons> (tên có thể đã đổi, ví dụ `Home` → `House`, `AlertTriangle` → `TriangleAlert`). Cập nhật cột "Ghi chú" nếu khác.
- [x] **0.3** Chốt D1–D5 với designer.
- [x] **0.4** Chụp ảnh màn hình "trước" (light + dark, iOS + Android) cho các màn: Home, Food Diary, Food Search, Meal Scan, Barcode Scanner, Activity (Tracker/Workout/Add), Report, Gamification (Streak, Friends, Challenges), Health-profile wizard, Settings/Profile. Lưu vào thư mục ngoài repo hoặc `docs/` để đối chiếu.
- [x] **0.5** Chạy baseline: `npm run typecheck` và `npm run self-check` phải xanh trước khi sửa.

### Phase 1 — Cài đặt (0,25 ngày)

```bash
npm install lucide-react-native
npm ls lucide-react-native react-native-svg react
npx expo start -c      # xoá cache Metro sau khi thêm dependency
```

- [x] **1.1** Xác nhận `package.json` có `lucide-react-native` và **không** phát sinh cảnh báo peer dependency.
- [x] **1.2** Chạy thử một icon trên cả iOS và Android (Expo Go hoặc dev build) để chắc `react-native-svg` render đúng.
- [x] **1.3** Commit riêng: `chore(deps): add lucide-react-native`.

### Phase 2 — Lớp adapter (0,5 ngày)

Tạo `src/components/icons/lucide.tsx` và chuyển kiểu dùng chung ra `src/components/icons/types.ts`.

```tsx
// src/components/icons/types.ts
export type IconProps = {
  size?: number;
  color: string;        // giữ bắt buộc như hiện tại để không đổi hợp đồng API
  strokeWidth?: number; // mở rộng cho mọi icon
};

export const ICON_STROKE_DEFAULT = 2; // chốt theo D2
```

```tsx
// src/components/icons/lucide.tsx
import React from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  X, Plus, Search, Info, Flame, /* ... */
  type LucideIcon,
} from 'lucide-react-native';
import { ICON_STROKE_DEFAULT, type IconProps } from './types';

function fromLucide(Icon: LucideIcon, base?: { strokeWidth?: number }) {
  const Wrapped = ({ size = 24, color, strokeWidth }: IconProps) => (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth ?? base?.strokeWidth ?? ICON_STROKE_DEFAULT}
    />
  );
  Wrapped.displayName = `AppIcon(${Icon.displayName ?? 'Lucide'})`;
  return Wrapped;
}

export const ChevronLeftIcon = fromLucide(ChevronLeft);
export const ChevronRightIcon = fromLucide(ChevronRight);
export const CloseXIcon = fromLucide(X);
export const PlusIcon = fromLucide(Plus);
// ...
```

- [x] **2.1** Tạo `types.ts` + `lucide.tsx`; `AppIcons.tsx` import lại `IconProps` từ `types.ts` (không đổi hành vi).
- [x] **2.2** `index.ts` re-export cả hai nguồn: `export * from './lucide'; export * from './AppIcons';`. Khi một tên xuất hiện ở cả hai nơi sẽ báo trùng — **xoá tên đó khỏi `AppIcons.tsx` đúng lúc chuyển** (đây là cơ chế chống quên).
- [x] **2.3** Tab bar: icon nhận `focused` (xem D1). Sửa `MainTabNavigator.tsx` → `tabBarIcon: ({ color, focused }) => <HomeTabIcon color={color} focused={focused} />` nếu chọn giữ trạng thái fill.
- [x] **2.4** Nếu `LucideIcon`/`type` import không khớp phiên bản, sửa theo lỗi `tsc` (đây là chỗ cần verify thực tế).
- [x] **2.5** `npm run typecheck` xanh. Commit: `feat(icons): add Lucide adapter layer`.

### Phase 3 — Chuyển theo đợt

Mỗi đợt: (a) thêm export vào `lucide.tsx`, (b) **xoá** phiên bản cũ trong `AppIcons.tsx`, (c) `typecheck`, (d) chạy app kiểm tra các màn liên quan, (e) commit riêng.

**Wave 1 — Glyph chung, rủi ro thấp (~1 ngày)**
`ChevronLeft/Right/Down/Up`, `CloseX`, `Plus`, `CirclePlus`, `Check`, `Info`, `Menu`, `Search`/`QuickSearch`, `Sun`, `Moon`, `Calendar`, `Flag`.
- [x] Soát các call site truyền `strokeWidth` (CloseX 2.2–2.4, Plus 2–2.6, Search 2.2–2.4) và nút `+` giữa tab bar 56×56 (glyph `#FFFFFF`).
- [x] Soát kích thước nhỏ (`size` 14–16) vì nét Lucide có thể bị "nặng" hơn bản cũ.

**Wave 2 — Tab bar, hành động nhanh, tài khoản (~1 ngày)**
`HomeTab`, `DiaryTab`, `MealPlanTab`, `ProfileTab`, `QuickBarcode`, `ViewfinderBarcode`, `QuickSparkles`, `Sparkles`, `QuickVoice`, `ScannerSparkleFlash`, `GalleryAdd`, `AppleScan`, `GearSettings`, `MailInbox`, `LockClosed`, `ShieldSecurity`, `ClipboardCopy`, `ShareNodes`, `Users`, `UserSingle`, `Trophy`, `Book`, `Flame`.
- [x] Áp dụng quyết định D1 cho tab bar; kiểm tra trạng thái active/inactive ở cả light/dark.
- [x] Màn quét (`AIMealScanScreen`, `BarcodeScannerScreen`): icon nằm trên nền camera → kiểm tra độ tương phản.

**Wave 3 — Dinh dưỡng & macro (~1 ngày)**
`LightningIcon` + `LightningBoltIcon` (gộp), `Droplet`, `Wheat`, `Sugar`, `Scale`, `Cutlery`, `WaterGlassPlus`, `BowlFoodPlus`, `RecipeBookPlus`, `SaladBowl`, `BodyStickFigure`.
- [x] Giữ nguyên `SaltIcon`, `FiberIcon` (D3) nhưng chuyển sang dùng chung type `IconProps`.
- [x] Xử lý prop màu phụ còn sót: `WheatIcon creaseColor`, `ScaleIcon innerColor` → bỏ prop ở call site hoặc để adapter bỏ qua có chủ đích (không để prop "chết" trong typecheck).
- [x] Đối chiếu màu macro (`macroCarbs`, `macroSalt`, ...) trong `src/theme/colors.ts` ở cả hai theme.
- [x] Các màn: `HomeWidgets`, `FoodDiaryWidgets`, `FoodSearchWidgets`, 9 `*GuideModal`, `DayMacroSection`.

**Wave 4 — Hoạt động thể chất (~0,5 ngày)**
`Bicycle` → `Bike`; `Running`, `MoreActivities` theo kết quả tra catalog; `Shuttlecock`/`Pickleball`/`Yoga` giữ custom (D4).
- [x] Các màn: `ActivityRowItem`, `AddActivityScreen`, các `*WorkoutScreen`, `WorkoutStatisticsScreen`.

### Phase 4 — Rà soát SVG inline ngoài thư mục icons (0,5 ngày)

Một số file có nhiều `<Path>` có thể chứa icon vẽ tay (không phải chart/mascot):
`NutritionistNoteModal` (10), `HealthConditionsSelectionScreen` (8), `GoalSelectionScreen` (7), `StepDetailScreen` (5), `ActivityLevelSelectionScreen` (4), `CalculatingPlanScreen` (3), `PlanResultScreen`, `GenderSelectionScreen`, `AnimatedCheckbox`, `RecordWeightScreen`, `HealthSyncScreen`.

- [x] Với mỗi file: phân loại **icon** (chuyển sang Lucide qua adapter) hay **minh hoạ/chart/background** (giữ).
- [x] `SocialLoginScreen` (logo Apple/Facebook/...) và `AnimatedCheckbox` → thường giữ nguyên.
- [x] Soát emoji dùng làm icon trong `Text` (nếu có) và đưa vào danh sách nếu cần đồng bộ.
- [x] Gợi ý lệnh: `grep -rn "<Path" src --include=*.tsx | grep -v components/icons`.

### Phase 5 — Dọn dẹp & tái cấu trúc (0,5 ngày)

- [x] Xoá các alias/export không dùng (mục 1) — **trừ** `HealthConnectIcon`, `KalloShieldIcon` nếu muốn giữ cho tính năng sắp tới.
- [x] Tách phần còn lại của `AppIcons.tsx` thành cấu trúc rõ ràng:

```
src/components/icons/
├── index.ts            # re-export công khai
├── types.ts            # IconProps, ICON_STROKE_DEFAULT
├── lucide.tsx          # adapter + export từ Lucide
├── custom/             # SaltIcon, FiberIcon, ShuttlecockIcon, PickleballIcon, YogaIcon, ...
└── illustrations/      # EmptyFolderIllustration, badges, KalloShieldIcon, ...
```

- [x] Kiểm tra `react-native-svg` vẫn là dependency trực tiếp (mascot/chart/icon custom vẫn dùng).
- [x] Tuỳ chọn: đổi tên sang tên Lucide trực tiếp ở call site (`ChevronLeftIcon` → `ChevronLeft`) — chỉ làm nếu team muốn bỏ lớp adapter; không khuyến nghị cho đợt này.

### Phase 6 — Kiểm thử & nghiệm thu (0,5–1 ngày)

- [x] `npm run typecheck` (strict) — không lỗi.
- [x] `npm run self-check` (phase 1–7) — xanh. Lưu ý `scripts/phase5-self-check.js` có nhắc tên asset dạng `healthConnectIcon`, `appleHealthIcon`, `trackerSyncIcon`, `reportLampIcon` (ảnh trong `assets/images`, **không** phải icon SVG → không bị ảnh hưởng, nhưng vẫn chạy để chắc).
- [x] Đối chiếu ảnh "trước/sau" cho danh sách màn ở bước 0.4, cả light/dark, iOS/Android.
- [x] Kiểm tra: kích thước 14/16/20/24/32, trạng thái disabled, icon trên nền gradient/camera, icon trong nút tròn và chip.
- [x] Đo nhanh thời gian khởi động & bundle (Metro). Toàn bộ import Lucide tập trung ở một file nên dễ đo/tối ưu nếu thấy chậm.
- [x] Soát `accessibilityLabel` cho nút chỉ có icon (close, back, add…) — không phụ thuộc thư viện nhưng nên rà trong đợt này.

### Phase 7 — Tài liệu & quy ước (0,25 ngày)

- [x] Thêm mục **Iconography** vào `docs/DESIGN.md`: dùng Lucide qua `@/components/icons`, stroke mặc định, kích thước chuẩn, màu theo token (`brand-primary`, `text-secondary`…), trạng thái cảnh báo luôn có icon (D5).
- [x] Cập nhật `CLAUDE.md` (mục Architecture) và `README.md`: *"Icon mới: thêm vào `src/components/icons/lucide.tsx`; không vẽ SVG inline cho icon đơn giản."*
- [x] Tuỳ chọn: thêm `scripts/phase8-self-check.js` kiểm tra (1) `lucide-react-native` có trong `package.json`, (2) mọi tên export công khai trước đây vẫn còn export, (3) không có export bị khai báo trùng giữa `lucide.tsx` và `custom/`.

---

## 7. Rủi ro & cách giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Đổi phong cách tab bar (fill → outline) | Cao | Chốt D1 sớm; thử trên thiết bị thật. |
| Mất màu phụ ở icon macro | Trung bình | D3; giữ custom cho `Salt`/`Fiber`. |
| Tên icon Lucide thay đổi giữa các bản | Thấp | Bước 0.2; ghim version trong `package-lock.json`; `tsc` bắt lỗi import sai. |
| Nét "nặng/nhẹ" khác bản cũ ở cỡ nhỏ | Trung bình | Chốt `ICON_STROKE_DEFAULT`; soát size 14–16 ở Wave 1. |
| Quên xoá bản cũ → hai nguồn song song | Trung bình | Cơ chế trùng tên khi `export *` (bước 2.2); script phase 8. |
| Metro chậm do barrel import của Lucide | Thấp | Chỉ import tại `lucide.tsx`; đo ở Phase 6. |
| Sót icon vẽ tay ngoài thư mục icons | Trung bình | Phase 4 + lệnh `grep` ở trên. |

**Rollback:** mỗi wave một commit; nếu lỗi, `git revert` commit tương ứng — API công khai không đổi nên không ảnh hưởng wave khác.

---

## 8. Tiêu chí hoàn thành (Definition of Done)

- [x] `lucide-react-native` được cài, không cảnh báo peer dependency.
- [x] Mọi icon "chung" (mục 4.1–4.4 đánh dấu ✅/🔶 đã duyệt) đi qua `lucide.tsx`.
- [x] Icon thương hiệu/minh hoạ nằm trong `custom/` hoặc `illustrations/`; `AppIcons.tsx` không còn (hoặc chỉ còn re-export).
- [x] Không còn export icon không dùng (trừ các icon thương hiệu được giữ có chủ đích).
- [x] `npm run typecheck` và `npm run self-check` xanh.
- [x] Đã duyệt thiết kế trên iOS + Android, light + dark.
- [x] `docs/DESIGN.md`, `CLAUDE.md`, `README.md` đã cập nhật.

---

## 9. Ước lượng

| Phase | Công sức |
|---|---|
| 0 Chuẩn bị | 0,5 ngày |
| 1 Cài đặt | 0,25 ngày |
| 2 Adapter | 0,5 ngày |
| 3 Wave 1–4 | ~3,5 ngày |
| 4 SVG inline | 0,5 ngày |
| 5 Dọn dẹp | 0,5 ngày |
| 6 QA | 0,5–1 ngày |
| 7 Tài liệu | 0,25 ngày |
| **Tổng** | **~6–7 ngày công** (chưa gồm thời gian chờ duyệt thiết kế) |

---

## Phụ lục A — Lệnh hữu ích

```bash
# Số file đang import icon
grep -rln "components/icons" src App.tsx | wc -l

# Nơi dùng một icon cụ thể
grep -rn "ChevronLeftIcon" src --include=*.tsx | grep -v components/icons

# SVG vẽ tay ngoài thư mục icons
grep -rn "<Path" src --include=*.tsx | grep -v components/icons

# Kiểm tra peer dependency sau khi cài
npm ls lucide-react-native react-native-svg react
```

## Phụ lục B — Nguồn tham khảo

- [Lucide React Native — tổng quan](https://lucide.dev/guide/packages/lucide-react-native)
- [Lucide React Native — Getting started](https://lucide.dev/guide/react-native/getting-started)
- [Catalog icon Lucide](https://lucide.dev/icons)
- [Issue #3185 — lỗi peer dependency React 19 (đã khắc phục)](https://github.com/lucide-icons/lucide/issues/3185)
- `peerDependencies` của `lucide-react-native@1.48.0` (qua [jsDelivr](https://cdn.jsdelivr.net/npm/lucide-react-native@latest/package.json))
