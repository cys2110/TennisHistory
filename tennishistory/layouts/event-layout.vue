<script setup>
import defaultLayout from "~/layouts/default.vue";

const route = useRoute();
const tname = ref(route.params.tname);
const tid = ref(route.params.tid);
const year = ref(route.params.year);
const eid = ref(route.params.eid);

const page = computed(() => {
    const filteredPage = EVENT_PAGES.find((page) => page.name === route.name);
    return filteredPage || "";
});

useHead({ title: `${page.value.title} | ${unencodeName(tname.value)} ${year.value}` });
</script>

<template>
    <defaultLayout>
        <tournament-breadcrumbs
            :page
            class="my-5"
        />
        <page-title>
            <template #heading>{{ unencodeName(tname) }} {{ year }}</template>
            <template #subheading>{{ page.title }}</template>
        </page-title>
        <prime-toolbar class="mb-5 flex justify-between lg:hidden">
            <template #center>
                <div class="flex md:items-center md:justify-center items-end gap-2">
                    <template
                        v-for="page in EVENT_PAGES"
                        :key="page.title"
                    >
                        <shadcn-button
                            size="xs"
                            class="rounded-full"
                            as-child
                        >
                            <div>
                                <Icon :name="page.icon" />
                                <nuxt-link
                                    :to="`/tournaments/${tname}/${tid}/${year}/${eid}/${page.route}`"
                                    class="hover-link"
                                >
                                    {{ page.title }}
                                </nuxt-link>
                            </div>
                        </shadcn-button>
                    </template>
                </div>
            </template>
        </prime-toolbar>
        <slot />
    </defaultLayout>
</template>
