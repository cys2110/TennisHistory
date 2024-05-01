<script setup>
import H2HService from '@/services/H2HService';
import PlayerService from '@/services/PlayerService';
import { onMounted, ref } from 'vue';
import { flagSrc, headshot, formatCurrency, formatDate, round, plays, bh, incomplete } from '@/components/utils';
import { RouterLink } from 'vue-router';
import PlayerStatItem from '@/components/H2H/PlayerStatItem.vue';
import H2HItem from '@/components/H2H/H2HItem.vue';

const props = defineProps(['p1Id', 'p2Id'])
const matches = ref([])
const winPercent = ref(0)
const p1Wins = ref(null)
const p2Wins = ref(null)
const p1 = ref(null)
const p2 = ref(null)

const searchH2H = () => {
    PlayerService.getPlayerById(props.p1Id)
    .then(response => p1.value = response.data)
    PlayerService.getPlayerById(props.p2Id)
    .then(response => p2.value = response.data)
    H2HService.h2h(props.p1Id, props.p2Id)
    .then(response => {
        matches.value = response.data.matches
        p1Wins.value = response.data.count[0].p1Wins
        p2Wins.value = response.data.count[0].p2Wins
        winPercent.value = Math.round(((p1Wins.value / response.data.count[0].total) * 100))
    })
    .catch(error => console.log(error))
}

onMounted(() => {
    searchH2H()
})
</script>

<template>
    <view-sheet v-if="p1 && p2">
        <v-container>
            <v-row>
                <v-col class="d-flex flex-column align-center">
                    <div>
                        <v-img v-if="p1.headshot" rounded="circle" :src="headshot(p1.id)" width="250" class="border-lg"/>
                    </div>
                    <div class="d-flex justify-center align-center my-5">
                        <div>
                            <flag-img :src="flagSrc(p1.country)" width="50" class="mx-2"/>
                        </div>
                        <div>
                            <RouterLink class="hover-link text-h5" :to="{name: 'Player', params: {id: p1.id, name: p1.full_name}}">{{ p1.full_name }}</RouterLink>
                        </div>
                    </div>
                </v-col>
                <v-col class="d-flex align-center justify-center">
                    <div class="text-h2">{{ p1Wins }}</div>
                    <div class="mx-10">
                        <v-progress-circular
                        :model-value="winPercent"
                        :size="200"
                        color="indigo-accent-4"
                        bg-color="green-darken-3"
                        /></div>
                    <div class="text-h2">{{ p2Wins }}</div>
                </v-col>
                <v-col class="d-flex flex-column align-center">
                    <div>
                        <v-img v-if="p2.headshot" rounded="circle" :src="headshot(p2.id)" width="250" class="border-lg"/>
                    </div>
                    <div class="d-flex justify-center align-center my-5">
                        <div>
                            <RouterLink class="hover-link text-h5" :to="{name: 'Player', params: {id: p2.id, name: p2.full_name}}">{{ p2.full_name }}</RouterLink>
                        </div>
                        <div>
                            <flag-img :src="flagSrc(p2.country)" width="50" class="mx-2"/>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <short-card class="pa-3">
                        <PlayerStatItem>
                            <template #field>DOB</template>
                            <template #value>{{ p1.dob ? formatDate(p1.dob) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Height</template>
                            <template #value>{{ p1.height_cm ? `${p1.height_cm} cm (${p1.height_ft})` : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Plays</template>
                            <template #value>{{ p1.rh !== null ? plays(p1.rh) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Backhand</template>
                            <template #value>{{ p1.bh1 !== null ? bh(p1.bh1) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Turned pro</template>
                            <template #value>{{ p1.turned_pro }}</template>
                        </PlayerStatItem>
                    </short-card>
                </v-col>
                <v-col>
                    <v-card variant="text" class="pa-3" rounded="xl">
                        <H2HItem :p1-wins="p1.win" :p1-loss="p1.loss" :p2-wins="p2.win" :p2-loss="p2.loss">
                            <template #field>Career win/loss</template>
                        </H2HItem>
                        <H2HItem :p1-value="p1.titles" :p2-value="p2.titles">
                            <template #field>Career titles</template>
                        </H2HItem>
                        <H2HItem :p1-value="p1.pm_USD" :p2-value="p2.pm_USD" :currency="true">
                            <template #field>Career prize money</template>
                            <template #p1PM>{{ formatCurrency('USD', p1.pm_USD) }}</template>
                            <template #p2PM>{{ formatCurrency('USD', p2.pm_USD) }}</template>
                        </H2HItem>
                        <H2HItem :p1-value="p1.career_high" :p2-value="p2.career_high">
                            <template #field>Career high</template>
                        </H2HItem>
                    </v-card>
                </v-col>
                <v-col>
                    <short-card class="pa-3">
                        <PlayerStatItem>
                            <template #field>DOB</template>
                            <template #value>{{ p2.dob ? formatDate(p2.dob) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Height</template>
                            <template #value>{{ p2.height_cm ? `${p2.height_cm} cm (${p2.height_ft})` : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Plays</template>
                            <template #value>{{ p2.rh !== null ? plays(p2.rh) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Backhand</template>
                            <template #value>{{ p2.bh1 !== null ? bh(p2.bh1) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Turned pro</template>
                            <template #value>{{ p2.turned_pro }}</template>
                        </PlayerStatItem>
                    </short-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-table class="bg-transparent">
                        <thead>
                            <tr>
                                <th class="text-center">Year</th>
                                <th class="pl-16">Winner</th>
                                <th class="text-center">Event</th>
                                <th class="text-center">Round</th>
                                <th class="text-center">Surface</th>
                                <th class="text-center">Score</th>
                            </tr>
                        </thead>
                        <tbody v-if="matches.length === 0">
                            <tr>
                                <td colspan="6">No matches played</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="match in matches">
                                <td class="text-center">
                                    <RouterLink class="hover-link" :to="{name: 'Edition', params: {name: match.Edition.Tournament.name, year: match.Edition.year, id: match.Edition.Tournament.id, editionId: match.Edition.edition_no}}">{{ match.Edition.year }}</RouterLink>
                                </td>
                                <td class="d-flex align-center">
                                    <div>
                                        <v-avatar v-if="match.winner_id === p1.id && p1.headshot">
                                            <v-img :src="headshot(p1.id)"/>
                                        </v-avatar>
                                        <v-avatar v-else-if="match.winner_id === p2.id && p2.headshot">
                                            <v-img :src="headshot(p2.id)"/>
                                        </v-avatar>
                                    </div>
                                    <div>
                                        <flag-img v-if="match.winner_id === p1.id" :src="flagSrc(p1.country)" width="40" class="mx-2"/>
                                        <flag-img v-else :src="flagSrc(p2.country)" width="40" class="mx-2"/>
                                    </div>
                                    <div>
                                        <RouterLink v-if="match.winner_id === p1.id" class="hover-link" :to="{name: 'Player', params: {id: p1.id, name: p1.full_name}}">{{ p1.full_name }}</RouterLink>
                                        <RouterLink v-else class="hover-link" :to="{name: 'Player', params: {id: p2.id, name: p2.full_name}}">{{ p2.full_name }}</RouterLink>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <RouterLink class="hover-link" :to="{ name: 'Tournament', params: {name: match.Edition.Tournament.name, id: match.Edition.Tournament.id} }">{{ match.Edition.Tournament.name }}</RouterLink>
                                </td>
                                <td class="text-center">{{ round(match.round) }}</td>
                                <td class="text-center">{{ match.Edition.environment }} {{ match.Edition.surface }}</td>
                                <td v-if="match.incomplete === 'WO'" class="text-center">Walkover</td>
                                <td v-else class="text-center">
                                    <span v-if="match.winner_id === match.p1" v-for="num in Array.from({ length: 5 }, (_, index) => index + 1)">
                                        {{ match[`s${num}p1`] }}{{ match[`s${num}p2`] }}
                                        <sup>{{ match[`t${num}p1`] > match[`t${num}p2`] ? match[`t${num}p2`] : match[`t${num}p1`] }}</sup>&nbsp;
                                    </span>
                                    <span v-else v-for="num in Array.from({ length: 5 }, (_, index) => index + 1)">
                                        {{ match[`s${num}p2`] }}{{ match[`s${num}p1`] }}
                                        <sup>{{ match[`t${num}p1`] > match[`t${num}p2`] ? match[`t${num}p2`] : match[`t${num}p1`] }}</sup>&nbsp;
                                    </span>
                                    <span v-if="match.incomplete">{{ incomplete(match.incomplete) }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
        </v-container>
    </view-sheet>
</template>