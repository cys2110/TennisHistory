<script setup>
import defaultLayout from "~/layouts/default.vue";

const route = useRoute();
const pname = computed(() => route.params.pname);
const pid = computed(() => route.params.pid);

const pageName = computed(() => {
    const filteredPage = PLAYER_PAGES.find((page) => page.name === route.name);
    return filteredPage?.title || "";
});

const pageIcon = computed(() => {
    const filteredPage = PLAYER_PAGES.find((page) => page.name === route.name);
    return filteredPage?.icon || "";
});

useHead({ title: `${pageName.value} | ${unencodeName(pname.value)}` });
</script>

<template>
    <defaultLayout>
        <ClientOnly>
            <shadcn-breadcrumb class="my-5">
                <shadcn-breadcrumb-list>
                    <shadcn-breadcrumb-item>
                        <shadcn-breadcrumb-link as-child>
                            <Icon name="i-ph-house-duotone" />
                            <nuxt-link to="/">Home</nuxt-link>
                        </shadcn-breadcrumb-link>
                    </shadcn-breadcrumb-item>
                    <shadcn-breadcrumb-separator />
                    <shadcn-breadcrumb-item>Players</shadcn-breadcrumb-item>
                    <shadcn-breadcrumb-separator />
                    <shadcn-breadcrumb-item>
                        {{ unencodeName(pname) }}
                    </shadcn-breadcrumb-item>
                    <shadcn-breadcrumb-separator />
                    <shadcn-breadcrumb-item>
                        <shadcn-breadcrumb-page class="flex items-center gap-1">
                            <Icon :name="pageIcon" />
                            {{ pageName }}
                        </shadcn-breadcrumb-page>
                    </shadcn-breadcrumb-item>
                </shadcn-breadcrumb-list>
            </shadcn-breadcrumb>
        </ClientOnly>
        <page-title>
            <template #heading>{{ unencodeName(pname) }}</template>
            <template #subheading>{{ pageName }}</template>
        </page-title>
        <prime-toolbar class="mb-5 flex justify-between lg:hidden">
            <template #center>
                <div class="flex md:items-center md:justify-center items-end gap-2">
                    <template
                        v-for="page in PLAYER_PAGES"
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
                                    :to="`/players/${pname}/${pid}/${page.route}`"
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
