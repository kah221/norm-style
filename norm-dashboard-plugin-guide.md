# norm ダッシュボード用コンポーネントプラグイン実装ガイド

対象：`kah221.github.io/norm` のトップページ（index.md）に，登録単語数・分野別/要素別内訳・登録推移の棒グラフを表示する．

---

## 0. 前提と設計方針

- Quartz v5では，独自ロジックを持つコンポーネントは**別リポジトリのプラグインパッケージ**として実装し，`npx quartz plugin add github:...` で導入する方式が公式手順である．norm本体の`quartz.config.yaml`を編集するだけでは実現できない．
- 集計はビルド時に行う．各ページの`allFiles`（全ファイルのメタデータ配列）から，`_Word/`配下のファイルの`frontmatter.tags`（分野・要素）と作成日時（`dates.created`）を読み取り，JSONとしてページに埋め込む．
- 棒グラフは外部ライブラリを使わず，素のSVG＋JavaScriptで描画する．日別／週別／月別／年別はブラウザ側でボタン切り替え・再集計する．
- 表示はindex.mdのみに限定する（`quartz.ts`で条件分岐）．

**検証が必要な箇所（注意）**：JSXでの`<script>`埋め込み記法（`dangerouslySetInnerHTML`）と，`quartz.ts`の`byPageType`上書きが既定配列を「置換」するか「追記」するかは，実際のnormリポジトリのバージョンで確認していない．ローカルの`npx quartz build --serve`で必ず表示崩れがないか確認してから本番pushすること（既存の運用方針どおり）．

---

## 1. 新規リポジトリの作成

```
git clone https://github.com/quartz-community/plugin-template.git norm-dashboard
cd norm-dashboard
npm install
```

GitHubに`kah221/norm-dashboard`として公開する（publicでよい．秘匿情報は含まない）．

---

## 2. `package.json` の修正

テンプレートの`package.json`に，コンポーネント専用プラグインである宣言を追加する．

```json
{
  "name": "norm-dashboard",
  "quartz": {
    "category": ["component"]
  }
}
```

---

## 3. `src/index.tsx`

```tsx
import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import script from "./chart.inline.ts"
import styles from "./styles.scss"

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const NormDashboard: QuartzComponentConstructor = () => {
  const Dashboard: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
    // _Word/ 配下のみを対象にする（大文字小文字は問わない）
    const wordFiles = allFiles.filter((f) => f.slug && /^_word\//i.test(f.slug))
    const personFiles = allFiles.filter((f) => f.slug && /^_name\//i.test(f.slug))

    const byField: Record<string, { count: number; sub: Record<string, number> }> = {}
    const byElement: Record<string, number> = {}
    const timelineMap: Record<string, number> = {}

    for (const f of wordFiles) {
      const tags = (f.frontmatter?.tags as string[]) ?? []
      for (const t of tags) {
        const parts = t.split("/")
        if (parts[0] === "分野" && parts[1]) {
          byField[parts[1]] ??= { count: 0, sub: {} }
          byField[parts[1]].count += 1
          if (parts[2]) {
            byField[parts[1]].sub[parts[2]] = (byField[parts[1]].sub[parts[2]] ?? 0) + 1
          }
        } else if (parts[0] === "要素" && parts[1]) {
          byElement[parts[1]] = (byElement[parts[1]] ?? 0) + 1
        }
      }
      const created = f.dates?.created
      if (created) {
        const key = toDateStr(new Date(created))
        timelineMap[key] = (timelineMap[key] ?? 0) + 1
      }
    }

    const statsData = {
      totalWords: wordFiles.length,
      totalPersons: personFiles.length,
      byField,
      byElement,
      timeline: Object.entries(timelineMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
    }

    const fieldEntries = Object.entries(byField).sort((a, b) => b[1].count - a[1].count)
    const elementEntries = Object.entries(byElement).sort((a, b) => b[1] - a[1])

    return (
      <div class="norm-dashboard">
        <h2>norm 全体像</h2>

        <div class="norm-summary-grid">
          <div class="norm-stat-card">
            <span class="norm-stat-number">{wordFiles.length}</span>
            <span class="norm-stat-label">登録単語数</span>
          </div>
          <div class="norm-stat-card">
            <span class="norm-stat-number">{personFiles.length}</span>
            <span class="norm-stat-label">登録人物数</span>
          </div>
        </div>

        <h3>分野別</h3>
        <ul class="norm-field-list">
          {fieldEntries.map(([name, v]) => (
            <li>
              <span class="norm-field-name">{name}</span>
              <span class="norm-field-count">{v.count}</span>
            </li>
          ))}
        </ul>

        <h3>要素別</h3>
        <ul class="norm-field-list">
          {elementEntries.map(([name, count]) => (
            <li>
              <span class="norm-field-name">{name}</span>
              <span class="norm-field-count">{count}</span>
            </li>
          ))}
        </ul>

        <h3>登録推移</h3>
        <div class="norm-chart-controls">
          <button data-granularity="day" class="active">日別</button>
          <button data-granularity="week">週別</button>
          <button data-granularity="month">月別</button>
          <button data-granularity="year">年別</button>
        </div>
        <div id="norm-chart-container" class="norm-chart-container"></div>

        <script
          type="application/json"
          id="norm-stats-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(statsData) }}
        />
      </div>
    )
  }

  Dashboard.css = styles
  Dashboard.afterDOMLoaded = script
  return Dashboard
}

export default NormDashboard
```

**注**：`dangerouslySetInnerHTML`によるJSON埋め込みが，normの実際のQuartzビルド環境（Preactベース）でそのまま通るかは未検証．エラーになる場合は，`<script>`タグを使わず，コンポーネント自体を`data-*`属性にJSON文字列を持たせる方式（例：`<div id="norm-stats-data" data-stats={JSON.stringify(statsData)} />`）に変更する．

---

## 4. `src/chart.inline.ts`

```ts
type TimelinePoint = { date: string; count: number }
type Granularity = "day" | "week" | "month" | "year"

function aggregate(timeline: TimelinePoint[], granularity: Granularity) {
  const map = new Map<string, number>()
  for (const { date, count } of timeline) {
    const d = new Date(date + "T00:00:00")
    let key: string
    if (granularity === "day") {
      key = date
    } else if (granularity === "month") {
      key = date.slice(0, 7)
    } else if (granularity === "year") {
      key = date.slice(0, 4)
    } else {
      // 週別：月曜始まりのISO週
      const day = d.getDay()
      const diff = (day === 0 ? -6 : 1) - day
      const monday = new Date(d)
      monday.setDate(d.getDate() + diff)
      key = monday.toISOString().slice(0, 10)
    }
    map.set(key, (map.get(key) ?? 0) + count)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }))
}

function renderChart(container: HTMLElement, data: { label: string; value: number }[]) {
  const width = container.clientWidth || 600
  const height = 180
  const barGap = 4
  const barWidth = Math.max(3, Math.floor(width / Math.max(1, data.length)) - barGap)
  const max = Math.max(1, ...data.map((d) => d.value))
  const svgns = "http://www.w3.org/2000/svg"

  const svg = document.createElementNS(svgns, "svg")
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  svg.setAttribute("width", "100%")
  svg.setAttribute("class", "norm-chart-svg")

  data.forEach((d, i) => {
    const barHeight = (d.value / max) * (height - 4)
    const rect = document.createElementNS(svgns, "rect")
    rect.setAttribute("x", String(i * (barWidth + barGap)))
    rect.setAttribute("y", String(height - barHeight))
    rect.setAttribute("width", String(barWidth))
    rect.setAttribute("height", String(barHeight))
    rect.setAttribute("class", "norm-chart-bar")
    const title = document.createElementNS(svgns, "title")
    title.textContent = `${d.label}：${d.value}`
    rect.appendChild(title)
    svg.appendChild(rect)
  })

  container.innerHTML = ""
  container.appendChild(svg)
}

function setupNormDashboard() {
  const dataEl = document.getElementById("norm-stats-data")
  const container = document.getElementById("norm-chart-container")
  if (!dataEl || !container) return

  let stats: { timeline: TimelinePoint[] }
  try {
    stats = JSON.parse(dataEl.textContent || "{}")
  } catch {
    return
  }
  const timeline = stats.timeline ?? []

  function update(granularity: Granularity) {
    renderChart(container as HTMLElement, aggregate(timeline, granularity))
  }

  const buttons = document.querySelectorAll<HTMLButtonElement>(".norm-chart-controls button")
  buttons.forEach((btn) => {
    const handler = () => {
      buttons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      update((btn.dataset.granularity as Granularity) ?? "day")
    }
    btn.addEventListener("click", handler)
    window.addCleanup(() => btn.removeEventListener("click", handler))
  })

  update("day")
}

document.addEventListener("nav", setupNormDashboard)
```

---

## 5. `src/styles.scss`

```scss
.norm-dashboard {
  margin-bottom: 2rem;

  h2,
  h3 {
    margin-top: 1.5rem;
  }

  .norm-summary-grid {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  .norm-stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1.5rem;
    border: 1px solid var(--lightgray);
    border-radius: 6px;
    min-width: 100px;
  }

  .norm-stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--secondary);
  }

  .norm-stat-label {
    font-size: 0.85rem;
    color: var(--darkgray);
  }

  .norm-field-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    li {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.3rem 0.8rem;
      background: var(--lightgray);
      border-radius: 4px;
      min-width: 140px;
    }

    .norm-field-count {
      font-weight: 700;
      color: var(--secondary);
    }
  }

  .norm-chart-controls {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0;

    button {
      padding: 0.3rem 0.8rem;
      border: 1px solid var(--lightgray);
      border-radius: 4px;
      background: transparent;
      color: var(--dark);
      cursor: pointer;

      &.active {
        background: var(--secondary);
        color: var(--light);
      }
    }
  }

  .norm-chart-container {
    width: 100%;
  }

  .norm-chart-bar {
    fill: var(--secondary);
  }
}
```

---

## 6. normリポジトリ側の導入手順

```
npx quartz plugin add github:kah221/norm-dashboard
```

これで`quartz.config.yaml`にエントリが自動追加される．デフォルトで全ページに表示されないよう，位置指定はYAML側で行わず，`quartz.ts`側で条件分岐を行う．

`quartz.ts`（既存になければ新規作成．既存の`beforeBody`の並びは，実際の`quartz.config.yaml`のレイアウト定義から確認して合わせること）：

```ts
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import * as Component from "./quartz/components"

const config = await loadQuartzConfig()
export default config

export const layout = await loadQuartzLayout({
  byPageType: {
    content: {
      beforeBody: [
        // 既存のbeforeBodyコンポーネント（Breadcrumbs, ArticleTitle, ContentMeta, TagListなど）を
        // quartz.config.yamlの定義順にここへ列挙し直した上で，末尾に追加する
        Component.ConditionalRender({
          component: ExternalPlugin.NormDashboard(),
          condition: (props) => props.fileData.slug === "index",
        }),
      ],
    },
  },
})
```

**要確認事項**：`byPageType.content.beforeBody`が「既定配列への追記」なのか「完全な置換」なのかは，実際の挙動をローカルビルドで確認すること．完全な置換だった場合，既存のBreadcrumbs等の`quartz-community`プラグインを`ExternalPlugin.Breadcrumbs()`のように併記し直す必要がある．

---

## 7. ローカル確認手順（既存の運用方針どおり）

```
cmd
npx quartz plugin install
npx quartz build -d . --serve
```

`localhost:8080` でindex.mdを開き，以下を確認する．

- ダッシュボードが表示されるのはindex.mdのみであること
- 単語数・分野別・要素別の数字が，Explorer上のファイル数と一致すること
- 日別／週別／月別／年別の切り替えでグラフが正しく再描画されること

問題なければ，シークレットウィンドウで最終確認の上push する．

---

## 8. 今後の拡張候補

- 分野タグの階層（例：制御工学の下の古典制御／現代制御）を，棒グラフでなく積み上げ表示にする
- ダッシュボードをhub専用ページ（別ファイル）に分離し，index.mdは簡潔な入口ページのままにする
- グラフのdepth: 5設定と連動させ，ダッシュボードから特定分野のグラフビューに遷移できるリンクを追加する
