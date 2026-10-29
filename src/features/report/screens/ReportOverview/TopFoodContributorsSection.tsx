import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DropletIcon, EmptyFolderIllustration, LightningIcon, WheatIcon } from '@/components/icons';
import { useReportStyles } from './ReportOverviewScreen.styles';

export type ContributorItem = {
  name: string;
  amount: number;
  pct: number;
};

export type TopFoodContributorsSectionProps = {
  contribMetric: 'protein' | 'carbs' | 'fat';
  onMetricChange: (metric: 'protein' | 'carbs' | 'fat') => void;
  contributors: ContributorItem[];
};

export function TopFoodContributorsSection({
  contribMetric,
  onMetricChange,
  contributors,
}: TopFoodContributorsSectionProps) {
  const { theme, styles } = useReportStyles();

  const getFillColor = () => {
    if (contribMetric === 'protein') return theme.colors.macroProtein;
    if (contribMetric === 'carbs') return theme.colors.macroCarbs;
    return theme.colors.macroFats;
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Thực phẩm đóng góp nhiều nhất</Text>

      {/* Filter Pills */}
      <View style={styles.filterPillsRow}>
        <TouchableOpacity
          style={[
            styles.filterPill,
            contribMetric === 'protein' && styles.filterPillActive,
          ]}
          onPress={() => onMetricChange('protein')}
        >
          <LightningIcon
            size={14}
            color={contribMetric === 'protein' ? '#FFFFFF' : theme.colors.macroProtein}
          />
          <Text
            style={[
              styles.filterPillText,
              contribMetric === 'protein' && styles.filterPillTextActive,
            ]}
          >
            Chất đạm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            contribMetric === 'carbs' && styles.filterPillActive,
          ]}
          onPress={() => onMetricChange('carbs')}
        >
          <WheatIcon
            size={15}
            color={contribMetric === 'carbs' ? '#FFFFFF' : theme.colors.macroCarbs}
          />
          <Text
            style={[
              styles.filterPillText,
              contribMetric === 'carbs' && styles.filterPillTextActive,
            ]}
          >
            Đường bột
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            contribMetric === 'fat' && styles.filterPillActive,
          ]}
          onPress={() => onMetricChange('fat')}
        >
          <DropletIcon
            size={14}
            color={contribMetric === 'fat' ? '#FFFFFF' : theme.colors.macroFats}
          />
          <Text
            style={[
              styles.filterPillText,
              contribMetric === 'fat' && styles.filterPillTextActive,
            ]}
          >
            Chất béo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Box */}
      {contributors.length === 0 ? (
        <View style={styles.emptyDashedBox}>
          <EmptyFolderIllustration size={130} />
          <Text style={styles.emptyDashedText}>Bạn chưa có dữ liệu</Text>
        </View>
      ) : (
        <View style={styles.contributorsCard}>
          {contributors.map((item, index) => (
            <View key={`${item.name}-${index}`} style={styles.contribItemRow}>
              <View style={styles.contribItemLeft}>
                <Text style={styles.contribRank}>#{index + 1}</Text>
                <Text style={styles.contribName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.contribItemRight}>
                <Text style={styles.contribAmount}>
                  {item.amount} g ({item.pct}%)
                </Text>
                <View style={styles.contribMiniTrack}>
                  <View
                    style={[
                      styles.contribMiniFill,
                      {
                        width: `${item.pct}%`,
                        backgroundColor: getFillColor(),
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
