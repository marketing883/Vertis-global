import "server-only";
import { revalidatePath } from "next/cache";

/* After a publish, edit or delete in the admin, every cached public
   page is marked stale and rebuilds on its next visit. Jobs and
   content appear in many places (home, industry pages, jobs, insights,
   resources, the sitemap), and pages read from SQLite in microseconds,
   so refreshing everything is simpler and safer than tracking which
   page shows which item. */
export function refreshPublicSite() {
  revalidatePath("/", "layout");
}
