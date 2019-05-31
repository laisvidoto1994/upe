/*
*   Name: BizAgi FormModeler Editor Insert Element From XpathNavigator Command
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will define basic stuff for insertelementfromxpathnavigatorcommand
*
*   COMMAND ARGUMENTS
*
*   - position
*   - parent
*   - searchformresult
*   - data
*       -   renderType
*       -   displayName
*       -   name
*       -   guid
*       -   xpath
*       -   contextScope
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.insertElementFromXpathNavigatorCommand", {

    columnRenderMapping: {
        "boolean": "columnboolean",
        "button": "columnbutton",
        "text": "columntext",
        "number": "columnnumber",
        "money": "columnmoney",
        "date": "columndate",
        "document": "columnDocument",
        "combo": "columncombo",
        "cascadingCombo": "columncombo",
        "list": "columnlist",
        "search": "columnsearch",
        "formlink": "columnformlink",
        "hidden": "columnhidden",
        "label": "columnlabel",
        "link": "columnlink",
        "radio": "columnradio",
        "upload": "columnupload",
        "image": "columnimage",
        "uploadecm": "columnuploadecm",
        "letter": "columnletter"
    },

    offlineColumnRenderMapping: {
        "boolean": "offlinecolumnboolean",
        "text": "offlinecolumntext",
        "number": "offlinecolumnnumber",
        "money": "offlinecolumnmoney",
        "date": "offlinecolumndate",
        "combo": "offlinecolumncombo",
        "radio": "offlinecolumnradio",
        "search": "offlinecolumnsuggest"
    },

    offlineFormRenderMapping: {
        "boolean": "offlineboolean",
        "text": "offlinetext",
        "number": "offlinenumber",
        "money": "offlinemoney",
        "date": "offlinedate",
        "combo": "offlinecombo",
        "cascadingCombo": "offlinecombo",
        "list": "offlinecombo",
        "radio": "offlinecombo",
        "search": "offlinesuggest",
        "grid": "offlinegrid",
        "image": "offlineimage",
        "upload": "offlineupload"
    },

    searchFormRenderMapping: {
        "boolean": "searchboolean",
        "text": "searchtext",
        "number": "searchnumber",
        "money": "searchmoney",
        "date": "searchdate",
        "combo": "searchcombo",
        "cascadingCombo": "searchcombo",
        "list": "searchcombo",
        "radio": "searchcombo",
        "search": "searchsuggest"
    },

    searchFormResultRenderMapping: {
        "boolean": "columnResultBoolean",
        "text": "columnResultText",
        "number": "columnResultNumber",
        "money": "columnResultMoney",
        "date": "columnResultDate",
        "combo": "columnResultText",
        "cascadingCombo": "columnResultText",
        "list": "columnResultText",
        "radio": "columnResultText",
        "search": "columnResultText"
    },

    queryFormRenderMapping: {
        "boolean": "queryboolean",
        "text": "querytext",
        "number": "querynumber",
        "money": "querymoney",
        "date": "querydate",
        "combo": "querycombo",
        "list": "querylist",
        "cascadingCombo": "querycascadingcombo",
        "radio": "queryradio",
        "search": "querycombo",
        "application": "queryapplication",
        "process": "queryprocess",
        "creatorfullname": "querycreatorfullname",
        "creatorposition": "querycreatorposition",
        "creatorusername": "querycreatorusername",
        "currentuser": "queryusercurrentuser",
        "currentuserfullname": "queryuserfullname",
        "currentuserusername": "queryuserusername",
        "currentuserposition": "queryuserposition",
        "previoususer": "queryuserprevioususer",
        "previoususerfullname": "queryprevioususerfullname",
        "previoususerusername": "queryprevioususerusername",
        "previoususerposition": "queryprevioususerposition",
        "currenttask": "querytaskcurrenttask",
        "previoustask": "querytaskprevioustask",
        "taskentrydate": "querytaskentrydate",
        "taskexpirydate": "querytaskexpirydate",
        "taskstate": "querytaskstate",
        "casecreationdate": "querycasecreationdate",
        "casecreator": "querycasecreator",
        "caseid": "querycaseid",
        "casenumber": "querycasenumber",
        "casesolutiondate": "querycasesolutiondate",
        "casestate": "querycasestate",
        "nestedform": "nestedform"
    },


    propertiesOverrides: {
        "float": { allowdecimals: "true" }
    }
}, {

    /*
    *   Executes the command, also try to guess the element type from the information provided by the xpath node
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        if (typeof self.element === "undefined") {

            var data = self.createElementData();

            // if the type of element isn't valid, then return;
            if (!data.type) {
                self.arguments.canUndo = false;
                return true;
            }

            self.arguments.canValidate = true;

            var element = self.createElement(data);

            self.isSpecialElement(args.data.renderType, element);
            self.element = element;

            self.parent = self.arguments.parent || self.controller.getContextInfo().guid;
        }

        // Execute insert element command
        self.controller.executeCommand({
            command: "insertElement",
            position: self.arguments.position,
            parent: self.parent,
            element: self.element,
            searchformresult: self.arguments.searchformresult,
            canUndo: false
        });

        return true;
    },

    /*
    *   Undoes the action
    */
    undo: function () {
        var self = this;

        // Execute remove element command
        var commandResult = self.controller.executeCommand({
            command: "removeElementById",
            position: self.arguments.position,
            parent: self.parent,
            element: self.element,
            guid: self.element.guid,
            searchformresult: self.arguments.searchformresult,
            canUndo: false
        });

        commandResult = self.resolveResult(commandResult);
        if (commandResult.error) { return false; }

        return true;
    },

    /*
    *   Creates the element to be inserted and resolves xpath, type and displayNamer
    */
    createElementData: function () {
        var self = this;
        var args = self.arguments;
        var element = {};

        element.type = self.resolveType();
        if (args.data.context == "adhocform" || args.data.context == "adhocgrid") {
            element.xpathAdhoc = { xpath: args.data.xpath.xpath.baxpath.xpath, relatedEntity: args.data.parent ? args.data.parent.guidRelatedEntity : null };
            element.draggedProperty = true;
            element.displayName = args.data.displayName ? args.data.displayName : args.data.name;
            if (args.data.guidRelatedEntity) {
                element.data = { datasource: { guid: args.data.guidRelatedEntity, type: args.data.entityContext } };
                if (args.data.predefinedValues) {
                    element.data.datasource.values = args.data.predefinedValues;
                }
            }            
        } else {
            element.xpath = args.data.xpath;
        }
        element.renderType = args.data.nodeSubtype;
        if (self.controller.isQueryFormContext() && self.isColumn()){
            element.selectable = false;
        }
        if (args.data.renderType === "nestedform") { element.form = bizagi.editor.utilities.buildComplexReference(args.data.guid); }
        if (element.renderType && self.Class.propertiesOverrides[element.renderType]) {
            element = $.extend(element, self.Class.propertiesOverrides[element.renderType]);
        }
        return element;
    },

    /*
    * Returns true if the parent is a grid
    */
    isColumn : function(){
        var self = this;
        var args = self.arguments;
        var xpathModel = self.controller.getXpathNavigatorModel();

        var xpath = bizagi.editor.utilities.resolveComplexXpath(args.data.xpath);
        var node = xpathModel.getNodeByXpath(xpath);

        return (node) ? node.parentIsGrid() : false;


    },

    /*
    *   Resolves the new element type
    */
    resolveType: function () {
        var self = this;
        var context = self.controller.getContext();        

        if (context == "form" || context == "startform") {
            // Guess render type for form renders
            if (self.arguments.data.renderType === "form") {
                return "nestedform";
            }            
            return self.arguments.data.renderType;

        } else if (context == "grid") {
            // Guess render type for column renders
            return this.Class.columnRenderMapping[self.arguments.data.renderType];
        } else if (context == "offlinegrid") {
            return this.Class.offlineColumnRenderMapping[self.arguments.data.renderType];
        } else if (context == "searchform") {
            if (!self.arguments.searchformresult) {
                // Create a search control
                // Guess render type for search form renders
                return this.Class.searchFormRenderMapping[self.arguments.data.renderType];
            } else {
                // Create a search result control
                // Guess render type for search form result renders
                return this.Class.searchFormResultRenderMapping[self.arguments.data.renderType];
            }
        } else if (context == "offlineform") {
            // Create a offline control
            // Guess render type for offline form renders
            return this.Class.offlineFormRenderMapping[self.arguments.data.renderType];
        } else if (context == "queryform") {
            return this.Class.queryFormRenderMapping[self.arguments.data.renderType];
        } else if (context == "adhocform" || context == "adhocgrid") {
            return self.arguments.data.renderType;
        }

        return null;
    }

})
