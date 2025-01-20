<script setup lang="ts">
definePageMeta({ name: "draw", layout: "event-layout" });
const route = useRoute();
const eid = ref(route.params.eid);
const selectedRound = ref(1);

const { data: results, status, error } = await useFetch("/api/getDraw", { query: { eid } });

// const generatePdf = () => {
//     const chartElement = document.querySelector('#details');
//     const options = {
//         margin: 1,
//         filename: 'chart.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 1 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
//     };

//     html2pdf()
//         .from(chartElement)
//         .set(options)
//         .outputPdf('blob') // Generates the PDF as a Blob
//         .then((pdfBlob) => {
//             // Create a URL for the Blob
//             const pdfUrl = URL.createObjectURL(pdfBlob);
//             // Open the URL in a new window or tab
//             window.open(pdfUrl, '_blank');
//         });
// };
</script>

<template>
	<div>
		<div v-if="results">
			<shadcn-scroll-area class="border border-zinc-500 rounded w-1/2 whitespace-nowrap h-fit">
				<div class="flex justify-evenly whitespace-nowrap w-max gap-3">
					<div
						v-for="round in results"
						:key="round.number"
						class="w-fit"
					>
						<div>{{ round.round }}</div>
						<div class="flex-1 flex flex-col justify-around w-fit h-full">
							<draw-card
								v-for="match in round.matches"
								:key="match.match_no"
								:match
							/>
						</div>
					</div>
				</div>
				<!-- <template
					v-for="round in results"
					:key="round.number.low"
				>
					<div
						v-if="selectedRound > round.number.low - 1 && selectedRound < round.number.low + 3"
						:id="round.number"
						class="h-full w-max mx-2"
					>
						<div class="text-center font-bold text-zinc-300">{{ round.round }}</div>
						<div class="flex flex-col justify-around h-full">
							<draw-card
								v-for="match in round.matches"
								:key="match.match_no"
								:match
							/>
						</div>
					</div>
				</template> -->
				<shadcn-scroll-bar orientation="horizontal" />
			</shadcn-scroll-area>
		</div>
		<error-message
			v-else
			:status
			error-icon="material-symbols:error-circle-rounded-outline-sharp"
		>
			<template #loading-message>The event draw is currently being fetched</template>
			<template #error-message>No draw available</template>
		</error-message>
	</div>
</template>

<style scoped>
.hide-scrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
	display: none;
}
</style>
