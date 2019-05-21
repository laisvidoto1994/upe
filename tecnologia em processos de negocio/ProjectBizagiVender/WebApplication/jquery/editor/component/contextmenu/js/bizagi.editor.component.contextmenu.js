/*
@title: contextmenu Component
@authors:   Jair Tellez Jair.Tellez@bizagi.com 
            Ramiro Gomez Ramiro.Gomez@bizagi.com
            Diego Parra Diego.Parra@bizagi.com (refactor)
@date: 2012-08-08
*/
bizagi.editor.component.controller("bizagi.editor.component.contextmenu", {

    /*
    *  Constructor
    */
    init: function (canvas, params) {
        var self = this;

        // Call base
        self._super(canvas);
        params = params || {};

        self.canvas = canvas;
        self.model = params.model;
        self.presenter = params.presenter;
        self.mWidthDropDown = 100;
    },

    /*
    *   Loads all component templates
    */
    loadTemplates: function () {
        var self = this;

        // Define mapping
        var templateMap = {
            "context-menu-container": (bizagi.getTemplate("bizagi.editor.component.contextmenu") + "#contextmenu-container"),
            "button": (bizagi.getTemplate("bizagi.editor.component.contextmenu") + "#contextmenu-button"),
            "button-separator": (bizagi.getTemplate("bizagi.editor.component.contextmenu") + "#contextmenu-button-separator")
        };

        // Fetch templates
        return self._super(templateMap);
    },

    /*
    *   Refresh the view
    */
    refresh: function (params) {
        this.render(params);
    },

    /*
    *   Renders the component
    */
    render: function (params) {
        var self = this;
        // Update model from params
        self.model = params.model || self.model;

        if (self.model.items) {
            // Clear everything
            self.element.empty();

            // Fetch templates and render elements
            $.when(self.loadTemplates())
            .done(function () {

                // Render menu container
                var menu = $.tmpl(self.getTemplate("context-menu-container"));

                // Render items
                self.renderItems($(".contextmenu-group", menu), self.model.getViewModel());

                // Append menu to canvas
                menu.appendTo(self.canvas);


                //Adjust dropdown width properties
                self.setDropdownWidth();

                // Update menu position, if param is supplied
                if (params.position) self.updateContextMenuPosition(params.position);

                // Set auto close handler
                self.configureCloseHandler();

                self.fixElementsPosition();

            });
        }
    },

    fixElementsPosition: function () {
        var self = this;

        setTimeout(function () {
            var allDropDown = $('.biz-dropdown', self.element);

            allDropDown.each(function () {
                var _self = $(this);

                var outer = _self.outerWidth();
                if (outer > 180) {
                    _self.css("right", String(-160 - (outer - 180)) + "px");
                }
            });
        }, 500);
    },

    setDropdownWidth: function () {

        var self = this;
        var allDropDown = $('.biz-dropdown', self.element);

        allDropDown.each(function () {
            var _self = $(this);
            var minDDWidth = self.mWidthDropDown;

            $('.contextmenu-group-row', _self).each(function () {
                var __self = $(this);
                var icons = $('.biz-ico', __self).length;
                var iconsWidth = $('.biz-ico', __self).outerWidth(true);
                var totalIconWidth = (iconsWidth * icons) + 10;

                var actualWidth = $('.contextmenu-caption', __self).outerWidth(true) + (totalIconWidth);

                if (actualWidth > minDDWidth) {
                    minDDWidth = actualWidth;
                }
            });

            _self.width(minDDWidth);
        })
    },

    /*
    *   Configure auto close for the context menu when the user clicks outside the element
    */
    configureCloseHandler: function () {
        $(document).bind("mouseup.contextmenu", function (e) {

            if (e.button == 0) {
                var contextMenu = $('.contextmenu-container').parent();

                if (contextMenu.has(e.target).length === 0) {
                    contextMenu.hide();
                    $(document).unbind("mouseup.contextmenu");
                }
            }
        });
    },

    /*
    *   Updates context menu position in the screen 
    */
    updateContextMenuPosition: function (position) {
        var self = this, posX, posY, element, windowWidth, windowHeight,
            elementPaddingX, elementPaddingY, elementWidth, elementHeight,
            differenceX, differenceY;

        // Make some calculations in order to display element correctly
        element = self.element;
        posX = position.x,
        posY = position.y,
        windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        elementPaddingX = 10,
        elementPaddingY = 10,
        elementWidth = element.width() + elementPaddingX,
        elementHeight = element.height() + elementPaddingY,
        differenceX = Math.abs(posX + elementWidth - windowWidth),
        differenceY = Math.abs(posY + elementHeight - windowHeight);

        // Check given position and how it would render in the screen to check final position
        if (posX + elementWidth + 135 > windowWidth) {
            posX = (posX - elementWidth) - differenceX + elementWidth;
            element.css('left', posX);
            element.addClass('rightToLeft');
        } else {
            element.css('left', position.x);
            element.removeClass('rightToLeft');
        }
        if (posY + elementHeight + 120 > windowHeight) {
            posY = (posY - elementHeight) - differenceY + elementHeight;
            element.css('top', posY);
            element.addClass('bottomToTop');
        } else {
            element.css('top', position.y);
            element.removeClass('bottomToTop');
        }

        // Show element
        element.show();
    },

    /*
    *   Create the elements list to be added in the group
    */
    renderItems: function (container, data) {
        var self = this;
        if (!data.items) return;

        // Iterate over elements array
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];

            if (!item.separator) {
                // Render the item
                self.renderItem(container, item);
            } else {
                // Render the separator
                self.renderSeparator(container, item);
            }
        }
    },

    /*
    *   Creates a single item
    */
    renderItem: function (container, data) {
        var self = this;

        // Render element and append to container
        var element = $.tmpl(self.getTemplate("button"), $.extend(data, { hasItems: (data.items && data.items.length > 0) }));

        // Render sub-items
        if (data.items) {
            var childrenContainer = element.find('ul:lt(1)');
            self.renderItems(childrenContainer, data);
        }

        element.appendTo(container);
    },

    /*
    *   Creates a separator item
    */
    renderSeparator: function (container) {
        var self = this;

        // Render element and append to container
        var element = $.tmpl(self.getTemplate("button-separator"));
        element.appendTo(container);
    },

    /*
    *   Destroys the current component
    */
    destroy: function () {     
        this.element.detach();
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    "div.biz-btn click": function (element) {
        var self = this;
        var guid = element.data("guid");
        var item = self.model.getItem(guid);

        // When the item has children, don't do anything
        if (item.items) return;

        // Get property and value
        self.presenter.publish("onItemClicked", { property: item.property, value: item.value, action: item.action });

        // Destroy component
        self.destroy();
    }
});