import * as z from "zod"

export const tournamentSchema = z.object({
  id: z.number("Invalid number"),
  name: z.string("Invalid text"),
  established: z.number("Invalid number").optional(),
  abolished: z.number("Invalid number").optional(),
  website: z.string("Invalid text").optional(),
  tours: z.array(z.string("Invalid text"))
})

export const eventSchema = z.object({
  id: z.number("Invalid number"),
  tournament: z.number("Invalid number").optional(),
  year: z.number("Invalid number").optional(),
  tours: z.array(z.string("Invalid text")),
  surface: z.string("Invalid text").optional(),
  supervisors: z.array(z.string("Invalid text")),
  venues: z.array(z.string("Invalid text")),
  atp_link: z.string("Invalid text").optional(),
  wta_link: z.string("Invalid text").optional(),
  men_link: z.string("Invalid text").optional(),
  women_link: z.string("Invalid text").optional(),
  wiki_link: z.string("Invalid text").optional(),
  category: z.string("Invalid text").optional(),
  atp_category: z.string("Invalid text").optional(),
  wta_category: z.string("Invalid text").optional(),
  men_category: z.string("Invalid text").optional(),
  women_category: z.string("Invalid text").optional(),
  sponsor_name: z.string("Invalid text").optional(),
  atp_sponsor_name: z.string("Invalid text").optional(),
  wta_sponsor_name: z.string("Invalid text").optional(),
  draw_type: z.string("Invalid text").optional(),
  atp_draw_s: z.string("Invalid text").optional(),
  atp_draw_d: z.string("Invalid text").optional(),
  atp_draw_qs: z.string("Invalid text").optional(),
  atp_draw_qd: z.string("Invalid text").optional(),
  wta_draw_s: z.string("Invalid text").optional(),
  wta_draw_d: z.string("Invalid text").optional(),
  wta_draw_qs: z.string("Invalid text").optional(),
  wta_draw_qd: z.string("Invalid text").optional(),
  men_draw_s: z.string("Invalid text").optional(),
  men_draw_d: z.string("Invalid text").optional(),
  men_draw_qs: z.string("Invalid text").optional(),
  men_draw_qd: z.string("Invalid text").optional(),
  women_draw_s: z.string("Invalid text").optional(),
  women_draw_d: z.string("Invalid text").optional(),
  women_draw_qs: z.string("Invalid text").optional(),
  women_draw_qd: z.string("Invalid text").optional(),
  draw_link: z.string("Invalid text").optional(),
  atp_draw_s_link: z.string("Invalid text").optional(),
  atp_draw_d_link: z.string("Invalid text").optional(),
  atp_draw_qs_link: z.string("Invalid text").optional(),
  atp_draw_qd_link: z.string("Invalid text").optional(),
  wta_draw_s_link: z.string("Invalid text").optional(),
  wta_draw_d_link: z.string("Invalid text").optional(),
  wta_draw_qs_link: z.string("Invalid text").optional(),
  wta_draw_qd_link: z.string("Invalid text").optional(),
  men_draw_s_link: z.string("Invalid text").optional(),
  men_draw_d_link: z.string("Invalid text").optional(),
  men_draw_qs_link: z.string("Invalid text").optional(),
  men_draw_qd_link: z.string("Invalid text").optional(),
  women_draw_s_link: z.string("Invalid text").optional(),
  women_draw_d_link: z.string("Invalid text").optional(),
  women_draw_qs_link: z.string("Invalid text").optional(),
  women_draw_qd_link: z.string("Invalid text").optional(),
  currency: z.string("Invalid text").optional(),
  atp_currency: z.string("Invalid text").optional(),
  wta_currency: z.string("Invalid text").optional(),
  men_currency: z.string("Invalid text").optional(),
  women_currency: z.string("Invalid text").optional(),
  pm: z.number("Invalid number").optional(),
  atp_pm: z.number("Invalid number").optional(),
  wta_pm: z.number("Invalid number").optional(),
  men_pm: z.number("Invalid number").optional(),
  women_pm: z.number("Invalid number").optional(),
  tfc: z.number("Invalid number").optional(),
  atp_tfc: z.number("Invalid number").optional(),
  wta_tfc: z.number("Invalid number").optional(),
  start_date: z.unknown().optional(),
  end_date: z.unknown().optional(),
  atp_start_date: z.unknown().optional(),
  atp_end_date: z.unknown().optional(),
  wta_start_date: z.unknown().optional(),
  wta_end_date: z.unknown().optional(),
  men_start_date: z.unknown().optional(),
  men_end_date: z.unknown().optional(),
  women_start_date: z.unknown().optional(),
  women_end_date: z.unknown().optional()
})

export const roundSchema = z.object({
  id: z.string("Invalid text"),
  tour: z.string("Invalid text"),
  draw: z.string("Invalid text"),
  type: z.string("Invalid text"),
  round: z.string("Invalid text"),
  number: z.number("Invalid number"),
  points: z.number("Invalid number").optional(),
  pm: z.number("Invalid number").optional(),
  eid: z.string("Invalid text").optional()
})

export const withdrawalSchema = z.object({
  id: z.string("Invalid text"),
  type: z.string("Invalid text"),
  team_reason: z.string("Invalid text").optional(),
  reason: z.string("Invalid text").optional(),
  draw: z.string("Invalid text"),
  team_mate: z.string("Invalid text").optional(),
  eid: z.string("Invalid text").optional(),
  seed: z.number("Invalid number").optional(),
  status: z.string("Invalid text").optional(),
  rank: z.number("Invalid number").optional()
})

export const ldaSchema = z.object({
  id: z.string("Invalid text"),
  draw: z.string("Invalid text"),
  type: z.string("Invalid text"),
  rank: z.number("Invalid number").optional(),
  eid: z.string("Invalid text").optional()
})

export const retirementSchema = z.object({
  id: z.string("Invalid text"),
  type: z.string("Invalid text"),
  team_reason: z.string("Invalid text").optional(),
  reason: z.string("Invalid text").optional(),
  eid: z.string("Invalid text").optional(),
  draw: z.string("Invalid text").optional()
})

export const personSchema = z.object({
  id: z.string("Invalid text").optional(),
  first_name: z.string("Invalid text"),
  last_name: z.string("Invalid text")
})

export const playerSchema = z.object({
  id: z.string("Invalid text"),
  first_name: z.string("Invalid text").optional(),
  last_name: z.string("Invalid text").optional(),
  tours: z.array(z.string("Invalid text")),
  country: z.string("Invalid text").optional(),
  previous_countries: z.array(z.string("Invalid text")),
  turned_pro: z.number("Invalid number").optional(),
  retired: z.number("Invalid number").optional(),
  coaches: z.array(z.string("Invalid text")),
  former_coaches: z.array(z.string("Invalid text")),
  atp_link: z.string("Invalid text").optional(),
  wta_link: z.string("Invalid text").optional(),
  wiki_link: z.string("Invalid text").optional(),
  official_link: z.string("Invalid text").optional(),
  bh: z.string("Invalid text").optional(),
  rh: z.boolean().optional(),
  current_singles: z.number("Invalid number").optional(),
  current_doubles: z.number("Invalid number").optional(),
  ch_singles: z.number("Invalid number").optional(),
  ch_doubles: z.number("Invalid number").optional(),
  singles_ch_date: z.any().optional(),
  doubles_ch_date: z.any().optional(),
  dob: z.any().optional(),
  dod: z.any().optional(),
  height: z.number("Invalid number").optional(),
  pm: z.number("Invalid number").optional(),
  hof: z.number("Invalid number").optional()
})

export const scrapeEventSchema = z.object({
  tid: z.number("Invalid number"),
  tid2: z.number("Invalid number").optional(),
  year: z.number("Invalid number"),
  year2: z.number("Invalid number").optional(),
  draw_size: z.number("Invalid number").optional(),
  type: z.enum(["Singles", "Doubles"]).optional(),
  draw: z.enum(["Main", "Qualifying"]).optional(),
  sets: z.enum(["Best3", "Best5"]).optional()
})
