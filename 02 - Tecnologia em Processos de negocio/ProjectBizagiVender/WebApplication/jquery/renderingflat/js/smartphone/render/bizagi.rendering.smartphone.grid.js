/*
*   Name: BizAgi Smartphone Render Grid Extension
*   Author: Oscar o
*   Comments:
*   -   This script will redefine the grid render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.grid.extend("bizagi.rendering.grid", {}, {
    init: function (params) {
        var self = this;
        var data = params.data;

        data.properties.singleInstance = false;
        data.properties.rowsPerPage = 1;
        data.properties.labelAlign = "left";
        data.properties.displayType = "vertical";

        // Call base
        self._super(params);

        // Create a data-structure to keep track of each cell properties
        this.cellMetadata = {};

        // Fill default properties
        var properties = this.properties;

        // Just apply display-type: vertical, align it to the left
        properties.displayType = "vertical";
        properties.labelAlign = "left";
        properties.rowsPerPage = 1;

        //Totalizer validation
        if (properties.data && properties.data.rows)
            self.allRows = properties.data.rows;

        //revisar base para mejorar comportamiento cuando esta en false los elementos
        $.each(self.columns, function (index, value) {
            if (this.properties && this.properties.editable) {
                this.properties.editable = (properties.allowEdit === true) ? true : false;
            }
        });

        // Just for smartphones we need to take only one row if there is data in the json, because we use just one row per page
        if (properties.data && properties.data.rows && properties.data.rows.length > 1) {
            var newData = [];
            newData.push(properties.data.rows[0]);
            properties.data.rows = newData;
        }
    },

    /* method overrrides
    *  from base or virtual
    */
    setDisplayValue: function (value) { },
    setDisplayValueEdit: function (value) { },
    actionSave: function () { },
    /*
    * Updates manually the affected cell 
    */
    updateAffectedCellManually: function () { },

    /*
    * Get the row index using the key as a reference
    */
    getRowIndexByKey: function () { },
    /**
    *  Shows more info about a grid row
    * in smartphones not implemented
    */
    showMore: function (id) { },


    /**
     * Returns the indexes of all elements in the grid
     * @returns {*}
     */
    getIndexes: function () {
        var self = this;
        var data = $.merge(self.allRows, self.getDataNewRows());

        return data.reduce(function (acum, current) {
            if (typeof acum.find(function (el) { return el[0] == current[0]; }) === 'undefined') {
                acum.push(current);
            }
            return acum;
        }, []).map(function (item) {
            return item[0];
        });
    },

    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        properties.rowsPerPage = 1;

        container.addClass("bz-command-edit-inline");
        if (self.properties.helpText !== "") {
            control.addClass("bz-rn-grid-contains-help-text");
        }

        //hide the standar label
        //TODO: en tablet se realizae como getLabel
        self.getContainerRender().find(".ui-bizagi-label").hide();
        self.getArrowContainer().hide();
        // Call base 
        this._super();
        var grid = self.inputEdition = self.input = self.grid = control.find("#" + bizagi.util.encodeXpath(properties.xpath)).addClass("bz-cn-grid"); // $('<div class="bz-cn-grid"></div>').appendTo(control); //$("div", control); //$('<div class="bz-cn-grid"></div>').appendTo(control);
        var mode = self.getMode();
        var columns = self.buildColumnModel();

        var columnsTotalizers = jQuery.grep(columns, function (a) {
            return (a.summarizeBy);
        });

        //bizagi_grid_tablet
        grid.bizagi_grid_smartphone({
            columns: columns,
            title: properties.displayName,
            mode: self.getMode(),
            template: {
                grid: self.renderFactory.getTemplate("bizagi.grid.grid"),
                waiting: self.renderFactory.getTemplate("bizagi.grid.waiting"),
                table: self.renderFactory.getTemplate("bizagi.grid.table"),
                emptyTable: self.renderFactory.getTemplate("bizagi.grid.table.empty"),
                column: self.renderFactory.getTemplate("bizagi.grid.column"),
                specialColumn: self.renderFactory.getTemplate("bizagi.grid.column.special"),
                row: self.renderFactory.getTemplate("bizagi.grid.row"),
                rowButtons: self.renderFactory.getTemplate("bizagi.grid.row.buttons"),
                cell: self.renderFactory.getTemplate("bizagi.grid.cell"),
                specialCell: self.renderFactory.getTemplate("bizagi.grid.cell.special"),
                pager: self.renderFactory.getTemplate("bizagi.grid.pager"),
                buttons: self.renderFactory.getTemplate("bizagi.grid.buttons"),
                totalizer: self.renderFactory.getTemplate("bizagi.grid.totalizer")
            },
            actions: {
                add: properties.allowAdd,
                edit: (properties.allowEdit && properties.withEditForm),
                remove: properties.allowDelete,
                inlineAdd: properties.inlineAdd,
                allowMore: false,
                totalizer: properties.showSummary,
                hasTotalizer: columnsTotalizers.length > 0 && properties.data.rows.length > 0 ? true : false
            },
            pageRequested: function (ui) {
                if (mode != "execution") return;
                self.onPageRequested(ui);
            },
            totalData: function (ui) {
                if (mode != "execution") return;

                self.onTotalData();
            },
            sortRequested: function (ui) {
                if (mode != "execution") return;
                self.fetchData(ui.page, ui.sortBy, ui.sortType);
            },
            drawCell: function (ui) {
                return self.drawCell(ui.column, ui.key, ui.value, ui.isNewRow);
            },
            cellReady: function (ui) {
                return self.onCellReady(ui.column, ui.key, ui.cell, ui.isNewRow);
            },
            rowSelected: function (ui) {
                //self.triggerHandler("rowSelected", { id: ui.key });
            },
            addRow: function (ui) {
                if (mode != "execution") return;
                self.addRow();
            },
            editRow: function (ui) {
                if (mode != "execution") return;
                self.editRow(ui.key);
            },
            deleteRow: function (ui) {
                if (mode != "execution") return;
                self.deleteRow(ui.key);
            },
            showMore: function (ui) {
                self.showMore(ui.key);
            }
        });

        // Just for smartphones we need to take only one row if there is data in the json, because we use just one row per page
        if (properties.data && properties.data.rows && properties.data.rows.length > 1) {
            var newData = [];
            newData.push(properties.data.rows[0]);
            properties.data.rows = newData;
        }

        properties.skipInitialLoad = properties.skipInitialLoad || false;
        // Set initial data
        if (!properties.skipInitialLoad) {
            if (properties.data) {
                self.updateData(properties.data);

                // Trigger change in order to start up the actions when the controls is ready
                $.when(self.ready())
                    .done(function () {
                        self.triggerRenderChange({ changed: false });
                    });
            } else {
                self.fetchData(properties.page, properties.sortBy, properties.sortOrder);
            }
        }
    },

    getHeaderStyles: function () {
        var self = this;
        var label = "";
        var header = "";
        var properties = self.properties;

        if (properties.headerFormat) {
            var format = properties.headerFormat;

            if (format.color) {
                label += "color: " + format.color + ";";
            }

            if (format.background) {
                header += "background-color: " + format.background + ";";
            }

            if (format.bold) {
                label += "font-weight: bold; ";
            }

            if (format.italic) {
                label += "font-style: italic; ";
            }

            if (format.underline || format.strikethru) {
                var strikethru = bizagi.util.parseBoolean(format.strikethru) ? "line-through " : "";
                var underline = bizagi.util.parseBoolean(format.underline) ? "underline " : "";

                label += "text-decoration: " + strikethru + underline + ";";
            }

            if (format.size && format.size != "0") {
                var newFontSize = (100 + Number(format.size) * 10) + "%";
                label += "font-size: " + newFontSize + ";";
            }
        }

        return { label: label, header: header };
    },

    buildColumnModel: function () {
        var self = this;
        var properties = self.properties;
        var columns = self.columns;

        // Create id column first
        var keyColumn = {
            name: "id",
            index: 0,
            label: "id",
            hidden: true,
            align: "center",
            key: true
        };

        // Add to column model
        var columnModel = [];
        columnModel.push(keyColumn);

        $.each(columns, function (index, column) {
            // Set grid column
            column.columnIndex = index + 1;
            var columnLabel = !bizagi.util.isEmpty(column.properties.displayName) ? column.properties.displayName : " ";
            var gridColumn = {
                name: column.properties.xpath,
                index: index + 1,
                label: columnLabel,
                key: false,
                hidden: (!column.properties.visible || column.properties.type == "columnHidden" || column.properties.columnVisible === false),
                summarizeBy: (column.properties.totalize && column.properties.totalize.operation ? column.properties.totalize.operation : undefined),
                bizAgiProperties: column.properties
            };
            columnModel.push(gridColumn);
        });

        return columnModel;
    },

    /**
    * Makes the grid to refresh
    */
    refresh: function () {
        var self = this;
        var deferred = $.Deferred();

        $.when(self.fetchData()).done(function () {
            deferred.resolve();
        });

        return deferred.promise();
    },

    /*
    *   Holds the execution until the grid data is ready after a load operation
    */
    dataReady: function () {
        var self = this;

        return self.dataReadyDeferred != null ? self.dataReadyDeferred.promise() : null;
    },

    /*
    *   Method to set data and update the grid
    */
    updateData: function (data) {
        var self = this;
        var grid = self.grid;
        var columns = self.columns;

        // Set value in control
        if (data && self.properties) {
            self.properties.data = data;
            self.setCellOverrides(data, columns);

            self.triggerGridPluginHandler("setData", data);
        }
    },

    /*
    *   Method to fetch data from the server and then update the data
    */
    fetchData: function (page, sortBy, sortType) {
        var self = this;
        var properties = self.properties;
        var deferred = $.Deferred();

        // Define defaults
        page = page || 1;
        sortBy = sortBy || "id";
        sortType = sortType || "asc";

        // Update control properties
        properties.page = page;
        properties.sort = sortBy + " " + sortType;

        bizagi.util.smartphone.startLoading();

        $.when(self.getRemoteData())
            .then(function (data) {

                if (data) {
                    $.when(
                        self.updateData(data)
                    ).done(function () {
                        self.triggerRenderChange({ changed: false });

                        deferred.resolve();
                    });
                }
            }).always(function () {
                bizagi.util.smartphone.stopLoading();
            });

        return deferred.promise();
    },
    /*
    * Fetch Sum Data
    */
    fetchTotalData: function (params) {
        var self = this;
        var properties = self.properties;

        params = params || {};
        $.extend(params, {
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            contexttype: properties.contextType,
            idPageCache: properties.idPageCache,
            sort: properties.sort,
            page: 1,
            rows: self.properties.data.records,
            searchFilter: properties.searchFilter
        });

        // Check if a custom method has been given
        if (properties.overrideGetRemoteData) {
            var result = properties.overrideGetRemoteData(params);
            return result != null ? result.promise() : null;
        }

        // Default ajax call
        var defer = new $.Deferred();

        // Resolve with remote data
        self.dataService.multiaction().getGridData(params).done(function (data) {
            // Check RTL
            if (self.isRTL()) {
                data.rows = self.changeOrderData(data.rows);
            }

            defer.resolve(data);
        }).fail(function (fail) {

            defer.reject(fail);
        });

        return defer.promise();
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var grid = self.grid;

        // Remove changes for inline added rows
        if (self.properties.inlineAdd) {
            var omitKeys = grid.bizagi_grid_smartphone.hasOwnProperty("getNewRowKeys") ? grid.bizagi_grid_smartphone("getNewRowKeys") : [];
            for (var i = 0; i < omitKeys.length; i++) {
                if (self.changes[omitKeys[i]]) {
                    delete self.changes[omitKeys[i]];
                }
            }
        }

        self._super(renderValues);
    },

    onPageRequested: function (ui) {
        var self = this;
        var properties = self.properties;
        var data = {};

        if (!jQuery.isEmptyObject(data)) {

            self.dataService.submitData({
                action: "SUBMITDATA",
                data: data,
                idRender: properties.id,
                xpath: properties.xpath,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache
            });

        }

        self.fetchData(ui.page, ui.sortBy, ui.sortType);
    },

    onTotalData: function (ui) {

        var self = this;
        bizagi.util.smartphone.startLoading();

        var containerForm = self.getFormContainer();
        containerForm.saveForm();

        //defered que retorne la respuesta del servidor
        $.when(self.fetchTotalData()).done(function (data) {
            var rows = data.rows;
            //calcula los totalizadores y crea el html
            var showTotal = [];

            var columnsModel = self.buildColumnModel();
            var realPosition = 0; // inner count

            for (var i = 0; i < columnsModel.length; i++) {

                if (columnsModel[i].bizAgiProperties) {
                    var operationState = columnsModel[i].bizAgiProperties.totalize.operation;
                    var result = 0;
                    if (operationState == "sum") {
                        for (var j = 0; j < rows.length; j++) {
                            if (null != rows[j][i]) result += Number(rows[j][i]);
                        }
                    } else if (operationState == "count") {
                        for (var j = 0; j < rows.length; j++) {
                            if (null != rows[j][i]) result += 1;
                        }
                    } else if (operationState == "max") {
                        for (var j = 0; j < rows.length; j++) {
                            if (rows[j][i] > result) result = Number(rows[j][i]);
                        }
                    } else if (operationState == "min") {
                        var result = rows[0][i] || 0;
                        for (var j = 0; j < rows.length; j++) {
                            if (rows[j][i] < result) result = Number(rows[j][i]);
                        }
                    } else if (operationState == "avg") {
                        var countOperation = 0;
                        var columnTotal = 0;
                        for (var j = 0; j < rows.length; j++) {
                            if (rows[j][i]) {
                                countOperation += 1;
                                columnTotal += Number(rows[j][i]);
                                result = columnTotal / countOperation;
                                result = result.toFixed(0);
                            }
                        }
                    }
                    if (operationState) {
                        if (columnsModel[i].bizAgiProperties.type == "columnMoney" || columnsModel[i].bizAgiProperties.type == "Money") {
                            result = bizagi.util.formatMonetaryCell(result);
                        }

                        showTotal.push({ label: columnsModel[i].label, total: result });
                        realPosition++;
                    }
                }
            }

            self.showTotals(showTotal);
            bizagi.util.smartphone.stopLoading();
        }).fail(function (error) {
            bizagi.util.smartphone.stopLoading();
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-no-records"), "Error");
        });
    },

    showTotals: function (params) {
        var self = this;
        $(".bz-rn-grid-totalize-container").remove();

        var totalTmpl = kendo.template(self.renderFactory.getTemplate("bizagi.grid.totalizer"), { useWithBlock: false });
        var totalHtml = totalTmpl(params);

        //Creating modal view
        var modalViewTemplate = kendo.template(self.renderFactory.getTemplate('bizagi.grid.totalizer'), { useWithBlock: false });
        var modalView = $(bizagi.util.trim(modalViewTemplate($.extend(params, { "orientation": self.properties.orientation })))).clone();

        modalView.kendoMobileModalView({
            close: function () {
                this.destroy();
                this.element.remove();
            },
            useNativeScrolling: true
        });

        modalView.delegate(".bz-rn-grid-totalize-close-btn", "click", function () {
            modalView.data("kendoMobileModalView").close();
        });

        modalView.kendoMobileModalView("open");
    },
    /*
    *   Customizes the content drawing inside the cell
    */
    drawCell: function (column, key, value, isNewRow) {
        //revisar ya que en las demas implementacion en desktop y tablet utilizan una validacion para edicion en linea o no        
        var self = this;
        self.newRecords = {};

        if (column.key) {
            return value;
        }

        // Get render column
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];

        if (!self.cellMetadata[key]) self.cellMetadata[key] = {};
        if (!self.cellMetadata[key][columnIndex]) {
            self.cellMetadata[key][columnIndex] = {};
        }

        var properties = self.cellMetadata[key][columnIndex].properties || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        renderColumn.properties.displayType = 'normal';

        // Show editable cell when we are performing inline add operation
        if (isNewRow) editable = true;

        var cellOverride = self.getCellOverride(key, column.index - 1);

        if (cellOverride) {
            visible = cellOverride.visible;
            editable = (properties.editable) ? cellOverride.editable : false;
        }

        if (visible) {
            if (editable) {
                var defer = new $.Deferred();

                $.when(renderColumn.render(key, value)).done(function (cell) {

                    if (cell && $(cell).css("display") !== "none") {
                        var headerStyles = self.getHeaderStyles();

                        cell = cell.replace("headerStyles", headerStyles.header);
                        cell = cell.replace("headerLabelStyles", headerStyles.label);
                    }

                    // Register array with new records
                    if (!self.newRecords[key]) {
                        self.newRecords[key] = {};
                    }

                    for (var j = 0; j < self.columns.length; j++) {
                        self.cellOverrides[key] = self.cellOverrides[key] || {};
                        self.getCellOverride(key, j).visible = true;
                    }
                    renderColumn.getDecorated(key).bind("renderchange", function (render, args) {

                        var value = renderColumn.getValue(args.render.surrogateKey);
                        var compositeValue = renderColumn.getCompositeValue(args.render.surrogateKey);

                        if (renderColumn.properties.type == "columnDate") {
                            if (!bizagi.util.isEmpty(value)) {
                                var date = bizagi.util.dateFormatter.getDateFromInvariant(value, args.render.properties.showTime || false);
                                value = bizagi.util.dateFormatter.formatInvariant(date, true);
                            } else if (value === "") {
                                value = "";
                            }
                        }
                        self.collectGridChange($.extend(args, {
                            id: args.render.surrogateKey,
                            xpath: renderColumn.properties.xpath || renderColumn.properties.id,
                            value: value,
                            compositeValue: compositeValue,
                            columnIndex: renderColumn.columnIndex
                        }));

                        // Update change in grid's component data
                        self.grid.bizagi_grid_smartphone("changeCellValue", args.render.surrogateKey, renderColumn.columnIndex, value);

                        // If the column has totalizers then we need to refresh the summary
                        if (renderColumn.properties.totalize && renderColumn.properties.totalize.operation) {
                            self.grid.bizagi_grid_smartphone("refreshSummary", renderColumn.columnIndex);
                        }
                    });

                    defer.resolve(cell);
                });
                return defer.promise();
            } else {
                return renderColumn.renderReadOnly(key, value);
            }

        } else {
            return "";
        }
    },

    /*
    *   Executes when the cell is ready and inserted into the DOM
    */
    onCellReady: function (column, key, cell, isNewRow) {
        var self = this;

        // Get render column
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];
        var properties = ((self.cellMetadata[key][columnIndex] != undefined) ? self.cellMetadata[key][columnIndex].properties : undefined) || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        $(".bz-rn-messages", cell).toggleClass("bz-rn-messages", "bz-rn-messages-grid");

        // If the cell we are drawing is the summary cell, we need to make it readonly
        if (key == "summary") {
            editable = false;
        }

        // Show editable cell when we are performing inline add operation
        if (isNewRow) {
            editable = true;
        }

        if (visible) {
            if (editable) {
                // Set editable
                var originalEditable = renderColumn.properties.editable;
                renderColumn.properties.editable = editable;

                // Set xpath context for submitonchange action
                if (renderColumn.properties.submitOnChange) {
                    var control = renderColumn.getDecorated(key);
                    if (control) {
                        control.properties.submitOnChangexpathContext = self.properties.xpath + "[]";
                    }
                }


                // Execute cell post render
                renderColumn.postRender(key, cell);

                // Restore editable
                renderColumn.properties.editable = originalEditable;
            } else {

                if (renderColumn.properties.submitOnChange) {
                    var control = renderColumn.getDecorated(key);
                    if (control) {
                        control.properties.submitOnChangexpathContext = self.properties.xpath + "[]";
                    }
                }

                renderColumn.postRender(key, cell);
            }
        }
    },


    /**
    *  Adds a row to the grid
    */
    addRow: function () {
        var self = this;
        var properties = self.properties;

        var container = self.getFormContainer().container;
        var dataservice = self.dataService;
        var renderFactory = self.renderFactory;

        bizagi.util.smartphone.startLoading();

        $.when(self.submitAddRequest())
            .done(function (newid) {
                var recordXpath = properties.xpath + "[id=" + newid + "]";
                var propertiesGridForm = {
                    idRender: properties.id,
                    "recordXPath": recordXpath,
                    url: properties.addPage,
                    xpathContext: properties.xpathContext,
                    idPageCache: properties.idPageCache,
                    xpath: recordXpath,
                    editable: true,
                    requestedForm: "addForm",
                    displayName: properties.addLabel,
                    idAsigned: newid,
                    enableEditSubmitRequest: false,
                    hideLabel: true,
                    disableProcessButons: true
                };

                var argumentsfl = {
                    "renderFactory": self.renderFactory,
                    "dataService": dataservice,
                    "parent": self,
                    "data": {
                        properties: propertiesGridForm
                    }
                };

                var formlink = new bizagi.rendering.formLink(argumentsfl);

                jQuery.extend(formlink, {
                    contextEdit: $(container).find("#container-items-edit"),
                    element: self.element,
                    actionSave: self.actionSaveNewRow,
                    actionCancel: self.actionCancelRow,
                    _sendRelation: function () {
                        return true;
                    },
                    _getData: self.dataService.getFormData,
                    _params: propertiesGridForm
                });

                self._InternalRenderLinkForm(formlink);
                bizagi.util.smartphone.stopLoading();
            }).fail(function (error) {
                bizagi.util.smartphone.stopLoading();
                bizagi.showMessageBox(bizagi.localization.getResource("render-grid-no-records"), "Error");
            });

    },
    /* edit form in the grid*/
    editRow: function (id) {
        var self = this;

        //save form in case the user has made changes in the inline row
        var containerForm = self.getFormContainer();
        containerForm.saveForm();

        var properties = self.properties;
        var container = self.getFormContainer().container;
        var dataservice = self.dataService;
        var renderFactory = self.renderFactory;

        var recordXpath = properties.xpath + "[id=" + id + "]";

        var propertiesGridForm = {
            idRender: properties.id,
            id: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            recordXPath: recordXpath,
            xpath: recordXpath,
            editable: true,
            url: properties.editPage,
            requestedForm: "editForm",
            displayName: properties.editLabel,
            idAsigned: id,
            disableProcessButons: true
        };

        var argumentsfl = {
            "renderFactory": self.renderFactory,
            "dataService": dataservice,
            "parent": self,
            "data": {
                properties: propertiesGridForm
            }
        };

        var formlink = new bizagi.rendering.formLink(argumentsfl);

        jQuery.extend(formlink, {
            contextEdit: $(container).find("#container-items-edit"),
            element: self.element,
            //disable if you want only save at the end (submit the form)
            actionSave: self.actionSaveNewRow,
            actionCancel: self.actionCancelRow,
            _sendRelation: formlink.submitEditRequest,
            _getData: self.dataService.getFormData,
            _params: propertiesGridForm
        });

        self._InternalRenderLinkForm(formlink);

    },
    _InternalRenderLinkForm: function (formlink) {
        var self = this;
        $.when(formlink.renderEdition()).done(
            function () {
                formlink.endLoading();

            }
        );
    },


    /**
    *  Deletes  a row to the grid
    */
    deleteRow: function (id) {
        var self = this;
        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
            .done(function () {
                // Do a grid record deletion
                $.when(self.submitDeleteRequest(id))
                    .done(function (data) {
                        // Reload grid
                        self.fetchData();
                        if (data.type == "success") {
                            // Trigger the event
                            //'key' must be included to trigger a single call to actions and validations
                            //line 310 bizagi.command.controllers.action
                            self.triggerRenderChange({ rowDeleted: true, changed: false, key: id });
                        }
                    });
            });
    },

    actionCancelRow: function () {
        var self = this;
        var deferred = $.Deferred();

        $.when(self.submitRollbackRequest()).done(function () {
            deferred.resolve();
        });

        return deferred.promise();
    },

    actionSaveNewRow: function () {
        var self = this;
        var properties = self.properties;
        var deferred = $.Deferred();
        var data = {};

        if (self.form.validateForm() === true) {
            $.when(
                self.form.collectRenderValues(data),
                data.idPageCache = self.form.getPageCache()
            ).then(function () {
                $.when(
                    self.parent.submitSaveRequest(properties.idAsigned, data)).done(function (resp) {
                        if (resp.type == "validationMessages") {
                            self.form.addValidationMessage(resp.messages);
                            properties.submitOnChange = false;
                            deferred.reject(resp.messages);
                        } else {
                            self.parent.fetchData();
                            if (!properties.submitOnChange) {
                                properties.submitOnChange = true;
                            }
                            self.submitOnChange({}, true);
                            deferred.resolve();
                        }
                    });

            });
        } else {
            deferred.reject({ noAction: true });
        }

        return deferred.promise();
    },

    applyActionUpdateGrid: function (column, context) {
        var self = context;
        var properties = self.properties;
        var originalMethod = column.decorated.actionSave;

        jQuery.extend(column.decorated, {
            actionSave: function () {
                var selfIntern = this;
                $.when(originalMethod.apply(selfIntern, arguments)).done(function () {
                    var data = {};
                    self.collectRenderValues(data);

                    $.when(self.submitSaveRequest(selfIntern.surrogateKey, data)).done(function () {
                        self.fetchData();
                    });
                });
            }
        });
    },


    collectRenderValues: function (renderValues) {
        var self = this;

        $.each(self.columns, function (i, child) {
            child = child.decorated;
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                // Go though container
                child.collectRenderValues(renderValues);
            } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                // Check if the render can be sent to the server
                if (child.canBeSent()) {
                    child.collectData(renderValues);
                }
            }
        });
    },

    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function () {
        var self = this;
        var parentPromise = self._super();
        var inlineAddPromise = self.inlineAddDeferred ? self.inlineAddDeferred.promise() : null;

        return $.when(parentPromise, inlineAddPromise);
    },

    /*   Sets an error on the cell
    */
    setError: function (key, xpath) {
        var self = this;
    },

    /*
    *  Changes the required for cell
    */
    changeCellValue: function (key, xpath, argument) {
        var self = this;

        var control = self.getControlCell(key, xpath);
        if (control) {
            if (argument != null)
                control.setDisplayValue(argument);

            //ISUPP 3866
            var _value = control.column.getValue(key);
            var compositeValue = control.column.getCompositeValue(key);

            if (argument != null)
                control.setDisplayValue(argument);

            var trigger = false;
            self.collectGridChange({ id: key, xpath: xpath, value: _value, compositeValue: compositeValue, columnIndex: control.column, trigger: trigger });
        }
    },

    changeCellBackgroundColor: function (key, xpath, argument) {
        var self = this;

        var control = self.getControlCell(key, xpath);
        if (control) {
            control.changeCellBackgroundColor(argument);

            // Exclusive for complex elements such as checkboxes, and list
            if (control.element) {
                control.element.find(".bz-container-render-cell1, .ui-bizagi-render-control").css({
                    "background-color": argument,
                    "background-image": argument
                });
            }
        }
    },
    /*
    *   Changes the background for a cell
    */
    changeCellColor: function (key, xpath, argument) {
        var self = this;

        var control = self.getControlCell(key, xpath);
        if (control)
            control.changeCellColor(argument);

    },
    /*
    *   Changes the visibility for a cell
    */
    changeCellVisibility: function (key, xpath, argument) {
        var self = this;

        var control = self.getControlCell(key, xpath);
        if (control) {
            control.changeCellVisibility(argument);
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    break;
                }
            }

            self.cellOverrides[key] = self.cellOverrides[key] || {};
            self.getCellOverride(key, j).visible = argument;
        }

    },

    /*
    *   Changes the editability for a cell
    */
    changeCellEditability: function (key, xpath, argument) {
        var self = this;
        var control = self.getControlCell(key, xpath);

        if (control) {
            control.changeEditability(argument);
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    break;
                }
            }

            self.cellOverrides[key] = self.cellOverrides[key] || {};
            self.getCellOverride(key, j).editable = argument;
        }
    },

    cleanCellData: function (key, xpath) {
        var self = this;
        var control = self.getControlCell(key, xpath);

        if (control) {
            control.cleanData();
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    break;
                }
            }

            var rows = self.properties.data.rows, i = 0, rowLength = rows.length;
            for (; i < rowLength; i++) {
                if (Number(key) === rows[i][0]) {
                    rows[i][j + 1] = [["", ""]];
                    break;
                }
            }
            self.cellOverrides[key] = self.cellOverrides[key] || {};
            self.getCellOverride(key, j).value = null;
        }
    },

    /**
     * Triggers the grid plugin event
     * @returns {} 
     */
    triggerGridPluginHandler: function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 0);

        return self.grid.bizagi_grid_smartphone.apply(self.grid, args);
    }
});