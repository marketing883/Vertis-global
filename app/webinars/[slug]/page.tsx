import type { Metadata } from "next";
import {
  ContentDetailPage,
  contentDetailMetadata,
  contentStaticParams,
} from "@/components/content/ContentPages";

type Params = Promise<{ slug: string }>;

/* Items published in the admin after the build render on first visit. */
export const dynamicParams = true;

export function generateStaticParams() {
  return contentStaticParams("webinar");
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return contentDetailMetadata("webinar", (await params).slug);
}

export default async function Page({ params }: { params: Params }) {
  return <ContentDetailPage type="webinar" slug={(await params).slug} />;
}
