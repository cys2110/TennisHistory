<script setup lang="ts">
useHead({ title: "Merge Nodes - TH Admin" })
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Merge Nodes">
          <template #right>
            <u-button
              label="Refresh"
              @click="reloadNuxtApp()"
            />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <umpires-merge />

        <coaches-merge />
      </template>
    </u-dashboard-panel>
  </div>
</template>
