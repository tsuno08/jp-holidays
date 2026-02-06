import { describe, expect, it, test } from "vitest";
import { getHolidays } from "./core";
import { getHolidayName, getHolidaysInYear, isHoliday } from "./index";

describe("日本の祝日", () => {
  it("固定祝日を判定できること", () => {
    // 元日
    expect(getHolidayName(new Date(2025, 0, 1))).toBe("元日");
    // 建国記念の日
    expect(getHolidayName(new Date(2025, 1, 11))).toBe("建国記念の日");
    // 令和の天皇誕生日 (2020~)
    expect(getHolidayName(new Date(2025, 1, 23))).toBe("天皇誕生日");
  });

  it("過去の祝日（旧天皇誕生日など）を判定できること", () => {
    // 平成の天皇誕生日 (1989-2018): 12月23日
    expect(getHolidayName(new Date(2018, 11, 23))).toBe("天皇誕生日");
    expect(getHolidayName(new Date(2019, 11, 23))).toBeUndefined(); // 2019年はなし

    // 4月29日の変遷
    // 昭和の日 (2007~): 4月29日
    expect(getHolidayName(new Date(2025, 3, 29))).toBe("昭和の日");
    // みどりの日 (1989-2006): 4月29日
    expect(getHolidayName(new Date(2000, 3, 29))).toBe("みどりの日");
    // 昭和の天皇誕生日 (1949-1988): 4月29日
    expect(getHolidayName(new Date(1988, 3, 29))).toBe("天皇誕生日");

    // 5月4日の変遷
    // みどりの日 (2007~): 5月4日
    expect(getHolidayName(new Date(2025, 4, 4))).toBe("みどりの日");
    // 2006年以前は祝日としては存在しない（国民の休日としてはありうる）
    // 2006年5月4日は木曜日。5/3(憲法)と5/5(こども)の間なので国民の休日となるはず
    expect(getHolidayName(new Date(2006, 4, 4))).toBe("国民の休日");
  });

  it("ハッピーマンデー制度の祝日を判定できること", () => {
    // 成人の日 (2000~): 1月の第2月曜日
    // 2025年1月1日は水曜日 -> 第2月曜: 13日
    expect(getHolidayName(new Date(2025, 0, 13))).toBe("成人の日");

    // 旧成人の日 (1948-1999): 1月15日固定
    expect(getHolidayName(new Date(1999, 0, 15))).toBe("成人の日");
    // 2000年以降の1月15日は成人の日ではない (偶然重なる場合を除くが、2000年1月15日は土曜日、第2月曜は10日)
    expect(getHolidayName(new Date(2000, 0, 15))).toBeUndefined();
  });

  it("振替休日を判定できること", () => {
    // 2024年5月5日(日)はこどもの日
    // 5月6日(月)は振替休日になるはず
    expect(getHolidayName(new Date(2024, 4, 5))).toBe("こどもの日");
    expect(getHolidayName(new Date(2024, 4, 6))).toBe("振替休日");
  });

  it("春分・秋分の日を判定できること (既知の日付で検証)", () => {
    // 2024年 春分: 3月20日
    expect(getHolidayName(new Date(2024, 2, 20))).toBe("春分の日");
    // 2024年 秋分: 9月22日
    expect(getHolidayName(new Date(2024, 8, 22))).toBe("秋分の日");
  });

  it("国民の休日を判定できること", () => {
    // 2019年5月 (ゴールデンウィーク特例)
    // 4月29日: 昭和の日
    // 4月30日: 休日 (退位の日) - *今回の軽量版では皇室関連の特例祝日を完全にはサポートしていない可能性がありますが、法律に基づく国民の休日のロジックを確認
    // 5月1日: 休日 (即位の日)
    // 5月2日: 休日 (国民の休日)
    // 5月3日: 憲法記念日
    // 5月2日は国民の休日
    expect(getHolidayName(new Date(2019, 4, 2))).toBe("国民の休日");

    // シルバーウィーク 2015
    // 9月21日 (月): 敬老の日
    // 9月22日 (火): 国民の休日
    // 9月23日 (水): 秋分の日
    expect(getHolidayName(new Date(2015, 8, 21))).toBe("敬老の日"); // 月
    expect(getHolidayName(new Date(2015, 8, 23))).toBe("秋分の日"); // 水
    expect(getHolidayName(new Date(2015, 8, 22))).toBe("国民の休日"); // 火
  });

  it("オリンピックによる山の日の移動を正しく処理できること", () => {
    // 2020: 8月10日
    expect(getHolidayName(new Date(2020, 7, 10))).toBe("山の日");
    // 2021: 8月8日
    expect(getHolidayName(new Date(2021, 7, 8))).toBe("山の日");
    // 2022: 8月11日 (通常)
    expect(getHolidayName(new Date(2022, 7, 11))).toBe("山の日");
  });

  it("祝日でない場合は undefined を返すこと", () => {
    expect(getHolidayName(new Date(2025, 0, 2))).toBeUndefined();
  });

  it("指定した年の全祝日を取得できること", () => {
    const holidays = getHolidaysInYear(2025);
    expect(holidays.length).toBeGreaterThan(10);
    expect(holidays.find((h) => h.name === "元日")).toBeDefined();
  });
});

describe("祝日計算のエッジケース", () => {
  test("2009年シルバーウィーク（国民の休日）の確認", () => {
    // 2009年9月
    // 9/21 (月) 敬老の日
    // 9/22 (火) 国民の休日 (9/21と9/23に挟まれる)
    // 9/23 (水) 秋分の日
    const holidays = getHolidays(2009);
    const septHolidays = holidays.filter((h) => h.date.getMonth() === 8); // 0-indexed month

    // 9/21 敬老の日を確認
    const respect = septHolidays.find((h) => h.date.getDate() === 21);
    expect(respect).toBeDefined();
    expect(respect?.name).toBe("敬老の日");

    // 9/22 国民の休日を確認
    const citizen = septHolidays.find((h) => h.date.getDate() === 22);
    expect(citizen).toBeDefined();
    expect(citizen?.name).toBe("国民の休日");

    // 9/23 秋分の日を確認
    const autumn = septHolidays.find((h) => h.date.getDate() === 23);
    expect(autumn).toBeDefined();
    expect(autumn?.name).toBe("秋分の日");
  });

  test("2019年ゴールデンウィーク（連続祝日・国民の休日）", () => {
    // 2019年4-5月
    // 4/30, 5/2 が国民の休日になるはず
    const holidays = getHolidays(2019);

    const april30 = holidays.find(
      (h) => h.date.getMonth() === 3 && h.date.getDate() === 30,
    );
    expect(april30).toBeDefined();
    expect(april30?.name).toBe("国民の休日");

    const may1 = holidays.find(
      (h) => h.date.getMonth() === 4 && h.date.getDate() === 1,
    );
    expect(may1).toBeDefined();
    expect(may1?.name).toBe("天皇の即位の日");

    const may2 = holidays.find(
      (h) => h.date.getMonth() === 4 && h.date.getDate() === 2,
    );
    expect(may2).toBeDefined();
    expect(may2?.name).toBe("国民の休日");
  });

  test("振替休日の繰り越し（火曜・水曜等へのシフト）", () => {
    // 2007年以降の振替休日ルール: 休日でない日まで繰り越し
    // 例: 2023年5月
    // 5/3 (水) 憲法記念日
    // 5/4 (木) みどりの日
    // 5/5 (金) こどもの日
    // 例: 2020年5月 (日曜日の重複チェック)
    // 振替休日が月曜日にならないケースを確認
    // 2008年5月
    //  5/3(土), 5/4(日), 5/5(月)
    //  5/4が日曜 -> 5/5が祝日なので5/6(火)に振替

    const holidays2008 = getHolidays(2008);
    const may6_2008 = holidays2008.find(
      (h) => h.date.getMonth() === 4 && h.date.getDate() === 6,
    );
    expect(may6_2008).toBeDefined();
    expect(may6_2008?.name).toBe("振替休日");
    // 5/4がみどりの日であることを確認
    expect(
      holidays2008.find(
        (h) => h.date.getMonth() === 4 && h.date.getDate() === 4,
      )?.name,
    ).toBe("みどりの日");
    // 5/5がこどもの日であることを確認
    expect(
      holidays2008.find(
        (h) => h.date.getMonth() === 4 && h.date.getDate() === 5,
      )?.name,
    ).toBe("こどもの日");

    // 2009年5月
    // 5/3(日) 憲法記念日 -> 5/6(水) 振替 (5/4, 5/5は祝日)
    const holidays2009 = getHolidays(2009);
    const may6_2009 = holidays2009.find(
      (h) => h.date.getMonth() === 4 && h.date.getDate() === 6,
    );
    expect(may6_2009).toBeDefined();
    expect(may6_2009?.name).toBe("振替休日");

    // 5/3が日曜日であることを確認
    expect(new Date(2009, 4, 3).getDay()).toBe(0);
  });

  test("isHolidayがbooleanを返すこと", () => {
    // 元日 (祝日)
    expect(isHoliday(new Date(2025, 0, 1))).toBe(true);
    // 平日
    expect(isHoliday(new Date(2025, 0, 2))).toBe(false);
  });
});
