/*
*   Name: BizAgi Tablet Render Association
*   Author: RicharU (based on Edward Morales)
*   Comments: Defines the association control
*/

bizagi.rendering.association.extend('bizagi.rendering.association', {}, {
    /**
     * Template method to implement in each children to customize each control
     * 
     * @returns {} 
     */
    renderControl: function() {
        var self = this;
        var template = self.renderFactory.getTemplate("association");
        var def = new $.Deferred();

        self.properties.property = "flipped";
        self.properties.idRender = self.properties.id;

        // Define flipped
        $.when(self.getFlipAssociation())
            .done(function(flip) {

                // Make json base, create self.properties.formatJson
                self.makeJsonBase();

                self.properties.flipped = bizagi.util.parseBoolean(flip) || false;

                var columnData = self.getColumnData();

                var html = $.fasttmpl(template, $.extend(self.properties, { columnData: columnData }), {
                    getColumnData: self.getColumnData,
                    getRightAssociation: self.getRightAssociation
                });

                /* by default need set self.properties.formatJson */
                self.setValue(JSON.encode(self.properties.formatJson));

                def.resolve(html);
            });

        return def.promise();
    },

    /**
    * Get Left Data, verify if flipper flags sets true
    *
    * @param column {'0'||'1'}
    */
    getColumnData: function() {
        var self = this;
        var properties = self.properties;
        var data = [];

        self.data = properties;

        var dataAssociation = properties.flipped ? properties.rightData : properties.leftData;

        $.each(dataAssociation, function(key, item) {
            data.push({
                id: item.id,
                value: item.value,
                association: self.getRightAssociation(item.id)
            });
        });

        return data;
    },

    /**
     * Post render control
     * @returns {} 
     */
    postRender: function() {

        var self = this;
        var control = self.getControl();

        // Cache control
        self.association = $(".bz-rn-association-control", control);

        // Add Event at Association Control
        self.addEventControl();

        self.showDefaultContainer();
    },

    showDefaultContainer: function() {
        var self = this;
        var control = self.getControl();
        var associations = $('.bz-rn-association-group .bz-rn-association-header', control);

        if (associations.length > 0) {
            var defaultHeader = $($('.bz-rn-association-group .bz-rn-association-header', control)[0]);
            var defaultContainer = $($('.bz-rn-association-group .bz-rn-association-items', control)[0]);

            self.closeAccordionSection(true);
            defaultHeader.addClass('active');
            defaultContainer.slideDown(300).addClass('open');
        }
    },

    closeAccordionSection: function(i) {
        var self = this;
        var control = self.getControl();
        var headers = $('.bz-rn-association-group .bz-rn-association-header', control);
        var contents = $('.bz-rn-association-group .bz-rn-association-items', control);

        if (i) {
            headers = headers.not(':first').removeClass('active');
            contents = contents.not(':first').slideUp(300).removeClass('open');
        }

        headers.removeClass('active');
        contents.slideUp(300).removeClass('open');
    },

    /**
     * Add event to control
     * @returns {} 
     */
    addEventControl: function() {

        var self = this;
        var template = self.renderFactory.getTemplate("association");
        var control = self.getControl();

        // Bind check toggle
        self.association.delegate("input:checkbox", "change", function() {

            var contextElement = $(this);

            if (contextElement.prop("checked")) {
                // Associate item
                contextElement.addClass("bz-check");
                self.associateElement(contextElement);
            } else {
                // Dissociate item
                contextElement.removeClass("bz-check");
                self.dissociateElement(contextElement);
            }
        });

        // Bind flip actions
        self.association.delegate(".bz-rn-association-flip-button", "click", function() {

            $(control).empty();

            // Define flipped
            self.properties.flipped = !self.properties.flipped;

            // Send flip data to server
            self.properties.flipstate = self.properties.flipped;
            self.dataService.getFlipAssociation(self.properties);

            var columnData = self.getColumnData();

            // Render template
            $.tmpl(template, $.extend(self.properties, { columnData: columnData }), {
                getColumnData: self.getColumnData,
                getRightAssociation: self.getRightAssociation,
                getLeftName: self.getLeftName
            }).appendTo(control);

            self.postRender();
        });

        self.association.delegate(".bz-rn-association-container .bz-rn-association-header", "click", function() {
            if (!$(this).is('.active')) {
                self.closeAccordionSection();
                $(this).addClass('active');
                $(this).siblings().slideDown(300).addClass('open');
            }
        });
    },

    /**
     * Render for readonly
     * @returns {} 
     */
    postRenderReadOnly: function() {
        var self = this;
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("association");

        control.empty();

        // Make json base, create self.properties.formatJson
        self.makeJsonBase();

        var columnData = self.getColumnData();

        // Render template  
        $.tmpl(template, $.extend(self.properties, { columnData: columnData }), {
            getColumnData: self.getColumnData,
            getRightAssociation: self.getRightAssociation,
            getLeftName: self.getLeftName
        }).appendTo(control);

        self.association = $(".bz-rn-association-control", control);
        self.association.find("input:checkbox").hide();
        self.association.find(".ui-bz-rn-check-item label").addClass("bz-rn-association-non-editable");

        $.when(self.ready()).done(function() {
            self.showDefaultContainer();

            // Bind event for flip botton
            if (self.properties.allowFlip) {
                self.association.delegate(".bz-rn-association-flip-button", "click", function() {
                    $(control).empty();
                    // Define flipped
                    self.properties.flipped = !self.properties.flipped;

                    self.postRenderReadOnly();
                });
            }

            self.association.delegate(".bz-rn-association-container .bz-rn-association-header", "click", function() {
                if (!$(this).is('.active')) {
                    self.closeAccordionSection();
                    $(this).addClass('active');
                    $(this).siblings().slideDown(300).addClass('open');
                }
            });
        });
    },

    /**
     * Associate the left item with the active parent
     * @param {} element 
     * @returns {} 
     */
    associateElement: function(element) {

        var self = this;
        var context = self.getControl();

        // Get the parent id
        var parentId = $(element.parents("ul"), context).data("parent-id");
        var itemAdd = element.data("id");

        // Update JSON object
        self.addElement(parentId, itemAdd);
    },

    /**
     * Dissociates an item from the active collection
     * @param {} element 
     * @returns {} 
     */
    dissociateElement: function(element) {

        var self = this;
        var context = self.getControl();

        // Get the parent id
        var parentId = $(element.parents("ul"), context).data("parent-id");
        var itemRemove = element.data("id");

        // Update JSON object
        self.removeElement(parentId, itemRemove);
    }
});