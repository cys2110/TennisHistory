// functions

export const status = (seed: number | null, status: string | null) => {
    return seed && status ? `(${seed} ${status})` : seed ? `(${seed})` : `(${status})`
}

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


// export function groupObjectsByKey (array: EditionByPlayer[] | MatchScore[], key: string): { [key: string]: any } {
//   const groupedArrays: { [key: string]: any[] } = {};

//   array.forEach(obj => {
//     const value = (obj as any)[key];
//     if (!groupedArrays[value]) {
//       groupedArrays[value] = [obj];
//     } else {
//       groupedArrays[value].push(obj);
//     }
//   });

//   return groupedArrays;
// }