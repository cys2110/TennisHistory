export function useImages() {
  const image = ref<string | null>(null)

  const getCategorySrc = (category: string) => {
    image.value = new URL(`../assets/category/${category}.svg`, import.meta.url).href

    if (image) {
      return image.value
    }
  }

  const getHeadshotSrc = (player: string) => {
    image.value = new URL(`https://www.atptour.com/-/media/alias/player-headshot/${player}`).href

    if (image) {
      return image.value
    }
  }

  return { getCategorySrc, getHeadshotSrc }
}
