import type { ImageSourcePropType } from 'react-native';
import { images } from '@/assets/images';

/**
 * Mapping of all 80 activities defined in EXTENDED_ACTIVITIES to corresponding
 * local image assets (100% offline-ready, bundled inside the app).
 */
export const SPORT_IMAGES_MAP: Record<string, ImageSourcePropType> = {
  // ── B (1 - 23) ──────────────────────────────────────────────────────────
  b_australian_football: images.australianFootball,
  b_baseball: require('@/assets/images/activity/sports/b_baseball.jpg'),
  b_bowling: require('@/assets/images/activity/sports/b_bowling.jpg'),
  b_futsal: require('@/assets/images/activity/sports/b_futsal.jpg'),
  b_calisthenics: require('@/assets/images/activity/sports/b_calisthenics.jpg'),
  b_handball: require('@/assets/images/activity/sports/b_handball.jpg'),
  b_croquet: require('@/assets/images/activity/sports/b_croquet.jpg'),
  b_billiards: require('@/assets/images/activity/sports/b_billiards.jpg'),
  b_racquetball: require('@/assets/images/activity/sports/b_racquetball.jpg'),
  b_soccer: require('@/assets/images/activity/sports/b_soccer.jpg'),
  b_squash: require('@/assets/images/activity/sports/b_squash.jpg'),
  b_water_polo: require('@/assets/images/activity/sports/b_water_polo.jpg'),
  b_stretching: require('@/assets/images/activity/sports/b_stretching.jpg'),
  b_american_football: require('@/assets/images/activity/sports/b_american_football.jpg'),
  b_archery: require('@/assets/images/activity/sports/b_archery.jpg'),
  b_basketball: require('@/assets/images/activity/sports/b_basketball.jpg'),
  b_volleyball: require('@/assets/images/activity/sports/b_volleyball.jpg'),
  b_table_tennis: require('@/assets/images/activity/sports/b_table_tennis.jpg'),
  b_rugby: require('@/assets/images/activity/sports/b_rugby.jpg'),
  b_swimming: require('@/assets/images/activity/sports/b_swimming.jpg'),
  b_lacrosse: require('@/assets/images/activity/sports/b_lacrosse.jpg'),
  b_barre: require('@/assets/images/activity/sports/b_barre.jpg'),
  b_softball: require('@/assets/images/activity/sports/b_softball.jpg'),

  // ── C (24 - 32) ─────────────────────────────────────────────────────────
  c_elliptical: require('@/assets/images/activity/sports/c_elliptical.jpg'),
  c_rowing: require('@/assets/images/activity/sports/c_rowing.jpg'),
  c_kayaking: require('@/assets/images/activity/sports/c_kayaking.jpg'),
  c_weight_lifting: require('@/assets/images/activity/sports/c_weight_lifting.jpg'),
  c_badminton: images.badmintonCourt,
  c_fishing: require('@/assets/images/activity/sports/c_fishing.jpg'),
  c_running: images.runningTrack,
  c_jogging: require('@/assets/images/activity/sports/c_jogging.jpg'),
  c_canoeing: require('@/assets/images/activity/sports/c_canoeing.jpg'),

  // ── D (33 - 42) ─────────────────────────────────────────────────────────
  d_bicycling_stationary: require('@/assets/images/activity/sports/d_bicycling_stationary.jpg'),
  d_kickboxing: require('@/assets/images/activity/sports/d_kickboxing.jpg'),
  d_fencing: require('@/assets/images/activity/sports/d_fencing.jpg'),
  d_sailing: require('@/assets/images/activity/sports/d_sailing.jpg'),
  d_wrestling: require('@/assets/images/activity/sports/d_wrestling.jpg'),
  d_walking: require('@/assets/images/activity/sports/d_walking.jpg'),
  d_cycling: images.cyclingTrack,
  d_hiking: require('@/assets/images/activity/sports/d_hiking.jpg'),
  d_track_and_field: images.runningTrack,
  d_snowshoeing: require('@/assets/images/activity/sports/d_snowshoeing.jpg'),

  // ── G, H, K (43 - 45) ───────────────────────────────────────────────────
  g_golf: require('@/assets/images/activity/sports/g_golf.jpg'),
  h_hiits: require('@/assets/images/activity/sports/h_hiits.jpg'),
  k_hockey: require('@/assets/images/activity/sports/k_hockey.jpg'),

  // ── L (46 - 51) ─────────────────────────────────────────────────────────
  l_surfing: require('@/assets/images/activity/sports/l_surfing.jpg'),
  l_skin_diving: require('@/assets/images/activity/sports/l_skin_diving.jpg'),
  l_housework: require('@/assets/images/activity/sports/l_housework.jpg'),
  l_snorkeling: require('@/assets/images/activity/sports/l_snorkeling.jpg'),
  l_climbing: require('@/assets/images/activity/sports/l_climbing.jpg'),
  l_stair_climbing: require('@/assets/images/activity/sports/l_stair_climbing.jpg'),

  // ── M (52 - 53) ─────────────────────────────────────────────────────────
  m_curling: require('@/assets/images/activity/sports/m_curling.jpg'),
  m_marathon: require('@/assets/images/activity/sports/m_marathon.jpg'),

  // ── N (54 - 56) ─────────────────────────────────────────────────────────
  n_frisbee: require('@/assets/images/activity/sports/n_frisbee.jpg'),
  n_trampoline: require('@/assets/images/activity/sports/n_trampoline.jpg'),
  n_jump_rope: require('@/assets/images/activity/sports/n_jump_rope.jpg'),

  // ── P, Q, S (57 - 61) ───────────────────────────────────────────────────
  p_pilates: require('@/assets/images/activity/sports/p_pilates.jpg'),
  p_pickleball: images.pickleballCourt,
  q_tennis: require('@/assets/images/activity/sports/q_tennis.jpg'),
  q_boxing: require('@/assets/images/activity/sports/q_boxing.jpg'),
  s_hunting: require('@/assets/images/activity/sports/s_hunting.jpg'),

  // ── T (62 - 75) ─────────────────────────────────────────────────────────
  t_gymnastics: require('@/assets/images/activity/sports/t_gymnastics.jpg'),
  t_skating_sports: require('@/assets/images/activity/sports/t_skating_sports.jpg'),
  t_snowmobiling: require('@/assets/images/activity/sports/t_snowmobiling.jpg'),
  t_water_fitness: require('@/assets/images/activity/sports/t_water_fitness.jpg'),
  t_cross_country_skiing: require('@/assets/images/activity/sports/t_cross_country_skiing.jpg'),
  t_downhill_skiing: require('@/assets/images/activity/sports/t_downhill_skiing.jpg'),
  t_skateboarding: require('@/assets/images/activity/sports/t_skateboarding.jpg'),
  t_equestrian_sports: require('@/assets/images/activity/sports/t_equestrian_sports.jpg'),
  t_tai_chi: require('@/assets/images/activity/sports/t_tai_chi.jpg'),
  t_weight_training: require('@/assets/images/activity/sports/t_weight_training.jpg'),
  t_meditation: require('@/assets/images/activity/sports/t_meditation.jpg'),
  t_aerobic: require('@/assets/images/activity/sports/t_aerobic.jpg'),
  t_roller_skating: require('@/assets/images/activity/sports/t_roller_skating.jpg'),
  t_water_skiing: require('@/assets/images/activity/sports/t_water_skiing.jpg'),

  // ── V, W, X, Y (76 - 80) ────────────────────────────────────────────────
  v_martial_arts: require('@/assets/images/activity/sports/v_martial_arts.jpg'),
  w_workout: require('@/assets/images/activity/sports/w_workout.jpg'),
  x_core_training: require('@/assets/images/activity/sports/x_core_training.jpg'),
  x_shoveling_snow: require('@/assets/images/activity/sports/x_shoveling_snow.jpg'),
  y_yoga: images.yogaPractice,
};

/**
 * Returns the best matching ImageSourcePropType for a given activity ID or name.
 */
export function getSportImageSource(activityId?: string, activityName?: string): ImageSourcePropType {
  if (activityId && SPORT_IMAGES_MAP[activityId]) {
    return SPORT_IMAGES_MAP[activityId];
  }

  const nameLower = (activityName || '').toLowerCase();
  const idLower = (activityId || '').toLowerCase();

  // Name / ID fallback matching
  if (nameLower.includes('bầu dục úc') || idLower.includes('australian_football')) {
    return images.australianFootball;
  }
  if (nameLower.includes('cầu lông') || nameLower.includes('badminton') || idLower.includes('badminton')) {
    return images.badmintonCourt;
  }
  if (nameLower.includes('đạp xe') || nameLower.includes('cycling') || idLower.includes('cycling')) {
    return images.cyclingTrack;
  }
  if (nameLower.includes('pickleball') || idLower.includes('pickleball')) {
    return images.pickleballCourt;
  }
  if (nameLower.includes('yoga') || idLower.includes('yoga')) {
    return images.yogaPractice;
  }
  if (
    nameLower.includes('chạy') ||
    nameLower.includes('running') ||
    nameLower.includes('điền kinh') ||
    idLower.includes('running') ||
    idLower.includes('track')
  ) {
    return images.runningTrack;
  }
  if (nameLower.includes('bóng chày') || idLower.includes('baseball') || idLower.includes('softball')) {
    return require('@/assets/images/activity/sports/b_baseball.jpg');
  }
  if (nameLower.includes('bóng đá') || idLower.includes('soccer') || idLower.includes('futsal')) {
    return require('@/assets/images/activity/sports/b_futsal.jpg');
  }
  if (nameLower.includes('bóng rổ') || idLower.includes('basketball')) {
    return require('@/assets/images/activity/sports/b_basketball.jpg');
  }
  if (nameLower.includes('bơi') || idLower.includes('swimming') || idLower.includes('water')) {
    return require('@/assets/images/activity/sports/b_swimming.jpg');
  }
  if (nameLower.includes('quần vợt') || nameLower.includes('tennis') || idLower.includes('tennis')) {
    return require('@/assets/images/activity/sports/q_tennis.jpg');
  }
  if (nameLower.includes('quyền anh') || nameLower.includes('boxing') || idLower.includes('boxing')) {
    return require('@/assets/images/activity/sports/q_boxing.jpg');
  }
  if (nameLower.includes('võ') || idLower.includes('martial')) {
    return require('@/assets/images/activity/sports/v_martial_arts.jpg');
  }
  if (nameLower.includes('tạ') || nameLower.includes('gym') || idLower.includes('weight')) {
    return require('@/assets/images/activity/sports/c_weight_lifting.jpg');
  }

  return images.australianFootball;
}
