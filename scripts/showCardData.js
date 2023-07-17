"use strict";
import { getData } from "./home.js";
import PLATFORM_ICONS from "./platformIcons.js";
import formattedDate from "./formattedDate.js";

const API_KEY = "ce0e55ad125d4dabba067f72f6fcfc66";
const API_PATH = "https://api.rawg.io/api/";
const MODAL = document.getElementById("gameModal");
const MODAL_BODY = document.querySelector("#gameModal .gameModalBody");
const MODAL_IMAGES = document.querySelector("#gameModal .gameImages");
const CLOSE_MODAL_BTN = document.getElementById("closeModalBtn");
let platformsSvg = [];

function showGameInfo(gameData, gameScreenshots) {
    let platforms = [];
    let releaseDate = "No release data found...";
    let genres = [];
    let developers = [];
    let defaultImgSrc = "img/img-placeholder.png";
    let images = {
        0: defaultImgSrc,
        1: defaultImgSrc,
        2: defaultImgSrc,
        3: defaultImgSrc,
        4: defaultImgSrc
    };

    MODAL.style.backgroundImage = `
    linear-gradient(
        180deg,
        rgba(48, 48, 48, 0),
        rgba(48, 48, 48, 1) 22.4rem
    ),
    url("${gameData.background_image}"`;

    if (gameData.genres) {
        gameData.genres.forEach((genre) => genres.push(genre.name));
    } else {
        genres.push("No genres data available...");
    }

    if (gameData.parent_platforms) {
        if (platformsSvg.length != 0) {
            platformsSvg = [];
        }
        gameData.parent_platforms.forEach((platform) => {
            if (PLATFORM_ICONS[platform.platform.slug]) {
                platformsSvg.push(PLATFORM_ICONS[platform.platform.slug]);
            }
            platforms.push(platform.platform.name);
        });
    } else {
        platformsSvg.push("No platforms data available...");
    }

    if (gameData.released) {
        releaseDate = formattedDate(gameData.released);
    }

    if (gameData.developers) {
        gameData.developers.forEach((dev) => developers.push(dev.name));
    }

    if (gameScreenshots) {
        for (let i = 0; i < gameScreenshots.results.length; i++) {
            const img = gameScreenshots.results[i];
            images[i] = img.image;
        }
    }

    let modalTemplate = `
        <div class="platforms">
            ${platformsSvg.join("")}
        </div>
        <h3>${gameData.name || "Game name was not found..."}</h3>
        <div class="achievements">
            <div>May 31, 2021</div>
            <div><span class="active-page">#1</span> TOP 2021</div>
            <div><span class="active-page">#9</span> RPG</div>
        </div>
        <div class="description-container">
            <p class="description">
                ${
                    gameData.description_raw ||
                    "Game description was not found..."
                }
            </p>
            <p class="active-page" id="readMoreBtn">
                Read more
            </p>
        </div>
        <div class="buttons-container">
            <div class="add-to-wishlist-container">
                <button>Add to wishlist</button>
                <img src="img/components/heart.svg">
            </div>
            <button class="purchase-button">
                Purchase
            </button>
        </div>
        <div class="game-properties">
            <div class="game-property-container platforms-name">
                <p>Platforms</p>
                <a href="#">${platforms.join(", ")}</a>
            </div>
            <div class="game-property-container release">
                <p>Release date</p>
                <p>${releaseDate}</p>
            </div>
            <div class="game-property-container publisher">
                <p>Publisher</p>
                <a href="#">
                    ${gameData.publishers[0]?.name || "No publishers found..."}
                </a>
            </div>
            <div class="game-property-container website">
                <p>Website</p>
                <a href="${gameData.website || "#"}">${gameData.website}</a>
            </div>
            <div class="game-property-container genre">
                <p>Genre</p>
                <a href="#">${genres.join(", ")}</a>
            </div>
            <div class="game-property-container developer">
                <p>Developer</p>
                <a href="#">${developers.join(", ")}</a>
            </div>
            <div class="game-property-container age-rating">
                <p>Age rating</p>
                <p>${gameData.esrb_rating?.name || "Not rated"}</p>
            </div>
        </div>
        <div class="game-critics-container">
            <a><img src="img/components/chat-bubbles.svg"></a>
            <a><img src="img/components/thumbs-up.svg"></a>
            <a><img src="img/components/action.svg"></a>
        </div>

        <div class="gameImages">
            <div>
                <img src="${images[0]}" alt="Background image 1 for
                    ${gameData?.name}">
                <img class="yt-play-btn" src="img/components/play-video-button.svg">
            </div>
            <div>
                <img src="${images[1]}" alt="Background image 2 for
                    ${gameData?.name}">
                <img src="${images[2]}" alt="Background image 3 for
                    ${gameData?.name}">
            </div>
            <div>
                <img src="${images[3]}" alt="Background image 4 for
                    ${gameData?.name}">
                <img src="${images[4]}" alt="Background image 5 for
                    ${gameData?.name}">
            </div>
        </div>
    `;

    MODAL_BODY.innerHTML = modalTemplate;
}

/* Fetch data and display the modal */
async function showModal(e) {
    const CARD_CONTAINER = e.target.closest(".game-card");
    if (!CARD_CONTAINER || !CARD_CONTAINER.dataset.id) {
        return 0;
    }
    const CARD_ID = CARD_CONTAINER.dataset.id;
    const data = await getData(`${API_PATH}games/${CARD_ID}?key=${API_KEY}`)
        .then((data) => data)
        .catch((err) => err.message);

    const screenshots = await getData(
        `${API_PATH}games/${CARD_ID}/screenshots?key=${API_KEY}`
    )
        .then((data) => data)
        .catch((err) => err.message);

    showGameInfo(data, screenshots);
    MODAL.showModal();
    showFullDescription();
    showFullDescriptionDesktop(data);
    document.body.classList.add("no-overflow");
    document.querySelector(".navbar").style.position = "sticky";
    document.querySelector(".navbar").style.zIndex = "999";
    document.querySelector(".navbar").style.top = "0";
}
document.addEventListener("click", showModal);

/* Close game modal */
MODAL.addEventListener("close", () => {
    document.body.classList.remove("no-overflow");
    MODAL.classList.remove("show-description");
});

CLOSE_MODAL_BTN.addEventListener("click", () => {
    MODAL.close();
});

/* Expand description */
/* Mobile and tablet */
function showFullDescription() {
    const MODAL_DESCRIPTION = document.querySelector("#gameModal .description");

    MODAL_DESCRIPTION.addEventListener("click", () => {
        if (window.innerWidth < 1200) {
            MODAL_DESCRIPTION.classList.toggle("expanded");
        }
    });
}

/* Desktop */
function showFullDescriptionDesktop(gameData) {
    const READ_MORE_BTN = document.getElementById("readMoreBtn");
    const CURRENT_BODY = MODAL_BODY.innerHTML;

    READ_MORE_BTN.addEventListener("click", () => {
        MODAL.classList.add("show-description");
        MODAL_BODY.innerHTML = `
            <svg id="backArrow" width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Left Chevron">
                <path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M23.4589 6.97093C23.738 7.25004 23.8947 7.62855 23.8947 8.02321C23.8947 8.41787 23.738 8.79638 23.4589 9.07549L14.0926 18.4418L23.4589 27.8081C23.7301 28.0889 23.8801 28.4648 23.8767 28.8551C23.8733 29.2453 23.7168 29.6186 23.4408 29.8946C23.1649 30.1705 22.7915 30.3271 22.4013 30.3304C22.0111 30.3338 21.6351 30.1838 21.3544 29.9127L10.9358 19.4941C10.6567 19.215 10.5 18.8365 10.5 18.4418C10.5 18.0472 10.6567 17.6686 10.9358 17.3895L21.3544 6.97093C21.6335 6.6919 22.012 6.53516 22.4067 6.53516C22.8013 6.53516 23.1798 6.6919 23.4589 6.97093Z" fill="white"/>
                </g>
            </svg>
            <div class="platforms">
                ${platformsSvg.join("")}
            </div>
            <h3>${gameData.name || "Game name was not found..."}</h3>
            <p class="description">
                ${
                    gameData.description_raw ||
                    "Game description was not found..."
                }
            </p>
        `;

        const BACK_ARROW = document.getElementById("backArrow");
        BACK_ARROW.addEventListener("click", () => {
            MODAL.classList.remove("show-description");
            MODAL_BODY.innerHTML = CURRENT_BODY;
            showFullDescriptionDesktop(gameData);
        });
    });
}
