import { gql } from '@apollo/client/core'

export const GET_H2H = (p1Id: string, p2Id: string) => {
  const call = gql`
    query H2H($p1Id: String!, $p2Id: String!) {
      p1: players(where: { id: $p1Id }) {
        bh1
        career_high
        ch_date
        country {
          id
          name
        }
        dob
        full_name
        height_cm
        id
        loss
        pm_USD
        rh
        titles
        turned_pro {
          id
        }
        win
      }
      p2: players(where: { id: $p2Id }) {
        bh1
        career_high
        ch_date
        country {
          id
          name
        }
        dob
        full_name
        height_cm
        id
        loss
        pm_USD
        rh
        titles
        turned_pro {
          id
        }
        win
      }
      p1Wins: matchesAggregate(
        where: {
          AND: [
            { winner: { player: { player: { id: $p1Id } } } }
            { loser: { player: { player: { id: $p2Id } } } }
          ]
        }
      ) {
        count
      }
      p2Wins: matchesAggregate(
        where: {
          AND: [
            { winner: { player: { player: { id: $p2Id } } } }
            { loser: { player: { player: { id: $p1Id } } } }
          ]
        }
      ) {
        count
      }
      matches(
        where: {
          AND: [
            { scores_SOME: { player: { player: { id: $p1Id } } } }
            { scores_SOME: { player: { player: { id: $p2Id } } } }
          ]
        }
        options: { sort: [{ sort_date: ASC }] }
      ) {
        round {
          round
          event {
            id
            surface {
              id
            }
            year {
              id
            }
            tournament {
              id
              name
            }
          }
        }
        match_no
        winner {
          player {
            player {
              id
              full_name
              last_name
            }
          }
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
        }
      }
    }
  `
  return { query: call, variables: { p1Id, p2Id } }
}

export const SEARCH_PLAYER = (fullName: string) => {
  const call = gql`
    query SearchPlayers($fullName: String!) {
      searchPlayers(full_name: $fullName) {
        id
        full_name
        country {
          id
          name
        }
      }
    }
  `
  return { query: call, variables: { fullName } }
}

export const GET_SEARCH = (searchTerm: string) => {
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
      searchCoaches(name: $searchTerm) {
        id
        full_name
      }
      searchCountries(name: $searchTerm) {
        name
        id
      }
      searchSupervisors(name: $searchTerm) {
        id
      }
      searchSurface(name: $searchTerm) {
        id
      }
      searchUmpires(name: $searchTerm) {
        id
      }
      searchVenue(name: $searchTerm) {
        name
        city
        country {
          id
        }
      }
    }
  `
  return { query: call, variables: { searchTerm } }
}

export const GET_COACH = (id: string) => {
  const call = gql`
    query Coaches($id: String) {
      coaches(where: { id: $id }) {
        players {
          id
          full_name
          country {
            name
            id
          }
        }
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_SUPERVISOR = (id: string) => {
  const call = gql`
    query Supervisors($id: String) {
      supervisors(where: { id: $id }) {
        events(options: { sort: [{ start_date: DESC }] }) {
          id
          year {
            id
          }
          tournament {
            id
            name
          }
          venue {
            country {
              id
              name
            }
          }
        }
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_SURFACE = (id: string) => {
  const call = gql`
    query Surfaces($id: String) {
      surfaces(where: { id: $id }) {
        events(options: { sort: [{ start_date: DESC }] }) {
          id
          year {
            id
          }
          tournament {
            id
            name
          }
          venue {
            country {
              id
            }
          }
        }
      }
    }
  `
  return { query: call, variables: { id } }
}

export const GET_VENUE = (name: string, city: string) => {
  const call = gql`
    query Venues($name: String, $city: String) {
      venues(where: { name: $name, city: $city }) {
        events(options: { sort: [{ start_date: DESC }] }) {
          id
          year {
            id
          }
          tournament {
            id
            name
          }
        }
      }
    }
  `
  return { query: call, variables: { name, city } }
}

export const GET_UMPIRE = (id: string) => {
  const call = gql`
    query Umpires($id: String) {
      events(
        options: { sort: [{ start_date: DESC }] }
        where: { rounds_SOME: { matches_SOME: { umpire: { id: $id } } } }
      ) {
        id
        year {
          id
        }
        tournament {
          id
          name
        }
        venue {
          country {
            id
          }
        }
        rounds(
          options: { sort: [{ number: ASC }] }
          where: { matches_SOME: { umpire: { id: $id } } }
        ) {
          round
          matches(options: { sort: [{ match_no: ASC }] }, where: { umpire: { id: $id } }) {
            match_no
            p1 {
              player {
                player {
                  full_name
                  id
                }
              }
            }
            p2 {
              player {
                player {
                  full_name
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

export const GET_COUNTRY = (name: string) => {
  const call = gql`
    query Countries($name: String) {
      countries(where: { name: $name }) {
        players(options: { sort: [{ last_name: ASC }] }) {
          id
          full_name
        }
        formerPlayers {
          id
          full_name
        }
      }
    }
  `
  return { query: call, variables: { name } }
}
