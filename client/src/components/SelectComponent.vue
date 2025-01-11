<script setup lang="ts">
import type { CheckboxValueType } from 'element-plus'

const props = defineProps<{ label: string; options: { label: string; value: string }[] }>()
const mode = useColorMode()

const modelValue = defineModel<string[]>()
const indeterminate = ref(false)
const checkAll = ref(true)

watchArray(modelValue, (newValue) => {
	if (newValue.length === 0) {
		checkAll.value = false
		indeterminate.value = false
	} else if (newValue.length === props.options.length) {
		checkAll.value = true
		indeterminate.value = false
	} else {
		checkAll.value = false
		indeterminate.value = true
	}
})

const handleCheckAll = (val: CheckboxValueType) => {
	indeterminate.value = false
	if (val) {
		modelValue.value = props.options.map((_) => _.value)
	} else {
		modelValue.value = []
	}
}
</script>

<template>
	<el-select v-model="modelValue" :label multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" size="small" automatic-dropdown>
		<template #header>
			<el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All </el-checkbox>
		</template>
		<el-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
	</el-select>
</template>

<style>
.el-select {
	--el-border-color: theme(colors.emerald.600);
}

.el-select__wrapper.is-focused {
	--el-color-primary: theme(colors.emerald.400);
}

.el-select__wrapper {
	@apply !bg-transparent !py-2 !px-4;
	--el-border-color-hover: theme(colors.emerald.400);
}

.el-tag.el-tag--info {
	--el-tag-bg-color: transparent;
	--el-tag-text-color: theme(colors.slate.400);
	border-color: theme(colors.slate.500);
}

.el-select__popper {
	--el-bg-color-overlay: theme(colors.slate.200);
	--el-border-color-light: theme(colors.slate.500);

	@media (prefers-color-scheme: dark) {
		--el-bg-color-overlay: theme(colors.slate.950);
	}
}

.el-select-dropdown__header {
	@apply py-1;
}

.el-checkbox {
	--el-checkbox-checked-text-color: theme(colors.emerald.600);
	--el-checkbox-checked-input-border-color: theme(colors.emerald.600);
	--el-checkbox-checked-bg-color: theme(colors.emerald.600);
	--el-checkbox-color-regular: theme(colors.slate.600);
	@media (prefers-color-scheme: dark) {
		--el-text-color-regular: theme(colors.slate.400);
	}
}

.el-select-dropdown__item {
	--el-text-color-regular: theme(colors.slate.600);
	@media (prefers-color-scheme: dark) {
		--el-text-color-regular: theme(colors.slate.400);
	}
}

.el-select-dropdown__item.is-selected {
	--el-color-primary: theme(colors.emerald.600);
}

.el-select-dropdown__item.is-hovering {
	--el-fill-color-light: theme(colors.emerald.100);
}
</style>
