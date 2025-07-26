import { defineCollection, defineContentConfig, z } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    atp_rules: defineCollection({
      source: "atp_rules/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        years: z.array(z.number())
      })
    }),
    atp_points: defineCollection({
      source: "atp_points/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        years: z.array(z.number())
      })
    }),
    wta_rules: defineCollection({
      source: "wta_rules/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        years: z.array(z.number())
      })
    }),
    wta_points: defineCollection({
      source: "wta_points/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        years: z.array(z.number())
      })
    })
  }
})
