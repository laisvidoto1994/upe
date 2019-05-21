
/*
*   @tittle: BizAgi FormModeler Editor Hacks Rendering Form
*   @authors: Alexander Mejia
	@date: 05-mar-12
*   @Comments:
*   -   This script will define basic stuff for enable the rendering Form
*		in the formModeler (delete div button container)
*/

bizagi.rendering.form.original = $.extend(true, {}, bizagi.rendering.form.prototype);

$.extend(bizagi.rendering.form.prototype, {

    /*
    *   Renders the current container
    *   Removes buttons from original rendering
    */
    postRenderContainer: function (form) {
        var self = this;

        // Call original rendering
        bizagi.rendering.form.original.postRenderContainer.apply(this, arguments);

        // Remove button container
        var allowButtons = typeof (self.params.allowButtons) !== undefined ? self.params.allowButtons : false;
        if (!allowButtons) {
            $(".ui-bizagi-button-container", form).remove();
        }

        if (self.properties.messageValidation && self.properties.messageValidation.length > 0) {
            var messageElement = self.createMessageValidationElement(self.properties.messageValidation);
            form.prepend(messageElement);
        }

        return form;
    },

    createMessageValidationElement: function (message) {
        var self = this;

        var resource = bizagi.localization.getResource("formmodeler-validations-form");

        var messageElement = $('<div class="ui-message-validation"/>');
        $('<span>' + resource + '<i class="biz-ico bz-studio bz-warning-red_16x16_standard" title="' + message + '"></i></span>').appendTo(messageElement);
        $(messageElement, "div").click(function () {
            self.triggerGlobalHandler("showPropertiesForm");
        });

        return messageElement;
    }

});
