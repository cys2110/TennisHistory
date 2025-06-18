<script setup lang="ts">
const { index } = defineProps<{
  index: WLIndexInterface[]
  status: APIStatusType
}>()

const categoryColours = {
  "Match Record": "ring-success-700 dark:ring-success-300",
  "Pressure Points": "ring-warning-700 dark:ring-warning-300",
  Environment: "ring-joint-700 dark:ring-joint-400",
  Other: "ring-info-700 dark:ring-info-300"
}

const formattedIndex = computed(() => {
  return Object.values(
    index.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            category: item.category,
            stats: {} as Record<
              string,
              {
                stat: string
                levels: Record<
                  string,
                  {
                    level: string
                    types: {
                      Main?: WLIndexInterface
                      Qualifying?: WLIndexInterface
                      Total?: WLIndexInterface
                    }
                  }
                >
              }
            >
          }
        }

        const statGroup = acc[item.category].stats
        if (!statGroup[item.stat]) {
          statGroup[item.stat] = {
            stat: item.stat,
            levels: {}
          }
        }

        const levelGroup = statGroup[item.stat].levels
        if (!levelGroup[item.level]) {
          levelGroup[item.level] = {
            level: item.level,
            types: {}
          }
        }

        levelGroup[item.level].types[item.type] = item

        return acc
      },
      {} as Record<
        string,
        {
          category: string
          stats: Record<
            string,
            {
              stat: string
              levels: Record<
                string,
                {
                  level: string
                  types: {
                    Main?: WLIndexInterface
                    Qualifying?: WLIndexInterface
                    Total?: WLIndexInterface
                  }
                }
              >
            }
          >
        }
      >
    )
  ).map(categoryGroup => ({
    category: categoryGroup.category,
    stats: Object.values(categoryGroup.stats).map(statGroup => ({
      stat: statGroup.stat,
      levels: Object.values(statGroup.levels)
    }))
  }))
})
</script>

<template>
  <dashboard-subpanel
    v-for="category in formattedIndex"
    :title="category.category"
    :key="category.category"
  >
    <u-page-list>
      <u-page-card
        v-for="stat in category.stats"
        :key="stat.stat"
        :title="stat.stat"
        :ui="{
          body: 'w-full',
          root: `${categoryColours[category.category as keyof typeof categoryColours]} shadow-none hover:shadow-none my-5`
        }"
        highlight
      >
        <template #description>
          <div
            class="grid text-sm text-dimmed text-center font-medium"
            :class="['Match Record', 'Environment'].includes(category.category) ? 'grid-cols-8' : 'grid-cols-7'"
          >
            <span></span>
            <span :class="['Match Record', 'Environment'].includes(category.category) ? 'col-span-3' : 'col-span-2'">MAIN</span>
            <span class="col-span-2">QUALIFYING</span>
            <span class="col-span-2">TOTAL</span>
          </div>
          <div
            class="grid text-sm text-dimmed text-center"
            :class="['Match Record', 'Environment'].includes(category.category) ? 'grid-cols-8' : 'grid-cols-7'"
          >
            <span>Level</span>
            <span>W/L</span>
            <span v-if="['Match Record', 'Environment'].includes(category.category)">Titles</span>
            <span>Index</span>
            <span>W/L</span>
            <span>Index</span>
            <span>W/L</span>
            <span>Index</span>
          </div>
          <div
            v-for="level in stat.levels"
            :key="level.level"
            class="grid text-default text-sm font-extrabold text-center"
            :class="['Match Record', 'Environment'].includes(category.category) ? 'grid-cols-8' : 'grid-cols-7'"
          >
            <div class="font-semibold text-dimmed">
              {{ level.level }}
            </div>
            <div> {{ level.types.Main?.wins }}-{{ level.types.Main?.losses }} </div>
            <div
              v-if="['Match Record', 'Environment'].includes(category.category)"
              class="font-extrabold"
            >
              {{ level.types.Main?.titles ?? "-" }}
            </div>
            <div class="font-extrabold"> {{ level.types.Main?.value }} </div>
            <div> {{ level.types.Qualifying?.wins }}-{{ level.types.Qualifying?.losses }} </div>
            <div> {{ level.types.Qualifying?.value }} </div>
            <div>
              {{ (level.types.Main?.wins ?? 0) + (level.types.Qualifying?.wins ?? 0) }}-{{
                (level.types.Main?.losses ?? 0) + (level.types.Qualifying?.losses ?? 0)
              }}
            </div>
            <div>
              {{
                (level.types.Main?.losses ?? 0) + (level.types.Qualifying?.losses ?? 0) === 0 ?
                  0
                : (
                    ((level.types.Main?.wins ?? 0) + (level.types.Qualifying?.wins ?? 0)) /
                    ((level.types.Main?.wins ?? 0) +
                      (level.types.Qualifying?.wins ?? 0) +
                      (level.types.Main?.losses ?? 0) +
                      (level.types.Qualifying?.losses ?? 0))
                  ).toFixed(3)
              }}
            </div>
          </div>
          <div
            class="grid text-default text-sm font-extrabold text-center"
            :class="['Match Record', 'Environment'].includes(category.category) ? 'grid-cols-8' : 'grid-cols-7'"
          >
            <div class="text-sm font-semibold text-dimmed"> Total </div>
            <div>
              {{ stat.levels.reduce((a, b) => a + (b.types.Main?.wins ?? 0), 0) }}-{{
                stat.levels.reduce((a, b) => a + (b.types.Main?.losses ?? 0), 0)
              }}
            </div>
            <div v-if="['Match Record', 'Environment'].includes(category.category)">
              {{ stat.levels.reduce((a, b) => a + (b.types.Main?.titles ?? 0), 0) }}
            </div>
            <div>
              {{
                stat.levels.reduce((a, b) => a + (b.types.Main?.losses ?? 0), 0) === 0 ?
                  0
                : (
                    stat.levels.reduce((a, b) => a + (b.types.Main?.wins ?? 0), 0) /
                    (stat.levels.reduce((a, b) => a + (b.types.Main?.wins ?? 0), 0) +
                      stat.levels.reduce((a, b) => a + (b.types.Main?.losses ?? 0), 0))
                  ).toFixed(3)
              }}
            </div>
            <div>
              {{ stat.levels.reduce((a, b) => a + (b.types.Qualifying?.wins ?? 0), 0) }}-{{
                stat.levels.reduce((a, b) => a + (b.types.Qualifying?.losses ?? 0), 0)
              }}
            </div>
            <div>
              {{
                stat.levels.reduce((a, b) => a + (b.types.Qualifying?.losses ?? 0), 0) === 0 ?
                  0
                : (
                    stat.levels.reduce((a, b) => a + (b.types.Qualifying?.wins ?? 0), 0) /
                    (stat.levels.reduce((a, b) => a + (b.types.Qualifying?.wins ?? 0), 0) +
                      stat.levels.reduce((a, b) => a + (b.types.Qualifying?.losses ?? 0), 0))
                  ).toFixed(3)
              }}
            </div>
            <div>
              {{
                stat.levels.reduce((a, b) => a + (b.types.Main?.wins ?? 0), 0) + stat.levels.reduce((a, b) => a + (b.types.Qualifying?.wins ?? 0), 0)
              }}-{{
                stat.levels.reduce((a, b) => a + (b.types.Main?.losses ?? 0), 0) +
                stat.levels.reduce((a, b) => a + (b.types.Qualifying?.losses ?? 0), 0)
              }}
            </div>
            <div>
              {{
                (
                  stat.levels.reduce((a, b) => a + (b.types.Main?.losses ?? 0), 0) +
                    stat.levels.reduce((a, b) => a + (b.types.Qualifying?.losses ?? 0), 0) ===
                  0
                ) ?
                  0
                : (
                    (stat.levels.reduce((a, b) => a + (b.types.Main?.wins ?? 0), 0) +
                      stat.levels.reduce((a, b) => a + (b.types.Qualifying?.wins ?? 0), 0)) /
                    (stat.levels.reduce((a, b) => a + (b.types.Main?.wins ?? 0), 0) +
                      stat.levels.reduce((a, b) => a + (b.types.Qualifying?.wins ?? 0), 0) +
                      stat.levels.reduce((a, b) => a + (b.types.Main?.losses ?? 0), 0) +
                      stat.levels.reduce((a, b) => a + (b.types.Qualifying?.losses ?? 0), 0))
                  ).toFixed(3)
              }}
            </div>
          </div>
        </template>
      </u-page-card>
    </u-page-list>
  </dashboard-subpanel>
</template>
