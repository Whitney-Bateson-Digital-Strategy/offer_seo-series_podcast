import { SERIES } from "../data/series";
import { T, phase, formUrl, renderEpisodes, replayOut, renderReplay, type Phase } from "../lib/series";

// ?preview=2026-10-28T15:00 (ET) shows the page as it will look at that time.
// ?placeholders=1 shows where each episode player will sit.
const qs = new URLSearchParams(location.search), pv = qs.get("preview");
let offset = 0;
if (pv) {
  // Times without an offset are ET: UTC-4 until Nov 1, 2026 at 2 am, UTC-5 after
  const t = new Date(pv.length <= 16 ? pv + (pv >= "2026-11-01T02:00" ? ":00-05:00" : ":00-04:00") : pv);
  if (!isNaN(t.getTime())) {
    offset = t.getTime() - Date.now();
    const f = document.getElementById("preview-flag")!;
    f.textContent = "Preview: " + pv + " ET"; f.style.display = "block";
  }
}
const now = () => new Date(Date.now() + offset);
const $ = (id: string) => document.getElementById(id) as HTMLAnchorElement;
const SHOW_PH = qs.has("placeholders");

let replayShown = false;
function render() {
  $("ep-list").innerHTML = renderEpisodes(now(), SHOW_PH);
  renderReplaySection();
}

/* ---------- Live audit replay (top of page) ---------- */
function renderReplaySection() {
  const out = replayOut(now()), el = $("replay");
  if (out && !replayShown) { el.innerHTML = renderReplay(); el.hidden = false; replayShown = true; }
  else if (!out) { el.innerHTML = ""; el.hidden = true; replayShown = false; }
  replayTopbar();
}
function replayTopbar() {
  if (!replayOut(now()) || phase(now()) !== "after") return;
  $("tb-text").innerHTML = "The <b>live audit replay</b> is here!";
  $("tb-btn").style.display = ""; $("tb-btn").textContent = "Watch now"; $("tb-btn").href = "#replay"; $("tb-btn").removeAttribute("target");
}

/* ---------- Phase-dependent copy ---------- */
function renderPhase(p: Phase) {
  document.querySelectorAll<HTMLAnchorElement>("[data-form]").forEach((a) => {
    a.href = formUrl(now());
    // Open the form in a new tab so the page stays open behind it
    if (a.getAttribute("href") !== "#") { a.target = "_blank"; a.rel = "noopener"; }
  });
  if (p === "open") return;

  // From the audit cutoff on, sign-up is for the call and questions only, so drop every audit-request mention
  $("tb-text").innerHTML = "Join us live <b>Thursday, Oct 29 at 2 pm ET</b> and send in your SEO questions!";
  $("tb-btn").textContent = "Save my free seat";
  $("hero-btn").textContent = "Save my seat for the live audit";
  $("cl-btn").textContent = "Save my seat for the live audit";
  $("hero-note").textContent = "The live finale is free and open to everyone. Send in your questions!";
  $("cl-lead").textContent = "We'll point out what we'd fix first on each site, answer your questions, and give you a first look at our new SEO services. Anyone can join!";
  ["ec-deadline", "faq-submit", "faq-pick"].forEach((id) => { $(id).style.display = "none"; });
  $("ec-invite").textContent = "Everyone's invited! It's always more fun with more people in the room. 🙌";

  if (p === "live") {
    $("tb-text").innerHTML = "We're <b>live on Zoom</b> right now!";
    if (SERIES.zoomUrl) { $("tb-btn").textContent = "Join now"; $("tb-btn").href = SERIES.zoomUrl; $("tb-btn").target = "_blank"; }
    else $("tb-btn").style.display = "none";
    $("ec-eyebrow").textContent = "Happening now";
    $("countdown").style.display = "none"; $("cd-label").style.display = "none";
    $("ec-deadline").style.display = "none";
    if (SERIES.zoomUrl) { $("ec-btn").textContent = "Join us live"; $("ec-btn").href = SERIES.zoomUrl; $("ec-btn").target = "_blank"; }
  }
  if (p === "after") {
    $("tb-text").innerHTML = "Missed the live taping? It airs on the podcast <b>Monday, Nov 2</b>.";
    $("tb-btn").style.display = ""; $("tb-btn").textContent = "Listen"; $("tb-btn").href = "#episodes"; $("tb-btn").removeAttribute("target");
    $("ec-eyebrow").textContent = "That's a wrap";
    $("ec-title").textContent = "Thanks for joining us!";
    $("ec-date").textContent = "Airs Monday, Nov 2";
    $("ec-time").textContent = "The full taping, on The Growth Show";
    ["ec-list", "ec-invite", "countdown", "cd-label", "ec-deadline"].forEach((id) => { $(id).style.display = "none"; });
    document.querySelector<HTMLElement>(".ec-when")!.style.borderBottom = "0";
    [["hero-btn", "Listen to the series"], ["ec-btn", "Listen to the series"], ["cl-btn", "Listen to the series"]].forEach((x) => {
      $(x[0]).textContent = x[1]; $(x[0]).href = "#episodes"; $(x[0]).removeAttribute("target");
    });
    $("hero-note").textContent = "Catch all four episodes on The Growth Show.";
    $("cl-eyebrow").textContent = "Getting Found Online in the Age of AI";
    $("cl-h2").innerHTML = "Catch the finale <em>on the podcast</em>";
    $("hero-btn2").style.display = "none";
    $("cl-lead").textContent = "Catch all four episodes on The Growth Show.";
    replayTopbar();
  }
}

/* ---------- Countdown ---------- */
let p = phase(now());
function tick() {
  // Reveal the replay the moment it's released, even if the page was already open
  if (replayOut(now()) !== replayShown) renderReplaySection();
  // Re-render if a cutoff passes while the page is open (e.g. audit requests closing at 2 pm Wed)
  if (phase(now()) !== p) { p = phase(now()); render(); renderPhase(p); }
  // Counts down to the audit deadline first, then to the live taping
  const before = now() < T.cutoff, ms = (before ? T.cutoff : T.start).getTime() - now().getTime();
  $("cd-label").textContent = before ? "Audit requests close in" : "Live taping starts in";
  $("countdown").setAttribute("aria-label", before ? "Time until audit requests close" : "Time until the live taping");
  if (ms <= 0) return;
  const s = Math.floor(ms / 1000);
  $("cd-d").textContent = String(Math.floor(s / 86400));
  $("cd-h").textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
  $("cd-m").textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
  $("cd-s").textContent = String(s % 60).padStart(2, "0");
}

render(); renderPhase(p);
tick(); setInterval(tick, 1000);
