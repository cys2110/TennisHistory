const name: Ref<string> = ref("");
const name2: Ref<string> = ref("");

export const useFormatName = () => {

  const capitaliseName = computed(() => useChangeCase(name.value, 'capitalCase').value)
  const capitaliseName2 = computed(() => useChangeCase(name2.value, 'capitalCase').value)

  const paramName = computed(() => useChangeCase(name.value, 'kebabCase').value)
  const paramName2 = computed(() => useChangeCase(name2.value, 'kebabCase').value)
  return { name, capitaliseName, paramName, name2, capitaliseName2, paramName2 }
}
