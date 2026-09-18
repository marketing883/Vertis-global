"use client";

import { useEffect } from "react";
import { useHireTalent, type HireContext } from "./HireTalentProvider";

/* Mounted once by a page that has context of its own. Every plain
   `open()` on that page inherits it: the hero button, the closing
   call to action, the sticky bar, and the site header's own Hire
   Talent button, which would otherwise send a lead with no idea
   which page it came from. Cleared on unmount, so the context never
   follows the visitor to the next page. */
export function HireTalentScope({ industry, service, serviceName, need }: HireContext) {
  const { setScope } = useHireTalent();

  useEffect(() => {
    setScope({ industry, service, serviceName, need });
    return () => setScope({});
  }, [industry, service, serviceName, need, setScope]);

  return null;
}
