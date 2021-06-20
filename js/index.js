const factorFilter = document.querySelector("#filterFactor");
const tfcFactorsFilter = document.querySelector("#tfcFactors");
const yearFilter = document.querySelector("#year");
const btnFilterResult = document.querySelector("#btnFilterResult");
const btnRemoveAll = document.querySelector("#btnRemoveAll");
const btnZoomLevels = document.querySelectorAll(".btn-zoom-level");
const legend = document.querySelector(".legend");

yearSelect("#year", 1990, 2019);
factorFilter.value = FACTORS.CO2PerCap;
tfcFactorsFilter.value = TFC_FACTORS.transport;
yearFilter.value = 1990;

const mapStyles = {
    game: "mapbox://styles/aayang/cko38cbzf00he17mtkvtkw0xn",
    monochrome: 'mapbox://styles/aayang/ckfhnnlks0b7v19l7oxweshja',
    dark: "mapbox://styles/aayang/ckhe5w9l707zu19obadmd6z7c",
    satellite: "mapbox://styles/aayang/ckp4he3i76y7r17o06j376l9o"
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYWF5YW5nIiwiYSI6ImNrY3RxeXp5OTBqdHEycXFscnV0czY4ajQifQ.jtVkyvY29tGsCZSQlELYDA';
var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyles.game,
    center: [-96.7898, 46.8772],
    zoom: 16,
    pitch: 60,
    bearing: 160
});

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

const gameSource = "game-source";
const pointLayer = "game-points";

const gameCircles = {
    'id': 'game-points',
    'type': 'symbol',
    'source': gameSource,
    'layout': {
        'icon-image': 'game', // reference the image
        'icon-size': 0.25
    },
    'filter': ['==', '$type', 'Point']
}


var data = [];

map.on('load', function () {

    map.setFog({
        'range': [-1, 1.5],
        'color': 'white',
        'horizon-blend': 0.1
        });

    // The 'building' layer in the Mapbox Streets
            // vector tileset contains building height data
            // from OpenStreetMap.
            map.addLayer({
                'id': 'add-3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#ffcc00',

                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            },
        );

    addSchoolMarkers(SCHOOLS);

    factorFilter.addEventListener("change", e => {
        if (e.target.value === "TFCShareBySector") {
            tfcFactorsFilter.classList.remove("hide");
        } else {
            tfcFactorsFilter.classList.add("hide");
        }
    });

    btnFilterResult.addEventListener("click", e => {
        data = [];
        removeLayerSource("countries-join", "countries")
        if (factorFilter.value === FACTORS.TFCShareBySector) {
            getGlobalDataByYear(factorFilter.value, yearFilter.value, fetchedData => {
                console.log(tfcFactorsFilter.value);
                addDataToMap(fetchedData.filter(item => item.flowLabel === tfcFactorsFilter.value));
            });
        } else {
            getGlobalDataByYear(factorFilter.value, yearFilter.value, fetchedData => {
                addDataToMap(fetchedData);
            });
        }
    });

    map.loadImage("/../assets/image/game.png", (err, image) => {
        if (err) {
            throw err;
        }

        map.addImage('game', image);

        loadPoints(GAME_DATA, gameCircles);
    });



});

map.on('zoom', () => {
    if (map.getZoom() >= 11) {
        addSchoolMarkers(SCHOOLS);
    } else {
        removeAllSchoolMarkers();
    }
})

map.on('click', pointLayer, function (e) {

    var features = map.queryRenderedFeatures(e.point, {
        layers: [pointLayer]
    });
    console.log(e.features[0]);
    var feature = e.features[0];

    var popup = new mapboxgl.Popup({
            offset: [0, 0]
        }).setLngLat(feature.geometry.coordinates)
        .setHTML(popup_HTML(feature.properties))
        .addTo(map);
});

map.on('click', function (e) {
    console.log(e.lngLat);
    map.flyTo({
        center: e.lngLat,
        essential: true
    });
});

for (let i = 0; i < btnZoomLevels.length; i++) {
    btnZoomLevels[i].addEventListener("click", e => {
        map.zoomTo(e.target.dataset.level);
    })
}

btnRemoveAll.addEventListener("click", e => {
    removeLayerSource("countries-join", "countries")
});

/**
 * ----------------------------
 * ----------------------------
 * ----------------------------
 * ----------------------------
 * 
 * 
 * Function Definitions
 * 
 * 
 * ----------------------------
 * ----------------------------
 * ----------------------------
 * ----------------------------
 */

function addDataToMap(fetchedData) {


    // Add source for country polygons using the Mapbox Countries tileset
    // The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
    // https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
    map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
    });

    const maxValue = Math.max(...fetchedData.map(({
        value
    }) => value)) * 1.5;
    console.log(fetchedData);

    fetchedData.forEach(item => {
        // console.log(item.value/30);
        if (item.value) {
            data.push({
                'code': item.country,
                'hdi': 1 - item.value / maxValue
            });
        }

    });

    console.log(data);

    // Build a GL match expression that defines the color for every vector tile feature
    // Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
    var matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];

    // Calculate color values for each country based on 'hdi' value
    data.forEach(function (row) {
        // Convert the range of data values to a suitable color
        var brightness = row['hdi'];
        var color = hslToRgb(FACTOR_COLOR[factorFilter.value].h, FACTOR_COLOR[factorFilter.value].s, brightness);

        matchExpression.push(row['code'], color);
    });

    // Last value is the default, used where there is no data
    matchExpression.push('rgba(0, 0, 0, 0)');

    // Legend color cales
    legend.style = `background:linear-gradient(180deg, ${hslToRgb(FACTOR_COLOR[factorFilter.value].h, FACTOR_COLOR[factorFilter.value].s, 0.3)} 0%, ${hslToRgb(FACTOR_COLOR[factorFilter.value].h, FACTOR_COLOR[factorFilter.value].s, 0.95)} 100%);`

    // Add layer from the vector tile source to create the choropleth
    // Insert it below the 'admin-1-boundary-bg' layer in the style
    map.addLayer({
            'id': 'countries-join',
            'type': 'fill',
            'source': 'countries',
            'source-layer': 'country_boundaries',
            'paint': {
                'fill-color': matchExpression
            }
        },
        'admin-1-boundary-bg'
    );
}

function removeLayerSource(mapLayer, mapSource) {
    if (map.getLayer(mapLayer)) {
        map.removeLayer(mapLayer);
    }
    if (map.getSource(mapSource)) {
        map.removeSource(mapSource);
    }
}

function loadPoints(data, pointConfig) {
    let geoData = makeGeoData(data);

    map.addSource(gameSource, {
        'type': 'geojson',
        'data': geoData
    });
    console.log(geoData)
    map.addLayer(pointConfig);
}



function addSchoolMarkers(markerData) {

    markerData.forEach(marker => {
        var popup = new mapboxgl.Popup().setHTML(
            `<h5>${marker.name} </h5>
            <p>Score: ${marker.score}</p>`
        );

        var el = document.createElement("div");
        el.innerHTML = "Score:" + marker.score;
        el.className = "school_marker";
        el.tyle = "background: white; height: 50px; width: 50px; z-index: 200;"

        // create the marker for User
        var marker = new mapboxgl.Marker(el)
            .setLngLat(marker.coord)
            .setOffset([0, -20])
            .setPopup(popup)
            .addTo(map);
    });

}

let removeAllSchoolMarkers = function () {

    const markers = document.querySelectorAll(".school_marker");

    markers.forEach((marker) => {
        marker.remove();
    });
};