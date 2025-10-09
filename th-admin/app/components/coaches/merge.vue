<script setup lang="ts">
const toast = useToast()

const { data, status, refresh } = await useFetch<any>("/api/coaches/get-merge", {
  default: () => []
})

const handleMerge = async (id1: number, id2: number) => {
  try {
    await $fetch("/api/merge-nodes", {
      query: { type: "Coach", id1: id1, id2: id2 }
    })
    toast.add({
      title: `Nodes merged`,
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error merging nodes`,
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <div>
    <div class="font-semibold">Coaches</div>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <u-page-list
      v-else-if="data.length"
      class="*:m-2"
    >
      <div
        v-for="(result, index) in data"
        :key="`coach-${index}`"
        class="grid grid-cols-4 w-2xl"
      >
        <div>{{ result.coach }}</div>
        <div>{{ result.player }}</div>
        <div>{{ result.player_name }}</div>
        <div>
          <u-button
            label="Merge"
            @click="handleMerge(result.coach, result.player)"
          />
        </div>
      </div>
    </u-page-list>
    <div v-else>
      <div>No coaches to merge</div>
      <u-button
        label="Refresh"
        @click="refresh()"
      />
    </div>
  </div>
</template>
