import isLocalEnabled from "./localStorageEnabled.js";

/* Redirects users to login page if they are not logged in, and to homepage if they are */
(function () {
    "use strict";
    /* prettier-ignore */
    if (isLocalEnabled("Could not get access token due to local storage being disabled...")) {
        const ACCOUNT_MANAGEMENT_PATHS = [LOGIN_PATH, REGISTER_PATH];

        if (localStorage.getItem("sessionId") && ACCOUNT_MANAGEMENT_PATHS.includes(window.location.href)) {
            window.location.replace(APPLICATION_PATH);
        } 
        else if (!ACCOUNT_MANAGEMENT_PATHS.includes(window.location.href)) {
            window.location.replace(LOGIN_PATH);
        }
        else {
            return;
        }
    }
})();
