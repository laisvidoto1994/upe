/*
@title: Properties Component
@authors: Rhony Pedraza, Diego Parra (refactor)
@date: 7-mar-12
*/
bizagi.editor.component.controller("bizagi.editor.component.properties", {
    listensTo: ["outEditor"],
    events: {
        PROPERTIES_CHANGE_PROPERTY: "PropertyChange",
        PROPERTIES_CHANGE_LAYOUT: "PropertyChangeLayout",
        PROPERTIES_SELECT_EXPRESSION: "ShowRuleSelector",
        PROPERTIES_SHOW_LOCALIZATION: "ShowLocalization",
        PROPERTIES_CHANGE_MULTIPLE_PROPERTIES: "ChangeMultipleProperties",
        PROPERTIES_SELECT_EDITOR_DATALIST: "ShowFilterEditor",
        PROPERTIES_RULE_EDITOR_DEFAULTVALUE: "ShowRuleEditorForDefaultValue",
        PROPERTIES_SHOW_XPATH_GENERAL: "ShowXPathEditor",
        PROPERTIES_SHOW_INTERFACE: "ShowInterfaceEditor",
        PROPERTIES_SELECT_XPATH_FROM_ENTITY: "SelectXpathFromEntity",
        PROPERTIES_SHOW_GRID_VALIDATIONS: "ShowGridValidationsEditor",
        PROPERTIES_SELECT_XPATH_TO_SIMPLE: "SelectXpathToSimple",
        PROPERTIES_SELECT_XPATH_TO_ENTITY: "SelectXpathToEntity",
        PROPERTIES_SELECT_XPATH_TO_COLLECTION: "SelectXpathToCollection",
        PROPERTIES_SELECT_XPATH_MULTIPLE: "SelectMultiXpath",
        PROPERTIES_SELECT_XPATH: "SelectXpath",        
        PROPERTIES_SELECT_FORM_OPTION: "SelectFormOption",
        PROPERTIES_SELECT_FORM_BUTTON: "SelectFormButton",
        PROPERTIES_SELECT_FORM_NEW: "SelectFormNew",
        PROPERTIES_SELECT_FORM_NONE: "SelectFormNone",
        PROPERTIES_SELECT_TEMPLATE_NONE: "SelectTemplateNone",
        PROPERTIES_SELECT_TEMPLATE_DEFAULT: "SelectTemplateDefault",

        PROPERTIES_SELECT_SEARCHFORM_OPTION: "SelectSearchformOption",
        PROPERTIES_SELECT_SEARCHFORM_BUTTON: "SelectSearchformButton",
        PROPERTIES_SELECT_SEARCHFORM_NEW: "SelectSearchformNew",
        PROPERTIES_SELECT_SEARCHFORM_NONE: "SelectSearchformNone",
        PROPERTIES_SHOW_DOCUMENT_TEMPLATES: "ShowDocumentTemplatesEditor",
        PROPERTIES_SHOW_ASSOCIATION_EDITOR: "ShowAssociationEditor",
        PROPERTIES_SHOW_WIZARD_TEMPLATES: "ShowWizardTemplates",
        PROPERTIES_SELECT_PROCESS : "SelectProcess",
        PROPERTIES_LOAD_METADATA : "LoadMetadata"

    }
}, {
    /*
    *  Constructor
    */
    init: function (canvas, params) {
        var self = this;

        // Call base
        self._super();
        params = params || {};
        self.canvas = canvas;
        self.model = params.model;
        self.presenter = params.presenter;
        if (params.adhocProcessId) {
            self.adhocProcessId = params.adhocProcessId;
        }

        // Add sub-editors change handler 
        if (self.presenter !== undefined) {
            self.presenter.subscribe("propertyEditorChanged", function (event, args) {
                // Trigger propertyChanged event to subscribers
                return self.onPropertyEditorChanged(args);
            });
        }
    },

    /*
    *   Loads all component templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "close": bizagi.getTemplate("bizagi.editor.component.properties").concat("#prop-close"),
            "frame-header": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-frame-header"),
            "frame-header-name": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-frame-header-name"),
            "content-frame": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-content-frame"),
            "frame-property": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-frame-property"),
            "frame-group": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-frame-group"),
            "frame-group-exclusive": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-frame-group-exclusive"),
            "frame-category-simple": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-frame-category-simple"),
            "frame-caption": bizagi.getTemplate("bizagi.editor.component.properties").concat("#properties-caption")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Renders the component
    */
    render: function (params) {
        var self = this, lastPropertyBoxTab;
        var element = self.element;
        params = params || {};

        // saves editor promises
        self.editorResponses = [];

        // saves properties references
        self.refProperties = {};

        self.redraw = (params.redraw) ? params.redraw : false;

        // groups references
        self.groupsReferences = {};

        // Refresh model
        if (params.model) { self.update(params.model); }
        var model = self.model = params.model || self.model;        
        //var position = params.position || { left: 0, top: 0 };

        // Clear element
        element.show();
        element.empty();

        // Save data
        element.data("id", model.idRender);

        // save propertySelected
        self.propertySelected = params.propertySelected !== undefined ? params.propertySelected : null;

        // Load templates
        $.when(
            self.loadTemplates()
        ).done(function () {

            // Render components
            self.renderCaption(element, model);
            self.renderClose(element);
            self.renderFrame(element, model);
            self.renderContent(element, model);

            lastPropertyBoxTab = self.getLastActiveTabForRender(params.model.idRender);
            self.idRender = params.model.idRender;
            self.scrollPanel = 0;

            if (element.hasClass('ui-tabs'))
                element.tabs("destroy");

            element.tabs();
            // Set tabs plugin
            if (lastPropertyBoxTab) {
                element.tabs({ select: function (event, ui) {
                    self.scrollPanelDiv = $(ui.panel);
                }
                });
                element.tabs("option", "active", lastPropertyBoxTab.index);
            }

            //TODO: Comment by upgrade version jquery.ui.1.9 Check this!
            //element.tabs('paging', { cycle: true });

            $('.ui-tabs-panel', element).bind('mousedown.panelselected', function () {
                var scrollTop = $(this).scrollTop();
                self.scrollPanel = scrollTop;
            });

            element.tabs({ select: function (event, ui) {
                self.setLastActiveTabForRender(self.idRender, ui.index, self.scrollPanel);
            }
            });
            // add this because top is replaced with CSS
            //delete position.top;

            //element.offset(position);

            // Add id to the DOM
            var id = (self.Class.fullName.replace(/\./gi, '_'));
            element.attr('id', id);

            // Theme the component
            self.addThemeStyle();

            // Add resize handler
            // Comment this because was replace with a CSS
            /*
            self.resizePanel();
            $(window).bind('resize.panel', function () { self.resizePanel(); });
            */

            // Hide properties in document click
            self.configureAutoCloseHandler();

            // wait for render execution of all editors
            $.when.apply($, self.editorResponses).done(function () {
                bizagi.util.highLightElement(self.element);

                // Select an editor
                self.selectOnProperty();

                // High light editors for validations
                if (model.validations !== undefined) {
                    if (model.validations.length > 0) {
                        self.highLightOnProperties(model.validations);
                    }
                }

                self.deselectTabLeftPanel();

                // Move scroll selected panel to show the last editor modified
                if (lastPropertyBoxTab.scrollRender > 0 && self.scrollPanelDiv) {
                    self.scrollPanelDiv.scrollTop(lastPropertyBoxTab.scrollRender);
                }

                // onPaint
                self.postRender();
            });
        });
    },

    postRender: function () {
        var prop, property, self = this;
        for (prop in self.refProperties) {
            property = self.refProperties[prop];
            if (property["postRender"] !== undefined) {
                property.postRender();
            }
        }
    },

    highLightOnProperties: function (validations) {
        var self = this, i, val;
        for (i = 0; i < validations.length; i++) {
            val = validations[i];
            if (self.refProperties[val.name]) {
                self.refProperties[val.name].highLightProperty(val.message);
            } else {
                console.error(val.name + ' is not a register property');
            }
        }
    },
    /* get the last active tab in properties box*/
    getLastActiveTabForRender: function (renderId) {
        var self = this;
        var data = { index: 0, scrollRender: 0 };

        var render = self.presenter.publish("getRenderElement", { id: renderId });
        render = render ?
            render.element || render.container :
            $("[data-id = " + renderId + "]").length > 0 ? $("[data-id = " + renderId + "]") : $("[data-container-id = " + renderId + "]");

        if (render) {
            data = render.data('last-tab') || data;
        }
        return data;
    },
    /* set the last active tab in properties box */
    setLastActiveTabForRender: function (renderId, index, scroll) {
        var self = this;

        var render = self.presenter.publish("getRenderElement", { id: renderId });
        render = render ?
            render.element || render.container :
            $("[data-id = " + renderId + "]").length > 0 ? $("[data-id = " + renderId + "]") : $("[data-container-id = " + renderId + "]");
        if (render) {
            render.data('last-tab', { index: index, scrollRender: scroll });
        }

    },
    /*
    *   Searchs propertySelected and call selectEditor method
    */
    selectOnProperty: function () {
        var self = this;
        if (self.propertySelected !== null) {
            if (self.propertyManager !== undefined) {
                if (self.propertyManager.selectEditor !== undefined) {
                    self.propertyManager.selectEditor();
                }
            }
        }
    },

    /*
    * Deselected tabs in leftPanel
    */
    deselectTabLeftPanel: function () {
        var self = this;
        if (self.lastTabActive) self.lastTabActive.removeClass('ui-tabs-selected ui-state-active');
    },

    selectTabLeftPanel: function () {
        var self = this;
        if (self.lastTabActive) self.lastTabActive.addClass('ui-tabs-selected ui-state-active');
    },

    /*
    *   Configures a handler to close the component when a click is performed outside
    */
    configureAutoCloseHandler: function () {
        var self = this;
        self.lastTabActive = $('#left-panel ul.ui-tabs-nav li.ui-tabs-active');

        // Hide properties in document click
        $(document).bind("mousedown.properties", (function (context) {

            function processEvent(ev) {
                var result = true;
                var eventTarget = $(ev.target);

                for (var key in components) {

                    if (!components.hasOwnProperty(key)) { continue; }

                    var fn = components[key];
                    if (typeof fn === "function") {
                        result &= fn.call(components, eventTarget);
                    }
                    if (!result) { break; }
                }

                if (result) {
                    if (context.lastTabActive) {
                        context.selectTabLeftPanel();
                    }
                    context.destroy();
                    $(document).unbind("mousedown.properties");
                    $(window).unbind('resize.panel');
                }
            }

            // At least one dialog is open
            var components = {
                pickdate: function (eventTarget) { return !$(".wpd").is(":visible") && eventTarget.closest(".wpd").length === 0; },
                colorPicker: function () { return !$(".sp-container").is(":visible"); },
                xpathNavigator: function () { return !$(".bizagi_editor_xpathnavigator_overlay").is(":visible"); },                
                properties: function (eventTarget) { return eventTarget.closest('.bizagi_editor_component_properties').length === 0; },
                tooltipProp: function (eventTarget) { return eventTarget.closest('.ui-propertybox-tooltip').length === 0; },
                warningsButton: function (eventTarget) { return $(".ribbon-ico-validate", eventTarget).length > 0 ? false : !eventTarget.hasClass("ribbon-ico-validate"); },
                saveButton: function (eventTarget) { return !eventTarget.hasClass("ribbon-ico-save"); },
                richText: function (eventTarget) { return eventTarget.closest(".bz-fm-localizablestring-richtext-overlay").length === 0; },
                richTextColor: function (eventTarget) { return eventTarget.closest(".mce-container").length === 0; }
            };


            return processEvent;

        })(self));
    },

    /*
    *   Render close button
    */
    renderClose: function (container) {
        var elClose = $.tmpl(this.getTemplate("close"));
        elClose.appendTo(container);
    },

    /*
    *   Renders the property box layout
    */
    renderFrame: function (container, data) {
        var elHeader, i, tabsLength, elNameTab, tabs;
        tabs = data.elements[0].tabs || null;
        tabsLength = (tabs !== null) ? tabs.length : -1;

        elHeader = $.tmpl(this.getTemplate("frame-header"), {});

        // For each tabs render header
        for (i = 0; i < tabsLength; i++) {
            tabs[i].machineName = this.camelCase(tabs[i].caption);
            elNameTab = $.tmpl(this.getTemplate("frame-header-name"), tabs[i]);
            elNameTab.appendTo(elHeader);
        }
        elHeader.appendTo(container);
    },

    renderCaption: function (container, model) {
        var self = this, elCaption;
        elCaption = $.tmpl(self.getTemplate("frame-caption"), { caption: model.renderCaption, ico: model.element.type, style: model.element.style });
        elCaption.appendTo(container);
    },

    /*
    *   Helper method that converts a string into its camel case representation
    */
    // TODO: Move to utils?
    camelCase: function (string) {
        return string.toLowerCase().replace(/\s+(.)/g, function (match, letterToCap) { return letterToCap.toUpperCase(); });
    },

    /*
    *   Helper method that converts a string into its machine name representation
    */
    // TODO: Move to utils?
    machineName: function (string) {
        return string.toLowerCase().replace(/-/g, "");
    },

    /*
    *   Renders the property box elements
    */
    renderContent: function (container, data) {
        var i, tabs, tabsLength, elContent;
        tabs = data.elements[0].tabs || null;
        tabsLength = (tabs !== null) ? tabs.length : -1;

        for (i = 0; i < tabsLength; i++) {
            tabs[i].machineName = this.camelCase(tabs[i].caption);
            elContent = $.tmpl(this.getTemplate("content-frame"), tabs[i]);

            this.renderElement(elContent, tabs[i].elements);

            elContent.appendTo(container);
        }
    },

    /*
    *   Renders a single element
    */
    renderElement: function (container, data) {
        var element, i, self = this;

        for (i = 0; i < data.length; i++) {
            element = Object.keys(data[i])[0];
            switch (element) {
                case "property":
                    if (data[i].property.notShow !== undefined) {
                        break;
                    }
                    else if (data[i].property.disable) {
                        delete data[i].property.disable;
                        break;
                    } else {
                        this.renderProperty(container, data[i].property);
                    }
                    break;
                case "category":
                    this.renderCategory(container, data[i].category);
                    break;
                case "group":
                    this.renderGroup(container, data[i].group);
                    break;
            }
        }

        self.setAsCollapsible(container);
    },

    /*
    *   Renders a property element
    */
    renderProperty: function (container, data) {
        var self = this;
        var elProperty, elCategory, property, elementsLength, i, elCategoryContent, promise;

        elProperty = $.tmpl(this.getTemplate("frame-property"), {});

        data.caption = (data.caption) ? data.caption : '&raquo; ' + data.name;
        if (self.adhocProcessId) data.adhocProcessId = self.adhocProcessId;
        data["bas-type"] = this.machineName(data["bas-type"]);

        if (data.subproperties === undefined) {

            // xpath editors
            if (data["bas-type"] === "xpathmultiple") {
                property = new bizagi.editor.component.editor[data["bas-type"]](elProperty, data, this.presenter);
                elProperty.appendTo(container);
            }
            
            else if (/^.*xpath.*$/ig.test(data["bas-type"])) {
                property = new bizagi.editor.component.editor.xpath(elProperty, data, this.presenter);
                elProperty.appendTo(container);
            } else {
                // other simple editors                
                property = new bizagi.editor.component.editor[data["bas-type"]](elProperty, data, this.presenter);
                elProperty.appendTo(container);
                if (this.propertySelected !== null) {
                    if (this.propertySelected == data.name) {
                        this.propertyManager = property;
                    }
                }
            }

            promise = property.render();
            this.editorResponses.push(promise);
            this.registerProperty(property);

        } else {
            // with subproperties
            // fix for complex xpath
            if (/^.*xpath.*$/ig.test(data["bas-type"])) {
                property = new bizagi.editor.component.editor.xpath(elProperty, data, this.presenter);
                elProperty.appendTo(container);
                promise = property.render();
                this.editorResponses.push(promise);
                this.registerProperty(property);
            } else {
                // with subproperties
                if (bizagi.editor.component.editor[data["bas-type"]] === undefined) {
                    // render categories
                    elCategory = $.tmpl(this.getTemplate("frame-category-simple"), data);
                    elCategoryContent = $('.ui-content', elCategory);
                    elementsLength = data.subproperties.length;
                    for (i = 0; i < elementsLength; i++) {
                        property = data.subproperties[i].property;
                        this.renderProperty(elCategoryContent, property);
                    }
                    elCategory.appendTo(container);
                } else {
                    // render complex editors
                    property = new bizagi.editor.component.editor[data["bas-type"]](elProperty, data, this.presenter, { refProperties: this.refProperties });
                    elProperty.appendTo(container);
                    promise = property.render();
                    this.editorResponses.push(promise);
                    this.registerProperty(property);
                }
            }
        }
    },

    /*
    *   Render a group element
    */
    renderGroup: function (container, data) {
        var self = this, elGroup, elementsLength, i, elGroupContent, element;
        elementsLength = data.elements.length;

        if (data.exclusive !== undefined) {
            // render and identify two elements
            if (data.elements.length != 2) {
                throw "There are more than two exclusives groups";
            } else {
                var newData = bizagi.clone(data);
                // saves a reference
                if (newData.guid === undefined) {
                    var guid = Math.guid();
                    $.extend(newData, { guid: guid });
                    self.groupsReferences[guid] = {
                        data: newData
                    };
                }

                if (newData.visibility !== undefined) {
                    $.extend(newData, { hidden: " properties-group-hidden" });
                }

                var hasIndex = newData.index !== undefined;
                var options = {};
                if (hasIndex) {
                    if (newData.index === 0) {
                        options.check1 = "properties-group-radio-check";
                        options.check2 = "properties-group-radio-uncheck biz-action-btn";
                    } else {
                        options.check1 = "properties-group-radio-uncheck biz-action-btn";
                        options.check2 = "properties-group-radio-check";
                    }
                } else {
                    options.check1 = "properties-group-radio-uncheck biz-action-btn";
                    options.check2 = "properties-group-radio-uncheck biz-action-btn";
                }
                $.extend(newData, options);

                elGroup = $.tmpl(this.getTemplate("frame-group-exclusive"), newData);
                elGroupContent = $('.ui-content-group', elGroup);

                for (i = 0; i < elementsLength; i++) {
                    element = Object.keys(newData.elements[i])[0];
                    switch (element) {
                        case "property":
                            if (newData.elements[i].property.notShow !== undefined) {
                                break;
                            } else {
                                if (hasIndex) {
                                    if (newData.index == i) {
                                        this.renderProperty(elGroupContent[i], newData.elements[i].property);
                                    }
                                } else {
                                    this.renderProperty(elGroupContent[i], newData.elements[i].property);
                                }
                            }
                            break;
                        case "group":
                            if (hasIndex) {
                                if (newData.index == i) {
                                    this.renderGroup(elGroupContent[i], newData.elements[i].group);
                                }
                            } else {
                                this.renderGroup(elGroupContent[i], newData.elements[i].group);
                            }
                            break;
                    }
                }
                elGroup.appendTo(container);
            }
        } else {
            elGroup = $.tmpl(this.getTemplate("frame-group"), data);
            elGroupContent = $('.ui-content', elGroup);

            for (i = 0; i < elementsLength; i++) {
                element = Object.keys(data.elements[i])[0];
                switch (element) {
                    case "property":
                        if (data.elements[i].property.notShow !== undefined) {
                            break;
                        } else {
                            this.renderProperty(elGroupContent, data.elements[i].property);
                        }
                        break;
                    case "group":
                        this.renderGroup(elGroupContent, data.elements[i].group);
                        break;
                }
            }

            var uiContent = $(elGroup).find(".ui-content");
            
            if (uiContent.children().length > 0) {
                elGroup.appendTo(container);
            }
        }
    },

    /*
    *   Render a category element
    */
    renderCategory: function (container, data) {
        var self = this, elCategory, elementsLength, i, property, elCategoryContent;
        elementsLength = data.elements.length;

        elCategory = $.tmpl(this.getTemplate("frame-category-simple"), data);
        elCategoryContent = $('.ui-content', elCategory);

        for (i = 0; i < elementsLength; i++) {
            property = data.elements[i].property;
            this.renderProperty(elCategoryContent, property);
        }

        elCategory.appendTo(container);
    },

    registerProperty: function (property) {
        var self = this;
        self.refProperties[property.options.name] = property;
    },

    /*
    *   Configure collapsible behaviour for categories
    */
    setAsCollapsible: function (collapsibleObj) {
        $('h3.ui-legend', collapsibleObj).unbind('click');
        $('h3.ui-legend', collapsibleObj).bind('click', function (event) {
            event.stopPropagation();
            var content = $(this).next();

            if (content.is(":visible")) {
                content.slideUp();
            } else {
                content.slideDown();
            }

        });
    },

    /*
    *   Perform property box styling
    */
    addThemeStyle: function () {
        var self = this;
        var element = self.element;
        element.addClass('biz-work-panel');
        element.addClass('biz-border-all');
        element.addClass('biz-shadow-modal');
        element.addClass('biz-border-color');
        element.addClass('biz-modal');
        element.addClass('ui-corner-bottom');
        element.removeClass('ui-corner-all');
        $('ul.ui-widget-header', element).addClass('biz-gradient-v');
    },

    /*
    *   Resize the property box
    */
    resizePanel: function () {
        var self = this,
            context,
            wrapperLeftPanel,
            finalHeight,
            ulTabsHeight,
            leftPanel,
            newUlTabsHeight;

        // Perform calculations
        context = self.element;
        leftPanel = $('#left-panel');
        finalHeight = leftPanel.height() * 0.95;
        ulTabsHeight = parseFloat($('> ul', context).height());
        newUlTabsHeight = (finalHeight - ulTabsHeight) * 0.96;

        // Set the new height
        context.css({ height: finalHeight });
        /*$('.ui-tabs-panel', context).css({ height: newUlTabsHeight }).css({ overflow: 'auto' });*/
    },

    /*
    *   Remove the component from the layout
    */
    destroy: function () {
        var self = this;
        var element = self.element;

        if (element.hasClass('ui-tabs')) {
            var tabSelectPropertyBox = element.tabs("option", "active");
            self.setLastActiveTabForRender(self.idRender, tabSelectPropertyBox, self.scrollPanel);

            self.selectTabLeftPanel();

            $('.sp-container').remove();
            self.element.tabs("destroy");
        }
        self.element.hide();
       
    },

    /*
    * Trigger propertyChanged event to subscribers
    */
    onPropertyEditorChanged: function (args) {
        var self = this;

        // Fill event type
        args.typeEvent = args.typeEvent || bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY;

        // Publish message to callers
        return self.presenter.publish("propertyChanged", args);
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    /*
    *   Listens to close button click
    */
    ".ui-properties-close .ui-close-btn click": function () {
        this.destroy();
    },

    /*
    *   Selects the editor, when clicking into
    */
    ".bizagi_editor_component_editor click": function (el) {
        $(".bizagi_editor_component_editor", this.element).removeClass("editor-selected");
        el.addClass("editor-selected");
        el.trigger("outEditor", [el]);
    },

    /*
    *   Listens to outEditor event
    */
    // TODO: Document this event clearly
    "outEditor": function (largeElement, event, localElement) {
        // Clear arrow in BooleanRule
        $(".bizagi_editor_component_editor_booleanrule > div > span", largeElement).removeClass("editor-arrow-down-enabled").addClass("editor-arrow-down-disabled");
        localElement.find("> div > span").removeClass("editor-arrow-down-disabled").addClass("editor-arrow-down-enabled");
        // Clear box in BooleanRule
        $(".bizagi_editor_component_editor_booleanrule .editor-options").removeClass("editor-options-enabled").addClass("editor-options-disabled");
    },

    /*
    *   Listens to any input focus event
    */
    ".bizagi_editor_component_editor input focus": function (el) {
        $(".bizagi_editor_component_editor", this.element).removeClass("editor-selected");
        el.closest(".bizagi_editor_component_editor").addClass("editor-selected");
    },

    /*
    *   Listens to category expand/collapse
    */
    ".properties-category > span click": function (el) {
        var elNext = el.next();
        el.toggleClass('close').toggleClass('open');
        elNext.slideToggle();
    },
    /* 
    *   Hide properties in document click
    */
    "click": function (el, event) {
        event.stopPropagation();
        return false;
    },

    ".properties-group-exclusive-header click": function (el) {
        var self = this, data;
        var element = el.closest(".properties-group-exclusive", el);
        var parent = element.parent();
        var headers = $(".properties-group-exclusive-header", parent);
        var guid = element.attr("data-guid");
        var index = headers.index(el);

        // delete exclusive group
        element.remove();

        // se pinta el grupo elegido
        data = self.groupsReferences[guid].data;

        $.extend(data, { index: index });
        self.renderGroup(parent, data);
    }

});