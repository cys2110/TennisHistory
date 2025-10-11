export const ATP_TOUR_CATEGORIES: CategoryType[] = [
  "Grand Slam",
  "ATP Finals",
  "ATP Masters 1000",
  "ATP 500",
  "ATP 250",
  "Next Gen ATP Finals",
  "Laver Cup",
  "ATP Cup",
  "ATP Masters Series",
  "ATP International Series Gold",
  "ATP International Series",
  "ATP World Series",
  "ATP Super 9",
  "ATP Championship Series",
  "ATP Championship Series, Single Week",
  "World Team Cup",
  "Grand Slam Cup",
  "ILTF",
  "NTL",
  "Grand Prix"
]

export const WTA_TOUR_CATEGORIES: CategoryType[] = [
  "Grand Slam",
  "WTA Finals",
  "WTA 1000",
  "WTA 500",
  "WTA 250",
  "ATP Cup",
  "WTA Elite Trophy",
  "WTA Premier Mandatory",
  "WTA Premier Five",
  "WTA Premier",
  "WTA International Tournaments",
  "ILTF",
  "NTL"
]

export const TOUR_CATEGORIES: CategoryType[] = [...ATP_TOUR_CATEGORIES, ...WTA_TOUR_CATEGORIES]

export const ATP_CHALLENGER_CATEGORIES: CategoryType[] = [
  "ATP Challenger 175",
  "ATP Challenger 125",
  "ATP Challenger 100",
  "ATP Challenger 75",
  "ATP Challenger 50"
]

export const WTA_CHALLENGER_CATEGORIES: CategoryType[] = ["WTA 125"]

export const CHALLENGER_CATEGORIES: CategoryType[] = [...ATP_CHALLENGER_CATEGORIES, ...WTA_CHALLENGER_CATEGORIES]

export const ATP_CATEGORIES: CategoryType[] = [...ATP_TOUR_CATEGORIES, ...ATP_CHALLENGER_CATEGORIES]

export const WTA_CATEGORIES: CategoryType[] = [...WTA_TOUR_CATEGORIES, ...WTA_CHALLENGER_CATEGORIES]

export const ITF_MEN_CATEGORIES: CategoryType[] = ["Davis Cup", "Olympics", "ITF M25", "ITF"]

export const ITF_WOMEN_CATEGORIES: CategoryType[] = ["Billie Jean King Cup", "Olympics", "ITF", "ITF W75", "ITF W100", "ITF W15"]

export const ITF_CATEGORIES: CategoryType[] = [...ITF_MEN_CATEGORIES, ...ITF_WOMEN_CATEGORIES]

export const MASTERS_CATEGORIES: CategoryType[] = [
  "ATP Masters 1000",
  "ATP Masters Series",
  "ATP Championship Series",
  "ATP Championship Series, Single Week",
  "WTA 1000",
  "WTA Premier Mandatory"
]

export const MATCH_STATS = [
  {
    label: "Aces",
    category: "Service Stats",
    key: "aces",
    low: false,
    percent: false
  },
  {
    label: "Double faults",
    category: "Service Stats",
    key: "dfs",
    low: true,
    percent: false
  },
  {
    label: "First serve",
    category: "Service Stats",
    numerators: ["serve1"],
    denominators: ["serve1", "serve2"],
    low: false,
    percent: true
  },
  {
    label: "1st serve points won",
    category: "Service Stats",
    numerators: ["serve1_w"],
    denominators: ["serve1"],
    low: false,
    percent: true
  },
  {
    label: "2nd serve points won",
    category: "Service Stats",
    numerators: ["serve2_w"],
    denominators: ["serve2"],
    low: false,
    percent: true
  },
  {
    label: "Break points saved",
    category: "Service Stats",
    numerators: ["bps_saved"],
    denominators: ["bps_faced"],
    low: false,
    percent: true
  },
  {
    label: "Service games won",
    category: "Service Stats",
    numerators: ["bps_saved", "bps_faced"],
    denominators: ["serve_games"],
    low: false,
    percent: true
  },
  {
    label: "1st serve return points won",
    category: "Return Stats",
    numerators: ["ret1_w"],
    denominators: ["ret1"],
    low: false,
    percent: true
  },
  {
    label: "2nd serve return points won",
    category: "Return Stats",
    numerators: ["ret2_w"],
    denominators: ["ret2"],
    low: false,
    percent: true
  },
  {
    label: "Break points converted",
    category: "Return Stats",
    numerators: ["bps_converted"],
    denominators: ["bp_opps"],
    low: false,
    percent: true
  },
  {
    label: "Return games won",
    category: "Return Stats",
    numerators: ["bps_converted"],
    denominators: ["return_games"],
    low: false,
    percent: true
  },
  {
    label: "Winners",
    category: "Points Stats",
    key: "winners",
    low: false,
    percent: false
  },
  {
    label: "Unforced errors",
    category: "Points Stats",
    key: "ues",
    low: true,
    percent: false
  },
  {
    label: "Net points won",
    category: "Points Stats",
    numerators: ["net_w"],
    denominators: ["net"],
    low: false,
    percent: false
  },
  {
    label: "Service points won",
    category: "Points Stats",
    numerators: ["serve1_w", "serve2_w"],
    denominators: ["serve1", "serve2"],
    low: false,
    percent: true
  },
  {
    label: "Return points won",
    category: "Points Stats",
    numerators: ["ret1_w", "ret2_w"],
    denominators: ["ret1", "ret2"],
    low: false,
    percent: true
  },
  {
    label: "Total points won",
    category: "Points Stats",
    numerators: ["serve1_w", "serve2_w", "ret1_w", "ret2_w"],
    denominators: ["serve1", "serve2", "ret1", "ret2"],
    low: false,
    percent: true
  },
  {
    label: "Max speed (km/h)",
    category: "Service Speed",
    key: "max_speed",
    low: false,
    percent: false
  },
  {
    label: "1st serve average speed (km/h)",
    category: "Service Speed",
    key: "avg1_speed",
    low: false,
    percent: false
  },
  {
    label: "2nd serve average speed (km/h)",
    category: "Service Speed",
    key: "avg2_speed",
    low: false,
    percent: false
  }
]
