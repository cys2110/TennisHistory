export default defineEventHandler(async event => {
  const {
    id,
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
    women_end_date
  } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: toInteger($id)})
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
      e.men_currency = $men_currency, e.women_currency = $women_currency, e.pm = CASE WHEN $pm IS NULL THEN NULL ELSE toInteger($pm) END, e.atp_pm = CASE WHEN $atp_pm IS NULL THEN NULL ELSE toInteger($atp_pm) END, e.wta_pm = CASE WHEN $wta_pm IS NULL THEN NULL ELSE toInteger($wta_pm) END,
      e.men_pm = CASE WHEN $men_pm IS NULL THEN NULL ELSE toInteger($men_pm) END, e.women_pm = CASE WHEN $women_pm IS NULL THEN NULL ELSE toInteger($women_pm) END, e.tfc = CASE WHEN $tfc IS NULL THEN NULL ELSE toInteger($tfc) END, e.atp_tfc = CASE WHEN $atp_tfc IS NULL THEN NULL ELSE toInteger($atp_tfc) END, e.wta_tfc = CASE WHEN $wta_tfc IS NULL THEN NULL ELSE toInteger($wta_tfc) END, e.start_date = CASE WHEN $start_date IS NOT NULL THEN date($start_date) ELSE NULL END,
      e.end_date = CASE WHEN $end_date IS NOT NULL THEN date($end_date) ELSE NULL END,
      e.atp_start_date = CASE WHEN $atp_start_date IS NOT NULL THEN date($atp_start_date) ELSE NULL END,
      e.atp_end_date = CASE WHEN $atp_end_date IS NOT NULL THEN date($atp_end_date) ELSE NULL END,
      e.wta_start_date = CASE WHEN $wta_start_date IS NOT NULL THEN date($wta_start_date) ELSE NULL END,
      e.wta_end_date = CASE WHEN $wta_end_date IS NOT NULL THEN date($wta_end_date) ELSE NULL END,
      e.men_start_date = CASE WHEN $men_start_date IS NOT NULL THEN date($men_start_date) ELSE NULL END,
      e.men_end_date = CASE WHEN $men_end_date IS NOT NULL THEN date($men_end_date) ELSE NULL END,
      e.women_start_date = CASE WHEN $women_start_date IS NOT NULL THEN date($women_start_date) ELSE NULL END,
      e.women_end_date = CASE WHEN $women_end_date IS NOT NULL THEN date($women_end_date) ELSE NULL END
      CALL (e) {
        UNWIND $tours AS tour
        WITH tour, e WHERE NOT tour IN labels(e)
        SET e:$(tour)
      }
      CALL (e) {
        UNWIND labels(e) AS label
        WITH label, e WHERE NOT label IN $tours AND label <> 'Event'
        REMOVE e:$(label)
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
      id,
      tours,
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
      pm: pm ?? null,
      atp_pm: atp_pm ?? null,
      wta_pm: wta_pm ?? null,
      men_pm: men_pm ?? null,
      women_pm: women_pm ?? null,
      tfc: tfc ?? null,
      atp_tfc: atp_tfc ?? null,
      wta_tfc: wta_tfc ?? null,
      start_date: start_date || null,
      end_date: end_date || null,
      atp_start_date: atp_start_date || null,
      atp_end_date: atp_end_date || null,
      wta_start_date: wta_start_date || null,
      wta_end_date: wta_end_date || null,
      men_start_date: men_start_date || null,
      men_end_date: men_end_date || null,
      women_start_date: women_start_date || null,
      women_end_date: women_end_date || null
    }
  )

  return summary
})
