// Redefine path to base
var keyStorageAux = "auxBizagiAuthentication";//from submenu workportal ThemeBuilder
var session = window.sessionStorage.getItem("bizagiAuthentication") || localStorage.getItem(keyStorageAux) || "{}";
if(localStorage.getItem(keyStorageAux)){
    localStorage.removeItem(keyStorageAux);
}
var bizagiConcurrent;
session = JSON.parse(session);

//communicates to parents who have access to the resource(WsFederatedAuthentication)
window.parent.postMessage("Access: true", "*");

// sometimes the load bizagi.loader.js?_4352 get HTTP error 302
if (typeof bizagi === "undefined") {
    window.location.reload();
}

// Gets the loader instance, and load the module
var loader = bizagi.loader;
BIZAGI_PATH_TO_BASE = "./";


/**
 * This method shows generic error message
 * @param error
 */
var showErrorView = function(error){
        var self = this;
        if (typeof $ != "undefined" && error && bizagi.detectDevice() == "desktop") {
            var buttons = {};

            var genericMessage = bizagi.localization.getResource("workportal-general-error-message-contact-administrator");
            var footerGenericMessage = bizagi.localization.getResource("workportal-general-error-message-contact-administrator-footer");
            var showDetails = bizagi.localization.getResource("workportal-general-error-message-view-details");
            var hideDetails = bizagi.localization.getResource("workportal-general-error-message-hide-details");

            var linkShowDetails = "";
            if(bizagiConfig.environment === "debug" || bizagiConfig.isProduction === false){
                linkShowDetails = "<a class='showDetail' href='javascript:void(0)'>" + showDetails + "</a> ";
            }

            var contentDialog = "" +
                "<div><div class='dialog-content-wrapper' style='height:200px;max-height:500px;'>" +
                    "<div class='generic-message detailsShown' style='width: 535px; padding-top: 20px;'> " +
                        "<div style='overflow:hidden;'>" +
                            "<i class='bz-icon bz-icon-error bz-icon-50' " +
                                "style='font-size: 32px;float: left;margin: 10px 20px 90px 20px; color: #e55f6f'></i>" +
                            "<div style='float:right;width:450px;'>" +

                                "<p style='font-size: 21px;'>" +
                                    genericMessage +
                                "</p>" +
                                "<hr />" +
                                "<span style='font-size: 12px;'>" + footerGenericMessage +".<br /> " + linkShowDetails +

                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<div class='detailsShown' style='display:none;'>" +
                        "<p><span style='font-size: 12px;'><a class='showDetail' href='javascript:void(0)'>" + hideDetails + "</a></span></p>" +
                        "<div class='ui-bizagi-error'>"+ error +"</div>" +
                    "</div>" +
                "</div></div>";

            var dialogTemplate = $(contentDialog);
            $("a.showDetail", dialogTemplate).on( "click", function() {
                $(".detailsShown", dialogTemplate).toggle();
            });

            // Also close the popup
            bizagi.workportal.desktop.popup.closePopupInstance();

            // Hide waiting modal box

            buttons[bizagi.localization.getResource("workportal-case-dialog-box-close")] = function () {
                $(this).dialog('close');
            };

            dialogTemplate.dialog({
                modal: true,
                title: "Error",
                closeOnEscape: true,
                width: 550,
                height: "auto",
                buttons: buttons,
                close: function(){
                    $(this).dialog('destroy').remove();
                }
            });
        }
        else{
            window.alert(error);
        }
};

loader.nativeAjax(loader.getPathUrl(bizagiConfig.proxyPrefix+ "Api/Authentication/BizagiConfig"), function (response) {
    var bizagiConfig = JSON.parse(response.responseText);

    /**
     * This key enable the analysis of invocations of multiaction service,
     * looking for a circular dependencies.
     *
     * @default By default the value depend of environment
     * @type {boolean}
     */
    bizagi.override.detectCircularDependencies = !bizagiConfig.isProduction;

    bizagiConfig.groupByCaseNumber = bizagiConfig.groupByCaseNumber;

    // Store configuration in session storage
    window.sessionStorage.setItem("BizagiConfiguration", response.responseText);

    if (bizagiConfig.code === "FED_AUTHENTICATION_ERROR") {
        window.top.document.location = bizagiConfig.message;
        return;
    }

    if (bizagiConfig.defaultLanguage) {
        bizagiConfig.defaultLanguage = bizagiConfig.defaultLanguage;
        bizagiConcurrent = bizagiConfig.isConcurrentSession;
    } else {
        if (bizagiConfig.code) {
            if (bizagiConfig.code === "AUTHENTICATION_ERROR") {
                window.location.href = "App/Inicio/UserNotValid.aspx";
            } else {
                alert(bizagiConfig.code + "\n" + bizagiConfig.message);
            }
        }
    }
    for(var k in bizagiConfig) {window.bizagiConfig[k]=bizagiConfig[k]};
}, function(response){
    // Error callback
    window.alert("Something went wrong! "+ response.responseURL + " "+response.responseText);
});

loader.preInit(["bizagiDefault", bizagiConfig.environment, undefined, "./"], [
      bizagiConfig.defaultLanguage || session.language || "en", bizagiConfig.log || false, bizagi.override.Inbox_RowsPerPage || "",
    [session.symbol || "$", session.decimalSeparator || ",", session.groupSeparator || ".", session.decimalDigits || "2"],
    [session.shortDateFormat || "dd/MM/yyyy", session.timeFormat || "H:mm", session.longDateFormat || "dddd, dd' de 'MMMM' de 'yyyy"],
    [session.uploadMaxFileSize || bizagiConfig.uploadMaxFileSize || "1048576"], "",
    "ASP.NET_SessionId"
]);

loader.init(function () {
    // Check if Bizagi its a oAuth server provider
    var path = location.pathname.split("/");
    var urlParameters = bizagi.readQueryString();
    var oAuthRequest = (isLoginExternal(path) || (urlParameters.type && (urlParameters.type == "oauth2AsServer" || urlParameters.type == "oauth2AsBridge")));

    function isLoginExternal(path) {
        var _valueLogin = false;

        for (var i = 0; i < path.length; i++) {
            if (path[i] === "loginexternal.html") {
                _valueLogin = true;
            }
        }
        return _valueLogin;
    };

    if (session.isAuthenticate == "true" && !oAuthRequest) {

        loader.nativeAjax(loader.getPathUrl(bizagiConfig.proxyPrefix + "Rest/Licenses"), function (response) {
            try {
                var objectResponse = JSON.parse(response.response);
                if (objectResponse.status === "error") {
                    errorLicenses = true;
                    window.location.href = "error.html?message=" + objectResponse.message + "&type=" + objectResponse.type;
                }
            }
            catch (err) {
            }
        });

        BIZAGI_ENABLE_FLAT = true;//Flag to smartphone & tablet
        if (!bizagiConfig.themesEnabled) {
            var module = bizagi.detectDevice() !== "desktop" ? "workportalflat": "workportal";
            loader.start(module).then(function () {

                // Catch all XHR errors and show a generic Error Message Window
                bizagi.showErrorAlertDialog = true;

                $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
                    if(bizagi.showErrorAlertDialog &&
                        jqXHR.status != 401 && //Dont show message when authentication fails
                        jqXHR.status != 404){//Dont show message on feature plans
                        if(typeof thrownError == "object"){
                            showErrorView(thrownError.message);
                        }else{
                            // Extract data from jqXHR object
                            try{
                                var data = JSON.parse(jqXHR.responseText);
                                if(data.message){
                                    showErrorView(thrownError +": "+data.message);
                                }else{
                                    showErrorView(thrownError);
                                }
                            }catch(e){
                                showErrorView(thrownError);
                            }
                        }
                        bizagi.showErrorAlertDialog = true;
                    }

                });

                if (bizagiConfig.environment === "debug") {
                    var links = document.getElementsByTagName('link');
                    var typePattern = /^text\/(x-)?less$/;

                    less.sheets = [];

                    for (var i = 0; i < links.length; i++) {
                        if (links[i].rel === 'stylesheet/less' || (links[i].rel.match(/stylesheet/) &&
                            (links[i].type.match(typePattern)) || links[i].href.match(/less.css/))) {
                            less.sheets.push(links[i]);
                        }
                    }

                    less.refresh(true);
                }

                var workportal = window.bizagiWorkportal = new bizagi.workportal.facade({
                    proxyPrefix: bizagiConfig.proxyPrefix || ""
                });

                workportal.execute();

                if (bizagiConcurrent === true) {
                    var validNavigation;
                    $(document).on('keydown keyup', function (e) {
                        if (e.which === 116 || e.which === 82 && e.ctrlKey) {
                            validNavigation = true;
                        }
                    });
                    $(window).on('beforeunload', function (e) {
                        if (!validNavigation && typeof $(e.target.activeElement).attr('class') == "undefined") {
                            workportal.dataService.logoutBeforeUnload();
                        }
                    });
                }
            });
        }
        else {
            loader.start("theme.base").then(function () {
                if (bizagiConfig.environment === "debug") {
                    var links = document.getElementsByTagName('link');
                    var typePattern = /^text\/(x-)?less$/;

                    less.sheets = [];

                    for (var i = 0; i < links.length; i++) {
                        if (links[i].rel === 'stylesheet/less' || (links[i].rel.match(/stylesheet/) &&
                            (links[i].type.match(typePattern)) || links[i].href.match(/less.css/))) {
                            less.sheets.push(links[i]);
                        }
                    }

                    less.refresh(true);
                }

                var workportal = window.bizagiWorkportal = new bizagi.workportal.facade({
                    proxyPrefix: bizagiConfig.proxyPrefix || ""
                });
                
                var desktopWorkportal = new bizagi.workportal.desktop.facade({
                    proxyPrefix: bizagiConfig.proxyPrefix || ""
                });

                var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(self.dataService);
                servicesPD.setCustomizeTheme();
            });
        }
    } else {
        BIZAGI_ENABLE_FLAT = false;//Flag to load smartphone & tablet old device
        // Initialize login module
        if (window.self !== window.top) {
            window.top.document.location = window.self.location;
        }else {

            var path = location.pathname.split("/");            
            var loginModule = "";            

            if (isLoginExternal(path)) {
                loginModule = "loginexternal";
            } else {
                loginModule = "login";
            }

            loader.start(loginModule).then(function () {
                // Get parameters for Oauth
                var oAuthParameters = {
                    type: urlParameters.type,
                    oAuth2InternalState:urlParameters.oAuth2InternalState,
                    syncToken:urlParameters.syncToken,
                    oauth2sso:urlParameters.oauth2sso
                };
                var login = new bizagi.login.facade({
                    proxyPrefix: bizagiConfig.proxyPrefix || "",
                    oAuthParameters: oAuthParameters
                });
                login.execute();
            });


        }
    }
});

