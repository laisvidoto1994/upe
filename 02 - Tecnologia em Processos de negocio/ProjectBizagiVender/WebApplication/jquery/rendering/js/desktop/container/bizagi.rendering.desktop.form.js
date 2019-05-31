/*
*   Name: BizAgi Desktop Form Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
*   -   Will apply a desktop form template
*/

// Auto extend
bizagi.rendering.form.extend("bizagi.rendering.form", {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (container) {
        var self = this;
        var buttons = self.getButtons();

        // Call base
        self._super(container);

        // Style buttons
        buttons.button();

        //Set button length
        var lengthButtons = (buttons) ? buttons.length : 0;

        if (lengthButtons && self.params.type === "form" && self.params.isEntityForm !== true) {

            if (self.properties.orientation == "rtl" && buttons.length > 0 && !self.properties.useCustomButtons) {
                self.buttons.reverse();
            }

            $(document).data('auto-save', self.properties.id);
            self.configureBindAutoSave(function(deferredSave){
                self.autoSaveEvents(deferredSave);
            });

            //bind event beforeunload
            self.beforeUnloadFunction = function (e) {

                var newData = {};
                self.collectRenderValues(newData);
                //if there are changes in the form show a message
                if (!$.isEmptyObject(newData) && $(document).data('auto-save')) {
                    return bizagi.localization.getResource("confirmation-savebox-message2");
                }
                return;
            };
            $(window).unbind('beforeunload').bind('beforeunload', self.beforeUnloadFunction);
        } else {
            self.configureBindAutoSave(function(deferredSave){
                deferredSave.resolve();
            });
        }

        self.buildProcessPath();
        var ecmContainer = (typeof (isWebpart) !== "undefined") ? $(document) : $("#ui-bizagi-wp-app-render-form-content");
        ecmContainer.scroll(function () {
            $(".modal-ecm", this).hide();
        });
    },

    /**
     * Configure autoSave with callback
     * @param callback
     */
    configureBindAutoSave: function(callback){
        var self = this;

        //bind event auto-save
        self.autoSaveFunction = function (e, deferredSave) {
            callback(deferredSave);
        };

        //Keeps the reference of the function required for handling autoSave
        if (self.haveAutosaveAssociated()){
            // Unbind previous events in order to prevent propagation //QAF-2521
            $(document).unbind("save-form", self.saveFormDelegate);
        }
        else{
            self.saveFormDelegate = $.proxy(self.autoSaveFunction, self);
        }
        // Bind event with actual reference of form
        $(document).bind("save-form", {idAutoSave: self.getIdentifierFormForAutosave(), functionSaveFormDelegate: self.saveFormDelegate}, self.saveFormDelegate);
    },

    /**
     * Call from child widgets
     */
    unbindAutoSaveForm: function(){
        var self = this;
        if(self.saveFormDelegate){
            $(document).unbind("save-form", self.saveFormDelegate);
        }
    },

    /**
     * Get a identifier for knows if form have autoSave associated
     * @returns {*}
     */
    getIdentifierFormForAutosave: function(){
        var self = this;
        return self.properties.id || self.properties.uniqueId;
    },

    /**
     * Determine if form have autosave associated, if yes, rewrite function saveFormDelegate
     * @returns {boolean}
     */
    haveAutosaveAssociated: function(){
        var result = false;
        var self = this;
        var autoSaveIdentifier = self.getIdentifierFormForAutosave();
        var autoSaveHandlers = $._data($(document)[0], 'events')["save-form"] || [];
        for(var i = 0, length = autoSaveHandlers.length; i < length; i += 1){
            if(autoSaveHandlers[i].data.idAutoSave === autoSaveIdentifier){
                self.saveFormDelegate = autoSaveHandlers[i].data.functionSaveFormDelegate;
                result = true;
                break;
            }
        }
        return result;
    },

    /*
    * Auto Save Events
    */
    autoSaveEvents: function (deferredSave, saveBox) {
        var self = this;
        var data = {};
        var changes = [];
        var form = self.getFormContainer();
        form.hasChanged(changes);

        /* 
        *saving changes to validate or not the contents into a table
        */
        if (changes.length > 0) {

            $.when(bizagi.showSaveBox(bizagi.localization.getResource("confirmation-savebox-message1"), "Bizagi", "warning", self.properties.orientation)).done(function () {
                self.collectRenderValues(data);
                $.when(self.saveForm(data)).done(function () {
                    //unbinding the save-form
                    if (self.saveFormDelegate){
                        $(document).unbind("save-form", self.saveFormDelegate);
                    }
                    deferredSave.resolve();
                });
            }).fail(function (params) {
                if (params == "cancel") {
                    deferredSave.reject();
                } else {
                    deferredSave.resolve();

                    //unbinding the save-form function in case if is still bound
                    if (self.saveFormDelegate)
                        $(document).unbind("save-form", self.saveFormDelegate);
                }
            });
        } else {
            //unbinding the save-form function in case if is still bound
            if (self.saveFormDelegate)
                $(document).unbind("save-form", self.saveFormDelegate);

            deferredSave.resolve();
        }
    },

    /*
    *   Template method to get the buttons objects 
    */
    getButtons: function () {
        var self = this;
        var container = self.container;

        return $(".ui-bizagi-button-container .ui-bizagi-button", container);
    },

    /*
    *   Template method to implement in each device to customize the container's behaviour to show layout
    */
    configureLayoutView: function () {
        // Do nothing
    },

    /*
    *   Dispose the class so we can detect when a class is invalid already
    */
    dispose: function () {
        var self = this;

        // Remove  the document handlers for auto-save
        $(window).unbind('beforeunload', self.beforeUnloadFunction);

        $(document).unbind("save-form", self.saveFormDelegate);

        // Call base
        self._super();
    },
      /*
    *   Submits all the form to the server and returns a deferred to check when the process finishes
    */
    saveForm: function(data) {
        var self = this;

        // Check is offline form
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        // Collect data
        data = self.collectRenderValuesForSubmit(data);

        // Check if there are deferreds to wait
        var deferredsToWait = null;
        if (data.deferreds) {
            deferredsToWait = $.when.apply($, data.deferreds);
            delete data.deferreds;
        }

        // Wait for deferreds
        return $.when(deferredsToWait).pipe(function() {
            self.startLoading();

            // Submit the form
            return self.dataService.submitData({
                action: "SAVE",
                data: data,
                xpathContext: self.properties.xpathContext,
                idPageCache: self.properties.idPageCache,
                isOfflineForm: isOfflineForm || false
            }).pipe(function() {
                self.endLoading();
            });
        });
    },
    /*
    * Gets changes of current navigation form
    */
    getChanges: function () {
        var self = this;
        var data = {};

        if (typeof (self.collectRenderValues) != "undefined") {
            self.collectRenderValues(data);
        }

        return data;
    },
    /*
     *build path process
     */
    buildProcessPath: function (container) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var queryForm = self.getFormType() == "queryForm";
        var summaryForm = self.params.summaryForm || false;
        var globalForm = self.properties.displayAsReadOnly || false;
        if (mode == "execution" && !queryForm && !summaryForm && !globalForm && self.properties.processPath && self.properties.processPath.length > 0) {
            var template = self.renderFactory.getTemplate("form-process-path");
            var html = $.fasttmpl(template, {processPath: properties.processPath});
            self.pathProcess = html;
        } else {
            self.pathProcess = "";
        }
    }
});
