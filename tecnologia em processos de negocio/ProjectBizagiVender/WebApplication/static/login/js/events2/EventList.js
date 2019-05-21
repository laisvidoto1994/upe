(function (bizagi) {
    'use strict';

    /**
     * @namespace events
     */
    
	/**
	 *Services event list
	 */


    bizagi.events.services = {
        FIRST_DATA_SUCCESS: "firstDataSuccess",
        FIRST_DATA_FAIL: "firstDataFail",
		LOGIN_SUCCESS: "loginSuccess",
		LOGIN_FAIL: "loginFail",
		QUICK_LOGIN_USER_LIST_SUCCESS: "quickLoginUserListSuccess",
		QUICK_LOGIN_USER_LIST_FAIL: "quickLoginUserListFail",
		DOMAIN_LIST_SUCCESS: "domainListSuccess",
		DOMAIN_LIST_FAIL: "domainListFail",
		LOGOUT_SUCCESS: "logoutSuccess",
		LOGOUT_FAIL: "logoutFail",
		FORGOT_PASSWORD_SUCCESS: "forgotPasswordSuccess",
		FORGOT_PASSWORD_FAIL: "forgotPasswordFail",
		SECRET_QUESTION_SUCCESS: "secretQuestionSuccess",
		SECRET_QUESTION_FAIL: "secretQuestionFail",
		UNLOCK_ACCOUNT_SUCCESS : "unlockAccountSuccess",
		UNLOCK_ACCOUNT_FAIL : "unlockAccountFail"
    };
    
})(window.bizagi);