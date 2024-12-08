<script setup lang="ts">
import GetFlag from '../Global/GetFlag.vue';
import { encodeName, headshot } from '@/utils/functions'
import { STATUS_INFO } from '@/utils/variables'
import { StatusInfo, type Entry } from '@/utils/types'

const props = defineProps<{
  entry: Pick<Entry, 'player' | 'rank' | 'seed' | 'status'>
}>()
const { player, seed, status, rank } = props.entry
const { id, full_name, country } = player

const statusColours = {
  [StatusInfo.LL]: '!bg-red-300',
  [StatusInfo.Alt]: '!bg-amber-300',
  [StatusInfo.Q]: '!bg-emerald-300',
  [StatusInfo.WC]: '!bg-blue-300',
  [StatusInfo.SE]: '!bg-fuchsia-300',
  [StatusInfo.PR]: '!bg-teal-300',
}
</script>

<template>
  <Card class="full-card text-center min-h-content">
    <template #header>
      <div class="flex flex-col justify-center items-center p-3">
        <div class="self-end">
          <Badge v-if="rank" :value="rank" size="large" unstyled
            pt:root="bg-cyan-700 p-2 rounded-full text-sm flex items-center justify-center w-8 h-8" />
        </div>
        <Avatar :image="headshot(id)" size="xlarge" shape="circle" style="border: 1px solid var(--p-zinc-400)" />
      </div>
    </template>
    <template #title>
      <router-link class="hover-link  text-wrap"
        :to="{ name: 'player', params: { name: encodeName(full_name), id: id } }">
        {{ full_name }}
      </router-link>
    </template>
    <template #subtitle>
      <div class="flex items-center justify-center">
        <div>
          <GetFlag :country="country.id" />
        </div>
        <div class="ml-2">{{ country.name }}</div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-col">
        <Tag v-if="seed" class="!bg-green-800 !font-normal">Seed: {{ seed }}</Tag>
        <Tag v-if="status" class="!font-normal !text-zinc-800" :class="statusColours[status]">Status: {{
          STATUS_INFO[status] }}</Tag>
      </div>
    </template>
  </Card>
</template>