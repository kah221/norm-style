import { createRequire } from 'module';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/styles/normDashboard.scss
var normDashboard_default = ".norm-dashboard {\n  margin-bottom: 2rem;\n}\n.norm-dashboard h2,\n.norm-dashboard h3 {\n  margin-top: 1.5rem;\n}\n.norm-dashboard .norm-summary-grid {\n  display: flex;\n  gap: 1rem;\n  margin: 1rem 0;\n}\n.norm-dashboard .norm-stat-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 1rem 1.5rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 6px;\n  min-width: 100px;\n}\n.norm-dashboard .norm-stat-number {\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-stat-label {\n  font-size: 0.85rem;\n  color: var(--darkgray);\n}\n.norm-dashboard .norm-field-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.norm-dashboard .norm-field-list li {\n  min-width: 140px;\n}\n.norm-dashboard .norm-field-list .norm-field-link {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.5rem;\n  padding: 0.3rem 0.8rem;\n  background: var(--lightgray);\n  border-radius: 4px;\n  text-decoration: none;\n  color: inherit;\n  transition: background 0.15s ease;\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-field-list .norm-field-count {\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover .norm-field-count {\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-controls {\n  display: flex;\n  gap: 0.5rem;\n  margin: 0.5rem 0;\n}\n.norm-dashboard .norm-chart-controls button {\n  padding: 0.3rem 0.8rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 4px;\n  background: transparent;\n  color: var(--dark);\n  cursor: pointer;\n}\n.norm-dashboard .norm-chart-controls button.active {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-bar {\n  fill: var(--secondary);\n}\n.norm-dashboard .norm-chart-y-axis text,\n.norm-dashboard .norm-chart-x-axis text {\n  fill: var(--darkgray);\n  font-size: 10px;\n}\n.norm-dashboard .norm-chart-gridline {\n  stroke: var(--lightgray);\n  stroke-width: 1;\n}\n.norm-dashboard .norm-chart-value-label {\n  fill: var(--dark);\n  font-size: 10px;\n  text-anchor: middle;\n}";

// src/components/scripts/normDashboard.inline.ts
var normDashboard_inline_default = 'function v(m,r){let s=new Map;for(let{date:e,count:o}of m){let a=new Date(e+"T00:00:00"),t;if(r==="day")t=e;else if(r==="month")t=e.slice(0,7);else if(r==="year")t=e.slice(0,4);else{let h=a.getDay(),p=(h===0?-6:1)-h,d=new Date(a);d.setDate(a.getDate()+p),t=d.toISOString().slice(0,10)}s.set(t,(s.get(t)??0)+o)}return Array.from(s.entries()).sort(([e],[o])=>e.localeCompare(o)).map(([e,o])=>({label:e,value:o}))}function E(m,r){let s=m.clientWidth||600,e=36,o=28,a=20,t=160,h=s-e,p=4,d=Math.max(3,Math.floor(h/Math.max(1,r.length))-p),x=Math.max(1,...r.map(n=>n.value)),g="http://www.w3.org/2000/svg",l=document.createElementNS(g,"svg");l.setAttribute("viewBox",`0 0 ${s} ${a+t+o}`),l.setAttribute("width","100%"),l.setAttribute("class","norm-chart-svg"),[0,.5,1].map(n=>Math.round(x*n)).forEach((n,S)=>{let y=a+t-n/x*t,c=document.createElementNS(g,"line");c.setAttribute("x1",String(e)),c.setAttribute("x2",String(s)),c.setAttribute("y1",String(y)),c.setAttribute("y2",String(y)),c.setAttribute("class","norm-chart-gridline"),l.appendChild(c);let u=document.createElementNS(g,"text");u.setAttribute("x",String(e-6)),u.setAttribute("y",String(y+3)),u.setAttribute("text-anchor","end"),u.setAttribute("class","norm-chart-y-axis"),u.textContent=String(n),l.appendChild(u)});let f=Math.max(1,Math.ceil(r.length/12));r.forEach((n,S)=>{let y=n.value/x*t,c=e+S*(d+p),u=a+t-y,b=document.createElementNS(g,"rect");b.setAttribute("x",String(c)),b.setAttribute("y",String(u)),b.setAttribute("width",String(d)),b.setAttribute("height",String(y)),b.setAttribute("class","norm-chart-bar");let A=document.createElementNS(g,"title");if(A.textContent=`${n.label}\\uFF1A${n.value}`,b.appendChild(A),l.appendChild(b),d>=12&&n.value>0){let i=document.createElementNS(g,"text");i.setAttribute("x",String(c+d/2)),i.setAttribute("y",String(u-4)),i.setAttribute("class","norm-chart-value-label"),i.textContent=String(n.value),l.appendChild(i)}if(S%f===0){let i=document.createElementNS(g,"text");i.setAttribute("transform",`translate(${c+d/2}, ${a+t+14}) rotate(-40)`),i.setAttribute("text-anchor","end"),i.setAttribute("class","norm-chart-x-axis"),i.textContent=n.label,l.appendChild(i)}}),m.innerHTML="",m.appendChild(l)}function C(){let m=document.getElementById("norm-stats-data"),r=document.getElementById("norm-chart-container");if(!m||!r)return;let s;try{s=JSON.parse(m.textContent||"{}")}catch{return}let e=s.timeline??[];function o(t){E(r,v(e,t))}let a=document.querySelectorAll(".norm-chart-controls button");a.forEach(t=>{let h=()=>{a.forEach(p=>p.classList.remove("active")),t.classList.add("active"),o(t.dataset.granularity??"day")};t.addEventListener("click",h),window.addCleanup(()=>t.removeEventListener("click",h))}),o("day")}document.addEventListener("nav",C);\n';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/NormDashboard.tsx
function toDateStr(d2) {
  const y2 = d2.getFullYear();
  const m2 = String(d2.getMonth() + 1).padStart(2, "0");
  const day = String(d2.getDate()).padStart(2, "0");
  return `${y2}-${m2}-${day}`;
}
var NormDashboard_default = ((opts) => {
  const { className = "norm-dashboard" } = opts ?? {};
  const Component = ({ allFiles }) => {
    console.error("NORM_DASHBOARD_RENDER_CHECK", allFiles.length);
    const wordFiles = allFiles.filter((f3) => f3.slug && /^_word\//i.test(f3.slug));
    const personFiles = allFiles.filter((f3) => f3.slug && /^_name\//i.test(f3.slug));
    const byField = {};
    const byElement = {};
    const timelineMap = {};
    for (const f3 of wordFiles) {
      const tags = f3.frontmatter?.tags ?? [];
      for (const t2 of tags) {
        const parts = t2.split("/");
        if (parts[0] === "\u5206\u91CE" && parts[1]) {
          byField[parts[1]] ??= { count: 0, sub: {} };
          byField[parts[1]].count += 1;
          if (parts[2]) {
            byField[parts[1]].sub[parts[2]] = (byField[parts[1]].sub[parts[2]] ?? 0) + 1;
          }
        } else if (parts[0] === "\u8981\u7D20" && parts[1]) {
          byElement[parts[1]] = (byElement[parts[1]] ?? 0) + 1;
        }
      }
      const created = f3.dates?.created;
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
      timeline: Object.entries(timelineMap).sort(([a2], [b]) => a2.localeCompare(b)).map(([date, count]) => ({ date, count }))
    };
    const fieldEntries = Object.entries(byField).sort((a2, b) => b[1].count - a2[1].count);
    const elementEntries = Object.entries(byElement).sort((a2, b) => b[1] - a2[1]);
    return /* @__PURE__ */ u2("div", { class: classNames(className), children: [
      /* @__PURE__ */ u2("h2", { children: "norm \u5168\u4F53\u50CF" }),
      /* @__PURE__ */ u2("div", { class: "norm-summary-grid", children: [
        /* @__PURE__ */ u2("div", { class: "norm-stat-card", children: [
          /* @__PURE__ */ u2("span", { class: "norm-stat-number", children: wordFiles.length }),
          /* @__PURE__ */ u2("span", { class: "norm-stat-label", children: "\u767B\u9332\u5358\u8A9E\u6570" })
        ] }),
        /* @__PURE__ */ u2("div", { class: "norm-stat-card", children: [
          /* @__PURE__ */ u2("span", { class: "norm-stat-number", children: personFiles.length }),
          /* @__PURE__ */ u2("span", { class: "norm-stat-label", children: "\u767B\u9332\u4EBA\u7269\u6570" })
        ] })
      ] }),
      /* @__PURE__ */ u2("h3", { children: "\u5206\u91CE\u5225" }),
      /* @__PURE__ */ u2("ul", { class: "norm-field-list", children: fieldEntries.map(([name, v2]) => /* @__PURE__ */ u2("li", { children: /* @__PURE__ */ u2("a", { class: "norm-field-link", href: `tags/\u5206\u91CE/${encodeURIComponent(name)}`, children: [
        /* @__PURE__ */ u2("span", { class: "norm-field-name", children: name }),
        /* @__PURE__ */ u2("span", { class: "norm-field-count", children: v2.count })
      ] }) })) }),
      /* @__PURE__ */ u2("h3", { children: "\u8981\u7D20\u5225" }),
      /* @__PURE__ */ u2("ul", { class: "norm-field-list", children: elementEntries.map(([name, count]) => /* @__PURE__ */ u2("li", { children: /* @__PURE__ */ u2("a", { class: "norm-field-link", href: `tags/\u8981\u7D20/${encodeURIComponent(name)}`, children: [
        /* @__PURE__ */ u2("span", { class: "norm-field-name", children: name }),
        /* @__PURE__ */ u2("span", { class: "norm-field-count", children: count })
      ] }) })) }),
      /* @__PURE__ */ u2("h3", { children: "\u767B\u9332\u63A8\u79FB" }),
      /* @__PURE__ */ u2("div", { class: "norm-chart-controls", children: [
        /* @__PURE__ */ u2("button", { "data-granularity": "day", class: "active", children: "\u65E5\u5225" }),
        /* @__PURE__ */ u2("button", { "data-granularity": "week", children: "\u9031\u5225" }),
        /* @__PURE__ */ u2("button", { "data-granularity": "month", children: "\u6708\u5225" }),
        /* @__PURE__ */ u2("button", { "data-granularity": "year", children: "\u5E74\u5225" })
      ] }),
      /* @__PURE__ */ u2("div", { id: "norm-chart-container", class: "norm-chart-container" }),
      /* @__PURE__ */ u2(
        "script",
        {
          type: "application/json",
          id: "norm-stats-data",
          dangerouslySetInnerHTML: { __html: JSON.stringify(statsData) }
        }
      )
    ] });
  };
  Component.css = normDashboard_default;
  Component.afterDOMLoaded = normDashboard_inline_default;
  return Component;
});

export { NormDashboard_default as NormDashboard };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map