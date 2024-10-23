import { gql } from "@apollo/client";

export const GET_UPCOMING = gql`
  query Upcoming($date: Date!) {
    events(
      where: { end_date_GT: $date }
      options: { sort: [{ start_date: ASC }] }
    ) {
      id
      category
      end_date
      sponsor_name
      start_date
      surface {
        environment
        hard_type
        surface
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
`;

export const GET_ARCHIVE = gql`
  query GetArchive($year: Int!) {
    events(
      where: { year: { id: $year } }
      options: { sort: [{ start_date: ASC }] }
    ) {
      id
      category
      end_date
      sponsor_name
      start_date
      surface {
        environment
        hard_type
        surface
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
`;

export const GET_EVENT = gql`
  query Event($id: Int!) {
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
        environment
        surface
        hard_type
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
  }
`;

export const GET_RESULTS = gql`
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
`;
