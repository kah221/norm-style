import { createRequire } from 'module';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/styles/normDashboard.scss
var normDashboard_default = ".norm-dashboard {\n  margin-bottom: 2rem;\n}\n.norm-dashboard h2,\n.norm-dashboard h3 {\n  margin-top: 1.5rem;\n}\n.norm-dashboard .norm-summary-grid {\n  display: flex;\n  gap: 1rem;\n  margin: 1rem 0;\n  justify-content: center;\n}\n.norm-dashboard .norm-stat-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 1rem 1.5rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 6px;\n  min-width: 100px;\n  text-decoration: none;\n  color: inherit;\n}\n.norm-dashboard .norm-stat-number {\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-stat-label {\n  font-size: 0.85rem;\n  color: var(--darkgray);\n}\n.norm-dashboard .norm-field-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.norm-dashboard .norm-field-list li {\n  min-width: 140px;\n}\n.norm-dashboard .norm-field-list .norm-field-link {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.5rem;\n  padding: 0.3rem 0.8rem;\n  background: var(--lightgray);\n  border-radius: 4px;\n  text-decoration: none;\n  color: inherit;\n  transition: background 0.15s ease;\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-field-list .norm-field-count {\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover .norm-field-count {\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-controls {\n  display: flex;\n  gap: 0.5rem;\n  margin: 0.5rem 0;\n}\n.norm-dashboard .norm-chart-controls button {\n  padding: 0.3rem 0.8rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 4px;\n  background: transparent;\n  color: var(--dark);\n  cursor: pointer;\n}\n.norm-dashboard .norm-chart-controls button.active {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-bar {\n  fill: var(--secondary);\n}\n.norm-dashboard .norm-chart-y-axis text,\n.norm-dashboard .norm-chart-x-axis text {\n  fill: var(--darkgray);\n  font-size: 10px;\n}\n.norm-dashboard .norm-chart-gridline {\n  stroke: var(--lightgray);\n  stroke-width: 1;\n}\n.norm-dashboard .norm-chart-value-label {\n  fill: var(--dark);\n  font-size: 10px;\n  text-anchor: middle;\n}";

// src/components/scripts/normDashboard.inline.ts
var normDashboard_inline_default = 'function v(e){let n=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${n}-${o}-${i}`}function E(e){if(e.length===0)return[];let n=new Map(e.map(t=>[t.date,t.count])),o=[...n.keys()].sort((t,r)=>t.localeCompare(r)),i=new Date(o[0]+"T00:00:00"),s=new Date(o[o.length-1]+"T00:00:00"),a=[];for(let t=new Date(i);t<=s;t.setDate(t.getDate()+1)){let r=v(t);a.push({date:r,count:n.get(r)??0})}return a}function w(e,n){let o=E(e),i=new Map;for(let{date:s,count:a}of e){let t=new Date(s+"T00:00:00"),r;if(n==="day")r=s;else if(n==="month")r=s.slice(0,7);else if(n==="year")r=s.slice(0,4);else{let h=t.getDay(),g=(h===0?-6:1)-h,y=new Date(t);y.setDate(t.getDate()+g),r=y.toISOString().slice(0,10)}i.set(r,(i.get(r)??0)+a)}return Array.from(i.entries()).sort(([s],[a])=>s.localeCompare(a)).map(([s,a])=>({label:s,value:a}))}function D(e,n){let o=e.clientWidth||600,i=36,s=50,a=20,t=160,r=o-i,h=4,g=Math.max(3,Math.floor(r/Math.max(1,n.length))-h),y=Math.max(1,...n.map(c=>c.value)),b="http://www.w3.org/2000/svg",m=document.createElementNS(b,"svg");m.setAttribute("viewBox",`0 0 ${o} ${a+t+s}`),m.setAttribute("width","100%"),m.setAttribute("class","norm-chart-svg"),[0,.5,1].map(c=>Math.round(y*c)).forEach((c,f)=>{let S=a+t-c/y*t,u=document.createElementNS(b,"line");u.setAttribute("x1",String(i)),u.setAttribute("x2",String(o)),u.setAttribute("y1",String(S)),u.setAttribute("y2",String(S)),u.setAttribute("class","norm-chart-gridline"),m.appendChild(u);let d=document.createElementNS(b,"text");d.setAttribute("x",String(i-6)),d.setAttribute("y",String(S+3)),d.setAttribute("text-anchor","end"),d.setAttribute("class","norm-chart-y-axis"),d.textContent=String(c),m.appendChild(d)});let A=Math.max(1,Math.ceil(n.length/12));n.forEach((c,f)=>{let S=c.value/y*t,u=i+f*(g+h),d=a+t-S,p=document.createElementNS(b,"rect");p.setAttribute("x",String(u)),p.setAttribute("y",String(d)),p.setAttribute("width",String(g)),p.setAttribute("height",String(S)),p.setAttribute("class","norm-chart-bar");let x=document.createElementNS(b,"title");if(x.textContent=`${c.label}\\uFF1A${c.value}`,p.appendChild(x),m.appendChild(p),g>=12&&c.value>0){let l=document.createElementNS(b,"text");l.setAttribute("x",String(u+g/2)),l.setAttribute("y",String(d-4)),l.setAttribute("class","norm-chart-value-label"),l.textContent=String(c.value),m.appendChild(l)}if(f%A===0){let l=document.createElementNS(b,"text");l.setAttribute("transform",`translate(${u+g/2}, ${a+t+14}) rotate(-40)`),l.setAttribute("text-anchor","end"),l.setAttribute("class","norm-chart-x-axis"),l.textContent=c.label,m.appendChild(l)}}),e.innerHTML="",e.appendChild(m)}function M(){let e=document.getElementById("norm-stats-data"),n=document.getElementById("norm-chart-container");if(!e||!n)return;let o;try{o=JSON.parse(e.textContent||"{}")}catch{return}let i=o.timeline??[];function s(t){D(n,w(i,t))}let a=document.querySelectorAll(".norm-chart-controls button");a.forEach(t=>{let r=()=>{a.forEach(h=>h.classList.remove("active")),t.classList.add("active"),s(t.dataset.granularity??"day")};t.addEventListener("click",r),window.addCleanup(()=>t.removeEventListener("click",r))}),s("day")}document.addEventListener("nav",M);\n';
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
  const Component = ({ allFiles, fileData }) => {
    if (fileData.slug !== "index") {
      return null;
    }
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
      /* @__PURE__ */ u2("h2", { children: "\u7D71\u8A08" }),
      /* @__PURE__ */ u2("div", { class: "norm-summary-grid", children: [
        /* @__PURE__ */ u2("a", { class: "norm-stat-card", href: "_word/", children: [
          /* @__PURE__ */ u2("span", { class: "norm-stat-number", children: wordFiles.length }),
          /* @__PURE__ */ u2("span", { class: "norm-stat-label", children: "\u5358\u8A9E" })
        ] }),
        /* @__PURE__ */ u2("a", { class: "norm-stat-card", href: "_name/", children: [
          /* @__PURE__ */ u2("span", { class: "norm-stat-number", children: personFiles.length }),
          /* @__PURE__ */ u2("span", { class: "norm-stat-label", children: "\u4EBA\u7269" })
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