export const handedness = (rh: boolean | null) => {
    switch (rh) {
        case true:
            return 'Right-handed';
        case false:
            return 'Left-handed';
        default:
            return 'Unknown';
    }
}

export const backhand = (bh: boolean | null) => {
    switch (bh) {
        case true:
            return 'One-handed';
        case false:
            return 'Two-handed';
        default:
            return 'Unknown';
    }
}

export const heightFt = (height: number) => {
    const ftDecimal = convert(height, "cm").to("ft");
    const ft = Math.floor(ftDecimal);
    const inches = Math.round((ftDecimal - ft) * 12);
    return `${ft}' ${inches}"`;
}

export const percentage = (value1: number, total: number) => Math.round((value1 / total) * 100)