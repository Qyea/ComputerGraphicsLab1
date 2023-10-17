window.addEventListener('DOMContentLoaded', function() {
    const rgbInput = document.getElementById('rgb');
    const cmykInput = document.getElementById('cmyk');
    const hslInput = document.getElementById('hsl');

    const redSlider = document.getElementById('red');
    const greenSlider = document.getElementById('green');
    const blueSlider = document.getElementById('blue');

    const colorInput = document.getElementById('color-picker');

    function updateColor() {
        const red = redSlider.value;
        const green = greenSlider.value;
        const blue = blueSlider.value;

        const rgbColor = `rgb(${red}, ${green}, ${blue})`;
        const cmykColor = rgbToCmyk(red, green, blue);
        const hslColor = rgbToHsl(red, green, blue);

        const colorPreview = document.querySelector('.color-preview');
        colorPreview.style.backgroundColor = rgbColor;

        rgbInput.value = rgbColor;
        cmykInput.value = cmykColor;
        hslInput.value = hslColor;
        colorInput.value = rgbToHex(rgbColor);
    }

    function convertHexToRGB(hex) {
        hex = hex.replace('#', '');
      
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
      
        return `rgb(${r}, ${g}, ${b})`;
    }
    function rgbToHex(hslString) {
        const values = hslString.substring(4, hslString.length - 1).split(',');

        let r = parseInt(values[0].trim());
        let g = parseInt(values[1].trim());
        let b = parseInt(values[2].trim());
        
        const componentToHex = (c) => {
          const hex = c.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };
      
        const hexR = componentToHex(r);
        const hexG = componentToHex(g);
        const hexB = componentToHex(b);
      
        return `#${hexR}${hexG}${hexB}`;
      }

    function rgbToCmyk(red, green, blue) {
        const r = red / 255;
        const g = green / 255;
        const b = blue / 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k);
        const m = (1 - g - k) / (1 - k);
        const y = (1 - b - k) / (1 - k);

        return `cmyk(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(y * 100)}, ${Math.round(k * 100)})`;
    }
    
    function hlsToRgb(hslString) {
        const values = hslString.substring(4, hslString.length - 1).split(',');

        let hue = parseInt(values[0].trim());
        let saturation = parseInt(values[1].trim());
        let lightness = parseInt(values[2].trim());

        hue = hue / 360;

        saturation = saturation / 100;
        lightness = lightness / 100;

        let r, g, b;
        if (saturation === 0) {
            r = g = b = lightness;
        } else {
            const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
            };

            const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;

            r = hueToRgb(p, q, hue + 1 / 3);
            g = hueToRgb(p, q, hue);
            b = hueToRgb(p, q, hue - 1 / 3);
        }

        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }

    function cmykToRgb(cmyk) {
        const cmykString = cmyk;
        const values = cmykString.substring(5, cmykString.length - 1).split(',');

        const cyan = parseInt(values[0].trim());
        const magenta = parseInt(values[1].trim());
        const yellow = parseInt(values[2].trim());
        const key = parseInt(values[3].trim());

        const denominator = key/100;
        const r = 255 * (1 - cyan/100) * (1 - denominator);
        const g = 255 * (1 - magenta/100) * (1 - denominator);
        const b = 255 * (1 - yellow/100) * (1 - denominator);

        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    function rgbToHsl(r, g, b) {
        r /= 255
        g /= 255
        b /= 255
        const l = Math.max(r, g, b)
        const s = l - Math.min(r, g, b)
        const h = s
            ? l === r
                ? (g - b) / s
                : l === g
                    ? 2 + (b - r) / s
                    : 4 + (r - g) / s
            : 0
        return `hsl(${Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h)}, ${Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0))}, ${Math.round((100 * (2 * l - s)) / 2)})`
    }

    function updateColorByInputs() {
        const rgbValue = rgbInput.value;
        const regex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
        const matches = rgbValue.match(regex);
    
        if (matches) {
            const red = parseInt(matches[1]);
            const green = parseInt(matches[2]);
            const blue = parseInt(matches[3]);
            
            redSlider.value = red;
            greenSlider.value = green;
            blueSlider.value = blue;
            
            updateColor();
        }
    }
    
    colorInput.addEventListener('change', function() {
        const hexColor = colorInput.value;
        const rgbColor = convertHexToRGB(hexColor);
        rgbInput.value = rgbColor;
        
        updateColorByInputs();
    });

    function updateColorByInputCYMK() {
        const cmykColor = cmykInput.value;
        const rgbColor = cmykToRgb(cmykColor);

        rgbInput.value = rgbColor;      
        updateColorByInputs();
    }

    function updateColorByInputHSL() {
        const hslString = hslInput.value;
        const rgbColor = hlsToRgb(hslString);
        rgbInput.value = rgbColor;
            
        updateColorByInputs(); 
    }

    redSlider.addEventListener('input', updateColor);
    greenSlider.addEventListener('input', updateColor);
    blueSlider.addEventListener('input', updateColor);

    rgbInput.addEventListener('input', updateColorByInputs);
    cmykInput.addEventListener('input', updateColorByInputCYMK);
    hslInput.addEventListener('input', updateColorByInputHSL);

    updateColor();
});