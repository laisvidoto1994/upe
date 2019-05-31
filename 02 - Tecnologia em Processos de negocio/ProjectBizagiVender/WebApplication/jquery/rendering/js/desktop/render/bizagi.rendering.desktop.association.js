/*
 *   Name: BizAgi Desktop Render Association Extension
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will redefine the Association control
 */

// Extends itself
bizagi.rendering.association.extend("bizagi.rendering.association", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;

    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("association");
        var control = self.getControl();

        // Call base
        self._super();

        // Set close event to element into self.properties.value
        $("ol .deleteBotton", control).bind("click", function () {
            self.closeElement($(this).parent("li"));
        });

        // Apply accordion control
        $(".bz-render-association-accordion", control).togglepanels({
            header: "> div > h3",
            autoHeight: false,
            animated: false
        });

        $.when(self.isRendered())
            .done(function () {
                var firstGroup = $(".bz-render-association-accordion h3", control).first();
                firstGroup.click();
            });


        if (self.properties.allowFlip) {
            // Bind event for flip botton
            $(".bz-render-association .flip-arrow", control).bind("click", function () {
                $(control).empty();
                // Define flipped
                self.properties.flipped = !self.properties.flipped;

                // Send flip data to server
                self.properties.flipstate = self.properties.flipped;

                self.dataService.getFlipAssociation(self.properties);

                // Render template  
                $.tmpl(template, self.properties, {
                    getColumnData: self.getColumnData,
                    getRightAssociation: self.getRightAssociation
                }).appendTo(control);

                self.internalPostRender();
            });
        }

        $(".bz-render-association bz-render-association-check-mask, .bz-render-association .bz-render-association-check", control).bind("click", function (e) {
            e.stopPropagation();
            var input = $(this);
            var idLeft = $(this).parents("ol").data("id");
            var idRight = $(this).data("id");

            if (input.prop("checked")) {
                // check element
                input.prop("checked", true);

                // Add element to global value
                self.addElement(idLeft, idRight);
            } else {
                // uncheck
                input.prop("checked", false);

                // Remove from JSON
                self.removeElement(idLeft, idRight);
            }
        });


        $(".bz-render-association .bz-render-association-left-container li", control).bind("click", function (e, ui) {
            e.stopPropagation();

            var input = ($(this).find("input").length > 0) ? $(this).find("input") : $(this);
            var mask = $(".bz-render-association-check-mask", $(this));
            var idLeft = $(this).parent("ol").data("id");
            var idRight = $(this).data("id") || $(this).parents("li").data("id");

            if (input.prop("checked")) {
                // uncheck
                input.removeAttr("checked");
                mask.removeClass("checked");
                mask.addClass("unchecked");

                // Remove from JSON
                self.removeElement(idLeft, idRight);

            } else {
                // check element
                input.prop("checked", true);
                mask.removeClass("unchecked");
                mask.addClass("checked");

                // Add element to global value
                self.addElement(idLeft, idRight);
            }

        });
    },

    /**
    * Set Bind event to delete botton
    */
    setBindToClose: function (element) {
        var self = this;
        element.find(".deleteBotton").bind("click", function () {
            self.closeElement($(this).parent("li"));
        });
    },

    /**
    * Execute close action
    */
    closeElement: function (element) {
        var self = this;
        var ol = element.parent("ol");
        // Remove from JSON
        self.removeElement($(ol).data("id"), element.data("id"));

        // Remove element
        element.hide("highlight", 1000, function () {
            $(this).remove();
        });
    },



    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("association");

        self.properties.classCss = "read-only";

        // Make json base, create self.properties.formatJson
        self.makeJsonBase();
        
        // Render template  
        $.tmpl(template, self.properties, {
            getColumnData: self.getColumnData,
            getRightAssociation: self.getRightAssociation,
            getLeftName: self.getLeftName
        }).appendTo(control);        
        
        // Apply accordion control
        $(".bz-render-association-accordion", control).togglepanels({
            header: "> div > h3",
            autoHeight: false
        });

        $.when(self.isRendered())
            .done(function () {
                var firstGroup = $(".bz-render-association-accordion h3", control).first();
                firstGroup.click();
            });
        
        if (self.properties.allowFlip) {
            // Bind event for flip botton
            $(".bz-render-association .flip-arrow", control).bind("click", function () {
                $(control).empty();
                // Define flipped
                self.properties.flipped = !self.properties.flipped;

                self.postRenderReadOnly();
            });
        }
    },

    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;

        // Call base method
        self._super(renderValues);
    }
});
