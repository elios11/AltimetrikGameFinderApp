"use strict";
import { getData } from "./home.js";
import PLATFORM_ICONS from "./platformIcons.js";
import formattedDate from "./formattedDate.js";

const API_KEY = "ce0e55ad125d4dabba067f72f6fcfc66";
const API_PATH = "https://api.rawg.io/api/";
const MODAL = document.getElementById("gameModal");
const MODAL_BODY = document.querySelector("#gameModal .gameModalBody");
const MODAL_IMAGES = document.querySelector("#gameModal .gameImages");

function showGameInfo(gameData, gameScreenshots) {
    let platformsSvg = [];
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
    console.log(gameData);
    console.log(gameScreenshots);

    if (gameData.genres) {
        gameData.genres.forEach((genre) => genres.push(genre.name));
    } else {
        genres.push("No genres data available...");
    }

    if (gameData.parent_platforms) {
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
        <p class="description">
            ${gameData.description_raw || "Game description was not found..."}
        </p>
        <div class="add-to-wishlist-container">
            <button>Add to wishlist</button>
            <img src="img/components/heart.svg">
        </div>
        <button class="purchase-button">
            Purchase
        </button>
        <div class="game-property-container">
            <p>Platforms</p>
            <a href="#">${platforms.join(", ")}</a>
        </div>
        <div class="game-property-container">
            <p>Release date</p>
            <p>${releaseDate}</p>
        </div>
        <div class="game-property-container">
            <p>Publisher</p>
            <a href="#">
                ${gameData.publishers[0]?.name || "No publishers found..."}
            </a>
        </div>
        <div class="game-property-container">
            <p>Website</p>
            <a href="${gameData.website || "#"}">${gameData.website}</a>
        </div>
        <div class="game-property-container">
            <p>Genre</p>
            <a href="#">${genres.join(", ")}</a>
        </div>
        <div class="game-property-container">
            <p>Developer</p>
            <a href="#">${developers.join(", ")}</a>
        </div>
        <div class="game-property-container">
            <p>Age rating</p>
            <p>${gameData.esrb_rating?.name || "Not rated"}</p>
        </div>
        <div class="game-critics-container">
            <a><img src="img/components/chat-bubbles.svg"></a>
            <a><img src="img/components/thumbs-up.svg"></a>
            <a><img src="img/components/action.svg"></a>
        </div>
    `;

    let gameImagesTemplate = `
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
    `;
    MODAL_IMAGES.innerHTML = gameImagesTemplate;
    MODAL_BODY.innerHTML = modalTemplate;
}

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
    document.body.style.overflow = "hidden";
    document.querySelector(".navbar").style.position = "sticky";
    document.querySelector(".navbar").style.zIndex = "999";
    document.querySelector(".navbar").style.top = "0";
}
document.addEventListener("click", showModal);

function closeModal() {}

function showFullDescription() {
    const MODAL_DESCRIPTION = document.querySelector("#gameModal .description");

    MODAL_DESCRIPTION.addEventListener("click", () => {
        MODAL_DESCRIPTION.classList.toggle("expanded");
    });
}
