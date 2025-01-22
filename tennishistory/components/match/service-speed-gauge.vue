<script setup lang="ts">
const props = defineProps<{
    stat: {
        name: string;
        p1: {
            low: number;
            high: number;
        };
        p2: {
            low: number;
            high: number;
        };
    };
    p1_name: string;
    p2_name: string;
    p1_id: string;
    p2_id: string;
}>();

const kmhData = [
    {
        value: props.stat.p1.low,
        name: props.stat.name,
        title: { offsetCenter: ["0%", "100%"], color: "#a1a1aa" },
        detail: {
            offsetCenter: ["-100%", "100%"],
            color: "#6d28d9",
            borderColor: "#6d28d9"
        },
        itemStyle: { color: "#6d28d9" }
    },
    {
        value: props.stat.p2.low,
        itemStyle: { color: "#166534" },
        detail: {
            offsetCenter: ["100%", "100%"],
            color: "#166534",
            borderColor: "#166534"
        }
    }
];

const option = ref({
    darkMode: true,
    backgroundColor: "transparent",
    series: [
        {
            type: "gauge",
            data: kmhData,
            max: 300,
            axisLine: { show: false },
            axisLabel: {
                distance: 25,
                color: "#a1a1aa"
            },
            title: { fontSize: 14 },
            detail: {
                width: 60,
                height: 40,
                fontSize: 14,
                lineHeight: 15,
                color: "inherit",
                borderColor: "inherit",
                borderRadius: 10,
                borderWidth: 1,
                formatter: function (value: any) {
                    const milesPerHour = (value / 1.609344).toFixed(0);
                    return `${value} km/h\n${milesPerHour} mph`;
                }
            }
        }
    ]
});
</script>

<template>
    <v-chart
        class="!h-[400px] !w-1/3"
        :option="option"
        :autoresize="true"
    />
</template>
