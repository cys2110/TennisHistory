export function useImages() {
  const headshot = (player: string) => {
    return new URL(`https://www.atptour.com/-/media/alias/player-headshot/${player}`).href
  }

  const gladiator = (player: string) => {
    return new URL(`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player}`).href
  }

  const categorySrc = (category: string) => {
    return new URL(`../assets/category/${category}.svg`, import.meta.url).href
  }

  return { headshot, gladiator, categorySrc }
}
