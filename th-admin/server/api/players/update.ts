import { int, Date as NeoDate } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    first_name?: string
    last_name?: string
    tours?: string | string[]
    country?: {
      id: string
      start_date?: any
    }
    previous_countries?: {
      id: string
      start_date?: any
      end_date?: any
    }[]
    turned_pro?: string
    retired?: string
    coaches?: {
      id: string
      start_date?: any
    }[]
    former_coaches?: {
      id: string
      start_date?: any
      end_date?: any
    }[]
    atp_link?: string
    wta_link?: string
    wiki_link?: string
    official_link?: string
    bh?: string
    rh?: string
    dob?: string
    dod?: string
    height?: string
    hof?: string
  }

  const {
    id,
    first_name,
    last_name,
    tours,
    country,
    previous_countries,
    turned_pro,
    retired,
    coaches,
    former_coaches,
    atp_link,
    wta_link,
    wiki_link,
    official_link,
    bh,
    rh,
    dob,
    dod,
    height,
    hof
  } = getQuery<QueryProps>(event)

  const dobDate = dob ? JSON.parse(dob) : null
  const dodDate = dod ? JSON.parse(dod) : null

  const convertDate = (date: any) => {
    if (!date) return null
    let obj = date
    if (typeof date === "string") {
      try {
        obj = JSON.parse(date)
      } catch (e) {
        return null
      }
    }
    if (obj && typeof obj === "object" && "year" in obj) {
      return new Date(obj.year, obj.month - 1, obj.day)
    }
    return null
  }

  const normaliseCoach = (item: any) => {
    const coach = typeof item === "string" ? JSON.parse(item) : item
    const start_date = convertDate(coach.start_date)
    const end_date = convertDate(coach.end_date)
    return {
      ...coach,
      start_date: start_date ? NeoDate.fromStandardDate(start_date) : null,
      end_date: end_date ? NeoDate.fromStandardDate(end_date) : null
    }
  }

  const normaliseCountry = (item: any) => {
    const country = typeof item === "string" ? JSON.parse(item) : item
    const start_date = convertDate(country.start_date)
    const end_date = convertDate(country.end_date)
    return {
      ...country,
      start_date: start_date ? NeoDate.fromStandardDate(start_date) : null,
      end_date: end_date ? NeoDate.fromStandardDate(end_date) : null
    }
  }

  const coachesArray = coaches ? (Array.isArray(coaches) ? coaches : [coaches]) : []
  const formerCoachesArray = former_coaches ? (Array.isArray(former_coaches) ? former_coaches : [former_coaches]) : []

  const formerCountriesArray = previous_countries ? (Array.isArray(previous_countries) ? previous_countries : [previous_countries]) : []
  const normalisedPreviousCountries = formerCountriesArray.map(normaliseCountry)
  const normalisedCountry = country ? normaliseCountry(country) : null

  const normalisedCoaches = coachesArray.filter(c => c.id).map(normaliseCoach)
  const normalisedFormerCoaches = formerCoachesArray.filter(c => c.id).map(normaliseCoach)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (p:Player {id: $id})
      SET p.first_name = $first_name, p.last_name = $last_name, p.atp_link = $atp_link, p.wta_link = $wta_link, p.wiki_link = $wiki_link, p.official_link = $official_link, p.bh = $bh, p.rh = toBoolean($rh), p.height = $height, p.hof = $hof, p.dob = $dob, p.dod = $dod, p.updated_at = date()
      CALL (p) {
        WITH [x IN $tours WHERE NOT x IN labels(p)] AS add, [x IN labels(p) WHERE NOT x IN $tours AND NOT x IN ['Player', 'Coach']] AS remove
        SET p:$(add) REMOVE p:$(remove)
      }
      CALL (p) {
        MATCH (p)-[v:REPRESENTS]->(c:Country)
        CALL (*) {
          WHEN NOT c.id = $country.id THEN {
            MATCH (c1:Country {id: $country.id})
            MERGE (p)-[v1:REPRESENTS]->(c1)
            SET v1.start_date = $country.start_date
            DELETE v
          }
          ELSE {
            SET v.start_date = $country.start_date
          }
        }
      }
      CALL (p) {
        WHEN $previous_countries IS NOT NULL THEN {
          OPTIONAL MATCH (p)-[v:REPRESENTED]->(c:Country)
          CALL (c, v) {
            WITH c, v WHERE NOT c.id IN [k IN $previous_countries | k.id]
            DELETE v
          }
          UNWIND $previous_countries AS k
          MATCH (c1:Country {id: k.id})
          MERGE (p)-[v1:REPRESENTED]->(c1)
          SET v1.start_date = k.start_date, v1.end_date = k.end_date
        }
      }
      CALL (p) {
        WHEN $turned_pro IS NOT NULL THEN {
          MATCH (y:Year {id: $turned_pro})
          MERGE (p)-[:TURNED_PRO]->(y)
        }
      }
      CALL (p) {
        WHEN $retired IS NOT NULL THEN {
          MATCH (y:Year {id: $retired})
          MERGE (p)-[:RETIRED]->(y)
        }
      }
      CALL (p) {
        WHEN $coaches IS NOT NULL THEN {
          OPTIONAL MATCH (x:Coach)-[r:COACHES]->(p)
          CALL (x, r) {
            WITH x, r WHERE NOT x.id IN [k IN $coaches | k.id]
            DELETE r
          }
          UNWIND $coaches AS k
          MATCH (x1:Coach {id: k.id})
          MERGE (x1)-[q:COACHES]->(p)
          SET q.start_date = k.start_date
        }
      }
      CALL (p) {
        WHEN $former_coaches IS NOT NULL THEN {
          OPTIONAL MATCH (x:Coach)-[r:COACHED]->(p)
          CALL (x, r) {
            WITH x, r WHERE NOT x.id IN [k IN $former_coaches | k.id]
            DELETE r
          }
          UNWIND $coaches AS k
          MATCH (x1:Coach {id: k.id})
          MERGE (x1)-[q:COACHED]->(p)
          SET q.start_date = k.start_date, q.end_date = k.end_date
        }
      }
    `,
    {
      id,
      tours: tours ? (Array.isArray(tours) ? tours : [tours]) : null,
      first_name: first_name || null,
      previous_countries: normalisedPreviousCountries,
      coaches: normalisedCoaches,
      former_coaches: normalisedFormerCoaches,
      atp_link: atp_link || null,
      wta_link: wta_link || null,
      official_link: official_link || null,
      last_name: last_name || null,
      wiki_link: wiki_link || null,
      country: normalisedCountry,
      turned_pro: turned_pro ? int(turned_pro) : null,
      retired: retired ? int(retired) : null,
      bh: bh || null,
      rh: rh || null,
      dob: dob ? NeoDate.fromStandardDate(new Date(dobDate.year, dobDate.month - 1, dobDate.day)) : null,
      dod: dod ? NeoDate.fromStandardDate(new Date(dodDate.year, dodDate.month - 1, dodDate.day)) : null,
      height: height ? int(height) : null,
      hof: hof ? int(hof) : null
    }
  )

  return summary
})
