<script setup>
const emits = defineEmits(['update:showMessage'])
const route = useRoute()
const eid = ref(route.params.eid)

// API call
const { data: event, status, error } = await useFetch('/api/getEventDetails', {
    method: 'GET',
    params: { eid: computed(() => eid.value) },
    onResponse({ response }) {
        if (response.status === 204) emits('update:showMessage', 'success')
    },
    onResponseError({ error }) {
        if (error) emits('update:showMessage', 'error')
    }
})

watch(status, (newStatus) => {
    if (newStatus === 'pending') {
        emits('update:showMessage', 'pending')
    } else if (newStatus === 'success') {
        emits('update:showMessage', false)
    } else {
        emits('update:showMessage', 'error')
    }
})

// Get country code for icons
const countryCode = computed(() => {
    if (event) return getCountryCode(event.country)
})
</script>

<template>
    <div v-if="event" id="details" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
        <Fieldset legend="Sponsor name">{{ event.ename ?? '—' }}</Fieldset>
        <Fieldset legend="Category">{{ event.category ?? '—' }}</Fieldset>
        <Fieldset legend="Dates">{{ getLongDates(event.start, event.end) }}
        </Fieldset>
        <Fieldset legend="Surface">{{ event.surface }}</Fieldset>
        <Fieldset legend="Venue">
            <span v-if="event.venue">{{ event.venue }},&nbsp;</span><span>{{ event.city }}</span><span>
                <Icon v-if="countryCode" :name="`flag:${countryCode.value.toLowerCase()}-4x3`" />
                <component v-else :is="`Icons${event.country}`" />
            </span>
        </Fieldset>
        <Fieldset legend="Draw type">{{ event.draw }}</Fieldset>
        <Fieldset :legend="event.supervisor.length === 1 ? 'Supervisor' : 'Supervisors'">
            <div v-if="event.supervisor.length > 0" v-for="id in event.supervisor" :key="id">{{ id }}</div>
        </Fieldset>
        <Fieldset legend="Prize money">
            {{ event.pm ? `${CURRENCIES[event.currency]}${event.pm.low.toLocaleString('en-GB')}` : '—' }}
        </Fieldset>
        <Fieldset legend="Total financial commitment">
            {{ event.tfc ? `${CURRENCIES[event.currency]}${event.tfc.low.toLocaleString('en-GB')}` : '—' }}
        </Fieldset>
    </div>
</template>