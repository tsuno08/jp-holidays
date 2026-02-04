# jp-holidays

モダンで軽量な日本の祝日計算ライブラリです。
依存関係を一切持たず、TypeScriptで書かれています。

## 特徴

- **軽量**: 依存関係ゼロ (Zero dependencies)
- **モダン**: TypeScript, ESM/CJS 両対応
- **正確**:
  ハッピーマンデー、振替休日、国民の休日、春分・秋分の日（簡易計算）に対応
- **特例対応**:
  2019年の天皇即位、2020/2021年の五輪に伴う移動など、過去の特例にも対応
- **対応期間**: 1948年（祝日法施行）から2099年まで（春分・秋分の日予測を含む） ※
  将来の法改正により変更される可能性があります。

## インストール

```bash
npm install jp-holidays
# or
pnpm add jp-holidays
# or
yarn add jp-holidays
```

## 使い方

### 今日の日付が祝日か判定する

```ts
import { isHoliday } from "jp-holidays";

const today = new Date();
const holidayName = isHoliday(today);

if (holidayName) {
  console.log(`今日は${holidayName}です！`);
} else {
  console.log("今日は祝日ではありません。");
}
```

### 指定した年の祝日一覧を取得する

```ts
import { getHolidaysInYear } from "jp-holidays";

const holidays = getHolidaysInYear(2025);

holidays.forEach((holiday) => {
  console.log(`${holiday.date.toLocaleDateString()}: ${holiday.name}`);
});
// 出力例:
// 2025/1/1: 元日
// 2025/1/13: 成人の日
// ...
```

## 対応している祝日ルール

- **固定日**: 元日、建国記念の日、天皇誕生日など
- **ハッピーマンデー**: 成人の日、海の日、敬老の日、スポーツの日
- **春分・秋分の日**: 簡易計算式により算出 (1948年〜2099年まで対応)
- **振替休日**: 祝日が日曜日の場合の振替
- **国民の休日**: 祝日に挟まれた平日

## 免責事項

本ライブラリは可能な限り正確な祝日計算を行うよう努めていますが、将来の法改正や計算基準の変更により、実際の日付と異なる可能性があります。
本ライブラリの使用により生じたいかなる損害についても、作者は責任を負いかねます。重要な業務等で使用する場合は、必ず内閣府等の公式情報と照らし合わせてご確認ください。

## ライセンス

MIT
