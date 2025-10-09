<script setup lang="ts">
useHead({ title: "Umpires - TH Admin" })
const { data: umpires, status } = await useFetch<any>("/api/umpires/get", { default: () => [] })

const toc = computed(() => [
  {
    id: "umpires",
    label: "Umpires",
    items: umpires.value.map((umpire: any) => ({
      label: umpire.id,
      to: `#${umpire.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Umpires">
          <template #right>
            <create-person type="Umpire" />
            <u-popover>
              <u-button
                icon="lucide:table-of-contents"
                size="sm"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search umpires"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <div v-if="['idle', 'loading'].includes(status)">Loading...</div>

        <div v-else-if="status === 'error'">
          Error loading umpires.
          <u-button
            @click="() => reloadNuxtApp()"
            label="Refresh"
            icon="lucide:refresh-ccw"
          />
        </div>

        <u-page-list class="*:my-2">
          <edit-person
            v-for="umpire in umpires"
            :key="umpire.id"
            :person="umpire"
            type="Umpire"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
