import { gql } from '@apollo/client/core'

export const getSearch = (searchTerm: string) => {
  const call = gql`
    query search($searchTerm: String!) {
      searchTournaments(name: $searchTerm) {
        id
        name
      }
      searchPlayers(full_name: $searchTerm) {
        id
        full_name
        country {
          name
          id
        }
      }
    }
  `
  return { query: call, variables: { searchTerm } }
}
