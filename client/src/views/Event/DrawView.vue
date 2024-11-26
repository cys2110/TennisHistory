<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_DRAW } from '@/services/EventService';
import { encodeName, unencodeName } from '@/utils/functions';

// [FUTURE: FILTER BY PLAYER]
// [FUTURE: PDF OF DRAW]

const props = defineProps(['name', 'id', 'year', 'eid'])
const matches = ref(null)
const anchorItems = ref(null)

// Update document title
const updateDocumentTitle = () => document.title = `Draw | ${unencodeName(props.name)} ${props.year} | TennisHistory`
watch(() => props.name, () => updateDocumentTitle(), { immediate: true })

// API call
provideApolloClient(apolloClient)
const { query, variables } = GET_DRAW(parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        matches.value = newResult.events[0].rounds
        anchorItems.value = matches.value.map(round => (
            {
                key: round.number,
                href: `#${encodeName(round.round)}`,
                title: round.round
            }
        ))
    }
})
watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <Title>
        <template #title>{{ unencodeName(name) }} {{ year }}</template>
        <template #subtitle>Draw</template>
    </Title>
    <a-row>
        <a-col :span="4">
            <!--[TODO: FIX SECOND ANCHOR LINK CLICK]-->
            <!--[TODO: FIX SPACING ISSUES]-->
            <a-config-provider :theme="{ components: { Anchor: { colorPrimary: '#6d28d9' } } }">
                <a-anchor v-if="matches" :offset-top="75" :items="anchorItems" class="my-10" :affix="false" />
            </a-config-provider>
        </a-col>
        <a-col :span="20">
            <div class="flex overflow-x-auto scroll-smooth" id="draw-container">
                <div class="flex-[0_0_auto] w-1/3 mx-4 flex flex-col justify-around" v-if="matches"
                    v-for="round in matches" :key="round.round" :id="encodeName(round.round)">
                    <DrawCard v-for="match in round.matches" :key="match.match_no" :match :name :id :eid :year />
                </div>
            </div>
        </a-col>
    </a-row>


    <Loading v-if="!matches" :loading>
        <template #none>No draw available</template>
    </Loading>
</template>