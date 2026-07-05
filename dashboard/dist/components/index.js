import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/styles/normDashboard.scss
var normDashboard_default = ".norm-dashboard {\n  margin-bottom: 2rem;\n}\n.norm-dashboard h2,\n.norm-dashboard h3 {\n  margin-top: 1.5rem;\n}\n.norm-dashboard .norm-summary-grid {\n  display: flex;\n  gap: 1rem;\n  margin: 1rem 0;\n  justify-content: center;\n}\n.norm-dashboard .norm-stat-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 1rem 1.5rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 6px;\n  min-width: 100px;\n  text-decoration: none;\n  color: inherit;\n}\n.norm-dashboard .norm-stat-number {\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-stat-label {\n  font-size: 0.85rem;\n  color: var(--darkgray);\n}\n.norm-dashboard .norm-field-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.norm-dashboard .norm-field-list li {\n  min-width: 140px;\n}\n.norm-dashboard .norm-field-list .norm-field-link {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.5rem;\n  padding: 0.3rem 0.8rem;\n  background: var(--lightgray);\n  border-radius: 4px;\n  text-decoration: none;\n  color: inherit;\n  transition: background 0.15s ease;\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-field-list .norm-field-count {\n  font-weight: 700;\n  color: var(--secondary);\n}\n.norm-dashboard .norm-field-list .norm-field-link:hover .norm-field-count {\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-controls {\n  display: flex;\n  gap: 0.5rem;\n  margin: 0.5rem 0;\n}\n.norm-dashboard .norm-chart-controls button {\n  padding: 0.3rem 0.8rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 4px;\n  background: transparent;\n  color: var(--dark);\n  cursor: pointer;\n}\n.norm-dashboard .norm-chart-controls button.active {\n  background: var(--secondary);\n  color: var(--light);\n}\n.norm-dashboard .norm-chart-bar {\n  fill: var(--secondary);\n}\n.norm-dashboard .norm-chart-y-axis text,\n.norm-dashboard .norm-chart-x-axis text {\n  fill: var(--darkgray);\n  font-size: 10px;\n}\n.norm-dashboard .norm-chart-gridline {\n  stroke: var(--lightgray);\n  stroke-width: 1;\n}\n.norm-dashboard .norm-chart-value-label {\n  fill: var(--dark);\n  font-size: 10px;\n  text-anchor: middle;\n}\n\n.norm-recent-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.norm-recent-list a {\n  display: block;\n  padding: 0.5rem 0.8rem;\n  background: var(--lightgray);\n  border-radius: 4px;\n  text-decoration: none;\n  color: inherit;\n}\n.norm-recent-list .norm-recent-time {\n  font-size: 0.8rem;\n  color: var(--darkgray);\n  margin-left: 0.5rem;\n}\n.norm-recent-list .norm-recent-definition {\n  margin: 0.3rem 0 0;\n  font-size: 0.85rem;\n  color: var(--darkgray);\n}";

// src/components/scripts/normDashboard.inline.ts
var normDashboard_inline_default = 'function C(e){let t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${r}-${n}`}function w(e){let t=e.getDay(),r=(t===0?-6:1)-t,n=new Date(e);return n.setDate(e.getDate()+r),n.setHours(0,0,0,0),n}function p(e,t){return t==="day"?C(e):t==="week"?C(w(e)):t==="month"?`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`:String(e.getFullYear())}function $(e,t){if(t==="day"||t==="week"){let[,r,n]=e.split("-");return`${Number(r)}/${Number(n)}`}if(t==="month"){let[r,n]=e.split("-");return`${r}/${Number(n)}`}return e}function L(e){let t=new Date;t.setHours(0,0,0,0);let r=[];if(e==="day")for(let n=13;n>=0;n--){let a=new Date(t);a.setDate(t.getDate()-n),r.push(p(a,"day"))}else if(e==="week"){let n=w(new Date(t.getFullYear(),t.getMonth()-1,t.getDate())),a=w(t);for(let l=new Date(n);l<=a;l.setDate(l.getDate()+7))r.push(p(l,"week"))}else if(e==="month")for(let n=11;n>=0;n--){let a=new Date(t.getFullYear(),t.getMonth()-n,1);r.push(p(a,"month"))}else for(let n=9;n>=0;n--)r.push(String(t.getFullYear()-n));return r}function N(e,t){let r=new Map;for(let{date:a,count:l}of e){let s=new Date(a+"T00:00:00"),c=p(s,t);r.set(c,(r.get(c)??0)+l)}return L(t).map(a=>({label:$(a,t),value:r.get(a)??0}))}function k(e,t,r){let n=e.clientWidth||600,a=36,l=26,s=20,c=160,S=n-a,v=4,f=Math.max(3,Math.floor(S/Math.max(1,t.length))-v),y=Math.max(1,...t.map(i=>i.value)),x=window.matchMedia("(max-width: 480px)").matches,D=x?8:10,h="http://www.w3.org/2000/svg",m=document.createElementNS(h,"svg");m.setAttribute("viewBox",`0 0 ${n} ${s+c+l}`),m.setAttribute("width","100%"),m.setAttribute("class","norm-chart-svg"),[0,.5,1].map(i=>Math.round(y*i)).forEach(i=>{let b=s+c-i/y*c,d=document.createElementNS(h,"line");d.setAttribute("x1",String(a)),d.setAttribute("x2",String(n)),d.setAttribute("y1",String(b)),d.setAttribute("y2",String(b)),d.setAttribute("class","norm-chart-gridline"),m.appendChild(d);let u=document.createElementNS(h,"text");u.setAttribute("x",String(a-6)),u.setAttribute("y",String(b+3)),u.setAttribute("text-anchor","end"),u.setAttribute("class","norm-chart-y-axis"),u.setAttribute("font-size",String(D)),u.textContent=String(i),m.appendChild(u)});let A=Math.max(1,Math.ceil(t.length/14));x&&r==="day"?A*=3:x&&r==="month"&&(A*=2),t.forEach((i,b)=>{let d=i.value/y*c,u=a+b*(f+v),M=s+c-d,g=document.createElementNS(h,"rect");g.setAttribute("x",String(u)),g.setAttribute("y",String(M)),g.setAttribute("width",String(f)),g.setAttribute("height",String(d)),g.setAttribute("class","norm-chart-bar");let E=document.createElementNS(h,"title");if(E.textContent=`${i.label}\\uFF1A${i.value}`,g.appendChild(E),m.appendChild(g),f>=12&&i.value>0){let o=document.createElementNS(h,"text");o.setAttribute("x",String(u+f/2)),o.setAttribute("y",String(M-4)),o.setAttribute("class","norm-chart-value-label"),o.textContent=String(i.value),m.appendChild(o)}if(b%A===0){let o=document.createElementNS(h,"text");o.setAttribute("x",String(u+f/2)),o.setAttribute("y",String(s+c+16)),o.setAttribute("text-anchor","middle"),o.setAttribute("class","norm-chart-x-axis"),o.setAttribute("font-size",String(D)),o.textContent=i.label,m.appendChild(o)}}),e.innerHTML="",e.appendChild(m)}function G(){let e=document.getElementById("norm-stats-data"),t=document.getElementById("norm-chart-container");if(!e||!t)return;let r;try{r=JSON.parse(e.textContent||"{}")}catch{return}let n=r.timeline??[];function a(s){k(t,N(n,s),s)}let l=document.querySelectorAll(".norm-chart-controls button");l.forEach(s=>{let c=()=>{l.forEach(S=>S.classList.remove("active")),s.classList.add("active"),a(s.dataset.granularity??"day")};s.addEventListener("click",c),window.addCleanup(()=>s.removeEventListener("click",c))}),a("day")}document.addEventListener("nav",G);\n';
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
    function extractDefinition(relativePath) {
      if (!relativePath) return null;
      try {
        const fullPath = path.resolve(process.cwd(), relativePath);
        const raw = fs.readFileSync(fullPath, "utf-8");
        const match = raw.match(/^>\s?(.+)$/m);
        return match?.[1]?.trim() ?? null;
      } catch {
        return null;
      }
    }
    [...wordFiles, ...personFiles].map((f3) => {
      const created = f3.frontmatter?.time ? new Date(f3.frontmatter.time) : f3.dates?.created;
      return { f: f3, created };
    }).filter((e2) => e2.created).sort((a2, b) => b.created.getTime() - a2.created.getTime()).slice(0, 5).map((e2) => {
      const fm = e2.f.frontmatter;
      const title = fm?.en ? `${fm?.jp}\uFF08${fm.en}\uFF09` : fm?.jp;
      return {
        title,
        slug: e2.f.slug,
        created: e2.created,
        definition: extractDefinition(e2.f.filePath)
        // f.filepathで得られるかどうかわからない
      };
    });
    for (const f3 of wordFiles.slice(0, 3)) {
      console.error("NORM_DEBUG_DATE", f3.slug, JSON.stringify(f3.dates));
    }
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
      const created = f3.frontmatter?.time ? new Date(f3.frontmatter.time) : f3.dates?.created;
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