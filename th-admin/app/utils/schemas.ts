import * as z from "zod"

export const tournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  established: z.number().optional(),
  abolished: z.number().optional(),
  website: z.string().optional(),
  tours: z.array(z.string())
})

export const eventSchema = z.object({
  id: z.number(),
  tournament: z.number().optional(),
  year: z.number().optional(),
  tours: z.array(z.string()),
  surface: z.string().optional(),
  supervisors: z.array(z.string()),
  venues: z.array(z.string()),
  atp_link: z.string().optional(),
  wta_link: z.string().optional(),
  men_link: z.string().optional(),
  women_link: z.string().optional(),
  wiki_link: z.string().optional(),
  category: z.string().optional(),
  atp_category: z.string().optional(),
  wta_category: z.string().optional(),
  men_category: z.string().optional(),
  women_category: z.string().optional(),
  sponsor_name: z.string().optional(),
  atp_sponsor_name: z.string().optional(),
  wta_sponsor_name: z.string().optional(),
  draw_type: z.string().optional(),
  atp_draw_s: z.string().optional(),
  atp_draw_d: z.string().optional(),
  atp_draw_qs: z.string().optional(),
  atp_draw_qd: z.string().optional(),
  wta_draw_s: z.string().optional(),
  wta_draw_d: z.string().optional(),
  wta_draw_qs: z.string().optional(),
  wta_draw_qd: z.string().optional(),
  men_draw_s: z.string().optional(),
  men_draw_d: z.string().optional(),
  men_draw_qs: z.string().optional(),
  men_draw_qd: z.string().optional(),
  women_draw_s: z.string().optional(),
  women_draw_d: z.string().optional(),
  women_draw_qs: z.string().optional(),
  women_draw_qd: z.string().optional(),
  draw_link: z.string().optional(),
  atp_draw_s_link: z.string().optional(),
  atp_draw_d_link: z.string().optional(),
  atp_draw_qs_link: z.string().optional(),
  atp_draw_qd_link: z.string().optional(),
  wta_draw_s_link: z.string().optional(),
  wta_draw_d_link: z.string().optional(),
  wta_draw_qs_link: z.string().optional(),
  wta_draw_qd_link: z.string().optional(),
  men_draw_s_link: z.string().optional(),
  men_draw_d_link: z.string().optional(),
  men_draw_qs_link: z.string().optional(),
  men_draw_qd_link: z.string().optional(),
  women_draw_s_link: z.string().optional(),
  women_draw_d_link: z.string().optional(),
  women_draw_qs_link: z.string().optional(),
  women_draw_qd_link: z.string().optional(),
  currency: z.string().optional(),
  atp_currency: z.string().optional(),
  wta_currency: z.string().optional(),
  men_currency: z.string().optional(),
  women_currency: z.string().optional(),
  pm: z.number().optional(),
  atp_pm: z.number().optional(),
  wta_pm: z.number().optional(),
  men_pm: z.number().optional(),
  women_pm: z.number().optional(),
  tfc: z.number().optional(),
  atp_tfc: z.number().optional(),
  wta_tfc: z.number().optional(),
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
  id: z.string(),
  tour: z.string(),
  draw: z.string(),
  type: z.string(),
  round: z.string(),
  number: z.number(),
  points: z.number().optional(),
  pm: z.number().optional(),
  eid: z.string().optional()
})

export const withdrawalSchema = z.object({
  id: z.string(),
  type: z.string(),
  team_reason: z.string().optional(),
  reason: z.string().optional(),
  draw: z.string(),
  team_mate: z.string().optional(),
  eid: z.string().optional(),
  seed: z.number().optional(),
  status: z.string().optional(),
  rank: z.number().optional()
})

export const ldaSchema = z.object({
  id: z.string(),
  draw: z.string(),
  type: z.string(),
  rank: z.number().optional(),
  eid: z.string().optional()
})

export const retirementSchema = z.object({
  id: z.string(),
  type: z.string(),
  team_reason: z.string().optional(),
  reason: z.string().optional(),
  eid: z.string().optional(),
  draw: z.string().optional()
})

export const personSchema = z.object({
  id: z.string().optional(),
  first_name: z.string(),
  last_name: z.string()
})

export const playerSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  tours: z.array(z.string()),
  country: z.string().optional(),
  previous_countries: z.array(z.string()),
  turned_pro: z.number().optional(),
  retired: z.number().optional(),
  coaches: z.array(z.string()),
  former_coaches: z.array(z.string()),
  atp_link: z.string().optional(),
  wta_link: z.string().optional(),
  wiki_link: z.string().optional(),
  official_link: z.string().optional(),
  bh: z.string().optional(),
  rh: z.boolean().optional(),
  current_singles: z.number().optional(),
  current_doubles: z.number().optional(),
  ch_singles: z.number().optional(),
  ch_doubles: z.number().optional(),
  singles_ch_date: z.any().optional(),
  doubles_ch_date: z.any().optional(),
  dob: z.any().optional(),
  dod: z.any().optional(),
  height: z.number().optional(),
  pm: z.number().optional(),
  hof: z.number().optional()
})
