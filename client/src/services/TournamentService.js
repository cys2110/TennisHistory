import { gql } from '@apollo/client/core'

// export const GET_TOURNAMENT_YEARS = gql`
//   query getYears($id: Int!) {
//     tournaments(where: { id: $id }) {
//       events {
//         id
//         year(options: { sort: [{ id: ASC }] }) {
//           id
//         }
//       }
//     }
//   }
// `;

export const GET_TOURNAMENT = (id) => {
  const call = gql`
    query getTournament($id: Int!) {
      tournaments(where: { id: $id }) {
        id
        name
        website
        start_year {
          id
        }
        end_year {
          id
        }
        events {
          id
          year(options: { sort: [{ id: DESC }] }) {
            id
          }
          start_date
          end_date
          rounds(where: { round: "Final" }) {
            matches {
              winner {
                player {
                  player {
                    country {
                      id
                      name
                    }
                    id
                    full_name
                  }
                }
                t1
                t2
                t3
                t4
                t5
                s5
                s4
                s3
                s2
                s1
              }
              loser {
                incomplete
                s1
                s2
                s3
                s4
                s5
                t1
                t2
                t3
                t4
                t5
                player {
                  player {
                    country {
                      id
                      name
                    }
                    full_name
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  return { query: call, variables: { id } }
}
