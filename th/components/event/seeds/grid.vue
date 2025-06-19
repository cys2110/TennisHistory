<script setup lang="ts">
const { seeds } = defineProps<{ seeds: APISeedsResponseType; status: APIStatusType; tours: TourType[] }>()
const {
  params: { name: paramName, year }
} = useRoute()
const name = computed(() => decodeName(paramName as string))

const brokenOutSeeds = computed(() => {
  const result: Record<string, any> = {}
  const types = [
    { tour: "ATP", type: "Singles", draw: "Main" },
    { tour: "ATP", type: "Singles", draw: "Qualifying" },
    { tour: "ATP", type: "Doubles", draw: "Main" },
    { tour: "ATP", type: "Doubles", draw: "Qualifying" },
    { tour: "WTA", type: "Singles", draw: "Main" },
    { tour: "WTA", type: "Singles", draw: "Qualifying" },
    { tour: "WTA", type: "Doubles", draw: "Main" },
    { tour: "WTA", type: "Doubles", draw: "Qualifying" },
    { tour: "None", type: "Singles", draw: "Main" },
    { tour: "None", type: "Doubles", draw: "Main" },
    { tour: "None", type: "Singles", draw: "Qualifying" },
    { tour: "None", type: "Doubles", draw: "Qualifying" }
  ]

  for (const type of types) {
    const key = type.tour + type.draw + type.type
    if (type.tour === "None") {
      if (type.type === "Singles") {
        result[key] =
          type.draw === "Main" ? seeds.mainSeeds.filter(seed => seed.type === type.type) : seeds.qualSeeds.filter(seed => seed.type === type.type)
      } else {
        const filteredSeeds = seeds[type.draw === "Main" ? "mainSeeds" : "qualSeeds"].filter(seed => seed.type === type.type)
        for (let i = 0; i < filteredSeeds.length / 2; i++) {
          const jointSeeds = filteredSeeds.filter(seed => seed.seed === i + 1)
          if (jointSeeds.length > 0) {
            result[key] ? result[key].push(jointSeeds) : (result[key] = [jointSeeds])
          }
        }
      }
    } else {
      if (type.type === "Singles") {
        result[key] =
          type.draw === "Main" ?
            seeds.mainSeeds.filter(seed => seed.tour === type.tour && seed.type === type.type)
          : seeds.qualSeeds.filter(seed => seed.tour === type.tour && seed.type === type.type)
      } else {
        const filteredSeeds = seeds[type.draw === "Main" ? "mainSeeds" : "qualSeeds"].filter(
          seed => seed.tour === type.tour && seed.type === type.type
        )
        for (let i = 0; i < filteredSeeds.length / 2; i++) {
          const jointSeeds = filteredSeeds.filter(seed => seed.seed === i + 1)
          if (jointSeeds.length > 0) {
            result[key] ? result[key].push(jointSeeds) : (result[key] = [jointSeeds])
          }
        }
      }
    }
  }
  return result
})
</script>

<template>
  <u-page-columns class="md:columns-1 lg:columns-2 xl:columns-2 2xl:columns-2">
    <div>
      <u-alert
        color="singles"
        variant="subtle"
        title="Singles"
        class="w-full text-center mb-5"
      />
      <u-page-grid
        v-if="(brokenOutSeeds.NoneMainSingles as SeedType[]).length"
        class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      >
        <event-seeds-card
          v-for="seed in (tours.includes('ATP') && tours.includes('WTA') ?
            brokenOutSeeds.ATPMainSingles
          : brokenOutSeeds.NoneMainSingles) as SeedType[]"
          :key="seed.id"
          :seed
        />
        <event-seeds-card
          v-for="seed in (tours.includes('ATP') && tours.includes('WTA') ?
            brokenOutSeeds.ATPQualifyingSingles
          : brokenOutSeeds.NoneQualifyingSingles) as SeedType[]"
          :key="seed.id"
          :seed
          qualifying
        />
        <event-seeds-card
          v-for="seed in brokenOutSeeds.WTAMainSingles as SeedType[]"
          :key="seed.id"
          :seed
        />
        <event-seeds-card
          v-for="seed in brokenOutSeeds.WTAQualifyingSingles as SeedType[]"
          :key="seed.id"
          :seed
          qualifying
        />
      </u-page-grid>
      <u-page-grid
        v-else-if="['pending', 'idle'].includes(status)"
        class="2xl:grid-cols-3"
      >
        <loading-base
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>
      <error-message
        v-else
        :message="`${name} ${year} did not have any singles seeds`"
      />
    </div>
    <div>
      <u-alert
        color="doubles"
        variant="subtle"
        title="Doubles"
        class="w-full text-center mb-5"
      />
      <u-page-grid
        v-if="(brokenOutSeeds.NoneMainDoubles as SeedType[]).length"
        class="lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2"
      >
        <event-seeds-card
          v-for="(seed, index) in tours.includes('ATP') && tours.includes('WTA') ? brokenOutSeeds.ATPMainDoubles : brokenOutSeeds.NoneMainDoubles"
          :key="`main-atp-${index}`"
          :seed
        />
        <event-seeds-card
          v-for="(seed, index) in tours.includes('ATP') && tours.includes('WTA') ?
            brokenOutSeeds.ATPQualifyingDoubles
          : brokenOutSeeds.NoneQualifyingDoubles"
          :key="`main-wta-${index}`"
          :seed
          qualifying
        />
        <event-seeds-card
          v-for="(seed, index) in brokenOutSeeds.WTAMainDoubles"
          :key="`main-wta-${index}`"
          :seed
        />
        <event-seeds-card
          v-for="(seed, index) in brokenOutSeeds.WTAQualifyingDoubles"
          :key="`qual-wta-${index}`"
          :seed
          qualifying
        />
      </u-page-grid>
      <u-page-grid
        v-else-if="['pending', 'idle'].includes(status)"
        class="2xl:grid-cols-3"
      >
        <loading-base
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>
      <error-message
        v-else
        :message="`${name} ${year} did not have any doubles seeds`"
      />
    </div>
  </u-page-columns>
</template>
