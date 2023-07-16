import isLocalEnabled from "./localStorageEnabled.js";

(function () {
    "use strict";
    const DARK_MODE_BTN_PATH = "img/components/dark-mode-on.svg";
    const LIGHT_MODE_BTN_PATH = "img/components/dark-mode-off.svg";
    const SWITCH_BTN = document.getElementById("switchThemeBtn");
    let darkModeEnabled = false;

    if (
        !isLocalEnabled(
            "You cannot store last searches without Local Storage/Cookies enabled"
        )
    ) {
        return 0;
    }

    /* prettier-ignore */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        darkModeEnabled = false;
    }

    function setTheme() {
        if (darkModeEnabled) {
            document.body.classList.remove("light");
            localStorage.setItem("darkMode", "true");
        } else {
            document.body.classList.add("light");
            localStorage.setItem("darkMode", "false");
        }

        if (SWITCH_BTN) {
            SWITCH_BTN.src = darkModeEnabled
                ? DARK_MODE_BTN_PATH
                : LIGHT_MODE_BTN_PATH;
        }
    }

    if (localStorage.getItem("darkMode")) {
        darkModeEnabled = JSON.parse(localStorage.getItem("darkMode"));
    }
    setTheme();

    if (SWITCH_BTN) {
        SWITCH_BTN.addEventListener("click", () => {
            darkModeEnabled = !darkModeEnabled;
            setTheme();
        });
    }
})();
