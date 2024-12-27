<script setup>
definePageMeta({ name: 'event', layout: 'event-layout' })
const showMessage = ref('success')
const menuItems = ref([
    { route: '#awards', label: 'Awards' },
    { route: '#seeds', label: 'Seeds' },
    { route: '#entry-info', label: 'Entry Information' },
    { route: '#entries', label: 'Entries' },
])
</script>

<template>
    <div>
        <div>
            <ClientOnly>
                <Teleport to="#event-toolbar-start">
                    <div class="flex">
                        <Button v-for="item in menuItems" :key="item.label" as="router-link" variant="text" size="small"
                            :label="item.label" :to="item.route" />
                    </div>
                </Teleport>
                <event-overview @update:show-message="showMessage = $event" />
                <div class="flex flex-col md:flex-row gap-5 justify-evenly">
                    <div>
                        <event-awards @update:show-message="showMessage = $event" />
                        <event-entry-info @update:show-message="showMessage = $event" />
                    </div>
                    <div>
                        <event-seeds @update:show-message="showMessage = $event" />
                    </div>
                </div>
                <event-entries @update:show-message="showMessage = $event" />
            </ClientOnly>
        </div>
        <div v-if="showMessage === 'pending' || showMessage === 'error'">
            <Message size="large" :severity="showMessage === 'pending' ? 'info' : 'warn'" variant="outlined"
                class="mt-5">
                <template #icon>
                    <Icon
                        :name="showMessage === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:error-circle-rounded-outline-sharp'"
                        class="text-2xl" />
                </template>
                <span v-if="showMessage === 'pending'" class="ml-2">The events details are currently being
                    fetched</span>
                <span v-else class="ml-2">No event information available</span>
            </Message>
        </div>
    </div>
</template>