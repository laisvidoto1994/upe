
/*
*   Name: BizAgi FormModeler Editor Add Entity children Model Command
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for addEntityChildrenCommand
*/

bizagi.editor.insertElementFromXpathNavigatorCommand.extend("bizagi.editor.addEntityChildrenCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var node = args.node;
        var defer = new $.Deferred();
        
        self.elements = [];


        args.refresh = true;
               
        self.addElementToRender(node.getChildren());
               
        defer.resolve(true)
           

        args.result = defer.promise();
        return true;
     
    },

    addElementToRender: function (nodes) {
        var self = this;

        nodes.forEach(function (node) {
            var renderType = self.resolveType(node.renderType);

            if (renderType) {
                if (node.nodeType != "form") {
                    var element = self.model.createElement(renderType, {
                        properties: {
                            type: renderType,
                            xpath: bizagi.editor.utilities.buildComplexXpath(node.xpath, node.contextScope, node.isScopeAttribute, node.guidRelatedEntity),
                            renderType: node.nodeSubtype
                        }

                    });

                    self.elements.push(element);

                    self.model.addElement(element);
                }
            }
        });
    },

    /*
    *   Resolves the new element type
    */
    resolveType: function (type) {
        var self = this;
        var context = self.controller.getContext();        

        if (context == "form" || context == "startform") {
            // Guess render type for form renders
            if (type === "form") {
                return "nestedform";
            }            
            return type;

        } else if (context == "grid") {
            // Guess render type for column renders
            return this.Class.columnRenderMapping[type];
        } else if (context == "offlinegrid") {
            return this.Class.offlineColumnRenderMapping[type];
        } else if (context == "searchform") {            
            return this.Class.searchFormRenderMapping[type];             
        } else if (context == "offlineform") {
            return this.Class.offlineFormRenderMapping[type];
        } else if (context == "queryform") {
            return this.Class.queryFormRenderMapping[type];
        }

        return null;
    },

    undo: function () {
        var self = this;

        self.elements.forEach(function (element) {
            self.model.removeElementById(element.guid);
        });

        return true;
    }
})
