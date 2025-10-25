import * as z from "zod"

export const editionSchema = z.object({
  id: z.number("Please enter an edition ID").int("Edition ID must be a number").positive("Edition ID must be a positive number"),
  tournament: z.object({
    value: z.number("Please enter a tournament ID").int("Tournament ID must be a number").positive("Tournament ID must be a positive number"),
    label: z.string("Please enter a tournament name")
  }),
  tours: z.array(z.literal(Object.keys(TourEnum), "Please select a valid tour")),
  year: z.number("Please enter a valid year").int("Please enter a valid year").positive("Please enter a valid year"),
  start_date: z.unknown().optional(),
  end_date: z.unknown().optional(),
  surface: z.string().optional(),
  venues: z
    .array(
      z.object({
        value: z.string("Please enter a valid venue ID"),
        label: z.string("Please enter a valid venue label")
      })
    )
    .optional(),
  currency: z.literal(Object.keys(CurrencyEnum), "Please select a valid currency").optional(),
  tfc: z.number("Please enter a valid total financial commitment").positive("Total financial commitment must be a positive number").optional(),
  wiki_link: z.url("Please enter a valid URL").optional(),
  draw_type: z.string().optional(),
  draw_link: z.url("Please enter a valid URL").optional(),
  sponsor_name: z.string("Please enter a valid sponsor name").optional(),
  category: z.string("Please enter a valid category").optional()
})

export type EditionSchema = z.infer<typeof editionSchema>

export const entrySchema = z.object({
  id: z.string().optional(),
  event: z.string().optional(),
  type: z.literal(["Singles", "Doubles"], "Please select a valid match type"),
  seed: z.number("Please enter a valid seed number").int("Seed number must be a number").positive("Seed number must be a positive number").optional(),
  status: z.string("Please enter a valid status").optional(),
  rank: z.number("Please enter a valid rank").int("Rank must be a number").positive("Rank must be a positive number").optional(),
  q_seed: z
    .number("Please enter a valid qualifying seed number")
    .int("Qualifying seed number must be a number")
    .positive("Qualifying seed number must be a positive number")
    .optional(),
  q_status: z.string("Please enter a valid qualifying status").optional(),
  player1: z
    .object({
      value: z.string("Please enter a valid player ID"),
      label: z.string("Please enter a valid player name")
    })
    .optional(),
  player2: z
    .object({
      value: z.string("Please enter a valid player ID"),
      label: z.string("Please enter a valid player name")
    })
    .optional(),
  rank2: z.number("Please enter a valid rank").int("Rank must be a number").positive("Rank must be a positive number").optional()
})

export type EntrySchema = z.infer<typeof entrySchema>

export const entryInfoSchema = z.object({
  event: z.string("Please enter a valid event ID").optional(),
  relationship: z.string(),
  draw: z.literal(["Main", "Qualifying"], "Please select a valid draw type"),
  type: z.literal(["Singles", "Doubles"], "Please select a valid match type"),
  rank: z.number("Please enter a valid rank").int("Rank must be a number").positive("Rank must be a positive number").optional(),
  reason: z.string().optional(),
  teammate: z.string().optional(),
  entry: z
    .object({
      value: z.string(),
      label: z.string()
    })
    .optional(),
  players: z
    .array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    )
    .optional()
})

export type EntryInfoSchema = z.infer<typeof entryInfoSchema>

export const eventSchema = z.object({
  id: z.string("Please enter an event ID"),
  edition: z.number("Please enter a valid edition ID").int("Edition ID must be a number").positive("Edition ID must be a positive number"),
  tour: z.literal(Object.keys(TourEnum), "Please select a valid tour"),
  level: z.literal(["Tour", "Challenger", "ITF"], "Please select a valid level"),
  surface: z.string().optional(),
  category: z.string().optional(),
  sponsor_name: z.string().optional(),
  venues: z.array(
    z.object({
      value: z.string("Please enter a valid venue ID"),
      label: z.string("Please enter a valid venue label")
    })
  ),
  supervisors: z
    .array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    )
    .optional(),
  currency: z.literal(Object.keys(CurrencyEnum), "Please select a valid currency").optional(),
  pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  tfc: z
    .number("Please enter a valid total financial commitment amount")
    .int("Total financial commitment must be a number")
    .positive("Total financial commitment must be a positive number")
    .optional(),
  start_date: z.unknown().optional(),
  end_date: z.unknown().optional(),
  s_draw: z.string().optional(),
  s_link: z.url("Please enter a valid URL").optional(),
  d_draw: z.string().optional(),
  d_link: z.url("Please enter a valid URL").optional(),
  qs_draw: z.string().optional(),
  qs_link: z.url("Please enter a valid URL").optional(),
  qd_draw: z.string().optional(),
  qd_link: z.url("Please enter a valid URL").optional(),
  site_link: z.url("Please enter a valid URL").optional()
})

export type EventSchema = z.infer<typeof eventSchema>

export const matchSchema = z.object({
  id: z.string("Please enter a match ID").optional(),
  event: z.string("Please enter a valid event ID"),
  tour: z.literal(Object.keys(TourEnum), "Please select a valid tour"),
  type: z.literal(["Singles", "Doubles"], "Please select a valid match type"),
  draw: z.literal(["Main", "Qualifying"], "Please select a valid draw type"),
  round: z.string("Please enter a round name"),
  match_no: z
    .number("Please enter a valid match number")
    .int("Match number must be a number")
    .positive("Match number must be a positive number")
    .optional(),
  court: z.string("Please enter a court name").optional(),
  date: z.unknown().optional(),
  duration: z.string().optional(),
  umpire: z
    .object({
      value: z.string("Please enter a valid umpire ID"),
      label: z.string("Please enter a valid umpire name")
    })
    .optional(),
  sets: z.literal(["BestOf3", "BestOf5"], "Please select a valid sets type").optional(),
  incomplete: z.string().optional(),
  team1: z
    .object({
      value: z.string("Please enter a valid team1 ID"),
      label: z.string("Please enter a valid team1 name")
    })
    .optional(),
  team2: z
    .object({
      value: z.string("Please enter a valid team2 ID"),
      label: z.string("Please enter a valid team2 name")
    })
    .optional(),
  s1: z.array(z.number().nullable()).optional(),
  s2: z.array(z.number().nullable()).optional(),
  s3: z.array(z.number().nullable()).optional(),
  s4: z.array(z.number().nullable()).optional(),
  s5: z.array(z.number().nullable()).optional(),
  t1: z.number().optional(),
  t2: z.number().optional(),
  t3: z.number().optional(),
  t4: z.number().optional(),
  t5: z.number().optional(),
  winner: z.literal(["Team1", "Team2"], "Please select a valid winner").optional()
})

export type MatchSchema = z.infer<typeof matchSchema>

export const personSchema = z.object({
  type: z.literal(["Umpire", "Supervisor", "Coach"], "Please select a valid person type"),
  id: z.string().optional(),
  first_name: z.string("Please enter a first name"),
  last_name: z.string("Please enter a last name")
})

export type PersonSchema = z.infer<typeof personSchema>

export const roundSchema = z.object({
  id: z.string().optional(),
  edition: z.number("Please enter a valid edition ID").int("Edition ID must be a number").positive("Edition ID must be a positive number").optional(),
  tour: z.literal(Object.keys(TourEnum), "Please select a valid tour").optional(),
  draw: z.literal(["Main", "Qualifying"], "Please select a valid draw type"),
  type: z.literal(["Singles", "Doubles"], "Please select a valid match type"),
  round: z.string("Please enter a round name"),
  number: z.number("Please enter a valid round number").int("Round number must be a number").positive("Round number must be a positive number"),
  pm: z
    .number("Please enter a valid prize money amount")
    .int("Prize money must be a number")
    .positive("Prize money must be a positive number")
    .optional(),
  points: z.number("Please enter a valid points amount").int("Points must be a number").positive("Points must be a positive number").optional()
})

export type RoundSchema = z.infer<typeof roundSchema>

export const scrapeSchema = z.object({
  year: z.number("Please enter a valid year").int("Please enter a valid year").positive("Please enter a valid year").optional(),
  type: z.literal(["Singles", "Doubles"], "Please select a valid match type"),
  draw: z.literal(["Main", "Qualifying"], "Please select a valid draw type").optional(),
  tid: z
    .number("Please enter a valid tournament ID")
    .int("Tournament ID must be a number")
    .positive("Tournament ID must be a positive number")
    .optional(),
  tid2: z.number("Please enter a valid site ID").int("Site ID must be a number").positive("Site ID must be a positive number").optional(),
  year2: z.number("Please enter a valid site year").int("Site year must be a number").positive("Site year must be a positive number").optional(),
  draw_size: z.number("Please enter a valid draw size").int("Draw size must be a number").positive("Draw size must be a positive number").optional(),
  sets: z.string().optional(),
  eid: z.string().optional(),
  wid: z.number().optional(),
  draw_range: z.array(z.string()).optional(),
  skip: z.array(z.string()).optional()
})

export type ScrapeSchema = z.infer<typeof scrapeSchema>

export const seedSchema = z.object({
  id: z.string().optional(),
  event: z.string("Please enter a valid event ID"),
  draw: z.literal(["Main", "Qualifying"], "Please select a valid draw type"),
  type: z.literal(["Singles", "Doubles"], "Please select a valid match type"),
  seed: z.number("Please enter a valid seed number").int("Seed number must be a number").positive("Seed number must be a positive number").optional(),
  rank: z.number("Please enter a valid rank").int("Rank must be a number").positive("Rank must be a positive number").optional(),
  team: z.object({
    value: z.string(),
    label: z.string()
  })
})

export type SeedSchema = z.infer<typeof seedSchema>

export const tournamentSchema = z.object({
  id: z.number("Please enter a tournament ID").int("Tournament ID must be a number").positive("Tournament ID must be a positive number"),
  name: z.string("Please enter a tournament name"),
  tours: z.array(z.literal(Object.keys(TourEnum), "Please select a valid tour")),
  established: z.number("Please enter a valid year").int("Please enter a valid year").positive("Please enter a valid year").optional(),
  abolished: z.number("Please enter a valid year").int("Please enter a valid year").positive("Please enter a valid year").optional(),
  website: z.url("Please enter a valid URL").optional()
})

export type TournamentSchema = z.infer<typeof tournamentSchema>

export const venueSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  city: z.string("Please enter a city"),
  country: z.object({
    value: z.string(),
    label: z.string()
  })
})

export type VenueSchema = z.infer<typeof venueSchema>
