<template>
    <card>
        <template #title>
            <Skeleton height="1.5rem" border-radius="16px" />
            <Divider />
        </template>
        <template #content>
            <div class="flex flex-col justify-center items-center gap-3">
                <Skeleton border-radius="16px" />
                <div>d.</div>
                <Skeleton border-radius="16px" />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-center items-end">
                <Skeleton width="10rem" border-radius="16px" />
            </div>
        </template>
    </card>
</template>