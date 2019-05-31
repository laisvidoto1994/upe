bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.adhoc.create.process", {}, {

    init: function (workportalFacade, dataService, params) {

        var self = this;

        self.notifier = bizagi.injector.get("notifier");

        // Call base
        self._super(workportalFacade, dataService, params);

        // Load Templates
        self.loadTemplates({
            "adhoc.create.process": bizagi.getTemplate("bizagi.workportal.desktop.widgets.adhoc.create.process").concat("#adhoc-create-process")
        });
    },

    /**
     * Renders the template defined in the widget
     * @return {*}
     */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("adhoc.create.process");
        self.content = template.render();
        return self.content;
    },

    /**
     * Method called after render widget
     */
    postRender: function () {
        var self = this;
        self.addEventHandlers();
    },

    /**
     * Called when change input and validate form
     * @returns {boolean}
     */
    validateForm: function(){
        var self = this;
        var isValidForm = false;
        var name = $(".js-input-name", self.content);
        if (name.val() && name.val() !== "") {
            name.next().find("span").html("");
            isValidForm = true;
        } else {
            var nameValidation = bizagi.localization.getResource("workportal-general-error-field-required");
            nameValidation = nameValidation.replace("{0}", bizagi.localization.getResource("workportal-widget-admin-adhoc-processes-name"));
            name.next().find("span").html(nameValidation);
            isValidForm = false;
        }
        return isValidForm;
    },

    /**
     * Trigger when click cancel button
     */
    onClickCancel: function () {
        var self = this;
        self.publish("closeCurrentDialog");
    },

    /**
     * Trigger when submit form
     * @param event
     */
    onSubmitFormCreateProcess: function(event){
        event.preventDefault();
        var self = this;
        if (self.validateForm()) {
            var paramsNewProcess = {
                displayName: $("input", self.content).val()
            };

            $.when(self.dataService.createNewAdhocProcess(paramsNewProcess)).done(function (data) {
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-created"), ""));
                self.publish("closeCurrentDialog");
            }).fail(function (error) {
                bizagi.log(error);
            });
        }
    },

    /**
     * Add event handlers to elements
     */
    addEventHandlers: function () {
        var self = this;
        $(".js-input-name", self.content).on("input", $.proxy(self.validateForm, self));
        $("#button-cancel-create-adhoc-process", self.content).on("click", $.proxy(self.onClickCancel, self));
        $("form", self.content).on("submit", $.proxy(self.onSubmitFormCreateProcess, self));
    },

    /**
     * Remove event handlers to elements. Dispose widget
     */
    dispose: function () {
        var self = this;
        $(".js-input-name", self.content).off("input", $.proxy(self.validateForm, self));
        $("#button-cancel-create-adhoc-process", self.content).off("click", $.proxy(self.onClickCancel, self));
        $("form", self.content).off("submit", $.proxy(self.onSubmitFormCreateProcess, self));
    }
});