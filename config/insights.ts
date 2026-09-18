/* ============================================================
   INSIGHTS

   Articles are DATA. To publish a post, add an entry to POSTS and
   drop its image in public/photos/. The homepage shows the three
   most recent, /insights lists everything, /insights/<slug> renders
   the article. Newest first, sorted by `date`, so order here does
   not matter.

   Body paragraphs are plain strings. A string that starts with
   "## " renders as a subheading. Keep copy free of long dashes.
   ============================================================ */

export type InsightCategory = "For employers" | "For job seekers" | "Industry";

export type InsightPost = {
  slug: string;
  title: string;
  /** One or two sentences shown in lists. */
  excerpt: string;
  category: InsightCategory;
  /** ISO date, e.g. 2026-08-26. */
  date: string;
  readingMinutes: number;
  image: { src: string; alt: string };
  body: string[];
};

const POSTS: InsightPost[] = [
  {
    slug: "how-to-staff-a-shift-that-starts-monday",
    title: "How to staff a shift that starts Monday",
    excerpt:
      "A late order, a resignation, a season that arrived early. Here is how to get reliable people on the floor in days without lowering the bar.",
    category: "For employers",
    date: "2026-08-26",
    readingMinutes: 4,
    image: {
      src: "/photos/insight-staffing-plan.jpg",
      alt: "An operations manager and an HR coordinator working through next week's staffing schedule at a glass wall",
    },
    body: [
      "Most staffing emergencies are not really surprises. A big customer moves a delivery date. Two people hand in notice in the same week. The season starts three weeks earlier than the forecast said it would. The work is the same as it was yesterday. There are simply fewer hands to do it.",
      "When that happens, the instinct is to post a job and hope. A posting takes days to draw applications, days more to screen them, and by the time someone starts the crunch has passed or the overtime bill has arrived. Here is what works instead.",
      "## Describe the shift, not the job title",
      "A recruiter can move quickly when they know exactly what a day looks like. Start time, end time, what the person will be lifting, driving or handling, whether there is a forklift certification involved, and who they report to. Two minutes of detail saves two days of back and forth.",
      "## Say how many, and for how long",
      "Four people for six weeks is a different request from four people permanently. Temporary cover lets you meet the peak without carrying the cost afterwards. Contract-to-hire lets you keep the ones who turn out to be right. Tell us which you need and we will match the people to it. Someone who wants a permanent role will not be happy on a six-week assignment, and it shows.",
      "## Let the recruiter do the screening",
      "Every person we send has been met, reference-checked and vouched for by one of our recruiters. That is the point of working with a staffing partner rather than a job board. You should be meeting two or three people worth your time, not sifting through forty applications.",
      "## Plan the first morning",
      "The fastest way to lose a good temporary worker is a bad first hour. Have the safety briefing ready, a badge printed, and someone on the floor who knows they are coming. People who feel expected stay. People who stand at reception for forty minutes rarely come back on day two.",
      "## When to call",
      "The best time to call is the moment you know the gap is coming, even if it is only a possibility. A heads-up on Tuesday means people on the floor on Monday. A call on Friday afternoon can still work, and often does, but every day of notice makes the match better.",
    ],
  },
  {
    slug: "what-to-bring-to-a-staffing-interview",
    title: "What to bring to a staffing interview, and what to leave at home",
    excerpt:
      "A conversation with a recruiter is not a test. It is the start of someone working on your behalf. A little preparation makes it work much better.",
    category: "For job seekers",
    date: "2026-08-12",
    readingMinutes: 3,
    image: {
      src: "/photos/insight-interview.jpg",
      alt: "A candidate sitting across a table from a recruiter in a small office in afternoon light",
    },
    body: [
      "When you meet a recruiter at a staffing company, you are not interviewing for one job. You are meeting the person who will put your name forward for the next one, and the one after that. The better they understand you, the better the roles they can offer. Here is how to make that conversation count.",
      "## Bring the plain facts",
      "Your work history, including the short assignments and the jobs you left. Dates do not need to be exact, but gaps are worth explaining in a sentence. Bring any certifications you hold, even the ones you think are unrelated: a forklift ticket, a food handler card, a CPR certificate, a security clearance. Each one opens a category of work.",
      "## Bring your real availability",
      "Tell us the shifts you can work and the ones you cannot. Nights, weekends, a second job, school pick-up, a bus route that stops at ten. None of this counts against you. It lets us match you with a job you can actually keep, which is the only kind worth having.",
      "## Bring what you want next",
      "A recruiter can only work toward a goal they know about. If you are taking warehouse work now but want to move into maintenance, say so. If you want stability more than pay, or pay more than stability, say that too. These are the details that turn a placement into a career.",
      "## Leave the rehearsed answers at home",
      "You do not need a story about your greatest weakness. A staffing interview is closer to a conversation with a colleague than a panel interview. Honest answers about what you liked and disliked in past jobs are far more useful than polished ones.",
      "## Leave the worry at home too",
      "If you are between jobs, you are in the most common situation we see. It is not a mark against you. It is the reason we exist. Come in, tell us what you can do, and let us go to work for you.",
    ],
  },
  {
    slug: "contract-to-hire-explained",
    title: "Contract-to-hire, explained",
    excerpt:
      "The arrangement that lets an employer and a new hire try each other out before committing. How it works, who it suits, and where it goes wrong.",
    category: "For employers",
    date: "2026-07-29",
    readingMinutes: 4,
    image: {
      src: "/photos/insight-first-day.jpg",
      alt: "A manager showing a new starter to his desk on his first day, setting down a laptop and a welcome folder",
    },
    body: [
      "Contract-to-hire is the middle path between a temporary assignment and a permanent offer. The person joins on a fixed contract, usually three to six months, working for you on site as part of the team. At the end of the period you decide whether to bring them on permanently. Most of the time, you do.",
      "## Why employers use it",
      "A resume and two interviews tell you whether someone can do the job on paper. Ninety days on the floor tell you whether they show up on time, get on with the crew, and handle the Tuesday nobody planned for. Contract-to-hire lets you make the permanent decision with real evidence instead of a good feeling.",
      "It also moves quickly. Because the initial commitment is a contract, the approval process is lighter than a permanent requisition, and the person can often start within a week or two of the first conversation.",
      "## Why candidates accept it",
      "Good candidates are choosy too. A contract period lets them see the real workplace before committing, and it gets them earning while they decide. For someone changing industries or returning to work, it is often the door that opens first. The arrangement works best when it is described honestly at the outset: a real path to a permanent role, not a way to delay one.",
      "## Where it goes wrong",
      "The most common mistake is treating the contract period as a holding pattern. If the person is left out of training, meetings and the team chat because they are not permanent yet, they will not feel like part of the team, and they will not perform like it. Onboard them on day one as if they were staying. Most of them will.",
      "The second mistake is silence at the end. Decide early, and tell the person where they stand. A conversion offer in week ten is a great moment. A contract that quietly lapses is a lost hire and a bad story.",
      "## Is it right for the role?",
      "Contract-to-hire suits roles where fit matters and the work can be learned on the job: administrative and office roles, skilled trades, technical support, many nursing and care positions, and most production and logistics work. For a senior specialist you have been courting for months, a direct offer is usually the better signal. If you are not sure, ask us. That is what we are for.",
    ],
  },
];

export function getInsights(): InsightPost[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestInsights(count = 3): InsightPost[] {
  return getInsights().slice(0, count);
}

export function getInsight(slug: string): InsightPost | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export const INSIGHT_CATEGORIES: InsightCategory[] = ["For employers", "For job seekers", "Industry"];

export function formatInsightDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
