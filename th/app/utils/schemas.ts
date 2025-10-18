import * as z from "zod"

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
