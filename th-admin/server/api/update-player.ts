import { int, Date as NeoDate } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    first_name?: string
    last_name?: string
    tours?: string | string[]
    country?: string
    previous_countries?: string | string[]
    turned_pro?: string
    retired?: string
    coaches?: string | string[]
    former_coaches?: string | string[]
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

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (p:Player {id: $id})
      MATCH (c:Country {id: $country})
      SET p.first_name = $first_name, p.last_name = $last_name, p.atp_link = $atp_link, p.wta_link = $wta_link, p.wiki_link = $wiki_link, p.official_link = $official_link, p.bh = $bh, p.rh = $rh, p.height = $height, p.hof = $hof, p.dob = $dob, p.dod = $dod, p.updated_at = date()
      MERGE (p)-[:REPRESENTS]->(c)
      CALL (p) {
        WITH [x IN $tours WHERE NOT x IN labels(p)] AS add, [x IN labels(p) WHERE NOT x IN $tours AND NOT x IN ['Player', 'Coach']] AS remove
        // UNWIND $tours AS tour
        // WITH tour, p WHERE NOT tour IN labels(p)
        SET p:$(add) REMOVE p:$(remove)
      }
      CALL (p) {
        UNWIND labels(p) AS label
        WITH label, p WHERE NOT label IN $tours AND NOT label IN ['Player', 'Coach']
        REMOVE p:$(label)
      }
      CALL (p) {
        WHEN $previous_countries IS NOT NULL THEN {
          UNWIND $previous_countries AS country
          MATCH (c1:Country {id: country})
          MERGE (p)-[:REPRESENTED]->(c1)
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
          WITH x, r
          WHERE NOT x.id IN $coaches
          DELETE r
          WITH p
          UNWIND $coaches AS coach
          MATCH (c:Coach {id: coach})
          MERGE (c)-[:COACHES]->(p)
        }
      }
      CALL (p) {
        WHEN $former_coaches IS NOT NULL THEN {
          UNWIND $former_coaches AS coach
          MATCH (c:Coach {id: coach})
          MERGE (c)-[:COACHED]->(p)
        }
      }
    `,
    {
      id,
      tours: tours ? (Array.isArray(tours) ? tours : [tours]) : null,
      first_name: first_name || null,
      previous_countries: previous_countries ? (Array.isArray(previous_countries) ? previous_countries : [previous_countries]) : null,
      coaches: coaches ? (Array.isArray(coaches) ? coaches : [coaches]) : null,
      former_coaches: former_coaches ? (Array.isArray(former_coaches) ? former_coaches : [former_coaches]) : null,
      atp_link: atp_link || null,
      wta_link: wta_link || null,
      official_link: official_link || null,
      last_name: last_name || null,
      wiki_link: wiki_link || null,
      country: country || null,
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
