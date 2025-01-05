<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelRight } from "lucide-vue-next";
import { useSidebar } from "./utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
    <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        :class="cn('h-7 w-7', props.class)"
        @click="toggleSidebar"
    >
        <Icon
            name="bi:layout-sidebar-inset"
            class="text-2xl"
        />
        <span class="sr-only">Toggle Sidebar</span>
    </Button>
</template>
