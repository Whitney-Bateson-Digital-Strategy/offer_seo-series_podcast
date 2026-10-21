// Time-based logic shared by the build (initial HTML) and the browser (live updates).
import { SERIES } from "../data/series";

export type Phase = "open" | "closed" | "live" | "after";

const d = (s: string) => new Date(s);
export const T = {
  cutoff: d(SERIES.auditCutoff),
  start: d(SERIES.liveStart),
  end: d(SERIES.liveEnd),
  fb: d(SERIES.freebieUnlock),
};

export function phase(n: Date): Phase {
  if (n < T.cutoff) return "open";
  if (n < T.start) return "closed";
  if (n < T.end) return "live";
  return "after";
}

export function formUrl(n: Date): string {
  return (phase(n) !== "open" && SERIES.airtableFormUrlAfterCutoff) || SERIES.airtableFormUrl || "#";
}

/* ---------- Episodes ---------- */
const ICON_DL = '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
const ICON_CAL = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>';

function acastSrc(v: string): string {
  if (!v) return "";
  if (v.indexOf("http") === 0) return v;
  return "https://embed.acast.com/" + SERIES.acastShowId + "/" + v + "?" + SERIES.acastParams;
}

function freebieBox(n: Date): string {
  let btn;
  if (n < T.fb) btn = '<a class="btn btn-s btn-sm" aria-disabled="true">Unlocks Tue, Oct 27</a>';
  else if (!SERIES.freebieUrl) btn = '<a class="btn btn-s btn-sm" aria-disabled="true">Coming soon</a>';
  else btn = '<a class="btn btn-p btn-sm" href="' + SERIES.freebieUrl + '" target="_blank" rel="noopener">Download free</a>';
  return '<div class="ep-extra bonus" id="freebie"><div class="ep-extra-icon">' + ICON_DL + '</div>' +
    '<div><div class="ep-extra-k">Free resource · comes with Episode 2</div><h4>Score your site in 10 minutes</h4>' +
    '<p>A self-check for the 3 layers of SEO, so you can see where your site stands and where to focus first.</p></div>' + btn + '</div>';
}

function liveBox(n: Date): string {
  const p = phase(n);
  let title, body, btn;
  if (p === "live") {
    title = "We're live right now!";
    body = SERIES.zoomUrl ? "Come join us on Zoom." : "Check your email for the Zoom link.";
    btn = SERIES.zoomUrl ? '<a class="btn btn-p btn-sm" href="' + SERIES.zoomUrl + '" target="_blank" rel="noopener">Join now</a>' : '';
  } else {
    title = "Join us live on Thursday, Oct 29 at 2 pm ET";
    body = p === "open" ? "Save your seat, send in your SEO questions, and opt in for a chance at a live audit."
                        : "Save your seat and send in your SEO questions. We'll answer them live!";
    btn = '<a class="btn btn-p btn-sm" href="' + formUrl(n) + '"' + (formUrl(n) !== "#" ? ' target="_blank" rel="noopener"' : '') + '>Save my free seat</a>';
  }
  return '<div class="ep-extra coral"><div class="ep-extra-icon">' + ICON_CAL + '</div>' +
    '<div><div class="ep-extra-k">Live taping</div><h4>' + title + '</h4><p>' + body + '</p></div>' + btn + '</div>';
}

export function renderEpisodes(n: Date, showPlaceholders: boolean): string {
  let html = "";
  SERIES.episodes.forEach((ep) => {
    const out = n >= d(ep.release), src = acastSrc(ep.acast);
    let pill, cta = "", player = "", extra = "";
    if (ep.live && !out) {
      const p = phase(n);
      pill = p === "live" ? '<span class="pill p-live">Live now</span>'
           : p === "after" ? '<span class="pill p-soon">Airs Mon, Nov 2</span>'
           : '<span class="pill p-soon">The live finale</span>';
      if (p !== "after") extra = liveBox(n);
    } else if (out) {
      pill = '<span class="pill p-open">' + (ep.live ? 'Replay out now' : 'Out now') + '</span>';
      if (!src) cta = '<a class="btn btn-p btn-sm" href="' + SERIES.appleShow + '" target="_blank" rel="noopener">Listen now</a>';
    } else {
      pill = '<span class="pill p-closed">Coming soon</span>';
    }
    if (ep.extra === "freebie") extra = freebieBox(n);
    if (out && src) player = '<div class="ep-player"><iframe src="' + src + '" title="Listen to Episode ' + ep.n + '" loading="lazy" allow="autoplay"></iframe></div>';
    else if (showPlaceholders) player = '<div class="ep-ph"><b>Episode ' + ep.n + ' player</b>' + (ep.acast ? 'Shows here once it airs' : 'Add the Acast episode ID in src/data/series.ts') + '</div>';
    const notes = (out && ep.showNotes) ? '<div class="ep-links"><a href="' + ep.showNotes + '">Show notes →</a></div>' : '';
    html += '<article class="ep' + (ep.live ? ' featured' : '') + (out && !ep.live ? ' is-live' : '') + '">' +
      '<div class="ep-badge"><span>Ep</span><b>' + ep.n + '</b></div>' +
      '<div><div class="ep-meta"><span class="ep-date">' + ep.date + '</span>' + pill + '</div>' +
      '<h3>' + ep.title + '</h3><p>' + ep.desc + '</p>' + notes + '</div>' +
      '<div class="ep-cta">' + cta + '</div>' + player + extra + '</article>';
  });
  return html;
}
