<script setup lang="ts">
const colorMode = useColorMode()
const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md
const scroll = useScroll()
const showButton = ref(false)

// Light/dark mode toggle
const isDark = computed({
  get() {
    return colorMode.value === "dark"
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
  }
})

// Show back to top button when page scrolled
const handleScroll = () => {
  showButton.value = window.scrollY > 200
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <u-page>
    <!--Header (visible on smaller screens)-->
    <ClientOnly>
      <u-header
        title="TennisHistory"
        :toggle="{ color: 'neutral', class: 'rounded-full', icon: 'solar:hamburger-menu-line-duotone' }"
        :ui="{ root: 'bg-violet-800 lg:hidden', title: 'font-cursive text-slate-300' }"
      >
        <template #content>
          <u-navigation-menu
            :items="NAVIGATION_LINKS"
            color="secondary"
            orientation="vertical"
            highlight
          />
        </template>
        <template #right>
          <u-button
            v-if="showButton"
            icon="solar:round-alt-arrow-up-bold-duotone"
            @click="scroll.scroll('#top')"
            variant="ghost"
            class="ml-auto"
            color="neutral"
            size="lg"
          />
          <u-button
            :icon="isDark ? 'line-md:sun-rising-twotone-loop' : 'line-md:moon-alt-loop'"
            color="secondary"
            variant="link"
            @click="isDark = !isDark"
          />
        </template>
      </u-header>
    </ClientOnly>

    <!--Sidebar (visible on large+ screens)-->
    <template #left>
      <u-page-aside :ui="{ root: 'border-r lg:top-0 lg:max-h-screen', container: 'px-5 absolute h-full' }">
        <template #top>
          <span class="font-cursive text-lg xl:text-2xl 2xl:text-3xl mx-auto">TennisHistory</span>
        </template>
        <div class="h-4/5">
          <ClientOnly>
            <div class="flex justify-end">
              <u-button
                v-if="showButton"
                icon="solar:round-alt-arrow-up-bold-duotone"
                @click="scroll.scroll('#top')"
                variant="ghost"
                class="ml-auto"
                color="secondary"
                label="Back to top"
              />
              <u-button
                :icon="isDark ? 'line-md:sun-rising-twotone-loop' : 'line-md:moon-alt-loop'"
                color="secondary"
                variant="link"
                @click="isDark = !isDark"
              />
            </div>
          </ClientOnly>
          <u-page-links
            title="Navigation"
            :links="NAVIGATION_LINKS"
            :ui="{ root: 'my-5', item: 'xl:ml-5', link: 'text-xs xl:text-sm 2xl:text-md', title: '2xl:text-lg' }"
          >
          </u-page-links>
          <u-page-links
            title="Related Websites"
            :links="RELATED_LINKS"
            :ui="{ item: 'xl:ml-5', link: 'text-xs xl:text-sm 2xl:text-md', title: '2xl:text-lg' }"
          />
        </div>
        <template #bottom>
          <div class="text-center text-sm mt-auto w-3/4 mx-auto">
            Built by
            <nuxt-link
              class="text-emerald-600"
              to="https://www.claire-sheridan.com"
              target="_blank"
            >
              Claire Sheridan
            </nuxt-link>
            using Nuxt, Nuxt UI Pro and TypeScript.
          </div>
        </template>
      </u-page-aside>
    </template>

    <!--Main page-->
    <u-main class="px-5">
      <div id="top" />
      <slot />
    </u-main>

    <!--Footer (visible on smaller screens)-->
    <ClientOnly>
      <u-footer :ui="{ root: 'bg-violet-800 lg:hidden', container: 'p-0 pb-2' }">
        <u-navigation-menu
          :items="RELATED_LINKS"
          :orientation="md ? 'horizontal' : 'vertical'"
        />
        <template #bottom>
          <div class="p-3 text-center text-sm text-slate-400">
            Built by
            <nuxt-link
              class="text-emerald-600"
              to="https://www.claire-sheridan.com"
              target="_blank"
            >
              Claire Sheridan
            </nuxt-link>
            using Nuxt, Nuxt UI Pro and TypeScript.
          </div>
        </template>
      </u-footer>
    </ClientOnly>
  </u-page>
</template>
