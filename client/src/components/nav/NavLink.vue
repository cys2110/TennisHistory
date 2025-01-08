<script setup lang="ts">
export interface NavLinkProps {
  title: string
  link: string
  icon?: string
}

withDefaults(defineProps<NavLinkProps>(), {
  link: '',
  icon: '',
})
</script>

<template>
  <q-item v-ripple clickable>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" size="xs" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <router-link :to="link" exact-active-class="text-green-7">{{ title }}</router-link>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
