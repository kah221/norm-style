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
  const isMobile = window.matchMedia("(max-width: 480px)").matches; // スマホサイズ対応
  const axisFontSize = isMobile ? 8 : 10; // スマホサイズ対応
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
    label.setAttribute("font-size", String(axisFontSize)); // フォントサイズを反映させる
    label.textContent = String(tickValue);
    svg.appendChild(label);
  });

    let labelStep = Math.max(1, Math.ceil(data.length / 14));
    if (isMobile && granularity === "day") {
      labelStep *= 3; // スマホでの日別：3つ置き
    } else if (isMobile && granularity === "month") {
      labelStep *= 2; // スマホでの月別：2つ置き
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
      xLabel.setAttribute("font-size", String(axisFontSize)); // フォントサイズ適用
      xLabel.textContent = d.label;
      svg.appendChild(xLabel);
    }
  });

  container.innerHTML = "";
  container.appendChild(svg);
}

function setupNormDashboard() {
  const dataEl = document.getElementById("norm-stats-data");
  const container = document.getElementById("norm-chart-container");
  if (!dataEl || !container) return;

  let stats: { timeline: TimelinePoint[] };
  try {
    stats = JSON.parse(dataEl.textContent || "{}");
  } catch {
    return;
  }
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

  // さらに表示ボタンの実装
  const moreButton = document.getElementById("norm-recent-more");
  const recentList = document.getElementById("norm-recent-list");
  if (moreButton && recentList) {
    const items = Array.from(recentList.querySelectorAll("li"));
    let shown = items.filter((li) => !li.classList.contains("norm-recent-hidden")).length;

    const revealMore = () => {
      const next = items.slice(shown, shown + 10);
      next.forEach((li) => li.classList.remove("norm-recent-hidden"));
      shown += next.length;
      if (shown >= items.length) {
        (moreButton as HTMLElement).style.display = "none";
      }
    };

    moreButton.addEventListener("click", revealMore);
    window.addCleanup(() => moreButton.removeEventListener("click", revealMore));
  }

  //

  update("day");
}

document.addEventListener("nav", setupNormDashboard);