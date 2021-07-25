/**
 * 
 * @param {JSON} node 
 * @returns 
 */
 const newDom = (node) => {

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
            const childEle = newDom(child);
            ele.append(childEle)
        });
    }

    return ele;
}

const closeBtns = document.querySelectorAll(".btn-close");
for(let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener("click", e => {
        console.log("clicked");
        e.target.parentNode.classList.add("hide");
    });
}

function hideElement(targetSelector) {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement !== null) {
        targetElement.classList.add("hide");
    }
}

const playerMarker = (data) => {
    return newDom({
        type: "div",
        props: {
            className: "player-marker",
            style: `border-radius: 50%; border: ${data.score / 300 * 80}px solid rgba(112,255,7,0.25); background-color: rgba(112,255,7,0.25)`
        },
        children: [
            {
                type: "div",
                props: {
                    className: "player-avatar",
                    style: `background: url("../assets/image/${data.image}"); background-size: cover; height: 50px; width: 50px`
                }
            }
        ]
    });
}

const playerPopup = (data) => {
    return (
        `<div class="player-popup">
            <h2>${data.name} </h2>
            <p>Carbon Coins: ${data.score} | Rank: ${data.rank}</p>
            <button>My Design</button>
        </div>`
    );
}

const powerPopup = (data) => {
    return (
        `<div class="power-popup">
            <h3>${data.properties.Name} </h3>
            <p>County: ${data.properties.Location}</p>
            <p>Capacity: ${data.properties.Capacity}</p>
            <button>Connect</button>
        </div>`
    )
}