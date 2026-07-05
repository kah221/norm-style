import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import style from "./styles/normDashboard.scss";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/normDashboard.inline.ts";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface NormDashboardOptions {
  className?: string;
}

export default ((opts?: NormDashboardOptions) => {
  const { className = "norm-dashboard" } = opts ?? {};

  const Component: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
    const wordFiles = allFiles.filter((f) => f.slug && /^_word\//i.test(f.slug));
    const personFiles = allFiles.filter((f) => f.slug && /^_name\//i.test(f.slug));

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
      const created = f.dates?.created;
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
    );
  };

  Component.css = style;
  Component.afterDOMLoaded = script;

  return Component;
}) satisfies QuartzComponentConstructor;