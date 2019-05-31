/*
*   Name: BizAgi Tablet Render Text Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the text render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.text.extend("bizagi.rendering.text", {}, {


    renderSingle: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();


        self.input = (control.find("input").length != 0) ? control.find("input") : control.html("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");


        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
        }
        else {
            container.addClass("bz-command-edit-inline");
            self.input.removeAttr("readonly");
            self.configureHandlers();
        }


    },

    postRenderSingle: function () {
        //Attach event for retype double
        var self = this;
        var properties = self.properties;

        self._super();

        if (properties.retype == "double") {
            self.attachRetypeDouble();
        }

    },

    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        self.setValue(value, false);

        // This is temporal
        if (typeof (value) == "object") return;
        value = typeof (value) == "boolean" ? value.toString() : value;

        if (!properties.editable) {
            value = value.replaceAll("<", "&#60");
            value = value.replaceAll(">", "&#62");
            value = value.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
            self.input.html(jQuery.nl2br(value));
        } else {
            value = value.replaceAll("\\n", " ").replaceAll("\n", " ");
            value = value.replaceAll("&amp;", "&");
            self.input.html(value);
            self.input.val(value);
        }

    },

    renderEdition: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        var textTmpl = self.renderFactory.getTemplate(self.getTemplateEditionName());
        self.inputEdition = $.tmpl(textTmpl);

    },
    setDisplayValueEdit: function (value) {
        var self = this;
        self.inputEdition.val(value);
    },

    actionSave: function () {

        var self = this;
        var value = self.inputEdition.val();
        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);
    },

    getTemplateName: function () {
        return "text";
    },
    getTemplateEditionName: function () {
        return "edition.text";
    },

    attachRetypeDouble: function () {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length == 0) return;

        // Apply blur handler to check value
        input.blur(function () {
            var control = $(this);
            if ($(control).attr("type") != "hidden" &&
                $(control).css("display") != "none" &&
                $(control).css("visibility") != "hidden") {

                if (!control.data("oldValue") || $(this).data("oldValue") == "") {

                    // Check that there is something in the value
                    if (control.val() == "")
                        return;

                    // Check if a value has already been set
                    if (control.val() == control.attr("newValue"))
                        return;

                    control.data("oldValue", control.val());
                    control.val("");
                    // Create new tooltip
                    try {
                        control.tooltip("destroy");
                    } catch (e) { }
                    control.attr("title", self.getResource("render-number-retype")); //"Re-escriba el valor"
                    control.tooltip();
                    control.tooltip("open");
                    // Focus after 100ms to avoid bubbling
                    setTimeout(function () { control.focus(); input.focus(); }, 100);

                }

                else {
                    if (control.val() != control.data("oldValue")) {
                        self.setValue("");
                        control.val("");
                        control.data("oldValue", "");
                        control.tooltip("destroy");
                        control.attr("title", self.getResource("render-text-retype-error"));
                        control.tooltip();
                        control.tooltip("open");
                        setTimeout(function () { control.focus(); }, 100);
                    } else {

                        control.data("newValue", control.val());
                        control.data("oldValue", "");
                        // Destroy tooltips
                        control.tooltip("destroy");
                    }

                }
            }
        });

    }

});
