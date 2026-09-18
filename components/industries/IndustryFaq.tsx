import { Faq } from "@/components/ui/Faq";

/* The industries questions. The accordion itself lives in
   components/ui/Faq.tsx; this file is just the content. */

const FAQS = [
  {
    q: "Which industries do you staff for?",
    a: "Eighteen, from administrative and financial services through manufacturing, healthcare and hospitality to information technology, semiconductor and energy. The explorer above is the full list. If your work sits between two of them, call us and we will tell you honestly whether we are the right fit.",
  },
  {
    q: "How quickly can you send people?",
    a: "For most roles you will have qualified profiles within 48 to 72 hours, and people on site within days. Volume and specialist searches take longer, and we will give you a real date at the first conversation rather than an optimistic one.",
  },
  {
    q: "Do you handle temporary and permanent hiring?",
    a: "Both, plus everything between. Temporary cover, contract, contract-to-hire, direct permanent hire, and whole project teams. We will recommend the arrangement that fits the work, even when a smaller one suits you better.",
  },
  {
    q: "What happens if a placement does not work out?",
    a: "We replace the person at no cost. Every candidate has been met, screened and reference checked by a recruiter before you see them, so this is rare, but the guarantee stands either way.",
  },
  {
    q: "Can you staff several locations at once?",
    a: "Yes. We recruit across the United States and deliver onshore, offshore from India, or a mix of the two. Multi-site programmes get one point of contact rather than one per location.",
  },
  {
    q: "What does it cost?",
    a: "It depends on the role, the arrangement and the volume, and we quote before any work starts. There is no charge for the first conversation, the shortlist or the replacement guarantee.",
  },
];

export function IndustryFaq() {
  return <Faq items={FAQS} />;
}
