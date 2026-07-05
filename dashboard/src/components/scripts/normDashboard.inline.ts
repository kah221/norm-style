type TimelinePoint = { date: string; count: number };
type Granularity = "day" | "week" | "month" | "year";

// グラフ，新規登録数が0の日があっても素直に表示するため
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// グラフ，新規登録数が0の日があっても素直に表示するため
function fillDailyGaps(timeline: TimelinePoint[]): TimelinePoint[] {
  if (timeline.length === 0) return [];
  const countByDate = new Map(timeline.map((t) => [t.date, t.count]));
  const sortedDates = [...countByDate.keys()].sort((a, b) => a.localeCompare(b));
  const start = new Date(sortedDates[0] + "T00:00:00");
  const end = new Date(sortedDates[sortedDates.length - 1] + "T00:00:00");

  const filled: TimelinePoint[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = toDateStr(d);
    filled.push({ date: key, count: countByDate.get(key) ?? 0 });
  }
  return filled;
}

function aggregate(timeline: TimelinePoint[], granularity: Granularity) {
  const filledTimeline = fillDailyGaps(timeline); // fillDailyGapsを参照
  const map = new Map<string, number>();
  for (const { date, count } of timeline) {
    const d = new Date(date + "T00:00:00");
    let key: string;
    if (granularity === "day") {
      key = date;
    } else if (granularity === "month") {
      key = date.slice(0, 7);
    } else if (granularity === "year") {
      key = date.slice(0, 4);
    } else {
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const monday = new Date(d);
      monday.setDate(d.getDate() + diff);
      key = monday.toISOString().slice(0, 10);
    }
    map.set(key, (map.get(key) ?? 0) + count);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }));
}

function renderChart(container: HTMLElement, data: { label: string; value: number }[]) {
  const totalWidth = container.clientWidth || 600;
  const leftMargin = 36;
  const bottomMargin = 50;
  const topMargin = 20;
  const chartHeight = 160;
  const chartWidth = totalWidth - leftMargin;
  const barGap = 4;
  const barWidth = Math.max(3, Math.floor(chartWidth / Math.max(1, data.length)) - barGap);
  const max = Math.max(1, ...data.map((d) => d.value));
  const svgns = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgns, "svg");
  svg.setAttribute("viewBox", `0 0 ${totalWidth} ${topMargin + chartHeight + bottomMargin}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("class", "norm-chart-svg");

  // 縦軸：0・中間・最大の3段階でグリッド線と数値を描画
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  ticks.forEach((tickValue, i) => {
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
    label.textContent = String(tickValue);
    svg.appendChild(label);
  });

  // 何本おきにx軸ラベルを出すか（詰まりすぎないよう間引く）
  const labelStep = Math.max(1, Math.ceil(data.length / 12));

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

    // 棒の上に数値ラベル（棒が細すぎる場合は省略）
    if (barWidth >= 12 && d.value > 0) {
      const valueLabel = document.createElementNS(svgns, "text");
      valueLabel.setAttribute("x", String(x + barWidth / 2));
      valueLabel.setAttribute("y", String(y - 4));
      valueLabel.setAttribute("class", "norm-chart-value-label");
      valueLabel.textContent = String(d.value);
      svg.appendChild(valueLabel);
    }

    // x軸ラベル（間引きつつ表示）
    if (i % labelStep === 0) {
      const xLabel = document.createElementNS(svgns, "text");
      xLabel.setAttribute(
        "transform",
        `translate(${x + barWidth / 2}, ${topMargin + chartHeight + 14}) rotate(-40)`,
      );
      xLabel.setAttribute("text-anchor", "end");
      xLabel.setAttribute("class", "norm-chart-x-axis");
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
    renderChart(container as HTMLElement, aggregate(timeline, granularity));
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
}

document.addEventListener("nav", setupNormDashboard);
export {};