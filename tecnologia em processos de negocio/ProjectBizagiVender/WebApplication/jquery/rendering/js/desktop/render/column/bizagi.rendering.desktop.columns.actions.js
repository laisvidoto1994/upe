/*
 *   Name: BizAgi Desktop Actions Column Decorator Extension
 *   Author: Cristian Olaya
 *           Iván Ricardo Taimal
 *   Comments:
 *   -   This script will redefine the text column decorator class to adjust to desktop devices
 */

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.actions", {}, {

    /*
     *   Post process the element after it has been rendered
     */
    postRender: function (surrogateKey, cell) {
        // Call base
        var self = this;
        this._super(surrogateKey, cell);
        self.configureHandlersActions(surrogateKey);
        self.configureControls(surrogateKey);
        var mode = self.getMode();
        if (mode == "execution") {
            var decorated = this.getDecorated(surrogateKey);
            var control = decorated.getControl();
            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                control.html("");
            }
        }

    },

    configureControls: function (surrogateKey) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var editButton = decorated.element.find("#ui-icon-action-edit");
        var deleteButton = decorated.element.find("#ui-icon-action-trash");
        var detailButton = decorated.element.find("#ui-icon-action-detail");

        editButton.attr("title",self.parent.properties.editLabel);
        deleteButton.attr("title",self.parent.properties.deleteLabel);
        detailButton.attr("title",self.parent.properties.detailLabel);

        if (!self.grid.columnActionParams.allowEdit ||  !self.grid.columnActionParams.withEditForm) {
            editButton.hide();
        }
        if (!self.grid.columnActionParams.allowDelete) {
            deleteButton.hide();
        }
        if (!self.grid.columnActionParams.allowDetail) {
            detailButton.hide();
        }
    },

    /*
     *  Configure aditional Handlers
     */
    configureHandlersActions: function (surrogateKey) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var editButton = decorated.element.find("#ui-icon-action-edit");
        var deleteButton = decorated.element.find("#ui-icon-action-trash");
        var detailButton = decorated.element.find("#ui-icon-action-detail");
        editButton.click(function () {
            self.grid.editRow(surrogateKey);
        });
        deleteButton.click(function () {
            self.grid.deleteRow(surrogateKey);
        });
        detailButton.click(function () {
            self.grid.showFormDetails(surrogateKey);
        });
    }

});
