---
name: Nocturne & Daylight Vitality
# Single source of truth for color: `semantic-tokens` below.
# The old Material block (`colors` / `colors-light`) and the earlier hex values in the prose were removed
# because they contradicted this set. If a Material export is needed, regenerate it from `brand-primary`.
semantic-tokens:
  dark:
    canvas-base: '#0D0B14'
    surface-mid: '#181524'
    surface-high: '#221D34'
    surface-border: '#322B48'
    brand-primary: '#9E64F7'
    brand-action: '#8B57E8'
    brand-secondary: '#B488FC'
    brand-soft-tint: 'rgba(158, 100, 247, 0.15)'
    macro-protein: '#FF6B6B'
    macro-protein-strong: '#FF5252'
    macro-carbs: '#3B82F6'
    macro-fats: '#FBBF24'
    macro-fats-strong: '#EAB308'
    quick-scanner: '#22C55E'
    vip-streak: '#F59E0B'
    tracker-water: '#22D3EE'
    status-warning: '#FB923C'
    status-danger: '#FF5A5F'
    progress-track: '#221D34'
    tab-bar: 'rgba(20, 17, 30, 0.90)'
    overlay: 'rgba(13, 11, 20, 0.75)'
    glow: 'rgba(158, 100, 247, 0.28)'
    glow-strong: 'rgba(158, 100, 247, 0.40)'
    on-brand: '#FFFFFF'
    on-quick-tile: '#0D0B14'
    text-primary: '#FFFFFF'
    text-secondary: '#9E9AA7'
    text-disabled: '#5E5970'
  light:
    canvas-base: '#F8F7FC'
    surface-mid: '#FFFFFF'
    surface-high: '#F1EFF9'
    surface-border: '#E4E0F0'
    brand-primary: '#7B4FE0'
    brand-action: '#7B4FE0'
    brand-secondary: '#9163EA'
    brand-soft-tint: '#EDE5FF'
    macro-protein: '#EF4444'
    macro-protein-strong: '#DC2626'
    macro-carbs: '#2563EB'
    macro-fats: '#D97706'
    macro-fats-strong: '#EAB308'
    quick-scanner: '#16A34A'
    vip-streak: '#D97706'
    tracker-water: '#0891B2'
    status-warning: '#C2410C'
    status-danger: '#D92D20'
    progress-track: '#ECE9F6'
    tab-bar: 'rgba(255, 255, 255, 0.92)'
    overlay: 'rgba(19, 18, 27, 0.45)'
    glow: 'rgba(123, 79, 224, 0.24)'
    glow-strong: 'rgba(123, 79, 224, 0.35)'
    on-brand: '#FFFFFF'
    on-quick-tile: '#13121B'
    text-primary: '#13121B'
    text-secondary: '#645F77'
    text-disabled: '#A6A1B8'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.4px
  data-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 48px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

The design system establishes a high-performance, dual-theme (**Dark & Light Mode**) nutrition tracking experience tailored for mobile devices (React Native on iOS and Android). Drawing inspiration from sleek midnight interfaces and crisp daylight health trackers, the personality balances disciplined analytical tracking with energetic, approachable wellness guidance.

### Visual Style
- **Aesthetic Direction:**
  - **Dark Mode (Nocturne Vitality):** Elevated Dark Minimal with Luminous Accents and Soft Tactility.
  - **Light Mode (Daylight Vitality):** Crisp Alabaster Minimal with High-Contrast Violet Anchors and Airy Depth.
- **Atmosphere:**
  - **Dark Mode:** Deep indigo-black foundations (`#0D0B14`) paired with glowing violet anchors (`#9E64F7`) and high-energy metabolic macro signals (protein flame coral, carb cobalt, fat honey gold, streak amber).
  - **Light Mode:** Soft lavender-tinted alabaster backdrops (`#F8F7FC`) paired with pure white cards (`#FFFFFF`), deep violet accents (`#7B4FE0`), and daylight-calibrated macro indicators for effortless outdoor legibility.
- **Hue consistency:** Dark and Light primaries sit at the same violet hue family (about 265–270°) so both themes read as one brand. Green is reserved for AI scanning and success states and is never the brand color.
- **Emotional Intent:** Empowerment, clarity, and daily commitment without cognitive overwhelm or clinical austerity. Data cards recede gracefully into backdrops while functional CTAs and metric gauges surface with radiant focus across both lighting environments.

---

## Colors

The palette is engineered around adaptive depth layers: dark-tier luminance tiers for effortless night readability and OLED battery efficiency, paired with a high-contrast daylight palette that avoids harsh sterile whites. All values below are defined once in `semantic-tokens` in the front-matter; this section explains their roles.

### Palette Architecture

#### 1. Canvas & Backgrounds
- **Base Canvas (`canvas-base`):** Dark `#0D0B14` / Light `#F8F7FC`. Primary application backdrop and navigation shell.
- **Surface Mid (`surface-mid`, Level 1 containers):** Dark `#181524` / Light `#FFFFFF`. Dashboard cards, grouped metric panels, meal groups, modals, bottom sheets.
- **Surface High (`surface-high`, Level 2 elevated / wells):** Dark `#221D34` / Light `#F1EFF9`. Nested list items, input wells, secondary pill buttons, floating cards.
- **Surface Border (`surface-border`):** Dark `#322B48` / Light `#E4E0F0`. Ultra-subtle 1px boundary for cards and dividers.
- **Progress Track (`progress-track`):** Dark `#221D34` / Light `#ECE9F6`. Unfilled part of every progress bar.

#### 2. Brand Accents
- **Brand Primary (`brand-primary`):** Dark `#9E64F7` / Light `#7B4FE0`. Calorie ring highlight, icon-only buttons (the floating `+`), active icons, glows, selected states.
- **Brand Action (`brand-action`):** Dark `#8B57E8` / Light `#7B4FE0`. Background of any button that carries a **text label**, and the splash background. White text on it reaches about 4.5:1 (Dark) and 5.2:1 (Light), meeting WCAG AA. `brand-primary` (Dark) with white text is only about 3.7:1, so it must not be used behind labels.
- **Brand Secondary (`brand-secondary`):** Dark `#B488FC` / Light `#9163EA`. Active tab label, secondary highlights, selected day pill accents, gradients.
- **Brand Soft Tint (`brand-soft-tint`):** Dark `rgba(158, 100, 247, 0.15)` / Light `#EDE5FF`. Selected chips, active icon containers, subtle highlight banners.

#### 3. Metabolic & Macro Semantic System
Macro colors are used consistently on bars, rings, charts, and tags across the whole app. Vietnamese labels are the default in the UI.
- **Protein (Chất đạm):** Dark `#FF6B6B` / `#FF5252` (strong) — Light `#EF4444` / `#DC2626` (strong).
- **Carbohydrates (Đường bột):** Dark `#3B82F6` — Light `#2563EB`.
- **Fats & Lipids (Chất béo):** Dark `#FBBF24` / `#EAB308` (strong) — Light `#D97706` / `#EAB308` (strong).
- **Quick Action / Scanner / Success (`quick-scanner`):** Dark `#22C55E` — Light `#16A34A`. AI dish scanning, successful logging, positive calorie feedback.
- **VIP / Streak (`vip-streak`):** Dark `#F59E0B` — Light `#D97706`. Streak badges, promo banners, premium upgrades.
- **Water (`tracker-water`):** Dark `#22D3EE` — Light `#0891B2`. Water tracker card and hydration progress.

#### 4. Status
- **Warning (`status-warning`):** Dark `#FB923C` — Light `#C2410C`. Near-limit calorie notice, mild allergy notice, unsafe weight-loss rate box.
- **Danger (`status-danger`):** Dark `#FF5A5F` — Light `#D92D20`. Calories over 100% of goal, allergen detected in a food.
- **Rule:** Status colors sit close to the protein coral, so a status message must never rely on color alone. Always pair it with an icon (warning triangle / alert circle) and explicit text.

#### 5. Text & Foreground
- **Text Primary:** Dark `#FFFFFF` / Light `#13121B`. Titles, calorie numbers, primary values.
- **Text Secondary:** Dark `#9E9AA7` / Light `#645F77`. Units, subtitles, inactive states, descriptions. Solid colors (not alpha) so contrast is predictable: about 6.5:1 on Dark `surface-mid`.
- **Text Disabled:** Dark `#5E5970` / Light `#A6A1B8`. Inactive fields and placeholders.
- **On Brand (`on-brand`):** `#FFFFFF` on `brand-action` and `brand-primary` fills.
- **On Quick Tile (`on-quick-tile`):** Dark `#0D0B14` / Light `#13121B` for glyphs on the saturated Quick Utility tiles.

### Theme Token Reference Table

| Semantic Role | Token Key | Dark Mode (Nocturne) | Light Mode (Daylight) |
| :--- | :--- | :--- | :--- |
| **Base Canvas** | `canvas-base` | `#0D0B14` | `#F8F7FC` |
| **Primary Card Surface** | `surface-mid` | `#181524` | `#FFFFFF` |
| **Nested / Elevated Surface** | `surface-high` | `#221D34` | `#F1EFF9` |
| **Subtle Border / Divider** | `surface-border` | `#322B48` | `#E4E0F0` |
| **Progress Track** | `progress-track` | `#221D34` | `#ECE9F6` |
| **Primary Brand Accent** | `brand-primary` | `#9E64F7` | `#7B4FE0` |
| **Button Fill (with label)** | `brand-action` | `#8B57E8` | `#7B4FE0` |
| **Secondary Brand Accent** | `brand-secondary` | `#B488FC` | `#9163EA` |
| **Brand Soft Wash** | `brand-soft-tint` | `rgba(158, 100, 247, 0.15)` | `#EDE5FF` |
| **Protein Accent** | `macro-protein` | `#FF6B6B` | `#EF4444` |
| **Carbohydrate Accent** | `macro-carbs` | `#3B82F6` | `#2563EB` |
| **Fats Accent** | `macro-fats` | `#FBBF24` | `#D97706` |
| **AI Scanner / Success** | `quick-scanner` | `#22C55E` | `#16A34A` |
| **Streak / VIP Gold** | `vip-streak` | `#F59E0B` | `#D97706` |
| **Water** | `tracker-water` | `#22D3EE` | `#0891B2` |
| **Warning** | `status-warning` | `#FB923C` | `#C2410C` |
| **Danger** | `status-danger` | `#FF5A5F` | `#D92D20` |
| **Primary Text** | `text-primary` | `#FFFFFF` | `#13121B` |
| **Secondary Text** | `text-secondary` | `#9E9AA7` | `#645F77` |
| **Disabled Text** | `text-disabled` | `#5E5970` | `#A6A1B8` |

---

## Typography

The typography scale utilizes **Plus Jakarta Sans** across all levels in both Dark and Light modes to maintain exceptional clarity on high-DPI smartphone displays, crisp Vietnamese diacritical legibility, and geometric warmth in numerical readouts. Numeric readouts use tabular figures (`fontVariant: ['tabular-nums']`).

### Usage Hierarchy
- **Metric Big Numbers (`data-display` — 44px / 48px / 800):** Used strictly for core calorie counts inside the circular progress dial and dashboard headers. Uses `text-primary`.
- **Screen Titles (`headline-xl` — 36px, `headline-xl-mobile` — 30px / 800):** Primary onboarding headers, goal achievement summaries, and top-level tab titles.
- **Modal & Report Headers (`headline-lg` — 26px / 700):** Deep analytics views and nutrition breakdown drawers.
- **Section Headers (`headline-md` — 20px / 700, `headline-sm` — 17px / 600):** Meal groupings (Bữa sáng, Bữa trưa, Bữa tối, Ăn vặt), food log dish titles, and dashboard summaries.
- **Body & Captions (`body-lg` — 16px, `body-md` — 14px, `body-sm` — 12px / 400):** Calorie breakdowns, Vietnamese dish ingredients, AI nutrition advice, and serving estimates.
- **Labels & Micro-data (`label-lg` — 14px, `label-md` — 12px, `label-sm` — 10px / 600):** Primary button text, day chips (`T2` - `CN`), macro tags (`g đạm`, `carb`, `béo`), and bottom tab bar titles.

---

## Layout & Spacing

Designed specifically for mobile viewport ergonomics with native safe-area compliance (iOS Home Indicator and Android gesture bars).

### Grid and Rhythm
- **Canvas Margins:** Fixed `1.25rem` (`20px`) horizontal screen padding on phones to preserve thumb-friendly targets while maximizing screen real estate for cards.
- **Gutters:** Standard `1rem` (`16px`) separation between sibling multi-column card tiles (such as macro split progress bars or quick-entry action grids).
- **Component Padding:**
  - Card interiors leverage `space-lg` (`20px`) on large stat blocks and `space-md` (`16px`) on compact meal items.
  - Tap targets adhere strictly to the `44x44pt` minimum touch area.
- **Reflow & Breakpoints:**
  - **Mobile Portrait (`< 600px`):** Primary single-column vertical stack with 4-button quick utility dock above the tab bar. This is the only layout in scope for the first release.
  - **Large Viewports / Tablets (`>= 600px`) — optional, post-MVP:** Two-column modular dashboard placing calorie ring left and macro breakdown / meals right.

---

## Elevation & Depth

Visual hierarchy adapts its physical model based on the active theme: **Dark Mode** relies on progressive surface luminance and ambient colored glows, whereas **Light Mode** utilizes crisp white surface layering over an alabaster canvas paired with soft, tinted drop shadows. Colored glows and shadows are unreliable on Android (`elevation` is gray), so they are drawn with Skia or SVG blur rather than platform shadow props.

### Hierarchy Rules — Dark Mode (Nocturne)
- **Base Canvas (`#0D0B14`):** The foundational substrate behind all content.
- **Level 1 Containers (`#181524`):** Outer meal category groups and calorie summary wrapper. Surrounded by a `1px` soft border in `#322B48`.
- **Level 2 Floating Cards (`#221D34`):** Selected items, dialog drawers, nested list rows, and quick-add toolbars.
- **Radiant Glows:** Active indicators (e.g., today's active date pill, active macro progress rings) employ a tinted ambient glow: `0px 8px 24px rgba(158, 100, 247, 0.28)`.
- **Modals and Overlays:** 75% frosted overlay (`rgba(13, 11, 20, 0.75)`) with a `20px` Gaussian backdrop blur for dish details, camera scanning screens, and bottom sheets.

### Hierarchy Rules — Light Mode (Daylight)
- **Base Canvas (`#F8F7FC`):** Cool alabaster substrate that provides gentle contrast against white cards.
- **Level 1 Containers (`#FFFFFF`):** Primary meal category groups and calorie summary wrapper. Surrounded by a `1px` border in `#E4E0F0` and a subtle ambient shadow: `0px 4px 16px rgba(19, 18, 27, 0.04)`.
- **Level 2 Floating Cards & Nested Wells:**
  - **Floating Popovers / Toasts (`#FFFFFF`):** Elevated with a diffused violet-tinted shadow: `0px 8px 24px rgba(123, 79, 224, 0.08)` and `1px` border `#E4E0F0`.
  - **Recessed / Nested Wells (`#F1EFF9`):** Used for inner food items, input fields, and macro slider tracks inside a white Level 1 card.
- **Active Accent Shadows:** Active indicators (e.g., selected date pill, primary CTAs) cast a crisp brand shadow: `0px 6px 20px rgba(123, 79, 224, 0.24)`.
- **Modals and Overlays:** 45% translucent ink backdrop (`rgba(19, 18, 27, 0.45)`) with a `20px` Gaussian backdrop blur.

---

## Shapes

The interface embraces organic, smooth curvatures aligned with standard iOS squircle and contemporary Material 3 geometries across both themes.

### Shape Tokens
- **Standard Cards & Modals:** `rounded-lg` (`16px` / `1rem`) for all meal container cards, macro statistic panels, and quick utility blocks.
- **Buttons & Chips:** `rounded-xl` (`24px` / `1.5rem`) or fully rounded pill geometry (`9999px`) for date-selector tabs, pill buttons ("Bắt đầu ngay", "Xem báo cáo"), and floating circular action buttons.
- **Progress Trackers:** Fully rounded capsules (`height: 8px`, `border-radius: 9999px`) for macro percentage progress fills.

---

## Components

### Buttons & CTAs
- **Primary Action:**
  - Fill `brand-action` (Dark `#8B57E8`, Light `#7B4FE0`), text `on-brand` `#FFFFFF`. An optional gradient may run from `brand-action` to a slightly deeper tone (Dark `#7A4AD8`, Light `#6A42C8`), never toward a lighter tone, so label contrast never drops below 4.5:1.
  - Light Mode shadow: `0px 6px 16px rgba(123, 79, 224, 0.25)`.
  - **Dimensions & Interaction:** `label-lg`, center-aligned, height `52px` for primary screen CTAs, pill-rounded (`9999px`). Pressed state scales opacity down to `0.85` and micro-scales to `0.98`.
  - Loading and disabled states reuse the same shape; disabled uses `surface-high` fill with `text-disabled` text.
- **Secondary Pill Button:**
  - Fill `surface-high`, text `text-primary`, border `1px` `surface-border`, height `36px`.
- **Floating Main Log Button (`+`):**
  - High-elevation `56x56px` circular button anchored in the center of the bottom tab bar. It holds an icon only, so it uses `brand-primary` (Dark `#9E64F7`, Light `#7B4FE0`) with a `#FFFFFF` glyph.
  - Glow: Dark `0px 8px 24px rgba(158, 100, 247, 0.40)`; Light `0px 8px 20px rgba(123, 79, 224, 0.35)`.

### Calorie Ring (Dashboard)
- Circular dial with a `data-display` calorie-remaining number centered, a small flame icon above it, and the unit label (`kcal`) below.
- The ring is **segmented by macro color** (`macro-protein`, `macro-carbs`, `macro-fats`), each arc length proportional to that macro's share of calories consumed. The unfilled remainder uses `progress-track`. When the user has logged nothing, the whole ring shows `progress-track` with a `brand-primary` flame.
- Stroke `12px`, round caps, animated at 60fps with Reanimated. When calories exceed 100% of goal, show a `status-danger` outer indicator **plus** an alert icon and text label.

### Quick Utility Tiles (Search, Barcode, AI Magic, Voice)
- 4-column balanced grid dock (`16px` gutter) above the tab bar.
- Each button features a square-rounded shape (`16px` radius / `rounded-lg`) with theme-calibrated backgrounds. Glyph color is `on-quick-tile` in Dark; in Light, tinted tiles use the listed glyph color.
  - **Search (Tìm kiếm):**
    - **Dark Mode:** Golden Amber (`#FBBF24`) background.
    - **Light Mode:** Soft Amber tint (`#FEF3C7`) with `1px` border `#FDE68A` and `#D97706` glyph.
  - **Barcode (Mã vạch):**
    - **Dark Mode:** Sky (`#38BDF8`) background.
    - **Light Mode:** Soft Sky tint (`#E0F2FE`) with `1px` border `#BAE6FD` and `#0284C7` glyph.
  - **AI Scanner (Quét AI):**
    - **Dark Mode:** Fresh Leaf Green (`#22C55E`) background.
    - **Light Mode:** Soft Emerald tint (`#DCFCE7`) with `1px` border `#BBF7D0` and `#16A34A` glyph.
  - **Voice Mic (Giọng nói):**
    - **Dark Mode:** Coral Salmon (`#FB7185`) background.
    - **Light Mode:** Soft Rose tint (`#FFE4E6`) with `1px` border `#FECDD3` and `#E11D48` glyph.

### Date Selector Strip
- Horizontal scrollable row displaying days of the week (`T2` through `CN`).
- **Default State:** Transparent background, `text-secondary` text.
- **Selected Day:** Concentric circle or pill highlight filled with `brand-action`, glowing outer ring (`glow`), and bold `#FFFFFF` text. Light Mode adds a soft drop shadow `0px 4px 12px rgba(123, 79, 224, 0.25)`.

### Macro Progress Sliders
- Grouped card housing 3 parallel columns: **Chất đạm (Protein)**, **Đường bột (Carb)**, and **Chất béo (Fat)**.
- **Card Wrapper:** `surface-mid` background with `1px` `surface-border`; Light Mode adds the Level 1 shadow.
- **Progress Track:** `progress-track`, `8px` height, rounded ends (`9999px`).
- **Fill & Readout:** Fill uses the macro tint (`macro-protein`, `macro-carbs`, `macro-fats`). Current/target grams sit below in high-contrast bold typography (`0 / 98g`) using `text-primary`.

### Food Log List Items
- **Container:** `surface-high` background with `1px` `surface-border` when nested inside a Level 1 meal card. When placed directly on the canvas, use `surface-mid` with the same border.
- **Content Layout:** Displays `48x48px` rounded food thumbnail (`rounded-md`), dish name in `headline-sm` (`text-primary`), portion size in `body-sm` (`text-secondary`), and calories on the right in `label-lg`, with smooth tap highlight transition to edit serving.

### Status Banners (Warning / Danger)
- Full-width card, `rounded-lg`, left icon, bold title, `body-md` message.
- Fill is the status color at 15% alpha over `surface-mid`, border `1px` in the status color, icon and title in the status color. Body text stays `text-primary`.
- Used for: allergen detected (danger), calories over 100% of goal (danger), unsafe weight-loss rate or calorie target below BMR (warning), offline notice (warning).

### Bottom Navigation Bar
- **Bar Container:** `tab-bar` color (Dark 90% opacity with backdrop blur; Light 92% opacity with backdrop blur) and `1px` top border `surface-border`. Light Mode adds an upward shadow `0px -4px 16px rgba(19, 18, 27, 0.04)`.
- **Tab Items:**
  - **Active Tab:** Icon and `label-sm` text in `brand-secondary` (Dark `#B488FC`) or `brand-primary` (Light `#7B4FE0`).
  - **Inactive Tab:** Icon and `label-sm` text in `text-secondary`.

### Splash & Brand Mark
- Splash background is `brand-action` (Dark `#8B57E8`; Light uses the same Dark value so the launch screen is identical in both themes) with a white Kallo wordmark centered. The wordmark, mascot, and illustrations must be original Kallo assets, not assets taken from any reference app.
