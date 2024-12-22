<script setup lang="ts">
import { getEntry, getLowerTb } from '@/utils/functions';
import type { Match, ShortRound } from '@/utils/types';
import { use2Images2 } from '@/utils/use2Images2';
import { useUrlNames } from '@/utils/useUrlNames';
import { SHORT_ROUNDS } from '@/utils/variables';

const { encodeName } = useUrlNames()
const { headshot } = use2Images2()

interface Player { s1: number | null, s2: number | null, s3: number | null, s4: number | null, s5: number | null, t1: number | null, t2: number | null, t3: number | null, t4: number | null, t5: number | null, incomplete?: string | null, id?: string, name?: string, country?: { id: string, name: string }, seed?: number | null, rank?: number | null, status?: string | null }

interface MatchDetails { match_no: number, round: string, winner: string, incomplete: string | null, player?: Player, opponent?: Player }

const props = defineProps<{
    scores: { match: Match }[]
    id: string
    name: string
    eventParams: { name: string, id: number, year: string, eid: number }
}>()

// Get array of matches
const rawMatches = props.scores.map(match => { return match.match })

const extractPlayer = (p: any): Player => ({
    s1: p.s1, s2: p.s2, s3: p.s3, s4: p.s4, s5: p.s5, t1: p.t1, t2: p.t2, t3: p.t3, t4: p.t4, t5: p.t5, incomplete: p.incomplete
})

const extractOpponent = (p: any): Player => ({
    ...extractPlayer(p), id: p.player.player.id, name: p.player.player.full_name, country: p.player.player.country, seed: p.player.seed, rank: p.player.rank, status: p.player.status
})

const matches = rawMatches.map(match => {
    const matchDetails: MatchDetails = {
        match_no: match.match_no,
        round: match.round.round,
        winner: match.winner.player.player.id,
        incomplete: match.incomplete,
    };

    if (match.p1 && match.p2) {
        const [player, opponent] =
            match.p1.player.player.id === props.id
                ? [extractPlayer(match.p1), extractOpponent(match.p2)]
                : [extractPlayer(match.p2), extractOpponent(match.p1)];
        matchDetails.player = player;
        matchDetails.opponent = opponent;
    } else {
        const player = extractPlayer(match.p1 || match.p2);
        matchDetails.player = player
    }

    return { ...matchDetails };
});

// Set icon for win or loss
const iconClass = (winner: string, player: string) => {
    return winner === player ? 'fa-regular fa-circle-check text-green-600' : 'fa-regular fa-circle-xmark text-red-600'
}
</script>

<template>
    <DataTable :value="matches" size="small" :dt="{ rowBackground: 'transparent' }">
        <Column field="round" header="ROUND" class="!text-xs xl:!text-sm !text-center">
            <template #body="{ data }">
                <div>{{ SHORT_ROUNDS[data.round as ShortRound] }}</div>
            </template>"
        </Column>
        <Column field="opponent.country" class="!text-xs">
            <template #body="{ data }">
                <GetFlag v-if="data.opponent" :country="data.opponent.country.id" />
            </template>
        </Column>
        <Column>
            <template #body="{ data }">
                <Avatar v-if="data.opponent" style="border: 1px solid var(--p-zinc-400)" shape="circle"
                    :image="headshot(data.opponent.id)" />
            </template>
        </Column>
        <Column header="OPPONENT">
            <template #body="{ data }">
                <template v-if="data.incomplete === 'B'">BYE</template>
                <div v-else-if="data.opponent" class="flex gap-2 items-center !text-xs xl:!text-sm">
                    <span>
                        <router-link class="hover-link"
                            :to="{ name: 'player', params: { name: encodeName(data.opponent.name), id: data.opponent.id } }">
                            {{ data.opponent.name }}</router-link>
                    </span>
                    <span class="text-xs">{{ getEntry({
                        seed: data.opponent.seed, status: data.opponent.status
                    })
                        }}</span>
                </div>
                <template v-else>TBD</template>
            </template>
        </Column>
        <Column field="opponent.rank" header="RANK" class="!text-xs xl:!text-sm !text-center" />
        <Column>
            <template #body="{ data }">
                <i :class="iconClass(data.winner, id)" /> </template>
        </Column>
        <Column header="SCORE">
            <template #body="{ data }">
                <div class="flex !text-xs xl:!text-sm !text-center">
                    <router-link v-if="!data.incomplete && data.opponent" class="hover-link"
                        :to="{ name: 'match', params: { ...eventParams, mid: data.match_no } }">
                        <div class="text-zinc-300 flex justify-start gap-1">
                            <span>{{ data.player.s1 }}{{ data.opponent.s1 }}<sup v-if="data.player.t1">{{
                                getLowerTb(data.player.t1, data.opponent.t1) }}</sup></span>
                            <span>{{ data.player.s2 }}{{ data.opponent.s2 }}<sup v-if="data.player.t2">{{
                                getLowerTb(data.player.t2, data.opponent.t2) }}</sup></span>
                            <span>{{ data.player.s3 }}{{ data.opponent.s3 }}<sup v-if="data.player.t3">{{
                                getLowerTb(data.player.t3, data.opponent.t3) }}</sup></span>
                            <span>{{ data.player.s4 }}{{ data.opponent.s4 }}<sup v-if="data.player.t4">{{
                                getLowerTb(data.player.t4, data.opponent.t4) }}</sup></span>
                            <span>{{ data.player.s5 }}{{ data.opponent.s5 }}<sup v-if="data.player.t5">{{
                                getLowerTb(data.player.t5, data.opponent.t5) }}</sup></span>
                        </div>
                    </router-link>
                    <Tag v-if="data.player.incomplete || data.opponent?.incomplete"
                        :dt="{ primaryBackground: '{red.800}', primaryColor: '{zinc.300}' }">{{
                            data.player.incomplete || data.opponent.incomplete }}.</Tag>
                </div>
            </template>
        </Column>
        <Column>
            <template #body="{ data }">
                <Button v-if="data.opponent" label="H2H" size="small" as="router-link" variant="outlined" raised rounded
                    :to="{ name: 'h2h', params: { p1Name: encodeName(name), p1Id: id, p2Name: encodeName(data.opponent.name), p2Id: data.opponent.id } }" />
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
:deep(.p-datatable-thead tr th) {
    border-bottom: 0.5px solid var(--p-zinc-400) !important;
}

:deep(.p-datatable-tbody tr td) {
    border-bottom: 0.5px solid var(--p-zinc-400) !important;
}

:deep(.p-datatable-column-header-content) {
    display: flex;
    justify-content: center;
}
</style>