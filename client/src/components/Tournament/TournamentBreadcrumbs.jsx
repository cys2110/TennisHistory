import { Breadcrumb } from "antd";

export default function TournamentBreadcrumbs({ name, events }) {
  const getYears = (event) => {
    return {
      path: `/${event.year.id}/${event.id}`,
      title: event.year.id,
    };
  };
  const breadcrumbs = [
    {
      title: "Home",
      key: "1",
      href: "/",
    },
    {
      title: name,
      key: "2",
      menu: {
        items: events.map(getYears).reverse(),
      },
    },
  ];
  return <Breadcrumb items={breadcrumbs} />;
}
