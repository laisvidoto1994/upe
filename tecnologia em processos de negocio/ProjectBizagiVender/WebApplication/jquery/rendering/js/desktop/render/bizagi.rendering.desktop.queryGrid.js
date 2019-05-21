/*
 *   Name: BizAgi Desktop Render queryGrid Extension
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -   This script will redefine the queryGrid render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.panel.extend("bizagi.rendering.queryGrid", {}, {

    /*
     *   Update or init the element data,  concat children xpath
     */
    initializeData: function (data) {
        var self = this;
        console.log('sucede initializeData queryGrid');

        // Call base
        self._super(data);

        // Set defaults
        var properties = self.properties;
        properties.uniqueId = Math.ceil(Math.random() * 1000000);
        properties.editable = (typeof properties.editable != "undefined") ? bizagi.util.parseBoolean(properties.editable) : true;
        properties.visible = (typeof properties.visible != "undefined") ? bizagi.util.parseBoolean(properties.visible) : true;

        // Override orientation from parent if not set
        properties.orientation = properties.orientation || (self.parent ? self.parent.properties.orientation : "ltr");

        // Save original properties
        this.originalProperties = JSON.parse(JSON.encode(properties));

        // Create children
        this.children = [];
        this.childrenHash = {};
        if (data.elements) {
            $.each(data.elements, function (i, element) {
                element.render.properties.xpath= self.properties.xpath+"."+element.render.properties.xpath;
                if (element.render) {
                    self.createRenderElement(element);
                }
                else if (element.container) {
                    self.createContainerElement(element);
                }
                else if (element.form) {
                    self.createFormElement(element);
                }
            });
        }
    }
});
