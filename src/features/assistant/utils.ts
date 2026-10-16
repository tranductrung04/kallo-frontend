import type { AssistantContext } from './types';

export const MEDICAL_KEYWORDS = [
  'thuốc',
  'bệnh',
  'ung thư',
  'tiểu đường',
  'huyết áp cao',
  'đau tim',
  'chữa trị',
  'kê đơn',
  'kháng sinh',
  'bác sĩ khám',
];

export const QUICK_PROMPTS = [
  'Hôm nay tôi còn bao nhiêu calo?',
  'Gợi ý bữa tối dưới 400 kcal không có tôm',
  'Đánh giá tỷ lệ macro hôm nay',
  'Tôi nên uống thêm bao nhiêu nước?',
];

export function isMedicalQuery(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return MEDICAL_KEYWORDS.some((kw) => lower.includes(kw));
}

export function generateAssistantResponse(prompt: string, context: AssistantContext): string {
  const cleanPrompt = prompt.trim().toLowerCase();

  // 1. FR-CHAT-06: Medical boundary guardrail
  if (isMedicalQuery(cleanPrompt)) {
    return 'Lưu ý y tế: Kallo là trợ lý thông tin dinh dưỡng và không thay thế chẩn đoán, điều trị hay chỉ định chuyên môn của bác sĩ. Đối với các tình trạng bệnh lý hoặc việc sử dụng thuốc, bạn vui lòng liên hệ cơ sở y tế hoặc bác sĩ chuyên khoa để được tư vấn chính xác nhất.';
  }

  // 2. AC1: "Hôm nay tôi còn bao nhiêu calo?" / "ăn bao nhiêu calo"
  if (
    cleanPrompt.includes('còn bao nhiêu calo') ||
    cleanPrompt.includes('bao nhiêu calo') ||
    cleanPrompt.includes('ăn bao nhiêu') ||
    cleanPrompt.includes('calo hôm nay')
  ) {
    const { calories, caloriesGoal, caloriesRemaining, caloriesBurned } = context.summary;
    return `Hôm nay bạn đã nạp **${calories} kcal** trên mục tiêu **${caloriesGoal} kcal**.

• Calo còn lại: **${caloriesRemaining} kcal**
• Vận động tiêu hao: **${caloriesBurned} kcal**

${
  caloriesRemaining > 400
    ? 'Bạn vẫn còn đủ calo cho một bữa ăn lành mạnh và trọn vẹn!'
    : caloriesRemaining > 0
    ? 'Bạn sắp đạt mục tiêu calo trong ngày, hãy ưu tiên rau xanh và trà ấm nhẹ nhé.'
    : 'Bạn đã vượt mức calo mục tiêu hôm nay. Hãy đi dạo nhẹ nhàng 15-20 phút để hỗ trợ tiêu hóa.'
}`;
  }

  // 3. AC2: Dinner suggestions with allergy respect (e.g. no shrimp / seafood)
  if (cleanPrompt.includes('bữa tối') || cleanPrompt.includes('gợi ý món') || cleanPrompt.includes('tối')) {
    const hasShrimpAllergy =
      context.allergens.some((a) => a.toLowerCase().includes('tôm') || a.toLowerCase().includes('hải sản')) ||
      cleanPrompt.includes('không có tôm') ||
      cleanPrompt.includes('không tôm');

    return `Dưới đây là thực đơn bữa tối thanh đạm dưới 400 kcal ${
      hasShrimpAllergy ? '(hoàn toàn không có tôm và hải sản)' : ''
    }:

1. Thịt bò xào bông cải xanh (200g) — ~260 kcal
2. Nửa chén cơm gạo lứt (100g) — ~110 kcal
3. Canh bí xanh nấu thịt nạc — ~40 kcal

Tổng năng lượng: ~410 kcal, giàu chất đạm (P: 28g) và chất xơ, hỗ trợ giấc ngủ ngon!`;
  }

  // 4. Macro evaluation
  if (cleanPrompt.includes('macro') || cleanPrompt.includes('đạm') || cleanPrompt.includes('chất béo')) {
    const { protein, proteinGoal, carbs, carbsGoal, fat, fatGoal } = context.summary;
    const proteinPct = Math.round((protein / (proteinGoal || 1)) * 100);
    const carbsPct = Math.round((carbs / (carbsGoal || 1)) * 100);
    const fatPct = Math.round((fat / (fatGoal || 1)) * 100);

    return `Đánh giá tỷ lệ Macro hôm nay của bạn:

• Chất đạm (Protein): **${protein}g** / ${proteinGoal}g (${proteinPct}%)
• Tinh bột (Carbs): **${carbs}g** / ${carbsGoal}g (${carbsPct}%)
• Chất béo (Fat): **${fat}g** / ${fatGoal}g (${fatPct}%)

${
  proteinPct < 70
    ? 'Lời khuyên: Bạn nên bổ sung thêm ức gà, trứng hoặc đậu phụ để đạt đủ lượng đạm phục hồi cơ bắp.'
    : 'Tỷ lệ chất đạm của bạn hôm nay rất cân bằng và lý tưởng!'
}`;
  }

  // 5. Water evaluation
  if (cleanPrompt.includes('nước') || cleanPrompt.includes('uống nước')) {
    const { waterMl, waterGoalMl } = context.summary;
    const remaining = Math.max(0, waterGoalMl - waterMl);
    return `Tiến độ uống nước hôm nay: **${waterMl} ml** / **${waterGoalMl} ml**.

${
  remaining > 0
    ? `Bạn nên bổ sung thêm khoảng **${remaining} ml** nước nữa (tương đương ${Math.ceil(remaining / 250)} cốc nước) để đảm bảo trao đổi chất tối ưu.`
    : 'Tuyệt vời! Bạn đã hoàn thành 100% mục tiêu nước uống ngày hôm nay 💧'
}`;
  }

  // Default helpful response
  return `Chào bạn! Mình là trợ lý dinh dưỡng Kallo. Mình có thể hỗ trợ bạn tính toán Calo, cân đối các nhóm chất đạm - tinh bột - béo, gợi ý thực đơn món Việt và giải đáp các thắc mắc về năng lượng nạp vào trong ngày. Bạn cần hỗ trợ gì nhé?`;
}
