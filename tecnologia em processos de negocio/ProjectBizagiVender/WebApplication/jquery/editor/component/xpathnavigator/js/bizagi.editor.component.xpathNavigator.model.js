/*
 * Author : David Montoya
 * Date   : 14mar12 
 * Comments:
 *     Define the model of the xpath navigator component
 *
 */

bizagi.editor.observableClass.extend("bizagi.editor.component.xpathnavigator.model", {
    view: {
        onlyProcessEntity: "PROCESSENTITY",
        allView: "All"
    }
},
{

    /*
    *   Constructor
    */
    init: function (data, isEmptyRootNode) {
        var self = this;

        // Call base
        self._super();

        // Define some class variables
        self.rootNodes = null;
        self.nodes = null;
        self.nodeHash = {};
        self.xpathNodeHash = {};
        self.processEntityNodes = {};
        self.communicationProtocol = bizagi.editor.communicationprotocol.factory;
        self.processEntityId = data.nodes && data.nodes[0] && data.nodes[0].processEntityId;
        self.isProcessEntity = (self.processEntityId) ? true : false;
        self.isEmptyRootNode = isEmptyRootNode || false;

        if (data) {
            // Get process entity nodes
            if (self.isProcessEntity) {
                for (var i = 0, l = data.nodes[0].nodes.length; i < l; i++) {
                    var node = data.nodes[0].nodes[i];
                    if (node.guidRelatedEntity == self.processEntityId) {
                        self.processEntityNodes[node.guid] = node;
                    }
                }
            }
            self.rootNodes = self.processData(data);
            self.nodes = (self.rootNodes.length > 0 && self.rootNodes[0].nodes) ? self.rootNodes[0].nodes.slice(0) : self.nodes;

            if (data.context) self.context = data.context;
        }
    },

    /*
    *   Process data in order to create nodes to the model
    */
    processData: function (data) {
        var self = this;
        var nodes = [];

        if (data.nodes) {
            $.each(data.nodes, function (index, child) {
                var node = new bizagi.editor.component.xpathnavigator.node(child);
                // Add node to collections
                self.nodeHash[node.id] = node;

                // Add node to process entity nodes collection
                if (self.processEntityNodes[node.guid])
                    self.processEntityNodes[node.guid] = node;


                // Las formas quedan con el mismo xpath de la entidad a la que pertenecen, lo cual estaba sobreescribiendo la
                // informacion de la entidad
                if (node.nodeType && node.nodeType !== "form") {
                    self.xpathNodeHash[node.xpath] = node;
                }

                nodes.push(node);

                // Check if the node can have children
                if (node.canHaveChildren && child.nodes.length == 0) child.nodes = null;
                if (child.nodes) {
                    var children = self.processData({ nodes: child.nodes });
                    node.setChildren(children);
                    $.each(children, function (_, child) {
                        child.setParent(node);
                    });
                }
            });
        }
        return nodes;
    },

    /*
    *   Adds children to a node
    */
    addChildren: function (id, data) {
        var self = this;
        var node = self.getNode(id);
        var children = self.processData(data);

        // Update root node
        if (self.isRootNode(node)) { self.nodes = children; }

        node.setChildren(children);
        $.each(children, function (_, child) {
            child.setParent(node);
        });
    },

    /*
    *   Return the children nodes for a node
    */
    getChildren: function (id, force) {
        var self = this;
        var node = self.getNode(id);
        if (!node) return [];

        var children = node.getChildren();
        if (children && !force) {
            return children;
        }

        // When there are no children, we need to fetch them out
        var defer = new $.Deferred();
        node.isRootNode = this.isRootNode(node);
        var getNodes = self.communicationProtocol.createProtocol({ protocol: "getchildrennodes", node : node });

        $.when(getNodes.processRequest())
	   	.done(function (data) {

	   	    // Update node model and resolve deferred
	   	    self.addChildren(id, data);
	   	    defer.resolve(node.getChildren());
	   	});

        return defer.promise();
    },

    /*
    *   Returns the node matching an xpath
    */
    getNodeByXpath: function (xpath) {
        var self = this;
        return self.xpathNodeHash[xpath];
    },

    /*
    *   Returns a node info based on the guid
    */
    getNode: function (id) {
        var self = this;
        return self.nodeHash[id];
    },

    /*
    * Gets all model
    */
    getAllModel: function () {
        var self = this;

        if (self.rootNodes.length > 0 ) self.rootNodes[0].nodes = self.nodes && self.nodes.slice(0);
    },

    /*
    * Gets process entity model
    */
    getProcessEntityModel: function () {
        var self = this;
        var nodes = [];

        if (!self.isProcessEntity) { self.getAllModel(); }
        else {
            for (var key in self.processEntityNodes) {
                if (!self.processEntityNodes.hasOwnProperty(key)) { continue; }
                nodes.push(self.processEntityNodes[key]);
            }
            self.rootNodes[0].nodes = nodes;
        }

    },

    /*
    * Gets the process entity ID. if exists!
    */
    getProcessEntityId: function () {
        var self = this;

        return (self.processEntityId) ? self.processEntityId : null;
    },

    /*
    * Return true if the xpath is related with the process entity, directly
    */
    processEntityRelated: function (xpath) {
        var self = this;

        var node = self.getNodeByXpath(xpath);
        return node && node.parentIsProcessEntity(self.processEntityId);
    },

    /*
    * Gets first node (app node) of model
    */
    getRootNode: function () {
        return this.rootNodes[0];
    },

    /*
    * Returns true is the node is the root node
    */
    isRootNode: function (node) {
        var self = this;

        // When the model is created for a grid context, there isn't a rootNode
        if (self.isEmptyRootNode) {
            return false;
        }


        var rootNode = self.getRootNode();
        if (rootNode && rootNode.guid === node.guid  &&
            rootNode.xpath === node.xpath) {
            return true;
        }
        return false;
    },

    /*
    *   Gets a submodel in order to retrieve xpath related sub trees
    */
    getSubModel: function (complexXpath) {
        var self = this;
        if (complexXpath === "none") return {};
        var xpath = bizagi.editor.utilities.resolveComplexXpath(complexXpath);

        // Xpath is empty, return main model
        if (xpath == undefined) return this;
        if (xpath.length == 0) return this;

        // Check the xpath node and return a new sub model based on the xpath node expand data
        var node = self.getNodeByXpath(xpath);
        if (node) {
            var defer = new $.Deferred();

            var getNodes = self.communicationProtocol.createProtocol({
                protocol: "getchildrennodes", node: {
                    contextScope: node.contextScope,
                    guidRelatedEntity: node.guidRelatedEntity,
                    xpath: "",
                    isRootNode: true,
                    style: node.style,
                    isScopeAttribute: node.isScopeAttribute
                }
            });

            // Fetch children
            $.when(getNodes.processRequest()).done(function (data) {
                // Create model
                var subModel = new bizagi.editor.component.xpathnavigator.model(data, true);
                defer.resolve(subModel);
            });
            return defer.promise();
        }

        return null;
    },

    /*
   *   Gets a submodel in order to retrieve xpaths from the given entity
   */
    getSubModelByEntity: function (guidEntity, entityContext) {
        var self = this;
        var defer = new $.Deferred();
        var getNodes = self.communicationProtocol.createProtocol({
            protocol: "getchildrennodes", node: {
                contextScope: null,
                guidRelatedEntity: guidEntity,
                xpath: "",
                isRootNode: true,
                style: null,
                isScopeAttribute: false,
                entityContext: entityContext
            }
        });

        // Fetch children
        $.when(getNodes.processRequest()).done(function (data) {
            // Create model
            var subModel = new bizagi.editor.component.xpathnavigator.model(data, true);
            defer.resolve(subModel);
        });
        return defer.promise();      
    }
})
