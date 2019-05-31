/**
 * Base definition of entity template
 *
 * @author: Andres Fernando Muñoz
 * based on action launcher control
 */
bizagi.rendering.render.extend("bizagi.rendering.entityTemplate", {}, {
    /**
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },

    /**
     * Initialize the control with data provided
     */
    initializeData: function(data) {
        var self = this;
        // Call base
        this._super(data);
        var form = self.getFormContainer();

        self.deferredActions = new $.Deferred();
        self.deferredActions.promise();

        // Data of get process property value
        self.processPropertyValueArgs = {
            "pcaseId": self.getIdCase(),
            "pguidEntity": self.properties.guidEntity,
            "idRender": self.properties.id,
            "xpathContext": form.properties.xpathContext,
            "idPageCache": form.properties.idPageCache,
            "property": "data",
            "psurrogatedKey": self.properties.surrogatedKey
        };

        self.properties.valueWidth = 100;
        self.properties.displayType = "value";
        self.properties.allowactions = (typeof data.properties.allowactions == "undefined") ? true : data.properties.allowactions;

        if(!self.properties.value) {
            self.properties.value = self.value = [];
        } else if(typeof self.properties.value == "string") {
            self.properties.value = self.value = JSON.parse(self.properties.value);
        }
    },

    /**
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var mode = self.getMode();
        var template;
        var html = "";
        // Render template
        if (mode == "design") {
            template = self.renderFactory.getTemplate("render-entityTemplate-design");
            html = $.fasttmpl(template, {});
        }
        else if(self.properties.surrogatedKey) {
            template = self.renderFactory.getTemplate("render-entityTemplate");
            html = $.fasttmpl(template, {allowactions: self.properties.allowactions});
        }
        return html;
    },

    /**
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
    },

    /**
     * Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var control = self.getControl();
        // TODO: write functionality
        // Set internal value
        self.setValue(value, false);
    }
});