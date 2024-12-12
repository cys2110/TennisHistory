<template>
    <div class="rounded-lg p-6 border-violet-800 border-[1px] flex flex-col gap-5">
        <div>
            <Skeleton height="1.5rem" width="100%" border-radius="16px" />
            <Divider />
        </div>
        <div class="flex justify-between">
            <div class="flex flex-col gap-2">
                <Skeleton width="10rem" border-radius="16px" />
                <Skeleton width="10rem" border-radius="16px" />
                <Skeleton width="10rem" border-radius="16px" />
            </div>
            <div>
                <Skeleton size="3rem" />
            </div>
        </div>
        <Divider />
        <div class="flex justify-evenly">
            <Skeleton width="5rem" border-radius="16px" />
            <Skeleton width="5rem" border-radius="16px" />
        </div>
    </div>
</template>