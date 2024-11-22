import { gql } from '@apollo/client/core'

export const GET_UPCOMING = (date) => {
  const call = gql`
    query Upcoming($date: Date!) {
      events(where: { end_date_GT: $date }, options: { sort: [{ start_date: ASC }] }) {
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
  return { query: call, variables: { date } }
}

export const GET_ARCHIVE = (year) => {
  const call = gql`
    query GetArchive($year: Int!) {
      events(where: { year: { id: $year } }, options: { sort: [{ start_date: ASC }] }) {
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
  return { query: call, variables: { year } }
}

export const GET_EVENT = (id, idString) => {
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
        lls {
          player {
            full_name
            id
            country {
              id
              name
            }
          }
        }
        alt {
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
      entries(where: { id_STARTS_WITH: $idString }) {
        player {
          id
          full_name
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
