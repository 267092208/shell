export function hexToRgba(hex, opacity) {
    if (hex.length == 4) {
        hex = '#' +
            hex
                .slice(hex.startsWith('#') ? 1 : 0)
                .split('')
                .map(x => x + x)
                .join('');
    }
    let color = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")"
    return color;
}

export function rgbaToHex(color) {
    var rgb = color.split(",");
    var r = parseInt(rgb[0].split("(")[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(")")[0]);
    var hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    var opacity = rgb[3] ? rgb[3]
        .trim()
        .split(")")[0] : 1;
    return {
        hex,
        opacity
    };
}

export function rgbToHex(color) {
    var rgb = color.split(",");
    var r = parseInt(rgb[0].split("(")[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(")")[0]);
    var hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return {
        hex,
        opacity: 1
    };
}