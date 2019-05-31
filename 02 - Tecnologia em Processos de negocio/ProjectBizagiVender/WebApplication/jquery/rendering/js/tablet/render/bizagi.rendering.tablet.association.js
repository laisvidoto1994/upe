/*
*   Name: BizAgi Tablet Render Association
*   Author: Andres Valencia
*   Comments: Defines the association control
*/

bizagi.rendering.association.extend('bizagi.rendering.association', {}, {
    /* POSTRENDER
    =====================================================*/
    postRender: function () {

        var self = this;
        var control = self.getControl();

        // Cache control
        self.association = $('.bz-wp-render-association', control);

        // Accordionify
        self.association.find('.association-container').accordion(
            {
                autoHeight: false,
                animated: false
            });

        // Add Event at Association Control
        self.addEventControl();
    },

    /* ADD EVENT
    =====================================================*/
    addEventControl: function () {

        var self = this;
        var template = self.renderFactory.getTemplate("association");
        var control = self.getControl();

        // Bind check toggle
        self.association.delegate('input:checkbox', 'change', function () {

            var itemId = $(this).data('id');

            if ($(this).prop('checked')) {
                // Associate item
                self.associateItem(itemId);
            } else {
                // De-associate item
                self.deAssociateItem(itemId);
            }
        });

        // Bind flip actions
        self.association.delegate('.association-flip-button', 'click', function () {

            $(control).empty();

            // Define flipped
            self.properties.flipped = !self.properties.flipped;

            // Send flip data to server
            self.properties.flipstate = self.properties.flipped;

            self.dataService.getFlipAssociation(self.properties);

            // Render template
            $.tmpl(template, self.properties, {
                getColumnData: self.getColumnData,
                getRightAssociation: self.getRightAssociation,
                getLeftName: self.getLeftName
            }).appendTo(control);

            self.postRender();
        });
    },


    /* RENDER READONLY VALUES
    =====================================================*/
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("association");

        // Cache control
        self.makeJsonBase();

        // Render template  
        $.tmpl(template, self.properties, {
            getColumnData: self.getColumnData,
            getRightAssociation: self.getRightAssociation,
            getLeftName: self.getLeftName
        }).appendTo(control);


        self.association = $('.bz-wp-render-association', control);
        self.association.find('input:checkbox').hide();

        // Accordionify
        setTimeout(function() {
            $.when(self.association.find('.association-container', control).accordion(
                {
                    autoHeight: false,
                    animated: false
                }));
        }, 5);

        // Bind event for flip botton
        if (self.properties.allowFlip) {
            self.association.delegate('.association-flip-button', 'click', function() {
                $(control).empty();
                // Define flipped
                self.properties.flipped = !self.properties.flipped;

                self.postRenderReadOnly();
            });
        }
    },

    /* ASSOCIATE THE LEFT ITEM WITH THE ACTIVE PARENT
    =====================================================*/
    associateItem: function (itemIdToAssociate) {

        var self = this;
        var control = self.getControl();
        // Determine the active list on the left
        var activeList = $('.association-container .ui-accordion-content-active', control).children('ul');

        // Get the parent id
        var parentId = activeList.data('parent-id');

        // Update JSON object
        self.addElement(parentId, itemIdToAssociate);
    },

    /* DE-ASSOCIATES AN ITEM FROM THE ACTIVE COLLECTION
    =====================================================*/
    deAssociateItem: function (itemIdToRemove) {

        var self = this;
        var control = self.getControl();
        // Determine the active list on the left
        var activeList = $('.association-container .ui-accordion-content-active', control).children('ul');

        // Get the left group id
        var parentId = activeList.data('parent-id');

        // Update JSON object
        self.removeElement(parentId, itemIdToRemove);
    }
});