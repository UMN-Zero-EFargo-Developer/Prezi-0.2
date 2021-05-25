var yearSelect = (selector, start, end) => {
    for ( let i = start; i <= end; i++ ) {
        appendNewElement(selector, {
            type: "option",
            props: {
                value: i,
                innerHTML: i
            }
            
        });
    }
}