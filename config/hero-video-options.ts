/* ============================================================
   HERO VIDEO OPTIONS

   Four clips generated to our own brief (reviewed Seedream stills
   animated on Kling 2.5, 1080p, owned outright), then twelve real
   stock clips (Magnific stock, none AI-generated), two per brief
   category, chosen by viewing each clip's frame rather than trusting
   its title. Stock previews are watermarked, low-resolution copies;
   the chosen stock clip is licensed at full resolution only after
   selection, via Magnific `stock_download` (600 credits for a
   premium clip). All files live under public/hero-video/options/.
   Whatever is chosen is encoded to web weight with
   `npm run hero:encode` before it ships (see README).
   ============================================================ */

export type HeroVideoOption = {
  id: string;
  /** "generated" clips are already final: 1080p, unwatermarked, owned.
      "stock" clips are watermarked previews until licensed. */
  kind: "generated" | "stock";
  /** The brief category this option answers. */
  category: string;
  /** The clip's own title in the catalogue, or our shot description. */
  title: string;
  /** Magnific stock id, used for the licensed download. Stock only. */
  stockId: number | null;
  /** Credits still to spend if chosen. */
  credits: number;
  preview: string;
  poster: string;
  /** What the frame actually shows, and why it made the cut. */
  note: string;
};

const opt = (
  id: string,
  category: string,
  title: string,
  stockId: number,
  note: string,
): HeroVideoOption => ({
  id,
  kind: "stock",
  category,
  title,
  stockId,
  credits: 600,
  preview: `/hero-video/options/${id}.mp4`,
  poster: `/hero-video/options/${id}.jpg`,
  note,
});

/* Generated to our own brief: a reviewed cinematic still animated
   with slow, restrained motion on Kling 2.5 at 1080p. Nothing left
   to license; the preview is the final file. */
const gen = (id: string, category: string, title: string, note: string): HeroVideoOption => ({
  id,
  kind: "generated",
  category,
  title,
  stockId: null,
  credits: 0,
  preview: `/hero-video/options/${id}.mp4`,
  poster: `/hero-video/options/${id}.jpg`,
  note,
});

export const HERO_VIDEO_OPTIONS: HeroVideoOption[] = [
  /* ── Every kind of work in one frame. The brief the site
        actually makes: Vertis staffs frontline through
        professional, so the hero has to show both. Blue collar
        is read through chef whites, a technician's coveralls and
        scrubs rather than hard hats and hi-vis, which belong to
        industries we do not staff. ────────────────────────── */
  gen(
    "gen-all-trades-wide",
    "Every kind of work",
    "Seven people from different trades and professions walking toward camera through an atrium, wide",
    "The shipped clip. Same cast as the atrium take but framed wide, so all seven survive the side crop the hero applies on a tall screen. Full length, margin at both edges.",
  ),
  gen(
    "gen-all-trades-atrium",
    "Every kind of work",
    "The same group, framed tighter",
    "Closer and warmer, but the group runs to the right edge, so a tall viewport crops the last two people out. Kept for reference.",
  ),
  gen(
    "gen-all-trades-plaza",
    "Every kind of work",
    "Eight professionals walking across a plaza into low morning sun",
    "The widest spread of jobs of the three: suit, office, scrubs, chef, apprentice, operations. Backlit haze, figures smaller in frame.",
  ),
  gen(
    "gen-all-trades-corridor",
    "Every kind of work",
    "A mixed group walking down a sunlit corridor",
    "Warmest of the three and the most intimate. A dark pillar cuts the left, which competes slightly with the headline.",
  ),

  /* ── Corporate, added when the brief moved away from
        industrial imagery. These two carry no hard hats, hi-vis
        or machinery. ──────────────────────────────────────── */
  gen(
    "gen-office-atrium",
    "Corporate and professional",
    "Business professionals walking and talking through a bright office atrium",
    "Diverse professionals mid stride with laptops, glass and warm daylight. The corporate answer to the factory walk.",
  ),
  gen(
    "gen-office-meeting",
    "Corporate and professional",
    "A client team working through a session in a glass meeting room",
    "Four people around a table, one explaining, one taking notes. Calm, premium, unmistakably office.",
  ),

  /* ── Generated to the earlier engineering brief ──────────── */
  gen(
    "gen-team-walk",
    "IT and engineering professionals",
    "A mixed engineering team walking and talking across a factory floor",
    "Mechanical, software, electrical and industrial engineers in one frame, warm window light, slow tracking shot.",
  ),
  gen(
    "gen-electrical",
    "Engineer solving a real-world problem",
    "An electrical engineer taking a reading at a control cabinet with an IT colleague",
    "Two disciplines on one problem. Near-static camera, small real movements.",
  ),
  gen(
    "gen-drawing",
    "Engineering team collaboration",
    "Two engineers over a technical drawing in a machine shop",
    "Golden side light, real tools, a hard hat and a laptop side by side. Very slow push in.",
  ),
  gen(
    "gen-fab",
    "Industrial and manufacturing engineers",
    "A process engineer and a software engineer on a semiconductor fab mezzanine",
    "Cleanroom and code in one conversation, warm faces, the line soft behind them.",
  ),

  /* ── Stock ───────────────────────────────────────────────── */
  /* 1 · Engineering team collaboration */
  opt(
    "team-collaboration",
    "Engineering team collaboration",
    "Multiethnic engineers working on a solar power project at a table",
    6599620,
    "Top-down over three engineers, drawings and a model. Working, not presenting.",
  ),
  opt(
    "team-drawings",
    "Engineering team collaboration",
    "Engineer studying a machine drawing in a fabrication workshop",
    8808937,
    "Over the shoulder on large-format drawings, real workshop behind. Quiet and cinematic.",
  ),

  /* 2 · IT and engineering professionals */
  opt(
    "it-fab-platform",
    "IT and engineering professionals",
    "Two engineers with a laptop on a semiconductor fab platform",
    7620328,
    "IT and engineering in one frame, a man and a woman, a real plant behind them.",
  ),
  opt(
    "it-data-center-corridor",
    "IT and engineering professionals",
    "Two technicians with a tablet in a data centre corridor",
    4373886,
    "The slickest IT frame in the catalogue. Cool-toned, which the purple overlay absorbs.",
  ),

  /* 3 · Industrial and manufacturing engineers */
  opt(
    "mfg-cnc-measure",
    "Industrial and manufacturing engineers",
    "Engineer measuring machined components at a CNC machine",
    4368452,
    "One person, real parts, real machine. The most authentic manufacturing frame.",
  ),
  opt(
    "industrial-manufacturing",
    "Industrial and manufacturing engineers",
    "Two technicians discussing an industrial project at a production facility",
    4841905,
    "Hi-vis pair over drawings on a plant floor. The orange vests sit inside the palette.",
  ),

  /* 4 · Women in engineering */
  opt(
    "women-cmm",
    "Women in engineering",
    "Engineer using a coordinate measuring machine in a factory",
    1834358,
    "Unposed and focused, a machined part in the foreground. The strongest of this category.",
  ),
  opt(
    "women-in-engineering",
    "Women in engineering",
    "Engineer walking through a cement plant at sunset",
    7428926,
    "The most cinematic frame in the set, though the most posed. Orange vest, warm light.",
  ),

  /* 5 · Engineer solving a real-world problem */
  opt(
    "problem-spindle",
    "Engineer solving a real-world problem",
    "Hands with a wrench on a machine spindle",
    3806747,
    "Tight, gritty, hands on the actual problem. No faces, all work.",
  ),
  opt(
    "problem-alignment",
    "Engineer solving a real-world problem",
    "Technician aligning a component inside an industrial machine",
    9251449,
    "Clean close-up of precise hands. Reads as skill rather than labour.",
  ),

  /* 6 · Diverse engineering team in a business environment */
  opt(
    "team-walking-plant",
    "Diverse engineering team in a business environment",
    "Three colleagues walking and talking through a plant",
    1796560,
    "Blazer, hi-vis and hard hats side by side: business and engineering in one walk.",
  ),
  opt(
    "team-plant-laptop",
    "Diverse engineering team in a business environment",
    "Engineers and a manager reviewing metrics on a plant floor",
    4966179,
    "Three people, three generations, a real conversation over a laptop and tablet.",
  ),
];

export function getHeroVideoOption(id: string | null | undefined) {
  return HERO_VIDEO_OPTIONS.find((o) => o.id === id) ?? null;
}
