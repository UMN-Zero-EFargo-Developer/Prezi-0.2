class Preloader {
    /**
     * 
     * @param {string} [info=""] 
     */
    constructor(info=""){
        this.info = info;
    }

    createLoader(){
        const loadingBox = document.createElement("div");
        loadingBox.style = "position: fixed; display:flex; top:0; left:0; width:100%; bottom:0; background:rgba(0, 0, 0, 0.7); justify-content:center; align-items:center;";
        loadingBox.className = "loading-box";
        loadingBox.innerHTML = "<img src='https://firebasestorage.googleapis.com/v0/b/asset-host-aayang.appspot.com/o/loading_Plant.gif?alt=media&token=9631ab87-ccd3-495c-aaf4-fda1b5bf0ae5' style='width:100px'/>"
        document.querySelector("body").append(loadingBox);
        if (this.info.length>0) {
            console.log(this.info);
        }
    }

    removeLoader(){
        const loader = document.querySelector(".loading-box");
        if (loader) {
            loader.remove();
            console.log("Data loaded!");
        }
    }
}