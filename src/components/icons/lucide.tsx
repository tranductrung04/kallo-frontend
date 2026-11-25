import React from 'react';
import {
  AlarmClock,
  AlertTriangle,
  Armchair,
  ArrowRight,
  BadgeCheck,
  Bell,
  Bike,
  BookOpen,
  BookPlus,
  Calendar,
  Candy,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  ClipboardCopy,
  ClipboardList,
  Clock,
  Cloud,
  Crown,
  Droplet,
  Droplets,
  Dumbbell,
  Flag,
  Flame,
  Footprints,
  Gamepad2,
  GlassWater,
  Globe,
  Heart,
  Hourglass,
  House,
  ImagePlus,
  Info,
  Lightbulb,
  Lock,
  LogOut,
  Mail,
  Mars,
  Medal,
  Menu,
  MessageSquare,
  Mic,
  Minus,
  Moon,
  MoreVertical,
  PartyPopper,
  PenLine,
  PersonStanding,
  Plus,
  QrCode,
  RefreshCw,
  RotateCcw,
  Send,
  Salad,
  Scale,
  ScanBarcode,
  ScanSearch,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Square,
  SquareCheck,
  Star,
  Sun,
  Target,
  TriangleAlert,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Trophy,
  User,
  UserMinus,
  UserPlus,
  Users,
  Utensils,
  Venus,
  Waves,
  Weight,
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
  defaultFill?: string;
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

    const fill =
      (rest as any).fill ??
      (options?.fillOnFocused && focused ? color : options?.defaultFill ?? 'none');

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
export const MinusIcon = fromLucide(Minus, { defaultSize: 14, strokeWidth: 2.4 });

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
export const CrownIcon = fromLucide(Crown, { defaultSize: 22, defaultColor: '#F59E0B' });
export const MedalIcon = fromLucide(Medal, { defaultSize: 22, defaultColor: '#F59E0B' });
export const SproutIcon = fromLucide(Sprout, { defaultSize: 22, defaultColor: '#10B981' });
export const DropletsIcon = fromLucide(Droplets, { defaultSize: 22, defaultColor: '#0284C7' });

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

export const BookPlusIcon = fromLucide(BookPlus, { defaultSize: 22 });
export const RecipeBookPlusOutlineIcon = BookPlusIcon;

export const SaladIcon = fromLucide(Salad, { defaultSize: 22 });
export const BowlFoodOutlineIcon = SaladIcon;

export const ScaleOutlineIcon = fromLucide(Scale, { defaultSize: 22 });
export const WeightIcon = fromLucide(Weight, { defaultSize: 22 });

// ─── Wave 4: Physical Activities ─────────────────────────────────────────────

export const BicycleIcon = fromLucide(Bike, { defaultSize: 24 });
export const FootprintsIcon = fromLucide(Footprints, { defaultSize: 20 });
export const WavesIcon = fromLucide(Waves, { defaultSize: 22 });

// ─── Health & Vitality ────────────────────────────────────────────────────────

export const HeartIcon = fromLucide(Heart, { defaultSize: 22 });
export const ClockIcon = fromLucide(Clock, { defaultSize: 22 });
export const CloudIcon = fromLucide(Cloud, { defaultSize: 22 });
export const ArmchairIcon = fromLucide(Armchair, { defaultSize: 22 });
export const DumbbellIcon = fromLucide(Dumbbell, { defaultSize: 22 });

// ─── System & UI Utility Glyphs ──────────────────────────────────────────────

export const BellIcon = fromLucide(Bell, { defaultSize: 20 });
export const GlobeIcon = fromLucide(Globe, { defaultSize: 20 });
export const LightbulbIcon = fromLucide(Lightbulb, { defaultSize: 20 });
export const LogOutIcon = fromLucide(LogOut, { defaultSize: 20 });
export const MessageSquareIcon = fromLucide(MessageSquare, { defaultSize: 20 });
export const PenLineIcon = fromLucide(PenLine, { defaultSize: 20 });
export const RefreshCwIcon = fromLucide(RefreshCw, { defaultSize: 20 });
export const SendIcon = fromLucide(Send, { defaultSize: 20 });
export const ThumbsUpIcon = fromLucide(ThumbsUp, { defaultSize: 18 });
export const ThumbsDownIcon = fromLucide(ThumbsDown, { defaultSize: 18 });
export const SquareIcon = fromLucide(Square, { defaultSize: 20 });
export const SquareCheckIcon = fromLucide(SquareCheck, { defaultSize: 20 });
export const CheckSquareIcon = SquareCheckIcon;
export const StarIcon = fromLucide(Star, { defaultSize: 14 });
export const QrCodeIcon = fromLucide(QrCode, { defaultSize: 24 });
export const GamepadIcon = fromLucide(Gamepad2, { defaultSize: 22 });
export const UserPlusIcon = fromLucide(UserPlus, { defaultSize: 20 });
export const PartyPopperIcon = fromLucide(PartyPopper, { defaultSize: 20, defaultColor: '#D97706' });
export const TrendingUpIcon = fromLucide(TrendingUp, { defaultSize: 18 });
export const RotateCcwIcon = fromLucide(RotateCcw, { defaultSize: 18 });
export const AlarmClockIcon = fromLucide(AlarmClock, { defaultSize: 18 });
export const BadgeCheckIcon = fromLucide(BadgeCheck, { defaultSize: 20 });
export const TargetIcon = fromLucide(Target, { defaultSize: 22 });
export const AlertCircleIcon = fromLucide(CircleAlert, { defaultSize: 18 });
export const ArrowRightIcon = fromLucide(ArrowRight, { defaultSize: 18 });
export const CheckCheckIcon = fromLucide(CheckCheck, { defaultSize: 22 });
export const MoreVerticalIcon = fromLucide(MoreVertical, { defaultSize: 20 });
export const UserMinusIcon = fromLucide(UserMinus, { defaultSize: 18 });
export const FemaleIcon = fromLucide(Venus, { defaultSize: 30, strokeWidth: 2.2 });
export const MaleIcon = fromLucide(Mars, { defaultSize: 30, strokeWidth: 2.2 });
export const HourglassIcon = fromLucide(Hourglass, { defaultSize: 32, strokeWidth: 2 });


