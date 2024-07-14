// functions

export const round = (roundNumber: string) => {
    switch (roundNumber) {
        case 'Round of 128':
            return 'R128'
        case 'Round of 64':
            return 'R64'
        case 'Round of 32':
            return 'R32'
        case 'Round of 16':
            return 'R16'
        case 'Quarterfinals':
            return 'QF'
        case 'Semifinals':
            return 'SF'
        case 'Final':
            return 'F'
    }
}