import isLocalEnabled from "./localStorageEnabled.js";

(function () {
    "use strict";
    // Variables for modifying the aspect of the login page
    const SHOW_PWD_ICON = document.querySelector(".password-container svg");
    const SHOW_PWD_ICON_PATH = document.getElementById("showPwdIconPath");
    const PASSWORD_FIELD = document.getElementById("password");
    const REMEMBER_PWD = document.getElementById("rememberPwd");
    const REMEMBER_PWD_CHECK = document.querySelector(
        "#remember-info-label svg"
    );
    const REMEMBER_PWD_FILLED = document.querySelector(
        "#remember-info-label svg:nth-of-type(2)"
    );
    const SHOW_PWD_ICON_PATH_DATA = SHOW_PWD_ICON_PATH.getAttribute("d");
    const HIDE_PWD_ICON_SVG_DATA =
        "M19.7071 5.707C19.8892 5.5184 19.99 5.2658 19.9877 5.0036C19.9854 4.7414 19.8803 4.49059 19.6949 4.30518C19.5095 4.11977 19.2587 4.0146 18.9965 4.01233C18.7343 4.01005 18.4817 4.11084 18.2931 4.293L14.0321 8.553C13.2681 8.10201 12.3758 7.9178 11.4957 8.02935C10.6156 8.14089 9.79755 8.54186 9.17023 9.16918C8.54292 9.79649 8.14195 10.6146 8.0304 11.4947C7.91886 12.3748 8.10307 13.267 8.55405 14.031L4.29305 18.293C4.19754 18.3852 4.12136 18.4956 4.06895 18.6176C4.01654 18.7396 3.98896 18.8708 3.9878 19.0036C3.98665 19.1364 4.01195 19.2681 4.06223 19.391C4.11251 19.5138 4.18676 19.6255 4.28066 19.7194C4.37455 19.8133 4.4862 19.8875 4.6091 19.9378C4.732 19.9881 4.86367 20.0134 4.99645 20.0123C5.12923 20.0111 5.26045 19.9835 5.38246 19.9311C5.50446 19.8787 5.61481 19.8025 5.70705 19.707L9.96805 15.447C10.732 15.898 11.6243 16.0822 12.5044 15.9707C13.3845 15.8591 14.2026 15.4581 14.8299 14.8308C15.4572 14.2035 15.8582 13.3854 15.9697 12.5053C16.0812 11.6252 15.897 10.733 15.4461 9.969L19.7071 5.707ZM12.5181 10.067C12.1789 9.97598 11.8217 9.97588 11.4824 10.0667C11.1432 10.1576 10.8338 10.3361 10.5855 10.5845C10.3372 10.8328 10.1586 11.1421 10.0678 11.4814C9.97694 11.8206 9.97703 12.1778 10.0681 12.517L12.5181 10.067ZM11.4821 13.932L13.9321 11.482C14.0231 11.8212 14.0232 12.1784 13.9323 12.5176C13.8415 12.8569 13.6629 13.1662 13.4146 13.4145C13.1663 13.6629 12.8569 13.8414 12.5177 13.9323C12.1784 14.0231 11.8212 14.023 11.4821 13.932ZM15.7651 4.821C14.6301 4.32 13.3671 4 12.0001 4C9.14805 4 6.75705 5.395 4.99805 6.906C3.23305 8.423 2.00805 10.138 1.46405 10.97C1.26309 11.2759 1.15601 11.634 1.15601 12C1.15601 12.366 1.26309 12.7241 1.46405 13.03C2.25829 14.2394 3.17952 15.3604 4.21205 16.374L5.62605 14.96C4.70926 14.0618 3.88942 13.0696 3.18005 12C3.69005 11.227 4.77805 9.732 6.30105 8.423C7.87405 7.072 9.81605 6 12.0001 6C12.7549 6.00286 13.5044 6.12677 14.2201 6.367L15.7651 4.821ZM12.0001 18C11.2452 17.9971 10.4957 17.8732 9.78005 17.633L8.23605 19.18C9.37205 19.68 10.6341 20.001 12.0011 20.001C14.8531 20.001 17.2441 18.606 19.0031 17.095C20.7681 15.578 21.9931 13.863 22.5371 13.031C22.9481 12.403 22.9481 11.6 22.5371 10.971C21.7428 9.7616 20.8216 8.64057 19.7891 7.627L18.3741 9.04C19.2909 9.93822 20.1107 10.9303 20.8201 12C20.3101 12.773 19.2221 14.268 17.6991 15.577C16.1261 16.928 14.1841 18 12.0001 18Z";
    const LOGIN_FORM = document.querySelector(".login-card form");

    /* MODIFYING PAGE'S ASPECT */
    function togglePassword() {
        let showPassword = true;
        SHOW_PWD_ICON.addEventListener("click", () => {
            showPassword = !showPassword;
            if (showPassword) {
                SHOW_PWD_ICON_PATH.setAttribute("d", SHOW_PWD_ICON_PATH_DATA);
                PASSWORD_FIELD.type = "password";
            } else {
                SHOW_PWD_ICON_PATH.setAttribute("d", HIDE_PWD_ICON_SVG_DATA);
                PASSWORD_FIELD.type = "text";
            }
        });
    }
    togglePassword();

    REMEMBER_PWD.addEventListener("change", () => {
        if (REMEMBER_PWD.checked) {
            REMEMBER_PWD_CHECK.style.display = "none";
            REMEMBER_PWD_FILLED.style.display = "block";
        } else {
            REMEMBER_PWD_CHECK.style.display = "block";
            REMEMBER_PWD_FILLED.style.display = "none";
        }
    });

    /* HANDLING LOGIN */
    LOGIN_FORM.addEventListener("submit", async (e) => {
        e.preventDefault();
        const EMAIL = e.target.email;
        const PASSWORD = e.target.password;
        const EMAIL_FEEDBACK = document.getElementById("emailFeedback");
        const PASSWORD_FEEDBACK = document.getElementById("pwdFeedback");
        const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

        if (!EMAIL.value || !VALID_EMAIL_REGEX.test(EMAIL.value)) {
            EMAIL.classList.add("invalid");
            EMAIL_FEEDBACK.style.display = "block";
            PASSWORD_FEEDBACK.style.display = "none";
            PASSWORD.classList.remove("invalid");
            SHOW_PWD_ICON.classList.remove("invalid");
            return;
        } else {
            EMAIL_FEEDBACK.style.display = "none";
            EMAIL.classList.remove("invalid");
        }

        if (!PASSWORD || PASSWORD.value.length < 8) {
            PASSWORD.classList.add("invalid");
            SHOW_PWD_ICON.classList.add("invalid");
            PASSWORD_FEEDBACK.style.display = "block";
            return;
        } else {
            SHOW_PWD_ICON.classList.remove("invalid");
            PASSWORD_FEEDBACK.style.display = "none";
            PASSWORD.classList.remove("invalid");
        }

        let body = JSON.stringify({
            email: e.target.email.value,
            password: e.target.password.value
        });

        let options = {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
            body: body
        };

        try {
            const response = await fetch(`${SERVER_PATH}login/`, options);

            if (!response.ok) {
                EMAIL.classList.add("invalid");
                PASSWORD.classList.add("invalid");
                PASSWORD_FEEDBACK.style.display = "block";
                SHOW_PWD_ICON.classList.add("invalid");

                throw new Error(
                    `bad request with status code: ${response.status}`
                );
            }
            if (
                isLocalEnabled(
                    "Since you don't have local storage enabled, your session id won't be stored."
                )
            ) {
                const readableStreamRes = await response.json();
                localStorage.setItem(
                    "sessionId",
                    readableStreamRes.accessToken
                );
                localStorage.setItem(
                    "username",
                    readableStreamRes.user.username
                );
            }
        } catch (error) {
            console.error(
                "An error occurred during the login process:",
                error.message
            );
            return;
        }

        window.location.replace(APPLICATION_PATH);
    });
})();
