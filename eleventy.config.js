import { format } from "date-fns";
import Image from "@11ty/eleventy-img";
import rssPlugin from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import path from "path";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {

  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  const md = markdownIt(options).use(markdownItFootnote);

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(rssPlugin);


  // Add a Nunjucks date filter
  eleventyConfig.addNunjucksFilter("date", function(date, dateFormat = "yyyy-MM-dd") {
    if (!date) return "";
    return format(new Date(date), dateFormat);
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/**/*.md").filter(post => !post.data.draft).reverse();
  });
 
  eleventyConfig.addPassthroughCopy("src/styles.css");

  eleventyConfig.addFilter("featuredFirst", (arr, count = 3) => {
    const featured = arr.filter(post => post.data && post.data.featured);
    const nonFeatured = arr.filter(post => !(post.data && post.data.featured));
    return [...featured, ...nonFeatured].slice(0, count);
  });

  // tags

  eleventyConfig.addFilter("getAllTags", function(collection) {
    let tagSet = new Set();
    collection.forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") tags = [tags];
        tags = tags.filter(tag => !["all", "nav"].includes(tag));
        for (const tag of tags) tagSet.add(tag);
      }
    });
    return [...tagSet].sort();
  });

  eleventyConfig.addFilter("slug", str => str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
  );


  // Images

  // Copy everything
  eleventyConfig.addPassthroughCopy("src/images");
  // Copy all images in posts to _site
  eleventyConfig.addPassthroughCopy("src/blog/posts/**/*.{jpg,jpeg,png,gif,svg,webp}");
 
  // Add the image processing shortcode
eleventyConfig.addNunjucksAsyncShortcode(
  "image",
  async function(src, alt, className = "", widths = [400, 800, 1200, 1536], formats = ["webp", "jpeg", "png"]) {
    let metadata = await Image(src, {
      widths: widths,
      formats: formats,
      urlPath: "/images/",
      outputDir: "./_site/images/"
    });

    let imageAttributes = {
      alt,
      sizes: "(max-width: 1200px) 100vw, 1200px",
      loading: "lazy",
      decoding: "async",
      class: className
    };

    return Image.generateHTML(metadata, imageAttributes);
  }
);

eleventyConfig.addNunjucksAsyncShortcode("imageUrl", async function(
  src, width = 400, format = "png"
) {
  let metadata = await Image(src, {
    widths: [width],
    formats: [format],
    urlPath: "/images/",
    outputDir: "./_site/images/"
  });
  return metadata[format][0].url;
});


eleventyConfig.addNunjucksFilter("dateSafe", function(date, format) {
  if(!date) return "";
  try {
    return this.env.filters.date(date, format);
  } catch(e) {
    return "";
  }
});


};


// Modern global config block
export const config = {
  templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],

  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    data: "_data"
  },
  dataTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  templateFormats: ["md", "njk", "html"],
  pathPrefix: "/"
};