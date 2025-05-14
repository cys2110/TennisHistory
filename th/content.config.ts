import { defineCollection, defineContentConfig, z } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    rules: defineCollection({
      source: "rules/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        years: z.array(z.number())
      })
    }),
    points: defineCollection({
      source: "points/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        years: z.array(z.number())
      })
    })
  }
})
