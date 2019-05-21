/*
*   Name: Bizagi Wizard Presenter Class
*   Author: Diego Parra
*   Date: 08/11/2012
*/
bizagi.editor.observableClass.extend("bizagi.editor.wizard.presenter", {}, {

    /*
    *   Creates a new wizard instance
    */
    createWizard: function (canvas, params) {
        try {
            var control = params.control;
            var fn = eval("var bafn = function(canvas, params) { " +
                    " return new bizagi.editor.wizard." + control + "(canvas, params);" +
                    "};bafn");

            var wizard = fn(canvas, params);
            return wizard;

        } catch (e) {
            throw "Can't create a wizard for " + control;
        }
    },

    /*
    *   Shows the wizard
    */
    show: function (params) {
        var self = this;
        var defer = this.popupDeferred = new $.Deferred();

        // Create popup
        var popup = this.popup = bizagi.createPopup({
            name: "bz-fm-wizard",
            container: "form-modeler",
            additionalClass: "bz-fm-wizard-popup-" + params.control,
            title: bizagi.localization.getResource("bizagi-editor-wizard-title-" + params.control),
            center: true,            
            onClose: function (params) {
                defer.resolve(params);
            }
        });

        // Create the editor
        this.wizard = this.createWizard(popup.content, $.extend(params, { presenter: this, popup: popup }));
        this.wizard.render();

        return defer.promise();
    },

    /*
    *   Closes the popup
    */
    closePopup: function (result) {
        this.popup.close(result);
    }
});