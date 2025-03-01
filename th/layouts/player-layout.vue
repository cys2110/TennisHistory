<script setup lang="ts">
const formatName = useFormatName()
const name = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const route = useRoute()

// API call
const { data: player } = await useFetch<{ name: string; start: string; end: string }>("/api/playerName", { query: { id } })

const activeYears = computed(() => {
  if (player.value) {
    return Array.from({ length: Number(player.value.end) - Number(player.value.start) + 1 }, (_, index) => (Number(player.value?.start) + index).toString())
  }
  return []
})
const yearsArray = useState<string[]>("yearsArray", () => [])
const lastYear = useState<string>("lastYear", () => new Date().getFullYear().toString())

watch(
  () => player.value,
  newValue => {
    yearsArray.value = activeYears.value
    lastYear.value = newValue?.end ?? new Date().getFullYear().toString()
  },
  { immediate: true }
)

const playerButtons = pLAYERPAGES.map(page => ({
  label: page.label,
  icon: page.icon,
  to: {
    name: page.name,
    params: { name, id }
  },
  color: "secondary",
  variant: "subtle"
}))

const playerName = computed(() => player.value?.name ?? name.value)
formatName.name.value = playerName.value

const pages = computed(() => {
  const currentPage = pLAYERPAGES.find(page => page.name === route.name)
  const filteredPages = playerButtons.filter(page => page.to.name !== route.name)
  return { currentPage, filteredPages }
})

useHead({ title: `${pages.value.currentPage?.label ? `${pages.value.currentPage.label} | ` : ""}${formatName.capitaliseName.value}` })
</script>

<template>
  <u-page>
    <!--@vue-expect-error-->
    <u-page-header
      headline="Players"
      :title="formatName.capitaliseName.value"
      :description="pages.currentPage?.label"
      :links="pages.filteredPages ?? playerButtons"
    />
    <u-page-body>
      <slot />
    </u-page-body>
  </u-page>
</template>
