import * as echarts from "echarts/core";
import {
  DatasetComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { BarChart, LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

export default function Seeds({ seeds }) {
  echarts.use([
    DatasetComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    UniversalTransition,
    CanvasRenderer,
  ]);

  const flattenedSeeds = seeds.map((seed) => ({
    seed: seed.seed,
    rank: seed.rank,
    name: seed.player.full_name,
    countryId: seed.player.country.id,
    countryName: seed.player.country.name,
    id: seed.player.id,
  }));

  const seedsChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
      chartInstanceRef.current = echarts.init(chartRef.current);

      const option = {
        grid: {
          bottom: "30%",
        },
        dataset: {
          source: flattenedSeeds,
          dimensions: [
            "seed",
            "rank",
            "name",
            "countryId",
            "countryName",
            "id",
          ],
        },
        textStyle: { color: "#a1a1aa", fontSize: 14 },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 60,
            interval: 0,
          },
        },
        yAxis: [
          {
            type: "value",
            name: "Seed",
          },
          {
            type: "value",
            name: "Rank",
          },
        ],
        series: [
          {
            name: "Seed",
            type: "line",
            encode: { x: "name", y: "seed" },
            itemStyle: { color: "#a1a1aa" },
          },
          {
            name: "Rank",
            type: "bar",
            encode: { x: "name", y: "rank" },
            yAxisIndex: 1,
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
        style={{ width: "90%", height: "500px" }}
        className="mx-auto"
      />
    );
  };

  return <div>{seedsChart()}</div>;
}
