<script setup lang="ts">
const toast = useToast()

const { data, status, refresh } = await useFetch<any>("/api/umpires/get-merge", {
  default: () => []
})

const handleMerge = async (id1: number, id2: number) => {
  try {
    await $fetch("/api/merge-nodes", {
      query: { type: "Umpire", id1: id1, id2: id2 }
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
    <div class="font-semibold">Umpires</div>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <u-page-list
      v-else-if="data.length"
      class="*:m-2"
    >
      <div
        v-for="(result, index) in data"
        :key="`umpire-${index}`"
        class="grid grid-cols-3 w-2xl"
      >
        <div>{{ result.umpire1 }}</div>
        <div>{{ result.umpire2 }}</div>
        <div>
          <u-button
            label="Merge"
            @click="handleMerge(result.umpire1, result.umpire2)"
          />
        </div>
      </div>
    </u-page-list>
    <div v-else>
      <div>No umpires to merge</div>
      <u-button
        label="Refresh"
        @click="refresh()"
      />
    </div>
  </div>
</template>
