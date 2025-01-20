<script setup lang="ts">
defineProps<{ events: EventCardType[] }>();
</script>

<template>
	<u-page-grid>
		<event-card
			v-for="event in events"
			:key="event.eid"
			:event
		/>
	</u-page-grid>
</template>
