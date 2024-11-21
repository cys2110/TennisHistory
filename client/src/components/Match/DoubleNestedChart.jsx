import { useEffect, useRef } from "react";
import { Col } from "antd";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

export default function DoubleNestedChart({
  p1Nested,
  p2Nested,
  p1Outer,
  p2Outer,
  p1Middle,
  p2Middle,
}) {
  echarts.use([PieChart, LabelLayout, CanvasRenderer]);

  const nestedChart = () => {
    const nestedChartRef = useRef(null);
    const nestedChartInstanceRef = useRef(null);

    useEffect(() => {
      nestedChartInstanceRef.current = echarts.init(nestedChartRef.current);

      const option = {
        darkMode: true,
        series: [
          {
            name: "Unforced Errors",
            type: "pie",
            radius: [0, "25%"],
            label: {
              formatter: "{a}: {c}",
            },
            data: [
              { value: p1Nested, itemStyle: { color: "#6d28d9" } },
              { value: p2Nested, itemStyle: { color: "#166534" } },
            ],
            itemStyle: {
              borderColor: "#3f3f46",
            },
          },
          {
            name: "Winners",
            type: "pie",
            radius: ["35%", "70%"],
            label: {
              formatter: "{a}: {c}",
            },
            data: [
              { value: p1Middle, itemStyle: { color: "#6d28d9" } },
              { value: p2Middle, itemStyle: { color: "#166534" } },
            ],
          },
          {
            name: "Total Points Won",
            type: "pie",
            radius: ["75%", "100%"],
            label: {
              formatter: "{a}: {c}",
            },
            data: [
              { value: p1Outer, itemStyle: { color: "#6d28d9" } },
              { value: p2Outer, itemStyle: { color: "#166534" } },
            ],
          },
        ],
      };

      nestedChartInstanceRef.current.setOption(option);

      const handleResize = () => nestedChartInstanceRef.current.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        nestedChartInstanceRef.current &&
          nestedChartInstanceRef.current.dispose();
      };
    }, []);

    return (
      <div
        ref={nestedChartRef}
        style={{ width: "100%", height: "400px" }}
        className="mx-auto"
      />
    );
  };

  return <Col span={12}>{nestedChart()}</Col>;
}
