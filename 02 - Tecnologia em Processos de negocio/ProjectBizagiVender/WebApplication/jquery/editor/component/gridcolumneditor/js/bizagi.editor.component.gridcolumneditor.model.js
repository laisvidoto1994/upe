/*
*   Name: BizAgi FormModeler Grid Edition Component
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will define basic stuff for grid column editor model 
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.gridcolumneditor.model", {}, {

    /*
    *   Constructor
    */
    init: function (gridModel) {
        var self = this;

        // Define variables
        self.model = { columns: [] };
        self.guid = gridModel.guid;
        self.originalModel = bizagi.clone(gridModel);

        // Process model to add columns
        self.model.columns = self.processModel(gridModel);
    },

    /*
    *   Return the guid of the grid being edited
    */
    getGuid: function () {
        return this.guid;
    },

    /*
    *   Updates internal model
    */
    update: function (gridModel) {
        var self = this;
        self.model.columns = self.processModel(gridModel);
    },

    /*
    *   Process the model to populate columns array
    */
    processModel: function (gridModel) {
        var columns = [];
        if (!gridModel) return columns;

        if (gridModel.elements.length > 0) {
            for (var i = 0; i < gridModel.elements.length; i++) {
                var element = gridModel.elements[i];

                // Push into columns array
                columns.push({
                    guid: element.guid,
                    displayName: bizagi.editor.utilities.resolvei18n(element.properties.displayName),
                    xpath: element.properties.xpath,
                    type: element.type,
                    columnwidth: element.properties.columnwidth
                });
            }
        }

        return columns;
    },

    /*
    *   Get model for rendering
    */
    getViewModel: function () {
        return this.model;
    },

    /*
    *   Inserts a column with control navigator's info
    */
    insertControlColumn: function (position, controlData) {
        var self = this;
        var column = { guid: Math.guid(), displayName: controlData.caption, type: controlData.type };

        // Add into model
        self.model.columns.splice(position, 0, column);
        return column;
    },

    /*
    *   Inserts a column with xpath navigator's info
    */
    insertXpathColumn: function (position, xpathData) {
        var self = this;
        var column = {
            guid: Math.guid(),
            displayName: xpathData.displayName,
            xpath: bizagi.editor.utilities.buildComplexXpath(xpathData.xpath, xpathData.contextScope, xpathData.isScopeAttribute, xpathData.guidRelatedEntity)
        };

        // Add into model
        self.model.columns.splice(position, 0, column);
        return column;
    },

    /*
    *   Moves a column into the model
    */
    moveColumn: function (posIni, posEnd) {
        var self = this;
        self.model.columns.move(posIni, posEnd);
    },

    /*
    *   Delete a column by guid
    */
    deleteColumn: function (guid) {
        var self = this;

        for (var i = 0, l = self.model.columns.length; i < l; i += 1) {
            if (self.model.columns[i].guid === guid) {
                self.model.columns.splice(i, 1);
                break;
            }
        }
    },

    /*
    *  Check if the width column is editable (if I am the last with the value 'auto')
    */
    isWidthColumnEditable: function (guid) {
        var self = this;

        var autoArray = $.grep(self.model.columns, function (column, _) {
            return (column.columnwidth == undefined || column.columnwidth == "auto");
        });

        if (autoArray.length == 1) {
            for (var i = 0, l = self.model.columns.length; i < l; i += 1) {
                var properties = self.model.columns[i];
                var columnWidth = properties.columnwidth;

                if (columnWidth == "auto" || columnWidth == undefined && guid == self.model.columns[i].guid) {
                    return false;
                }
            }
            return true;
        } else {
            return true;
        }

    },

    /*
    * Check the maximum percentage to apply checking the other columns percentages (max value=100%)
    */
    getPercentMaxWidth: function (guid) {
        var self = this;
        var max = 100;

        for (var i = 0, l = self.model.columns.length; i < l; i += 1) {
            var properties = self.model.columns[i];
            var columnWidth = properties.columnwidth;

            if (columnWidth && columnWidth.indexOf("%") >= 0 && guid != self.model.columns[i].guid) {
                max -= parseInt(columnWidth);
            }
        }

        return max;
    }
});