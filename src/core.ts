import { FIXED_HOLIDAYS, HAPPY_MONDAY_HOLIDAYS } from "./constants";
import type { Holiday } from "./types";

/** 定数管理 */
const MS_PER_DAY = 86400000;

const toId = (d: Date) =>
  d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

const getFixedHolidays = (year: number): Holiday[] => {
  return FIXED_HOLIDAYS.filter((h) => year >= h.start && year <= h.end).map(
    (h) => {
      const [m, d] = h.date.split("-").map(Number);
      return { date: new Date(year, m - 1, d), name: h.name };
    },
  );
};

const getHappyMondayHolidays = (year: number): Holiday[] => {
  return HAPPY_MONDAY_HOLIDAYS.filter(
    (h) => year >= h.start && year <= h.end,
  ).map((h) => {
    const firstDay = new Date(year, h.month - 1, 1).getDay();
    const day = 1 + ((8 - firstDay) % 7) + (h.week - 1) * 7;
    return {
      date: new Date(year, h.month - 1, day),
      name: h.name,
    };
  });
};

/** 春分・秋分の計算 */
const getEquinoxHolidays = (year: number): Holiday[] => {
  // 1948-1979年と1980-2099年で定数を切り替え
  const vernalParam = year < 1980 ? 20.8357 : 20.8431;
  const autumnParam = year < 1980 ? 23.256 : 23.2488;

  const getDay = (param: number) =>
    Math.floor(
      param + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4),
    );

  return [
    { date: new Date(year, 2, getDay(vernalParam)), name: "春分の日" },
    { date: new Date(year, 8, getDay(autumnParam)), name: "秋分の日" },
  ];
};

/** 振替休日の計算 */
const getSubstituteHolidays = (
  baseHolidays: Holiday[],
  holidayIds: Set<number>,
  year: number,
): Holiday[] => {
  // 1973年振替休日法制化（4月12日施行）以前は振替なし
  if (year < 1973) return [];

  return baseHolidays.flatMap((h) => {
    if (h.date.getDay() !== 0) return [];

    // 振替休日: 祝日でない日まで順次繰り越し
    // (1973年-2006年も当時のカレンダー配列上、このロジックで矛盾しない)
    const d = new Date(h.date);
    do {
      d.setDate(d.getDate() + 1);
    } while (holidayIds.has(toId(d)));
    holidayIds.add(toId(d));
    return [{ date: d, name: "振替休日" }];
  });
};

/** 国民の休日の計算 */
const getCitizensHolidays = (
  holidays: Holiday[],
  holidayIds: Set<number>,
  year: number,
): Holiday[] => {
  // 国民の休日は1985年12月27日施行（1986年から適用）
  if (year < 1986) return [];

  return holidays.slice(0, -1).flatMap((h, i) => {
    const next = holidays[i + 1];
    if ((next.date.getTime() - h.date.getTime()) / MS_PER_DAY !== 2) return [];

    const target = new Date(h.date.getTime() + MS_PER_DAY);
    if (target.getDay() === 0 || holidayIds.has(toId(target))) return [];

    return [{ date: target, name: "国民の休日" }];
  });
};

export const getHolidays = (year: number): Holiday[] => {
  // 1. 基礎祝日の生成
  const baseHolidays: Holiday[] = [
    ...getFixedHolidays(year),
    ...getHappyMondayHolidays(year),
    ...getEquinoxHolidays(year),
  ];

  const holidayIds = new Set(baseHolidays.map((h) => toId(h.date)));

  // 2. 振替休日の計算
  const substitutes = getSubstituteHolidays(baseHolidays, holidayIds, year);

  // 国民の休日の計算のためにソート必須
  const combined = [...baseHolidays, ...substitutes].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  // 3. 国民の休日の計算
  const citizens = getCitizensHolidays(combined, holidayIds, year);

  return [...combined, ...citizens].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
};
