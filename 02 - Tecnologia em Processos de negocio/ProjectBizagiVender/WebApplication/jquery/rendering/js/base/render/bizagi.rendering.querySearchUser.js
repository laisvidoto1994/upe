/*
 *   Name: BizAgi Render Query Search User
 *   Author: Jeison Borja
 *   Comments:
 *   -   This script will define basic stuff for query search user renders
 */

bizagi.rendering.render.extend("bizagi.rendering.querySearchUser", {}, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },

    /*
     * Template method to implement in each children to customize each control
     */

    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("render-querySearchUser");
        var html = $.fasttmpl(template, {});
        return html;
    },

    /*
     *   Fetch the data into a deferred
     */
    getUserData: function (params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        var form = self.getFormContainer();
        var contextType = form.getContextType() || false;
        params = params || {};

        // Verify context type
        if (self.properties.contexttype) {
            params.h_contexttype = self.properties.contexttype;
        } else if (contextType) {
            params.h_contexttype = contextType;
        }
        //GET DATA
        var data = [{"id":1,"value":"user1"},{"id":2,"value":"user2"},{"id":3,"value":"user3"},{"id":4,"value":"user4"},{"id":5,"value":"user5"},{"id":6,"value":"user6"},{"id":7,"value":"user7"},{"id":8,"value":"user8"},{"id":9,"value":"user9"},{"id":10,"value":"user10"}];
        properties.data = data;
        defer.resolve(properties.data);
        return defer.promise(defer);

    },

    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var control = self.getControl();
        var displayValue = self.getDisplayValue();
        var decodedValue = bizagi.util.decodeURI(value);
        var decodedDisplayValue = bizagi.util.decodeURI(displayValue);
        if (self.properties.editable == false) {
            // Render as simple value
            if (typeof (value) == "string") {

                // Replace line breaks for html line breaks
                var valueToDisplay = decodedDisplayValue.replaceAll("&", "&amp;");
                valueToDisplay = valueToDisplay.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                valueToDisplay = valueToDisplay.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
                valueToDisplay = valueToDisplay.replaceAll("\\n", "<br/>");
                valueToDisplay = valueToDisplay.replaceAll("\n", "<br/>");

                control.html(valueToDisplay);
            }
        }

        // Set internal value
        self.setValue(decodedValue, false);
    },
    /**
     * Extend setValue to fix all encode data from database
     * More information SUITE-9407
     */
    setValue: function (value) {
        /*ISUPP-4116/*
         /*var decodedValue = bizagi.util.decodeURI(value);*/
        var self = this;
        self._super(value);
    }
});