/*
*   Name: BizAgi Form Modeler Control ExternalData Handlers
*   Author: Alexande Mejia
*   Comments:
*   -   This script will handler modeler view external data handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Gets external data for several controls
    */
    getExternalData: function (params) {
        var self = this;
        bizagi.log("sucede getExternalData", params);

        if (typeof (self["getDataFor" + params.control]) === "function") {
            return self["getDataFor" + params.control](params);
        }
    },

    /*
    * Gets data for cascading combo 
    */
    getDataForcascadingcombo: function (params) {

        var xpath = bizagi.editor.utilities.resolveComplexXpath(params.xpath);
        var guidRelatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(params.xpath);

        // Create protocol
        var getParentEntities = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getparententities", id: guidRelatedEntity, xpath: xpath });

        return getParentEntities.processRequest();

    },

    /*
     * Gets data for query cascading combo
     */
    getDataForquerycascadingcombo: function (params) {
        var self = this;
        return self.getDataForcascadingcombo(params);
    },


    /*
    * Gets data for default displayName
    */
    getDefaultDisplayName: function (params) {
        var self = this;
        var element = params.element;
        var properties = element.properties;
        var defer = $.Deferred();
        
        if (properties && typeof properties["xpath"] === "object") {

            var protocol = element.isInternal() ? "getmetadataattributedisplayname" : "getattributedisplayname";

            // Create protocol
            var getDefaultDisplayName = bizagi.editor.communicationprotocol.factory.createProtocol({
                protocol: protocol,
                xpath: properties["xpath"],
                guidControl: self.controller.getControlsModel().getGuidControl(element.type)
            });
            return getDefaultDisplayName.processRequest();

        }
        else {
            if (self.controller.isTemplateContext()) {
                defer.resolve('');
            } else {
                defer.resolve(self.controller.getControlDisplayName(element.type));
            }            
        }

        return defer.promise();
    },

    /*
    * Gets default value
    */
    getNodeInfo: function (params) {
        var self = this;
        params = params || {};
    
        var xpathNavigatorModel = (self.controller.isGridContext()) ? self.controller.getXpathNavigatorModelGrid() : self.controller.getXpathNavigatorModel();
        var node = (params.root) ? xpathNavigatorModel.getRootNode() : xpathNavigatorModel.getNodeByXpath(params.xpath);
        if (node) {
            if (typeof params.callback === "function") {
                return params.callback.call(self, node);
            }
        }

        return node;
    },


    /*
    * Find Attributes related to xpath.. ex renderType
    */

    findXpathAttributes: function (params) {
        var self = this;

        return self.showElementXpath(params.xpath).pipe(function () {
            return self.executeCommand({ command: "applyOverridesElement", element: params.element });
        });
    }

});