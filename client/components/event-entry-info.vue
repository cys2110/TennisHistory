<script setup>
import { breakpointsTailwind } from '@vueuse/core';
import { useChangeCase } from '@vueuse/integrations';

const emits = defineEmits(['update:showMessage'])
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const eid = ref(route.params.eid)
const visible = ref(false)
const mediumScreenUp = breakpoints.greaterOrEqual('md')

// API call
const { data, status, error } = await useFetch('/api/getEventEntryInfo', {
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
    <Fieldset v-if="data" id="entry-info" legend="Entry Information" class="my-10 px-10 w-full">
        <div v-if="mediumScreenUp" class="w-full flex justify-end mb-3">
            <toggle-button v-model="visible" size="small">
                <template #icon>
                    <Icon :name="visible ? 'material-symbols:playlist-add-rounded' : 'icon-park-twotone:tree-diagram'"
                        class="text-2xl" />
                </template>
            </toggle-button>
            <Dialog v-model:visible="visible" modal header="Entry Information" class="w-3/4">
                <event-entry-info-chart :data />
            </Dialog>
        </div>
        <Accordion :value="[' 0']" multiple class="w-full">
            <AccordionPanel v-for="(type, index) in data" :key="type.label" :value="useToString(index).value">
                <AccordionHeader>{{ type.label }}</AccordionHeader>
                <AccordionContent>
                    <div v-for="player in type.content" :key="player.id" class="flex gap-3 items-center w-full">
                        <div>
                            <Icon v-if="getCountryCode(player.country)"
                                :name="`flag:${getCountryCode(player.country).toLowerCase()}-4x3`" class="text-base" />
                            <component v-else :is="`Icons${player.country}`" />
                        </div>
                        <div>
                            <Avatar class="my-1"
                                :image="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
                                shape="circle" size="xsmall" />
                        </div>
                        <div class="col-span-2">
                            <NuxtLink class="hover-link"
                                :to="{ name: 'player', params: { pid: player.id, pname: useChangeCase(player.name, 'snakeCase').value } }">
                                {{ player.name }}</NuxtLink>
                        </div>
                        <div class="text-right ml-auto">{{ player.rank?.low ?? player.reason }}</div>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </Fieldset>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > button > span) {
    @apply font-bold text-base text-zinc-400;
}
</style>