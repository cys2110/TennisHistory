import * as z from "zod"

export const eventSchema = z.object({
  id: z.number("Please enter an event ID").int("Event ID must be a number").positive("Event ID must be a positive number"),
  tournament: z.object({
    id: z.number("Please enter a tournament ID").int("Tournament ID must be a number").positive("Tournament ID must be a positive number"),
    label: z.string("Please enter a tournament name")
  }),
  year: z.number("Please enter a valid year").int("Please enter a valid year").positive("Please enter a valid year"),
  tours: z.array(z.literal(Object.keys(TourEnum), "Please select a valid tour")),
  surface: z.string().optional(),
  supervisors: z.array(
    z.object({
      id: z.string("Please enter a valid supervisor ID"),
      label: z.string("Please enter a valid supervisor label")
    })
  ),
  venues: z.array(
    z.object({
      id: z.string("Please enter a valid venue ID"),
      label: z.string("Please enter a valid venue label")
    })
  ),
  atp_link: z.url("Please enter a valid URL").optional(),
  wta_link: z.url("Please enter a valid URL").optional(),
  men_link: z.url("Please enter a valid URL").optional(),
  women_link: z.url("Please enter a valid URL").optional(),
  wiki_link: z.url("Please enter a valid URL").optional(),
  category: z.string("Please enter a valid category").optional(),
  atp_category: z.string("Please enter a valid category").optional(),
  wta_category: z.string("Please enter a valid category").optional(),
  men_category: z.string("Please enter a valid category").optional(),
  women_category: z.string("Please enter a valid category").optional(),
  sponsor_name: z.string("Please enter a valid sponsor name").optional(),
  atp_sponsor_name: z.string("Please enter a valid sponsor name").optional(),
  wta_sponsor_name: z.string("Please enter a valid sponsor name").optional(),
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
  draw_link: z.url("Please enter a valid URL").optional(),
  atp_draw_s_link: z.url("Please enter a valid URL").optional(),
  atp_draw_d_link: z.url("Please enter a valid URL").optional(),
  atp_draw_qs_link: z.url("Please enter a valid URL").optional(),
  atp_draw_qd_link: z.url("Please enter a valid URL").optional(),
  wta_draw_s_link: z.url("Please enter a valid URL").optional(),
  wta_draw_d_link: z.url("Please enter a valid URL").optional(),
  wta_draw_qs_link: z.url("Please enter a valid URL").optional(),
  wta_draw_qd_link: z.url("Please enter a valid URL").optional(),
  men_draw_s_link: z.url("Please enter a valid URL").optional(),
  men_draw_d_link: z.url("Please enter a valid URL").optional(),
  men_draw_qs_link: z.url("Please enter a valid URL").optional(),
  men_draw_qd_link: z.url("Please enter a valid URL").optional(),
  women_draw_s_link: z.url("Please enter a valid URL").optional(),
  women_draw_d_link: z.url("Please enter a valid URL").optional(),
  women_draw_qs_link: z.url("Please enter a valid URL").optional(),
  women_draw_qd_link: z.url("Please enter a valid URL").optional(),
  currency: z.string("Please enter a valid currency").optional(),
  atp_currency: z.string("Please enter a valid currency").optional(),
  wta_currency: z.string("Please enter a valid currency").optional(),
  men_currency: z.string("Please enter a valid currency").optional(),
  women_currency: z.string("Please enter a valid currency").optional(),
  pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  atp_pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  wta_pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  men_pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  women_pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  tfc: z
    .number("Please enter a valid total financial commitment amount")
    .int("Total financial commitment must be a number")
    .positive("Total financial commitment must be a positive number")
    .optional(),
  atp_tfc: z
    .number("Please enter a valid total financial commitment amount")
    .int("Total financial commitment must be a number")
    .positive("Total financial commitment must be a positive number")
    .optional(),
  wta_tfc: z
    .number("Please enter a valid total financial commitment amount")
    .int("Total financial commitment must be a number")
    .positive("Total financial commitment must be a positive number")
    .optional(),
  start_date: z.unknown().optional(),
  end_date: z.unknown().optional(),
  atp_start_date: z.unknown().optional(),
  wta_start_date: z.unknown().optional(),
  men_start_date: z.unknown().optional(),
  women_start_date: z.unknown().optional(),
  atp_end_date: z.unknown().optional(),
  wta_end_date: z.unknown().optional(),
  men_end_date: z.unknown().optional(),
  women_end_date: z.unknown().optional()
})

export type EventSchema = z.infer<typeof eventSchema>

export const personSchema = z.object({
  type: z.literal(["Umpire", "Supervisor", "Coach"], "Please select a valid person type"),
  first_name: z.string("Please enter a first name"),
  last_name: z.string("Please enter a last name")
})

export type PersonSchema = z.infer<typeof personSchema>

export const tournamentSchema = z.object({
  id: z.number("Please enter a tournament ID").int("Tournament ID must be a number").positive("Tournament ID must be a positive number"),
  name: z.string("Please enter a name"),
  established: z.number("Please enter a valid year").int("Please enter a valid year").optional(),
  abolished: z.number("Please enter a valid year").int("Please enter a valid year").optional(),
  website: z.url("Please enter a valid URL").optional(),
  tours: z.array(z.literal(Object.keys(TourEnum), "Please select a valid tour"))
})

export type TournamentSchema = z.infer<typeof tournamentSchema>

export const venueSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  city: z.string("Please enter a city"),
  country: z.object({
    id: z.string(),
    name: z.string(),
    alpha2: z.string().length(2).optional()
  })
})

export type VenueSchema = z.infer<typeof venueSchema>
