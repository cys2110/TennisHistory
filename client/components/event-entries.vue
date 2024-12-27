<script setup>
const emits = defineEmits(['update:showMessage'])
const route = useRoute()
const eid = ref(route.params.eid)
const checked = ref(false)

// API call
const { data: entries, status, error } = await useFetch('/api/getEventEntries', {
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
</script>

<template>
    <Fieldset v-if="entries" id="entries" legend="Entries" class="my-10 px-10 w-full">
        <div class="w-full flex justify-end mb-3">
            <toggle-button v-model="checked" size="small">
                <template #icon>
                    <Icon :name="checked ? 'ph:table-duotone' : 'clarity:view-cards-line'" class="text-2xl" />
                </template>
            </toggle-button>
        </div>
        <event-entries-table v-if="!checked" :entries />
        <event-entries-cards v-else :entries />
    </Fieldset>
</template>