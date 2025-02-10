<script setup lang="ts">
const links = [
  { label: "Results Archive", to: { name: "archive" }, icon: ICONS.calendar, color: "secondary", variant: "subtle" },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.trophy, color: "secondary", variant: "subtle" },
  { label: "Players", to: { name: "players" }, icon: ICONS.people, color: "secondary", variant: "subtle" },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.swords, color: "secondary", variant: "subtle" }
]
</script>

<template>
  <u-page>
    <u-page-body>
      <!--@vue-expect-error - type errors arising from lack of stabilisation-->
      <u-page-hero
        title="Tennis History in the Open Era"
        description="Explore the history of men's tennis since 1968"
        :links
      />

      <p class="text-center">
        Keyboard shortcuts appear in this format:
        <u-kbd value="meta" />
        <u-kbd value="shift" />
        <u-kbd value="a" />
        . If a keyboard shortcut appears with a dropdown menu, it offers the option to select or deselect all options.</p
      >
    </u-page-body>
  </u-page>
</template>
