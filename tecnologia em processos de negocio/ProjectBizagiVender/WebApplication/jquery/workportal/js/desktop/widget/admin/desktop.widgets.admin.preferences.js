/**
 * Name: BizAgi Desktop Widget Administration preferences Implementation
 * 
 * @author Andres Fernando Muñoz
 */


bizagi.workportal.widgets.admin.preferences.extend("bizagi.workportal.widgets.admin.preferences", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        self.guidForm;
        self.isNewForm;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.preferences.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences").concat("#ui-bizagi-workportal-widget-admin-preferences-wrapper"),
            "admin.preferences.container": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences").concat("#ui-bizagi-workportal-widget-preferences-container"),
            "admin.preferences.buttons": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences").concat("#ui-bizagi-workportal-widget-preference-buttons"),
            "admin.preferences.iframe": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences").concat("#ui-bizagi-workportal-widget-preference-iframe"),
            "admin.preferences.error": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences").concat("#ui-bizagi-workportal-widget-preferences-errormessage"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;

        self.container = self.getTemplate("admin.preferences.container");
        self.buttons = self.getTemplate("admin.preferences.buttons");
        self.iframe = self.getTemplate("admin.preferences.iframe");
        self.errorMessage = self.getTemplate("admin.preferences.error");
    },

    postRender: function () {
        var self = this;

        $.when(self.dataService.getPreferenceFormParams()).done(function (data) {

            self.guidForm = (data.id !== "-1") ? data.id : "";

            if (data.errorMessage === true) {
                self.renderErrorMessage();
            } else if (data.isNewForm === true) {
                self.renderPreferences();
            } else {
                self.renderPreferencesOldForm();
            }
        });

    },

    renderErrorMessage: function () {
        var self = this;

        var resource = self.getResource("workportal-widget-admin-entities-message-migrate");
        resource = resource.replace("{build}", bizagi.loader.productBuildToAbout);

        var errorContent = $.tmpl(self.errorMessage, { errorMessage: resource });

        self.content.html(errorContent);

    },

    setupData: function () {
        var self = this;
        var content = self.getContent();
    },

    renderPreferencesOldForm: function () {

        var self = this;

        var $content = self.getContent();
        var url = self.dataService.getUrl({
            "endPoint": "PreferenceFormOld"
        }) + "?idForm=" + self.guidForm + "&referer=userPreferences";

        var $iframeContent = $.tmpl(self.iframe, { "url": url });
        var $iframe = $("iframe", $iframeContent);

        $iframeContent.addClass('loading-iframe');

        $iframe.hide();

        $iframe.load(function () {
            $(this).fadeIn();
        });

        $content.html($iframeContent)

    },

    renderPreferences: function () {
        var self = this;
        var content = self.getContent();
        self.currentUser = bizagi.currentUser.idUser;

        var preferencesParams = {
            h_action: "LOADUSERPREFERENCESFORM",
            h_contexttype: "entity",
            h_guidForm: self.guidForm
        };

        var renderContainer = $.tmpl(self.container);

        bizagi.loader.start("rendering").then(function () {
            var rendering = new bizagi.rendering.facade();
            //request to preferences definition service
            self.dataService.getPreferencesForm(preferencesParams).done(function (data) {
                var renderingParams = { canvas: renderContainer, data: data, type: "" };
                rendering.execute(renderingParams).done(function (form) {
                    self.preferenceForm = rendering.form;
                    self.preferenceForm && self.preferenceForm.properties ? (self.preferenceForm.properties.contexttype ? "" : (self.preferenceForm.properties.contexttype = "entity")) : "";
                    $("#preferences", content).html(renderContainer);
                    content.find("#preferences-buttons").css("display","block");
                    self.handleEvents();
                });
            });
        });
    },

    /*
    *  Buttons for preferences actions
    */
    handleEvents: function () {
        var self = this;
        var content = self.getContent();
        $("#preferences-buttons", content).html($.tmpl(self.buttons));

        $("#update-preferences", content).click(function (e) {
            self.updateData();
        });
    },

    updateData: function () {
        var self = this;

        if (self.preferenceForm.validateForm()) {
            var serviceRender = new bizagi.render.services.service();
            var data = self.preferenceForm.collectRenderValuesForSubmit();
            var content = self.getContent();

            self.startLoading(content);

            $.when(serviceRender.multiactionService.submitData({
                action: "SAVEUSER",
                contexttype: "entity",
                data: data,
                surrogatekey: self.currentUser,
                idPageCache: self.preferenceForm.idPageCache
            })).done($.proxy(function(message){
                content.removeClass("loading-iframe");
                //Change language on sessionStorage if change language on preferences
                if(data.language){
                    $.when(self.dataService.getCurrentUser()).done(function (currentUserData) {
                        assignLanguage(currentUserData.language);
                        bizagi.util.changeData({language: currentUserData.language});
                    }).fail(function(){
                });
                }
                self.renderPreferences();

            }, data));
        }
    },
    startLoading: function(content){
        content.find("#preferences-main-container").css("display","none");
        content.find("#preferences-buttons").css("display","none");
        content.addClass("loading-iframe");
    }

});
