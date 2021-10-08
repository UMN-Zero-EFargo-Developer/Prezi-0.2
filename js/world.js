const bgVideo = document.querySelector("#bgVideo");
const btnSpeed = document.querySelectorAll(".btn-speed");
const btnStop = document.querySelector("#btnStop");
const popup = document.querySelector(".popup");
const btnClose = document.querySelector(".btn-close");

const VIDEO_URL = [
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_reduce.mp4?alt=media&token=07ba99ea-f6cd-49fc-8e43-057ab5a4ff89",
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_increase.mp4?alt=media&token=ff569ee6-39a3-46c0-86d6-6630cd5a6323",
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_1.mov?alt=media&token=f6f19891-fada-4ac3-bcd9-6e92b9ac74ee",
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_2.mov?alt=media&token=d6fcf825-de26-45b4-92ce-bbc909dca27b",
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_3.mov?alt=media&token=33f1660b-6c20-4038-ae1a-4edf17aef16e",
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_4.mov?alt=media&token=69ffd9c9-5341-432f-9561-c59a43c50888",
    "https://firebasestorage.googleapis.com/v0/b/efargo-62eea.appspot.com/o/co2_5.mov?alt=media&token=230a90cc-a20b-4ba7-a51c-c5f7961f5e84"
]

bgVideo.addEventListener("loadedmetadata", () => {
    this.currentTime = 80;
});

bgVideo.addEventListener("ended", event => {
    popup.classList.remove("hide");
});

btnSpeed.forEach( btn => {
    btn.addEventListener("click", event => {
        bgVideo.play();
        bgVideo.playbackRate = event.target.dataset.speed;
    });
});

btnStop.addEventListener("click", event => {
    bgVideo.pause();
});

btnClose.addEventListener("click", event => {
    event.target.parentNode.classList.add("hide");
})


