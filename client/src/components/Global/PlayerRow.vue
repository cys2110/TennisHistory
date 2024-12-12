<script setup lang="ts">
import type { Player } from '@/utils/types';
import { getParams } from '@/utils/getParams';
import { useImages } from '@/utils/useImages';

const { headshot } = useImages()
const { getPlayerParams } = getParams()

const props = defineProps<{
  player: Pick<Player, 'country' | 'full_name' | 'id'>
}>()
const { country, full_name, id } = props.player
</script>

<template>
  <div class="grid grid-flow-col auto-cols-max gap-x-3 items-center">
    <div>
      <GetFlag :country="country.id" />
    </div>
    <div>
      <Avatar style="border: 1px solid var(--p-zinc-400)" shape="circle" :image="headshot(id)" />
    </div>
    <div>
      <router-link class="hover-link" :to="{ name: 'player', params: getPlayerParams(player as Player) }">
        {{ full_name }}
      </router-link>
    </div>
  </div>
</template>