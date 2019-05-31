(function (bizagi, $) {
    bizagi.LoginForm = function () {

        //DOM Variables
        var $body = $('body'),
            $formContent = $body.find('#form-content'),
            $loginError;

        //Templates references
        var tmplNormalLogin,
            tmplUnlockAccount,
            tmplChangePass;

        //Form validation helpers
        var FORM_VALIDATION_TYPE = {
            EMPTY_FIELD: "emptyField",
            UNSELECTED_ELEMENT_LIST: "unselectedElementList"
        };

        /*Constructor*/
        (function () {
            init();
        } ());

        /**
        * Initialize login form
        */
        function init() {

            //Add services event Listeners 
            bizagi.events.Events.addEventListener(bizagi.events.services.FIRST_DATA_SUCCESS, firstDataSuccess_handler);
            bizagi.events.Events.addEventListener(bizagi.events.services.FIRST_DATA_FAIL, firstDataFail_handler);

            bizagi.events.Events.addEventListener(bizagi.events.services.LOGIN_SUCCESS, loginSuccess_handler);
            bizagi.events.Events.addEventListener(bizagi.events.services.LOGIN_FAIL, loginFail_handler);

            bizagi.events.Events.addEventListener(bizagi.events.services.UNLOCK_ACCOUNT_SUCCESS, unlockAccountSuccess_handler);
            bizagi.events.Events.addEventListener(bizagi.events.services.UNLOCK_ACCOUNT_FAIL, unlockAccountFail_handler);

            bizagi.events.Events.addEventListener(bizagi.events.services.DOMAIN_LIST_SUCCESS, domainListSuccess_handler);
            bizagi.events.Events.addEventListener(bizagi.events.services.QUICK_LOGIN_USER_LIST_SUCCESS, quickLoginUserListSuccess_handler);

            //Invokes the login setup
            bizagi.model.ServiceManager.firstData();
        }

        function initLoginForm() {

            //Login Error
            $loginError = $formContent.find(".login-error");
            $loginError.hide();

            $formContent.find('#login').click(function (ev) {
                ev.preventDefault();

                if (validateUserLoginFields()) {

                    var userParam = generateUserLoginParameters();
                    bizagi.model.ServiceManager.userLogin(userParam);
                }
            });

            $formContent.find('#changePassword').click(function (ev) {
                ev.preventDefault();
                loadTemplateByID(bizagi.templateList.CHANGE_PASSWORD);
            });

            $formContent.find('#unlockAccount').click(function (ev) {
                ev.preventDefault();
                loadTemplateByID(bizagi.templateList.UNLOCK_ACCOUNT);
            });
        }

        function initQuickLogin() {

            //Login Error
            $loginError = $formContent.find(".login-error");
            $loginError.hide();

            $formContent.find('#login').click(function (ev) {
                ev.preventDefault();

                var userParam = generateUserLoginParameters();
                bizagi.model.ServiceManager.userLogin(userParam);

            });

        }

        function initChangePasswordForm() {

            //Login Error
            $loginError = $formContent.find(".login-error");
            $loginError.hide();

            $formContent.find('#change-password').click(function (ev) {
                ev.preventDefault();

                if (validateChangePasswordFields()) {
                    var userParam = generateForgotPasswordParameters();
                    bizagi.model.ServiceManager.changePassword(userParam);
                }

            });

            $formContent.find('#lnkBackToLogin').click(function (ev) {
                ev.preventDefault();

                loadTemplateByID(bizagi.templateList.NORMAL_LOGIN);
            });
        }

        function initUnlockAccountForm() {

            //Login Error
            $loginError = $formContent.find(".login-error");
            $loginError.hide();

            $formContent.find("#unlock-account").click(function (ev) {
                ev.preventDefault();

                if (validateUnlockAccountFields()) {
                    var userParams = generateUnlockAccountParameters();
                    bizagi.model.ServiceManager.unlockAccount(userParams);
                }
            });

            $formContent.find('#lnkBackToLogin').click(function (ev) {
                ev.preventDefault();
                loadTemplateByID(bizagi.templateList.NORMAL_LOGIN);
            });
        }

        function loadTemplates() {

            // Get the remote template
            $.get("tmpl/loginForm.tmpl.html", null, function (templates) {

                // Inject all those templates at the end of the document.
                $body.append(templates);

                // Get compiled template

                tmplQuickLogin = $('#' + bizagi.templateList.QUICK_LOGIN).template();

                tmplNormalLogin = $('#' + bizagi.templateList.NORMAL_LOGIN).template();

                tmplChangePass = $('#' + bizagi.templateList.CHANGE_PASSWORD).template();
                tmplUnlockAccount = $('#' + bizagi.templateList.UNLOCK_ACCOUNT).template();

                //TODO: validate first data parameters to load the required form 

                if (bizagi.firstData.isQuickLogin === true) {
                    loadTemplateByID(bizagi.templateList.QUICK_LOGIN);
                } else {
                    loadTemplateByID(bizagi.templateList.NORMAL_LOGIN);
                }
            });
        }

        function loadTemplateByID(templateID) {
            $formContent.empty();

            switch (templateID) {
                case bizagi.templateList.NORMAL_LOGIN:
                    //Append normal login
                    $formContent.append($.tmpl(tmplNormalLogin, ""));

                    initLoginForm();

                    break;
                case bizagi.templateList.QUICK_LOGIN:
                    //Append quick login
                    $formContent.append($.tmpl(tmplQuickLogin, bizagi.loginFormData.userList));
                    initQuickLogin();
                    break;
                case bizagi.templateList.CHANGE_PASSWORD:
                    //Append change pass
                    $formContent.append($.tmpl(tmplChangePass, bizagi.loginFormData.domainList));

                    initChangePasswordForm();
                    break;

                case bizagi.templateList.UNLOCK_ACCOUNT:

                    //Append unlock account
                    $formContent.append($.tmpl(tmplUnlockAccount, bizagi.loginFormData.domainList));

                    initUnlockAccountForm();
                    break;
            }
        }

        function generateUserLoginParameters() {

            var user = "",
                password = "",
                domain = "",
                userParams;

            //Check quick login
            if (bizagi.firstData.isQuickLogin === true) {
                user = $formContent.find('#username').val();
                userParams = { 'user': user, 'password': '0' };
            }
            else {

                user = $formContent.find('#user').val();
                password = $formContent.find('#password').val();
                domain = bizagi.firstData.defaultDomain;

                userParams = { 'user': user, 'domain': domain, 'password': password };
            }

            return userParams;
        }

        function generateForgotPasswordParameters() {
            var user = $formContent.find('#user').val(),
                password = $formContent.find('#password').val(),
                domain = $formContent.find('#password').val(),
                newPassword = $formContent.find('#new-password').val(),
                passwordConfirmation = $formContent.find('#password-confirmation').val(),
                secretQuestion = $formContent.find('#secret-question').val(),
                secretAnswer = $formContent.find('#secret-answer').val(),
                userParams = {};

            userParams = { 'user': user, 'domain': domain, 'password': password };


            return userParams;
        }

        function generateUnlockAccountParameters() {

            var user = $formContent.find('#user').val(),
                password = $formContent.find('#password').val(),
                domain = $formContent.find('#domain').val(),
                observation = $formContent.find('#observation').val(),
                userParams = {};

            userParams = { user: user, domain: domain, password: password, observation: observation };


            return userParams;
        }

        /**
        * Validate user login after invoking the login service function 
        */

        function validateUserLoginFields() {

            var result = true;

            //Validates users type
            //Check quick login
            if (!bizagi.firstData.isQuickLogin) {

                //Checks selected domain
                var user = $formContent.find('#user'),
                    password = $formContent.find('#password'),
                    errorMessage = "";

                if (validateField(user, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {
                    errorMessage += bizagi.appMessages.LOGIN_USER_NAME_EMPTY + '<br>';
                    result = false;

                } else if (validateField(password, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {
                    errorMessage += bizagi.appMessages.LOGIN_USER_PASSWORD_EMPTY + '<br>';
                    result = false;
                }

                if (errorMessage.length !== 0) {
                    result = false;
                    printError(errorMessage);
                } else {
                    showErrorMessageField(false);
                }
            } else {

                //Validate selected user index
                var userList = $("#user-list");

                if (userList === null) {
                    result = false;
                }
            }

            return result;
        }

        function validateChangePasswordFields() {
            var user = $formContent.find('#user'),
                password = $formContent.find('#password'),
                newPassword = $formContent.find('#new-password'),
                passwordConfirmation = $formContent.find('#password-confirmation'),
                secretQuestion = $formContent.find('#secret-question'),
                secretAnswer = $formContent.find("#secret-answer");


            if (validateField(user, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                printError("the user field is empty");
                result = false;

            } else if (validateField(password, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                printError("the password field is empty");
                result = false;
            } else if (validateField(newPassword, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                printError("the new password field is empty");
                result = false;
            } else if (validateField(passwordConfirmation, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                printError("the password confirmation field is empty");
                result = false;
            } else if (validateField(secretQuestion, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                printError("the secret question field is empty");
                result = false;

            } else if (validateField(secretAnswer, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                printError("the secret answer field is empty");
                result = false;
            }



            result = true;
        }

        function validateUnlockAccountFields() {

            var user = $formContent.find('#user'),
                password = $formContent.find('#password'),
                observation = $formContent.find('#observation'),
                result = true;

            if (validateField(user, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                //$(".login-error").find("p").html("the user field is empty");
                printError("the user field is empty");

                result = false;

            } else if (validateField(password, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                //$(".login-error").find("p").html("the password field is empty");
                printError("the password field is empty");
                result = false;

            } else if (validateField(observation, FORM_VALIDATION_TYPE.EMPTY_FIELD) === false) {

                //$(".login-error").find("p").html("the observation field is empty");
                printError("the observation field is empty");
                result = false;

            } else {

                showErrorMessageField(false);
            }

            return result;

        }

        function validateField(field, validationType) {
            var result = true;

            switch (validationType) {
                case FORM_VALIDATION_TYPE.EMPTY_FIELD:
                    if (field.val() === "") {
                        result = false;
                        field.addClass('empty-field');
                        //TODO
                        //add the error class to his respective error field
                    }
                    else {
                        //TODO
                        //remove the error class to his respective error field
                    }

                    break;

                case FORM_VALIDATION_TYPE.UNSELECTED_ELEMENT_LIST:
                    if (field.selectedIndex === 0) {
                        result = false;
                        //TODO
                        //add the error class to his respective error field
                    }
                    else {
                        //TODO
                        //remove the error class to his respective error field
                    }
                    break;
            }

            return result;
        }

        function firstDataSuccess_handler(e) {
            bizagi.model.ServiceManager.getDomainList();
            bizagi.model.ServiceManager.getQuickLoginUserList();
        }

        function firstDataFail_handler(e) {
            console.log('first data error', e);
        }

        /**
        * Login success handler
        * @param Object e - event data
        */

        function loginSuccess_handler(e) {

            if (e.isAuthenticate == 'true') {
                printMessage(bizagi.appMessages.LOGIN_AUTHENTICATION_SUCCESS);
            } else{
                printError(e.message);
            }

        }

        function unlockAccountSuccess_handler(e) {

            if (e.unlocked === true) {
                printMessage(e.message);
            } else {
                printError(e.message);
            }

        }

        function unlockAccountFail_handler(e) {
            printError("Request Fail!");
        }

        /**
        * Login fail handler
        * @param Object e - event data
        */

        function loginFail_handler(e) {

            //console.log('loginFail_handler',e);
            printError(e.message);
        }

        function domainListSuccess_handler(e) {
            bizagi.loginFormData.domainList = e;

        }

        function quickLoginUserListSuccess_handler(e) {
            bizagi.loginFormData.userList = e;
            //Load the template files
            loadTemplates();
        }

        function printError(errorMessage) {
            resetMessage();

            $loginError.removeClass("success");

            $loginError.find('p').html(errorMessage);
            showErrorMessageField(true);
        }

        function printMessage(message) {
            resetMessage();
            $loginError.addClass("success");
            $loginError.find('p').html(message);
            showErrorMessageField(true);
        }

        function resetMessage() {
            $loginError.removeClass("success");
            $loginError.find('p').html("");
            showErrorMessageField(false);
        }

        function showErrorMessageField(value) {
            (value === true) ? $loginError.show() : $loginError.hide();
        }

        return {
        };

    } ();
})(window.bizagi || {}, window.jQuery || {});