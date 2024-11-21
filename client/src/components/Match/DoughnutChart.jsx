import { useEffect, useRef } from "react";
import { Col } from "antd";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

export default function DoughnutChart({ p1Value, p2Value }) {
  echarts.use([PieChart, LabelLayout, CanvasRenderer]);

  const doughnutChart = () => {
    const doughnutChartRef = useRef(null);
    const doughnutChartInstanceRef = useRef(null);

    useEffect(() => {
      doughnutChartInstanceRef.current = echarts.init(doughnutChartRef.current);

      const option = {
        darkMode: true,
        series: [
          {
            name: "Total Points Won",
            type: "pie",
            radius: ["40%", "70%"],
            label: {
              formatter: "{a}: {c}",
            },
            data: [
              { value: p1Value, itemStyle: { color: "#6d28d9" } },
              { value: p2Value, itemStyle: { color: "#166534" } },
            ],
            itemStyle: {
              borderColor: "#3f3f46",
            },
          },
        ],
      };

      doughnutChartInstanceRef.current.setOption(option);

      const handleResize = () => doughnutChartInstanceRef.current.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        doughnutChartInstanceRef.current &&
          doughnutChartInstanceRef.current.dispose();
      };
    }, []);

    return (
      <div
        ref={doughnutChartRef}
        style={{ width: "100%", height: "400px" }}
        className="mx-auto"
      />
    );
  };

  return <Col span={12}>{doughnutChart()}</Col>;
}
