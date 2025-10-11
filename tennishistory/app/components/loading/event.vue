<template>
  <u-card class="ring-primary">
    <template #header>
      <div class="flex flex-col gap-1">
        <u-skeleton class="h-3 w-full" />
        <u-skeleton class="h-3 w-1/2" />
      </div>
    </template>

    <div class="flex justify-evenly gap-2 text-sm">
      <div>
        <div class="mb-3">
          <div class="font-semibold mb-2">Categories</div>
          <u-skeleton
            v-for="i in 2"
            :key="`category-${i}`"
            class="h-3 w-10 ml-3"
          />
        </div>

        <div class="mb-3">
          <div class="font-semibold mb-2">Dates</div>
          <u-skeleton
            v-for="i in 2"
            :key="`dates-${i}`"
            class="h-3 w-10 ml-3"
          />
        </div>

        <div>
          <div class="font-semibold mb-2">Surface</div>
          <u-skeleton class="h-3 w-10 ml-3" />
        </div>
      </div>
      <div>
        <div class="mb-3">
          <div class="font-semibold mb-2">Venues</div>
          <u-skeleton
            v-for="i in 2"
            :key="`venue-${i}`"
            class="h-3 w-10 ml-3"
          />
        </div>

        <div>
          <div class="font-semibold mb-2">Draws</div>
          <u-skeleton
            v-for="i in 2"
            :key="`draws-${i}`"
            class="h-3 w-10 ml-3"
          />
        </div>
      </div>
      <div>
        <div class="font-semibold mb-2">Supervisors</div>
        <u-skeleton
          v-for="i in 2"
          :key="`supervisor-${i}`"
          class="h-3 w-10 ml-3"
        />
      </div>
      <div>
        <div class="font-semibold mb-2"> Umpires </div>
        <u-skeleton
          v-for="i in 2"
          :key="`umpire-${i}`"
          class="h-3 w-10 ml-3"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center">
        <u-skeleton
          v-for="i in 3"
          :key="`3-${i}`"
          class="h-2 w-10"
        />
      </div>
    </template>
  </u-card>
</template>
