/*
*   Name: BizAgi FormModeler Editor Controls Navigator
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for controls (elements in toolbar)
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.controlsnavigator.model", {}, {

    /*
    *   Cosntructor, creates the component model based on the control's definitions
    */
    init: function () {
        var self = this;

        // Call base
        self._super();

        // Holds map of controls    
        self.controls = {};

        self.context = {
            form: { groups: [], hash: {} },
            startform: { groups: [], hash: {} },
            grid: { groups: [], hash: {} },
            offlinegrid: { groups: [], hash: {} },
            adhocgrid: { groups: [], hash: {} },
            searchform: { groups: [], hash: {} },
            queryform: { groups: [], hash: {} },
            offlineform: { groups: [], hash: {} },
            template: { groups: [], hash: {} },
            layout: { groups: [], hash: {} },
            notVisible: { groups: [], hash: {} },
            adhocform: { groups: [], hash: {} },
        };
    },

    /*
    *   Reads the metadata, checks the visual section and find the render groups to build this object
    */
    processData: function (data) {
        var self = this;

        $.each(data.controls, function (index, element) {

            if (!self.controls[element.name]) {

                var group = self.resolveGroupforControlNavigator(element.design.visual["controls-navigator"]);
                if (group) {
                    var context = self.getControlContext(element);
                    if (context) {
                        if (!context.hash[group]) {
                            self.createAndAddGroupInModel(context, group, element);
                        }
                        else {
                            context.hash[group].addItem(element);
                            self.controls[element.name] = context.hash[group].items[context.hash[group].items.length - 1];
                        }
                    }
                }
            }
        });

        self.sortGroups();
    },

    /*
    *   Resolve name of group
    */
    resolveGroupforControlNavigator: function (controlNavigator) {
        var groupInControlNavigator = "default", controlNavigatorType;
        if (controlNavigator) {
            if (controlNavigator == "none" || controlNavigator.group == "none") return null;

            controlNavigatorType = typeof (controlNavigator.group);
            switch (controlNavigatorType) {
                case "string":
                    groupInControlNavigator = controlNavigator.group;
                    break;

                case "object":
                    groupInControlNavigator = bizagi.editor.utilities.resolveInternalResource(controlNavigator.group);
                    break;
            }
        }

        return groupInControlNavigator;
    },

    /*
    *   Creates a new group for a given context, and adds an element
    */
    createAndAddGroupInModel: function (context, group, element) {
        var self = this;

        var newGroup = new bizagi.editor.component.controlsnavigator.group.model(element);
        context.groups.push(newGroup);
        context.hash[group] = newGroup;
        self.controls[element.name] = newGroup.items[0];

    },

    /*
    *   Get the control context for each element
    */
    getControlContext: function (element) {
        var self = this;
        var type = element.type;
        var context = self.publish("getContext");

        if (type === "column") {
            return self.context.grid;
        } else if (type === "offlinecolumn") {
            return self.context.offlinegrid;
        } else if (type === "adhoccolumn") {
            return self.context.adhocgrid;
        } else if (type === "search") {
            return self.context.searchform;
        } else if (type === "query") {
            return self.context.queryform;
        } else if (type === "queryInternal") {
            return self.publish("isContextEntityApplication") ? self.context.queryform : null;
        } else if (type === "offline" || type === "offlinecontainer") {
            return self.context.offlineform;
        } else if (type === "adhoc" || type === "adhoccontainer") {
            return self.context.adhocform;
        } else if (type === "layout") {
            return self.context.layout;
        } else if (type === "nestedform" || type === "booleandisabled") {
            return self.context.notVisible;
        } else if (type == "container") {
            if (context == "queryform" && !self.isGridControl(element))
                return self.context.queryform;
            if (context == "startform")
                return self.context.startform;
            else
                return self.context.form;                   
        }
        else {
            return context == "startform" ? self.context.startform : self.context.form;                
        }
    },

    /*
    *  sorts the items of group by name 
    */
    sortGroups: function () {
        var self = this;

        for (var key in self.context) {
            for (var i = 0, l = self.context[key].groups.length; i < l; i += 1) {
                self.context[key].groups[i].items.sort(self.sortFunction);
            }
        }
    },

    /*
    *  compares items
    */
    sortFunction: function (itemA, itemB) {

        var nameA = itemA.name.toLowerCase();
        var nameB = itemB.name.toLowerCase();

        return ((nameA < nameB) ? -1 : ((nameA > nameB) ? 1 : 0));
    },

    /*
    * Gets current displayName for control
    */
    getControlDisplayName: function (controlName) {
        var self = this;

        if (!self.controls[controlName]) { return controlName; }
        return self.controls[controlName]["name"];
    },

    /*
    * Returns true if the element is a grid 
    */
    isGridControl: function (element) {

        return (element.name.indexOf("grid") >= 0);
    }


})


