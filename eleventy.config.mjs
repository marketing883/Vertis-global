import { EleventyRenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownItAnchor from "markdown-it-anchor";

export default async function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough — copy static assets straight into _site/
  eleventyConfig.addPassthroughCopy({ "src/public": "/" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "/assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/js": "/assets/js" });

  // Vendor JS straight out of node_modules. Keeps Lenis self-hosted instead of
  // pulling it from a CDN at runtime (see src/js/smooth-scroll.js).
  eleventyConfig.addPassthroughCopy({
    "node_modules/lenis/dist/lenis.mjs": "assets/js/vendor/lenis.mjs",
  });

  // Watch Tailwind output so the dev server reloads when CSS changes
  eleventyConfig.addWatchTarget("./_site/assets/css/main.css");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // Markdown — enable heading anchors for insights/case studies
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        class: "heading-anchor",
      }),
      level: [2, 3, 4],
    });
  });

  // Collections. Tag-based: content files live next to the index page that
  // lists them, and opt in with `tags:` in their front matter.
  eleventyConfig.addCollection("work", (collectionApi) =>
    collectionApi
      .getFilteredByTag("work")
      .sort((a, b) => {
        const yearA = a.data.year ? parseInt(a.data.year, 10) : 0;
        const yearB = b.data.year ? parseInt(b.data.year, 10) : 0;
        return yearB - yearA;
      })
  );

  eleventyConfig.addCollection("insights", (collectionApi) =>
    collectionApi
      .getFilteredByTag("insights")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  // Filters
  eleventyConfig.addFilter("isoDate", (date) =>
    date ? new Date(date).toISOString() : ""
  );
  eleventyConfig.addFilter("readableDate", (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
  eleventyConfig.addFilter("limit", (arr, n) => (arr ?? []).slice(0, n));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
