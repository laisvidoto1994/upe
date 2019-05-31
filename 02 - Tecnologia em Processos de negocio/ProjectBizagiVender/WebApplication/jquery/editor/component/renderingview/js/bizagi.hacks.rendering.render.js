
/*
*   @tittle: BizAgi FormModeler Editor Hacks Rendering Render
*   @authors: Alexander Mejia
	@date: 06-mar-12
*   @Comments:
*   -   This script will define basic stuff for enable the rendering render
*		in the formModeler
*/

bizagi.rendering.render.original = $.extend( true, {}, bizagi.rendering.render.prototype );
$.extend(bizagi.rendering.render.prototype, {

    /*
    *   Renders the current element
    *   Also adds draggable behaviour, and selection handlers
    */
    postRenderElement: function (element) {
        var self = this,
            properties = self.properties;

        // Call original method
        bizagi.rendering.render.original.postRenderElement.apply(this, arguments);

        // If the current form is readonly return;
        if (self.isReadOnlyForm()) {
            return element;
        }

        // Add guid to DOM
        element.attr("guid", self.properties.guid);

        if (self.getFormType() == 'template') {
            return self.configureLayoutElement(element);
        };
                    
        // If the render is inside a nested form don't allow any events
        if (!self.isContainedInNestedForm() && !self.isContainedInCollectionNavigator()) {

            // Add mouse down handler
            self.setMouseDownEvent(element);

            // Add dragabble class
            if (!self.isContainedInGrid()) {
                element.addClass("ui-bizagi-draggable-item");
                element.addClass("ui-bizagi-itemfordrag");
            }

            var renderSearch = $('.ui-bizagi-render-search', element);
            if (renderSearch.length > 0) {
                renderSearch.parent().addClass('ui-bizagi-display-as-search');
            }

            if (self.isClickEventAllowed()) {
                var labelElement;
                if (self.getMode() == "design" && self.properties.type == "grid") {
                    labelElement = self.getLabelGrid();
                } else {
                    labelElement = self.getLabel();
                }

                // Add click handlers
                element.click(function (ev) {
                    self.onRenderClick(ev, element);
                });
                labelElement.dblclick(function () {
                    self.onLabelDoubleClick(labelElement);
                });

                if (self.properties.validationMessage) {
                    self.showValidationMessage(self.properties.validationMessage);
                }
            }
        }

        element.data({
            guid: self.properties.guid,
            display: self.properties.displayName,
            type: self.properties.type
        });

        return self.resetStyle(element);
    },

  
    /*
    * Set several options used in template mode
    */
    configureLayoutElement: function (element) {
        var self = this;

        self.configureDroppablePlugin(element);
        self.configureDraggablePlugin(element);

        // Add click handlers
        element.click(function (ev) {
            self.onRenderClick(ev, element);
        });
              
        element.dblclick(function () {
            self.onLabelDoubleClick(element);
        });
       
        element
            .find('.biz-template-editor-render-hide-control')
            .click(function (ev) {
                self.onRemoveElement(ev, element);
            });

        self.setDeleteLayoutItem(element);        
        
        return element;
    },
    
    /*
    * Enable handler to allow delete an repeteable item or o layout item
    */
    setDeleteLayoutItem : function(element){
        var self = this,
            type = self.properties.type,
            hoverElement = $("<span class='biz-icon biz-tmpl-delete pull-right bz-studio bz-delete_16x16_standard'></span>"),
            hoverRestoreElement = $("<span class='biz-icon biz-tmpl-delete pull-right bz-studio bz-undo_16x16_black'></span>"),
            parent = element.closest('[id]');
          

        // Wait to template is rendered
        setTimeout(function () {
            // If the element 
            if (parent.length == 0 && self.triggerGlobalHandler("isDeleteOptionAllowed", { guid: self.properties.guid })) {
                element.addClass('hover-applied');
               

                element.hover(function () {
                    $(this).append(hoverRestoreElement);
                }, function () {
                    $(this).find("span.biz-tmpl-delete").detach();
                });

                (function() {
                    hoverRestoreElement.click(function () {
                        // Trigger element right click event
                        self.triggerGlobalHandler("restoreItem", { guid: self.properties.guid });
                    });
                })();
            }
                // if the elements is a repeater item
            else {
                if (parent.attr('id') == undefined) { return; }
                if (parent.hasClass('hover-applied')) { return; }

                parent.addClass('hover-applied');
                parent.hover(function () {
                    $(this).append(hoverElement);
                }, function () {
                    $(this).find("span.biz-tmpl-delete").detach();
                });

                (function(parent) {
                    hoverElement.click(function() {
                        // Trigger element right click event
                        self.triggerGlobalHandler("deleteRepeaterItem", { guid: parent.attr('id') });
                    });
                })(parent);
            }
        }, 10);
        
    },
    
    /*
    * Apply draggable plugin
    */
    configureDraggablePlugin: function (element) {
        var self = this;

        element.draggable({
            helper: 'clone',
            zIndex: 9999,
            opacity: 0.75,
            cursorAt: { left: 5 },
            containment: 'document',
            cancel: '.biz-template-editor-render-placeholder',            
            start: function (event, ui) {
                $(ui.helper).data('isLayoutElement', true);
            }            
        });
    },


    /*
    * Apply droppable plugin
    */
    configureDroppablePlugin: function (element) {
        var self = this;

        element.droppable({
            hoverClass: "ui-state-highlight",
            tolerance: "pointer",
            activeClass: 'ui-editor-highlight',
            greedy: true,
            drop: function (event, ui) {
                $(this).addClass('ui-state-highlight');
            },
            activate: function () {                
                self.getFormContainer()
                        .container
                        .find("[noShow='true']")
                        .show();
            },
            deactivate: function () {                
                self.getFormContainer()
                       .container
                       .find("[noShow='true']")
                       .hide();
            }
        });

        element.on("drop", function (ev, ui) { self.onDrop(ui); });
    },


    getLabelGrid: function () {
        return $(".bz-rn-grid-header-title", this.element);
    },

    resetStyle: function (el) {
        var element = el, self = this;
        var colorText = element.css('color');
        var backgroundColor = element.css('background-color');

        if (colorText == 'black') { element.css('color', ''); };
        if (backgroundColor == 'white') { element.css('background-color', ''); };

        return element;
    },

    /*
    *  Selects the current element
    */
    selectElement: function (params) {
        var self = this, options;
        var properties = self.properties;

        if(self.element) {
            // Add selected class
            self.element.addClass("ui-state-active");

            // Get current element boundaries for select element event
            var position = self.element.offset();
            $.extend(position, {
                width: self.element.outerWidth(),
                height: self.element.outerHeight()
            });

            // Trigger select element handler
            options = $.extend(params, {
                position: position,
                guid: self.properties.guid,
                element: self.element,
                type: self.properties.type,
                isInternal: properties.isInternal
            });
            self.triggerGlobalHandler("selectelement", options);
        }
    },

    /*
    *  Un-selects the current element
    */
    unselectElement: function (params) {
        var self = this;

        // Remove selected class
        self.element.removeClass("ui-state-active");

        if (params) {
            $.extend(params, { guid: self.properties.guid });
        }

        // Trigger unselect element handler
        self.triggerGlobalHandler("unselectelement", params);        
    },


    /*
    *   Check if this container can be clicked or not depending the execution mode
    */
    isClickEventAllowed: function () {
        var self = this;
        var mode = self.getMode();

        // If is design and not a column
        if (mode === "design" && !(self.column || self.isColumn)) return true;
        return false;
    },



    /*
    *   Configure mouse down handler
    */
    setMouseDownEvent: function (element) {
        var self = this;


        if (self.isClickEventAllowed()) {

            // Add mouse down handler
            element.bind('mousedown.contextmenu', function (e) {
                if (e.button == 2) {
                    // Trigger element right click event
                    self.triggerGlobalHandler("elementrightclick", { guid: self.properties.guid, position: { x: e.clientX, y: e.clientY} });

                    // Prevent default behaviour
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                return true;
            });
        }
    },

    /*
    *   Overrides visibility change to avoid hiding the element when not visible
    */
    changeVisibility: function (argument) {
        var self = this,
            properties = self.properties;

        if (bizagi.util.parseBoolean(argument) == true) {
            $(self.element).removeClass("ui-state-disabled");
        } else {
            $(self.element).addClass("ui-state-disabled");
        }

        // Update properties
        properties.visible = argument;
    },

    /*
    *   Show validation messages
    */
    showValidationMessage: function (message) {
        var self = this;

        self.setValidationMessage(message);
    },

    /*
    *   Manages render clicks
    */
    onRenderClick: function (ev, element) {
        var self = this;

        // Stop bubbling and default behaviour
        ev.stopPropagation();
        ev.preventDefault();
        

        // Enable / disable selected style
        var isCtrlPressed = self.triggerGlobalHandler("checkCtrlKey", {});
        if (isCtrlPressed) {
            // Toggle selection
            if (element && element.hasClass("ui-state-active")) {
                self.unselectElement({ ctrlIsPressed: true });
            } else {
                // fix for SUITE-7498
                if ($(document.activeElement).is("input") && $(document.activeElement).closest(".bizagi_editor_component_properties").length > 0) {
                    $(document.activeElement).trigger("blur");
                    $(".bizagi_editor_component_properties").hide();
                }

                self.selectElement({
                    IsOnClickEvent: true,
                    ctrlIsPressed: true
                });
            }
        } else {
            if (ev.button == 0 || ev.button == 1) {
                // Remove all render selections
                $(".ui-bizagi-render").not(element).removeClass("ui-state-active");
                $(".ui-bizagi-grid-cell").not(element).removeClass("ui-state-active");
                $(".ui-bizagi-button").not(element).removeClass("bz-state-active");
                $(".ui-bizagi-container").removeClass("ui-bizagi-container-selected");
                $(".ui-bizagi-render-layout").not(element).removeClass("ui-state-active");
            }

            // Toggle selection
            if (element && element.hasClass("ui-state-active")) {
                self.unselectElement();
            } else {
                // fix for SUITE-7498
                if ($(document.activeElement).is("input") && $(document.activeElement).closest(".bizagi_editor_component_properties").length > 0) {
                    $(document.activeElement).trigger("blur");
                    $(".bizagi_editor_component_properties").hide();
                }

                self.selectElement({ IsOnClickEvent: true });
            }
        }
    },

    /*
    *   Manages label double click event
    */
    onLabelDoubleClick: function (labelElement) {
        var self = this;

        // In template context there are some elements (ex image) that can't change the label
        if (self.triggerGlobalHandler("canChangeLabel", { guid: self.properties.guid })) {

            // Publish label edition event
            self.triggerGlobalHandler("startlabeledition");

            // Create editable label component
            var presenter = new bizagi.editor.component.editableLabel.presenter({
                label: labelElement,
                value: self.properties.displayName
            });

            // Bind change event
            presenter.subscribe("change", function (ev, args) {
                self.triggerGlobalHandler("changelabel", { guid: self.properties.guid, value: args.value });
            });

            // Render label
            presenter.render();
        }
    },

    /*
    *   Manages hide click event for layout elements
    */
    onRemoveElement: function (ev, element) {
        var self = this;

        self.triggerGlobalHandler("hideElement", { guid: self.properties.guid });
    },

    /*
    *   Show the label editor and update the element
    */
    showElementLabelEditor: function () {
        var self = this;

        if (!(self.element.find(".ui-bizagi-container-input-editable > input.ui-bizagi-input-editable").length > 0)) {
            $('label', self.element).trigger('dblclick');
        }
    },

    /*
    *   Manages drop event
    */
    onDrop: function (ui) {
        var self = this;

        var $sourceElement = $(ui.draggable);
        var $helperElement = $(ui.helper);
        var data = $sourceElement.data();
        var helperData = $helperElement.data();

        var xpathValue = bizagi.editor.utilities.buildComplexXpath(data.xpath, data.contextScope, data.isScopeAttribute, data.guidRelatedEntity)

        // Trigger sort finish event
        self.triggerGlobalHandler("dropfinish", {
            guid: self.properties.guid,
            property: 'xpath',
            value: xpathValue,
            renderType: data.nodeSubtype,
            sourceGuid: (helperData &&  helperData.isLayoutElement) ? $helperElement.attr('guid') : false
        });
    },
});