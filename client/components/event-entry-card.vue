<script setup>
import { useChangeCase } from '@vueuse/integrations';
const props = defineProps(['entry'])

const statusColours = {
    LL: 'bg-red-300 text-red-800',
    Alt: 'bg-amber-300 text-amber-800',
    Q: 'bg-emerald-300 text-green-800',
    WC: 'bg-blue-300 text-blue-800',
    SE: 'bg-fuchsia-300 text-fuchsia-800',
    PR: 'bg-teal-300 text-teal-800',
}
</script>

<template>
    <card class="full-card">
        <template #header>
            <div class="flex flex-col justify-center items-center p-3">
                <div class="self-end">
                    <chip>
                        <span>Rank</span>
                        <span
                            class="bg-violet-800 text-zinc-300 rounded-full p-1 w-7 h-7 flex items-center justify-center">{{
                                entry.rank.low
                            }}</span>
                    </chip>
                </div>
                <Avatar :image="`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`" size="xlarge"
                    shape="circle" />
            </div>
        </template>
        <template #title>
            <div class="flex justify-around items-center text-sm">
                <div>
                    <NuxtLink class="hover-link"
                        :to="{ name: 'player', params: { pid: entry.id, pname: useChangeCase(entry.name, 'snakeCase').value } }">
                        {{ entry.name }}</NuxtLink>
                </div>
                <div>
                    <Icon v-if="getCountryCode(entry.country)"
                        :name="`flag:${getCountryCode(entry.country).toLowerCase()}-4x3`" class="text-base" />
                    <component v-else :is="`Icons${entry.country}`" />
                </div>
            </div>
        </template>
        <template #footer>
            <tag v-if="entry.seed" class="bg-green-800 text-zinc-300"><span class="font-normal">Seed:</span> {{
                entry.seed.low }}
            </tag>
            <tag v-if="entry.status" :class="statusColours[entry.status]"><span class="font-normal">Status:</span> {{
                STATUS_INFO[entry.status] }}</tag>
        </template>
    </card>
</template>