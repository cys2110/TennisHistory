<script setup lang="ts">
import { encodeName, headshot } from '@/utils/functions'
import type { Player } from '@/utils/types';
import GetFlag from './GetFlag.vue';

const props = defineProps<{
  player: Pick<Player, 'country' | 'full_name' | 'id' | 'last_name'>
  entry?: string
}>()
const { country, full_name, id } = props.player
</script>

<template>
  <div class="grid grid-flow-col auto-cols-max gap-x-3 items-center">
    <div>
      <GetFlag :country="country.id" />
    </div>
    <div>
      <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(id)" />
    </div>
    <div>
      <router-link class="hover-link" :to="{ name: 'player', params: { name: encodeName(full_name), id: id } }">
        {{ full_name }}
      </router-link>
      <small v-if="entry">{{ entry }}</small>
    </div>
  </div>
</template>