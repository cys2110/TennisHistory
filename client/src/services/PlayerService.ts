import { gql } from '@apollo/client/core'

export const GET_PLAYER = (id: string) => {
  const call = gql`
    query Player($id: String!) {
      players(where: { id: $id }) {
        id
        full_name
        career_high
        ch_date
        loss
        win
        titles
        pm_USD
        gladiator
        dob
        height_cm
        rh
        bh1
        turned_pro {
          id
        }
        retired {
          id
        }
        coaches {
          id
          full_name
          first_name
        }
        countryConnection {
          edges {
            node {
              id
              name
            }
            properties {
              end_date
              start_date
            }
          }
        }
        prev_countriesConnection {
          edges {
            node {
              id
              name
            }
            properties {
              end_date
              start_date
            }
          }
        }
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_ACTIVITY = (id: string, year: number) => {
  const call = gql`
    query Activity($id: String!, $year: Int!) {
      yearStats(id: $id, year: $year) {
        losses
        titles
        wins
      }
      players(where: { id: $id }) {
        years {
          earliest
          latest
        }
        entries(where: { scores_SOME: { match: { round: { event: { year: { id: $year } } } } } }) {
          pm
          points
          rank
          seed
          status
          scores {
            match {
              p2 {
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
                incomplete
                player {
                  rank
                  seed
                  status
                  player {
                    full_name
                    id
                    country {
                      name
                      id
                    }
                  }
                }
              }
              p1 {
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
                incomplete
                player {
                  rank
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
              round {
                event {
                  id
                  category
                  end_date
                  start_date
                  sponsor_name
                  currency
                  surface {
                    id
                  }
                  tournament {
                    id
                    name
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
                round
              }
              incomplete
              match_no
              winner {
                player {
                  player {
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
  return { query: call, variables: { id, year } }
}

export const GET_TITLES = (id: string) => {
  const call = gql`
    query PlayerTitlesAndFinals($id: String!) {
      playerfinals(id: $id) {
        id
        surface
        tid
        tname
        year
      }
      playertitles(id: $id) {
        id
        surface
        tid
        tname
        year
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_INDEX = (id: string) => {
  const call = gql`
    query Index($id: String!) {
      players(where: { id: $id }) {
        index {
          wins
          losses
          titles
          gsWins
          gsLosses
          gsTitles
          mastersWins
          mastersLosses
          mastersTitles
          tbWins
          tbLosses
          v10Wins
          v10Losses
          finalsWins
          finalsLosses
          deciderWins
          deciderLosses
          set5Wins
          set5Losses
          clayWins
          clayLosses
          clayTitles
          grassWins
          grassLosses
          grassTitles
          hardWins
          hardLosses
          hardTitles
          carpetWins
          carpetLosses
          carpetTitles
          indoorWins
          indoorLosses
          indoorTitles
          outdoorWins
          outdoorLosses
          outdoorTitles
          win1Wins
          win1Losses
          lose1Wins
          lose1Losses
          rhWins
          rhLosses
          lhWins
          lhLosses
        }
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_PLAYER_STATS = (id: string, year?: number, surface?: string) => {
  const call = gql`
    query GetStats($id: String!, $year: Int, $surface: String) {
      players(where: { id: $id }) {
        years {
          earliest
          latest
        }
        stats(year: $year, surface: $surface) {
          aces
          bp_opps
          bps_converted
          bps_faced
          bps_saved
          dfs
          ret1
          ret1_w
          ret2
          ret2_w
          serve1
          serve1_w
          serve2
          serve2_w
        }
      }
    }
  `
  return { query: call, variables: { id, year, surface } }
}
