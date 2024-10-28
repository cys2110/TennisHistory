import { Breadcrumb } from "antd";

export default function MatchBreadcrumbs({
  tname,
  tid,
  year,
  eid,
  round,
  mid,
}) {
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
            path: `/results`,
            title: "Results",
          },
          {
            path: "/draw",
            title: "Draw",
          },
        ],
      },
    },
    {
      title: round,
      key: "4",
    },
    {
      title: mid,
      key: "5",
      href: `/tournaments/${tname}/${tid}/${year}/${eid}/${mid}`,
    },
  ];
  return <Breadcrumb items={breadcrumbs} />;
}
