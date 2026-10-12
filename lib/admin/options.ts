import { JOB_TYPES } from "@/config/jobs";
import { ALL_INDUSTRIES, TALENT_LEVELS } from "@/config/industries";
import { ARRANGEMENTS } from "@/lib/data/jobs";

/* The select options shared by the job editor and the filters. */
export const JOB_OPTIONS = {
  industries: [...ALL_INDUSTRIES].sort((a, b) => a.name.localeCompare(b.name)).map((i) => ({ value: i.slug, label: i.name })),
  types: JOB_TYPES.map((t) => ({ value: t.id, label: t.label })),
  levels: TALENT_LEVELS.map((l) => ({ value: l.id, label: l.name })),
  arrangements: ARRANGEMENTS.map((a) => ({ value: a.id, label: a.label })),
};

export const industryName = (slug: string) => ALL_INDUSTRIES.find((i) => i.slug === slug)?.name ?? slug;
