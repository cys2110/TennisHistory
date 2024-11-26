import { useMatch, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Breadcrumb } from "antd";
import { unencodeName } from "../../utils/utils";
import { GET_TOURNAMENT_YEARS } from "../../services/TournamentService";

export default function TournamentBreadcrumbs() {
  const { tname, tid, year, eid, mid } = useParams();
  const eventOverview = useMatch("/tournaments/:tname/:tid/:year/:eid");
  const eventResults = useMatch("/tournaments/:tname/:tid/:year/:eid/results");
  const eventDraw = useMatch("/tournaments/:tname/:tid/:year/:eid/draw");
  const matchPage = useMatch("/tournaments/:tname/:tid/:year/:eid/:mid");

  const { loading, error, data } = useQuery(GET_TOURNAMENT_YEARS, {
    variables: { id: parseInt(tid) },
  });
  if (error) console.error(error);

  const breadcrumbs = [
    {
      title: <Link to={"/"}>Home</Link>,
      key: "home",
    },
    {
      title: (
        <Link to={`/tournaments/${tname}/${tid}`}>{unencodeName(tname)}</Link>
      ),
      key: "tournament",
      ...(data && {
        menu: {
          items: data.tournaments[0].events
            .map((event) =>
              parseInt(year) === event.year.id
                ? null
                : {
                    key: `event-${event.year.id}`,
                    title: (
                      <Link
                        to={`/tournaments/${tname}/${tid}/${event.year.id}/${event.id}`}
                      >
                        {event.year.id}
                      </Link>
                    ),
                  }
            )
            .filter(Boolean),
        },
      }),
    },
    year && {
      title: year,
      key: "event",
      menu: {
        items: [
          eventOverview
            ? null
            : {
                title: (
                  <Link to={`/tournaments/${tname}/${tid}/${year}/${eid}`}>
                    Details
                  </Link>
                ),
                key: `details-${eid}`,
              },
          eventResults
            ? null
            : {
                title: (
                  <Link
                    to={`/tournaments/${tname}/${tid}/${year}/${eid}/results`}
                  >
                    Results
                  </Link>
                ),
                key: `results-${eid}`,
              },
          eventDraw
            ? null
            : {
                title: (
                  <Link to={`/tournaments/${tname}/${tid}/${year}/${eid}/draw`}>
                    Draw
                  </Link>
                ),
                key: `draw-${eid}`,
              },
        ].filter(Boolean),
      },
    },
    mid && {
      title: mid,
      key: mid,
    },
  ].filter(Boolean);
  return <Breadcrumb items={breadcrumbs} />;
}
