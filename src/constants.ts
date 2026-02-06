// 固定日の祝日（現在継続中のものおよび過去のものを含む）。継続中のものは end: TMP_END_YEAR としている
export const TMP_END_YEAR = 2099;

export const FIXED_HOLIDAYS: {
  date: string;
  name: string;
  start: number;
  end: number;
}[] = [
  { date: "01-01", name: "元日", start: 1948, end: TMP_END_YEAR },
  { date: "01-15", name: "成人の日", start: 1948, end: 1999 },
  { date: "02-11", name: "建国記念の日", start: 1966, end: TMP_END_YEAR },
  { date: "02-23", name: "天皇誕生日", start: 2020, end: TMP_END_YEAR },
  { date: "04-10", name: "皇太子明仁親王の結婚の儀", start: 1959, end: 1959 },
  { date: "04-29", name: "天皇誕生日", start: 1949, end: 1988 },
  { date: "04-29", name: "みどりの日", start: 1989, end: 2006 },
  { date: "04-29", name: "昭和の日", start: 2007, end: TMP_END_YEAR },
  { date: "05-01", name: "天皇の即位の日", start: 2019, end: 2019 },
  { date: "05-03", name: "憲法記念日", start: 1948, end: TMP_END_YEAR },
  { date: "05-04", name: "みどりの日", start: 2007, end: TMP_END_YEAR },
  { date: "05-05", name: "こどもの日", start: 1948, end: TMP_END_YEAR },
  { date: "06-09", name: "皇太子徳仁親王の結婚の儀", start: 1993, end: 1993 },
  { date: "07-20", name: "海の日", start: 1996, end: 2002 },
  { date: "07-22", name: "海の日", start: 2021, end: 2021 },
  { date: "07-23", name: "海の日", start: 2020, end: 2020 },
  { date: "07-23", name: "スポーツの日", start: 2021, end: 2021 },
  { date: "07-24", name: "スポーツの日", start: 2020, end: 2020 },
  { date: "08-08", name: "山の日", start: 2021, end: 2021 },
  { date: "08-10", name: "山の日", start: 2020, end: 2020 },
  { date: "08-11", name: "山の日", start: 2016, end: 2019 },
  { date: "08-11", name: "山の日", start: 2022, end: TMP_END_YEAR },
  { date: "09-15", name: "敬老の日", start: 1966, end: 2002 },
  { date: "10-10", name: "体育の日", start: 1966, end: 1999 },
  { date: "10-22", name: "即位礼正殿の儀の行われる日", start: 2019, end: 2019 },
  { date: "11-03", name: "文化の日", start: 1948, end: TMP_END_YEAR },
  { date: "11-12", name: "即位礼正殿の儀", start: 1990, end: 1990 },
  { date: "11-23", name: "勤労感謝の日", start: 1948, end: TMP_END_YEAR },
  { date: "12-23", name: "天皇誕生日", start: 1989, end: 2018 },
  { date: "02-24", name: "昭和天皇の大喪の礼", start: 1989, end: 1989 },
];

export const HAPPY_MONDAY_HOLIDAYS = [
  {
    month: 1,
    week: 2,
    name: "成人の日",
    start: 2000,
    end: TMP_END_YEAR,
  },
  {
    month: 7,
    week: 3,
    name: "海の日",
    start: 2003,
    end: 2019,
  },
  {
    month: 7,
    week: 3,
    name: "海の日",
    start: 2022,
    end: TMP_END_YEAR,
  },
  {
    month: 9,
    week: 3,
    name: "敬老の日",
    start: 2003,
    end: TMP_END_YEAR,
  },
  {
    month: 10,
    week: 2,
    name: "体育の日",
    start: 2000,
    end: 2019,
  },
  {
    month: 10,
    week: 2,
    name: "スポーツの日",
    start: 2022,
    end: TMP_END_YEAR,
  },
];
