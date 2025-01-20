<script setup lang="ts">
// TODO: Update history / styling
</script>

<template>
	<u-page>
		<u-page-header
			title="TennisHistory"
			description="Overview of website"
		/>
		<u-page-body>
			<div class="text-xl font-semibold">A (very) brief history of tennis</div>
			<div>A complete history of tennis could take up volumes of books. However, to get a brief overview of the structure of the tennis world currently, read on!</div>
			<div>
				Tennis as we currently know if started in 1968 - otherwise known as the start of the Open Era. Up until then, tennis had been separated between amateurs and professionals and tournaments usually only allowed only amateurs or only professionals to enter. In 1968, this structure began to flatten and by 1969, all tournaments began allowing all tennis players to enter. However, during this period, promoters were still in charge of organising the tournaments. In 1990, the
				<a
					href="https://www.atptour.com/en"
					target="_blank"
					class="hover-link text-emerald-600"
				>
					Association of Tennis Professionals (ATP)
				</a>
				took over the organisation of the tennis calendar in order to reform it and to give more representation to tennis players. Whilst today, the ATP continues to administer most tour level events, the Grand Slams and the Davis Cup continue to be overseen by separate governing bodies. Moreover, the women's tour is governed by the
				<a
					href="https://www.wtatennis.com"
					target="_blank"
					class="hover-link text-emerald-600"
				>
					Women's Tennis Association (WTA)
				</a>
				.
			</div>
			<div class="text-xl font-semibold">Current Structure of Men's Tournaments</div>
			<!--TODO: figure out format-->
			<table class="text-center">
				<thead>
					<tr>
						<th>Tournament</th>
						<th>Organisation</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Grand Slams</td>
						<td class="flex flex-col">
							<div>Tennis Australia</div>
							<div>Internationaux de France de tennis</div>
							<div>Lawn Tennis Association</div>
							<div>United States Tennis Association</div>
						</td>
					</tr>
					<tr>
						<td>ATP Masters 1000</td>
						<td>ATP</td>
					</tr>
					<tr>
						<td>ATP 500</td>
						<td>ATP</td>
					</tr>
					<tr>
						<td>ATP 250</td>
						<td>ATP</td>
					</tr>
					<tr>
						<td>Challengers</td>
						<td></td>
					</tr>
					<tr>
						<td>Futures</td>
						<td>International Tennis Federation</td>
					</tr>
					<tr>
						<td>Davis Cup</td>
						<td>International Tennis Federation</td>
					</tr>
				</tbody>
			</table>
		</u-page-body>
	</u-page>
</template>
