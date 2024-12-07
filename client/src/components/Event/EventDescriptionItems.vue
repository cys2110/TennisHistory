<script setup lang="tsx">
import { onMounted, shallowRef } from 'vue'
import Icon from '@ant-design/icons-vue'
import { formattedDates } from '@/utils/functions';
import type { EventDetailsType } from '@/utils/types';
import { SURFACES } from '@/utils/variables';

const props = defineProps<{
    event: EventDetailsType
}>()
const {
    sponsor_name,
    category,
    start_date,
    end_date,
    surface,
    venue,
    supervisors,
} = props.event

// Import flag icons on mount
const selectedFlag = shallowRef(undefined)
onMounted(async () => {
    const countryCode = venue.country.id
    try {
        const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
        selectedFlag.value = flags[countryCode] || null
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error)
    }
})

const descriptionItems = [
    { label: 'Sponsor name', value: () => sponsor_name ?? '—' },
    { label: 'Category', value: () => category ?? '—' },
    { label: 'Dates', value: () => formattedDates(start_date, end_date) },
    { label: 'Surface', value: () => SURFACES[surface.id] ?? '—' },
    {
        label: 'Venue', value: () => <div class="flex flex-col justify-center">
            <div>{venue?.name ?? '—'}</div>
            {venue && <div class="flex items-center">{venue.city}
                {selectedFlag && <Icon component={selectedFlag.value} class="ml-2 text-2xl" />}
            </div>}
        </div>
    },
    {
        label: supervisors.length === 1 ? 'Supervisor' : 'Supervisors', value: () => supervisors.length > 0 ? supervisors.map(supervisor => supervisor.id) : '—'
    }
]
</script>

<template>
    <a-descriptions :colon="false" class="my-10 bg-violet-800 rounded" bordered layout="vertical" size="middle">
        <a-descriptions-item v-for="item in descriptionItems" :key="item.label" :label="item.label" class="bg-black">
            <component :is="item.value" />
        </a-descriptions-item>
    </a-descriptions>
</template>