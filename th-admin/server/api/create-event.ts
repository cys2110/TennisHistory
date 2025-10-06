import { int, Date as NeoDate } from "neo4j-driver"

export default defineEventHandler(async event => {
  const {
    id,
    tournament,
    tours,
    surface,
    supervisors,
    venues,
    atp_link,
    wta_link,
    men_link,
    women_link,
    wiki_link,
    category,
    atp_category,
    wta_category,
    men_category,
    women_category,
    sponsor_name,
    atp_sponsor_name,
    wta_sponsor_name,
    draw_type,
    atp_draw_s,
    atp_draw_d,
    atp_draw_qs,
    atp_draw_qd,
    wta_draw_s,
    wta_draw_d,
    wta_draw_qs,
    wta_draw_qd,
    men_draw_s,
    men_draw_d,
    men_draw_qs,
    men_draw_qd,
    women_draw_s,
    women_draw_d,
    women_draw_qs,
    women_draw_qd,
    draw_link,
    atp_draw_s_link,
    atp_draw_d_link,
    atp_draw_qs_link,
    atp_draw_qd_link,
    wta_draw_s_link,
    wta_draw_d_link,
    wta_draw_qs_link,
    wta_draw_qd_link,
    men_draw_s_link,
    men_draw_d_link,
    men_draw_qs_link,
    men_draw_qd_link,
    women_draw_s_link,
    women_draw_d_link,
    women_draw_qs_link,
    women_draw_qd_link,
    currency,
    atp_currency,
    wta_currency,
    men_currency,
    women_currency,
    pm,
    atp_pm,
    wta_pm,
    men_pm,
    women_pm,
    tfc,
    atp_tfc,
    wta_tfc,
    start_date,
    end_date,
    atp_start_date,
    atp_end_date,
    wta_start_date,
    wta_end_date,
    men_start_date,
    men_end_date,
    women_start_date,
    women_end_date,
    year
  } = getQuery(event)

  const startDate = start_date ? JSON.parse(start_date as string) : null
  const endDate = end_date ? JSON.parse(end_date as string) : null
  const atpStartDate = atp_start_date ? JSON.parse(atp_start_date as string) : null
  const atpEndDate = atp_end_date ? JSON.parse(atp_end_date as string) : null
  const wtaStartDate = wta_start_date ? JSON.parse(wta_start_date as string) : null
  const wtaEndDate = wta_end_date ? JSON.parse(wta_end_date as string) : null
  const menStartDate = men_start_date ? JSON.parse(men_start_date as string) : null
  const menEndDate = men_end_date ? JSON.parse(men_end_date as string) : null
  const womenStartDate = women_start_date ? JSON.parse(women_start_date as string) : null
  const womenEndDate = women_end_date ? JSON.parse(women_end_date as string) : null

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (t:Tournament {id: toInteger($tournament)})
      MATCH (y:Year {id: toInteger($year)})
      MERGE (e:Event {id: toInteger($id)})
      MERGE (e)-[:EDITION_OF]->(t)
      MERGE (e)-[:IN_YEAR]->(y)
      SET e.atp_link = $atp_link, e.wta_link = $wta_link, e.men_link = $men_link, e.women_link = $women_link,
      e.wiki_link = $wiki_link, e.category = $category, e.atp_category = $atp_category, e.wta_category = $wta_category,
      e.men_category = $men_category, e.women_category = $women_category, e.sponsor_name = $sponsor_name,
      e.atp_sponsor_name = $atp_sponsor_name, e.wta_sponsor_name = $wta_sponsor_name, e.draw_type = $draw_type,
      e.atp_draw_s = $atp_draw_s, e.atp_draw_d = $atp_draw_d, e.atp_draw_qs = $atp_draw_qs, e.atp_draw_qd = $atp_draw_qd,
      e.wta_draw_s = $wta_draw_s, e.wta_draw_d = $wta_draw_d, e.wta_draw_qs = $wta_draw_qs, e.wta_draw_qd = $wta_draw_qd,
      e.men_draw_s = $men_draw_s, e.men_draw_d = $men_draw_d, e.men_draw_qs = $men_draw_qs, e.men_draw_qd = $men_draw_qd,
      e.women_draw_s = $women_draw_s, e.women_draw_d = $women_draw_d, e.women_draw_qs = $women_draw_qs, e.women_draw_qd = $women_draw_qd,
      e.atp_draw_s_link = $atp_draw_s_link, e.atp_draw_d_link = $atp_draw_d_link, e.atp_draw_qs_link = $atp_draw_qs_link,
      e.atp_draw_qd_link = $atp_draw_qd_link, e.wta_draw_s_link = $wta_draw_s_link, e.wta_draw_d_link = $wta_draw_d_link,
      e.wta_draw_qs_link = $wta_draw_qs_link, e.wta_draw_qd_link = $wta_draw_qd_link, e.men_draw_s_link = $men_draw_s_link,
      e.men_draw_d_link = $men_draw_d_link, e.men_draw_qs_link = $men_draw_qs_link, e.men_draw_qd_link = $men_draw_qd_link,
      e.women_draw_s_link = $women_draw_s_link, e.women_draw_d_link = $women_draw_d_link, e.women_draw_qs_link = $women_draw_qs_link,
      e.women_draw_qd_link = $women_draw_qd_link, e.currency = $currency, e.atp_currency = $atp_currency, e.wta_currency = $wta_currency,
      e.men_currency = $men_currency, e.women_currency = $women_currency, $e.draw_link = $draw_link, e.pm = $pm, e.atp_pm = $atp_pm, e.wta_pm = $wta_pm,
      e.men_pm = $men_pm, e.women_pm = $women_pm, e.tfc = $tfc, e.atp_tfc = $atp_tfc, e.wta_tfc = $wta_tfc, e.start_date = $start_date,
      e.end_date = $end_date, e.atp_start_date = $atp_start_date, e.atp_end_date = $atp_end_date, e.wta_start_date = $wta_start_date,
      e.wta_end_date = $wta_end_date, e.men_start_date = $men_start_date, e.men_end_date = $men_end_date, e.women_start_date = $women_start_date,
      e.women_end_date = $women_end_date
      CALL (e) {
        UNWIND $tours AS tour
        SET e:$(tour)
      }
      CALL (e) {
        WHEN $surface IS NOT NULL THEN {
          MATCH (s:Surface {id: $surface})
          MERGE (e)-[:ON_SURFACE]->(s)
        }
      }
      CALL (e) {
        WHEN $supervisors IS NOT NULL THEN {
          UNWIND $supervisors AS supervisor
          MATCH (sup:Supervisor {id: supervisor})
          MERGE (sup)-[:SUPERVISED]->(e)
        }
      }
      CALL (e) {
        WHEN $venues IS NOT NULL THEN {
          UNWIND $venues AS venue
          MATCH (v:Venue {id: venue})
          MERGE (e)-[:TOOK_PLACE_IN]->(v)
        }
      }
    `,
    {
      id: int(id as string),
      tours: tours ? (Array.isArray(tours) ? tours : [tours]) : null,
      tournament,
      year,
      surface: surface || null,
      supervisors: supervisors ? (Array.isArray(supervisors) ? supervisors : [supervisors]) : null,
      venues: venues ? (Array.isArray(venues) ? venues : [venues]) : null,
      atp_link: atp_link || null,
      wta_link: wta_link || null,
      men_link: men_link || null,
      women_link: women_link || null,
      wiki_link: wiki_link || null,
      category: category || null,
      atp_category: atp_category || null,
      wta_category: wta_category || null,
      men_category: men_category || null,
      women_category: women_category || null,
      sponsor_name: sponsor_name || null,
      atp_sponsor_name: atp_sponsor_name || null,
      wta_sponsor_name: wta_sponsor_name || null,
      draw_type: draw_type || null,
      atp_draw_s: atp_draw_s || null,
      atp_draw_d: atp_draw_d || null,
      atp_draw_qs: atp_draw_qs || null,
      atp_draw_qd: atp_draw_qd || null,
      wta_draw_s: wta_draw_s || null,
      wta_draw_d: wta_draw_d || null,
      wta_draw_qs: wta_draw_qs || null,
      wta_draw_qd: wta_draw_qd || null,
      men_draw_s: men_draw_s || null,
      men_draw_d: men_draw_d || null,
      men_draw_qs: men_draw_qs || null,
      men_draw_qd: men_draw_qd || null,
      women_draw_s: women_draw_s || null,
      women_draw_d: women_draw_d || null,
      women_draw_qs: women_draw_qs || null,
      women_draw_qd: women_draw_qd || null,
      atp_draw_s_link: atp_draw_s_link || null,
      atp_draw_d_link: atp_draw_d_link || null,
      atp_draw_qs_link: atp_draw_qs_link || null,
      atp_draw_qd_link: atp_draw_qd_link || null,
      wta_draw_s_link: wta_draw_s_link || null,
      wta_draw_d_link: wta_draw_d_link || null,
      wta_draw_qs_link: wta_draw_qs_link || null,
      wta_draw_qd_link: wta_draw_qd_link || null,
      men_draw_s_link: men_draw_s_link || null,
      men_draw_d_link: men_draw_d_link || null,
      men_draw_qs_link: men_draw_qs_link || null,
      men_draw_qd_link: men_draw_qd_link || null,
      women_draw_s_link: women_draw_s_link || null,
      women_draw_d_link: women_draw_d_link || null,
      women_draw_qs_link: women_draw_qs_link || null,
      women_draw_qd_link: women_draw_qd_link || null,
      currency: currency || null,
      atp_currency: atp_currency || null,
      wta_currency: wta_currency || null,
      men_currency: men_currency || null,
      women_currency: women_currency || null,
      pm: pm ? int(pm as string) : null,
      atp_pm: atp_pm ? int(atp_pm as string) : null,
      wta_pm: wta_pm ? int(wta_pm as string) : null,
      men_pm: men_pm ? int(men_pm as string) : null,
      women_pm: women_pm ? int(women_pm as string) : null,
      tfc: tfc ? int(tfc as string) : null,
      atp_tfc: atp_tfc ? int(atp_tfc as string) : null,
      wta_tfc: wta_tfc ? int(wta_tfc as string) : null,
      start_date: start_date ? NeoDate.fromStandardDate(new Date(startDate.year, startDate.month - 1, startDate.day)) : null,
      end_date: end_date ? NeoDate.fromStandardDate(new Date(endDate.year, endDate.month - 1, endDate.day)) : null,
      atp_start_date: atp_start_date ? NeoDate.fromStandardDate(new Date(atpStartDate.year, atpStartDate.month - 1, atpStartDate.day)) : null,
      atp_end_date: atp_end_date ? NeoDate.fromStandardDate(new Date(atpEndDate.year, atpEndDate.month - 1, atpEndDate.day)) : null,
      wta_start_date: wta_start_date ? NeoDate.fromStandardDate(new Date(wtaStartDate.year, wtaStartDate.month - 1, wtaStartDate.day)) : null,
      wta_end_date: wta_end_date ? NeoDate.fromStandardDate(new Date(wtaEndDate.year, wtaEndDate.month - 1, wtaEndDate.day)) : null,
      men_start_date: men_start_date ? NeoDate.fromStandardDate(new Date(menStartDate.year, menStartDate.month - 1, menStartDate.day)) : null,
      men_end_date: men_end_date ? NeoDate.fromStandardDate(new Date(menEndDate.year, menEndDate.month - 1, menEndDate.day)) : null,
      women_start_date: women_start_date
        ? NeoDate.fromStandardDate(new Date(womenStartDate.year, womenStartDate.month - 1, womenStartDate.day))
        : null,
      women_end_date: women_end_date ? NeoDate.fromStandardDate(new Date(womenEndDate.year, womenEndDate.month - 1, womenEndDate.day)) : null
    }
  )

  return summary
})
