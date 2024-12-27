<script setup>
import { useChangeCase } from '@vueuse/integrations';
const props = defineProps(['match'])

const p1ParamName = computed(() => {
    if (props.match.p1_name) {
        return useChangeCase(props.match.p1_name, 'snakeCase').value
    }
    return null
})
const p2ParamName = computed(() => {
    if (props.match.p2_name) {
        return useChangeCase(props.match.p2_name, 'snakeCase').value
    }
    return null
})
</script>

<template>
    <card class="pt-3 px-5 text-xs my-1">
        <template #content>
            <div class="grid grid-cols-9 gap-y-2">
                <div>
                    <Icon v-if="match.p1_name && getCountryCode(match.p1_country)"
                        :name="`flag:${getCountryCode(match.p1_country).toLowerCase()}-4x3`" class="text-base" />
                    <component v-else-if="match.p2_name" :is="`Icons${match.p1_country}`" />
                </div>
                <div>
                    <Avatar v-if="match.p1_name"
                        :image="`https://www.atptour.com/-/media/alias/player-headshot/${match.p1_id}`" size="small"
                        shape="circle" />
                </div>
                <div class="col-span-3 flex items-center">
                    <NuxtLink v-if="match.p1_name" class="hover-link"
                        :to="{ name: 'player', params: { pname: p1ParamName, pid: match.p1_id } }">
                        {{ match.p1_name }}
                    </NuxtLink>
                    <template v-else>{{ match.incomplete === 'B' ? 'BYE' : 'PLAYER 1' }}</template>
                </div>
                <div>
                    <small v-if="match.p1_seed || match.p1_status" class="text-xs flex items-center">({{ match.p1_seed
                        }}{{
                            match.p1_status }})</small>
                </div>
                <div class="flex items-center justify-center">
                    <Icon v-if="match.winner === match.p1_id" name="ic:twotone-check-circle" class="text-green-600" />
                    <u-badge v-else-if="match.p1_incomplete" class="bg-red-800" :ui="{ rounded: 'rounded' }">{{
                        `${match.p1_incomplete}.` }}</u-badge>
                </div>
                <div class="col-span-2 flex items-center justify-center">
                    <span v-if="match.p1s1">{{ match.p1s1 }}<sup v-if="match.p1t1">{{ match.p1t1 }}</sup></span>
                    <span v-if="match.p1s2">{{ match.p1s2 }}<sup v-if="match.p1t2">{{ match.p1t2 }}</sup></span>
                    <span v-if="match.p1s3">{{ match.p1s3 }}<sup v-if="match.p1t3">{{ match.p1t3 }}</sup></span>
                    <span v-if="match.p1s4">{{ match.p1s4 }}<sup v-if="match.p1t4">{{ match.p1t4 }}</sup></span>
                    <span v-if="match.p1s5">{{ match.p1s5 }}<sup v-if="match.p1t5">{{ match.p1t5 }}</sup></span>
                </div>
                <div>
                    <Icon v-if="match.p2_name && getCountryCode(match.p2_country)"
                        :name="`flag:${getCountryCode(match.p2_country).toLowerCase()}-4x3`" class="text-base" />
                    <component v-else-if="match.p2_name" :is="`Icons${match.p2_country}`" />
                </div>
                <div>
                    <Avatar v-if="match.p2_name"
                        :image="`https://www.atptour.com/-/media/alias/player-headshot/${match.p2_id}`" size="small"
                        shape="circle" />
                </div>
                <div class="col-span-3 flex items-center">
                    <NuxtLink v-if="match.p2_name" class="hover-link"
                        :to="{ name: 'player', params: { pname: p2ParamName, pid: match.p2_id } }">
                        {{ match.p2_name }}
                    </NuxtLink>
                    <template v-else>{{ match.incomplete === 'B' ? 'BYE' : 'PLAYER 2' }}</template>
                </div>
                <div>
                    <small v-if="match.p2_seed || match.p2_status" class="text-xs flex items-center">({{ match.p2_seed
                        }}{{
                            match.p2_status }})</small>
                </div>
                <div class="flex items-center justify-center">
                    <Icon v-if="match.winner === match.p2_id" name="ic:twotone-check-circle" class="text-green-600" />
                    <u-badge v-else-if="match.p2_incomplete" class="bg-red-800" :ui="{ rounded: 'rounded' }">{{
                        `${match.p2_incomplete}.` }}</u-badge>
                </div>
                <div class="col-span-2 flex items-center justify-center">
                    <span v-if="match.p2s1">{{ match.p2s1 }}<sup v-if="match.p2t1">{{ match.p2t1 }}</sup></span>
                    <span v-if="match.p2s2">{{ match.p2s2 }}<sup v-if="match.p2t2">{{ match.p2t2 }}</sup></span>
                    <span v-if="match.p2s3">{{ match.p2s3 }}<sup v-if="match.p2t3">{{ match.p2t3 }}</sup></span>
                    <span v-if="match.p2s4">{{ match.p2s4 }}<sup v-if="match.p2_4">{{ match.p2t4 }}</sup></span>
                    <span v-if="match.p2s5">{{ match.p2s5 }}<sup v-if="match.p2t5">{{ match.p2t5 }}</sup></span>

                </div>
            </div>
        </template>
        <template #footer>
            <div class=" flex justify-evenly">
                <u-button variant="outline" size="sm" icon="i-material-symbols-query-stats-rounded"
                    :to="{ name: 'match', params: { mid: match.mid } }" :ui="{ rounded: 'rounded-full' }"
                    :disabled="!!match.incomplete" label="Stats" />
                <u-button v-if="!match.p1_name || !match.p2_name" variant="outline" size="sm"
                    icon="i-material-symbols-swords-outline-rounded" label="H2H" :ui="{ rounded: 'rounded-full' }"
                    disabled />
                <u-button v-else variant="outline" size="sm" icon="i-material-symbols-swords-outline-rounded"
                    :ui="{ rounded: 'rounded-full' }"
                    :to="`/h2h/${p1ParamName}-v-${p2ParamName}/${match.p1_id}-${match.p2_id}`" label="H2H" />
            </div>
        </template>
    </card>
</template>