import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypyPrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
//import theme from "tailwindcss/defaultTheme";

const computedFields = <T extends { slug: string }>(data: T) => ({
    ...data,
    slugAsParam: data.slug.split("/").slice(1).join("/"),
});

const posts = defineCollection({
    name: "Post",
    pattern: "blog/**/*.mdx",
    schema: s
        .object({
            slug: s.path(),
            title: s.string().max(99),
            description: s.string().max(999).optional(),
            date: s.isodate(),
            published: s.boolean().default(true),
            body: s.mdx(),
            image: s.string().url().optional(),
        })
        .transform(computedFields),
});

export default defineConfig({
    root: "content",
    output: {
        data: "velite",
        assets: "public/static",
        base: "/static/",
        name: "[name]-[hash:6].[ext]",
        clean: true,
    },
    collections: { posts },
    mdx: {
        rehypePlugins: [
            rehypeSlug,
            [
                rehypyPrettyCode,
                {
                    theme: "github-dark",
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "wrap",
                    properties: {
                        className: ["subheading-anchor"],
                        ariaLabel: "Link to section",
                    },
                },
            ],
        ],
        remarkPlugins: [],
    },
});
