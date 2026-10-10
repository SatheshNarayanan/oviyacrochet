import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

type Args = {
  title: Metadata["title"];       // string, or { absolute: "..." } to skip the template
  description: string;            // 120 to 155 characters
  path: string;                   // clean path, e.g. "/shop/bags"
  image?: string;                 // absolute or site-relative image URL
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, image, noindex }: Args): Metadata {
  const img = image ?? SITE.ogImage;
  const plainTitle = typeof title === "string" ? title : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url: absoluteUrl(path),
      title: plainTitle ?? SITE.name,
      description,
      images: [{ url: img, width: 1200, height: 630, alt: plainTitle ?? SITE.name }],
    },
    twitter: { card: "summary_large_image", title: plainTitle ?? SITE.name, description, images: [img] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
