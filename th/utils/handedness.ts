export default function (rh: boolean) {
    switch (rh) {
        case true:
            return 'Right-handed'
        case false:
            return 'Left-handed'
        default:
            return 'Unknown'
    }
}