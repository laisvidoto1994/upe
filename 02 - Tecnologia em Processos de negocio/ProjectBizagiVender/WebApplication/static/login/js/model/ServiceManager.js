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

                    bizagi.events.Events.dispatchEvent(bizagi.events.services.FIRST_DATA_SUCCESS);
                },
                error: function (xhr) {

                }
            });
        }

        function userLogin(loginParams) {
            //Call to the restfull service for authentication
            /**
            $.when($.create(bizagi.servicesBaseURL + bizagi.servicesURL.authenticationUser, loginParams)).done(function(response) {
            bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGIN_SUCCESS, [response]);
            bizagi.userSettings = response;
            }).fail(function(response) {
            bizagi.userSettings = {};
            bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGIN_FAIL, [response.statusText]);
            });
            /**/

            $.create(
                bizagi.servicesBaseURL + bizagi.servicesURL.authenticationUser,
                loginParams,
                function (response) {
                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGIN_SUCCESS, [response]);
                    bizagi.userSettings = response;
                },
                 function (xhr) {
                     // check server response is authenticated
                     bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGIN_FAIL, [xhr]);
                 }
             );
        }

        function getQuickLoginUserList() {

            //Call to the restfull service for user list
            $.read({
                url: bizagi.servicesBaseURL + bizagi.servicesURL.quickLoginUserList,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.QUICK_LOGIN_USER_LIST_SUCCESS, [response]);

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
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.DOMAIN_LIST_SUCCESS, [response]);
                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.DOMAIN_LIST_FAIL);
                }
            });

        }

        function logout() {

            //Call to the restfull service for domain list
            $.destroy({
                url: bizagi.servicesBaseURL + bizagi.servicesURL.generalAuthentication,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_SUCCESS);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_SUCCESS, xhr);
                }
            });

        }

        function changePassword(userParams) {
            //Call to the restfull service for domain list
            var url = bizagi.servicesBaseURL + bizagi.servicesURL.generalAuthentication + "/Domain/" + userParams.domain + "/User/" + userParams.user + "/Password/" + userParams.password + "/NewPassword/" + userParams.newPassword + "/" + userParams.passwordConfirmation;

            $.update({
                url: url,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_SUCCESS);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.LOGOUT_FAIL, xhr);

                }
            });

        }

        function forgotPassword(userParams) {


            var url = bizagi.servicesBaseURL + bizagi.servicesURL.forgotPassword + "/Domain/" + userParams.domain + "/User/" + userParams.user;

            if (bizagi.firstData.isSecrectQuestionEnabled === true) {

                url += "/secretAnswer/" + userParams.secretAnswer;
            }

            $.read({
                url: url,
                success: function (response) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.FORGOT_PASSWORD_SUCCESS);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.FORGOT_PASSWORD_FAIL, xhr);

                }
            });
        }

        function secretQuestion(userParams) {

            var url = bizagi.servicesBaseURL + bizagi.servicesURL.secretQuestion + "/Domain/" + userParams.domain + "/User/" + userParams.user;

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

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.SECRET_QUESTION_FAIL, xhr);

                }
            });
        }

        function unlockAccount(userParams) {

            var url = bizagi.servicesBaseURL + bizagi.servicesURL.generalAuthentication + "/Domain/{domain}/User/{user}/Password/{password}/Observation/{observation}";

            $.update({
                url: url,
                data: userParams,
                success: function (response) {
                    
                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.UNLOCK_ACCOUNT_SUCCESS, [response]);

                },
                error: function (xhr) {

                    // check server response is authenticated
                    bizagi.events.Events.dispatchEvent(bizagi.events.services.UNLOCK_ACCOUNT_FAIL, xhr);

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