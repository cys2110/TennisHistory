<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['match'])
const { date, start, end, surface, court, duration, umpire, p1_name, p1_id, p2_name, p2_id, p1_seed, p1_status, p2_seed, p2_status, p1_rank, p2_rank, winner, p1_s1, p1_s2, p1_s3, p1_s4, p1_s5, p1_t1, p1_t2, p1_t3, p1_t4, p1_t5, p1_incomplete, p2_s1, p2_s2, p2_s3, p2_s4, p2_s5, p2_t1, p2_t2, p2_t3, p2_t4, p2_t5, p2_incomplete, p1_country, p2_country } = props.match

const fieldsetItems = [
    { label: 'Date(s)', value: date ?? `${start}-${end}` },
    { label: 'Surface', value: surface ?? '—' },
    { label: 'Court', value: court ?? '—' },
    { label: 'Duration', value: duration ? formatTime(duration) : '—' },
    { label: 'Umpire', value: umpire ?? '—' }
]

const p1NameParam = useChangeCase(p1_name, 'snakeCase')
const p2NameParam = useChangeCase(p2_name, 'snakeCase')

const relatedPagesButtons = [
    { label: 'H2H', to: `/h2h/${p1NameParam.value}-v-${p2NameParam.value}/${p1_id}-${p2_id}` },
    { label: p1_name, to: `/players/${p1NameParam.value}/${p1_id}` },
    { label: p2_name, to: `/players/${p2NameParam.value}/${p2_id}` }
]
</script>

<template>
    <tab-panel value="0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
            <Fieldset v-for="item in fieldsetItems" :key="item.label" :legend="item.label">{{ item.value }}</Fieldset>
            <Fieldset legend="Related pages" class="flex gap-2">
                <Button v-for="button in relatedPagesButtons" :key="button.label" as="router-link" :label="button.label"
                    size="small" variant="outlined" rounded raised :to="button.to" />
            </Fieldset>
        </div>
        <card class="mt-5 w-2/3 mx-auto border-emerald-600 shadow-emerald-400 hover:shadow-emerald-400">
            <template #content>
                <div class="grid grid-cols-8 gap-3 items-center">
                    <div>
                        <Icon v-if="getCountryCode(p1_country)"
                            :name="`flag:${getCountryCode(p1_country).toLowerCase()}-4x3`" class="text-base" />
                        <component v-else :is="`Icons${p1_country}`" />
                    </div>
                    <div>
                        <Avatar shape="circle"
                            :image="`https://www.atptour.com/-/media/alias/player-headshot/${p1_id}`" />
                    </div>
                    <div class="col-span-2">
                        {{ p1_name }}
                        <small v-if="p1_seed || p1_status">({{ p1_seed }}{{ p1_status }})</small>
                    </div>
                    <div>({{ p1_rank }})</div>
                    <div>
                        <Icon v-if="winner === p1_id" name="ic:twotone-check-circle" class="text-green-600" />
                        <u-badge v-else-if="p1_incomplete" class="bg-red-800" :ui="{ rounded: 'rounded' }">{{
                            `${p1_incomplete}.` }}</u-badge>
                    </div>
                    <div class="col-span-2 flex gap-2 justify-end">
                        <span v-if="p1_s1">{{ p1_s1 }}<sup v-if="p1_t1">{{ p1_t1 }}</sup></span>
                        <span v-if="p1_s2">{{ p1_s2 }}<sup v-if="p1_t2">{{ p1_t2 }}</sup></span>
                        <span v-if="p1_s3">{{ p1_s3 }}<sup v-if="p1_t3">{{ p1_t3 }}</sup></span>
                        <span v-if="p1_s4">{{ p1_s4 }}<sup v-if="p1_t4">{{ p1_t4 }}</sup></span>
                        <span v-if="p1_s5">{{ p1_s5 }}<sup v-if="p1_t5">{{ p1_t5 }}</sup></span>
                    </div>
                    <div>
                        <Icon v-if="getCountryCode(p2_country)"
                            :name="`flag:${getCountryCode(p2_country).toLowerCase()}-4x3`" class="text-base" />
                        <component v-else :is="`Icons${p2_country}`" />
                    </div>
                    <div>
                        <Avatar shape="circle"
                            :image="`https://www.atptour.com/-/media/alias/player-headshot/${p2_id}`" />
                    </div>
                    <div class="col-span-2">
                        {{ p2_name }}
                        <small v-if="p2_seed || p2_status">({{ p2_seed }}{{ p2_status }})</small>
                    </div>
                    <div>({{ p2_rank }})</div>
                    <div>
                        <Icon v-if="winner === p2_id" name="ic:twotone-check-circle" class="text-green-600" />
                        <u-badge v-else-if="p2_incomplete" class="bg-red-800" :ui="{ rounded: 'rounded' }">{{
                            `${p2_incomplete}.` }}</u-badge>
                    </div>
                    <div class="col-span-2 flex gap-2 justify-end">
                        <span v-if="p2_s1">{{ p2_s1 }}<sup v-if="p2_t1">{{ p2_t1 }}</sup></span>
                        <span v-if="p2_s2">{{ p2_s2 }}<sup v-if="p2_t2">{{ p2_t2 }}</sup></span>
                        <span v-if="p2_s3">{{ p2_s3 }}<sup v-if="p2_t3">{{ p2_t3 }}</sup></span>
                        <span v-if="p2_s4">{{ p2_s4 }}<sup v-if="p2_t4">{{ p2_t4 }}</sup></span>
                        <span v-if="p2_s5">{{ p2_s5 }}<sup v-if="p2_t5">{{ p2_t5 }}</sup></span>
                    </div>
                </div>
            </template>
        </card>
    </tab-panel>
</template>