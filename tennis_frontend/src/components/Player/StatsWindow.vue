<script setup>
import EditionService from '@/services/EditionService';
import { computed, onMounted, ref } from 'vue';

const props = defineProps(['player'])

const selectedYear = ref('Career')
const selectedSurface = ref('All')
const surfaces = ['All', 'Clay', 'Grass', 'Hard', 'Carpet']
const currentYear = new Date().getFullYear()
const results = ref('')

const years = computed(() => {
    const retirementYear = props.player.retired || currentYear
    const yearArray = Array.from({ length: retirementYear - props.player.turned_pro + 1}, (_, index) => props.player.turned_pro + index)
    return ['Career', ...yearArray]
})

const percent = (value, total) => {
    return Math.round((value / total) * 100)
}

const getStats = () => {
    EditionService.getPlayerStats(props.player.id, selectedYear.value, selectedSurface.value)
        .then(response => results.value = response.data.stats)
        .catch(error => console.log(error))
}

onMounted(() => {
    getStats()
})
</script>

<template>
    <v-sheet class="bg-transparent">
        <div class="d-flex ml-auto w-25">
            <v-select variant="outlined" density="compact" class="w-25" :items="years" v-model="selectedYear" @update:model-value="getStats"/>
            <v-select variant="outlined" density="compact" class="w-25" :items="surfaces" v-model="selectedSurface" @update:model-value="getStats"/>
        </div>
        <v-table class="rounded-xl w-75 mx-auto bg-transparent">
            <thead>
                <tr>
                    <th class="font-weight-bold text-center text-subtitle-1">Serve</th>
                    <th class="font-weight-bold text-center text-subtitle-1">Return</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="d-flex justify-space-between">
                            <div class="text-subtitle-1">Aces</div>
                            <div class="font-weight-bold">{{ results === '' ? 0 : results.aces }}</div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">1st serve return points won</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.ret1_w, results.ret1)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.ret1_w, results.ret1)"/>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex justify-space-between">
                            <div class="text-subtitle-1">Double faults</div>
                            <div class="font-weight-bold">{{ results === '' ? 0 : results.dfs }}</div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">2nd serve return points won</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.ret2_w, results.ret2)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.ret2_w, results.ret2)"/>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">1st serve</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.serve1_in, results.total_serve1)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.serve1_in, results.total_serve1)"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex justify-space-between">
                            <div class="text-subtitle-1">Break point opportunities</div>
                            <div class="font-weight-bold">{{ results === '' ? 0 : results.bp_opps }}</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">1st serve points won</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.serve1_pts_w, results.serve1_pts)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.serve1_pts_w, results.serve1_pts)"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">Break points converted</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.bps_converted, results.bp_opps)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded :height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.bps_converted, results.bp_opps)"/>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">2nd serve points won</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.serve2_pts_w, results.serve2_pts)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded :height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.serve2_pts_w, results.serve2_pts)"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">Return points won</div>
                                <div class="font-weight=bold">{{ results === '' ? '0%' : `${percent(results.ret_pts, results.ret_pts_total)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.ret_pts, results.ret_pts_total)"/>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex justify-space-between">
                            <div class="text-subtitle-1">Break points faced</div>
                            <div class="font-weight-bold">{{ results === '' ? 0 : results.bps_faced }}</div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">Total points won</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.pts_w, results.total_pts)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.pts_w, results.total_pts)"/>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">Break points saved</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.bps_saved, results.bps_faced)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.bps_saved, results.bps_faced)"/>
                            </div>
                        </div>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex flex-column my-2">
                            <div class="d-flex justify-space-between">
                                <div class="text-subtitle-1">Total service points won</div>
                                <div class="font-weight-bold">{{ results === '' ? '0%' : `${percent(results.total_sv_pts, results.total_sv_pts_total)}%` }}</div>
                            </div>
                            <div v-if="results !== ''">
                                <v-progress-linear rounded height="20" color="green-accent-4" class="bg-green-darken-4" :model-value="percent(results.sv_pts, results.sv_pts_total)"/>
                            </div>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </v-table>
    </v-sheet>
</template>