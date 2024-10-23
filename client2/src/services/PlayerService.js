import { gql } from "@apollo/client";

export const GET_PLAYER = gql`
  query Player($id: String!) {
    players(where: { id: $id }) {
      id
      first_name
      last_name
      full_name
      career_high
      ch_date
      loss
      win
      titles
      pm_USD
      gladiator
      dob
      height_cm
      rh
      bh1
      turned_pro {
        id
      }
      retired {
        id
      }
      coaches {
        id
        full_name
        first_name
      }
      countryConnection {
        edges {
          node {
            id
            name
          }
          properties {
            end_date
            start_date
          }
        }
      }
      prev_countriesConnection {
        edges {
          node {
            id
            name
          }
          properties {
            end_date
            start_date
          }
        }
      }
    }
  }
`;

export const GET_EVENTS_PLAYED = gql`
query
`;

export const GET_TITLES = gql`
  query Titles($id: String!) {
    players(where: { id: $id }) {
      titlesByYear {
        year
        count
        events {
          id
          tournament_id
          tournament_name
          surface
        }
      }
      finalsByYear {
        year
        count
        events {
          id
          tournament_id
          tournament_name
          surface
        }
      }
    }
  }
`;

export const GET_INDEX = gql`
  query Index($id: String!) {
    players(where: { id: $id }) {
      index {
        wins
        losses
        titles
        gsWins
        gsLosses
        gsTitles
        mastersWins
        mastersLosses
        mastersTitles
        tbWins
        tbLosses
        v10Wins
        v10Losses
        finalsWins
        finalsLosses
        deciderWins
        deciderLosses
        set5Wins
        set5Losses
        clayWins
        clayLosses
        clayTitles
        grassWins
        grassLosses
        grassTitles
        hardWins
        hardLosses
        hardTitles
        carpetWins
        carpetLosses
        carpetTitles
        indoorWins
        indoorLosses
        indoorTitles
        outdoorWins
        outdoorLosses
        outdoorTitles
        win1Wins
        win1Losses
        lose1Wins
        lose1Losses
        rhWins
        rhLosses
        lhWins
        lhLosses
      }
    }
  }
`;

export const GET_PLAYER_STATS = gql`
  query GetYears($id: String!, $year: Int, $surface: String) {
    players(where: { id: $id }) {
      years {
        earliest
        latest
      }
      stats(year: $year, surface: $surface) {
        aces
        bp_opps
        bps_converted
        bps_faced
        bps_saved
        dfs
        ret1
        ret1_w
        ret2
        ret2_w
        serve1
        serve1_w
        serve2
        serve2_w
      }
    }
  }
`;
