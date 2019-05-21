/*
*   Name: BizAgi Editor Component Properties  Commands Group by
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for command
*/

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.groupby", {},
{

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.parentIsGrid())
            self.indexedProperty.notShow = true;

    },

    /*
    * The groupby property only aplies to groupedgrid control
    * if the control parent isn't a groupedgrid, this property is hidden   
    */
    parentIsGrid: function () {
        var self = this;

        var element = self.element;
        var parent = element.parent;

        return parent.type == "grid"; 
    }

});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.showcolumn", {},
{

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.parentIsGrid())
            self.indexedProperty.notShow = true;

    },

    /*
    * The showcolumn property only aplies to groupedgrid control
    * if the control parent isn't a groupedgrid, this property is hidden   
    */
    parentIsGrid: function () {
        var self = this;

        var element = self.element;
        var parent = element.parent;

        return parent.type == "grid";
    }

});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.displaytype", {},
{

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.parentIsGrid())
            self.indexedProperty.notShow = true;

    },

    /*
    * The groupby property only aplies to groupedgrid control
    * if the control parent isn't a groupedgrid, this property is hidden   
    */
    parentIsGrid: function () {
        var self = this;

        var element = self.element;
        var parent = element.parent;

        return parent.type == "grid";
    }

});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.isadministrable", {},
{

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        var entityType = self.element.triggerGlobalHandler("getContextEntityType");        
        if (entityType != "parameter")
            self.indexedProperty.notShow = true;
               
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.selectProcess", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        var entityType = self.element.triggerGlobalHandler("getContextEntityType");

        if (entityType != "application")
            self.indexedProperty.notShow = true;
        else {           
            self.indexedProperty.allowClick = self.element.triggerGlobalHandler("getControllerInfo", { type: "isNewForm" });
        }

    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.allowdecimals", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        var isGridContext = self.element.triggerGlobalHandler("getControllerInfo", { type: "isGridContext" });
        var xpathNavigatorModel = (isGridContext) ? self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModelGrid" }) : self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModel" });

        if (self.properties.xpath) {
            var xpath = bizagi.editor.utilities.resolveComplexXpath(self.properties.xpath);
            node = xpathNavigatorModel.getNodeByXpath(xpath);

            var dataType = node && node.getDataType();
            function allowDecimals(dataType) {
                if (dataType == 'OracleNumber') { return false; }
                if (dataType == 'BigInt') { return false; }
                if (dataType == 'Int') { return false; }
                if (dataType == 'SmallInt') { return false; }
                if (dataType == 'TinyInt') { return false; }

                return true;
            }

            if (!allowDecimals(dataType)) {
                self.indexedProperty.notShow = true;
                self.properties.allowdecimals = false;
            }
        
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.buttonrule", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        
        if (self.element.type == "formbutton") {
            var isStartForm = self.element.triggerGlobalHandler("getControllerInfo", { type: "isStartFormContext" });            
            if (isStartForm)
                self.indexedProperty.notShow = true;            
        }
        
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.visible", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        
        if (self.element.type == "formbutton") {
            var isStartForm = self.element.triggerGlobalHandler("getControllerInfo", { type: "isStartFormContext" });
            if (isStartForm)
                self.indexedProperty.notShow = true;
        }
        
    }
});


bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.defaultinclude", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.parentIsGrid() || !self.properties.selectable )
            self.indexedProperty.notShow = true;

    },

    /*
    * The groupby property only aplies to groupedgrid control
    * if the control parent isn't a groupedgrid, this property is hidden   
    */
    parentIsGrid: function () {
        var self = this;

        var element = self.element;
        var parent = element.parent;

        return parent.type == "grid";
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.numberrange", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        var isGridContext = self.element.triggerGlobalHandler("getControllerInfo", { type: "isGridContext" });
        var xpathNavigatorModel = (isGridContext) ? self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModelGrid" }) : self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModel" });

        if (self.properties.xpath) {
            var xpath = bizagi.editor.utilities.resolveComplexXpath(self.properties.xpath);
            node = xpathNavigatorModel.getNodeByXpath(xpath);
            if (node && node.getRenderType() == "oracleNumber") {
                self.properties.allowdecimals = false;
                self.indexedProperty.notShow = true;                
            }
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.defaultvalue", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        var isGridContext = self.element.triggerGlobalHandler("getControllerInfo", { type: "isGridContext" });
        var xpathNavigatorModel = (isGridContext) ? self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModelGrid" }) : self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModel" });

        if (self.properties.xpath) {
            var xpath = bizagi.editor.utilities.resolveComplexXpath(self.properties.xpath);
            node = xpathNavigatorModel.getNodeByXpath(xpath);
            if (node && node.getRenderType() == "oracleNumber") {
                self.indexedProperty.notShow = true;
            }
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.actions", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        
        if (self.element.type == "formbutton") {
            var isStartForm = self.element.triggerGlobalHandler("getControllerInfo", { type: "isStartFormContext" });
            if (isStartForm)
                self.indexedProperty.notShow = true;
        }
        
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.maxlines", {},
{
    execute: function () {
        var self = this;
        if (self.element.properties.isextended == false || self.element.properties.isextended == "false")
            self.indexedProperty.show = false;
        else
            self.indexedProperty.show = true;
    }
});


bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.formatvalue", {},
    {
        execute: function () {
            var self = this;
            if (self.element.properties.displaytype == "label") {
                self.indexedProperty.show = false;
            } else {
                self.indexedProperty.show = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.format", {},
    {
        execute: function () {
            var self = this;
            if (self.element.properties.displaytype == "value") {
                self.indexedProperty.show = false;
            } else {
                self.indexedProperty.show = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.xpath", {},
{
    execute: function () {
        var self = this;
        if (self.element.properties.typedinamic) {
            if (self.element.properties.typedinamic === "databind" && self.properties.allowdinamiclabel) {
                self.indexedProperty.show = true;
            } else {
                self.indexedProperty.show = false;
            }
        }

        if(self.indexedProperty.value){

        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.xpathAdhoc", {},
{
    execute: function () {
        var self = this;
        if (!self.element.properties.draggedProperty) {
            var xpath = "";                       
            if (!self.element.properties.xpathAdhoc) {
                if (self.element.properties.displayName instanceof Object) {
                    xpath = self.element.properties.displayName.i18n.default.replace(/[(\/[&\/\\#,+()$~%.'":*?<>{}\s@!¡¿.,àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/g, '');
                } else {
                    xpath = self.element.properties.displayName.replace(/[(\/[&\/\\#,+()$~%.'":*?<>{}\s@!¡¿.,àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/g, '');
                }
                xpath = xpath.substr(0, 1).toLowerCase() + xpath.substr(1);
                self.element.properties.xpathAdhoc = { xpath: xpath, relatedEntity: null };
            }
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.tagslist", {
    tagsCache: {}
},
{
    execute: function () {
        var self = this;

        self.indexedProperty.show = true;

        if (self.element.properties.xpath) {
            var tagsCache = self.Class.tagsCache;
            var relatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(self.element.properties.xpath);

            if (!tagsCache[relatedEntity]) {
                var getTagsEntity = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol: "gettags",
                    parameters: [{
                        key: "id",
                        value: relatedEntity
                    }]
                });

                self.indexedProperty['editor-parameters'].tags = getTagsEntity.processRequest();

                $.when(getTagsEntity.processRequest()).done(function (data) {                    
                    tagsCache[relatedEntity] = data || [];
                });
            } else {
                self.indexedProperty['editor-parameters'].tags = tagsCache[relatedEntity];
            }
           

        } else {
            self.indexedProperty.show = false;
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.data.filter", {},
    {
        execute: function () {
            var self = this;
            if (self.element.properties.typedinamic) {
                if (self.element.properties.typedinamic === "databind" && self.properties.allowdinamiclabel) {
                    self.indexedProperty.show = true;
                } else {
                    self.indexedProperty.show = false;
                }
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.data.datasource", {},
    {
        execute: function () {
            var self = this;
            if (self.element.properties.type == "adhocsuggest") {
                self.indexedProperty.showAdhocEntitiesControl = !self.element.propertyModel.designProperties.data.subproperties.datasource.ignoreAdhocEntities
                self.indexedProperty.showPredefinedValuesControl = false;
            } else {
                self.indexedProperty.showPredefinedValuesControl = true;
                self.indexedProperty.showAdhocEntitiesControl = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.data.displayattrib", {},
    {
        execute: function () {
            var self = this;
            if (self.element.properties.typedinamic) {
                if (self.element.properties.typedinamic === "databind" && self.properties.allowdinamiclabel) {
                    self.indexedProperty.show = true;
                } else {
                    self.indexedProperty.show = false;
                }
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.data.adhocdisplayattrib", {
    metadataCache: {}
},
{
    execute: function () {
        var self = this;
        var attributes = [];
        var def = new $.Deferred();
        if (self.element.properties.data.datasource && self.element.properties.data.datasource.type === "adhoc") {
            var metadataCache = self.Class.metadataCache;
            var relatedEntity = self.element.properties.data.datasource.guid;

            if (!metadataCache[relatedEntity]) {
                var getAdhocEntityAttribs = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol: "getadhocentityattribs",
                    parameters: [{
                        key: "guid",
                        value: relatedEntity
                    }]
                });

                $.when(getAdhocEntityAttribs.processRequest()).done(function (data) {
                    //self.indexedProperty['editor-parameters'].attribs = data;
                    metadataCache[relatedEntity] = data;
                    attributes = data;
                    def.resolve(attributes);
                });
            } else {
                //self.indexedProperty['editor-parameters'].attribs = metadataCache[relatedEntity];
                attributes = metadataCache[relatedEntity];
                def.resolve(attributes);
            }                        
            self.indexedProperty.show = true                          
        } else {
            if (self.element.properties.data.datasource && self.element.properties.data.datasource.type === "bizagi") self.element.properties.data.adhocdisplayattrib = null;
            self.indexedProperty.show = false;
        }        
        self.indexedProperty['editor-parameters'].attribs = def.promise();
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.datarule", {},
    {
        execute: function () {
            var self = this;

            if (self.element.properties.typedinamic === "ruleexpression" && self.properties.allowdinamiclabel) {
                self.indexedProperty.show = true;
            } else {
                self.indexedProperty.show = false;
            }
        }
    });



bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.typedinamic", {},
    {
        //bindingtype
        execute: function () {
            var self = this;
            if (self.properties.allowdinamiclabel) {
                self.indexedProperty.show = true;
            } else {
                self.indexedProperty.show = false;
            self.element.requiredPropertiesOverrides({"xpath":false,"data.displayattrib":false,"data.filter":false,"datarule":false});
            }

            if (self.element.properties.typedinamic === "databind" && self.properties.allowdinamiclabel) {
            self.element.requiredPropertiesOverrides({"xpath":true,"data.displayattrib":true,"data.filter":true,"datarule":false});
                self.element.setProperty("datarule",undefined);
            } else if(self.element.properties.typedinamic === "ruleexpression" && self.properties.allowdinamiclabel){
            self.element.requiredPropertiesOverrides({"xpath":false,"data.displayattrib":false,"data.filter":false,"datarule":true});
            self.element.setProperty("xpath", undefined);
            self.element.setProperty("data.displayattrib",undefined);
            self.element.setProperty("data.filter","");
            }
            self.element.validRequiredProperties();
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.displayName", {},
    {
        execute: function () {
            var self = this;

            if (self.properties.allowdinamiclabel) {
                self.indexedProperty.show = false;
            } else {
                self.indexedProperty.show = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.isexclusive", {},
    {
        execute: function () {
            var self = this;
            var isGridContext = self.element.triggerGlobalHandler("getControllerInfo", { type: "isGridContext" });

            if (self.properties.display == "option" && isGridContext) {
                self.indexedProperty.show = false;
                self.properties.isexclusive = false;
            } else {
                self.indexedProperty.show = true;
            }
            if (self.properties.display === "check" && self.properties.isexclusive) {
                var def = self.element.triggerGlobalHandler("getControllerInfo", {
                    type: "searchDependencies",
                    guids: [self.args.element.guid],
                    message: bizagi.localization.getResource("formmodeler-command-searchdependencies-error-column-check")
                });
                $.when(def).done(function (response) {
                    if (!response.result) {
                        self.properties.isexclusive = false;
                    }
                });
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.required", {},
    {
        execute: function () {
            var self = this;
            if (self.properties.display === "check" && self.properties.isexclusive) {
                self.indexedProperty.show = false;
            } else {
                self.indexedProperty.show = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.totalize", {},
    {
        execute: function () {
            var self = this;
            if (self.properties.display === "check" && self.properties.isexclusive) {
                self.indexedProperty.show = false;
            } else {
                self.indexedProperty.show = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.submitonchange", {},
    {
        execute: function () {
            var self = this;
            if (self.properties.display === "check" && self.properties.isexclusive) {
                self.indexedProperty.show = false;
            } else {
                self.indexedProperty.show = true;
            }
        }
    });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.thousands", {},
        {
            /*
             *   Executes the command
             */
            execute: function () {
                var self = this;

                var isGridContext = self.element.triggerGlobalHandler("getControllerInfo", { type: "isGridContext" });
                var xpathNavigatorModel = (isGridContext) ? self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModelGrid" }) : self.element.triggerGlobalHandler("getControllerInfo", { type: "getXpathNavigatorModel" });

                if (self.properties.xpath) {
                    var xpath = bizagi.editor.utilities.resolveComplexXpath(self.properties.xpath);
                    node = xpathNavigatorModel.getNodeByXpath(xpath);
                    if ( node.getRenderType() == "number") {
                        //TODO: ajustar segun reglas de tiny integer
                        ///self.indexedProperty.notShow = true;
                        self.properties.allowdecimals = false;
                    }
                }
            }
        });

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.enabledby.stakeholders", {
    stakeholdersPromise: {
        resolve: false
    }
},
{
    execute: function () {
        var self = this,
            stakeholdersPromise = self.Class.stakeholdersPromise;

        if (!stakeholdersPromise.resolve) {
            var getStakeholders = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getstakeholders" });

            self.indexedProperty['editor-parameters'].stakeholders = getStakeholders.processRequest();

            $.when(getStakeholders.processRequest()).done(function (data) {
                self.Class.stakeholdersPromise.resolve = data;
            });
        } else {
            self.indexedProperty['editor-parameters'].stakeholders = stakeholdersPromise.resolve;
        }
                      
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.selecttemplate", {
    templatesPromise: {},
    regexParameter: /<\w+:([\w:]+)>/
},
{
    execute: function () {
        var self = this,            
            templatesPromisePromise = self.Class.templatesPromise;
                
        // Restore values
        self.indexedProperty['editor-parameters'].templates = null;
        self.indexedProperty.show = false;

        var relatedEntity = self.getRelatedEntity();

        if (relatedEntity) {
            templatesPromisePromise[relatedEntity] = templatesPromisePromise[relatedEntity] || {};
            self.indexedProperty.show = true;

            var getTemplates = bizagi.editor.communicationprotocol.factory.createProtocol({
                protocol: "gettemplates",
                entityGuid: relatedEntity
            });

            self.indexedProperty['editor-parameters'].templates = getTemplates.processRequest();
            self.indexedProperty['editor-parameters'].templatetype = self.getTemplateType();
        }
    },

    /*
    * Returns the related entity
    */
    getRelatedEntity: function () {
        var self = this,
            parametersRegex = /<\w+:([\w:]+)>/
            editorParameters = self.indexedProperty['editor-parameters'] || {},
            entity = editorParameters.entity;

        if (!entity) {
            return false;
        }

        var match = parametersRegex.exec(entity);
        var xpath = match[1].replace(/:/g, ".");

        // Check that the property has a value
        var value = self.element.resolveProperty(xpath);
        if (value) {
            return bizagi.editor.utilities.resolveComplexReference(value);
        }

        return false;
    },

    getTemplateType: function () {
        var self = this,
            regexParameter = self.Class.regexParameter,
            editorParameters = self.indexedProperty['editor-parameters'] || {},
            type = editorParameters.type;

        if (type) {
            var match = regexParameter.exec(type);
            var property = match[1].replace(/:/g, ".");

            // Check that the property has a value
            return self.element.resolveProperty(property) || false;
        }

        return false;
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.newrecords", {},
{
    /*
     *   Executes the command
     */
    execute: function () {
        var self = this;

        if (self.properties.newrecords) {
            if (bizagi.util.parseBoolean(self.properties.newrecords.allownew)) {
                self.element.requiredPropertiesOverrides({ "newrecords.allownewform": true });
            } else if (!bizagi.util.parseBoolean(self.properties.newrecords.allownew)) {
                self.element.requiredPropertiesOverrides({ "newrecords.allownewform": false });
            } else {
            }
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.searchforms", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if(!self.element.properties.xpath)
            self.indexedProperty.notShow = true;

    }

});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.multipleselection", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
       
        if (self.element.type == "actionlauncher") {
            var multiselection = bizagi.util.parseBoolean(this.element.resolveProperty('multipleselection'));

            if (multiselection) {
                this.element.assignProperty('required', { fixedvalue: "false" }, false);
            } 
        }
    }
});


bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.required", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.element.type == "actionlauncher") {
            var multiselection = bizagi.util.parseBoolean(this.element.resolveProperty('multipleselection'));

            if (multiselection) {
                self.indexedProperty.show = false;                
            }
            else {
                self.indexedProperty.show = true;
            }
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.maxitems", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.element.type == "entitytemplate") {
            value = bizagi.util.parseBoolean(this.element.resolveProperty('allowactions'));

            if (value) {
                self.indexedProperty.show = true;
            }
            else {
                self.indexedProperty.show = false;
            }
        }
    }
});

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.allowactions", {},
{
    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.element.type == "entitytemplate") {
            var isStarForm = self.element.triggerGlobalHandler("getControllerInfo", { type: "isStartFormContext" });

            
             self.indexedProperty.show = !isStarForm;
            

        }
    }
});