<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const route = useRoute()
const toast = useToast()

const { data, status } = await useFetch<EventEntryInfoType[]>("/api/eventEntryInfo", {
  query: { eid: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container v-if="data">
    <div class="flex justify-between items-center">
      <div>Entry Information</div>
      <u-modal>
        <u-button :icon="ICONS.draw" />
        <template #content>
          <event-entry-info-chart :data />
        </template>
      </u-modal>
    </div>
    <!--TODO: skeleton loader-->
    <u-collapsible
      v-for="item in data"
      :key="item.label"
      class="my-2"
    >
      <div class="w-full flex justify-between cursor-pointer">
        <span>{{ item.label }}</span>
        <u-icon :name="ICONS['chevron-down']" />
      </div>

      <template #content>
        <div
          v-for="player in item.content"
          class="flex justify-between"
        >
          <div class="flex gap-1">
            <flag-icon :country="player.country" />
            <player-avatar
              :id="player.id"
              :name="player.name"
            />
            <nuxt-link
              class="hover-link"
              :to="{ name: 'player', params: { name: useChangeCase(player.name, 'kebabCase').value, id: player.id } }"
            >
              {{ player.name }}
            </nuxt-link>
          </div>
          <div v-if="player.rank || player.reason">{{ player.rank ?? player.reason }}</div>
        </div>
      </template>
    </u-collapsible>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
  >
    No prize money or points awarded
  </error-message>
</template>
