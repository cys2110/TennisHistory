import { gql } from "@apollo/client/core";

export const getMatchStats = (matchNo: number, eventId: number) => {
  const call = gql`
    query MatchStats($matchNo: Int!, $eventId: Int!) {
      matches(
        where: { match_no: $matchNo, round: { event: { id: $eventId } } }
      ) {
        date
        court
        duration_mins
        incomplete
        round {
          round
          event {
            sponsor_name
            tournament {
              id
              name
            }
            surface {
              environment
              hard_type
              surface
            }
            end_date
            start_date
            id
            category
            venue {
              city
              name
              country {
                id
                name
              }
            }
            year {
              id
            }
            playersConnection {
              edges {
                properties {
                  seed
                  status
                }
                node {
                  id
                }
              }
            }
          }
        }
        winner {
          player {
            id
          }
        }
        p1 {
          aces
          avg_sv1_kph
          avg_sv2_kph
          bp_opps
          bps_converted
          bps_faced
          bps_saved
          dfs
          incomplete
          max_speed_kph
          net
          net_w
          ret1
          ret1_w
          ret2
          ret2_w
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
          player {
            id
            last_name
            first_name
            full_name
            country {
              name
              id
            }
          }
        }
        p2 {
          aces
          avg_sv1_kph
          avg_sv2_kph
          bp_opps
          bps_converted
          bps_faced
          bps_saved
          dfs
          incomplete
          max_speed_kph
          net
          net_w
          ret1
          ret1_w
          ret2
          ret2_w
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
          player {
            id
            last_name
            first_name
            full_name
            country {
              name
              id
            }
          }
        }
        umpire {
          id
        }
      }
    }
  `;
  return { query: call, variables: { matchNo, eventId } };
};
