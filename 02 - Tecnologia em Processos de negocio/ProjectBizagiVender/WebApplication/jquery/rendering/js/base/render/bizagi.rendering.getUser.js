/**
 * Description of control
 *
 * @author:
 */
bizagi.rendering.render.extend("bizagi.rendering.getUser", {}, {
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
        var template = self.renderFactory.getTemplate("render-getUser");
        // Render template
        var html = $.fasttmpl(template, {});
        return html;
    },

    renderReadOnly: function () {
        var self = this;
        var html =  (this.properties.value.length) ?  self.properties.value[0].value : "";
        return html;
    },

    /*
     * Public method to determine if a value is valid or not
     */
    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties;
        // Call base
        var bValid = this._super(invalidElements);
        var value = self.getValue();
        // TODO: write functionality
        return bValid;
    }
});