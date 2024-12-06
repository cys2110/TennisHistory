<script setup>
import { onMounted, shallowRef, toRefs } from 'vue';
import Icon from '@ant-design/icons-vue';
import { formattedDates } from '@/utils/functions';
import { CURRENCIES, SURFACES } from '@/utils/variables';

const props = defineProps(['event'])
const { sponsor_name, category, start_date, end_date, surface, currency, pm, tfc, venue, supervisors } = toRefs(props.event)
const selectedFlag = shallowRef(null)

const statistics = [
    { title: 'Prize Money', value: pm.value || '—' },
    { title: 'Total Financial Commitment', value: tfc.value || '—' }
]

const descriptionItems = [
    { label: 'Sponsor name', value: sponsor_name.value ?? '—' },
    { label: 'Category', value: category.value ?? '—' },
    { label: 'Dates', value: formattedDates(start_date.value, end_date.value) },
    { label: 'Surface', value: SURFACES[surface.value.id] ?? '—' }
]

// Import flag icons on mount
onMounted(async () => {
    const countryCode = venue.value.country.id;
    try {
        selectedFlag.value = (
            await import(`@/components/icons/flags`)
        )[countryCode] || null;
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error);
    }
});
</script>

<template>
    <a-row id="details" justify="space-evenly" :gutter="[0, 16]">
        <a-col :xs="24" :sm="11" :md="10" :xl="7" v-for="stat in statistics" :key="stat.title">
            <a-card class="full-card">
                <a-statistic :prefix="CURRENCIES[currency] || ''" :title="stat.title" :value="stat.value"
                    class="text-center" />
            </a-card>
        </a-col>
    </a-row>
    <a-descriptions :colon="false" class="my-10 bg-violet-800 rounded" bordered layout="vertical" size="middle">
        <a-descriptions-item v-for="item in descriptionItems" :key="item.label" :label="item.label" class="bg-black">
            {{ item.value }}
        </a-descriptions-item>
        <a-descriptions-item label="Venue" class="bg-black">
            <div class="flex flex-col justify-center">
                <div>{{ venue?.name ?? '—' }}</div>
                <div v-if="venue" class="flex items-center">
                    {{ venue.city }}
                    <Icon v-if="selectedFlag" :component="selectedFlag" class="ml-2 text-2xl" />
                </div>
            </div>
        </a-descriptions-item>
        <a-descriptions-item :label="supervisors.length === 1 ? 'Supervisor' : 'Supervisors'" class="bg-black">
            <div v-if="supervisors.length > 0" v-for="supervisor in supervisors" :key="supervisor.id">{{
                supervisor.id }}</div>
            <div v-else>—</div>
        </a-descriptions-item>
    </a-descriptions>
</template>