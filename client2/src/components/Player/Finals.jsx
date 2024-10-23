import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { GET_TITLES } from "../../services/PlayerService";
import { unencodeName } from "../../utils/utils";
import Loading from "../Global/Loading";
import Title from "../Global/Title";
import { useState } from "react";
import { Select } from "antd";
import FinalsTable from "./FinalsTable";

export default function Finals() {
  const { pname, pid } = useParams();

  const { loading, error, data } = useQuery(GET_TITLES, {
    variables: { id: pid },
  });
  if (data) console.log(data.players[0]);
  if (error) console.error(error);

  const [selection, setSelection] = useState("Titles");
  const selections = [
    {
      label: "Titles",
      key: "titles",
      value: "Titles",
    },
    {
      label: "Finals",
      key: "finals",
      value: "Finals",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Titles and Finals | {unencodeName(pname)}</title>
      </Helmet>
      <Title title="Titles and Finals" />
      {data && (
        <>
          <Select
            options={selections}
            onChange={setSelection}
            defaultValue="Titles"
          />
          <FinalsTable
            events={
              selection === "Titles"
                ? data.players[0].titlesByYear
                : data.players[0].finalsByYear
            }
          />
        </>
      )}
      {!data && <Loading loading={loading} none="No data available" />}
    </>
  );
}
