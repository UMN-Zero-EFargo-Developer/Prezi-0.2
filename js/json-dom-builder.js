class Element {

    constructor(){
        this.node = null;
        this.dom = null
    }

    /**
     * 
     * @param {*} node 
     * @returns 
     */
    createNewElement(node) {
        this.node = node;
        this.dom = newElement(node);
        return this.dom;
    }
    
    /**
     * 
     * @param {String} selector 
     * @param {Object} node 
     */
    appendNewElement (selector, node) {
        this.dom = newElement(node)
        document.querySelector(selector).append(this.dom);
    }

    /**
     * 
     * @param {Object} node - An object that represent the structure of the DOM.
     * @param {String} node.type - The tag name of the top-level node.
     * @param {Object} [node.props]
     * @param {Object} [node.events] - A key-value paired list of events to be listened by eventlistener. For example, { click: e => { console.log("clicked!") } }
     * @param {[Object]} [node.chilren]
     * @returns DOM element
     */
    newElement (node) {

        const ele = document.createElement(node.type);

        for (key in node.props) {
            if (key.substring(0, 5) === "data_") {
                ele.dataset[key.substring(5)] = node.props[key]
            } else {
                ele[key] = node.props[key];
            }
        }

        if (node.events) {
            for (key in node.events) {
                ele.addEventListener(key, node.events[key]);
            }
        }

        if (node.children) {

            node.children.forEach(child => {
                const childEle = newElement(child);
                ele.append(childEle)
            });
        }

        return ele;
    }
}

class Atom {
    constructor() {
        this.dom = null;
        this.type = "";
        this.events = [];
        this.props = {};
    }

    setNode(node) {
        this.node = node;
    }

    createAtom(type, props=null, events=null) {

        this.type = type;

        const ele = document.createElement(type);

        if (props !== null) {

            this.props = props;

            for (let key in props) {
                if (key.substring(0, 5) === "data_") {
                    ele.dataset[key.substring(5)] = props[key]
                } else {
                    ele[key] = props[key];
                }
            }
        }
        

        if (events !== null) {
            this.events = events;
            for (let key in events) {
                ele.addEventListener(key, events[key]);
            }
        }

        this.dom = ele;
    }

    attachEvent(event, callback) {
        this.events[event] = callback;
        this.dom = null;
        this.createAtom(this.type, this.props, this.events);
    }
}

const atom = new Atom();

atom.createAtom("div", {
    className: "item",
    innerHTML: "Hello"
});
atom.attachEvent("click", e => {
    console.log("hello");
})
console.log(atom.dom);