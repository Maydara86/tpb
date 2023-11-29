import Image from "next/image";

import { Hero } from "@/components";
import { sectionRenderer } from "@/components/section-renderer";
import { fetchOneBySlug } from "@/lib/api";
import type { APIUrlParams } from "@/lib/api/types";
import { Callout } from "@turbostrapi/ui";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const UTM_PARAMS =
  "utm_source=turbostrapi-starter&utm_medium=basic&utm_campaign=turbostrapi-starter";

async function getPageBySlug(slug: string) {
  const pageParams: APIUrlParams<"api::page.page"> = {
    sort: { createdAt: "desc" },
    populate: {
      blocks: {
        populate: "*",
      },
      seo: {
        populate: "*",
      },
    },
  };

  return await fetchOneBySlug("api::page.page", slug, pageParams);
}

export default async function Page({
  params,
}: PageProps): Promise<JSX.Element> {
  const response = await getPageBySlug(params.slug);

  if (response.data === null) {
    notFound();
  }

  return (
    <>
      <div className="z-30 w-full max-w-5xl items-center justify-between font-mono text-sm md:flex">
        <Callout
          className="max-md:fixed	max-md:left-0 max-md:top-0 max-md:flex max-md:w-full max-md:justify-center max-md:rounded-none max-md:border-none max-md:pb-6 max-md:pt-8 max-md:text-xs"
          label="@turbostrapi/frontend"
        >
          apps/frontend
        </Callout>
        <div className="fixed bottom-0 left-0 flex h-36 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black md:static md:h-auto md:w-auto md:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 md:pointer-events-auto md:p-0"
            href={`https://vercel.com?${UTM_PARAMS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Inspired by{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="flex place-items-center">
        <Hero />
      </div>

      {response.data?.attributes.blocks?.map((block, index) =>
        sectionRenderer(block, index),
      )}
    </>
  );
}
