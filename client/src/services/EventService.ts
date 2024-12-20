import { gql } from '@apollo/client/core'

export const GET_UPCOMING = (
  surface: string | null,
  month: number | null,
  category: string | null,
) => {
  const call = gql`
    query Upcoming($surface: String, $month: Int, $category: String) {
      upcomingEvents(surface: $surface, month: $month, category: $category) {
        id
        category
        end_date
        sponsor_name
        start_date
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
    }
  `
  return { query: call, variables: { surface, month, category } }
}

export const GET_ARCHIVE = (
  year: number,
  category: string | null,
  month: number | null,
  surface: string | null,
) => {
  const call = gql`
    query GetArchive($year: Int, $category: String, $month: Int, $surface: String) {
      archiveEvents(year: $year, category: $category, month: $month, surface: $surface) {
        id
        category
        end_date
        sponsor_name
        start_date
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
    }
  `
  return { query: call, variables: { year, category, month, surface } }
}

export const GET_EVENT = (id: number, idString: string) => {
  const call = gql`
    query Event($id: Int!, $idString: String!) {
      events(where: { id: $id }) {
        category
        draw_type
        sponsor_name
        start_date
        end_date
        id
        pm
        tfc
        currency
        surface {
          id
        }
        tournament {
          id
          name
        }
        venue {
          name
          city
          country {
            id
            name
          }
        }
        year {
          id
        }
        supervisors {
          id
        }
        rounds(options: { sort: { number: ASC } }) {
          round
          number
          pm
          points
        }
        seeds(options: { sort: { seed: ASC } }) {
          seed
          rank
          player {
            full_name
            last_name
            id
            country {
              id
              name
            }
          }
        }
        ldaConnection {
          edges {
            node {
              player {
                full_name
                id
                country {
                  id
                  name
                }
              }
            }
            properties {
              rank
            }
          }
        }
        wdConnection {
          edges {
            node {
              player {
                full_name
                id
                country {
                  id
                  name
                }
              }
            }
            properties {
              reason
            }
          }
        }
        retConnection {
          edges {
            node {
              player {
                full_name
                id
                country {
                  id
                  name
                }
              }
            }
            properties {
              reason
            }
          }
        }
        woConnection {
          edges {
            node {
              player {
                full_name
                id
                country {
                  id
                  name
                }
              }
            }
            properties {
              reason
            }
          }
        }
        defaultedConnection {
          edges {
            node {
              player {
                full_name
                id
                country {
                  id
                  name
                }
              }
            }
            properties {
              reason
            }
          }
        }
        llsConnection {
          edges {
            node {
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
        }
        altConnection {
          edges {
            node {
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
        }
        wcConnection {
          edges {
            node {
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
        }
        qualifiersConnection {
          edges {
            node {
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
        }
      }
      entries(where: { id_STARTS_WITH: $idString }, options: { sort: { rank: ASC } }) {
        player {
          id
          full_name
          last_name
          country {
            id
            name
          }
        }
        seed
        status
        rank
      }
    }
  `
  return { query: call, variables: { id, idString } }
}

export const GET_RESULTS = (id: number) => {
  const call = gql`
    query Results($id: Int!) {
      events(where: { id: $id }) {
        rounds(where: { number_GT: 0 }, options: { sort: { number: DESC } }) {
          number
          round
          matches(options: { sort: [{ match_no: ASC }] }) {
            court
            date
            duration_mins
            incomplete
            match_no
            umpire {
              id
            }
            winner {
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
            }
            loser {
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
            }
          }
        }
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_DRAW = (id: number) => {
  const call = gql`
    query Draw($id: Int!) {
      events(where: { id: $id }) {
        rounds(where: { number_GT: 0 }, options: { sort: { number: DESC } }) {
          round
          number
          matches(options: { sort: [{ match_no: ASC }] }) {
            incomplete
            match_no
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
                player {
                  country {
                    id
                    name
                  }
                  full_name
                  id
                }
                seed
                status
              }
            }
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
                seed
                status
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
  `
  return { query: call, variables: { id } }
}
