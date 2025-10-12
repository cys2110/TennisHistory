<script setup>
useHead({ title: "Umpires - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
const { data: umpires, status } = await useFetch("/api/umpires/get", { default: () => [] })

const toc = computed(() => [
  {
    id: "umpires",
    label: "Umpires",
    items: umpires.value.map(umpire => ({
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
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <create-person type="Umpire" />
            <u-popover>
              <u-button
                :icon="icons.menu"
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
        <u-page-list class="*:my-1">
          <edit-person
            v-if="umpires.length"
            v-for="umpire in umpires"
            :key="umpire.id"
            :person="umpire"
            type="Umpire"
          />

          <loading v-else-if="status === 'pending'" />

          <reload
            v-else
            message="umpires"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
