import type { Player } from './types'
import { useUrlNames } from './useUrlNames'

const { encodeName } = useUrlNames()

export function getParams() {
  const getPlayerParams = (player: Player) => {
    return {
      name: encodeName(player.full_name),
      id: player.id,
    }
  }

  // TODO: Add tournament, event, match, h2h params
  return {
    getPlayerParams,
  }
}
