import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  DatasetComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import { ScatterChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { formatCurrency } from "../../utils/utils";

export default function PrizeMoney({ rounds, currency }) {
  echarts.use([
    DatasetComponent,
    GridComponent,
    TooltipComponent,
    ScatterChart,
    CanvasRenderer,
    UniversalTransition,
  ]);

  const pmChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
      chartInstanceRef.current = echarts.init(chartRef.current);

      const option = {
        dataset: {
          source: rounds,
          dimensions: ["round", "points", "pm"],
        },
        textStyle: { color: "#a1a1aa", fontSize: 12 },
        tooltip: {
          formatter: function (params) {
            return `${params.value[params.dimensionNames[0]]}<br/>Points: ${
              params.value[params.dimensionNames[1]]
            }<br/>Prize Money: ${formatCurrency(
              currency,
              params.value[params.dimensionNames[2]]
            )}`;
          },
          backgroundColor: "transparent",
          textStyle: { color: "#a1a1aa" },
        },
        xAxis: {
          type: "value",
          name: "Points",
          splitLine: { show: false },
        },
        yAxis: {
          type: "value",
          name: "Prize Money",
          axisLabel: {
            formatter: (value) => `${formatCurrency(currency, value)}`,
          },
          splitLine: { show: false },
        },
        series: [
          {
            symbolSize: 20,
            type: "scatter",
            encode: { x: "points", y: "pm" },
            itemStyle: { color: "#7c3aed" },
          },
        ],
      };

      chartInstanceRef.current.setOption(option);

      const handleResize = () => chartInstanceRef.current.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstanceRef.current && chartInstanceRef.current.dispose();
      };
    }, []);

    return (
      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px" }}
        className="mx-auto"
      />
    );
  };

  return (
    <>
      <div id="awards" className="text-4xl">
        Awards
      </div>
      <div>{pmChart()}</div>
    </>
  );
}
