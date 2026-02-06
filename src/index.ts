import { getHolidays } from "./core";
import { Holiday } from "./types";

/**
 * 指定された日付が祝日かどうかを判定します。
 * @param date 日付オブジェクト
 * @returns 祝日の場合はその名称、祝日でない場合は undefined を返します。
 */
export const isHoliday = (date: Date): string | undefined => {
  const holidays = getHolidays(date.getFullYear());
  const holiday = holidays.find(
    (h) =>
      h.date.getFullYear() === date.getFullYear() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getDate() === date.getDate(),
  );
  return holiday ? holiday.name : undefined;
};

/**
 * 指定された年の祝日一覧を取得します。
 * @param year 年
 * @returns 祝日オブジェクトの配列
 */
export const getHolidaysInYear = (year: number): readonly Holiday[] => {
  return getHolidays(year);
};

export { Holiday };
