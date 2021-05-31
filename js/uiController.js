const btnMenu = document.querySelector("#btnMenu");
const filterBox = document.querySelector(".filter");

btnMenu.addEventListener("click", e => {
    filterBox.classList.toggle("hide");
    if (filterBox.classList.contains("hide")) {
        e.target.className = "fas fa-bars";
    } else {
        e.target.className = "fas fa-times";
    }
});