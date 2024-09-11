import { gql } from "@apollo/client/core";

export const getSearch = (searchTerm: string) => {
  const call = gql`
    query search($searchTerm: String!) {
      tournaments(where: { name_MATCHES: $searchTerm }) {
        id
        name
      }
      searchPlayers(full_name: $searchTerm) {
        last_name
        full_name
        first_name
        id
        country {
          name
          id
        }
      }
    }
  `;
  return { query: call, variables: { searchTerm } };
};

export const getPlayer = (searchTerm: string) => {
  const call = gql`
    query search($searchTerm: String!) {
      searchPlayers(full_name: $searchTerm) {
        last_name
        full_name
        first_name
        id
        country {
          name
          id
        }
      }
    }
  `;
  return { query: call, variables: { searchTerm } };
};
