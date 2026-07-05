type TimelinePoint = { date: string; count: number };
type Granularity = "day" | "week" | "month" | "year";

function aggregate(timeline: TimelinePoint[], granularity: Granularity) {
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
  const width = container.clientWidth || 600;
  const height = 180;
  const barGap = 4;
  const barWidth = Math.max(3, Math.floor(width / Math.max(1, data.length)) - barGap);
  const max = Math.max(1, ...data.map((d) => d.value));
  const svgns = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("class", "norm-chart-svg");

  data.forEach((d, i) => {
    const barHeight = (d.value / max) * (height - 4);
    const rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", String(i * (barWidth + barGap)));
    rect.setAttribute("y", String(height - barHeight));
    rect.setAttribute("width", String(barWidth));
    rect.setAttribute("height", String(barHeight));
    rect.setAttribute("class", "norm-chart-bar");
    const title = document.createElementNS(svgns, "title");
    title.textContent = `${d.label}：${d.value}`;
    rect.appendChild(title);
    svg.appendChild(rect);
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