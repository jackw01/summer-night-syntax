const chroma = require("chroma-js");
const fs = require("fs");
const gm = require("gm");

const h = 274, c = 7; // Master hue, chroma for mono colors
const minL = 15, maxL = 92; // Mono luminance scale
const l = 62; // Master foreground luminance

function map(x, inMin, inMax, outMin, outMax) {
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const colors = [
    {name: "mono-1", value: [h, c, map(1, 8, 1, minL, maxL)]}, // BG
    {name: "mono-2", value: [h, c, map(2, 8, 1, minL, maxL)]}, // BG - darker
    {name: "mono-3", value: [h, c, map(3, 8, 1, minL, maxL)]}, // Mid gray 1
    {name: "mono-4", value: [h, c, map(4, 8, 1, minL, maxL)]}, // Mid gray 2
    {name: "mono-5", value: [h, c, map(5, 8, 1, minL, maxL)]}, // Mid gray 3
    {name: "mono-6", value: [h, c, map(6, 8, 1, minL, maxL)]}, // Mid gray 4
    {name: "mono-7", value: [h, c, map(7, 8, 1, minL, maxL)]}, // BG - lighter
    {name: "mono-8", value: [h, c, map(8, 8, 1, minL, maxL)]}, // BG
    {name: "hue-3",  value: [  7, 63,    l]}, // Magenta
    {name: "hue-5",  value: [ 25, 56,    l]}, // Red
    {name: "hue-7",  value: [ 46, 53,    l]}, // Red-orange
    {name: "hue-6",  value: [ 62, 50,    l]}, // Orange
    {name: "hue-4",  value: [ 84, 48, l+10]}, // Yellow
    {name: "hue-8",  value: [184, 48,    l]}, // Green
    {name: "hue-2",  value: [208, 44,    l]}, // Teal
    {name: "hue-1",  value: [240, 40,    l]}, // Blue
];

var generated = "", image = gm(1320, 360, "#ffffff");

for (var i = 0; i < colors.length; i++) {

    var hsl = chroma.hcl(colors[i].value).hsl(), hex = chroma.hcl(colors[i].value).hex();
    generated += `@${colors[i].name}: hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%);\n`;
    console.log(`${colors[i].name}: ${hex}`);

    var x = (i % 8) * 160, y = Math.floor(i / 8) * 160;
    image.fill(hex).drawRectangle(x + 40, y + 40, x + 160, y + 160, 20, 20);
}

fs.writeFile("styles/colors-generated.less", generated, err => { if (err) console.log(err); });
image.write("colors.png", err => { if (err) console.log(err); });
