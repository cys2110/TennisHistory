<script setup>
definePageMeta({ name: 'player', layout: 'player-layout' })
const showMessage = ref('success')
</script>

<template>
    <div>
        <player-overview @update:show-message="showMessage = $event" />
        <!--TODO: Add major results table-->
        <div v-if="showMessage === 'pending' || showMessage === 'error'">
            <Message size="large" :severity="showMessage === 'pending' ? 'info' : 'warn'" variant="outlined"
                class="mt-5">
                <template #icon>
                    <Icon
                        :name="showMessage === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:person-off-outline-rounded'"
                        class="text-2xl" />
                </template>
                <span v-if="showMessage === 'pending'" class="ml-2">The player details are currently being
                    fetched</span>
                <span v-else class="ml-2">No player information available</span>
            </Message>
        </div>
    </div>
</template>