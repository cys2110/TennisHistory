import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { TreeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

export default function EntryInfo({ entryInfo }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  echarts.use([TreeChart, CanvasRenderer]);

  const treeData = {
    name: "Entry Information",
    children: entryInfo.map((info) => ({
      name: info.title,
      children: info.array.map((player) => {
        const childNodes = [];
        if (player.properties?.rank)
          childNodes.push({ name: player.properties.rank });
        if (player.properties?.reason)
          childNodes.push({ name: player.properties.reason });

        return {
          name: player.node?.player.full_name || player.player.full_name,
          children: childNodes.length > 0 ? childNodes : undefined,
        };
      }),
    })),
  };

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstanceRef.current = chartInstance;

    const option = {
      darkMode: true,
      series: [
        {
          type: "tree",
          data: [treeData],
          top: "1%",
          left: "10%",
          bottom: "1%",
          right: "20%",
          symbolSize: 7,
          label: {
            position: "top",
            verticalAlign: "middle",
            align: "right",
            fontSize: 12,
          },
          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "left",
            },
          },
          itemStyle: { color: "#7c3aed" },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };

    chartInstance.setOption(option);

    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.dispose();
    };
  }, [entryInfo]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "400px" }}
      className="mx-auto"
    />
  );
}
