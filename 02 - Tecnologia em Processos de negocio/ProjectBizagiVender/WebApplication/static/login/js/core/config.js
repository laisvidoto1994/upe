//Set the namespace
window.bizagi = {
    servicesBaseURL: "http://172.16.15.68:8080/BizAgi-war/Rest",
    servicesURL: {
        generalAuthentication: "/Authentication",
        authenticationUser: "/Authentication/User",
        authenticationConfig: "/Authentication/BizagiConfig",
        authenticationDomains: "/Authentication/Domains",
        quickLoginUserList: "/Authentication/Users",
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
    //Stores required data during the user login
    loginFormData: {
        domainList: {},
        userList: {}
    },
    templateList: {
        NORMAL_LOGIN: "ui-bizagi-login-normal-login",
        QUICK_LOGIN: "ui-bizagi-login-quick-login",
        CHANGE_PASSWORD: "ui-bizagi-login-change-password",
        UNLOCK_ACCOUNT: "ui-bizagi-login-unlock-account"
    },
    appMessages: {
        LOGIN_USER_NAME_EMPTY: "The username is empty",
        LOGIN_USER_PASSWORD_EMPTY: "The password is empty",
        LOGIN_EMPTY_FIELDS: "Login or Password is empty.",
        LOGIN_AUTHENTICATION_ERROR: "The username or password you entered is incorrect.",
        LOGIN_AUTHENTICATION_SUCCESS: "The user has been authenticated"
    }
};