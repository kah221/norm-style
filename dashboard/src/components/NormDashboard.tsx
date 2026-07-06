import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import style from "./styles/normDashboard.scss";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/normDashboard.inline.ts";
import fs from "node:fs"; //
import path from "node:path"; //
import katex from "katex"; // 「直近の追加」項目で数式を描画するため

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 260707_0124
// タイムゾーン違いで表示が-9時間になっていたのでfrontmatterのdateを日本時間として読み込むためのヘルパー関数
function parseTimeAsJST(timeStr: string): Date {
  // タイムゾーン表記（Z や +09:00 など）が既に含まれていればそのまま，
  // 無ければ日本時間（+09:00）として明示的に解釈
  const hasTimezone = /[Zz]|[+-]\d{2}:?\d{2}$/.test(timeStr);
  const normalized = timeStr.trim().replace(" ", "T");
  return hasTimezone ? new Date(normalized) : new Date(`${normalized}+09:00`);
}

export interface NormDashboardOptions {
  className?: string;
}

export default ((opts?: NormDashboardOptions) => {
  const { className = "norm-dashboard" } = opts ?? {};

  const Component: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") {  // indexページにだけ表示する
        return null;
    }
    console.error("NORM_DASHBOARD_RENDER_CHECK", allFiles.length); // 実験
    const wordFiles = allFiles.filter(
    (f) => f.slug && /^_word\//i.test(f.slug) && f.frontmatter?.en, // フロントマターにenが含まれているファイルだけを探す（enは確実に登録する．一方で自動生成される_wordのindexページにはenが無いのでカウントから外れる）
    );
    const personFiles = allFiles.filter(
    (f) => f.slug && /^_name\//i.test(f.slug) && f.frontmatter?.en, // ↑と同様の理由
    );

    // 直近の追加を表示する
    function extractDefinition(relativePath?: string): string | null {
        if (!relativePath) return null;
        try {
            const fullPath = path.resolve(process.cwd(), relativePath);
            const raw = fs.readFileSync(fullPath, "utf-8");
            const match = raw.match(/^>\s?(.+)$/m);
            return match?.[1]?.trim() ?? null; // ←記法???
        } catch {
            return null;
        }
    }

    // 直近の追加項目で数式を描画する
    function renderInlineMath(text: string): string {
    const escapeHtml = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return text
        .split(/(\$[^$]+\$)/g)
        .map((part) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 1) {
            try {
            return katex.renderToString(part.slice(1, -1), { throwOnError: false });
            } catch {
            return escapeHtml(part);
            }
        }
        return escapeHtml(part);
        })
        .join("");
    }

    function timeAgo(d: Date): string {
        const diffMs = Date.now() - d.getTime();
        const minutes = Math.floor(diffMs / 60000);
        if (minutes < 60) return `${minutes}分前`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}時間前`;
        const days = Math.floor(hours / 24);
        return `${days}日前`;
    }

    function formatDateTime(d: Date): string {
        const m = d.getMonth() + 1;
        const day = d.getDate();
        const h = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${m}/${day} ${h}:${min}`;
    }

    const recentEntries = [...wordFiles, ...personFiles]
        .map((f) => {
            const created = f.frontmatter?.time
            ? parseTimeAsJST(f.frontmatter.time as string) // 関数で日本時間で解釈
            : f.dates?.created;
            return { f, created };
    })
    .filter((e) => e.created)
    .sort((a, b) => (b.created as Date).getTime() - (a.created as Date).getTime())
    // .slice(0, 5)
    .map((e) => {
        // frontmatterのjpとenをそれぞれ読み取り，文字列として結合する
        const fm = e.f.frontmatter as { jp?: string; en?: string };
        return {
            jp: fm?.jp,
            en: fm?.en,
            slug: e.f.slug,
            created: e.created as Date,
            definition: extractDefinition(e.f.filePath as string | undefined),
        };
    });

    for (const f of wordFiles.slice(0, 3)) {
       console.error("NORM_DEBUG_DATE", f.slug, JSON.stringify(f.dates));
    }

    const byField: Record<string, { count: number; sub: Record<string, number> }> = {};
    const byElement: Record<string, number> = {};
    const timelineMap: Record<string, number> = {};

    for (const f of wordFiles) {
      const tags = (f.frontmatter?.tags as string[]) ?? [];
      for (const t of tags) {
        const parts = t.split("/");
        if (parts[0] === "分野" && parts[1]) {
        byField[parts[1]] ??= { count: 0, sub: {} };
        byField[parts[1]]!.count += 1;
        if (parts[2]) {
            byField[parts[1]]!.sub[parts[2]] = (byField[parts[1]]!.sub[parts[2]] ?? 0) + 1;
        }
        } else if (parts[0] === "要素" && parts[1]) {
          byElement[parts[1]] = (byElement[parts[1]] ?? 0) + 1;
        }
      }
      // ↓ファイル(単語と人物)の作成日時は，Quartzの処理で行わず，各ファイルの冒頭のfrontmatterのtimeを用いる
      const created = f.frontmatter?.time
        ? parseTimeAsJST(f.frontmatter.time as string) // 関数呼び出しで日本時間で解釈
        : f.dates?.created;
      if (created) {
        const key = toDateStr(new Date(created));
        timelineMap[key] = (timelineMap[key] ?? 0) + 1;
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
    };

    const fieldEntries = Object.entries(byField).sort((a, b) => b[1].count - a[1].count);
    const elementEntries = Object.entries(byElement).sort((a, b) => b[1] - a[1]);

    return (
      <div class={classNames(className)}>
        <h2>統計</h2>

        <div class="norm-summary-grid">
            <a class="norm-stat-card" href="_word/">
                <span class="norm-stat-number">{wordFiles.length}</span>
                <span class="norm-stat-label">単語</span>
            </a>
            <a class="norm-stat-card" href="_name/">
                <span class="norm-stat-number">{personFiles.length}</span>
                <span class="norm-stat-label">人物</span>
            </a>
        </div>

        <h3>登録推移</h3>
        <div class="norm-chart-controls">
          <button data-granularity="day" class="active">日別</button>
          <button data-granularity="week">週別</button>
          <button data-granularity="month">月別</button>
          <button data-granularity="year">年別</button>
        </div>
        <div id="norm-chart-container" class="norm-chart-container"></div>

        <h3>分野別</h3>
        <ul class="norm-field-list">
        {fieldEntries.map(([name, v]) => (
            <li>
            <a class="norm-field-link" href={`tags/分野/${encodeURIComponent(name)}`}>
                <span class="norm-field-name">{name}</span>
                <span class="norm-field-count">{v.count}</span>
            </a>
            </li>
        ))}
        </ul>

        <h3>要素別</h3>
        <ul class="norm-field-list">
        {elementEntries.map(([name, count]) => (
            <li>
            <a class="norm-field-link" href={`tags/要素/${encodeURIComponent(name)}`}>
                <span class="norm-field-name">{name}</span>
                <span class="norm-field-count">{count}</span>
            </a>
            </li>
        ))}
        </ul>

        {/*  */}

        <h3>新着↓↓</h3>
        <ul class="norm-recent-list" id="norm-recent-list">
          {recentEntries.slice(0, 5).map((e) => (
            <li>
                <a href={e.slug as string} class="norm-recent-link">
                    <div class="norm-recent-header">
                    <div class="norm-recent-names">
                        <span class="norm-recent-jp">{e.jp}</span>
                        <span class="norm-recent-en">{e.en}</span>
                    </div>
                    <span class="norm-recent-time">
                        {formatDateTime(e.created)}（{timeAgo(e.created)}）
                    </span>
                    </div>
                    {e.definition && (
                    <p
                        class="norm-recent-definition"
                        dangerouslySetInnerHTML={{ __html: renderInlineMath(e.definition) }}
                    />
                    )}
                </a>
            </li>
          ))}
        </ul>

        {recentEntries.length > 5 && (
        <p id="norm-recent-count" class="norm-recent-count"></p>
        )}

        {recentEntries.length > 5 && (
        <button id="norm-recent-more" class="norm-recent-more-button">
            さらに表示
        </button>
        )}
        {recentEntries.length > 20 && ( // ■
        <div id="norm-recent-limit" class="norm-recent-limit" style={{ display: "none" }}>
            <p class="norm-recent-limit-text">このページでの表示限界(＠_＠;)</p>
            <div class="norm-recent-limit-buttons">
            <a href="_word/" class="norm-recent-limit-button">単語</a>
            <a href="_name/" class="norm-recent-limit-button">人物</a>
            <button id="norm-recent-scroll-top" class="norm-recent-limit-button">一番上へ</button>
            </div>
        </div>
        )}

        <script
        type="application/json"
        id="norm-recent-data"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(
            recentEntries.slice(0, 20).map((e) => ({ // ■
                jp: e.jp,
                en: e.en,
                slug: e.slug,
                dateTimeLabel: formatDateTime(e.created),
                agoLabel: timeAgo(e.created),
                definitionHtml: e.definition ? renderInlineMath(e.definition) : null,
            })),
            ),
        }}
        />

        {/*  */}

        <script
          type="application/json"
          id="norm-stats-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(statsData) }}
        />
      </div>
    );
  };

  Component.css = style;
  Component.afterDOMLoaded = script;

  return Component;
}) satisfies QuartzComponentConstructor;