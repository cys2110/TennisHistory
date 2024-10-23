import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Archive from "./Archive/Archive";
import Event from "./Event/Event";
import Results from "./Event/Results";
import Draw from "./Event/Draw";
import MatchStats from "./Match/MatchStats";
import { FloatButton } from "antd";
import Player from "./Player/Player";
import Activity from "./Player/Activity";
import Finals from "./Player/Finals";
import Index from "./Player/Index";
import PlayerStats from "./Player/PlayerStats";
import Tournament from "./Tournament/Tournament";
import H2H from "./H2H/H2H";
import Search from "./Search/Search";

export default function Main() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/players/:pname/:pid" element={<Player />}>
          <Route path="activity" element={<Activity />} />
          <Route path="titles-and-finals" element={<Finals />} />
          <Route path="wl-index" element={<Index />} />
          <Route path="stats" element={<PlayerStats />} />
        </Route>
        <Route path="/h2h/:p1name/:p1id/:p2name/:p2id" element={<H2H />} />
        <Route path="/tournaments/:tname/:tid" element={<Tournament />}>
          <Route path=":year/:eid" element={<Event />}>
            <Route path="results" element={<Results />} />
            <Route path="draw" element={<Draw />} />
            <Route path=":mid" element={<MatchStats />} />
          </Route>
        </Route>
        <Route path="/search" element={<Search />} />
      </Routes>
      <FloatButton.BackTop type="primary" />
    </>
  );
}
