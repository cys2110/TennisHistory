import { gql } from "@apollo/client";

export const GET_MATCH_STATS = gql`
  query MatchStats($matchNo: Int!, $eventId: Int!) {
    matches(where: { match_no: $matchNo, round: { event: { id: $eventId } } }) {
      court
      date
      duration_mins
      incomplete
      match_no
      round {
        round
        event {
          sponsor_name
          start_date
          end_date
          category
          id
          surface {
            id
          }
          venue {
            city
            country {
              id
              name
            }
          }
          year {
            id
          }
        }
      }
      umpire {
        id
      }
      winner {
        player {
          player {
            id
          }
        }
      }
      p1 {
        s1
        s2
        s3
        s4
        s5
        serve1_pts
        serve1_pts_w
        serve2_pts
        serve2_pts_w
        t1
        t2
        t3
        t4
        t5
        ues
        winners
        ret2_w
        ret2
        ret1_w
        ret1
        net_w
        net
        max_speed_kph
        incomplete
        dfs
        bps_saved
        bps_faced
        bps_converted
        bp_opps
        aces
        avg_sv1_kph
        avg_sv2_kph
        player {
          seed
          status
          player {
            full_name
            id
            country {
              id
              name
            }
          }
        }
      }
      p2 {
        winners
        ues
        t5
        t4
        t3
        t2
        t1
        serve2_pts_w
        serve2_pts
        serve1_pts_w
        serve1_pts
        s5
        s4
        s3
        s2
        s1
        ret2_w
        ret2
        ret1_w
        ret1
        player {
          seed
          status
          player {
            id
            full_name
            country {
              id
              name
            }
          }
        }
        net_w
        net
        max_speed_kph
        incomplete
        dfs
        bps_saved
        bps_faced
        aces
        avg_sv1_kph
        avg_sv2_kph
        bp_opps
        bps_converted
      }
    }
  }
`;
