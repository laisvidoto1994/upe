/*
*   Name: Bizagi Smartphone Render Grid Extension
*   Author: Richar Urbano <Richar.Urbano@Bizagi.com>
*   Comments:
*   -   This script will redefine the grid render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.render.extend("bizagi.rendering.grid.beta", {}, {
    //$.Class("bizagi.rendering.grid.beta", {}, {

    init: function (params) {
        var self = this;

        self.params = params;

        // Call base
        self._super(params);
    },

    /**
     * Returns the grid template to be used
     * @returns {} 
     */
    getGridTemplate: function () {
        return this.renderFactory.getTemplate("grid-control");
    },

    /**
     * Applies the template to the render and returns the resolved element
     * @param {} template 
     * @returns {} 
     */
    applyTemplate: function (template) {
        var self = this;
        var properties = self.properties;
        var orientation = self.properties.orientation;

        // TODO: helptext
        return $.fasttmpl(template, {
            id: bizagi.util.encodeXpath(properties.xpath),
            displayName: bizagi.util.encodeXpath(properties.displayName),
            orientation: orientation
        });
    },

    /**
     * Template method to implement in each children to customize each control
     * @returns {} Returns a promise that will be resolved when all the columns has been loaded
     */
    renderControl: function () {
        var self = this;
        var defer = new $.Deferred();
        var template = self.getGridTemplate();

        // Render template
        var html = self.applyTemplate(template);
        defer.resolve(html);

        return defer.promise();
    },

    postRenderSingle: function () {
        var self = this;
        var container = self.getContainerRender();

        container.addClass("bz-command-edit-inline");
        container.find(".ui-bizagi-label").hide();
        self.getArrowContainer().hide();

        // Call base 
        self._super();

        //self.gridEdit = control.find("#grid_" + bizagi.util.encodeXpath(properties.xpath));

        // Render Edition       
        $(self.element).on("click", function (e) {
            //bizagi.util.smartphone.startLoading();
            bizagiLoader().start();
            setTimeout(function() {
                $.when(self.renderEdition())
                .then(function (gridView) {
                    //self.endLoading();
                    gridView.postRenderSingle();
                    //bizagi.util.smartphone.stopLoading();
                    //bizagiLoader().stop();
                });
            }, 1);
            
        });
    },

    renderEdition: function () {
        var self = this;
        var control = self.getControl();
        var deferred = $.Deferred();

        self.params.pane = control.closest('div[data-role="pane"]');

        // Render grid view        
        var grid = new bizagi.rendering.smartphone.helpers.grid(self.params);
        deferred.resolve(grid);

        return deferred.promise();
    }


});
