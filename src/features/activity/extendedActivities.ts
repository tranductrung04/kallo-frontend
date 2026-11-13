export type ActivityItemMeta = {
  id: string;
  name: string;
  met: number;
  letter: string;
};

export type ActivitySection = {
  letter: string;
  data: ActivityItemMeta[];
};

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const EXTENDED_ACTIVITIES: ActivityItemMeta[] = [
  // B (1 - 23)
  { id: 'b_australian_football', name: 'Bóng bầu dục Úc (Australian Football)', met: 8.0, letter: 'B' },
  { id: 'b_baseball', name: 'Bóng chày (Baseball)', met: 5.0, letter: 'B' },
  { id: 'b_bowling', name: 'Bowling', met: 3.0, letter: 'B' },
  { id: 'b_futsal', name: 'Bóng đá trong nhà (Futsal)', met: 8.0, letter: 'B' },
  { id: 'b_calisthenics', name: 'Bài tập thể chất (Calisthenics)', met: 6.0, letter: 'B' },
  { id: 'b_handball', name: 'Bóng ném (Handball)', met: 8.0, letter: 'B' },
  { id: 'b_croquet', name: 'Bóng cửa (Croquet)', met: 2.5, letter: 'B' },
  { id: 'b_billiards', name: 'Bi-da (Billiards)', met: 2.5, letter: 'B' },
  { id: 'b_racquetball', name: 'Bóng vợt (Racquetball)', met: 7.0, letter: 'B' },
  { id: 'b_soccer', name: 'Bóng đá (Soccer)', met: 7.5, letter: 'B' },
  { id: 'b_squash', name: 'Bóng quần (Squash)', met: 9.0, letter: 'B' },
  { id: 'b_water_polo', name: 'Bóng nước (Water Polo)', met: 8.0, letter: 'B' },
  { id: 'b_stretching', name: 'Bài tập giãn cơ (Stretching exercises)', met: 2.5, letter: 'B' },
  { id: 'b_american_football', name: 'Bóng bầu dục Mỹ (American Football)', met: 8.0, letter: 'B' },
  { id: 'b_archery', name: 'Bắn cung (Archery)', met: 3.5, letter: 'B' },
  { id: 'b_basketball', name: 'Bóng rổ (Basketball)', met: 7.0, letter: 'B' },
  { id: 'b_volleyball', name: 'Bóng chuyền (Volleyball)', met: 4.0, letter: 'B' },
  { id: 'b_table_tennis', name: 'Bóng bàn (Table Tennis)', met: 4.0, letter: 'B' },
  { id: 'b_rugby', name: 'Bóng bầu dục (Rugby)', met: 8.0, letter: 'B' },
  { id: 'b_swimming', name: 'Bơi lội (Swimming)', met: 7.0, letter: 'B' },
  { id: 'b_lacrosse', name: 'Bóng vợt (Lacrosse)', met: 8.0, letter: 'B' },
  { id: 'b_barre', name: 'Barre', met: 4.0, letter: 'B' },
  { id: 'b_softball', name: 'Bóng chày nữ (Softball)', met: 5.0, letter: 'B' },

  // C (24 - 32)
  { id: 'c_elliptical', name: 'Chạy bộ tại chỗ (Elliptical)', met: 7.0, letter: 'C' },
  { id: 'c_rowing', name: 'Chèo thuyền (Rowing boat)', met: 6.0, letter: 'C' },
  { id: 'c_kayaking', name: 'Chèo thuyền Kayak (Kayaking)', met: 5.0, letter: 'C' },
  { id: 'c_weight_lifting', name: 'Cử tạ (Weight lifting)', met: 5.5, letter: 'C' },
  { id: 'c_badminton', name: 'Cầu lông (Badminton)', met: 5.5, letter: 'C' },
  { id: 'c_fishing', name: 'Câu cá (Fishing)', met: 3.0, letter: 'C' },
  { id: 'c_running', name: 'Chạy nhanh (Running)', met: 9.0, letter: 'C' },
  { id: 'c_jogging', name: 'Chạy chậm (Jogging)', met: 7.0, letter: 'C' },
  { id: 'c_canoeing', name: 'Chèo xuồng Canoe (Canoeing)', met: 4.5, letter: 'C' },

  // D (33 - 42)
  { id: 'd_bicycling_stationary', name: 'Đạp xe tại chỗ (Bicycling stationary)', met: 6.5, letter: 'D' },
  { id: 'd_kickboxing', name: 'Đấm bốc tự do (Kickboxing)', met: 8.5, letter: 'D' },
  { id: 'd_fencing', name: 'Đấu kiếm (Fencing)', met: 6.0, letter: 'D' },
  { id: 'd_sailing', name: 'Đi thuyền buồm (Sailing)', met: 3.5, letter: 'D' },
  { id: 'd_wrestling', name: 'Đấu vật (Wrestling)', met: 7.0, letter: 'D' },
  { id: 'd_walking', name: 'Đi bộ (Walking)', met: 3.5, letter: 'D' },
  { id: 'd_cycling', name: 'Đạp xe (Cycling)', met: 7.0, letter: 'D' },
  { id: 'd_hiking', name: 'Đi bộ đường dài (Hiking)', met: 6.0, letter: 'D' },
  { id: 'd_track_and_field', name: 'Điền kinh (Track and field)', met: 8.0, letter: 'D' },
  { id: 'd_snowshoeing', name: 'Đi bộ trên tuyết (Snow shoeing)', met: 5.3, letter: 'D' },

  // G, H, K (43 - 45)
  { id: 'g_golf', name: 'Golf', met: 4.0, letter: 'G' },
  { id: 'h_hiits', name: 'HITTs', met: 8.0, letter: 'H' },
  { id: 'k_hockey', name: 'Khúc côn cầu (Hockey)', met: 7.5, letter: 'K' },

  // L (46 - 51)
  { id: 'l_surfing', name: 'Lướt sóng (Surfing)', met: 5.0, letter: 'L' },
  { id: 'l_skin_diving', name: 'Lặn tự do (Skin diving)', met: 7.0, letter: 'L' },
  { id: 'l_housework', name: 'Làm việc nhà (Housework)', met: 3.0, letter: 'L' },
  { id: 'l_snorkeling', name: 'Lặn có ống thở (Snorkeling)', met: 5.0, letter: 'L' },
  { id: 'l_climbing', name: 'Leo núi (Climbing)', met: 8.0, letter: 'L' },
  { id: 'l_stair_climbing', name: 'Leo cầu thang (Stair Climbing)', met: 8.5, letter: 'L' },

  // M (52 - 53)
  { id: 'm_curling', name: 'Môn bi đá trên băng (Curling)', met: 4.0, letter: 'M' },
  { id: 'm_marathon', name: 'Marathon', met: 10.0, letter: 'M' },

  // N (54 - 56)
  { id: 'n_frisbee', name: 'Ném đĩa (Frisbee)', met: 3.5, letter: 'N' },
  { id: 'n_trampoline', name: 'Nhảy bạt nhún (Trampoline)', met: 4.5, letter: 'N' },
  { id: 'n_jump_rope', name: 'Nhảy dây (Jump Rope)', met: 10.0, letter: 'N' },

  // P, Q, S (57 - 61)
  { id: 'p_pilates', name: 'Pilates', met: 3.5, letter: 'P' },
  { id: 'p_pickleball', name: 'Pickleball', met: 6.0, letter: 'P' },
  { id: 'q_tennis', name: 'Quần vợt (Tennis)', met: 7.3, letter: 'Q' },
  { id: 'q_boxing', name: 'Quyền anh (Boxing)', met: 8.5, letter: 'Q' },
  { id: 's_hunting', name: 'Săn bắn (Hunting)', met: 4.0, letter: 'S' },

  // T (62 - 75)
  { id: 't_gymnastics', name: 'Thể dục dụng cụ (Gymnastics)', met: 5.5, letter: 'T' },
  { id: 't_skating_sports', name: 'Trượt băng (Skating Sports)', met: 7.0, letter: 'T' },
  { id: 't_snowmobiling', name: 'Trượt tuyết bằng xe (Snowmobiling)', met: 3.5, letter: 'T' },
  { id: 't_water_fitness', name: 'Thể dục dưới nước (Water Fitness)', met: 5.5, letter: 'T' },
  { id: 't_cross_country_skiing', name: 'Trượt tuyết việt dã (Cross Country Skiing)', met: 9.0, letter: 'T' },
  { id: 't_downhill_skiing', name: 'Trượt tuyết đổ đèo (Downhill Skiing)', met: 6.0, letter: 'T' },
  { id: 't_skateboarding', name: 'Trượt ván (Skateboarding)', met: 5.0, letter: 'T' },
  { id: 't_equestrian_sports', name: 'Thể thao cưỡi ngựa (Equestrian Sports)', met: 5.5, letter: 'T' },
  { id: 't_tai_chi', name: 'Thái cực quyền (Tai chi)', met: 3.0, letter: 'T' },
  { id: 't_weight_training', name: 'Tập tạ (Weight training)', met: 5.5, letter: 'T' },
  { id: 't_meditation', name: 'Thiền', met: 1.5, letter: 'T' },
  { id: 't_aerobic', name: 'Thể dục nhịp điệu (Aerobic)', met: 6.5, letter: 'T' },
  { id: 't_roller_skating', name: 'Trượt patin (Roller skating)', met: 7.0, letter: 'T' },
  { id: 't_water_skiing', name: 'Trượt nước (Water skiing)', met: 6.0, letter: 'T' },

  // V, W, X, Y (76 - 80)
  { id: 'v_martial_arts', name: 'Võ thuật (Martial Arts)', met: 9.0, letter: 'V' },
  { id: 'w_workout', name: 'Workout', met: 6.0, letter: 'W' },
  { id: 'x_core_training', name: 'Xây dựng cơ trung tâm (Core training)', met: 5.0, letter: 'X' },
  { id: 'x_shoveling_snow', name: 'Xúc tuyết (Shoveling snow)', met: 6.0, letter: 'X' },
  { id: 'y_yoga', name: 'Yoga', met: 3.0, letter: 'Y' },
];
