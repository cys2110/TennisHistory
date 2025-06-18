<script setup lang="ts">
useHead({ title: "About", templateParams: { subPage: null } })
</script>

<template>
  <page-wrapper>
    <template #toolbar>
      <div class="text-muted text-xl">
        DISCLAIMER: This website is not intended to infringe on any copyright. It is not intended for any monetary or any other disallowed purpose.
      </div>
    </template>

    <u-container>
      <div>
        This website displays data about Open Era men's and women's tennis in a user-friendly format. The goal is to include data going back to 1968,
        but given the volume of the data, please be patient. New features will be introduced as often as possible. Suggestions are welcome!
      </div>
      <div>
        I have tried to gather data from the most reliable sources, including the official ATP and WTA websites. However, please note that some data
        (particularly relating to players' coaches as well as data relating to older events) may be inaccurate or incomplete - please let me know if
        you find any issues. Moreover, players' win-loss index and stats are based solely on their singles matches as, even where available, stats for
        doubles matches often do not break out the individual players' stats.
      </div>
      <div>
        You can toggle between light and dark mode as well as between list and card view by clicking the settings button at the top of the sidebar or
        by pressing the
        <u-kbd value="meta" /><u-kbd value="k" /> keys. Card view provides a more aesthetic view of the data but list view provides a quicker
        overview. You can also choose the hybrid view which prioritises the card view, but defaults to list view for pages which are more suited to
        the list view.
      </div>
    </u-container>
  </page-wrapper>
</template>
