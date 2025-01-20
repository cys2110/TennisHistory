<script setup lang="ts">
const route = useRoute();
const checked = ref(false);

const { data: rounds, status, error } = await useFetch<EventAwardsType[]>("/api/getEventAwards", { query: { eid: route.params.eid } });
</script>

<template>
	<u-container></u-container>
</template>
