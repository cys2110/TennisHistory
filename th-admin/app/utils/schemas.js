import * as Joi from "joi"

export const tournamentSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    "number.integer": "Please enter a valid numeric ID",
    "any.required": "Please enter a tournament ID"
  }),
  name: Joi.string().required().messages({
    "string.empty": "Please enter a tournament name",
    "string.base": "Please enter a valid tournament name",
    "any.required": "Please enter a tournament name"
  }),
  tours: Joi.array().items(Joi.string().valid("ATP", "WTA", "Men", "Women")).min(1).required().messages({
    "array.base": "Please enter at least one tour",
    "array.includes": "Tours must be one of 'ATP', 'WTA', 'Men' or 'Women'",
    "array.min": "Please enter at least one tour",
    "any.required": "Please enter at least one tour"
  }),
  established: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  abolished: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  website: Joi.string().uri().messages({
    "string.uri": "Please enter a valid URL"
  })
})

export const eventSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    "number.integer": "Please enter a valid numeric ID",
    "any.required": "Please enter an event ID"
  }),
  tournament: Joi.alternatives().try(Joi.number().integer(), Joi.string()).messages({
    "alternatives.types": "Please enter a valid tournament"
  }),
  year: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  tours: Joi.array().items(Joi.string().valid("ATP", "WTA", "Men", "Women")).min(1).required().messages({
    "array.base": "Please enter at least one tour",
    "array.includes": "Tours must be one of 'ATP', 'WTA', 'Men' or 'Women'",
    "array.min": "Please enter at least one tour",
    "any.required": "Please enter at least one tour"
  }),
  surface: Joi.string().messages({
    "string.base": "Please enter a valid surface"
  }),
  supervisors: Joi.array().items(
    Joi.string().messages({
      "string.base": "Please enter a valid name"
    })
  ),
  venues: Joi.array().items(
    Joi.string().messages({
      "string.base": "Please enter a valid venue"
    })
  ),
  atp_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  wta_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  men_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  women_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  wiki_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  category: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  atp_category: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  wta_category: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  men_category: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  women_category: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  sponsor_name: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  atp_sponsor_name: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  wta_sponsor_name: Joi.string().messages({
    "string.base": "Please enter a valid category"
  }),
  draw_type: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  atp_draw_s: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  atp_draw_d: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  atp_draw_qs: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  atp_draw_qd: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  wta_draw_s: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  wta_draw_d: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  wta_draw_qs: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  wta_draw_qd: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  men_draw_s: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  men_draw_d: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  men_draw_qs: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  men_draw_qd: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  women_draw_s: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  women_draw_d: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  women_draw_qs: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  women_draw_qd: Joi.string().messages({
    "string.base": "Please enter a valid draw type"
  }),
  draw_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  atp_draw_s_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  atp_draw_d_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  atp_draw_qs_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  atp_draw_qd_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  wta_draw_s_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  wta_draw_d_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  wta_draw_qs_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  wta_draw_qd_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  men_draw_s_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  men_draw_d_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  men_draw_qs_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  men_draw_qd_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  women_draw_s_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  women_draw_d_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  women_draw_qs_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  women_draw_qd_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid link"
  }),
  currency: Joi.string().valid("USD", "AUD", "GBP", "EUR", "FRF").messages({
    "any.only": "Please enter a valid currency",
    "string.base": "Please enter a valid currency"
  }),
  atp_currency: Joi.string().valid("USD", "AUD", "GBP", "EUR", "FRF").messages({
    "any.only": "Please enter a valid currency",
    "string.base": "Please enter a valid currency"
  }),
  wta_currency: Joi.string().valid("USD", "AUD", "GBP", "EUR", "FRF").messages({
    "any.only": "Please enter a valid currency",
    "string.base": "Please enter a valid currency"
  }),
  men_currency: Joi.string().valid("USD", "AUD", "GBP", "EUR", "FRF").messages({
    "any.only": "Please enter a valid currency",
    "string.base": "Please enter a valid currency"
  }),
  women_currency: Joi.string().valid("USD", "AUD", "GBP", "EUR", "FRF").messages({
    "any.only": "Please enter a valid currency",
    "string.base": "Please enter a valid currency"
  }),
  pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  atp_pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  wta_pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  men_pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  women_pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  tfc: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  atp_tfc: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  wta_tfc: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  start_date: Joi.any(),
  end_date: Joi.any(),
  atp_start_date: Joi.any(),
  atp_end_date: Joi.any(),
  wta_start_date: Joi.any(),
  wta_end_date: Joi.any(),
  men_start_date: Joi.any(),
  men_end_date: Joi.any(),
  women_start_date: Joi.any(),
  women_end_date: Joi.any()
})

export const roundSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a round ID",
    "string.base": "Please enter a valid round ID",
    "any.required": "Please enter a round ID"
  }),
  tour: Joi.string().valid("ATP", "WTA").required().messages({
    "any.only": "Please enter a valid tour",
    "string.base": "Please enter a valid tour",
    "any.required": "Please enter a tour"
  }),
  draw: Joi.string().valid("Main", "Qualifying").required().messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw",
    "any.required": "Please enter a draw"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  round: Joi.string().messages({
    "string.base": "Please enter a valid round"
  }),
  number: Joi.number().integer().messages({
    "number.integer": "Please enter a valid number"
  }),
  points: Joi.number().integer().messages({
    "number.integer": "Please enter a valid number"
  }),
  pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  eid: Joi.string().messages({
    "string.base": "Please enter a valid id"
  })
})

export const withdrawalSchema = z.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a round ID",
    "string.base": "Please enter a valid round ID",
    "any.required": "Please enter a round ID"
  }),
  draw: Joi.string().valid("Main", "Qualifying").required().messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw",
    "any.required": "Please enter a draw"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  seed: Joi.number().integer().messages({
    "number.integer": "Please enter a valid seed number"
  }),
  rank: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  status: Joi.string().valid("Q", "LL", "AL", "PR", "SE", "WC").messages({
    "any.only": "Please enter a valid status",
    "string.base": "Please enter a valid status"
  }),
  reason: Joi.string().messages({
    "string.base": "Please enter a valid reason"
  }),
  team_reason: Joi.string().messages({
    "string.base": "Please enter a valid reason"
  }),
  team_mate: Joi.string().messages({
    "string.base": "Please enter a valid id"
  }),
  eid: Joi.string().messages({
    "string.base": "Please enter a valid id"
  })
})

export const entrySchema = z.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a ID",
    "string.base": "Please enter a valid ID",
    "any.required": "Please enter a ID"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  rank: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  points: Joi.number().integer().messages({
    "number.integer": "Please enter a valid number"
  }),
  pm: Joi.number().messages({
    "number.base": "Please enter a valid number"
  }),
  seed: Joi.number().integer().messages({
    "number.integer": "Please enter a valid seed number"
  }),
  status: Joi.string().valid("Q", "LL", "AL", "PR", "SE", "WC").messages({
    "any.only": "Please enter a valid status",
    "string.base": "Please enter a valid status"
  }),
  q_seed: Joi.number().integer().messages({
    "number.integer": "Please enter a valid seed number"
  }),
  q_status: Joi.string().valid("Q", "LL", "AL", "PR", "SE", "WC").messages({
    "any.only": "Please enter a valid status",
    "string.base": "Please enter a valid status"
  }),
  eid: Joi.string().required().messages({
    "string.base": "Please enter a valid id"
  })
})

export const ldaSchema = z.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a round ID",
    "string.base": "Please enter a valid round ID",
    "any.required": "Please enter a round ID"
  }),
  draw: Joi.string().valid("Main", "Qualifying").required().messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw",
    "any.required": "Please enter a draw"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  rank: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  eid: Joi.string().messages({
    "string.base": "Please enter a valid id"
  })
})

export const retirementSchema = z.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a round ID",
    "string.base": "Please enter a valid round ID",
    "any.required": "Please enter a round ID"
  }),
  draw: Joi.string().valid("Main", "Qualifying").required().messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw",
    "any.required": "Please enter a draw"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  reason: Joi.string().messages({
    "string.base": "Please enter a valid reason"
  }),
  team_reason: Joi.string().messages({
    "string.base": "Please enter a valid reason"
  }),
  eid: Joi.string().messages({
    "string.base": "Please enter a valid id"
  })
})

export const seedSchema = z.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a ID",
    "string.base": "Please enter a valid ID",
    "any.required": "Please enter a ID"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  seed: Joi.number().integer().messages({
    "number.integer": "Please enter a valid seed number"
  }),
  q_seed: Joi.number().integer().messages({
    "number.integer": "Please enter a valid seed number"
  }),
  rank: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  })
})

export const matchSchema = z.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a ID",
    "string.base": "Please enter a valid ID",
    "any.required": "Please enter a ID"
  }),
  tour: Joi.string().valid("ATP", "WTA", "Men", "Women").required().messages({
    "string.base": "Please enter a valid tour",
    "any.only": "Tours must be one of 'ATP', 'WTA', 'Men' or 'Women'",
    "any.required": "Please enter a tour"
  }),
  type: Joi.string().valid("Singles", "Doubles").required().messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type",
    "any.required": "Please enter a match type"
  }),
  draw: Joi.string().valid("Main", "Qualifying").required().messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw",
    "any.required": "Please enter a draw"
  }),
  match_no: Joi.number().integer().required().messages({
    "number.integer": "Please enter a valid match number",
    "any.required": "Please enter a match number"
  }),
  court: Joi.string().messages({
    "string.base": "Please enter a valid court"
  }),
  date: Joi.any(),
  incomplete: Joi.string().valid("B", "WO").messages({
    "any.only": "Please enter a valid status"
  }),
  duration: Joi.string().messages({
    "string.base": "Please enter duration in format HH:MM:SS"
  }),
  umpire: Joi.string().messages({
    "string.base": "Please enter a valid umpire name"
  }),
  round: Joi.string().required().messages({
    "string.empty": "Please enter a round",
    "string.base": "Please enter a valid round",
    "any.required": "Please enter a round"
  }),
  best_of: Joi.string().valid("Best3", "Best5").messages({
    "any.only": "Please enter a valid type of match",
    "string.base": "Please enter a valid type of match"
  }),
  sets: Joi.string().valid("Best3", "Best5").messages({
    "any.only": "Please enter a valid type of match",
    "string.base": "Please enter a valid type of match"
  }),
  player_1: Joi.string().messages({
    "string.base": "Please enter a valid player ID"
  }),
  player_2: Joi.string().messages({
    "string.base": "Please enter a valid player ID"
  }),
  player_3: Joi.string().messages({
    "string.base": "Please enter a valid player ID"
  }),
  player_4: Joi.string().messages({
    "string.base": "Please enter a valid player ID"
  }),
  s1: Joi.array().items(
    Joi.number().integer().min(0).messages({
      "number.integer": "Please enter a valid score",
      "number.min": "Score cannot be negative"
    })
  ),
  s2: Joi.array().items(
    Joi.number().integer().min(0).messages({
      "number.integer": "Please enter a valid score",
      "number.min": "Score cannot be negative"
    })
  ),
  s3: Joi.array().items(
    Joi.number().integer().min(0).messages({
      "number.integer": "Please enter a valid score",
      "number.min": "Score cannot be negative"
    })
  ),
  s4: Joi.array().items(
    Joi.number().integer().min(0).messages({
      "number.integer": "Please enter a valid score",
      "number.min": "Score cannot be negative"
    })
  ),
  s5: Joi.array().items(
    Joi.number().integer().min(0).messages({
      "number.integer": "Please enter a valid score",
      "number.min": "Score cannot be negative"
    })
  ),
  t1: Joi.number().integer().min(0).messages({
    "number.integer": "Please enter a valid number of tiebreak points",
    "number.min": "Number of tiebreak points cannot be negative"
  }),
  t2: Joi.number().integer().min(0).messages({
    "number.integer": "Please enter a valid number of tiebreak points",
    "number.min": "Number of tiebreak points cannot be negative"
  }),
  t3: Joi.number().integer().min(0).messages({
    "number.integer": "Please enter a valid number of tiebreak points",
    "number.min": "Number of tiebreak points cannot be negative"
  }),
  t4: Joi.number().integer().min(0).messages({
    "number.integer": "Please enter a valid number of tiebreak points",
    "number.min": "Number of tiebreak points cannot be negative"
  }),
  t5: Joi.number().integer().min(0).messages({
    "number.integer": "Please enter a valid number of tiebreak points",
    "number.min": "Number of tiebreak points cannot be negative"
  }),
  winner: Joi.string().messages({
    "string.base": "Please enter a valid winner"
  })
})

export const playerSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "Please enter a player ID",
    "string.base": "Please enter a valid player ID",
    "any.required": "Player ID is required"
  }),
  first_name: Joi.string().required().messages({
    "string.empty": "Please enter a first name",
    "string.base": "Please enter a valid first name",
    "any.required": "First name is required"
  }),
  last_name: Joi.string().required().messages({
    "string.empty": "Please enter a last name",
    "string.base": "Please enter a valid last name",
    "any.required": "Last name is required"
  }),
  tours: Joi.string().valid("ATP", "WTA").required().messages({
    "string.base": "Please enter a valid tour",
    "any.only": "Tours must be one of 'ATP' or 'WTA'",
    "any.required": "Please enter a tour"
  }),
  country: Joi.object({
    id: Joi.string().required().messages({
      "string.empty": "Please select a country",
      "string.base": "Please enter a valid country",
      "any.required": "Country is required"
    }),
    start_date: Joi.any()
  }),
  previous_countries: Joi.array().items(
    Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Please select a country",
        "string.base": "Please enter a valid country",
        "any.required": "Country is required"
      }),
      start_date: Joi.any(),
      end_date: Joi.any()
    })
  ),
  turned_pro: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  retired: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  bh: Joi.string().valid("One", "Two").messages({
    "any.only": "Please select a valid backhand type"
  }),
  rh: Joi.boolean().messages({
    "boolean.base": "Please enter a valid value"
  }),
  coaches: Joi.array().items(
    Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Please enter a valid coach ID",
        "string.base": "Please enter a valid coach ID",
        "any.required": "Coach ID is required"
      }),
      name: Joi.string(),
      start_date: Joi.any()
    })
  ),
  former_coaches: Joi.array().items(
    Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Please enter a valid coach ID",
        "string.base": "Please enter a valid coach ID",
        "any.required": "Coach ID is required"
      }),
      name: Joi.string(),
      start_date: Joi.any(),
      end_date: Joi.any()
    })
  ),
  atp_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid URL"
  }),
  wta_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid URL"
  }),
  wiki_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid URL"
  }),
  official_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid URL"
  }),
  current_singles: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  current_doubles: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  ch_singles: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  ch_doubles: Joi.number().integer().messages({
    "number.integer": "Please enter a valid rank"
  }),
  singles_ch_date: Joi.any(),
  doubles_ch_date: Joi.any(),
  height: Joi.number().integer().messages({
    "number.integer": "Please enter a valid height in cm"
  }),
  pm: Joi.number().integer().messages({
    "number.integer": "Please enter a valid number"
  }),
  hof: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  dob: Joi.any(),
  dod: Joi.any()
})

export const personSchema = Joi.object({
  id: Joi.string().messages({
    "string.base": "Please enter a valid ID"
  }),
  first_name: Joi.string().required().messages({
    "string.empty": "Please enter a first name",
    "string.base": "Please enter a valid first name",
    "any.required": "Please enter a first name"
  }),
  last_name: Joi.string().required().messages({
    "string.empty": "Please enter a last name",
    "string.base": "Please enter a valid last name",
    "any.required": "Please enter a last name"
  })
})

export const scrapeEventSchema = z.object({
  tid: Joi.number().integer().required().messages({
    "number.integer": "Please enter a valid numeric ID",
    "any.required": "Please enter a tournament ID"
  }),
  tid2: Joi.number().integer().messages({
    "number.integer": "Please enter a valid numeric ID"
  }),
  year: Joi.number().integer().required().messages({
    "number.integer": "Please enter a valid year",
    "any.required": "Please enter a year"
  }),
  year2: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  draw_size: Joi.number().integer().messages({
    "number.integer": "Please enter a valid draw size"
  }),
  type: Joi.string().valid("Singles", "Doubles").messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type"
  }),
  draw: Joi.string().valid("Main", "Qualifying").messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw"
  }),
  sets: Joi.string().valid("Best3", "Best5").messages({
    "any.only": "Please enter a valid type of match",
    "string.base": "Please enter a valid type of match"
  })
})

export const scrapeStatsSchema = z.object({
  eid: Joi.string().required().messages({
    "string.base": "Please enter a valid id",
    "any.required": "Please enter an event id"
  }),
  year: Joi.number().integer().messages({
    "number.integer": "Please enter a valid year"
  }),
  wid: Joi.number().integer().messages({
    "number.integer": "Please enter a valid WTA ID"
  }),
  type: Joi.string().valid("Singles", "Doubles").messages({
    "any.only": "Please enter a valid match type",
    "string.base": "Please enter a valid match type"
  }),
  draw: Joi.string().valid("Main", "Qualifying").messages({
    "any.only": "Please enter a valid draw",
    "string.base": "Please enter a valid draw"
  }),
  links: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Please enter valid URLs"
  }),
  draw_range: Joi.array().items(Joi.number().integer()).messages({
    "array.base": "Please enter valid draw ranges"
  }),
  skip: Joi.array().items(Joi.number().integer()).messages({
    "array.base": "Please enter valid skip values"
  })
})
