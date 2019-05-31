/**
 * Admin module to manage Project Name
 *
 * @author Edward J Morales
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.projectName", {}, {
    /*
	 *   Returns the widget name
	 */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROJECTNAME;
    },


    init: function (workportalFacade, dataService, params) {
        var self = this;
       

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.projectname": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.projectname").concat("#ui-bizagi-workportal-widget-admin-projectname"),
         //   "admin.holidays.calendar.schema": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.holidays").concat("#ui-bizagi-workportal-widget-admin-holidays-calendar-schema"),
            useNewEngine: false
        });
    },

    /*
	 *   Renders the content for the current controller
	 */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.projectname");

        var content = self.content = $.tmpl(template);

        $("button",content).button();

        return content;
    },

    showError: function(error,$messageContainer){
            var $message = '<i class="bz-icon bz-icon-error"></i>&nbsp; Error:'+error;
        $messageContainer.empty();
        $messageContainer.show();
        $messageContainer.removeClass("status-success");
        $messageContainer.addClass("status-error");
        $messageContainer.html($message);
    },

    showSuccess: function(success,$messageContainer){
        var $message = '<i class="bz-icon bz-icon-test"></i>&nbsp;'+success;
        $messageContainer.empty();
        $messageContainer.show();
        $messageContainer.removeClass("status-error");
        $messageContainer.addClass("status-success");
        $messageContainer.html($message);
    },

    postRender: function () {
        var self = this;
        var content = self.getContent();
        var $messageContainer = $(".projectname-message-status",content);

        $("input", content).on("keypress", function(){
           $messageContainer.hide();
            if($(this).val().length >= 0){
                $("input", content).removeClass("status-error");
            }
        });

        $.when(self.dataService.getProjectName()).done(function (data) {
            $("input", content).val(data.projectName);
        }).fail(function (e) {
            console.log("ERROR", e);
        });

        $("[name='cancel']",content).on("click", function(){
            self.params.dialogBox.dialog("close");
        });

        $("[name='save']",content).on("click", function(){
           var projectName = $("input", content).val();
            $(content).startLoading({
                overlay: true
            });

            if(projectName.length == 0){
                $("input", content).addClass("status-error");
                $(content).endLoading();
                return
            }

            $.when(self.dataService.setProjectName(projectName)).done(function(response){
                $(content).endLoading();
                self.showSuccess(bizagi.localization.getResource("workportal-widget-admin-projectname-success"), $messageContainer);
            }).fail(function(error){
                error.responseText = error.responseText || {"message":bizagi.localization.getResource("workportal-general-error")};
                var errorObj = JSON.parse(error.responseText);
                console.log("Error:",error);
                $(content).endLoading();
                self.showError(errorObj.message, $messageContainer);
            })
        });
    }
});