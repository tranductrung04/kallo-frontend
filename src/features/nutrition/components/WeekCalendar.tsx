// ─── WeekCalendar — Nocturne & Daylight Vitality ─────────────────────────────
// Uses DateSelectorStrip component per DESIGN.md spec
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { DateSelectorStrip, buildWeekDates } from '@/components/common';

export function WeekCalendar({ date, onChange }: { date: string; onChange: (date: string) => void }) {
  const dates = buildWeekDates(date);
  return (
    <DateSelectorStrip
      dates={dates}
      selectedKey={date}
      onChange={onChange}
    />
  );
}
