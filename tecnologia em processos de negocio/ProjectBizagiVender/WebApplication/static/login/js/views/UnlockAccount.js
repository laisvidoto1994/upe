(function (bizagi, $) {
    'use strict';

    bizagi.view = bizagi.view || {};
    bizagi.view.templates = bizagi.view.templates || {};
    bizagi.view.templates.UnlockAccount = (function () {

        var FORM_VALIDATION_TYPE = {
            EMPTY_FIELD: "emptyField",
            UNSELECTED_ELEMENT_LIST: "unselectedElementList"
        };

        /**
        * @constructor
        */
        (function () {

            bizagi.events.Events.addEventListener(bizagi.events.ui.UNLOCK_ACCOUNT, unlockAccount_handler);
            bizagi.events.Events.addEventListener(bizagi.events.services.UNLOCK_ACCOUNT_SUCCESS, unlockAccountSuccess_handler);
            bizagi.events.Events.addEventListener(bizagi.events.services.UNLOCK_ACCOUNT_FAIL, unlockAccountFail_handler);

        } ());

        function init() {

            $('#content').html("");
            console.log(bizagi.domains);

            $("#unlock_account").tmpl(
            bizagi.domains
            ).appendTo("#content");

            $("#unlock-account").click(
                    function (ev) {
                        ev.preventDefault();
                        bizagi.events.Events.dispatchEvent(bizagi.events.ui.UNLOCK_ACCOUNT);

                    }
            );


        }

        function unlockAccount_handler() {

            if (validateunlockAccount()) {

                var userParams = {

                    user: "David",
                    domain: "domain",
                    password: "123",
                    observation: "xxx"
                };

                bizagi.model.ServiceManager.unlockAccount(userParams);
            }

        }

        function validateunlockAccount() {

            var user = $('#user');
            var password = $('#password');
            var observation = $('#observation');
            var result = true;

            if (bizagi.LoginForm.validateField(user, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {


                $(".login-error").find("p").html("the user field is empty");
                result = false;

            } else if (bizagi.LoginForm.validateField(password, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                $(".login-error").find("p").html("the password field is empty");
                result = false;

            } else if (bizagi.LoginForm.validateField(observation, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                $(".login-error").find("p").html("the observation field is empty");
                result = false;

            } else {

                $(".login-error").hide();
                $(".login-error").find("p").html("");

            }

            return result;
        }

        function unlockAccountSuccess_handler() {

        }

        function unlockAccountFail_handler() {

            $(".login-error").show();
            $(".login-error").find("p").html("Request Fail!");
        }

        return {
            init: init
        };

    } ());
} (window.bizagi || {}, (window.jQuery || {})));