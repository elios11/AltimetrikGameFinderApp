import isLocalEnabled from "./localStorageEnabled.js";

/* Redirects users to login page if they are not logged in, and to homepage if they are*/
(function () {
    "use strict";
    if (
        isLocalEnabled(
            "Could not get access token due to local storage being disabled..."
        )
    ) {
        if (localStorage.getItem("sessionId")) {
            const ACCOUNT_MANAGEMENT_PATHS = [LOGIN_PATH, REGISTER_PATH];

            if (ACCOUNT_MANAGEMENT_PATHS.includes(window.location.href)) {
                window.location.replace(APPLICATION_PATH);
            }
        } else {
            window.location.replace(LOGIN_PATH);
        }
    }
})();
