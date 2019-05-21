/// <reference path="jquery.js" />

// TODO: Deprecated - DELETE

/*
* BizAgi Rendering Plugin
* * Draws each control according the renderType option, it behaves as a render type factory
* http://www.visionsoftware.com.co
* 
*/

(function ($) {
    // private closure;  <% /*debug*/ if (false) { %>  
    $ = jQuery;
    // <% } /*end debug*/ %> 

    $.fn.applyBizagiRendering = function (options) {

        // Implementation start here
        var self = this;
        var doc = this.ownerDocument;

        // Extract container metadata
        self.properties = self.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

        // <main section>
        $(".ui-bizagi-render", self).each(function (i) {
            var render = $(this);

            // Extract metadata
            render.properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

            // Override container defaults
            var containerEditable = (typeof self.properties.editable != "undefined") ? self.properties.editable : true;
            render.properties.containerEditable = containerEditable;

            // Update render metadata
            render.attr("properties", JSON.encode(render.properties));

            // Destroy instance of the render, if there is any
            render.baseRender("destroy");

            // Read basic properties
            var type = render.properties.type;

            // Process each type of render
            if (type == "text") {
                if (!render.properties.isExtended) {
                    // Text render
                    render.textRender();
                } else {
                    // Extended Text Render
                    render.extendedTextRender();
                }

            } else if (type == "boolean") {
                if (render.properties.display == "option") {
                    // Yes-No render
                    render.yesNoRender();
                } else {
                    // Check Render
                    render.checkRender();
                }

            } else if (type == "number") {
                // Numeric and money renders
                render.numericRender();

            } else if (type == "spinner") {
                // Spinner render
                render.spinnerRender();

            } else if (type == "slider") {
                // Slider render
                render.sliderRender();

            } else if (type == "date") {
                // Date render
                render.dateRender();

            } else if (type == "button") {
                // Button render
                render.buttonRender();

            } else if (type == "label") {
                // Label render
                render.labelRender();

            } else if (type == "link") {
                // Link render
                render.linkRender();

            } else if (type == "hidden") {
                // Hidden render
                render.hiddenRender();

            } else if (type == "combo") {
                // Combo render
                render.comboRender();

            } else if (type == "cascadingCombo") {
                // Cascading combo render
                render.cascadingComboRender();

            } else if (type == "list") {
                // List render
                render.listRender();

            } else if (type == "radio") {
                // Radio render
                render.radioRender();

            } else if (type == "search") {
                // Search render
                render.searchRender();

            } else if (type == "multisearch") {
                // Multi-Search render
                render.multisearchRender();

            } else if (type == "tree") {
                // Tree render
                render.treeRender();

            } else if (type == "multitree") {
                // Multi-Tree render
                render.multitreeRender();

            } else if (type == "letter") {
                // Letter render
                render.letterRender();

            } else if (type == "richText") {
                // Rich Text render
                render.richTextRender();

            } else if (type == "grid") {
                // Grid render
                render.gridRender();

            } else if (type == "repeater") {
                // Repeater render
                render.repeaterRender();

            } else if (type == "association") {
                // Association render
                render.associationRender();

            } else if (type == "upload") {
                // Upload render
                render.uploadRender();
            }

        });
        // </main section>
    };
})(jQuery);