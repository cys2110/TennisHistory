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
