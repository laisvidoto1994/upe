
/*
@title: Ribbon Component
@authors: Rhony Pedraza Rhony.Pedraza@bizagi.com / Ramiro Gomez Ramiro.Gomez@bizagi.com / Jair Tellez Jair.Tellez@bizagi.com
@date: 10-apr-12
*/
bizagi.editor.component.controller("bizagi.editor.component.ribbon", {

    /*
    * Constructor
    */
    init: function (canvas, params) {
        var self = this;

        self._super();
        params = params || {};

        self.canvas = canvas;
        self.model = params.model;
        self.presenter = params.presenter;

    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "layout": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-layout"),
            "tab": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-tab"),
            "group": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-group"),
            "group-caption": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-group-caption"),
            "button": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-button"),
            "button-horizontal": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-button-horizontal"),
            "button-horizontal-item": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#contextmenu-button-horizontal-item"),
            "button-vertical": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-button-vertical"),
            "button-with-items": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-button-with-items"),
            "button-subitem": (bizagi.getTemplate("bizagi.editor.component.ribbon") + "#ribbon-button-subitem")
        };

        // Fetch templates
        return this._super(templateMap);

    },

    /*
    *   Render the ribbon
    */
    render: function (params) {
        var self = this;
        params = params || {};

        // Update model, and properties from params
        self.model = params.model || self.model;

        self.itemsPerRow = 3;

        $.when(self.loadTemplates())
        .done(function () {

            self.element.empty();
            var viewModel = self.model.getViewModel();
            $.when(self.renderGroups(self.element, viewModel.elements))
            .done(function () {
                $('.ribbon-group-col .ui-cells > [title].biz-btn-horizontal', self.element).tooltip({ tooltipClass: 'ui-widget-content ui-ribbon-tooltip ui-ribbon-horizontal-tooltip', position: {
                    my: "left top+10",
                    at: "left bottom"

                }
                });

                $('.ribbon-group-col > [title].biz-btn-vertical', self.element).tooltip({ tooltipClass: 'ui-widget-content ui-ribbon-tooltip ui-ribbon-vertical-tooltip', position: {
                    my: "left top+10",
                    at: "left bottom"

                }
                });
            });
        });
    },

    /*
    *   Update the model
    */
    updateModel: function (model) {
        var self = this;

        self.model = model;
    },

    /*
    *   Create estructure layout
    */

    renderLayout: function (container) {
        var self = this;
        var elLayout = $.tmpl(self.getTemplate("layout"), {});
        var elTab = $.tmpl(self.getTemplate("tab"), {});
        elTab.appendTo(elLayout);
        elLayout.appendTo(container);
    },

    /*
    *   Create the groups
    */
    renderGroups: function (container, data) {
        var self = this,
            elGroups,
            dataGroup;

        for (var i = 0; i < data.length; i++) {
            elGroups = $.tmpl(self.getTemplate("group"), {});
            dataGroup = data[i];

            self.renderElements(elGroups, dataGroup);
            self.renderGroupCaption(elGroups, dataGroup);
            elGroups.appendTo(container);

        }


    },

    /*
    *   Create the caption for each group
    */
    renderGroupCaption: function (container, element) {
        var elElement;

        elElement = $.tmpl(this.getTemplate("group-caption"), element);
        elElement.appendTo(container);
    },

    /*
    *   Create a subitem element in relation to a template
    */
    renderElementSubItem: function (container, element) {
        var elElement;

        elElement = $.tmpl(this.getTemplate("button-subitem"), element);
        elElement.appendTo(container);
    },

    /*
    *   Create a generic element in relation to a template
    */
    renderElement: function (container, element) {
        var elItem,
        elAlign = (element.align) ? element.align.toLowerCase() : "horizontal";
        elItem = ("value" in element) ? $.tmpl(this.getTemplate("button-horizontal-item"), element) : $.tmpl(this.getTemplate("button-" + elAlign), element);
        elItem.appendTo(container);
    },

    /*
    *   Create a list of elements to include in the groups
    */
    renderElements: function (container, data) {
        var i,
        self = this,
        counterCells = 0,
        element,
        elementsLength = data.elements.length,
            elElement = $.tmpl(this.getTemplate("button")),
            elElementVertical,
            elAlign,
            newElement,
            elContainer;

        elElement.appendTo(container);

        for (i = 0; i < elementsLength; i++) {

            if (i % self.itemsPerRow === 0) {
                elContainer = $("<div class='ui-cells ui-pos-" + counterCells + "'></div>");
                newElement = elContainer.appendTo(elElement);
                counterCells++;
            }

            element = data.elements[i];
            elAlign = element.align ? element.align.toLowerCase() : "horizontal";

            if (element.elements) {
                if (elAlign === "horizontal") {

                    this.renderElementWithItems(newElement, element);
                } else {
                    elElementVertical = $.tmpl(this.getTemplate("button"), element);
                    elElementVertical.appendTo(container);
                    this.renderElementWithItems(elElementVertical, element);
                }
            } else {
                if (elAlign === "horizontal") {
                    this.renderElement(newElement, element);
                } else {
                    elElementVertical = $.tmpl(this.getTemplate("button"), element);
                    elElementVertical.appendTo(container);
                    this.renderElement(elElementVertical, element);
                }

            }
        }
    },

    /*
    *   Create elements with items and do the difference if have subitems-subgroups or not in relation to a template
    */
    renderElementWithItems: function (container, data) {
        var self = this,
            elElement,
            subElement,
            subElementsLength = data.elements.length,
            containerSubElement;

        if (data.disabled) {
            elElement = $.tmpl(self.getTemplate("button-horizontal"), data);
            elElement.appendTo(container);

        } else {
            elElement = $.tmpl(self.getTemplate("button-with-items"), data);
            elElement.appendTo(container);
            containerSubElement = elElement.find('ul:lt(1)');

            var i = 0;
            for (; i < subElementsLength; i++) {
                subElement = data.elements[i];
                self.renderElement(containerSubElement, subElement);
            }

            self.fixElementsPosition();
        }
    },

    fixElementsPosition: function () {
        var self = this;

        setTimeout(function () {
            var allDropDown = $('.biz-dropdown', self.element);

            allDropDown.each(function () {
                var _self = $(this);
                var maxWidth = 0;

                if (_self.children() && _self.children().length > 0) {
                    _self.children().each(function () {
                        var _child = $(this);
                        if (_child.text().trim().length > 25) {
                            if (maxWidth < _child.width()) {
                                maxWidth = _child.width();
                            }
                        }
                    });
                }
                
                if (maxWidth > 0) {
                    _self.css("width", maxWidth +20  + "px");
                }
            });
        }, 500);
    },

    /*
    *   Removes the component
    */
    remove: function () {
        this.element.hide();
        this.element.empty();
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    "div.biz-btn click": function (element) {
        var self = this,
            guid = element.data("guid"),
            item = self.model.getElement(guid);

        // When the item has children, don't do anything
        if (item.items) return;
        // Don't publish if the element is disabled
        if (!item.disabled) {
            // Disable save until the function is done
            if (item.action === "save") {
                self.model.disableAction("save");
                self.render();
            }
            // Get property and value
            setTimeout(function () {
                self.presenter.publish("onItemClicked", { property: item.property, value: item.value, action: item.action });
            }, 500);
        }
    }
});
