<template>
    <card class="full-card">
        <template #title>
            <div class="flex gap-2">
                <Skeleton shape="circle" size="2rem" />
                <Skeleton height="2rem" width="80%" border-radius="16px" />
            </div>
            <Skeleton height="1rem" width="100%" border-radius="16px" class="mt-3" />
            <Divider />
        </template>
        <template #content>
            <div class="flex flex-col gap-3">
                <Skeleton width="10rem" border-radius="16px" />
                <Skeleton width="10rem" border-radius="16px" />
                <Skeleton width="10rem" border-radius="16px" />
            </div>
        </template>
        <template #footer>
            <div class="flex gap-3 mt-5">
                <Skeleton width="5rem" border-radius="16px" />
                <Skeleton width="5rem" border-radius="16px" />
                <Skeleton width="5rem" border-radius="16px" />
            </div>
        </template>
    </card>
</template>