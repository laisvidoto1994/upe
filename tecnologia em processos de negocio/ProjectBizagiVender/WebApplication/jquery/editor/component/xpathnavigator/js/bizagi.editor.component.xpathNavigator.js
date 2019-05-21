/*
 * @title : Xpath component
 * @author : David Montoya, Diego Parra (refactor)
 * @date   : 13mar12 
 * Comments:
 *     Define the xpath component
 */

bizagi.editor.component.controller("bizagi.editor.component.xpathnavigator", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas);

        // Set up the variables
        this.model = params.model;
        this.canvas = canvas;
        this.presenter = params.presenter;
        this.scope = params.scope || "form";
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "node": (bizagi.getTemplate("bizagi.editor.component.xpathnavigator") + "#node"),
            "node-version": (bizagi.getTemplate("bizagi.editor.component.xpathnavigator") + "#xpathnavigator-node-version"),
            "close": (bizagi.getTemplate("bizagi.editor.component.xpathnavigator") + "#xpathnavigator-close"),
            "helper": (bizagi.getTemplate("bizagi.editor.component.xpathnavigator") + "#xpathnavigator-helper"),
            "node-container": (bizagi.getTemplate("bizagi.editor.component.xpathnavigator") + "#xpathnavigator-node-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Updates the model
    */
    updateModel: function (model) {
        var self = this;
        self.model = model;
    },

    /*
    *    a floating canvas using an overlay
    */
    createFloatingCanvas: function () {
        var self = this;
        var overlay = self.overlay = $("<div />").addClass("bizagi_editor_xpathnavigator_overlay");
              
        // Add classes to element
        self.element.addClass('biz-work-panel biz-border-all biz-shadow-modal biz-border-color ui-corner-all');

        // Arrange elements
        overlay.appendTo("form-modeler");
        self.element.appendTo(overlay);

        // Prepare autoclose when clicking outside
        setTimeout(function () {
            // Capture all click elements inside the popup
            self.element.click(function (e) {
                e.stopPropagation();
            });

            // Make an overlay click, if the event bubbles up to here then the click was made outside popup boundaries
            $(overlay).one("click", function () {
                self.close();
            });
        }, 100);
    },

    /*
    *   Renders the tree
    */
    render: function (params) {
        var defer = new $.Deferred(),
            self = this,
            expand, elContainer, nodeContainer;


        // Set defaults
        params = params || {};
        expand = params.expand || false;
        self.isReadOnly = (params.isReadOnly != "undefined") ? bizagi.util.parseBoolean(params.isReadOnly) : false;
        self.context = params.context || "fixed";
        self.scope = params.scope || "form";
        self.filter = params.filter;
        self.allowDrag = typeof (params.allowDrag) !== "undefined" ? params.allowDrag : true;
        self.allowDrag = !self.isReadOnly && self.allowDrag;
        self.allowCollection = params.allowCollection || false;

        // When the context is floating, an overlay is needed to handle outside canvas clicks
        if (self.isFloatingContext()) { self.createFloatingCanvas(); }

        // Clear container
        self.element.empty();
        if ($.isEmptyObject(self.model)) { return null; };

        $.when(
            self.loadTemplates()
        ).done(function () {
            if (self.isFloatingContext()) {
                self.renderCloseButton();

                // Calculate floating position and show
                var position = self.calculateFloatingPosition(params.position);
                self.element.css(position);
                self.element.show();
                self.element.resizable({
                    helper: "ui-resizable-helper",
                    minHeight: 200,
                    minWidth: 250,
                    start: function( event, ui ) {
                        $(".ui-resizable-helper").css({'z-index': 1001});
                    },
                    stop: function (event, ui) {
                    }
                });
            }

            // Render nodes
            elContainer = $.tmpl(self.getTemplate("node-container"), {});
            self.element.append(elContainer);
            nodeContainer = self.element.find(".xpathnavigator-node-container");

            self.renderNodes(nodeContainer, self.model.rootNodes, expand);

            // TODO: Change this behaviour, it looks like a quick workaround
            $(document).ready(function () {
                self.togglePlusMinusIcon(self.element.find(".bizagi_editor_xpathnavigator_node").first(), false);
            });

            // Locates xpath
            if (params.xpath) {
                self.showXpath(params.xpath);
            }

            // Resolves the async call
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    *   Calculates floating position to avoid showing xpath navigators out of screen
    */
    calculateFloatingPosition: function (position) {
        var self = this;
        var overlayHeight = self.overlay.height();
        var canvasHeight = self.canvas.height();

        if (position.top + canvasHeight > overlayHeight) {
            position.top -= canvasHeight;
        }

        return position;
    },

    /*
    *   Renders the close button
    */
    renderCloseButton: function () {
        var elClose = $.tmpl(this.getTemplate("close"));
        if (this.canvas.has($('.xpathnavigator-close')).length === 0) {
            elClose.prependTo(this.canvas);
        }
    },

    /*
    *   Render all model nodes
    */
    renderNodes: function (container, nodes, expand) {
        var self = this;
        var filter = self.filter;

        $.each(nodes, function (_, node) {
            // filter by context
            if (self.context === "grid") {
                // filter form and collection in grid mode
                if (node.nodeType !== "form" && node.nodeType !== "collection") {
                    self.renderNodeAndSubnodes(container, node, expand);
                }
            } else {
                if (filter === undefined) {
                    self.renderNodeAndSubnodes(container, node, expand);
                } else {

                    if (self.isValidNode(node, filter)) {
                        self.renderNodeAndSubnodes(container, node, expand);
                    }
                }
            }

        });
    },

    renderNodeAndSubnodes: function (container, node, expand) {
        var self = this, element, childrenNodesWrapper;
        element = self.renderNode(container, node);
        // If the node has children, then render then
        if (node.nodes) {
            childrenNodesWrapper = $(element).find(".bizagi_editor_xpathnavigator_node-childs");
            self.renderNodes(childrenNodesWrapper, node.nodes);
            if (node.nodes.length > 0 && !expand) {
                $(element).find(".bizagi_editor_xpathnavigator_node-childs").hide();
            }
        }
        
    },

    isValidNode: function (node, filter) {
        var self = this;
        var isValid = false;
        var type = node.nodeType;
        var subtype = node.nodeSubtype;
        if (type != "form") {
            if (type == "entity-application") {
                isValid = true;
            } else {
                if (node.hasRelatedEntity) {
                    // special for collections
                    if (type != "collection" ||
                         filter.typeFilter == "xpathtocollection" ||
                         filter.typeFilter == "xpathtoentitytemplate" ||
                         self.allowCollection) {
                        isValid = true;
                    }

                } else {
                    // filters
                    if (self.isValidFilter(type, subtype, filter)) {
                        isValid = true;
                    }
                }
            }
        }
        return isValid;
    },

    isValidFilter: function (type, subtype, filter) {
        var typeFilter = filter.typeFilter;
        var typesFilter = filter.types;
        var isValid = false;
        switch (typeFilter) {
            case "xpathfromentity":
            case "xpathtosimple":
                var i;
                for (i = 0; i < typesFilter.length; i++) {
                    try {
                        if ($.inArray(subtype, bizagi.editor.component.xpathnavigator.equiv.rule["xpathtosimple"][typesFilter[i]]) != -1) {
                            isValid = true;
                            break;
                        }
                    } catch (e) {
                        bizagi.logError("Equiv Error", "nodeType: " + subtype + ", types: " + typesFilter.toString());
                    }
                }
                break;
            case "xpathmultiple":
                var i;
                for (i = 0; i < typesFilter.length; i++) {
                    try {
                        if ($.inArray(subtype, bizagi.editor.component.xpathnavigator.equiv.rule["xpathmultiple"][typesFilter[i]]) != -1) {
                            isValid = true;
                            break;
                        }
                    } catch (e) {
                        bizagi.logError("Equiv Error", "nodeType: " + subtype + ", types: " + typesFilter.toString());
                    }
                }
                break;
        }
        return isValid;
    },

    /*
    *   Checks if the current component is being displayed as a floating element
    */
    isFloatingContext: function () {
        return this.context === "floating";
    },

    /*
    *   Renders a single tree node
    */
    renderNode: function (container, node) {
        var self = this, elementVersion,
            element = $.tmpl(self.getTemplate("node"), node);
        element.appendTo(container);

        if (node.formVersion) {
            elementVersion = $.tmpl(self.getTemplate("node-version"), { version: node.formVersion });
            //$('label',element).prepend(elementVersion);
            $(elementVersion).insertBefore($('label', element));
        }

        if (self.allowDrag) {
            self.setDraggableNode(element, node);
        }

        if (node.displayName.length > 20) {
            $(element).tooltip({
                tooltipClass: 'ui-widget-content', position: {
                    my: "left top",
                    at: "right+5 top-5"
                }
            });
        }

        return element;

    },

    /*
    *   Sets the node as a draggable element
    */
    setDraggableNode: function (element, node) {
        var self = this;

        if (this.isFloatingContext()) {
            self.removeDraggableOptions(element);
            return;
        }

        if (node.enableDrag(self.scope)) {
            $(element).find(".bizagi_editor_xpathnavigator_data").first().data(node);
            $(element).find(".bizagi_editor_xpathnavigator_data").first().draggable({
                helper: function (ev) { return self.draggableHelper(ev); },
                connectToSortable: ".ui-bizagi-container-connectedSortable",
                distance: 15,
                start: function () {
                    $('#main-panel').addClass('bz-main-dashed-grid').addClass('ui-start-drag');
                    self.presenter.publish("controlRefreshCanvas", {});
                },
                stop: function () {
                    $('#main-panel').removeClass('bz-main-dashed-grid').removeClass('ui-start-drag');
                    bizagi.util.removeAutoScroll('autoscroll', 'xpathnavigator');
                    self.presenter.publish("controlRefreshCanvas", {});
                },
                containment: "document",
                cursorAt: (self.scope != 'template') ? false : { left: 5 }
            });
        }
    },

    /* 
    *   Remove all css styles for drag
    */
    removeDraggableOptions: function (element) {
        $('.ui-bizagi-draggable-item', element).removeClass('ui-bizagi-draggable-item');
        $('.ui-bizagi-itemfordrag ', element).removeClass('ui-bizagi-itemfordrag ');
    },

    /* 
    * Define a helper element to be used for dragging display
    */
    draggableHelper: function (event) {
        var self = this,
            element,
            draggableElement = $(event.currentTarget),
            draggableHelper,
            node,
            widthLabel,
            widthIcon,
            widthTotal,
            limitTop,
            limitBottom,
            wrapperMain,
            wrapperScroll,
            mainPanel;

        node = draggableElement.data();

        
        widthLabel = parseFloat($('label', draggableElement).width());
        widthIcon = parseFloat($('.biz-ico', draggableElement).eq(0).width());
        widthTotal = widthLabel + widthIcon + 40 + 'px';

        if (self.scope == 'template') {
            widthTotal = widthIcon + 5;
            widthTotal = widthTotal + 'px';
        }

        element = $.tmpl(self.getTemplate("helper"), $.extend(node, {context: self.scope}));
        element.css('width', widthTotal);
        element.css('max-width', widthTotal);        

        draggableHelper = element.appendTo('form-modeler').css({ 'zIndex': 900 });

        //TODO: EVALUAR SI PASAR LA GENERACION DE AUTO SCROLL A UN UTIL
        wrapperMain = $('.wrapper-main-panel');
        mainPanel = $('#main-panel', wrapperMain);
        wrapperScroll = $('.wrapper-main-scroll', wrapperMain);
        if (mainPanel.hasClass('biz-auto-height')) {

            limitTop = wrapperMain.position().top + parseFloat(wrapperMain.css('padding-top')) + parseFloat(wrapperMain.css('margin-top')) + 50;
            limitBottom = wrapperScroll.outerHeight();
            /*create autoScroll*/
            bizagi.util.autoScroll(wrapperScroll, limitTop, limitBottom, 'xpathnavigator');

        }
        
        return draggableHelper;
    },

    /*
    *   Expands or collapses a node
    */
    expandCollapse: function (el, expand) {
        var self = this,
            defer = new $.Deferred();

        /// If have childs just toggle their visibility
        if (self.hasChildren(el[0])) {
            self.togglePlusMinusIcon(el, expand);
            return null;

        } else {
            // Add childs if dont have childs
            var nodeId = el.data("id");
            $.when(
                self.model.getChildren(nodeId)
            ).done(function (children) {
                var container = $(el).find(".bizagi_editor_xpathnavigator_node-childs");

                if (!self.hasChildren(el[0])) {
                    // Render children
                    self.renderNodes(container, children);
                    self.togglePlusMinusIcon(el, true);
                }
                
                // Resolve deferred
                defer.resolve(children);
            });
        }
        return defer.promise();
    },

    /*
    *   Finds a specific node
    */
    findNode: function (container, node) {
        var elNode;

        elNode = container.find("#" + node.id);
        return elNode;
    },

    /*
    *   Hides the xpath navigator
    */
    hide: function () {
        this.element.hide();
    },

    /*
    *  Toggles the +/- icon
    */
    togglePlusMinusIcon: function (el, expand) {

        if ($(el).find("ul").first().is(":visible") && !expand) {
            $(el).children("div").find(".biz-btn").children(".xpathnavigator_collapse_icon").removeClass("bz-tree-less_16x16_standard").addClass("bz-tree-show-more_16x16_standard");
            $(el).children("div").find(".biz-btn").children(".xpathnavigator_collapse_icon").removeClass("xpathnavigator_collapse_icon").addClass("xpathnavigator_expand_icon");
            $(el).find("ul").first().hide();
        } else {
            $(el).children("div").find(".biz-btn").children(".xpathnavigator_expand_icon").removeClass("bz-tree-show-more_16x16_standard").addClass("bz-tree-less_16x16_standard");
            $(el).children("div").find(".biz-btn").children(".xpathnavigator_expand_icon").removeClass("xpathnavigator_expand_icon").addClass("xpathnavigator_collapse_icon");
            $(el).find("ul").first().show();
        }

    },

    findAndShowForm: function (container, nodes, form, xpath) {
        var self = this, elNode, childNodes, i;

        var formGuid = form.baref.ref;
        var xpathGuid = (xpath !== undefined) ? xpath.xpath.baxpath.xpath : null;

        if (xpathGuid === null) {
            childNodes = nodes[nodes.length - 1];
            if (nodes[nodes.length - 1].nodes === null) {
                elNode = $("#" + childNodes.id, container);
                self.expandCollapse(elNode, true).done(function () {
                    self.showXpathByGuid(form, xpath);
                });
            } else {
                if (childNodes.nodes.length != 0) {
                    for (i = 0; i < childNodes.nodes.length; i++) {
                        if (childNodes.nodes[i].guid == formGuid) {
                            elNode = $("#" + childNodes.nodes[i].id, container);
                            $('.ui-state-active', self.element).removeClass('ui-state-active');
                            $(elNode).find(".bizagi_editor_xpathnavigator_data").first().addClass("ui-state-highlight");
                            $(".ui-state-highlight", self.element).ScrollTo({
                                duration: 0
                            });
                            break;
                        }
                    }
                } else {
                    throw "Query is not sending right data.";
                }
            }
        } else {
            // se parte la busqueda desde la entidad del xpath seleccionada
            if (nodes.nodes === null) {
                elNode = $("#" + nodes.id);
                self.expandCollapse(elNode, true).done(function () {
                    self.findAndShowForm(container, nodes, form, xpath);
                });
            } else {
                childNodes = nodes.nodes[nodes.nodes.length - 1];
                if (childNodes.nodes === null) {
                    elNode = $("#" + childNodes.id);
                    self.expandCollapse(elNode, true).done(function () {
                        self.findAndShowForm(container, nodes, form, xpath);
                    });
                } else {
                    if (childNodes.nodes.length != 0) {
                        for (i = 0; i < childNodes.nodes.length; i++) {
                            if (childNodes.nodes[i].guid == formGuid) {
                                elNode = $("#" + childNodes.nodes[i].id, container);
                                $('.ui-state-active', self.element).removeClass('ui-state-active');
                                $(elNode).find(".bizagi_editor_xpathnavigator_data").first().addClass("ui-state-highlight");
                                $(".ui-state-highlight", self.element).ScrollTo({
                                    duration: 0
                                });
                                break;
                            }
                        }
                    } else {
                        throw "Query is not sending right data.";
                    }
                }
            }
        }
    },

    showXpathByGuid: function (form, xpath) {
        var self = this;
        var xpathGuid = (xpath !== undefined) ? xpath.xpath.baxpath.xpath : null;

        $(".bizagi_editor_xpathnavigator_data").removeClass("ui-state-highlight");

        if (xpathGuid === null) {
            self.findAndShowForm(self.element, self.model.rootNodes, form, xpath);
        } else {
            self.findAndShowXpath(self.element, self.model.rootNodes, xpath, form);
        }
    },

    /*
    *   Highlights the metadata xpath node if it finds it
    */
    showMetadataXpath: function (xpath) {
        var self = this;

        $(".bizagi_editor_xpathnavigator_data").removeClass("ui-state-highlight");
        if (xpath == "undefined") return;

        var nodes = [{ nodes: self.model.rootNodes}];
        self.findAndShowXpath(self.element, nodes, xpath);

    },

    /*
    *   Highlights the xpath node if it finds it
    */
    showXpath: function (xpath) {
        var self = this;
        var defer = new $.Deferred();

        $(".bizagi_editor_xpathnavigator_data").removeClass("ui-state-highlight");

        if (typeof (xpath) === "undefined") {
            return;
        }

        $.when(self.findAndShowXpath(self.element, self.model.rootNodes, xpath))
            .done(function () {
                if (self.isFloatingContext()) { self.renderCloseButton(); }
                defer.resolve();
            });

        return defer.promise();
    },

    /*
    *   Attempts to find a node by an xpath, expanding an collapsing all the path
    */
    findAndShowXpath: function (container, nodes, xpath, form) {
        var self = this,
            foundNode,
            buildedXpath,
            xpathIndex = 0,
            childNodes = (self.scope === "grid") ? nodes : (nodes[0].nodes || nodes),
            childContainer = container,
            resolvedXpath = bizagi.editor.utilities.resolveComplexXpath(xpath),
            arrXpath = resolvedXpath ? resolvedXpath.split(".") : [],
            defer = new $.Deferred();

        // Finds the xpath
        buildedXpath = arrXpath[0];
        do {
            foundNode = self.findNodeForXpath(childContainer, childNodes, buildedXpath);
            if (!foundNode) {
                defer.resolve();
                break;
            }
            if (xpathIndex === arrXpath.length - 1) {
                defer.resolve();
                break;
            }

            xpathIndex++;
            buildedXpath = buildedXpath + "." + arrXpath[xpathIndex];
            if (!foundNode.node.nodes || foundNode.node.nodes.length === 0) {
                $.when(self.expandCollapse(foundNode.element, true))
                .done(function (children) {
                    if (children && children.length) {
                        $.when(self.showXpath(xpath))
                            .done(function() {
                                defer.resolve();
                            });
                    } else {
                        defer.resolve();
                    }                    
                });
                foundNode = undefined;
                break;
            } else {
                childNodes = foundNode.node.nodes;
                childContainer = $(foundNode.element).find(".bizagi_editor_xpathnavigator_node-childs");
                //childContainer.show();
                if (foundNode.node.canHaveChildren === "true") {
                    self.expandCollapse(foundNode.element, true);

                } else {
                    defer.resolve();
                }
                
            }

        } while (true);

        if (foundNode) {
            if (form !== undefined) {
                self.findAndShowForm(foundNode.element, foundNode.node, form, xpath);
            } else {
                self.highlightNode(foundNode.element);
            }
            /*if (foundNode.node.canHaveChildren === "true") {
            self.expandCollapse(foundNode.element, true);
            }*/
        }
        return defer.promise();
    },

    /*
    *   Finds a node element for a given xpath
    */
    findNodeForXpath: function (container, nodes, buildedXpath) {
        var self = this,
            elNode,
            foundNode;

        var node = self.model.getNodeByXpath(buildedXpath);

        if (node) {
            elNode = container.find("#" + node.id);
            foundNode = { element: elNode, node: node };
            return foundNode;
        }        
    },

    /*
    *  Highlights a given node
    */
    highlightNode: function (elNode) {
        var self = this;
        $('.ui-state-active', self.element).removeClass('ui-state-active');

        $(elNode).find(".bizagi_editor_xpathnavigator_data").first().addClass("ui-state-highlight");
        $(".ui-state-highlight", this.element).ScrollTo({
            duration: 0
        });
    },

    /*
    *   Checks if a node has children or not
    */
    hasChildren: function (element) {
        return ($(element).find("ul").first().children().length > 0);
    },

    /*
    *   Closes the componente
    */
    close: function () {
        this.hide();
        this.publish("close");

        if (this.isFloatingContext()) {
            this.overlay.detach();
        }
    },

    /*  
    *   Handles node right click
    */
    onNodeRightClick: function (id, event) {
        var self = this;
        var node = self.model.getNode(id);
        var hasChildren = bizagi.util.parseBoolean(node.canHaveChildren);

        if (self.context != "floating") {
            // Destroy the contextmenu if is created to avoid duplication
            if (self.contextmenu) {
                self.contextmenu.destroy();
            }

            if (!node.parentIsGrid()) {

                var childrenPromise = (hasChildren) ? self.model.getChildren(id) : false;

                $.when(childrenPromise)
                    .done(function () {
                        self.showContextMenu(node, { x: event.clientX, y: event.clientY });
                    });               
            }
        }
    },

    /*
    *   Show context menu for the node
    */
    showContextMenu: function (node, position) {
        var self = this;
        var model = node.getContextMenuModel(self.scope);

        self.contextmenu = new bizagi.editor.component.contextmenu.presenter({ model: model, guid: node.id });

        // Add handlers
        self.contextmenu.subscribe("onItemClicked", function (event, args) {
            self.onContextMenuItemClicked(node, args);
        });

        // Render and return 
        return self.contextmenu.render({ position: position });
    },

    /*
    *   Handles context menu item clicks
    */
    onContextMenuItemClicked: function (node, args) {
        var self = this;
        self.presenter.publish("contextMenuItemClick", { node: node, action: args.action });
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/
    /*
    *   Manages close button click
    */
    ".xpathnavigator-close > .bizagi_editor_xpathnavigator_container-close-image click": function () {
        this.close();
    },

    /*
    *   Manages node mouse down
    */
    ".bizagi_editor_xpathnavigator_data mousedown": function (element, event) {
        var self = this;
        var id = element.parent().data("id");

        // Left click 
        if (event.button == 0 || event.button == 1) {
            // Publish node click event
            var node = self.model.getNode(id);
            self.presenter.publish("nodeClick", node);

        } else if (event.button == 2) {
            if (!self.isReadOnly) {
                // Call right click handler            
                self.onNodeRightClick(id, event);
            }
        }
    },

    /*
    *   Manages node click for +/- icon
    */
    ".xpathnavigator_expand_icon, .xpathnavigator_collapse_icon click": function (el, event) {
        event.stopImmediatePropagation();
        var self = this;
        var element = el.closest(".bizagi_editor_xpathnavigator_node");
        self.expandCollapse(element);
    },

    /*
    *   Raises a node doble click handler so the consumer can react to that
    */ 
    ".bizagi_editor_xpathnavigator_data dblclick": function (el, event) {
        var self = this, wrapperMainScroll, elementLast;

        if (!$(event.target).hasClass("xpathnavigator_expand_icon") && !$(event.target).hasClass("xpathnavigator_collapse_icon")) {
            var id = el.closest(".bizagi_editor_xpathnavigator_node").data("id");
            var node = self.model.getNode(id);
            if (node.renderType && node.enableDrag(self.scope) || (!self.model.isRootNode(node) && self.allowCollection)) {
                self.presenter.publish("nodeDoubleClick", node);
                $(".ui-tooltip").remove();

                wrapperMainScroll = $('.wrapper-main-scroll');
                bizagi.util.autoScrollBottom(wrapperMainScroll);

                elementLast = $('.ui-bizagi-container-form > div:last', wrapperMainScroll);
                bizagi.util.highLightElement(elementLast);

                el.removeClass('ui-state-active');
            }
        }
    }
});

