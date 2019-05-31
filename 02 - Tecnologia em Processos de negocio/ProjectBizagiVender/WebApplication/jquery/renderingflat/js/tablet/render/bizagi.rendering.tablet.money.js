/*
*   Name: BizAgi Tablet Render Money Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the money render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.money.extend("bizagi.rendering.money", {}, {

    /*
    *
    */
    renderReadOnly: function() {
        var self = this;
        var value = self._super();
        var template = self.renderFactory.getTemplate("readonlyNumber");
        var tmpl = $($.fasttmpl(template, {value: value}));
        $(".bz-cm-icon", tmpl).removeClass("bz-rn-icon-number").removeClass("bz-number-icon").addClass("bz-coin-input").addClass("bz-rn-icon-coin");

        return tmpl.get(0).outerHTML;
    },

    /* POSTRENDER 
    =====================================================*/
    postRender: function () {
        var self = this;

        // Call base
        self._super();

        self.numericInput = $(".ui-bizagi-render-numeric", self.getControl());
        self.numericIcon = $(".bz-cm-icon", self.getControl());

        self.numericIcon.removeClass("bz-rn-icon-number").addClass("bz-rn-icon-coin");        
        self.numericIcon.removeClass("bz-number-icon").addClass("bz-coin-input");

        var input = $("input", self.element);
        if (!input || input.length == 0) return;
    },


    /*
    *
    */
    postRenderReadOnly: function() {
        var self = this;
        var control = self.getControl();
        var container = self.getControl();

        container.closest(".ui-bizagi-render").addClass("bz-rn-read-only");
        self.numericInput = $(".ui-bizagi-render-numeric", control);
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        // Set value in input
        if (value != null) {
            if(properties.editable) {
                self.numericInput.val(value);
            } else {
                self.numericInput.text(value);
            }
            // Formats the input
            self.attachFormatCurrency();
            self.executeFormatCurrencyPlugin();
        }
    }
});