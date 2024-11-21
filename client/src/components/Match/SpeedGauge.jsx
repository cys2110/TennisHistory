import { useEffect, useRef } from "react";
import { Col } from "antd";
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

export default function SpeedGauge({ stat }) {
  echarts.use([GaugeChart, CanvasRenderer]);
  const gaugeData = [
    {
      value: stat.p1,
      name: stat.name,
      title: { offsetCenter: ["0%", "100%"], color: "#a1a1aa" },
      detail: {
        offsetCenter: ["-75%", "100%"],
        color: "#6d28d9",
        borderColor: "#6d28d9",
      },
      itemStyle: { color: "#6d28d9" },
      mph: (stat.p1 / 1.609344).toFixed(0),
    },
    {
      value: stat.p2,
      itemStyle: { color: "#166534" },
      detail: {
        offsetCenter: ["75%", "100%"],
        color: "#166534",
        borderColor: "#166534",
      },
      mph: (stat.p2 / 1.609344).toFixed(0),
    },
  ];

  const serviceGauge = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
      chartInstanceRef.current = echarts.init(chartRef.current);

      const option = {
        darkMode: true,
        tooltip: {
          formatter: function (params) {
            return `${params.data.value} km/h<br/>${params.data.mph} mph`;
          },
          backgroundColor: "transparent",
          textStyle: { color: "#a1a1aa" },
        },
        series: [
          {
            type: "gauge",
            data: gaugeData,
            max: 300,
            axisLine: {
              lineStyle: {
                width: 20,
                color: [[1, "rgba(0, 0, 0, 0.5)"]],
              },
            },
            axisLabel: {
              distance: 30,
              color: "#a1a1aa",
            },
            title: {
              fontSize: 14,
            },
            detail: {
              width: 60,
              height: 40,
              fontSize: 14,
              lineHeight: 15,
              color: "inherit",
              borderColor: "inherit",
              borderRadius: 10,
              borderWidth: 1,
              formatter: function (value) {
                const milesPerHour = (value / 1.609344).toFixed(0);
                return `${value} km/h\n${milesPerHour} mph`;
              },
            },
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

  return <Col span={12}>{serviceGauge()}</Col>;
}
