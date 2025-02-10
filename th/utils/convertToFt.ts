export default function (height: number) {
    const ftDecimal = convert(height, "cm").to("ft");
    const ft = Math.floor(ftDecimal);
    const inches = Math.round((ftDecimal - ft) * 12);
    return `${ft}' ${inches}"`;
}