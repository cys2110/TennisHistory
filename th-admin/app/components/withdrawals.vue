<script setup lang="ts">
const { query } = useRoute()
const addWithdrawals = ref<number[]>([])

const { data: entries, status } = await useFetch("/api/get-withdrawals", {
  query: { id: query.id },
  default: () => []
})

function handleAddWithdrawal() {
  addWithdrawals.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <u-page-list class="*:m-2">
    <u-button
      label="Add Withdrawal"
      @click="handleAddWithdrawal"
    />
    <client-only>
      <add-withdrawal
        v-for="n in addWithdrawals"
        :key="`add-withdrawal-${n}`"
      />
    </client-only>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-withdrawal
      v-for="(entry, index) in entries"
      :key="`withdrawal-${index}`"
      :entry
    />
  </u-page-list>
</template>
