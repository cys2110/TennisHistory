import { gql } from '@apollo/client/core'

export const GET_H2H = (p1Id, p2Id) => {
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

export const SEARCH_PLAYER = (fullName) => {
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
