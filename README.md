# nekoist

36の質問から猫愛の傾向を測り、通常9タイプ・覚醒7タイプのうち1タイプを返す日本語の診断アプリです。

## MVPでできること

- トップ画面から診断を開始
- 1〜5の5段階で36問に回答
- 12属性を0〜100へ正規化
- 覚醒7タイプを先に厳格判定
- 覚醒しない場合は通常9タイプを比較
- 結果1タイプ、説明、特徴、上位3属性を表示
- 前の質問へ戻る・最初からやり直す

## 開発環境

- Next.js 16（App Router）
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- pnpm

## 起動

```bash
pnpm install
pnpm dev
```

ブラウザで `http://localhost:3000` を開きます。

## 公開URL

GitHub Pages: <https://y-arai58.github.io/nekoist/>

`main` ブランチへ変更を送ると、GitHub Actionsが静的サイトを生成してGitHub Pagesへ自動公開します。手動で再公開する場合は、GitHubのActions画面から `Deploy Next.js site to Pages` を実行します。

## 確認

```bash
pnpm test
pnpm lint
pnpm build
```

## 構成

```text
src/
├── app/                  # ページ、メタデータ、全体スタイル
├── components/           # 診断UIと画面遷移
└── domain/
    ├── questions.ts      # 36問と左右の属性割り当て
    ├── results.ts        # 16タイプの表示定義
    ├── scoring.ts        # 正規化、覚醒・通常判定、同点処理
    ├── scoring.test.ts   # 判定エンジンのテスト
    └── types.ts          # ドメイン型
```

UIと判定ロジックを分け、質問・結果文・判定式をそれぞれ独立して変更できるようにしています。判定仕様の詳細は [docs/diagnosis-spec.md](docs/diagnosis-spec.md) を参照してください。

## 現在の範囲

MVPはブラウザ内で完結し、回答の送信・保存、ログイン、SNSシェア、分析基盤は含みません。実回答データでタイプ分布と覚醒率を検証し、閾値を調整する想定です。
