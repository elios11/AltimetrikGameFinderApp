import isLocalEnabled from "./localStorageEnabled.js";

(function () {
    "use script";
    const LOGOUT_BTN = document.getElementById("logoutBtn");
    const LOGOUT_MODAL = document.getElementById("logoutModal");
    const CLOSE_MODAL_BTN = document.getElementById("logoutModalX");
    const CONFIRM_LOGOUT_BTN = document.getElementById("confirmLogout");
    const CANCEL_LOGOUT_BTN = document.getElementById("cancelLogout");

    function closeLogoutModal() {
        LOGOUT_MODAL.close();
    }

    function confirmLogout() {
        if (isLocalEnabled("Was not able to find session token...")) {
            if (localStorage.getItem("sessionId")) {
                localStorage.removeItem("sessionId");
            }
        }
        window.location.replace(`${APPLICATION_PATH}login.html`);
    }

    LOGOUT_BTN.addEventListener("click", () => {
        LOGOUT_MODAL.showModal();
    });

    CLOSE_MODAL_BTN.addEventListener("click", closeLogoutModal);
    CANCEL_LOGOUT_BTN.addEventListener("click", closeLogoutModal);
    CONFIRM_LOGOUT_BTN.addEventListener("click", confirmLogout);
})();
