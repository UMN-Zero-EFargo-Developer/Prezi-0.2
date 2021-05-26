/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
 function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 1)`
}

/**
 * 
 * @param {String} selector 
 * @param {Object} node 
 */
 var appendNewElement = (selector, node) => {
    const container = document.querySelector(selector);
    if(container) {
        container.append(newElement(node));
    } else {0
        throw new Error("The selector is not existent.");
    }
    
}

/**
 * This function helps you create DOM element from JSON-structured data.
 * @param {Object} node - An object that represent the structure of the DOM.
 * @param {string} node.type
 * @param {Object} [node.props]
 * @param {Object[]} [node.children]
 * @param {Object[]} [node.events]
 * @returns DOM element
 */
 var newElement = (node) => {

    const ele = document.createElement(node.type);

    for ( key in node.props) {
        if (key.substring(0, 5) === "data_") {
            ele.dataset[key.substring(5)] = node.props[key]
        } else {
            ele[key] = node.props[key];
        }
    }

    if (node.events) {
        for ( key in node.events) {
            ele.addEventListener( key, node.events[key]);
        }
    }

    if (node.children) {
  
        node.children.forEach( child => {
            const childEle = newElement(child);
            ele.append(childEle)
        });
    }

    return ele;
}



