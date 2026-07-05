import { createRequire } from 'module';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/styles/normDashboard.scss
var normDashboard_default = ".norm-dashboard {\n  margin-bottom: 2rem;\n}\n.norm-dashboard h2,\n.norm-dashboard h3 {\n  margin-top: 1.5rem;\n}\n.norm-dashboard .norm-summary-grid {\n  display: flex;\n  gap: 1rem;\n  margin: 1rem 0;\n  justify-content: center;\n}\n.norm-dashboard .norm-stat-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 1rem 1.5rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 6px;\n  min-width: 100px;\n  text-decoration: none;\n  color: inherit;\n}\n.norm-dashboard .norm-stat-number {\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-stat-label {\n  font-size: 0.85rem;\n  color: var(--darkgray);\n}\n.norm-dashboard .norm-field-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.norm-dashboard .norm-field-list li {\n  min-width: 140px;\n}\n.norm-dashboard .norm-field-list .norm-field-link {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.5rem;\n  padding: 0.3rem 0.8rem;\n  background: var(--lightgray);\n  border-radius: 4px;\n  text-decoration: none;\n  color: inherit;\n  transition: background 0.15s ease;\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-field-list .norm-field-count {\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover .norm-field-count {\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-controls {\n  display: flex;\n  gap: 0.5rem;\n  margin: 0.5rem 0;\n}\n.norm-dashboard .norm-chart-controls button {\n  padding: 0.3rem 0.8rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 4px;\n  background: transparent;\n  color: var(--dark);\n  cursor: pointer;\n}\n.norm-dashboard .norm-chart-controls button.active {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-bar {\n  fill: var(--secondary);\n}\n.norm-dashboard .norm-chart-y-axis text,\n.norm-dashboard .norm-chart-x-axis text {\n  fill: var(--darkgray);\n  font-size: 10px;\n}\n.norm-dashboard .norm-chart-gridline {\n  stroke: var(--lightgray);\n  stroke-width: 1;\n}\n.norm-dashboard .norm-chart-value-label {\n  fill: var(--dark);\n  font-size: 10px;\n  text-anchor: middle;\n}";

// src/components/scripts/normDashboard.inline.ts
var normDashboard_inline_default = 'function w(n){let t=n.getFullYear(),r=String(n.getMonth()+1).padStart(2,"0"),e=String(n.getDate()).padStart(2,"0");return`${t}-${r}-${e}`}function x(n){let t=n.getDay(),r=(t===0?-6:1)-t,e=new Date(n);return e.setDate(n.getDate()+r),e.setHours(0,0,0,0),e}function S(n,t){return t==="day"?w(n):t==="week"?w(x(n)):t==="month"?`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`:String(n.getFullYear())}function E(n,t){if(t==="day"||t==="week"){let[,r,e]=n.split("-");return`${Number(r)}/${Number(e)}`}if(t==="month"){let[r,e]=n.split("-");return`${r}/${Number(e)}`}return n}function M(n){let t=new Date;t.setHours(0,0,0,0);let r=[];if(n==="day")for(let e=13;e>=0;e--){let a=new Date(t);a.setDate(t.getDate()-e),r.push(S(a,"day"))}else if(n==="week"){let e=x(new Date(t.getFullYear(),t.getMonth()-1,t.getDate())),a=x(t);for(let i=new Date(e);i<=a;i.setDate(i.getDate()+7))r.push(S(i,"week"))}else if(n==="month")for(let e=11;e>=0;e--){let a=new Date(t.getFullYear(),t.getMonth()-e,1);r.push(S(a,"month"))}else for(let e=9;e>=0;e--)r.push(String(t.getFullYear()-e));return r}function C(n,t){let r=new Map;for(let{date:a,count:i}of n){let s=new Date(a+"T00:00:00"),d=S(s,t);r.set(d,(r.get(d)??0)+i)}return M(t).map(a=>({label:E(a,t),value:r.get(a)??0}))}function $(n,t){let r=n.clientWidth||600,e=36,a=26,i=20,s=160,d=r-e,p=4,f=Math.max(3,Math.floor(d/Math.max(1,t.length))-p),y=Math.max(1,...t.map(o=>o.value)),g="http://www.w3.org/2000/svg",u=document.createElementNS(g,"svg");u.setAttribute("viewBox",`0 0 ${r} ${i+s+a}`),u.setAttribute("width","100%"),u.setAttribute("class","norm-chart-svg"),[0,.5,1].map(o=>Math.round(y*o)).forEach(o=>{let b=i+s-o/y*s,m=document.createElementNS(g,"line");m.setAttribute("x1",String(e)),m.setAttribute("x2",String(r)),m.setAttribute("y1",String(b)),m.setAttribute("y2",String(b)),m.setAttribute("class","norm-chart-gridline"),u.appendChild(m);let l=document.createElementNS(g,"text");l.setAttribute("x",String(e-6)),l.setAttribute("y",String(b+3)),l.setAttribute("text-anchor","end"),l.setAttribute("class","norm-chart-y-axis"),l.textContent=String(o),u.appendChild(l)});let D=Math.max(1,Math.ceil(t.length/14));t.forEach((o,b)=>{let m=o.value/y*s,l=e+b*(f+p),A=i+s-m,h=document.createElementNS(g,"rect");h.setAttribute("x",String(l)),h.setAttribute("y",String(A)),h.setAttribute("width",String(f)),h.setAttribute("height",String(m)),h.setAttribute("class","norm-chart-bar");let v=document.createElementNS(g,"title");if(v.textContent=`${o.label}\\uFF1A${o.value}`,h.appendChild(v),u.appendChild(h),f>=12&&o.value>0){let c=document.createElementNS(g,"text");c.setAttribute("x",String(l+f/2)),c.setAttribute("y",String(A-4)),c.setAttribute("class","norm-chart-value-label"),c.textContent=String(o.value),u.appendChild(c)}if(b%D===0){let c=document.createElementNS(g,"text");c.setAttribute("x",String(l+f/2)),c.setAttribute("y",String(i+s+16)),c.setAttribute("text-anchor","middle"),c.setAttribute("class","norm-chart-x-axis"),c.textContent=o.label,u.appendChild(c)}}),n.innerHTML="",n.appendChild(u)}function L(){let n=document.getElementById("norm-stats-data"),t=document.getElementById("norm-chart-container");if(!n||!t)return;let r;try{r=JSON.parse(n.textContent||"{}")}catch{return}let e=r.timeline??[];function a(s){$(t,C(e,s))}let i=document.querySelectorAll(".norm-chart-controls button");i.forEach(s=>{let d=()=>{i.forEach(p=>p.classList.remove("active")),s.classList.add("active"),a(s.dataset.granularity??"day")};s.addEventListener("click",d),window.addCleanup(()=>s.removeEventListener("click",d))}),a("day")}document.addEventListener("nav",L);\n';
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
    const wordFiles = allFiles.filter(
      (f3) => f3.slug && /^_word\//i.test(f3.slug) && f3.frontmatter?.en
      // フロントマターにenが含まれているファイルだけを探す（enは確実に登録する．一方で自動生成される_wordのindexページにはenが無いのでカウントから外れる）
    );
    const personFiles = allFiles.filter(
      (f3) => f3.slug && /^_name\//i.test(f3.slug) && f3.frontmatter?.en
      // ↑と同様の理由
    );
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
      /* @__PURE__ */ u2("h3", { children: "\u767B\u9332\u63A8\u79FB" }),
      /* @__PURE__ */ u2("div", { class: "norm-chart-controls", children: [
        /* @__PURE__ */ u2("button", { "data-granularity": "day", class: "active", children: "\u65E5\u5225" }),
        /* @__PURE__ */ u2("button", { "data-granularity": "week", children: "\u9031\u5225" }),
        /* @__PURE__ */ u2("button", { "data-granularity": "month", children: "\u6708\u5225" }),
        /* @__PURE__ */ u2("button", { "data-granularity": "year", children: "\u5E74\u5225" })
      ] }),
      /* @__PURE__ */ u2("div", { id: "norm-chart-container", class: "norm-chart-container" }),
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