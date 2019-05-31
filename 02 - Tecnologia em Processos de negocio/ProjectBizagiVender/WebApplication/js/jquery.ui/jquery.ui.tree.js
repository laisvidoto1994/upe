/*
* jQuery UI Tree @VERSION
* Author: Diego Parra
* Copyright (c) 2010 (http://www.bizagi.com)
*
* Depends:
*  ui.core.js
*  jquery.ui.check.js
*/
(function ($) {

    $.widget('ui.tree', {
        options: {
            useCheckbox: false,
            autoLoad: true,
            ajaxParams: { parent: '#{id}' },
            ajaxOptions: {},
            cssClasses: {
                base: 'ui-tree',
                root: 'ui-tree-root',
                node: 'ui-tree-node',
                nodeWrapper: 'ui-tree-node-wrapper',
                nodeElement: 'ui-tree-node-element',
                nodeChildren: 'ui-tree-node-children',
                nodeCheck: 'ui-tree-node-checkbox',
                nodeText: 'ui-tree-node-text',
                nodeIcon: 'ui-tree-node-icon',
                nodeStructure: 'ui-tree-node-structure',
                nodeLastNode: 'ui-tree-node-last',
                nodeIconCollapsed: 'ui-icon-circle-plus',
                nodeIconExpanded: 'ui-icon-circle-minus',
                nodeIconLoading: 'ui-icon-refresh',
                nodeIconLeaf: 'ui-tree-node-icon-leaf'
            },
            nodeIdPrefix: 'ui-tree-node-id-',
            nodeCheckPrefix: 'ui-tree-node-check-id-'
        },

        _create: function () {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Add base class
            element.addClass(cssClasses.base).addClass("ui-widget-content");

            // Create root container
            self.root = $('<ul/>')
                .addClass(cssClasses.root)
                .addClass(cssClasses.nodeChildren)
                .appendTo(element);

            // Init some data
            self.checkedNodes = new Array();
            self.selectedElement = null;

            // Fill root nodes
            if (options.autoLoad) {
                self._populate();
            }
        },

        _destroy: function () {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Restore class
            element.removeClass(cssClasses.base).removeClass("ui-widget-content")

            // Empty element
            element.empty();
        },

        /* Private Methods*/
        _updateNodeData: function (node, key, value) {
            var self = this;

            var data = self._getNodeData(node);
            data[key] = value;
            node.data("value", data);
        },

        _getNodeData: function (node) {
            if (!node) return null;

            return node.data("value");
        },

        _populate: function (node, bTriggerLoadedEvent) {
            var self = this,
                options = self.options,
                cssClasses = options.cssClasses;

            // Build data to send
            var data;
            if (node) {
                var request = $.extend({}, options.ajaxParams);
                var nodedata = self._getNodeData(node);

                $.each(request, function (key, template) {
                    var value = template;
                    $.each(['id', 'text', 'title'], function (i, k) {
                        var re = new RegExp('#\\{' + k + '\\}', 'g'),
						v = nodedata[k];
                        value = value.replace(re, v || '');
                    });
                    request[key] = value;
                });

                // Set data
                data = (typeof options.ajaxOptions.data == 'string' ? options.ajaxOptions.data + '&' + $.param(request) : $.extend(options.ajaxOptions.data || {}, request));

            } else {
                // Set data
                data = (typeof options.ajaxOptions.data == 'string' ? options.ajaxOptions.data : options.ajaxOptions.data);
            }

            var ajaxOptions = $.extend({}, options.ajaxOptions, { data: data, dataType: options.ajaxOptions.dataType || 'json' });

            if (self._trigger('nodeBeforeLoadChildren', window.event, { node: self._getNodeData(node), ajaxOptions: ajaxOptions }) == false) { return; }

            // Set success method
            ajaxOptions.success = function (data, status) {
                if ($.isArray(data)) {
                    if (data.length > 0) {
                        self.addNodes((node ? self._getNodeData(node).id : 0), data);

                        // Set expanded icon
                        if (node) self._setExpandedIcon(node);

                    } else if (node) {
                        // Set as leaf
                        self._setLeafIcon(node)
                        self._updateNodeData(node, "isLeaf", true);
                    }
                }

                // Trigger loaded event
                if (!node) self._trigger('treeLoaded', window.event);
            };

            // Set failure method
            ajaxOptions.error = function (xhr, status, exception) {
                self._trigger('nodeExpandError', window.event, { node: self._getNodeData(node), ajaxOptions: ajaxOptions });
            };

            // Change to loading icon
            if (node) self._setLoadingIcon(node)

            // Do request
            try { $.ajax(ajaxOptions); }
            catch (e) { self._trigger('nodeExpandError', window.event, { node: self._getNodeData(node), ajaxOptions: ajaxOptions }); }
        },

        _getNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element;

            return $("#" + options.nodeIdPrefix + nodeId, self.element);
        },

        _createNode: function (nodeData) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Create basic structure
            var node = $('<li />')
                .addClass(cssClasses.node);

            var wrapper = $('<div />').addClass(cssClasses.nodeWrapper);
            var nodeElement = $('<div />')
                .addClass(cssClasses.nodeElement)
                .addClass("ui-state-default");

            var icon = $('<span />').addClass(cssClasses.nodeIcon)
                .addClass("ui-icon");

            var structure = $('<span />').addClass(cssClasses.nodeStructure);
            var label = $('<label />').addClass(cssClasses.nodeText).text(nodeData.value);
            var children = $('<ul />').addClass(cssClasses.nodeChildren);

            // Add checkbox
            if (options.useCheckbox) {
                var checkboxId = options.nodeCheckPrefix + nodeData.id + (new Date).getTime();
                var check = $('<input type=checkbox />')
                    .addClass(cssClasses.nodeCheck)
                    .attr("id", checkboxId);

                label.append(check)
                     .attr("for", checkboxId);
            }

            // Arrange items
            nodeElement.append(icon)
                .append(structure)
                .append(label);

            wrapper.append(nodeElement)
                   .append(children);

            node.append(wrapper)
                .attr("id", options.nodeIdPrefix + nodeData.id);

            // Apply check plugin
            if (options.useCheckbox) label.check();

            // Set data
            node.data("value", new TreeNode(nodeData.id, nodeData.value));
            node.data("childrenContainer", children);
            node.data("element", nodeElement);
            node.data("icon", icon);
            node.data("label", label);

            // Set collapsed icon
            self._setCollapsedIcon(node)

            /*  Bind methods */
            // Expand / Collapse
            icon.click(function () {
                var data = self._getNodeData(node);
                if (data.expanded == false) {
                    self.expandNode(nodeData.id);

                } else {
                    self.collapseNode(nodeData.id);
                }

                // Saves changes
                node.data("value", data);
                return false;
            });

            // Focus
            nodeElement.bind("mouseover", function () {
                if (!nodeElement.hasClass("ui-state-highlight")) {
                    self._clearNodeElementStates(nodeElement);
                    nodeElement.addClass("ui-state-hover");
                }
            });
            nodeElement.bind("mouseout", function () {
                if (!nodeElement.hasClass("ui-state-highlight")) {
                    self._clearNodeElementStates(nodeElement);
                    nodeElement.addClass("ui-state-default");
                }
            });

            // Select
            nodeElement
            .bind("click", function () {
                if (!nodeElement.hasClass("ui-state-highlight")) {
                    self.selectNode(nodeData.id);
                } else {
                    self.unselectNode(nodeData.id);
                }
            })
            .bind("dblclick", function () {
                self._trigger('nodeDoubleClick', window.event, { node: self._getNodeData(node) })
            });

            // Check
            if (options.useCheckbox) {
                label.bind("checkchange", function (e, item) {
                    if (item.value == true) {
                        self.checkedNodes[nodeData.id] = node;
                        self._updateNodeData(node, "checked", true);
                    } else {
                        delete self.checkedNodes[nodeData.id];
                        self._updateNodeData(node, "checked", false);
                    }

                    // Trigger checked event
                    self._trigger('nodeCheckChange', window.event, { node: self._getNodeData(node) });
                });
            }

            return node;
        },

        _clearNodeElementStates: function (nodeElement) {
            nodeElement.removeClass("ui-state-default");
            nodeElement.removeClass("ui-state-hover");
            nodeElement.removeClass("ui-state-highlight");
        },

        _selectNodeElement: function (nodeElement) {
            var self = this;

            self._clearNodeElementStates(nodeElement);
            nodeElement.addClass("ui-state-highlight");
        },

        _deselectNodeElement: function (nodeElement) {
            var self = this;

            self._clearNodeElementStates(nodeElement);
            nodeElement.addClass("ui-state-default");
        },

        _setExpandedIcon: function (node) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            self._clearIcon(node);

            var icon = node.data("icon");
            icon.addClass(cssClasses.nodeIconExpanded);
        },

        _setCollapsedIcon: function (node) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            self._clearIcon(node);

            var icon = node.data("icon");
            icon.addClass(cssClasses.nodeIconCollapsed);
        },

        _setLoadingIcon: function (node) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            self._clearIcon(node);

            var icon = node.data("icon");
            icon.addClass(cssClasses.nodeIconLoading);
        },

        _setLeafIcon: function (node) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            self._clearIcon(node);

            var icon = node.data("icon");
            icon.addClass(cssClasses.nodeIconLeaf);
        },

        _clearIcon: function (node) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            var icon = node.data("icon");
            icon.removeClass(cssClasses.nodeIconExpanded);
            icon.removeClass(cssClasses.nodeIconCollapsed);
            icon.removeClass(cssClasses.nodeIconLoading);
            icon.removeClass(cssClasses.nodeIconLeaf);
        },

        /* Public Methods*/
        addNodes: function (nodeId, childNodes) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            $.each(childNodes, function (i) {
                // Append each node
                self.appendNode(nodeId, childNodes[i]);
            });
        },

        appendNode: function (nodeId, nodeToAppendData) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node container
            var nodeContainer;
            var path = "";
            if (nodeId == 0) {
                nodeContainer = self.root;

            } else {
                node = self._getNode(nodeId);
                nodeContainer = node.data("childrenContainer");
                path = self._getNodeData(node).path;
            }

            // Trigger before insert event
            if (self._trigger('nodeBeforeInsert', window.event, { data: nodeToAppendData }) == false) { return; }

            // Create node structure
            var childNode = self._createNode(nodeToAppendData);

            // Complete data
            var data = self._getNodeData(childNode);
            data.parentId = nodeId;
            data.path = (path == "") ? data.id : path + "." + data.id;
            childNode.data("value", data);

            // Append
            nodeContainer.append(childNode);

            // Trigger inserted event
            self._trigger('nodeInserted', window.event, { node: self._getNodeData(childNode) });

            // Re-evaluate nodes to check last one
            $("." + cssClasses.node, nodeContainer).removeClass(cssClasses.nodeLastNode);
            $("." + cssClasses.node + ":last", nodeContainer).addClass(cssClasses.nodeLastNode);

            // Show container
            nodeContainer.show();
        },

        checkNode: function(nodeId){
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            if (!options.useCheckbox) return;

            // Find node
            var node = self._getNode(nodeId);

            // Force check the node
            node.data("label").check("checkItem");
        },

        uncheckNode: function(){
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            if (!options.useCheckbox) return;

            // Find node
            var node = self._getNode(nodeId);

            // Force uncheck the node
            node.data("label").check("uncheckItem");
        },

        clearTree: function () {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Clear root container
            self.root.empty();
        },

        collapseNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            node = self._getNode(nodeId);
            var data = self._getNodeData(node);

            // Trigger event
            if (self._trigger('nodeBeforeCollapse', window.event, { node: self._getNodeData(node) }) == false) { return; }

            if (data.isLeaf == true) {
                return;
            }

            // Just hide container
            var nodeContainer = node.data("childrenContainer");
            nodeContainer.hide();

            // Update data
            data.expanded = false;
            node.data("value", data);

            // Change class
            self._setCollapsedIcon(node)

            // Trigger success
            self._trigger('nodeCollapsed', window.event, { node: self._getNodeData(node) });
        },

        expandNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            node = self._getNode(nodeId);
            var data = self._getNodeData(node);

            // Trigger event
            if (self._trigger('nodeBeforeExpand', window.event, { node: self._getNodeData(node) }) == false) { return; }

            if (data.isLeaf == true) {
                return;
            }

            if (data.remote == true) {
                // Populate node
                self._populate(node);

                // Switch flag to avoid going to the server
                data.remote = false;

            } else {
                // Just show
                var nodeContainer = node.data("childrenContainer");
                nodeContainer.show();

                // Change class
                self._setExpandedIcon(node)
            }

            // Update data
            data.expanded = true;
            node.data("value", data);

            // Trigger success
            self._trigger('nodeExpanded', window.event, { node: self._getNodeData(node) });
        },

        getNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            var node = self._getNode(nodeId);

            if (node == null || node.length == 0) return null;
            return self._getNodeData(node);
        },

        getParentNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            var node = self._getNode(nodeId);
            var parentNode = self._getNode(self._getNodeData(node).parentId);

            return self._getNodeData(parentNode);
        },

        getSelectedNode: function () {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            return self._getNodeData(self.selectedNode);
        },

        getCheckedNodes: function () {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            var checkedNodes = [];
            for (var node in self.checkedNodes) {
                checkedNodes.add(self._getNodeData(node));
            }

            return checkedNodes;
        },

        getChildNodes: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            var node = self._getNode(nodeId);

            var childNodes = [];
            $("." + cssClasses.node, node.data("childrenContainer")).each(function (i) {
                var childNode = $(this);
                childNodes.add(self._getNodeData(childNode));
            });

            return childNodes;
        },

        loadTree: function () {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Clear tree
            self.clearTree();

            // populates
            self._populate(null, true);
        },

        removeNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            var node = self._getNode(nodeId);

            // Remove node
            node.detach();

            // Trigger removed event
            if (self._trigger('nodeRemoved', window.event, { node: self._getNodeData(node) }) == false) { return; }
        },

        selectNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            var node = self._getNode(nodeId);

            // Trigger before select event
            if (self._trigger('nodeBeforeSelect', window.event, { node: self._getNodeData(node) }) == false) { return; }

            // Get selected node and unselects it
            if (self.selectedNode) {
                self.unselectNode(self.getSelectedNode().id);
            }

            // Select node
            self.selectedNode = node;
            self._selectNodeElement(node.data("element"));

            // Trigger selected event
            self._trigger('nodeSelected', window.event, { node: self._getNodeData(node) })
        },

        unselectNode: function (nodeId) {
            var self = this,
                options = self.options,
                element = self.element,
                cssClasses = options.cssClasses;

            // Find node
            var node = self._getNode(nodeId);

            // Deselect node
            self._deselectNodeElement(node.data("element"));
            self.selectedNode = null;
        }
    });

    $.extend($.ui.tree, {
        version: "@VERSION",
        eventPrefix: "tree"
    });

})(jQuery);

/* Node object definition */
function TreeNode(id, label) {

    // Properties
    this.id = id;
    this.label = label;
    this.path = '';
    this.expanded = false;
    this.remote = true;
    this.checked = false;
    this.isLeaf = false;
    this.parentId = 0;
}