import { Breadcrumb } from "antd";
import { unencodeName } from "../../utils/utils";

export default function PlayerBreadcrumbs({ pname, pid }) {
  const breadcrumbs = [
    {
      title: "Home",
      key: "1",
      href: "/",
    },
    {
      title: unencodeName(pname),
      key: "2",
    },
    {
      title: "Overview",
      key: "3",
      href: `/players/${pname}/${pid}`,
      menu: {
        items: [
          {
            path: "/activity",
            title: "Activity",
          },
          {
            path: "/titles-and-finals",
            title: "Titles and Finals",
          },
          {
            path: "/wl-index",
            title: "Win-Loss Index",
          },
          {
            path: "/stats",
            title: "Stats",
          },
        ],
      },
    },
  ];
  return <Breadcrumb items={breadcrumbs} />;
}
