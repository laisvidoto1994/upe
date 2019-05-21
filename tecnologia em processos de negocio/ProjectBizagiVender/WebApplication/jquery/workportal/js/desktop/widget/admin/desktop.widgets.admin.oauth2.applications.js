/**
 * Admin module to manage applications OAuth 2
 * @author Alex Esteban Rojas Gutierrez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.oauth2Applications", {}, {

    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_OAUTH2APPLICATIONS;
    },

    init: function (workportalFacade, dataService, params) {
        var self = this;
        var templateName = "bizagi.workportal.desktop.widgets.admin.oauth2.applications";

        // Call base
        self._super(workportalFacade, dataService, params);

        // Load templates
        self.loadTemplates({
            "admin.oauth2applications": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-oauth2applications"),
            "admin.edit.oauth2applications": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-edit-oauth2applications"),
            "admin.add.oauth2applications": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-add-oauth2applications"),
            useNewEngine: false
        });

        // Model's declaration
        self.CurrentClientData = {};
    },

    renderContent: function () {
        var self = this;
        self.content = $.tmpl(self.getTemplate("admin.oauth2applications"));
        return self.content;
    },
    /* Load all the templates */
    loadtemplates: function () {
        var self = this;
        self.contentOauth = $.tmpl(self.getTemplate("admin.oauth2applications"));

    },

    postRender: function () {
        var self = this;
        var content = self.getContent();
        content.html(self.contentOauth);
        self.performSimpleGrid();
    },

    performSimpleGrid: function () {
        var self = this;
        var simpleGridPlugginOptions = {
            allowAdd: true,
            allowEdit: true,
            allowDelete: true,
            allow: true,
            displayName: 'Oauth',
            pageSize: 10,
            onDataBinding: function(args) {
                var def = $.Deferred();
                $.when(self.dataService.getOAuth2Applications().done(function (data,args) {
                    var responseOauth = {};

                    if(data.data.length){
                        var headers = ['Id', 'Name', 'Description', 'ClientId', 'ClientSecret', 'AuthorizationGrantType', 'DefaultUserDomain', 'DefaultUserName', 'RedirectUri', 'RedirectUriStrategy', 'Website'];
                        responseOauth.header = $.map($(headers).filter(Object.keys(data.data[0])), function (item) {
                            return { attributeType : 1004,
                                dataType : 2,
                                displayName :  bizagi.localization.getResource('workportal-widget-admin-oauth2-applications-' + item.toLowerCase()),
                                fieldValue :  'idGuestSH',
                                xpath : 'GuestSH'}
                        });
                    }

                    self.namesApplications = [];

                    responseOauth.row = $.map(data.data, function (item) {
                        self.namesApplications.push(item.Name);
                        return [$.map($(headers).filter(Object.keys(data.data[0])), function(key) {
                            return item[key];
                        })];
                    });

                    /*responseOauth.total = data.data.length;
                     responseOauth.page = args.pag || 1;
                     responseOauth.records = data.data.length;*/

                    def.resolve(responseOauth);
                }).fail(function (error) {
                    bizagi.log(error);
                }));

                $.when(self.dataService.getCurrentUser()).done(function (currentUserData, args) {
                    self.userFullName = currentUserData.user;
                }).fail(function(){
                });

                return def.promise();
            },
            onAdd: function(e, args) {
                self.addApplication(this, 'New');
            },
            onEdit: function(e, args) {
                self.editApplication($(args).attr("data-idrowentity"));
            },
            onDelete: function(e, args) {
                self.deleteApplication($(args).attr("data-idrowentity"));
            },
            getResource: function(key) {
                /*self.getResource(key);*/
            }
        };

        $("#admin-oauth2-applications-table", self.getContent()).simpleGrid(self, simpleGridPlugginOptions).render();
    },

    addApplication: function (element, action) {
        var self = this;

        var tmplGT = $.tmpl(self.getTemplate("admin.add.oauth2applications"), { });
        tmplGT.appendTo("#admin-oauth2-add-application");

        $('#admin-oauth2-applications-wrapper').hide();
        $('#admin-oauth2-add-application').show();

        self.setupAddApplicationEvents();

        self.setupCombos("add");

    },

    setupAddApplicationEvents: function(){
        var self = this;
        $('#btn-admin-oauth2-add').click(function(){self.save()});
        $('#btn-admin-oauth2-cancel').click(function(){self.cancel("add")});
    },

    setupCombos: function (type) {
        var self = this;
        var dataGrandType = [
            {
                displayName: "Authorization Code",
                id: "authorization_code"
            },
            {
                displayName: "Client credentials",
                id: "client_credentials"
            },
            {
                displayName: "All",
                id: "any"
            }
        ];

        var dataRedirectUri = [
            {
                displayName: "Web Application",
                id: "WebApplication"
            },
            {
                displayName: "Mobile Title Bar Browser",
                id: "MobileTitleBarBrowser"
            },
            {
                displayName: "Mobile Localhost Port",
                id: "MobileLocalhostPort"
            }
        ];

        if(type === "add" ){
            var $comboGrandType = $("#biz-wp-oauth2-grant-type-input");
            var $comboAllowedScope = $("#biz-wp-oauth2-allowed-scope-input");
            var $comboRedirectUri = $("#biz-wp-oauth2-redirect-uri-strategy-input");

            self.setupCombo($comboGrandType, dataGrandType,"grantType");
            self.setupCombo($comboRedirectUri, dataRedirectUri,"RedirectUri");
        }

        if(type === "edit" ){
            var $comboEditGrandType = $("#biz-wp-oauth2-edit-grant-type-input");
            var $comboEditAllowedScope = $("#biz-wp-oauth2-edit-allowed-scope-input");
            var $comboEditRedirectUri = $("#biz-wp-oauth2-edit-redirect-uri-strategy-input");
            self.setupCombo($comboEditGrandType, dataGrandType,"editGrantType");
            self.setupCombo($comboEditRedirectUri, dataRedirectUri,"editRedirectUri");
        }

    },

    setupCombo: function(elem, data, dataSelf) {
        var self = this;

        if(dataSelf === "grantType") {self.grantType = data[0].id}
        if(dataSelf === "RedirectUri") {self.RedirectUri = data[0].id}

        self.pos = 0;

        if(dataSelf === "editGrantType") {
            self.editGrantType = self.editGrantType || data[0].id;
            $.each(data, function(i) {
                if(data[i].id === self.editGrantType){ self.pos = i;}
            })
        }

        if(dataSelf === "editRedirectUri") {
            self.editRedirectUri = self.editRedirectUri || data[0].id;
            $.each(data, function(i) {
                if(data[i].id === self.editRedirectUri){ self.pos = i;}
            })
        }

        elem.uicombo({
            data: { combo: data },
            initValue: data[self.pos],
            itemValue: function (item) {
                return item.id;
            },
            itemText: function (item) {
                return item.displayName;
            },
            onChange: function (obj) {

                if(dataSelf === "grantType" || dataSelf === "editGrantType") {
                    if(dataSelf === "grantType"){self.grantType = obj.ui.data("value")}
                    if(dataSelf === "editGrantType"){self.editGrantType = obj.ui.data("value")}
                    if(obj.ui.data("value") === "client_credentials") {
                        $(".bz-oauth2-only-edit-authorization-code").hide();
                        $(".bz-oauth2-only-authorization-code").hide();
                        $(".bz-oauth2-only-edit-client-credentials").show();
                        $(".bz-oauth2-only-client-credentials").show();
                    }else if(obj.ui.data("value") === "authorization_code") {
                        $(".bz-oauth2-only-client-credentials").hide();
                        $(".bz-oauth2-only-authorization-code").show();
                        $(".bz-oauth2-only-edit-client-credentials").hide();
                        $(".bz-oauth2-only-edit-authorization-code").show();
                    }else {
                        $(".bz-oauth2-only-client-credentials").show();
                        $(".bz-oauth2-only-authorization-code").show();
                        $(".bz-oauth2-only-edit-client-credentials").show();
                        $(".bz-oauth2-only-edit-authorization-code").show();
                    }
                }

                if(dataSelf === "RedirectUri" || dataSelf === "editRedirectUri") {
                    if(dataSelf === "RedirectUri"){self.RedirectUri = obj.ui.data("value")}
                    if(dataSelf === "editRedirectUri"){self.editRedirectUri = obj.ui.data("value")}
                    if (obj.ui.data("value") === "WebApplication") {
                        $("#bz-oauth2-only-MobileLocalhostPort").hide();
                        $("#bz-oauth2-edit-only-MobileLocalhostPort").hide();
                        $("#bz-oauth2-only-WebApplication").show();
                        $("#bz-oauth2-edit-only-WebApplication").show();
                    }else if(obj.ui.data("value") === "MobileTitleBarBrowser") {
                        $("#bz-oauth2-only-WebApplication").hide();
                        $("#bz-oauth2-only-MobileLocalhostPort").hide();
                        $("#bz-oauth2-edit-only-WebApplication").hide();
                        $("#bz-oauth2-edit-only-MobileLocalhostPort").hide();
                    }else {
                        $("#bz-oauth2-only-WebApplication").hide();
                        $("#bz-oauth2-edit-only-WebApplication").hide();
                        $("#bz-oauth2-only-MobileLocalhostPort").show();
                        $("#bz-oauth2-edit-only-MobileLocalhostPort").show();
                    }

                }

                if(dataSelf === "AllowedScope") {self.AllowedScope = obj.ui.data("value")}
                if(dataSelf === "editAllowedScope") {self.editAllowedScope = obj.ui.data("value")}

            }
        });

    },

    save: function(){
        var self = this;

        $(".biz-wp-oauth2-warnings__alert").hide();
        $("#bz-oauth2-applications-error-fields-required").hide();
        $("#bz-oauth2-applications-error-scope-required").hide();

        var inputName =  $("#biz-wp-oauth2-name-input").val();
        var inputDescription =  $("#biz-wp-oauth2-applications-description-input").val();
        var inputWebsite = $("#biz-wp-oauth2-web-site-input").val();
        var inputRedirectUri = $("#biz-wp-oauth2-redirect-uri-input").val();
        var inputDefaultUserDomain = $("#biz-wp-oauth2-user-domain-input").val();
        var inputDefaultUserName =  $("#biz-wp-oauth2-default-user-name-input").val();
        var inputAccessTokenLifetimeInMinutes = parseInt($("#biz-wp-oauth2-access-token-input").val(),10);
        var inputMobileHostPort = parseInt($("#biz-wp-oauth2-mobile-host-port").val(), 10);

        //Allowed scope
        var inputScopeApi = $("#biz-wp-oauth2-scope-api-input").is(':checked');
        var inputScopeLogin = $("#biz-wp-oauth2-scope-login-input").is(':checked');

        var allowedScope = "";

        if (inputScopeApi) {
            allowedScope += "api";
        }

        if (inputScopeLogin) {
            allowedScope += " login";
        }

        var validUrl = false;

        validateGrandType = function(){
            if(self.grantType === "authorization_code"){
                if (inputName && inputRedirectUri && inputAccessTokenLifetimeInMinutes) {return true} else {return false};
            }else if(self.grantType === "client_credentials"){
                if (inputDefaultUserDomain && inputDefaultUserName) {return true} else {return false};
            }else{
                if (inputName && inputRedirectUri && inputAccessTokenLifetimeInMinutes && inputDefaultUserDomain && inputDefaultUserName) {return true}else {return false};
            }
        }

        validateScope = function () {
            if (inputScopeApi || inputScopeLogin) { return true } else { return false }
        }


        if( self.RedirectUri === "WebApplication" && (self.grantType === "authorization_code" || self.grantType === "any") ) {
            var url = inputRedirectUri;
            validUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        }else if( self.RedirectUri === "MobileTitleBarBrowser" && (self.grantType === "authorization_code" || self.grantType === "any") ) {
            inputRedirectUri = "bz:oauth:2.0:server:mobiletitlebarbrowser";
            validUrl = true;
        }else{
            inputRedirectUri = inputMobileHostPort;
            validUrl = true;
        }

        // Number fields validation
        if(inputAccessTokenLifetimeInMinutes < 1){
            $("#bz-oauth2-applications-error-time-invalid").show();
            return;
        }else if (inputMobileHostPort < 1){
            $("#bz-oauth2-applications-error-port-invalid").show();
            return;
        }

        var validFields = validateGrandType() && validateScope();

        if ( validFields ) {

            var validName = $.grep(self.namesApplications,function(n) {return n === $("#biz-wp-oauth2-name-input").val() }  );

            if(validName.length === 0) {

                if(validUrl) {

                    var dataAddApplication = {};
                    dataAddApplication["authorization_grant_type"] = self.grantType;
                    dataAddApplication["allowed_scope"] = allowedScope;
                    dataAddApplication["username_creator"] = self.userFullName;
                    dataAddApplication["redirect_uri_strategy"] = self.RedirectUri;

                    /*This value is necesary because service returns error: url is malformed*/
                    if(self.grantType === "client_credentials") {
                        dataAddApplication["redirect_uri"] = "http://localhost--";
                    }

                    var dataInputs = $( "#formAddOAuthApp :input" ).serializeArray();
                    for (var i = 0; i < dataInputs.length; i++) {
                        if(dataInputs[i].value) {
                            if(dataInputs[i].name === "redirect_uri_port" && self.RedirectUri === "MobileLocalhostPort"){
                                dataAddApplication["redirect_uri"] = dataInputs[i].value;
                            }else{
                                dataAddApplication[dataInputs[i].name] = dataInputs[i].value;
                            }

                        }
                    }

                    self.dataService.createOAuth2Application(dataAddApplication).done(function(){
                        self.performSimpleGrid();
                        self.cancel("add");
                    });

                }else {
                    $("#bz-oauth2-applications-error-url-invalid").show();
                }

            }else {
                $("#bz-oauth2-applications-error-name-duplicated").show();
            }

        }else{
            $("#bz-oauth2-applications-error-fields-required").show();
            if ( !validateScope() ) {
                $("#bz-oauth2-applications-error-scope-required").show();
            }
        }

    },

    getGrantType: function(index){
        var dataGrandType = {
            authorization_code: "Authorization Code",
            client_credentials: "Client credentials",
            any: "All",
        };
        return dataGrandType[index];
    },

    getRedirectStrategy: function(index){
        var dataRedirectStrategy = {
            WebApplication: "Web Application",
            MobileTitleBarBrowser: "Mobile Title Bar Browser",
            MobileLocalhostPort: "Mobile Localhost Port",
        };
        return dataRedirectStrategy[index];
    },
    getMobileLocalhostPort:function(uri, strategy){
        if( strategy === "MobileLocalhostPort" ){
            var port = uri.match(/:([0-9]+)/)[1];
            return parseInt(port);
        }else{
            return '';
        }
    },

    //LOAD FORM TO EDIT OAUTH CLIENT
    editApplication: function (applicationId) {
        var self = this;
        var content = self.getContent();
        content = (content[4])?content[4]:content[2];

        $.when(self.dataService.getOAuth2Application(applicationId)).done(function (data) {
            if(data.success){
                // data = data.data;
                self.CurrentClientData = data.data;
                var tmplGT = $.tmpl(
                    self.getTemplate("admin.edit.oauth2applications"),
                    {
                        editGrantType: self.CurrentClientData.AuthorizationGrantType,
                        data: self.CurrentClientData
                    },{
                        getGrantType: self.getGrantType,
                        getRedirectStrategy: self.getRedirectStrategy,
                        getMobileLocalhostPort: self.getMobileLocalhostPort
                    }
                );
                tmplGT.appendTo(content);

                self.ActualNameForEdit = self.CurrentClientData.Name;
                self.DataAllowedScope = self.CurrentClientData.AllowedScope;

                self.editGrantType = self.CurrentClientData.AuthorizationGrantType;
                self.editRedirectUri = self.CurrentClientData.RedirectUriStrategy;

                function checkedScope(scope) {
                    return $.grep(self.CurrentClientData.AllowedScope, function (n) { return n === scope }).length;
                }

                if (checkedScope("api") > 0) {
                    $("#biz-wp-oauth2-edit-scope-api-input", content).prop("checked", true);
                }

                if ( checkedScope("login") > 0 ) {
                    $("#biz-wp-oauth2-edit-scope-login-input", content).prop("checked", true);
                }

                //Visual Setup for Grant Type, Allowed Scope and Redirect Strategy
                if(!self.CurrentClientData.IsNative){
                    self.setupCombos("edit");

                    if(self.editGrantType === "client_credentials") {
                        $(".bz-oauth2-only-edit-client-credentials", content).show();
                        $(".bz-oauth2-only-edit-authorization-code", content).hide();
                    }else if(self.editGrantType === "authorization_code") {
                        $(".bz-oauth2-only-edit-client-credentials", content).hide();
                        $(".bz-oauth2-only-edit-authorization-code", content).show();
                    }else {
                        $(".bz-oauth2-only-edit-client-credentials", content).show();
                        $(".bz-oauth2-only-edit-authorization-code", content).show();
                    }

                    if(self.CurrentClientData.RedirectUriStrategy === "WebApplication"){
                        $("#bz-oauth2-edit-only-WebApplication", content).show();
                        $("#bz-oauth2-edit-only-MobileLocalhostPort", content).hide();
                    }else if(self.CurrentClientData.RedirectUriStrategy === "MobileTitleBarBrowser") {
                        $("#bz-oauth2-edit-only-WebApplication", content).hide();
                        $("#bz-oauth2-edit-only-MobileLocalhostPort", content).hide();
                    }else {
                        $("#bz-oauth2-edit-only-WebApplication", content).hide();
                        $("#bz-oauth2-edit-only-MobileLocalhostPort", content).show();
                    }
                }else{
                    //Disable Allowed Scope Checkbox
                    $("#biz-wp-oauth2-edit-scope-api-input", content).attr("disabled", true);
                    $("#biz-wp-oauth2-edit-scope-login-input", content).attr("disabled", true);
                }
            }

            $('#admin-oauth2-applications-wrapper').hide();
            $(content).show();

            //Buttons Setup
            $('#btn-admin-oauth2-update-keys', content).click(function(){self.updateApplicationKeys()});
            $('#btn-admin-edit-oauth2-cancel', content).click(function(){self.cancel("edit")});
            if(!self.CurrentClientData.IsNative){
                $('#btn-admin-edit-oauth2-add', content).click(function(){self.updateApplication()});
            }else{
                $('#btn-admin-edit-oauth2-add', content).click(function(){self.updateNaviteApplication()});
            }

        }).fail(function(){
        });


    },

    //UPDATE ACTION FOR NATIVE APPLICATIONS
    updateNaviteApplication: function(){
        var self = this;
        var dataAddApplication = {accessTokenLifetimeInMinutes: ""};
        dataAddApplication.accessTokenLifetimeInMinutes = parseInt($("#biz-wp-oauth2-edit-access-token-input").val(),10);
        if(dataAddApplication.accessTokenLifetimeInMinutes > 0){
            self.dataService.updateOAuth2Application(dataAddApplication,self.CurrentClientData.Id).done(function(){
                self.performSimpleGrid();
                self.cancel("edit");
            });
        }else{
            $("#bz-oauth2-applications-error-time-invalid").show();
        }
    },
    //UPDATE ACTION
    updateApplication: function(){
        var self = this;

        $(".biz-wp-oauth2-warnings__alert").hide();

        var inputName =  $("#biz-wp-oauth2-edit-name-input").val();
        var appId =  $("#biz-wp-oauth2-edit-id-input").val();
        var inputDescription =  $("#biz-wp-oauth2-applications-edit-description-input").val();
        var inputWebsite = $("#biz-wp-oauth2-edit-web-site-input").val();
        var inputRedirectUri = $("#biz-wp-oauth2-edit-redirect-uri-input").val();
        var inputDefaultUserDomain = $("#biz-wp-oauth2-edit-user-domain-input").val();
        var inputDefaultUserName =  $("#biz-wp-oauth2-default-edit-user-name-input").val();
        var inputAccessTokenLifetimeInMinutes = parseInt($("#biz-wp-oauth2-edit-access-token-input").val(),10);
        var inputMobileHostPort = parseInt($("#biz-wp-oauth2-edit-mobile-host-port").val(),10);

        var validUrl = false;
        var validName = [];

        var inputScopeApi = $("#biz-wp-oauth2-edit-scope-api-input").is(':checked');
        var inputScopeLogin = $("#biz-wp-oauth2-edit-scope-login-input").is(':checked');

        //Allowed scope
        function checkedScope(scope) {
            return $.grep(self.DataAllowedScope, function (n) {
                return n === scope
            }).length;
        }

        //Resolve array scope
        function mergeScope(scope, input) {
            if (checkedScope(scope) > 0 && !input) {
                //Remove scope
                self.DataAllowedScope = $.grep(self.DataAllowedScope, function (n) { return n !== scope });
            } else if (checkedScope(scope) === 0 && input) {
                //Push scope
                (self.DataAllowedScope).push(scope);
            }
        }

        mergeScope("api", inputScopeApi);
        mergeScope("login", inputScopeLogin);

        //Convert array to string for send at service
        var AllowedScope = (self.DataAllowedScope).join(" ");


        validateScope = function () {
            if (inputScopeApi || inputScopeLogin) { return true } else { return false }
        }


        validateGrandType = function(){
            if(self.editGrantType === "authorization_code"){
                if (inputName && inputRedirectUri && inputAccessTokenLifetimeInMinutes) {return true}else {return false};
            }else if(self.editGrantType === "client_credentials"){
                if (inputDefaultUserDomain && inputDefaultUserName) {return true}else {return false};
            }else{
                if (inputName && inputRedirectUri && inputAccessTokenLifetimeInMinutes && inputDefaultUserDomain && inputDefaultUserName) {return true}else {return false};
            }
        }

        if( self.editRedirectUri === "WebApplication" && (self.editGrantType === "authorization_code" || self.editGrantType === "any") ) {
            var url = inputRedirectUri;
            validUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        }else if( self.editRedirectUri === "MobileTitleBarBrowser" && (self.editGrantType === "authorization_code" || self.editGrantType === "any") ) {
            $("#biz-wp-oauth2-edit-redirect-uri-input").val("bz:oauth:2.0:server:mobiletitlebarbrowser");
            validUrl = true;
        }else{
            inputRedirectUri = inputMobileHostPort;
            validUrl = true;
        }

        // Number fields validation
        if(inputAccessTokenLifetimeInMinutes < 1){
            $("#bz-oauth2-applications-error-time-invalid").show();
            return;
        }else if (inputMobileHostPort < 1){
            $("#bz-oauth2-applications-error-port-invalid").show();
            return;
        }

        var validFields = validateGrandType() && validateScope();

        if( validFields ) {

            if($("#biz-wp-oauth2-edit-name-input").val() != self.ActualNameForEdit){
                validName = $.grep(self.namesApplications,function(n) {return n === $("#biz-wp-oauth2-edit-name-input").val() }  );
            }

            if(validName.length === 0) {

                if(validUrl){

                    var dataAddApplication = {};
                    dataAddApplication["authorization_grant_type"] = self.editGrantType;
                    dataAddApplication["allowed_scope"] = AllowedScope;
                    dataAddApplication["username_creator"] = self.userFullName;
                    dataAddApplication["redirect_uri_strategy"] = self.editRedirectUri;

                    if(self.editGrantType === "client_credentials") {
                        dataAddApplication["redirect_uri"] = "http://localhost--";
                    }


                    var dataInputs = $( "#formEditOAuthApp :input" ).serializeArray();
                    for (var i = 0; i < dataInputs.length; i++) {
                        if(dataInputs[i].value) {
                            if(dataInputs[i].name === "redirect_uri_port" && self.editRedirectUri === "MobileLocalhostPort"){
                                dataAddApplication["redirect_uri"] = "http://localhost:" + dataInputs[i].value;
                            }else{
                                dataAddApplication[dataInputs[i].name] = dataInputs[i].value;
                            }

                        }
                    }

                    self.dataService.updateOAuth2Application(dataAddApplication,appId).done(function(){
                        self.performSimpleGrid();
                        self.cancel("edit");
                    });

                }

            }else {
                $("#bz-oauth2-applications-error-name-duplicated").show();
            }

        }else{
            $("#bz-oauth2-applications-error-fields-required").show();
            if (!validateScope()) {
                $("#bz-oauth2-applications-edit-error-scope-required").show();
            }
        }

    },

    //UPDATE OAUTH CLIENT KEYS ACTION
    updateApplicationKeys: function(){
        var self = this;
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-widget-admin-oauth2-applications-update-keys-confirmation"), "Bizagi", "warning")).done(function () {
            var appId =  $("#biz-wp-oauth2-edit-id-input").val();
            var params = {
                client_id: self.CurrentClientData.ClientId,
                client_secret: self.CurrentClientData.ClientSecret
            };
            self.dataService.updateClientSecretKeysOAuth2Application(params, appId).done(function(data){
                if(data.success){
                    self.performSimpleGrid();
                    self.cancel("edit");
                }else{
                    $.when(bizagi.showMessageBox( bizagi.localization.getResource("workportal-widget-admin-oauth2-error-update-keys") ,  null , 'warning' )).done(function () {
                        self.performSimpleGrid();
                        self.cancel("edit");
                    });
                }
            }).fail(function(err){
                $.when(bizagi.showMessageBox( bizagi.localization.getResource("workportal-widget-admin-oauth2-error-update-keys") ,  null , 'warning' )).done(function () {
                    self.performSimpleGrid();
                    self.cancel("edit");
                });
            });
        });
    },

    //DELETE ACTION
    deleteApplication: function (applicationId) {
        var self = this;
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("render-grid-delete-confirmation"), "Bizagi", "warning")).done(function () {
            self.dataService.deleteOAuth2Application(applicationId);
            self.performSimpleGrid();
        });
    },

    //CANCEL ACTION
    cancel: function (type) {
        var self = this;
        if (type === "add") { $('#admin-oauth2-add-application').children().remove() }
        if (type === "edit") { $('#admin-oauth2-edit-application').children().remove() }
        $('#admin-oauth2-applications-wrapper').show();
        self.cleanData();
    },

    //CLEAN DATA
    cleanData: function () {
        self.AllowedScope = null;
        self.editAllowedScope = null;
        self.userFullName = null;
        self.grantType = null;
        self.editGrantType = null;
        self.RedirectUri = null;
        self.editRedirectUri = null;
        $(".biz-wp-input-text").val("");
        $(".biz-wp-oauth2-select-control").children().remove();
        self.CurrentClientData = {};
    }

});
