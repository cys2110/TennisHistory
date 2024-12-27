<script setup>
definePageMeta({ name: 'player', layout: 'player-layout' })
const showMessage = ref('')
</script>

<template>
    <div>
        <player-overview @update:show-message="showMessage = $event" />
        <!--TODO: Add major results table-->
        <error-message v-if="showMessage === 'pending' || showMessage === 'error'" :status="showMessage"
            error-icon="material-symbols:person-off-outline-rounded">
            <template #loading-message>Player details are currently being fetched</template>
            <template #error-message>No player information available</template>
        </error-message>
    </div>
</template>