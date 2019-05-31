/*
*   Name: BizAgi Group Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a group container class for all devices
*/

bizagi.rendering.container.extend("bizagi.rendering.group", {}, {

    /*
    *   Constructor
    */
    initializeData: function (params) {
        var self = this;

        // Call base
        this._super(params);

        // Default properties
        var properties = self.properties;
        properties.helpText = properties.helpText || properties.displayName;

        // Extend css property 
        properties.cssclass = properties.cssclass || "cssClassContainer";
    },

    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("group");

        // Define icons
        self.expandedIcon = self.getExpandedIcon();
        self.collapsedIcon = self.getCollapsedIcon();

        // Render the panel
        var html = $.fasttmpl(template, {
            expandedClassIcon: self.expandedIcon,
            displayName: properties.displayName,
            editable: properties.editable,
            orientation: properties.orientation,
            uniqueId: properties.uniqueId,
            collapse: properties.collapse,
            isDesign: (self.getMode() === "design"),
            messageValidation: properties.messageValidation,
            cssclass: properties.cssclass,
            guid: properties.guid
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    },

    /*
    *   Returns the expanded icon
    */
    getExpandedIcon: function () { },

    /*
    *   Returns the collapsed icon
    */
    getCollapsedIcon: function () { },

    /* 
    *   Expands or collapse the container 
    */
    toogleContainer: function (argument, bImmediate) { }

});