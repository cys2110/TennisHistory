import * as z from "zod"

export const tournamentSchema = z.object({
  id: z.number("Please enter a valid numeric ID"),
  name: z.string("Please enter a name"),
  established: z.number("Please enter a valid year").optional(),
  abolished: z.number("Please enter a valid year").optional(),
  website: z.url("Please enter a valid URL").optional(),
  tours: z.array(z.enum(["ATP", "WTA", "Men", "Women"], "Please enter a valid tour")).nonempty("Please enter at least one tour")
})

export const eventSchema = z.object({
  id: z.number("Please enter a valid numeric ID"),
  tournament: z.any().optional(),
  year: z.number("Please enter a valid year").optional(),
  tours: z.array(z.enum(["ATP", "WTA", "Men", "Women"])).nonempty("Please select at least one tour"),
  surface: z.string("Please select a valid surface").optional(),
  supervisors: z.array(z.string("Please enter a valid name")).optional(),
  venues: z.array(z.string("Please enter a valid venue")).optional(),
  atp_link: z.url("Please enter a valid link").optional(),
  wta_link: z.url("Please enter a valid link").optional(),
  men_link: z.url("Please enter a valid link").optional(),
  women_link: z.url("Please enter a valid link").optional(),
  wiki_link: z.url("Please enter a valid link").optional(),
  category: z.string("Please enter a valid category").optional(),
  atp_category: z.string("Please enter a valid category").optional(),
  wta_category: z.string("Please enter a valid category").optional(),
  men_category: z.string("Please enter a valid category").optional(),
  women_category: z.string("Please enter a valid category").optional(),
  sponsor_name: z.string("Please enter a valid category").optional(),
  atp_sponsor_name: z.string("Please enter a valid category").optional(),
  wta_sponsor_name: z.string("Please enter a valid category").optional(),
  draw_type: z.string("Please enter a valid draw type").optional(),
  atp_draw_s: z.string("Please enter a valid draw type").optional(),
  atp_draw_d: z.string("Please enter a valid draw type").optional(),
  atp_draw_qs: z.string("Please enter a valid draw type").optional(),
  atp_draw_qd: z.string("Please enter a valid draw type").optional(),
  wta_draw_s: z.string("Please enter a valid draw type").optional(),
  wta_draw_d: z.string("Please enter a valid draw type").optional(),
  wta_draw_qs: z.string("Please enter a valid draw type").optional(),
  wta_draw_qd: z.string("Please enter a valid draw type").optional(),
  men_draw_s: z.string("Please enter a valid draw type").optional(),
  men_draw_d: z.string("Please enter a valid draw type").optional(),
  men_draw_qs: z.string("Please enter a valid draw type").optional(),
  men_draw_qd: z.string("Please enter a valid draw type").optional(),
  women_draw_s: z.string("Please enter a valid draw type").optional(),
  women_draw_d: z.string("Please enter a valid draw type").optional(),
  women_draw_qs: z.string("Please enter a valid draw type").optional(),
  women_draw_qd: z.string("Please enter a valid draw type").optional(),
  draw_link: z.url("Please enter a valid link").optional(),
  atp_draw_s_link: z.url("Please enter a valid link").optional(),
  atp_draw_d_link: z.url("Please enter a valid link").optional(),
  atp_draw_qs_link: z.url("Please enter a valid link").optional(),
  atp_draw_qd_link: z.url("Please enter a valid link").optional(),
  wta_draw_s_link: z.url("Please enter a valid link").optional(),
  wta_draw_d_link: z.url("Please enter a valid link").optional(),
  wta_draw_qs_link: z.url("Please enter a valid link").optional(),
  wta_draw_qd_link: z.url("Please enter a valid link").optional(),
  men_draw_s_link: z.url("Please enter a valid link").optional(),
  men_draw_d_link: z.url("Please enter a valid link").optional(),
  men_draw_qs_link: z.url("Please enter a valid link").optional(),
  men_draw_qd_link: z.url("Please enter a valid link").optional(),
  women_draw_s_link: z.url("Please enter a valid link").optional(),
  women_draw_d_link: z.url("Please enter a valid link").optional(),
  women_draw_qs_link: z.url("Please enter a valid link").optional(),
  women_draw_qd_link: z.url("Please enter a valid link").optional(),
  currency: z.string("Please enter a valid currency").optional(),
  atp_currency: z.string("Please enter a valid currency").optional(),
  wta_currency: z.string("Please enter a valid currency").optional(),
  men_currency: z.string("Please enter a valid currency").optional(),
  women_currency: z.string("Please enter a valid currency").optional(),
  pm: z.number("Please enter a valid number").optional(),
  atp_pm: z.number("Please enter a valid number").optional(),
  wta_pm: z.number("Please enter a valid number").optional(),
  men_pm: z.number("Please enter a valid number").optional(),
  women_pm: z.number("Please enter a valid number").optional(),
  tfc: z.number("Please enter a valid number").optional(),
  atp_tfc: z.number("Please enter a valid number").optional(),
  wta_tfc: z.number("Please enter a valid number").optional(),
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
  id: z.string("Please enter a valid id"),
  tour: z.enum(["ATP", "WTA"]),
  draw: z.enum(["Main", "Qualifying"]),
  type: z.enum(["Singles", "Doubles"]),
  round: z.string("Please select a valid round"),
  number: z.number("Please enter a valid number"),
  points: z.number("Please enter a valid number").optional(),
  pm: z.number("Please enter a valid number").optional(),
  eid: z.string("Please enter a valid id").optional()
})

export const withdrawalSchema = z.object({
  id: z.string("Please enter a valid id"),
  type: z.enum(["Singles", "Doubles"]).optional(),
  team_reason: z.string("Please enter a valid reason").optional(),
  reason: z.string("Please enter a valid reason").optional(),
  draw: z.enum(["Main", "Qualifying"]).optional(),
  team_mate: z.string("Please enter a valid id").optional(),
  eid: z.string("Please enter a valid id").optional(),
  seed: z.number("Please enter a valid seed").optional(),
  status: z.string("Please select a valid status").optional(),
  rank: z.number("Please enter a valid rank").optional()
})

export const ldaSchema = z.object({
  id: z.string("Please enter a valid id"),
  draw: z.enum(["Main", "Qualifying"]).optional(),
  type: z.enum(["Singles", "Doubles"]).optional(),
  rank: z.number("Please enter a valid rank").optional(),
  eid: z.string("Please enter a valid id").optional()
})

export const retirementSchema = z.object({
  id: z.string("Please enter a valid id"),
  type: z.enum(["Singles", "Doubles"]).optional(),
  team_reason: z.string("Please enter a valid reason").optional(),
  reason: z.string("Please enter a valid reason").optional(),
  eid: z.string("Invalid text").optional(),
  draw: z.string("Invalid text").optional()
})

export const personSchema = z.object({
  id: z.string("Please enter a valid id").optional(),
  first_name: z.string("Please enter a first name"),
  last_name: z.string("Please enter a last name")
})

export const playerSchema = z.object({
  id: z.string("Please enter a valid id"),
  first_name: z.string("Please enter a valid first name").optional(),
  last_name: z.string("Please enter a valid last name").optional(),
  tours: z.array(z.enum(["ATP", "WTA"])).nonempty("Please select at least one tour"),
  country: z
    .object({
      id: z.string("Please enter a valid country"),
      start_date: z.unknown().optional()
    })
    .optional(),
  previous_countries: z
    .array(
      z.object({
        id: z.string("Please enter a valid country"),
        start_date: z.unknown().optional(),
        end_date: z.unknown().optional()
      })
    )
    .optional(),
  turned_pro: z.number("Please enter a valid year").optional(),
  retired: z.number("Please enter a valid year").optional(),
  coaches: z
    .array(
      z.object({
        id: z.string("Please enter a valid id"),
        name: z.string().optional(),
        start_date: z.unknown().optional()
      })
    )
    .optional(),
  former_coaches: z
    .array(
      z.object({
        id: z.string("Please enter a valid id"),
        name: z.string().optional(),
        start_date: z.unknown().optional(),
        end_date: z.unknown().optional()
      })
    )
    .optional(),
  atp_link: z.url("Please enter a valid link").optional(),
  wta_link: z.url("Please enter a valid link").optional(),
  wiki_link: z.url("Please enter a valid link").optional(),
  official_link: z.url("Please enter a valid link").optional(),
  bh: z.enum(["One", "Two"]).optional(),
  rh: z.boolean().optional(),
  current_singles: z.number("Please enter a valid rank").optional(),
  current_doubles: z.number("Please enter a valid rank").optional(),
  ch_singles: z.number("Please enter a valid rank").optional(),
  ch_doubles: z.number("Please enter a valid rank").optional(),
  singles_ch_date: z.any().optional(),
  doubles_ch_date: z.any().optional(),
  dob: z.any().optional(),
  dod: z.any().optional(),
  height: z.number("Please enter a valid height in cm").optional(),
  pm: z.number("Please enter a valid number").optional(),
  hof: z.number("Please enter a valid year").optional()
})

export const scrapeEventSchema = z.object({
  tid: z.number("Please enter a valid id"),
  tid2: z.number("Please enter a valid id").optional(),
  year: z.number("Please enter a valid year"),
  year2: z.number("Please enter a valid year").optional(),
  draw_size: z.number("Please enter a valid draw size").optional(),
  type: z.enum(["Singles", "Doubles"]).optional(),
  draw: z.enum(["Main", "Qualifying"]).optional(),
  sets: z.enum(["Best3", "Best5"]).optional()
})
