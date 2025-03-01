<script setup lang="ts">
const route = useRoute()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
const formatName = useFormatName()

const { data: event } = await useFetch<{ name: string }>("/api/tournamentName", { query: { id: eid } })

const tournamentName = computed(() => event.value?.name ?? name.value)
formatName.name.value = tournamentName.value

const eventButtons = eVENTPAGES.map(page => ({
  label: page.label,
  icon: page.icon,
  to: {
    name: page.name,
    params: { name, tid, eid, year }
  }
}))

const pages = computed(() => {
  const currentPage = eVENTPAGES.find(page => page.name === route.name)
  const filteredPages = eventButtons.filter(page => page.to.name !== route.name)
  return { currentPage, filteredPages }
})

useHead({ title: `${pages.value.currentPage?.label ? `${pages.value.currentPage.label} | ` : ""}${formatName.capitaliseName.value} ${year.value}` })
</script>

<template>
  <u-page>
    <!--@vue-expect-error-->
    <u-page-header
      headline="Events"
      :title="`${formatName.capitaliseName.value} ${year}`"
      :description="pages.currentPage?.label"
      :links="pages.filteredPages ?? eventButtons"
    />
    <u-page-body>
      <slot />
    </u-page-body>
  </u-page>
</template>
