type TimelinePoint = { date: string; count: number };
type Granularity = "day" | "week" | "month" | "year";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mondayOf(d: Date): Date {
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function keyOf(d: Date, granularity: Granularity): string {
  if (granularity === "day") return toDateStr(d);
  if (granularity === "week") return toDateStr(mondayOf(d));
  if (granularity === "month") return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return String(d.getFullYear());
}

function formatLabel(key: string, granularity: Granularity): string {
  if (granularity === "day" || granularity === "week") {
    const [, m, d] = key.split("-");
    return `${Number(m)}/${Number(d)}`;
  }
  if (granularity === "month") {
    const [y, m] = key.split("-");
    return `${y}/${Number(m)}`;
  }
  return key; // year
}

// 今日を起点に，各粒度で遡る期間と刻み幅を定義する
function generateBuckets(granularity: Granularity): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const keys: string[] = [];

  if (granularity === "day") {
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      keys.push(keyOf(d, "day"));
    }
  } else if (granularity === "week") {
    const start = mondayOf(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()));
    const end = mondayOf(today);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      keys.push(keyOf(d, "week"));
    }
  } else if (granularity === "month") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      keys.push(keyOf(d, "month"));
    }
  } else {
    for (let i = 9; i >= 0; i--) {
      keys.push(String(today.getFullYear() - i));
    }
  }
  return keys;
}

function aggregate(timeline: TimelinePoint[], granularity: Granularity) {
  const sums = new Map<string, number>();
  for (const { date, count } of timeline) {
    const d = new Date(date + "T00:00:00");
    const key = keyOf(d, granularity);
    sums.set(key, (sums.get(key) ?? 0) + count);
  }

  const buckets = generateBuckets(granularity);
  return buckets.map((key) => ({
    label: formatLabel(key, granularity),
    value: sums.get(key) ?? 0,
  }));
}

function renderChart(
  container: HTMLElement,
  data: { label: string; value: number }[],
  granularity: Granularity,
) {
  const totalWidth = container.clientWidth || 600;
  const leftMargin = 36;
  const bottomMargin = 26;
  const topMargin = 20;
  const chartHeight = 160;
  const chartWidth = totalWidth - leftMargin;
  const barGap = 4;
  const barWidth = Math.max(3, Math.floor(chartWidth / Math.max(1, data.length)) - barGap);
  const max = Math.max(1, ...data.map((d) => d.value));
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const axisFontSize = isMobile ? 8 : 10;
  const svgns = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgns, "svg");
  svg.setAttribute("viewBox", `0 0 ${totalWidth} ${topMargin + chartHeight + bottomMargin}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("class", "norm-chart-svg");

  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  ticks.forEach((tickValue) => {
    const y = topMargin + chartHeight - (tickValue / max) * chartHeight;
    const line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", String(leftMargin));
    line.setAttribute("x2", String(totalWidth));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("class", "norm-chart-gridline");
    svg.appendChild(line);

    const label = document.createElementNS(svgns, "text");
    label.setAttribute("x", String(leftMargin - 6));
    label.setAttribute("y", String(y + 3));
    label.setAttribute("text-anchor", "end");
    label.setAttribute("class", "norm-chart-y-axis");
    label.setAttribute("font-size", String(axisFontSize));
    label.textContent = String(tickValue);
    svg.appendChild(label);
  });

  let labelStep = Math.max(1, Math.ceil(data.length / 14));
  if (isMobile && granularity === "day") {
    labelStep *= 3;
  } else if (isMobile && granularity === "month") {
    labelStep *= 2;
  }

  data.forEach((d, i) => {
    const barHeight = (d.value / max) * chartHeight;
    const x = leftMargin + i * (barWidth + barGap);
    const y = topMargin + chartHeight - barHeight;

    const rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(barWidth));
    rect.setAttribute("height", String(barHeight));
    rect.setAttribute("class", "norm-chart-bar");
    const title = document.createElementNS(svgns, "title");
    title.textContent = `${d.label}：${d.value}`;
    rect.appendChild(title);
    svg.appendChild(rect);

    if (barWidth >= 12 && d.value > 0) {
      const valueLabel = document.createElementNS(svgns, "text");
      valueLabel.setAttribute("x", String(x + barWidth / 2));
      valueLabel.setAttribute("y", String(y - 4));
      valueLabel.setAttribute("class", "norm-chart-value-label");
      valueLabel.textContent = String(d.value);
      svg.appendChild(valueLabel);
    }

    if (i % labelStep === 0) {
      const xLabel = document.createElementNS(svgns, "text");
      xLabel.setAttribute("x", String(x + barWidth / 2));
      xLabel.setAttribute("y", String(topMargin + chartHeight + 16));
      xLabel.setAttribute("text-anchor", "middle");
      xLabel.setAttribute("class", "norm-chart-x-axis");
      xLabel.setAttribute("font-size", String(axisFontSize));
      xLabel.textContent = d.label;
      svg.appendChild(xLabel);
    }
  });

  container.innerHTML = "";
  container.appendChild(svg);
}

type RecentItem = {
  jp?: string;
  en?: string;
  slug: string;
  dateTimeLabel: string;
  agoLabel: string;
  definitionHtml: string | null;
};

function buildCard(item: RecentItem): HTMLLIElement {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = item.slug;
  a.className = "norm-recent-link";

  const header = document.createElement("div");
  header.className = "norm-recent-header";

  const names = document.createElement("div");
  names.className = "norm-recent-names";
  const jpSpan = document.createElement("span");
  jpSpan.className = "norm-recent-jp";
  jpSpan.textContent = item.jp ?? "";
  const enSpan = document.createElement("span");
  enSpan.className = "norm-recent-en";
  enSpan.textContent = item.en ?? "";
  names.appendChild(jpSpan);
  names.appendChild(enSpan);

  const time = document.createElement("span");
  time.className = "norm-recent-time";
  time.textContent = `${item.dateTimeLabel}（${item.agoLabel}）`;

  header.appendChild(names);
  header.appendChild(time);
  a.appendChild(header);

  if (item.definitionHtml) {
    const p = document.createElement("p");
    p.className = "norm-recent-definition";
    p.innerHTML = item.definitionHtml;
    a.appendChild(p);
  }

  li.appendChild(a);
  return li;
}

function setupNormDashboard() {
  const dataEl = document.getElementById("norm-stats-data");
  const container = document.getElementById("norm-chart-container");
  if (dataEl && container) {
    let stats: { timeline: TimelinePoint[] };
    try {
      stats = JSON.parse(dataEl.textContent || "{}");
      const timeline = stats.timeline ?? [];

      function update(granularity: Granularity) {
        renderChart(container as HTMLElement, aggregate(timeline, granularity), granularity);
      }

      const buttons = document.querySelectorAll<HTMLButtonElement>(".norm-chart-controls button");
      buttons.forEach((btn) => {
        const handler = () => {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          update((btn.dataset.granularity as Granularity) ?? "day");
        };
        btn.addEventListener("click", handler);
        window.addCleanup(() => btn.removeEventListener("click", handler));
      });

      update("day");
    } catch {
      // 統計データが無い・壊れている場合は何もしない
    }
  }

  // 「直近の追加」：さらに表示ボタン（JSON方式・5件ずつ・上限100件）
  const moreButton = document.getElementById("norm-recent-more");
  const limitBlock = document.getElementById("norm-recent-limit");
  const scrollTopButton = document.getElementById("norm-recent-scroll-top");
  const recentList = document.getElementById("norm-recent-list");
  const recentDataEl = document.getElementById("norm-recent-data");

  if (moreButton && recentList && recentDataEl) {
    let recentData: RecentItem[] = [];
    try {
      recentData = JSON.parse(recentDataEl.textContent || "[]");
    } catch {
      recentData = [];
    }

    const countEl = document.getElementById("norm-recent-count");
    let shown = Math.min(5, recentData.length); // 最初の5件はサーバー側で描画済み

    const updateCount = () => {
      if (countEl) {
        countEl.textContent = `${shown}/${recentData.length}`;
      }
    };
    updateCount();

    const revealMore = () => {
      const next = recentData.slice(shown, shown + 5);
      next.forEach((item) => recentList.appendChild(buildCard(item)));
      shown += next.length;
      updateCount();

      if (shown >= recentData.length) {
        (moreButton as HTMLElement).style.display = "none";
        if (limitBlock) {
          (limitBlock as HTMLElement).style.display = "block";
        }
      }
    };

    moreButton.addEventListener("click", revealMore);
    window.addCleanup(() => moreButton.removeEventListener("click", revealMore));
  }

  if (scrollTopButton) {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    scrollTopButton.addEventListener("click", scrollToTop);
    window.addCleanup(() => scrollTopButton.removeEventListener("click", scrollToTop));
  }
}

document.addEventListener("nav", setupNormDashboard);