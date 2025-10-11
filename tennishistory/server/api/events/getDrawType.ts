export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      RETURN apoc.map.removeKeys(e, ['wiki_link', 'category', 'atp_category', 'wta_category', 'men_category', 'women_category', 'sponsor_name', 'atp_sponsor_name', 'wta_sponsor_name', 'atp_currency', 'wta_currency', 'men_currency', 'women_currency', 'atp_pm', 'atp_tfc', 'wta_pm', 'men_pm', 'women_pm', 'start_date', 'end_date', 'atp_start_date', 'atp_end_date', 'wta_start_date', 'wta_end_date', 'men_start_date', 'men_end_date', 'women_start_date', 'women_end_date']) AS event
    `,
    { id }
  )

  const results = records[0].get("event")
  const result: Record<string, any> = {}

  if (results.draw_type) {
    result.draw = results.draw_type
  }

  if (results.atp_link) {
    if (results.atp_draw_s) {
      result["ATP"] = {
        Singles: {
          draw: results.atp_draw_s,
          link: results.atp_draw_s_link,
          q_draw: results.atp_draw_qs,
          q_link: results.atp_draw_qs_link
        }
      }
    }
    if (results.atp_draw_d) {
      result["ATP"] = {
        ...result["ATP"],
        Doubles: {
          draw: results.atp_draw_d,
          link: results.atp_draw_d_link,
          q_draw: results.atp_draw_qd,
          q_link: results.atp_draw_qd_link
        }
      }
    }
  }

  if (results.wta_link) {
    if (results.wta_draw_s) {
      result["WTA"] = {
        Singles: {
          draw: results.wta_draw_s,
          link: results.wta_draw_s_link,
          q_draw: results.wta_draw_qs,
          q_link: results.wta_draw_qs_link
        }
      }
    }
    if (results.wta_draw_d) {
      result["WTA"] = {
        ...result["WTA"],
        Doubles: {
          draw: results.wta_draw_d,
          link: results.wta_draw_d_link,
          q_draw: results.wta_draw_qd,
          q_link: results.wta_draw_qd_link
        }
      }
    }
  }

  if (results.men_link) {
    if (results.men_draw_s) {
      result["Men"] = {
        Singles: {
          draw: results.men_draw_s,
          link: results.men_draw_s_link,
          q_draw: results.men_draw_qs,
          q_link: results.men_draw_qs_link
        }
      }
    }
    if (results.men_draw_d) {
      result["Men"] = {
        ...result["Men"],
        Doubles: {
          draw: results.men_draw_d,
          link: results.men_draw_d_link,
          q_draw: results.men_draw_qd,
          q_link: results.men_draw_qd_link
        }
      }
    }
  }

  if (results.women_link) {
    if (results.women_draw_s) {
      result["Women"] = {
        Singles: {
          draw: results.women_draw_s,
          link: results.women_draw_s_link,
          q_draw: results.women_draw_qs,
          q_link: results.women_draw_qs_link
        }
      }
    }
    if (results.women_draw_d) {
      result["Women"] = {
        ...result["Women"],
        Doubles: {
          draw: results.women_draw_d,
          link: results.women_draw_d_link,
          q_draw: results.women_draw_qd,
          q_link: results.women_draw_qd_link
        }
      }
    }
  }

  return result
})
