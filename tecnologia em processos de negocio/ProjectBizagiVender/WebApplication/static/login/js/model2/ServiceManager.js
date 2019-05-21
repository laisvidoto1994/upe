(function (bizagi, $) {
    'use strict';

    bizagi.model = bizagi.model || {};

    bizagi.model.ServiceManager = (function () {

        /**
        * @constructor
        */
        (function () {

        } ());

        /**
        * Login user
        * @param {Function}   type    callback function when the file load is succed
        * @function
        */
        function firstData() {
            //service call logic goes here
            $.read({
                url: bizagi.servicesBaseURL + bizagi.servicesURL.authenticationConfig,
                success: function (response) {

                    bizagi.firstData = response;
                    //console.log(bizagi.firstData);

                    bizagi.events.Events.dispatchEvent(bizagi.events.services.FIRST_DATA_SUCCESS);
                },
                error: function (xhr) {

                    console.log(xhr);
                }
            });


            /**

            /**/
        }


        function userLogin(loginParams) {

            // console.log("user-login", JSON.stringify(loginParams));

            //Call to the restfull service for authentication

            $.create(
                bizagi.servicesBaseURL + bizagi.servicesURL.authenticationUser,
                loginParams,
                function (response) {

                    console.log("userLogin", response);
                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGIN_SUCCESS, [response]);
                    bizagi.userSettings = response;
                },
                function (xhr) {

                    console.log("service user login error", xhr);
                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGIN_FAIL, [xhr]);

                }
            );

        }

        function getQuickLoginUserList() {

            //Call to the restfull service for user list
            $.read({
                url: bizagi.servicesBaseURL + bizagi.servicesURL.authenticationUser,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.QUICK_LOGIN_USER_LIST_SUCCESS);
                    console.log(response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.QUICK_LOGIN_USER_LIST_FAIL, xhr);

                }
            });

        }

        function getDomainList() {

            //Call to the restfull service for domain list
            $.read({
                url: bizagi.servicesBaseURL + bizagi.servicesURL.authenticationDomains,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.DOMAIN_LIST_SUCCESS);
                    console.log(response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.DOMAIN_LIST_FAIL, xhr);

                }
            });

        }

        function logout() {

            console.log("method logout");
            //Call to the restfull service for domain list
            $.destroy({
                url: bizagi.servicesBaseURL + bizagi.servicesURL.generalAuthentication,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_SUCCESS);
                    console.log(response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_SUCCESS, xhr);
                    console.log("Logout Error", xhr);
                }
            });

        }

        function changePassword(userParams) {
            //Call to the restfull service for domain list
            var url = bizagi.servicesBaseURL + bizagi.servicesURL.generalAuthentication + "/Domain/" + userParams.domain + "/User/" + userParams.user + "/Password/" + userParams.password + "/NewPassword/" + userParams.newPassword + "/" + userParams.passwordConfirmation;

            console.log("function changePassword", url);


            $.update({
                url: url,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_SUCCESS);
                    console.log(response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_FAIL, xhr);
                    console.log("Change Password Error", xhr);

                }
            });

        }

        function forgotPassword(userParams) {


            var url = bizagi.servicesBaseURL + bizagi.servicesURL.forgotPassword + "/Domain/" + userParams.domain + "/User/" + userParams.user;

            if (bizagi.firstData.isSecrectQuestionEnabled === true) {

                url += "/secretAnswer/" + userParams.secretAnswer;
            }

            console.log("function forgotPassword", url);

            $.read({
                url: url,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.FORGOT_PASSWORD_SUCCESS);
                    console.log(response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.FORGOT_PASSWORD_FAIL, xhr);
                    console.log("Forgot Password Error", xhr);

                }
            });
        }

        function secretQuestion(userParams) {

            var url = bizagi.servicesBaseURL + bizagi.servicesURL.secretQuestion + "/Domain/" + userParams.domain + "/User/" + userParams.user;

            console.log("function secretQuestion", url);

            /*         
            if (bizagi.firstData.isSecrectQuestionEnabled === true) {

            url += "/secretAnswer/{userParams.secretAnswer}";
            }
            */

            $.read({
                url: url,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.SECRET_QUESTION_SUCCESS);
                    console.log(response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.SECRET_QUESTION_FAIL, xhr);
                    console.log("Secret Question", xhr);

                }
            });
        }

        function unlockAccount(userParams) {

            var url = bizagi.servicesBaseURL + bizagi.servicesURL.generalAuthentication + "/Domain/" + userParams.domain + "/User/" + userParams.user + "/Password/" + userParams.user;

            if (userParams.observation) {
                url += "/Observation/" + userParams.observation;
            }

            console.log("unlock Account", url);

            $.update({
                url: url,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.UNLOCK_ACCOUNT_SUCCESS);
                    console.log("response was", response);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.UNLOCK_ACCOUNT_FAIL, xhr);

                    console.log("unlock account error", xhr);
                }
            });
        }

        return {
            firstData: firstData,
            userLogin: userLogin,
            getQuickLoginUserList: getQuickLoginUserList,
            getDomainList: getDomainList,
            logout: logout,
            changePassword: changePassword,
            forgotPassword: forgotPassword,
            secretQuestion: secretQuestion,
            unlockAccount: unlockAccount

        };

    } ());
} (window.bizagi || {}, (window.jQuery || {})));