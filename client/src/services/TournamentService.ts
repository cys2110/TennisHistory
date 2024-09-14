import { gql } from "@apollo/client/core";

export const getTournament = (id: number) => {
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
          winner {
            id
            full_name
            country {
              id
              name
            }
          }
          finalist {
            id
            full_name
            country {
              id
              name
            }
          }
          final_score
        }
      }
    }
  `;
  return { query: call, variables: { id } };
};
