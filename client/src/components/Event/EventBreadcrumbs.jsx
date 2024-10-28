import { useParams } from "react-router";
import { Breadcrumb } from "antd";

export default function EventBreadcrumbs() {
  const { tname, tid, year, eid } = useParams();
  const breadcrumbs = [
    {
      title: "Home",
      key: "1",
      href: "/",
    },
    {
      title: tname,
      key: "2",
      href: `/tournaments/${tname}/${tid}`,
    },
    {
      title: year,
      key: "3",
      href: `/tournaments/${tname}/${tid}/${year}/${eid}`,
      menu: {
        items: [
          {
            path: "/results",
            title: "Results",
          },
          {
            path: "/draw",
            title: "Draw",
          },
        ],
      },
    },
  ];
  return <Breadcrumb items={breadcrumbs} />;
}
