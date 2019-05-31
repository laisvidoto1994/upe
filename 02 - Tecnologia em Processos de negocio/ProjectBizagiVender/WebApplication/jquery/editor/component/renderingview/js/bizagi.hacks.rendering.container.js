/*
*   @tittle: BizAgi FormModeler Editor Hacks Rendering Container
*   @authors: David Montoya
	@date: 02-mar-12
*   @Comments:
*   -   This script will define basic stuff for enable the rendering Container
*		in the formModeler
*/

bizagi.rendering.container.original = $.extend( true, {}, bizagi.rendering.container.prototype );
$.extend(bizagi.rendering.container.prototype, {

    /*
    *   Renders the current container
    *   Also adds sortable behaviour
    */
    postRenderContainer: function (container) {
        var self = this;

        // Call original post-render
        bizagi.rendering.container.original.postRenderContainer.apply(this, arguments);

        // If the current form is readonly return;
        if (self.isReadOnlyForm()) {
            return container;
        }

        if (self.getFormType() == 'template') {
            if (self.properties.type == 'template') {
                container.click(function (ev) {
                    self.onClickCanvas(ev);
                });
            }

            return container;
        };

        // Configure sortable
        if (container.hasClass('ui-sortable')) { container.sortable('destroy'); }
        container.addClass("ui-bizagi-itemfordrag");
        self.addDraggableClassToContainer();

        if (self.isContainerSortable()) {

            // Populate element data 
            container.data({
                guid: self.properties.guid,
                display: self.properties.displayName,
                type: self.properties.type
            });

            // Configure  sortable plugin
            self.configureSortablePlugin(container);
        }

        // Process clicks
        if (self.isClickEventAllowed()) {
            if (self.properties.type !== undefined &&
                self.properties.type !== "searchForm" &&
                self.properties.type !== "queryForm") {
                container.mousedown(function (ev) { self.onMouseDown(ev); });
                container.click(function (ev) {
                    self.onClick(ev);
                });
            } else {
                container.click(function (ev) {
                    self.onClickCanvas(ev);
                });
            }
        }

        self.changeVisibility(self.properties.visible);
        
        return container;
    },
  
    /*
    *   Selects an element in order to keep consistency between renderings
    */
    selectElementByGuid: function (guids) {
        var self = this;

        for (var i = 0, l = guids.length; i < l; i++) {
            var guid = guids[i];
            var foundElement = self.findElement(guid);
            if (foundElement) {
                // If the element has been found, then select that element
                foundElement.selectElement({ IsOnClickEvent: false });
            }
        }
    },

    /*
    *   Finds an element by guid
    */
    findElement: function (guid) {
        var self = this;
        if (!guid) { return null; }

        if (self.properties.guid === guid) {
            // Element found
            return this;
        } else {
            // Find in children
            for (var i = 0; i < self.children.length; i++) {
                var foundElement = self.children[i].findElement(guid);
                if (foundElement) return foundElement;
            }
        }

        // Element not found
        return null;
    },

    /*
    *   Disable sortable plugin
    */
    disableSortablePlugin: function () {
        var self = this;

        if (self.container && self.container.hasClass('ui-sortable')) {
            if (self.container.data()["ui-sortable"]) {
                self.container.sortable('destroy');
            }
        }

        for (var i = 0, l = self.children.length; i < l; i = i + 1) {
            if (self.children[i].container) {
                self.children[i].disableSortablePlugin();
            }
        }
    },

    /*
    *  Selects the current element
    */
    selectElement: function (params) {
        var self = this;
        var container = self.container;

        // Add selected class
        container.addClass("ui-bizagi-container-selected");

        // Get current element boundaries for select element event
        var position = container.offset();
        $.extend(position, {
            width: container.outerWidth(),
            height: container.outerHeight()
        });

        // Trigger select element handler
        self.triggerGlobalHandler("selectelement", $.extend(params, { position: position, guid: self.properties.guid, element: container, type: self.properties.type }));
    },

    /*
    *  Un-selects the current element
    */
    unselectElement: function (params) {
        var self = this;
        var container = self.container;

        container.removeClass("ui-bizagi-container-selected");

        if (params) {
            $.extend(params, { guid: self.properties.guid });
        }

        // Trigger unselect element handler
        self.triggerGlobalHandler("unselectelement", params);
    },

    /*
    *   
    */
    configureSortablePlugin: function (container) {
        var self = this;

        // Decorate with class to allow sortable connections
        container.addClass("ui-bizagi-container-connectedSortable");

        // Define handlers
        container.bind("sortstart", function (ev, args) { self.onSortStart(args); });
        container.bind("sortstop", function (ev, args) { self.onSortFinish(args); });
        container.bind("sortactivate", function (ev, ui) {
            self.currentDragSource = self.getDragSource(ui.item);
        });


        var items = "> .ui-bizagi-draggable-item";

        if (self.getMode() != "layout") {
            items = "> .ui-bizagi-draggable-item:not(.ui-bizagi-container-horizontal)";
        }

        // Apply sortable plugin
        container.sortable({
            items: items,
            revert: false,
            connectWith: ".ui-bizagi-container-connectedSortable:not(.ui-sortable-helper)",
            distance: 10,
            cursorAt: { top: -3, left: 0 },
            placeholder: "ui-bizagi-placeholder",
            delay: 150,
            cancel: (self.getMode() === "layout" ? ".ui-bizagi-render, .ui-bizagi-input-editable" : ".ui-bizagi-input-editable, .ui-bizagi-grid-cell"),
            containment: "#main-panel .ui-bizagi-container-form",
              
            helper: function (event, ui) { return self.sortableHelper(ui); },
            start: function () {
                $('#main-panel').addClass('ui-start-drag');
            },
            stop: function () {
                $('#main-panel').removeClass('ui-start-drag');
            },
            beforeStop: function () {
                window.x3 = $('#mtool-container-helper');
            }
        }).disableSelection();

        // Load helper template
        self.loadHelperTemplate();
    },

    /*
    *   Connects to another sortable container
    */
    setConnectWith: function (parent, guid) {
        var self = this,
                classConnect;

        if (typeof parent === "undefined") {
            return;
        }

        classConnect = ".ui-bizagi-container-connectedSortable";
        classConnect = classConnect + "[id!= " + guid + "]";
        if (parent.container && parent.container.hasClass("ui-sortable")) {
            if (parent.container.data()["ui-sortable"]) {
                parent.container.sortable("option", "connectWith", classConnect);
            }
        }


        self.setConnectWith(parent.parent, guid);
    },

    /*
    *   Add draggable class, and styles
    */
    addDraggableClassToContainer: function () {
        var self = this;

        // Check if the container is draggable or not
        if (self.isContainerDraggable()) {
            // Add container draggable styles
            self.container.addClass("ui-bizagi-draggable-item");
            self.container.addClass('ui-dashed-layout');
            if (self.properties.type === "horizontal") { self.container.addClass('ui-table'); }

            // Add children draggable styles
            if ($('.ui-widget-content', self.container).children().length === 0) {
                $('.ui-widget-content', self.container).append('<div class="children"></div>');
            } else if (self.container.hasClass('ui-bizagi-container-tab')) {
                var tabItems = $('.ui-bizagi-container-tabItem', self.container);
                for (var i = 0; i < tabItems.length; i++) {
                    var tabItem = $(tabItems[i]);
                    if (tabItem.children().length === 0) {
                        tabItem.append('<div class="children"></div>');
                    }
                }

            }

            if (!self.container.hasClass('ui-bizagi-container-nestedform') && !self.container.hasClass('ui-bizagi-container-collectionnavigator')) {

                var containerPanel = $('> .ui-bizagi-container-panel', self.container);
                containerPanel.addClass('ui-col');

                for (i = 0; i < containerPanel.length; i++) {
                    var thisPanel = $(containerPanel[i]);
                    if (thisPanel.children().length === 0) {
                        thisPanel.append('<div class="children"></div>');
                    }
                }


            }

            if (self.container.hasClass('ui-dashed-layout')) {
                self.container.data('display', 'Layout');
                self.container.data('type', 'layout');
            }


            // Add hovering style
            $('> .ui-bizagi-container-panel', self.container).mouseenter(function () { $(this).addClass('ui-col-hover'); }).mouseleave(function () { $(this).removeClass('ui-col-hover'); });
        }
    },

    /*
    *   Check if the container can be draggable or not
    */
    isContainerDraggable: function () {
        var self = this;

        // Don't allow draggable when the item is inside a nested form
        if (self.isContainedInNestedForm() || self.isContainedInCollectionNavigator()) return false;

        // Allow draggable in the following containers
        var type = self.properties.type || "form";
        if (type == "group" || type == "nestedForm" || type == "tab" ||
            type == "horizontal" || type == "contentPanel" || type == "collectionnavigator") {
            return true;
        }

        return false;
    },

    /*
    *   Check if the container can be sortable or not
    */
    isContainerSortable: function () {
        var self = this;

        // Don't allow sortable when the item is inside a nested form
        if (self.isContainedInNestedForm() || self.isContainedInCollectionNavigator()) return false;

        // Allow sortable in the following containers
        var type = self.properties.type || "form";
        if (type == "form" || type == "group" || type == "panel" || type == "tabItem" || type == "queryForm" ||
            type == "searchForm" || type == "contentPanel" || type == "offlineForm" || type == "adhocForm") { return true; }

        return false;
    },

    /*
    *   Filter sortable depending current execution mode
    */
    isElementSortAllowed: function (item) {
        var self = this,
            mode = self.getMode();

        if (mode === "design") {
            if (item.hasClass('ui-bizagi-container-horizontal')) { return false; }

        } else if (mode === "layout") {
            if (item.hasClass('ui-bizagi-render')) { return false; }
        }

        return true;
    },

    /*
    *   Check if this container can be clicked or not depending the execution mode
    */
    isClickEventAllowed: function () {
        var self = this,
                mode = self.getMode(),
                result = true;

        // Don't allow clicks when the item is inside a nested form
        if (self.isContainedInNestedForm() || self.isContainedInCollectionNavigator()) return false;

        var type = self.properties.type || "form";
        if (mode == "design") {
            // Check in design mode
            //if (type == "form" || type == "horizontal" || type == "panel" || type == "searchForm") { return false; }
            if (type == "panel") { return false; }

        } else if (mode === "layout") {
            // Check in layout mode
            if (type == "form" || type == "group" || type == "panel") { return false; }
        }

        return result;
    },

    /*
    *   Draws the sortable helper when draggin a container
    */
    sortableHelper: function (sortableElement) {
        var self = this;

        // Makes sure the helper template has been loaded
        if (!self.helperTemplate) return null;

        // Decorate current dragging element with a class
        sortableElement.addClass('ui-dragging');

        // Extract data from element
        var data = sortableElement.data();
        var type = data.type ? data.type.toLowerCase() : "render";
        var id = data.guid;
        var caption = data.display;

        var icon = self.triggerGlobalHandler("getControlIcon", { type: type, id: id });

        if (!caption || caption === '') {
            caption = type;
        }

        // Draw the helper
        var element = $.tmpl(self.helperTemplate, { id: type, caption: caption, icon: icon });
        var sortableHelper = element.appendTo('.wrapper-main-scroll').css({ 'zIndex': 900 });

        // Adjust size
        var widthLabel = parseFloat($('label', sortableHelper).width());
        var widthIcon = parseFloat($('.biz-ico', sortableHelper).eq(0).width());
        var widthTotal = widthLabel + widthIcon + 40 + 'px';
        sortableHelper.css('width', widthTotal);

        return sortableHelper;
    },

    /*
    *   Loads the helper template
    */
    loadHelperTemplate: function () {
        var self = this;

        // Load helper template and return deferred
        return $.when(
            bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.editor.component.renderingview").concat("#bizagi-render-drag-helper"))
        ).pipe(function (tmpl) {
            self.helperTemplate = tmpl;
            return self.helperTemplate;
        });
    },

    /*
    *   Evaluates the drag source based on the item
    */
    getDragSource: function (item) {
        var result = {
            container: false,
            toolbar: false,
            xpathNavigator: false,
            layout: false,
            data: null
        };

        if ($(item).hasClass("ui-bizagi-render") || $(item).hasClass("ui-bizagi-container")) {
            // Render source
            result.container = true;
            result.data = { guid: $(item).parents(".ui-bizagi-container").first().data("guid") };

        } else if ($(item).hasClass("mtool-item")) {
            // Controls navigator source
            result.toolbar = true;
            result.data = $(item).data("render");

        } else if ($(item).hasClass("bizagi_editor_xpathnavigator_data")) {
            // Xpath navigator source
            result.xpathNavigator = true;
            result.data = $(item).data();

        } else if ($(item).hasClass("bz-fm-layout-navigator-item")) {
            // layout navigator source
            result.layout = true;
            result.data = $(item).data("id");
        }

        return result;
    },

    /* 
    *   Hides / Show container 
    */
    changeVisibility: function (argument) {
        var self = this;
        var properties = self.properties;

        // Store in properties
        properties.visible = bizagi.util.parseBoolean(argument);

        // Hide - show the render
        if (properties.visible) {
            $(self.container).removeClass("ui-state-disabled");

        } else {
            $(self.container).addClass("ui-state-disabled");
        }
    },

    /*
    *   EVENT HANDLERS
    */

    /*
    *   Manages sort start event
    */
    onSortStart: function (ui) {
        var self = this;

        // Save drag position
        var index = $(ui.item).parent().children(".ui-bizagi-itemfordrag").index(ui.item);
        ui.item.data("start-position", index);

        // Save parent source        
        var sourceContainer = $(ui.item).parents(".ui-bizagi-container").first().data("guid") ||
                               self.triggerGlobalHandler("getparentid", { guid: $(ui.item).data("guid") });

        ui.item.data("sourceContainer", sourceContainer);

        if (index >= 0) {
            // Trigger event to callers
            self.triggerGlobalHandler("sortstart");
        }
    },

    /*
    *   Manages sort finish event
    */
    onSortFinish: function (ui) {
        var self = this;


        // Set a timer to avoid multiple drop bug at the same time
        if (bizagi.sortContainerTimeout != null) {
            return;
        }
        bizagi.sortContainerTimeout = setTimeout(function () {
            bizagi.sortContainerTimeout = null;
        }, 100);


        var finalPosition = $(ui.item).parent().children(".ui-bizagi-itemfordrag").not(".ui-sortable-placeholder").index(ui.item),
            targetContainer = $(ui.item).parents(".ui-bizagi-container").first().data("guid") || self.triggerGlobalHandler("getparentid", { guid: $(ui.item).data("guid") }),
            initialPosition = ui.item.data("start-position"),
            sourceContainer = ui.item.data("sourceContainer");

        // Check if sort finish operation is available
        if (self.isElementSortAllowed($(ui.item)) == false) {
            self.container.sortable('cancel');
            return false;
        };

        if (finalPosition >= 0) {
            // Trigger sort finish event
            self.triggerGlobalHandler("sortfinish", {
                source: self.currentDragSource,
                initialPosition: initialPosition,
                finalPosition: finalPosition,
                sourceContainer: sourceContainer,
                targetContainer: targetContainer
            });
        }

        return true;
    },

    onClickCanvas: function (ev) {
        var self = this;

        // Cancel bubble
        ev.stopImmediatePropagation();

        $(".ui-bizagi-render").removeClass("ui-state-active");
        $(".ui-bizagi-grid-cell").removeClass("ui-state-active");
        $(".ui-bizagi-container").removeClass("ui-bizagi-container-selected");
        self.unselectElement();

        if (ev.button == 0 || ev.button == 1) {
            self.triggerGlobalHandler("selectcontainerform", {});
        }
    },


    /*
    *   Manages container click
    */
    onClick: function (ev) {
        var self = this,
            container = self.container;

        // Cancel bubble
        ev.stopImmediatePropagation();

        var isCtrlPressed = self.triggerGlobalHandler("checkCtrlKey", {});
        if (isCtrlPressed) {
            // Toggle selection
            if (container.hasClass("ui-bizagi-container-selected")) {
                self.unselectElement({ ctrlIsPressed: true });
            } else {
                self.selectElement({
                    IsOnClickEvent: true,
                    ctrlIsPressed: true
                });
            }
        } else {
            if (ev.button == 0 || ev.button == 1) {
                // Remove selected style to any render
                $(".ui-bizagi-render").removeClass("ui-state-active");
                $(".ui-bizagi-container").not(container).removeClass("ui-bizagi-container-selected");

                // Toggle selection
                if (container.hasClass("ui-bizagi-container-selected")) {
                    self.unselectElement();
                } else {
                    self.selectElement({ IsOnClickEvent: true });
                }
            }
        }
    },

    /*
    *   Manages mouse down event 
    */
    onMouseDown: function (ev) {
        var self = this;


        if (ev.button == 0 || ev.button == 1) {
            self.setConnectWith(self.parent, self.container.data("guid"));      

        } else if (ev.button == 2) {
            // Trigger element right click event
            self.triggerGlobalHandler("elementrightclick", { guid: self.properties.guid, position: { x: ev.clientX, y: ev.clientY} });

            // Prevent default behaviour
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }

    }

});