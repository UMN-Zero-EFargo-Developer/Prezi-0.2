function getCountryData(type, countryName, startYear, endYear, callback){
    fetch(dataUrl(type, countryName, startYear, endYear))
        .then(response => {
            return response.json();
        })
        .then(data => {
            callback(data);
        });
}


/**
 * - type options: [ TFCShareBySector, CO2PerCap, SDG72 ]; 
 * - if TFCShareBySector is entered, please configure the subset of the data. 
 * - flowLabels for TFCShareBySector: [Transport, Industry, Residential, Commercial and public services, Agriculture / forestry, Non-energy use, Non-specified]
 * @param {String} type
 * @param {String} year
 * @param {Function} callback 
 */
function getGlobalDataByYear(type, year, callback){
    const loader = new Preloader("Loading...");
    loader.createLoader();
    fetch(dataUrl(type, null, year, year))
        .then(response => {
            return response.json();
        })
        .then(data => {
            callback(data);
            loader.removeLoader();
        });
}


/**
 * 
 * @param {String} factor - options: [ TFCShareBySector, CO2PerCap, SDG72 ]
 * @param {String} country - Optional
 * @param {String} startYear - Optional parameter, default value is "1990"
 * @param {String} endYear - Optional parameter
 * @returns 
 */
function dataUrl(factor, country, startYear=1990, endYear){
    let url = `https://api.iea.org/stats/indicator/${factor}?`;
    if(country) {
        url += `countries=${country}&`;
    }
    if (startYear) {
        url += `startYear=${startYear}&`;
    }
    if (endYear) {
        url += `endYear=${endYear}`
    }
    console.log(url)
    return url;
}