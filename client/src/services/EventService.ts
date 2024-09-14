import { gql } from "@apollo/client/core";

export const getUpcomingEvents = (date: Date) => {
  const call = gql`
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
  return { query: call, variables: { date } };
};

export const getEventsByYear = (year: number) => {
  const call = gql`
    query EventByYear($year: Int!) {
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
  return { query: call, variables: { year } };
};

export const getEvent = (id: number) => {
  const call = gql`
    query EventLayout($id: Int!) {
      events(where: { id: $id }) {
        category
        draw_type
        sponsor_name
        start_date
        end_date
        id
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
  return { query: call, variables: { id } };
};

export const getEventDetails = (id: number) => {
  const call = gql`
    query getEventDetails($id: Int!) {
      events(where: { id: $id }) {
        id
        venue {
          city
          name
          country {
            id
            name
          }
        }
        surface {
          environment
          hard_type
          surface
        }
        pm
        r64_pts
        r64_pm
        r32_pts
        r32_pm
        r16_pts
        r16_pm
        r128_pts
        r128_pm
        quarterfinalist_pts
        quarterfinalist_pm
        semifinalist_pm
        semifinalist_pts
        finalist_pm
        finalist_pts
        currency
        tfc
        winner_pm
        winner_pts
        supervisors {
          id
        }
        seeds: playersConnection(
          where: { edge: { NOT: { seed: null } } }
          sort: [{ edge: { seed: ASC } }]
        ) {
          edges {
            node {
              first_name
              full_name
              country {
                id
                name
              }
              last_name
              id
            }
            properties {
              seed
              rank
              wd
            }
          }
        }
        lda: playersConnection(where: { edge: { NOT: { lda: null } } }) {
          edges {
            node {
              first_name
              full_name
              country {
                id
                name
              }
              last_name
              id
            }
            properties {
              lda
              status
            }
          }
        }
        ret: playersConnection(where: { edge: { NOT: { ret: null } } }) {
          edges {
            node {
              first_name
              last_name
              full_name
              id
              country {
                id
                name
              }
            }
            properties {
              ret
            }
          }
        }
        wd: playersConnection(where: { edge: { NOT: { wd: null } } }) {
          edges {
            node {
              id
              first_name
              last_name
              full_name
              country {
                id
                name
              }
            }
            properties {
              wd
            }
          }
        }
        wo: playersConnection(where: { edge: { NOT: { wo: null } } }) {
          edges {
            node {
              id
              first_name
              last_name
              full_name
              country {
                id
                name
              }
            }
            properties {
              wo
            }
          }
        }
        defaulted: playersConnection(
          where: { edge: { NOT: { defaulted: null } } }
        ) {
          edges {
            node {
              id
              first_name
              last_name
              full_name
              country {
                id
                name
              }
            }
            properties {
              defaulted
            }
          }
        }
        ll: playersConnection(where: { edge: { status: "LL" } }) {
          edges {
            node {
              id
              first_name
              last_name
              full_name
              country {
                id
                name
              }
            }
          }
        }
        alt: playersConnection(where: { edge: { status: "Alt" } }) {
          edges {
            node {
              id
              first_name
              last_name
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
  `;
  return { query: call, variables: { id } };
};

export const getResults = (id: number) => {
  const call = gql`
    query Results($id: Int!) {
      events(where: { id: $id }) {
        rounds(options: { sort: { number: DESC } }) {
          round
          matches(options: { sort: [{ match_no: DESC }] }) {
            court
            date
            duration_mins
            incomplete
            match_no
            umpire {
              id
            }
            winner {
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
                country {
                  id
                  name
                }
                first_name
                full_name
                id
                last_name
              }
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
                first_name
                full_name
                id
                last_name
                country {
                  id
                  name
                }
              }
            }
          }
        }
        playersConnection {
          edges {
            node {
              id
            }
            properties {
              seed
              status
              points
              rank
              pm
            }
          }
        }
      }
    }
  `;
  return { query: call, variables: { id } };
};

export const getDraw = (id: number) => {
  const call = gql`
    query Draw($id: Int!) {
      events(where: { id: $id }) {
        rounds(options: { sort: [{ number: DESC }] }) {
          round
          number
          matches(options: { sort: [{ match_no: DESC }] }) {
            incomplete
            match_no
            id
            winner {
              player {
                id
              }
            }
            p1 {
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
                country {
                  id
                  name
                }
                first_name
                full_name
                id
                last_name
              }
            }
            p2 {
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
                first_name
                full_name
                id
                last_name
                country {
                  id
                  name
                }
              }
            }
          }
        }
        playersConnection {
          edges {
            node {
              id
            }
            properties {
              seed
              status
              points
              rank
              pm
            }
          }
        }
      }
    }
  `;
  return { query: call, variables: { id } };
};
