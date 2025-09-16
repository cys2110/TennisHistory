<script setup lang="ts">
definePageMeta({ name: "event" })
const {
  params: { id }
} = useRoute("event")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

const toc = [
  { label: "Details", to: "#details", icon: icons.overview },
  { label: "Awards", to: "#awards", icon: icons.awards },
  { label: "Seeds", to: "#seeds", icon: icons.seeds },
  { label: "Entry Information", to: "#entry-info", icon: uIcons.info },
  { label: "Entries", to: "#entries", icon: icons.player }
]
</script>

<template>
  <event-wrapper>
    <client-only>
      <teleport to="#page-right">
        <u-page-links
          v-if="!COUNTRY_DRAWS.includes(id as string)"
          :links="toc"
          class="my-5"
        />
      </teleport>
    </client-only>

    <event-country v-if="COUNTRY_DRAWS.includes(id as string)" />

    <event-overview v-else />
  </event-wrapper>
</template>
