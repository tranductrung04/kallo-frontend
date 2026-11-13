import React from 'react';
import {
  AlertTriangle,
  Bike,
  BookOpen,
  Calendar,
  Candy,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  ClipboardCopy,
  ClipboardList,
  Droplet,
  Flag,
  Flame,
  GlassWater,
  House,
  ImagePlus,
  Info,
  Lock,
  Mail,
  Menu,
  Mic,
  Moon,
  PersonStanding,
  Plus,
  ScanBarcode,
  ScanSearch,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  TriangleAlert,
  Trophy,
  User,
  Users,
  Utensils,
  Wheat,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { ICON_STROKE_DEFAULT, type CirclePlusIconProps, type IconProps } from './types';

export interface LucideAdapterOptions {
  strokeWidth?: number;
  defaultSize?: number;
  defaultColor?: string;
  fillOnFocused?: boolean;
  activeStrokeWidth?: number;
}

export function fromLucide<P extends Partial<IconProps> = IconProps>(
  Icon: LucideIcon,
  options?: LucideAdapterOptions
) {
  const Wrapped = ({
    size = options?.defaultSize ?? 24,
    color = options?.defaultColor ?? '#FFFFFF',
    strokeWidth,
    focused,
    coreColor: _coreColor,
    cutoutColor: _cutoutColor,
    creaseColor: _creaseColor,
    innerColor: _innerColor,
    capColor: _capColor,
    ...rest
  }: P) => {
    const effectiveStrokeWidth =
      strokeWidth ??
      (focused && options?.activeStrokeWidth
        ? options.activeStrokeWidth
        : options?.strokeWidth ?? ICON_STROKE_DEFAULT);

    const fill = options?.fillOnFocused && focused ? color : 'none';

    return (
      <Icon
        size={size}
        color={color}
        strokeWidth={effectiveStrokeWidth}
        fill={fill}
        {...rest}
      />
    );
  };

  Wrapped.displayName = `AppIcon(${Icon.displayName ?? 'Lucide'})`;
  return Wrapped;
}

// ─── Status & Feedback Icons (D5) ────────────────────────────────────────────

export const TriangleAlertIcon = fromLucide(TriangleAlert ?? AlertTriangle);
export const CircleAlertIcon = fromLucide(CircleAlert);
export const CircleCheckIcon = fromLucide(CircleCheck);

// ─── Wave 1: Common Glyphs & Navigation Controls ─────────────────────────────

export const ChevronLeftIcon = fromLucide(ChevronLeft, { defaultSize: 20 });
export const ChevronRightIcon = fromLucide(ChevronRight, { defaultSize: 20 });
export const ChevronDownIcon = fromLucide(ChevronDown, { defaultSize: 20 });
export const ChevronUpIcon = fromLucide(ChevronUp, { defaultSize: 20 });

export const CloseXIcon = fromLucide(X, { defaultSize: 20, strokeWidth: 2.2 });
export const PlusIcon = fromLucide(Plus, { defaultSize: 14, strokeWidth: 2.4 });

export function CirclePlusIcon({
  size = 20,
  color,
  circleColor,
  plusColor,
  strokeWidth = 2,
}: CirclePlusIconProps) {
  const stroke = color ?? plusColor ?? '#FFFFFF';
  const fill = circleColor ?? 'none';
  return <CirclePlus size={size} color={stroke} fill={fill} strokeWidth={strokeWidth} />;
}

export const CheckIcon = fromLucide(Check, { defaultSize: 20, strokeWidth: 2.2 });
export const InfoIcon = fromLucide(Info, { defaultSize: 22 });
export const MenuIcon = fromLucide(Menu, { defaultSize: 22 });

export const SearchIcon = fromLucide(Search, { defaultSize: 20, strokeWidth: 2.2 });
export const QuickSearchIcon = fromLucide(Search, { defaultSize: 26, strokeWidth: 2.6 });

export const SunIcon = fromLucide(Sun, { defaultSize: 20, defaultColor: '#FACC15' });
export const MoonIcon = fromLucide(Moon, { defaultSize: 20, defaultColor: '#9E64F7' });

export const CalendarIcon = fromLucide(Calendar, { defaultSize: 18 });
export const FlagIcon = fromLucide(Flag, { defaultSize: 13 });

// ─── Wave 2: Tab Bar, Quick Actions, Scanner & Account ───────────────────────

export const HomeTabIcon = fromLucide(House, {
  defaultSize: 24,
  fillOnFocused: true,
  activeStrokeWidth: 2.4,
});
export const HomeIcon = HomeTabIcon;

export const DiaryTabIcon = fromLucide(Utensils, {
  defaultSize: 24,
  activeStrokeWidth: 2.4,
});
export const DiaryIcon = DiaryTabIcon;

export const MealPlanTabIcon = fromLucide(ClipboardList, {
  defaultSize: 24,
  activeStrokeWidth: 2.4,
});
export const MealPlanIcon = MealPlanTabIcon;

export const ProfileTabIcon = fromLucide(User, {
  defaultSize: 24,
  fillOnFocused: true,
  activeStrokeWidth: 2.4,
});
export const ProfileIcon = ProfileTabIcon;

export const FlameIcon = fromLucide(Flame, { defaultSize: 16, defaultColor: '#F44E42' });

export const QuickBarcodeIcon = fromLucide(ScanBarcode, { defaultSize: 26 });
export const ViewfinderBarcodeIcon = fromLucide(ScanBarcode, { defaultSize: 26 });
export const BarcodeSquareIcon = fromLucide(ScanBarcode, { defaultSize: 24 });

export const QuickSparklesIcon = fromLucide(Sparkles, { defaultSize: 26, defaultColor: '#9E64F7' });
export const SparklesIcon = fromLucide(Sparkles, { defaultSize: 18, defaultColor: '#9E64F7' });

export const QuickVoiceIcon = fromLucide(Mic, { defaultSize: 26 });
export const ScannerSparkleFlashIcon = fromLucide(Zap, { defaultSize: 22 });
export const GalleryAddIcon = fromLucide(ImagePlus, { defaultSize: 22 });
export const AppleScanIcon = fromLucide(ScanSearch, { defaultSize: 22 });

export const GearSettingsIcon = fromLucide(Settings, { defaultSize: 22 });
export const MailInboxIcon = fromLucide(Mail, { defaultSize: 22 });
export const LockClosedIcon = fromLucide(Lock, { defaultSize: 22 });
export const ShieldSecurityIcon = fromLucide(ShieldCheck, { defaultSize: 22 });
export const ClipboardCopyIcon = fromLucide(ClipboardCopy, { defaultSize: 22 });
export const ShareNodesIcon = fromLucide(Share2, { defaultSize: 22 });
export const UsersIcon = fromLucide(Users, { defaultSize: 22 });
export const UserSingleIcon = fromLucide(User, { defaultSize: 22 });
export const TrophyIcon = fromLucide(Trophy, { defaultSize: 22, defaultColor: '#F59E0B' });

export const BookIcon = fromLucide(BookOpen, { defaultSize: 16, defaultColor: '#A59EBD' });
export const BookOpenIcon = BookIcon;
export const KnowledgeBookIcon = BookIcon;

// ─── Wave 3: Nutrition & Macros ──────────────────────────────────────────────

export const CutleryIcon = fromLucide(Utensils, { defaultSize: 14 });
export const LightningIcon = fromLucide(Zap, { defaultSize: 13 });
export const LightningBoltIcon = fromLucide(Zap, { defaultSize: 22, defaultColor: '#F59E0B' });
export const DropletIcon = fromLucide(Droplet, { defaultSize: 13 });
export const WheatIcon = fromLucide(Wheat, { defaultSize: 15, defaultColor: '#3B82F6' });
export const SugarIcon = fromLucide(Candy, { defaultSize: 15 });
export const WaterGlassPlusIcon = fromLucide(GlassWater, { defaultSize: 22 });
export const BodyStickFigureIcon = fromLucide(PersonStanding, { defaultSize: 24 });

// ─── Wave 4: Physical Activities ─────────────────────────────────────────────

export const BicycleIcon = fromLucide(Bike, { defaultSize: 24 });
