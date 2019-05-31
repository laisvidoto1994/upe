//Set the namespace
window.bizagi = {
    servicesBaseURL: "http://172.16.15.7:8080/BizAgi-war/Rest",
    servicesURL: {
        generalAuthentication: "/Authentication",
        authenticationUser: "/Authentication/Users",
        authenticationConfig: "/Authentication/BizagiConfig",
        authenticationDomains: "/Authentication/Domain",
        forgotPassword: "/Authentication/ForgottenPassword",
        secretQuestion: "/Authentication/SecretQuestion"

    },
    //Stores the Initial Authentication variables
    firstData: {
        isQuickLogin: "",
        isRemoteUser: "",
        isDomainRequired: "",
        defaultDomain: "",
        isBizagiAuthentication: "",
        isAdminLoginRequired: "",
        isSecrectQuestionEnabled: ""
    },
    userSettings: {

        groupSeparator: "",
        uploadMaxFileSize: "",
        isAuthenticate: "true",
        symbol: "",
        decimalDigits: -1,
        shortDateFormat: "",
        timeFormat: "",
        longDateFormat: "",
        language: "",
        decimalSeparator: ""
    },
    errorMessages: {
        LOGIN_USER_NAME_EMPTY: "The username is empty",
        LOGIN_USER_PASSWORD_EMPTY: "The password is empty",
        LOGIN_EMPTY_FIELDS: "Login or Password is empty.",
        LOGIN_AUTHENTICATION_ERROR: "The username or password you entered is incorrect."
    }
};