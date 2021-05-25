

/**
 * 
 * @param {Object} dataObj 
 * @returns 
 */
 function makeGeoData(dataObj){
    console.log(dataObj);
    let geoData = {
        features: [],
        type: "FeatureCollection"
    }

    for (key in dataObj) {
        geoData.features.push(makeGeoFeature(dataObj[key]));
    }

    return geoData;
}

/**
 * 
 * @param {Object} data 
 * @returns geolocation object
 */
function makeGeoFeature(data) {

    let geoFeature = {
        geometry: {
            coordinates: data.coord,
            type: "Point"
        },
        properties: data,
        type: "Feature"
    };

    return geoFeature;
};

function loadPoints(data, pointConfig){
    let geoData = makeGeoData(data);

    map.addSource(pointSource, {
        'type': 'geojson',
        'data': geoData
    });

    map.addLayer(pointConfig);
}


function popup_HTML(featureObj) {
    console.log(featureObj);
    let websiteBtn = "";
    if (featureObj.website) {
        websiteBtn = `<a class="btn-play-game" href=${featureObj.website} target="_blank">Play the Game</a>`
    }
    let container = `<div>
        <h3 class="popup-title">${featureObj.name}</h3>
        <div class="popup-body">${featureObj.content}${websiteBtn}</div>
    </div>`
    
    return container;
}

function addMarker(markerData, popupModel) {    

    let content =`<div class="row">
                    <div class="col-4"><img class="user-photo" src="${markerData.image}"/></div>
                    <div class="col-8">
                    <h5>${markerData.gameName}</h5>
                    <p>${markerData.genre}</p>
                    <p>${markerData.pitch}</p>
                    </div>
                 </div>`;


    // create the popup
    var popup = new mapboxgl.Popup({
        offset: 60
    }).setHTML(content);

    // create DOM element for the marker of User
    var el = document.createElement('div');
    el.className = 'marker';
    el.style = `background-image: url(${markerData.image})`

    // create the marker for User
    var marker = new mapboxgl.Marker(el)
        .setLngLat(markerData.coordinates)
        .setOffset([0, -60])
        .setPopup(popup)
        .addTo(map);
}