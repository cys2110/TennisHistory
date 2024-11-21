import { useEffect, useRef } from "react";
import { Col } from "antd";
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent } from "echarts/components";
import { percentage } from "../../utils/utils";

export default function ComparisonChart({ stat }) {
  echarts.use([TooltipComponent, GaugeChart, LabelLayout, CanvasRenderer]);

  const comparisonChart = () => {
    const comparisonChartRef = useRef(null);
    const comparisonChartInstanceRef = useRef(null);
    const gaugeData = [
      {
        name: stat.name,
        value: percentage(stat.p1Value, stat.p1Max).toFixed(0),
        max: stat.p1Max,
        actualValue: stat.p1Value,
        title: { offsetCenter: ["0%", "0%"], color: "#a1a1aa" },
        detail: { offsetCenter: ["0%", "-20%"] },
        itemStyle: { color: "#6d28d9" },
      },
      {
        value: percentage(stat.p2Value, stat.p2Max).toFixed(0),
        max: stat.p2Max,
        actualValue: stat.p2Value,
        title: { show: false },
        detail: { offsetCenter: ["0%", "20%"] },
        itemStyle: { color: "#166534" },
      },
    ];

    useEffect(() => {
      comparisonChartInstanceRef.current = echarts.init(
        comparisonChartRef.current
      );

      const option = {
        darkMode: true,
        tooltip: {
          formatter: function (params) {
            return `${params.data.actualValue} / ${params.data.max}`;
          },
          backgroundColor: "transparent",
          textStyle: { color: "#a1a1aa" },
        },
        series: [
          {
            type: "gauge",
            data: gaugeData,
            pointer: { show: false },
            startAngle: 90,
            endAngle: -270,
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#464646",
              },
            },
            axisLine: {
              lineStyle: {
                width: 30,
                color: [[1, "rgba(0, 0, 0, 0.5)"]],
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            title: {
              fontSize: 14,
            },
            detail: {
              width: 50,
              height: 14,
              fontSize: 14,
              color: "inherit",
              borderColor: "inherit",
              borderRadius: 20,
              borderWidth: 1,
              formatter: "{value}%",
            },
          },
        ],
      };

      comparisonChartInstanceRef.current.setOption(option);

      const handleResize = () => comparisonChartInstanceRef.current.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        comparisonChartInstanceRef.current &&
          comparisonChartInstanceRef.current.dispose();
      };
    }, []);

    return (
      <div
        ref={comparisonChartRef}
        style={{ width: "100%", height: "400px" }}
        className="mx-auto"
      />
    );
  };

  return <Col span={12}>{comparisonChart()}</Col>;
}
