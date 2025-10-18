import * as z from "zod"

export const tournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  established: z.number().optional(),
  abolished: z.number().optional(),
  website: z.url().optional(),
  tours: z.array(z.literal(Object.keys(TourEnum)))
})

export type TournamentSchema = z.infer<typeof tournamentSchema>
