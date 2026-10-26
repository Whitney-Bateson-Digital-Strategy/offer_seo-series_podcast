export interface Episode {
  n: number;
  acast: string;
  showNotes: string;
  date: string;
  release: string;
  title: string;
  desc: string;
  live?: boolean;
  extra?: "freebie";
}

export interface Series {
  airtableFormUrl: string;
  airtableFormUrlAfterCutoff: string;
  freebieUrl: string;
  freebieUnlock: string;
  auditCutoff: string;
  liveStart: string;
  liveEnd: string;
  zoomUrl: string;
  acastShowId: string;
  acastParams: string;
  appleShow: string;
  spotifyShow: string;
  episodes: Episode[];
}

/* =====================================================================
   EDIT HERE: everything that needs swapping lives in this block.
   Times are UTC. ET is UTC-4 until Nov 1, 2026 (UTC-5 after).
   ===================================================================== */
export const SERIES: Series = {
  // Airtable form share link, e.g. "https://airtable.com/appXXXXXXXXXXXXXX/shrXXXXXXXXXXXXXX".
  // Every sign-up button on the page (and the Episode 4 callout) opens it. Leave "" until it's ready.
  airtableFormUrl: "https://airtable.com/app8n2l2G7IWv4Z4g/pagIvoUbhwjL1Lmz3/form",
  // Optional: a second version of the form WITHOUT the audit question. If set, the page
  // switches to it automatically at the audit cutoff (Wed Oct 28, 2 pm ET), so nobody has
  // to edit the live form at 2 pm. Leave "" to keep using the form above.
  airtableFormUrlAfterCutoff: "",

  // Per episode (in episodes below): paste the Acast episode ID (or the full
  // embed URL) into acast, and the episode's blog post URL into showNotes.
  // Players show automatically once an episode's release time passes.
  // Add ?placeholders=1 to the page URL to see where every player will sit.

  // Freebie (Episode 2). Shows as a download box inside the Episode 2 card.
  // The button stays locked until freebieUnlock.
  freebieUrl: "",
  freebieUnlock: "2026-10-27T04:00:00Z",        // Tue Oct 27, 12 am ET

  auditCutoff:  "2026-10-28T18:00:00Z",          // Wed Oct 28, 2 pm ET
  liveStart:    "2026-10-29T18:00:00Z",          // Thu Oct 29, 2 pm ET
  liveEnd:      "2026-10-29T19:30:00Z",          // assumes ~90 min

  // Zoom join link. Leave "" so the link only goes to people who register through Airtable.
  // If you fill it in, it shows as a "Join now" button on the page during the live window.
  zoomUrl: "",

  // Acast player. Each episode's ID is the last part of its embed URL:
  // https://embed.acast.com/65d4445a7e29af00164868b8/<EPISODE ID>
  acastShowId: "65d4445a7e29af00164868b8",
  acastParams: "accentColor=161616&bgColor=fc7c54&secondaryColor=161616",

  appleShow:   "https://podcasts.apple.com/us/podcast/the-growth-show-with-whitney-bateson/id1734664470",
  spotifyShow: "https://open.spotify.com/show/7EN6VaQaH8Kb1wfEc5Ahvo",

  episodes: [
    { n:1, acast:"6adaaf825de627c540ab43af", showNotes:"", date:"Mon, Oct 26", release:"2026-10-26T09:00:00Z", // 5 am ET
      title:"The Truth About SEO in the AI Age",
      desc:"What SEO actually is (quick and simple, promise!), how it's changed, and what AI means for how clients find your practice." },
    { n:2, acast:"", showNotes:"", date:"Tue, Oct 27", release:"2026-10-27T04:00:00Z",
      title:"What “Doing SEO” Actually Looks Like",
      desc:"Matt walks through what it really means for your website, the 3 layers that matter, and the mistakes we see most often. This one comes with a free resource to score your own site.",
      extra:"freebie" },
    { n:3, acast:"", showNotes:"", date:"Wed, Oct 28", release:"2026-10-28T04:00:00Z",
      title:"Why Good SEO Still Doesn't Fill Your Calendar (and What To Do About It)",
      desc:"Getting traffic but your calendar still isn't full? We're talking about the strategy mistakes we see on audits, how the approach changes for local and virtual practices, and why these problems are so hard to spot on your own site." },
    { n:4, acast:"", showNotes:"", date:"Thu, Oct 29", release:"2026-11-02T05:00:00Z", live:true,
      title:"We're Auditing Two Practice Websites Live, Taking Your Questions, and Unveiling Our New SEO Services",
      desc:"Ever wondered what an SEO expert actually looks for? Pull up a chair while Matt walks through two real practice websites and shows what he'd fix first and why. Bring your questions and leave with ideas you can try on your own site right away. Airs on the podcast Monday, Nov 2." }
  ]
};
