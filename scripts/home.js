"use strict";
import formattedDate from "./formattedDate.js";
import isLocalEnabled from "./localStorageEnabled.js";
import PLATFORM_ICONS from "./platformIcons.js";

const CARDS_CONTAINER = document.getElementById("cardsContainer");
const API_KEY = "ce0e55ad125d4dabba067f72f6fcfc66";
const API_PATH = "https://api.rawg.io/api/";
let cardsArray = [];

/* Fetches data from URL */
export async function getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Cannot fetch the data, error with status ${response.status}`
        );
    }

    const data = await response.json();
    return data;
}

/* Fetches games data and creates an HTML template to display it */
async function displayGames(url) {
    cardsArray = await getData(url)
        .then((data) => data.results)
        .catch((err) => err.message);

    let gamesTemplate = ``;

    const favoriteHeart = `
            <svg class="favoriteHeart" width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="add to wishlist icon">
                <g filter="url(#filter0_d_11124_9524)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3335 9.33336C10.4802 9.33336 9.00016 10.8174 9.00016 12.6227C9.00016 14.6547 10.1762 16.8227 11.9948 18.9467C13.5228 20.7294 15.3788 22.3374 17.0002 23.6347C18.6215 22.3374 20.4775 20.728 22.0055 18.9467C23.8242 16.8227 25.0002 14.6534 25.0002 12.6227C25.0002 10.8174 23.5202 9.33336 21.6668 9.33336C19.8135 9.33336 18.3335 10.8174 18.3335 12.6227C18.3335 12.9763 18.193 13.3155 17.943 13.5655C17.6929 13.8156 17.3538 13.956 17.0002 13.956C16.6465 13.956 16.3074 13.8156 16.0574 13.5655C15.8073 13.3155 15.6668 12.9763 15.6668 12.6227C15.6668 10.8174 14.1868 9.33336 12.3335 9.33336ZM17.0002 8.87869C16.4356 8.18636 15.7238 7.62859 14.9165 7.24595C14.1092 6.86331 13.2268 6.66543 12.3335 6.66669C9.03216 6.66669 6.3335 9.32003 6.3335 12.6227C6.3335 15.624 8.02283 18.4094 9.9695 20.6814C11.9442 22.9867 14.3655 24.972 16.1815 26.3854C16.4156 26.5674 16.7036 26.6663 17.0002 26.6663C17.2967 26.6663 17.5848 26.5674 17.8188 26.3854C19.6348 24.972 22.0562 22.9854 24.0308 20.6814C25.9775 18.4094 27.6668 15.624 27.6668 12.6227C27.6668 9.32003 24.9682 6.66669 21.6668 6.66669C19.7868 6.66669 18.1015 7.52803 17.0002 8.87869Z" fill="white"/>
                </g>
                <defs>
                    <filter id="filter0_d_11124_9524" x="-5" y="-6" width="44" height="43.9984" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="3"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11124_9524"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11124_9524" result="shape"/>
                    </filter>
                </defs>
            </svg>`;

    let elements_count = cardsArray.length;

    if (elements_count == 0) {
        CARDS_CONTAINER.innerHTML = `<h1 class="wrong-search-fb">Couldn't find any games for your search...</h1>`;
        return;
    }

    for (let i = 0; i < elements_count; i++) {
        let element = cardsArray[i];
        let genres = [];
        let platforms = [];
        let releaseDate = "No release data found...";

        if (element.genres) {
            element.genres.forEach((genre) => genres.push(genre.name));
        } else {
            genres.push("No genres data available...");
        }

        if (element.parent_platforms) {
            element.parent_platforms.forEach((platform) => {
                if (PLATFORM_ICONS[platform.platform.slug]) {
                    platforms.push(PLATFORM_ICONS[platform.platform.slug]);
                }
            });
        } else {
            platforms.push("No platforms data available...");
        }

        /* Create formatted date for obtained data date */
        if (element.released) {
            releaseDate = formattedDate(element.released);
        }

        //prettier-ignore
        gamesTemplate += `
                <div class="game-card" data-id="${element.id}">
                    <div class="game-card--img-container">
                        <img src="${element.background_image || ""}" alt="${element.name || ""} cover picture">
                        ${favoriteHeart}
                    </div>
                    <div class="game-card--title-section">
                        <h3 class="game-card--title">${element.name || ""}</h3>
                        <p class="game-card--id">#${element.id || ""}</p>
                    </div>
                    <div class="game-card--body">
                        <div class="game-card--info-container">
                            <div class="game-card--info">
                                <h5 class="game-card--info-release">Release date:</h5>
                                <h6 class="game-card--info-content">
                                    ${releaseDate}
                                </h6>
                            </div>
                            <div class="game-card--info">
                                <h5 class="game-card--info-release">Genres:</h5>
                                <h6 class="game-card--info-content">
                                    ${genres.join(", ")}
                                </h6>
                            </div>
                        </div>
                        <div class="platforms-container">
                            ${platforms.join("")}
                        </div>
                    </div>
                </div>
            `;
    }
    CARDS_CONTAINER.innerHTML = gamesTemplate;
}
displayGames(`${API_PATH}games?key=${API_KEY}`);

/* Activates toggling to show main menu in smaller screens */
function toggleMainMenu() {
    document.body.classList.toggle("menu-open");
    document.querySelector("aside.main-menu").classList.toggle("show-mobile");
}
const HAMBURGER_MENU = document.getElementsByClassName("hamburger-menu")[0];
HAMBURGER_MENU.addEventListener("click", toggleMainMenu);

/* Searching game functionality */
function searchGame(searchInput) {
    const SEARCH_GAME_PATH = `${API_PATH}games?search=${searchInput}&search_precise&page_size=20&key=${API_KEY}`;
    displayGames(SEARCH_GAME_PATH);

    /* If local storage is enabled, add the search to last searches list */
    /* prettier-ignore */
    if (!isLocalEnabled("You cannot store last searches without Local Storage/Cookies enabled")) {
        return 0;
    }

    let lastSearches = [];
    if (localStorage.getItem("lastSearches")) {
        lastSearches = JSON.parse(localStorage.getItem("lastSearches"));
    }
    if (searchInput !== "" && !lastSearches.includes(searchInput)) {
        lastSearches.unshift(searchInput);
        localStorage.setItem("lastSearches", JSON.stringify(lastSearches));
    }
}

function debounce(fn, delay = 1000) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

const debouncedSearch = debounce(searchGame, 350);

const SEARCH_INPUT = document.getElementById("searchBar");
SEARCH_INPUT.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
});

const LAST_SEARCHES_BTN = document.getElementById("lastSearches");
/* Show last searches */
function showLatestSearches() {
    /* prettier-ignore */
    if (!isLocalEnabled("You cannot use last searches functionality without Local Storage/Cookies enabled")) {
        return 0;
    }

    const TITLE = document.querySelector(".tablet-title h1");
    const TITLE_MOBILE = document.querySelector("h1.mobile");
    const SUBTITLE = document.querySelector(".tablet-title h2");
    const SUBTITLE_MOBILE = document.querySelector("h2.mobile");
    const PREVIOUS_PAGE = document.querySelector(".active-page");

    TITLE.textContent = "Latest searches";
    TITLE_MOBILE.textContent = "Latest searches";
    SUBTITLE.style.display = "none";
    SUBTITLE_MOBILE.style.display = "none";
    PREVIOUS_PAGE.classList.remove("active-page");
    LAST_SEARCHES_BTN.classList.add("active-page");

    const LAST_SEARCHES_LIST = JSON.parse(localStorage.getItem("lastSearches"));

    if (LAST_SEARCHES_LIST) {
        let lastSearchesTemplate = `
            <button id="clearLastSearchesBtn" data-clear-search="true">Clear searches</button>
        `;
        const SEARCHES_CONTAINER = document.createElement("div");
        SEARCHES_CONTAINER.classList.add("lastSearchesContainer");

        for (let i = 0; i < LAST_SEARCHES_LIST.length; i++) {
            let currentSearch = LAST_SEARCHES_LIST[i];
            lastSearchesTemplate += `
                    <div class="latestSearchContainer" data-search="${currentSearch}">
                        <img src="../img/components/clock.svg" alt="clock icon" data-search="${currentSearch}">
                        <h3 data-search="${currentSearch}">
                            ${currentSearch}
                        </h3>
                    </div>
                `;
        }
        SEARCHES_CONTAINER.innerHTML = lastSearchesTemplate;
        CARDS_CONTAINER.replaceChildren(SEARCHES_CONTAINER);
    } else {
        CARDS_CONTAINER.innerHTML = `<h3 class="noSearchText">You haven't searched anything yet...</h3>`;
    }
}

/* Clear last searches function */
function clearLastSearches() {
    if (localStorage.getItem("lastSearches")) {
        localStorage.removeItem("lastSearches");
        showLatestSearches();
    }
}

/* Search from latest games list */
LAST_SEARCHES_BTN.addEventListener("click", () => {
    showLatestSearches();
    if (document.body.classList.contains("menu-open")) toggleMainMenu();
});

CARDS_CONTAINER.addEventListener("click", (e) => {
    if (e.target.dataset.search) {
        searchGame(e.target.dataset.search);
        return 0;
    }
    if (e.target.dataset.clearSearch) {
        clearLastSearches();
        return 0;
    }
});

/* Change display layout of cards to single or multiple columns */
const SINGLE_COLUMN_BTN = document.getElementById("singleColumnBtn");
const MULTIPLE_COLUMN_BTN = document.getElementById("multipleColumnsBtn");

SINGLE_COLUMN_BTN.addEventListener("click", () => {
    CARDS_CONTAINER.classList.add("multipleColumns");
    SINGLE_COLUMN_BTN.classList.add("active");
    MULTIPLE_COLUMN_BTN.classList.remove("active");
});

MULTIPLE_COLUMN_BTN.addEventListener("click", () => {
    CARDS_CONTAINER.classList.remove("multipleColumns");
    MULTIPLE_COLUMN_BTN.classList.add("active");
    SINGLE_COLUMN_BTN.classList.remove("active");
});

/* Open search bar mobile */
const SEARCH_BAR_BTN = document.getElementById("searchIconMobile");
const SEARCH_BAR = document.querySelector(".search-bar");

SEARCH_BAR_BTN.addEventListener("click", (e) => {
    document.removeEventListener("click", closeSearchBar);
    e.stopPropagation();
    SEARCH_BAR.classList.add("open-mobile");
    SEARCH_INPUT.focus();
    document.addEventListener("click", closeSearchBar);
});

/* Close search bar mobile */
function closeSearchBar(e) {
    if (e.target.closest(".search-bar")) {
        return 0;
    }

    SEARCH_BAR.classList.remove("open-mobile");
    document.removeEventListener("click", closeSearchBar);
}

/* Clear search */
document.getElementById("clearSearchBtn").addEventListener("click", () => {
    SEARCH_INPUT.value = "";

    const INPUT_EVENT = new InputEvent("input");
    SEARCH_INPUT.dispatchEvent(INPUT_EVENT);
});
