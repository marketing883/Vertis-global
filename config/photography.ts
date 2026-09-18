/* ============================================================
   PHOTOGRAPHY REGISTRY

   People are the emotional centre of this site, and the RANGE of
   people is the brand. Across the set the cast spans frontline,
   trades, administrative, professional and technical work.

   Files live in public/photos/<id>.jpg. Set `src` to enable a slot;
   <Photo slot="..." /> renders a tonal placeholder until then.

   ONE STYLE FOR THE WHOLE SET
   Editorial documentary photography. Natural available light,
   shallow depth of field, candid moments at work, subject not
   looking at camera, natural skin, a muted warm grade that sits
   with the purple and orange palette. No handshakes, no staged
   meetings, no pointing at screens, no thumbs-up.
   ============================================================ */

export type PhotoSlot = {
  id: string;
  src: string | null;
  alt: string;
  /** Width / height. Reserves the box so CLS stays at zero. */
  aspect: number;
  brief: string;
};

/* Every slot resolves to public/photos/<id>.jpg. Pass `null` as the
   final argument to fall back to the placeholder for a slot whose
   file has been removed. */
const slot = (
  id: string,
  alt: string,
  aspect: number,
  brief: string,
  src: string | null = `/photos/${id}.jpg`,
): PhotoSlot => ({ id, src, alt, aspect, brief });

export const PHOTOS = {
  /* ── Hero: one warm composition of several professions ──── */
  heroMain: slot(
    "hero-main",
    "Five people from different professions, a nurse, a welder, a warehouse associate, an office professional and an engineer, standing together at the end of a shift",
    9 / 10,
    "PORTRAIT 9:10. A mixed group of workers together in warm light; the range of work in one frame.",
  ),

  /* ── Hero mosaic (retained for reuse on interior pages) ──── */
  heroA: slot(
    "hero-a",
    "A nurse in scrubs pausing to check a chart in a hospital corridor",
    3 / 4,
    "PORTRAIT. A nurse in a real clinical corridor, caught between tasks.",
  ),
  heroB: slot(
    "hero-b",
    "An electrician working at an open panel inside a manufacturing plant",
    1,
    "SQUARE. A tradesperson at an electrical panel in a plant, hands and tools visible.",
  ),
  heroC: slot(
    "hero-c",
    "An office coordinator on a call at a front desk",
    1,
    "SQUARE. An administrative professional at a front desk, mid-call.",
  ),
  heroD: slot(
    "hero-d",
    "A software developer at a desk with a colleague looking on",
    3 / 4,
    "PORTRAIT. A developer at a desk, one colleague leaning in; screen out of focus.",
  ),

  /* ── Industries page ────────────────────────────────────── */
  industriesHero: slot(
    "industries-hero",
    "Business professionals crossing a bright modern office atrium mid morning, two of them walking and talking with laptops",
    3 / 2,
    "WIDE. A corporate atrium in motion; the range of professional work in one frame.",
  ),
  industriesTeam: slot(
    "industries-team",
    "Two talent acquisition professionals reviewing candidate shortlists together on a large screen in a modern office",
    16 / 9,
    "WIDE. Hiring work itself: two people going through a shortlist, absorbed.",
  ),

  /* ── Industry pages: two per industry, appropriate to the
        work rather than generic office stock. ───────────────── */
  industryEngineeringHero: slot(
    "industry-engineering-hero",
    "Two engineers reviewing a 3D CAD assembly on a large monitor in a modern engineering office",
    3 / 2,
    "WIDE. Design review at the screen. Considered, professional, no hard hats.",
  ),
  industryEngineeringLab: slot(
    "industry-engineering-lab",
    "A young engineer taking a reading from a bench instrument in a clean test laboratory while a senior colleague talks it through",
    4 / 3,
    "Test and validation work. Precise and orderly rather than grimy.",
  ),
  industryAdministrativeHero: slot(
    "industry-administrative-hero",
    "An executive assistant working through a diary at a bright administration desk while a colleague drops off a document",
    3 / 2,
    "WIDE. The desk the office runs through.",
  ),
  industryFinanceHero: slot(
    "industry-finance-hero",
    "Two finance professionals working through a month end schedule together, printed reports and a spreadsheet on screen",
    3 / 2,
    "WIDE. Month end, where finance hiring is judged.",
  ),
  industryHealthcareHero: slot(
    "industry-healthcare-hero",
    "Two nurses in scrubs reviewing the patient board together at a hospital nurses station during handover",
    3 / 2,
    "WIDE. Handover, where continuity is protected or lost.",
  ),
  industryHrHero: slot(
    "industry-hr-hero",
    "An HR team around a small table with printed org charts, talking through a hiring plan",
    3 / 2,
    "WIDE. The people who hire the people.",
  ),
  industryItHero: slot(
    "industry-it-hero",
    "Two software engineers reviewing code together on a large monitor at a standing desk",
    3 / 2,
    "WIDE. A review at the screen, which is where most of this work happens.",
  ),
  industryInsuranceHero: slot(
    "industry-insurance-hero",
    "Two insurance professionals reviewing a claim file together at a desk, documents spread out and a claims system on screen",
    3 / 2,
    "WIDE. A claim being worked properly.",
  ),
  industryManufacturingHero: slot(
    "industry-manufacturing-hero",
    "A production supervisor and a quality inspector reviewing a machined component together in a clean modern facility",
    3 / 2,
    "WIDE. Quality at the point it is decided. Orderly, well lit, no grime.",
  ),
  industryIndustrialHero: slot(
    "industry-industrial-hero",
    "A shift lead briefing two associates at the start of a shift in a clean modern distribution centre",
    3 / 2,
    "WIDE. Start of shift, where an industrial day is won or lost.",
  ),
  industryRetailHero: slot(
    "industry-retail-hero",
    "A store manager and an associate checking stock on a handheld device on the floor of a bright modern store",
    3 / 2,
    "WIDE. The floor, mid conversation rather than mid pose.",
  ),
  industryHospitalityHero: slot(
    "industry-hospitality-hero",
    "A front desk supervisor and a colleague at a hotel reception preparing for arrivals",
    3 / 2,
    "WIDE. Front of house before the rush.",
  ),
  industryMarketingHero: slot(
    "industry-marketing-hero",
    "Three marketers reviewing campaign performance on a screen and printed layouts in a modern office",
    3 / 2,
    "WIDE. A campaign being picked apart, not celebrated.",
  ),
  industrySalesHero: slot(
    "industry-sales-hero",
    "An account manager on a call at a standing desk with a pipeline board behind, mid conversation",
    3 / 2,
    "WIDE. The call that actually moves the number.",
  ),
  industryGovernmentHero: slot(
    "industry-government-hero",
    "Two public sector professionals reviewing a programme document together in a plain civic office",
    3 / 2,
    "WIDE. Public sector work, plain and unglamorous.",
  ),
  industryEnergyHero: slot(
    "industry-energy-hero",
    "A utilities operations pair reviewing readings on a monitoring wall in a clean control room",
    3 / 2,
    "WIDE. Grid and plant operations, calm and precise.",
  ),
  industryAutomotiveHero: slot(
    "industry-automotive-hero",
    "A service advisor and a technician talking through a job at a clean modern dealership service drive",
    3 / 2,
    "WIDE. The service drive, where automotive staffing actually bites.",
  ),
  industrySemiconductorHero: slot(
    "industry-semiconductor-hero",
    "Two engineers in cleanroom gowning reviewing tool data on a screen at a fab mezzanine",
    3 / 2,
    "WIDE. Fab work, gowned and precise.",
  ),
  industryTelecomHero: slot(
    "industry-telecom-hero",
    "A network engineer and a colleague working through a fault at a rack in a clean modern network operations space",
    3 / 2,
    "WIDE. Network work, indoors and orderly.",
  ),

  /* ── Employers and job seekers ──────────────────────────── */
  employerHero: slot(
    "employer-hero",
    "A hiring manager and a recruiter going through a printed shortlist together across a table",
    3 / 2,
    "WIDE. The moment a shortlist gets decided. Two people, one page, coffee.",
  ),
  employerTeam: slot(
    "employer-team",
    "A department head briefing four colleagues around a desk in a modern office",
    16 / 9,
    "WIDE. The team the hire joins. Ordinary, busy, real.",
  ),
  candidateHero: slot(
    "candidate-hero",
    "A woman walking through a bright building lobby on her way to an interview, folder under her arm",
    3 / 2,
    "WIDE. Quietly hopeful, mid stride. The feeling of a good morning.",
  ),
  candidateConversation: slot(
    "candidate-conversation",
    "A recruiter listening to a job seeker across a small table, two mugs between them",
    4 / 3,
    "A conversation, not an interrogation. The promise the page makes.",
  ),
  jobsFirstDay: slot(
    "jobs-first-day",
    "A manager welcoming a new starter and showing him to his desk on his first morning in a bright open plan office",
    3 / 2,
    "The first morning. The outcome the jobs page is working toward.",
  ),

  /* ── About page ─────────────────────────────────────────── */
  aboutHero: slot(
    "about-hero",
    "Five colleagues standing together in a bright modern office, one speaking while the others listen and one laughs",
    3 / 2,
    "WIDE. Us, or a team like ours. Confident, warm, unmistakably an office.",
  ),
  aboutRecruiter: slot(
    "about-recruiter-portrait",
    "A recruiter at her desk mid phone call, handwritten notes and a laptop in front of her",
    3 / 4,
    "PORTRAIT. The work itself: one recruiter, one conversation, notes on paper.",
  ),
  /* The founder portrait as supplied: a wide black and white frame
     with him on the right and empty black on the left, composed to
     sit behind type. It is used full bleed under the purple scrim
     rather than cropped, which is what the empty half is for. */
  founder: slot(
    "founder-jag",
    "Jag, founder of Vertis Global",
    1964 / 801,
    "WIDE. The founder, black and white, subject right, black ground left.",
    "/photos/founder-jag.png",
  ),
  aboutFirstDay: slot(
    "about-first-day",
    "A new starter being welcomed into a modern office by two colleagues and shown toward her desk",
    16 / 9,
    "WIDE. The point of the whole business: somebody's first day.",
  ),
  aboutCulture: slot(
    "about-culture",
    "Four colleagues with coffee around an office kitchen counter, two of them laughing",
    16 / 9,
    "WIDE. A real break in a real workplace. Unguarded.",
  ),

  /* ── Service pages: one hero each, deliberately different ── */
  serviceTemporary: slot(
    "service-temporary",
    "A workforce coordinator handing visitor badges to three temporary staff on their first morning in a corporate reception area",
    3 / 2,
    "WIDE. First morning for temporary staff. Badges, a welcome, a bright lobby.",
  ),
  serviceContract: slot(
    "service-contract",
    "A contract specialist standing at the end of a meeting room table explaining something to a client team over open laptops",
    3 / 2,
    "WIDE. A specialist embedded in a client team, mid working session.",
  ),
  serviceContractToHire: slot(
    "service-contract-to-hire",
    "A woman working at her desk while her manager stands beside her, relaxed and approving, three months into the job",
    3 / 2,
    "WIDE. Three months in. Trust earned, not instruction given.",
  ),
  serviceDirectHire: slot(
    "service-direct-hire",
    "A woman leading an informal stand up meeting in a bright open plan office while three colleagues listen",
    3 / 2,
    "WIDE. A permanent hire settled in and running the room.",
  ),
  serviceProjectTeam: slot(
    "service-project-team",
    "A cross functional team of five around a table in a modern office, working through printed plans together",
    3 / 2,
    "WIDE. A whole team assembled around one piece of work.",
  ),

  /* ── Range of work: one person per level ───────────────── */
  levelFrontline: slot(
    "level-frontline",
    "A workplace operations coordinator with a tablet checking a meeting room setup in a modern office",
    3 / 4,
    "PORTRAIT. Operations work in a corporate building, mid task.",
  ),
  levelSkilled: slot(
    "level-skilled",
    "An IT support specialist kneeling at an open equipment cabinet in a modern office, tablet in hand",
    3 / 4,
    "PORTRAIT. Hands on technical work in a clean, modern workplace.",
  ),
  levelAdmin: slot(
    "level-admin",
    "An administrative assistant at a desk organising the day",
    3 / 4,
    "PORTRAIT. An office professional at a desk in natural light.",
  ),
  levelProfessional: slot(
    "level-professional",
    "An accountant reviewing figures with a colleague",
    3 / 4,
    "PORTRAIT. A professional in conversation with a colleague over documents.",
  ),
  levelSpecialized: slot(
    "level-specialized",
    "A data specialist studying charts across two screens at a modern workstation, notebook of workings beside her",
    3 / 4,
    "PORTRAIT. Specialised analytical work, calm and focused.",
  ),

  /* ── How it works ───────────────────────────────────────── */
  howItWorks: slot(
    "how-it-works",
    "A recruiter listening to a candidate across a table",
    4 / 3,
    "Two people in a real conversation; the recruiter listening, not selling.",
  ),

  /* ── Pathways ───────────────────────────────────────────── */
  pathEmployer: slot(
    "path-employer",
    "A hiring manager sitting on the edge of a desk in a modern office, listening to a member of her team",
    1,
    "SQUARE. A manager mid-conversation with someone on their team, listening.",
  ),
  pathCandidate: slot(
    "path-candidate",
    "A young professional waiting composed in a bright modern office waiting area before an interview, folder on his lap",
    1,
    "SQUARE. A candidate before an interview. Quiet, confident, human.",
  ),
} satisfies Record<string, PhotoSlot>;

export type PhotoId = keyof typeof PHOTOS;

export function missingPhotoCount() {
  return Object.values(PHOTOS).filter((p) => !p.src).length;
}
