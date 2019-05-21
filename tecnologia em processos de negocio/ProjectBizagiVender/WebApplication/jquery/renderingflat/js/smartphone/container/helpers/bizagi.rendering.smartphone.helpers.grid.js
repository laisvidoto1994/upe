/*
 *   Name: Bizagi smartphone view form implementation
 *   Author: Richar Urbano <Richar.Urbano@Bizagi.com>
 *   Comments:
 *   -   Serves as a view form that can render a inner grid form
 */
bizagi.rendering.grid.extend('bizagi.rendering.smartphone.helpers.grid', {
    GRID_PAGE_SIZE: 10
}, {

    /**
     * init
     * @param {} params 
     * @returns {} 
     */
    init: function (params) {
        var self = this;
        var data = params.data;

        if (typeof (params.pane) !== "undefined") {
            self.pane = params.pane;
            //self.pane = params.pane.data("kendoMobilePane");
        } else {
            console.warn("Es necesario asignar un pane a la forma {pane: $pane} para evitar problemas de navegación entre vistas de Kendo");
        }

        // Create a single instance for each cell
        data.properties.singleInstance = false;

        // Call base
        self._super(params);

        // Create a data-structure to keep track of each cell properties
        self.cellMetadata = {};

        // Fill default properties
        var properties = self.properties;
        //var form = self.getFormContainer();

        // Just apply display-type: vertical, align it to the left
        properties.displayType = "vertical";
        properties.labelAlign = "left";

        // Editable property
        // Revisar base para mejorar comportamiento cuando esta en false los elementos
        $.each(self.columns, function (index, value) {
            if (self.properties && self.properties.editable) {
                self.properties.editable = (properties.allowEdit === true) ? true : false;
            }
        });

        // Create container & Render template
        var template = self.getViewTemplate();
        self.gridView = $(self.applyTemplate(template));
        self.pane.append(self.gridView);

        // <stretch> If set to true, the view will stretch its child contents to occupy the entire view, 
        // while disabling kinetic scrolling. Useful if the view contains an image or a map.
        // <useNativeScrolling> If set to true, the view will use the native scrolling available in the current platform
        self.view = new kendo.mobile.ui.View(self.gridView,
        {
            'useNativeScrolling': false,
            stretch: true,
            init: function () {
                self.attachHandlers();
            }

        });

        self.scrollContent = $("#" + bizagi.util.encodeXpath(properties.xpath), self.view.contentElement());
    },

    /**
     * Update or init the element data
     * @param {} data 
     * @returns {} 
     */
    initializeData: function (data) {
        var self = this;

        // Create a single instance for each cell
        data.properties.singleInstance = false;

        // Call base
        self._super(data);
    },

    /**
     * Returns the view template to be used
     * @returns {} 
     */
    getViewTemplate: function () {
        return this.renderFactory.getTemplate("grid-view");
    },

    /**
     * Applies the template to the render and returns the resolved element
     * @param {} template 
     * @returns {} 
     */
    applyTemplate: function(template) {
        var self = this;
        var properties = self.properties;

        // id + other column
        var allowFilter = self.columns.length > 2;

        // Localstorage filter
        bizagi.util.removeItemLocalStorage("grid.filter." + properties.id);
        bizagi.util.setItemLocalStorage("grid.filter." + properties.id, null);

        return $.fasttmpl(template, {
            id: bizagi.util.encodeXpath(properties.xpath),
            title: properties.displayName,
            allowAdd: properties.allowAdd,
            allowFilter: allowFilter
        });
    },

    /**
     * Method to attach any handler to the view
     * @returns {} 
     */
    attachHandlers: function () {
        var self = this;

        $(".bz-rn-view-options", self.gridView).on("click", function (evt) {
            evt.stopPropagation();

            self.processAction($(this).attr("data-action"));
        });
    },

    /**
     *  Process an action in order to do something with the view
     * @param {} action 
     * @param {} params 
     * @returns {} 
     */
    processAction: function (action, params) {
        var self = this;

        if (action === "close") {
            self.onClose();
        }

        if (action === "add") {
            self.addRow();
        }

        if (action === "filter") {
            self.onFilterRow();
        }
    },

    /**
    * Go back and destroy
    * @returns {} 
    */
    onClose: function () {
        var self = this;
        var properties = self.properties;

        // Localstorage filter
        bizagi.util.removeItemLocalStorage("grid.filter." + properties.id);

        self.pane.data("kendoMobilePane").navigate("#:back");
        self.view.destroy();
        self.view.element.remove();
    },

    onFilterRow: function() {
        var self = this;

        var title = "Column settings";
        var action = "FILTER";
        var modalTemplate = self.renderFactory.getTemplate("grid-modal-filter");
        var columnFilter = self.buildColumnFilter();

        // bizagi.util.encodeXpath(self.properties.xpath) + "_" +self.properties.id
        var modalFilterTemplate = kendo.template(modalTemplate, { useWithBlock: false });
        var modalFilter = $(modalFilterTemplate({ list: columnFilter, title: title, action: action }).trim());

        modalFilter.kendoMobileModalView({
            close: function() {
                this.destroy();
                this.element.remove();
            },
            useNativeScrolling: true,
            modal: false
        });

        self.attachModalFilterHandlers(modalFilter);

        modalFilter.kendoMobileModalView("open");
    },

    /**
     * Creates the column filter
     * @returns {} 
     */
    buildColumnFilter: function() {
        var self = this;
        var properties = self.properties;
        var columnFilter = [];

        // Localstorage filter        
        var localstorage = bizagi.util.getItemLocalStorage("grid.filter." + properties.id) ? JSON.parse(bizagi.util.getItemLocalStorage("grid.filter." + properties.id)) : null;
        var columns = localstorage ? localstorage : self.buildColumns;

        $.each(columns, function(index, column) {
            if (!column.key && !column.hidden) {
                column.active = typeof (column.active) !== "undefined" ? column.active : true;
                columnFilter.push(column);
            }
        });

        bizagi.util.setItemLocalStorage("grid.filter." + properties.id, JSON.stringify(columnFilter));

        return columnFilter;
    },

    /**
     * Attach events to modalview
     * @param {} modalContainer 
     * @returns {} 
     */
    attachModalFilterHandlers: function(modalContainer) {
        var self = this;
        var properties = self.properties;

        var modalListContainer = modalContainer.find(".bz-rn-modal-filter-content-list");

        // Close modalview
        modalContainer.on("click", ".bz-rn-modal-filter-header-title-cancel", function() {
            modalContainer.kendoMobileModalView("close");
        });

        modalContainer.on("click", ".bz-rn-modal-filter-footer-action", function() {
            var localstorage = bizagi.util.getItemLocalStorage("grid.filter." + properties.id) ? JSON.parse(bizagi.util.getItemLocalStorage("grid.filter." + properties.id)) : null;
            //bizagi.util.setItemLocalStorage("grid.filter." + properties.id, JSON.stringify(columnFilter));

            //var items = modalListContainer.find("input:checkbox:checked");
            var showHeaders = modalListContainer.find("input").map(function() {
                var that = this;
                return { index: $(that).data("index"), active: that.checked };
            });

            $.each(showHeaders, function(index, item) {
                var cssIndex = item.index + 1;

                localstorage[index].active = item.active;

                var tags = $(".bz-rn-grid-table th:nth-child(" + cssIndex + "), .bz-rn-grid-table td:nth-child(" + cssIndex + ")");
                if (item.active) {
                    tags.show();
                } else {
                    tags.hide();
                }
            });

            bizagi.util.setItemLocalStorage("grid.filter." + properties.id, JSON.stringify(localstorage));
            modalContainer.kendoMobileModalView("close");
        });

        modalListContainer.on("click", "input", function() {
            var that = this;

            if (modalListContainer.find("input:checkbox:checked").length > 0) {
                var radioSelected = $(that).is(":checked");

                radioSelected ?
                    $(that).removeClass("bz-full-ball").addClass("bz-check") :
                    $(that).addClass("bz-full-ball").removeClass("bz-check");
            } else {
                $(that).prop("checked", true);
            }
        });
    },

    /* RENDERS GRID
     =====================================================*/

    /**
     * postRenderSingle
     * @returns {} 
     */
    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        container.addClass("bz-command-edit-inline");

        if (self.properties.helpText !== "") {
            control.addClass("bz-rn-grid-contains-help-text");
        }

        // Hide the standar label        
        self.getContainerRender().find(".ui-bizagi-label").hide();
        self.getArrowContainer().hide();

        // Call base 
        self._super();

        // Apply plugin
        self.applyGridPlugin();

        // Set initial data
        properties.skipInitialLoad = properties.skipInitialLoad || false;

        if (!properties.skipInitialLoad) {
            if (properties.data) {
                if (properties.data === "" || (properties.data.rows).length === 0 && properties.data.page > 1) {
                    self.fetchData(undefined, self.sortBy, self.sortType);
                } else {
                    self.updateData(properties.data);

                    // Trigger change in order to start up the actions when the controls is ready
                    $.when(self.ready())
                        .done(function () {
                            self.triggerRenderChange({ changed: false });
                            self.pane.data("kendoMobilePane").navigate(self.view.id);

                            self.configureHeaderAndFooterFixed();
                            self.attachScrollHandler();

                            self.endLoading();

                        });
                }
            } else {
                self.fetchData(properties.page, properties.sortBy, properties.sortOrder);
            }
        }
    },

    /**
      * Method to attach any handler to the Scroller
      * @returns {} 
      */
    attachScrollHandler: function () {
        var self = this;
        var properties = self.properties;

        if (properties.data && properties.data.records === 0) return;

        var scrollLeft = 0;
        var scrollTop = 0;

        var scroller = self.view.content.find(".bz-rn-grid-scroll-content").data("kendoMobileScroller");

        if (scroller) {
            scroller.reset();
        }

        var tableLeft = self.view.content.find(".left-table").get(0);
        var scrollHeader = self.view.content.find(".bz-rn-grid-scroll-header").get(0);

        scroller.bind("scroll", function (event) {
            var left = event.scrollLeft;
            var top = event.scrollTop;

            if (left !== scrollLeft) {
                var transformLeft = "translateX(" + (left) * (-1) + "px)";
                scrollHeader.style.transform = transformLeft;
                scrollHeader.style.webkitTransform = transformLeft;
                scrollHeader.style.OTransform = transformLeft;

                scrollLeft = left;
            }

            if (top !== scrollTop) {
                var transformTop = "translateY(" + (top) * (-1) + "px)";;
                tableLeft.style.transform = transformTop;
                tableLeft.style.webkitTransform = transformTop;
                tableLeft.style.OTransform = transformTop;

                scrollTop = top;                
            }
        });
    },

    /**
     * configureFixedHeaders
     * @returns {} 
     */
    configureHeaderAndFooterFixed: function () {
        var self = this;

        var pivot;
        var i = -1;
        var properties = self.properties;

        if (properties.data && properties.data.records === 0) return;

        var tbody = self.scrollContent.find(".bz-rn-grid-body");
        var cols = $("tr:first-child td", tbody);
        var colgroup = $("<colgroup></colgroup>");

        while (pivot = cols[++i]) {
            var col = document.createElement("col");
            col.style.width = pivot.offsetWidth + "px";
            colgroup.append(col);
        }

        var rows = $("tr", tbody) ? $("tr", tbody).length : 0;
        var tbodyLeftTable = $("<table class='left-table'>");

        for (var j = 0; j < rows; j++) {
            var row = $("<tr><td>" + (j + 1) + "</td></tr>");
            tbodyLeftTable.append(row);
        }

        // Clean content
        self.view.content.find(".bz-rn-grid-counter-column").empty();
        self.view.content.find(".bz-rn-grid-scroll-header").empty();

        // Column counter
        self.view.content.find(".bz-rn-grid-counter-column").append(tbodyLeftTable);

        // Column group
        self.view.content.find(".bz-rn-grid-table").prepend(colgroup.clone());

        // Header              
        var header = self.scrollContent.find(".bz-rn-grid-header");
        self.view.content.find(".bz-rn-grid-scroll-header")
            .append($("<table class='bz-rn-grid-table'></table>")
                .append(colgroup).append(header));

        // Footer        
        self.view.footer.empty();
        var pager = self.scrollContent.find(".bz-rn-grid-container-pager");
        self.view.footer.append(pager);
    },

    /**
     * Render the grid
     * @returns {} 
     */
    applyGridPlugin: function () {
        var self = this;
        var properties = self.properties;        
        var scrollContainer = self.view.content.find(".bz-rn-grid-scroll-content").data("kendoMobileScroller");

        self.buildColumns = self.buildColumnModel();

        self.currentGrid = $(scrollContainer.scrollElement).mobileGrid({
            columns: self.buildColumns,
            title: properties.displayName,
            mode: self.getMode(),
            sortBy: properties.sortBy || "",
            sortOrder: properties.sortOrder || "",
            sortType: bizagi.override.gridDefaultSortBy || "asc",
            template: {
                grid: self.renderFactory.getTemplate("grid"),
                table: self.renderFactory.getTemplate("grid-table"),
                emptyTable: self.renderFactory.getTemplate("grid-table-empty"),
                column: self.renderFactory.getTemplate("grid-table-column"),
                specialColumn: self.renderFactory.getTemplate("grid-table-column-special"),
                row: self.renderFactory.getTemplate("grid-table-row"),
                cell: self.renderFactory.getTemplate("grid-table-cell"),
                specialCell: self.renderFactory.getTemplate("grid-table-cell-special"),
                pager: self.renderFactory.getTemplate("grid-table-pager"),
                waiting: ""
            },
            actions: {
                add: properties.allowAdd,
                edit: properties.allowEdit && properties.withEditForm,
                remove: properties.allowDelete,
                details: properties.allowDetail
            },
            tooltips: {
                addLabel: $.trim(bizagi.localization.getResource("render-grid-add-label")), //properties.addLabel,
                editLabel: $.trim(bizagi.localization.getResource("render-grid-edit-label")), //properties.editLabel,
                deleteLabel: $.trim(bizagi.localization.getResource("render-ecm-confirm-bt-delete")), //properties.deleteLabel,
                detailLabel: $.trim(bizagi.localization.getResource("render-collection-navigator-details-form")), //properties.detailLabel
            },
            drawCell: function (params) {
                return self.drawCell(params.column, params.key, params.value, params.isNewRow);
            },
            cellReady: function (params) {
                return self.onCellReady(params.column, params.key, params.cell, params.isNewRow);
            },
            rowSelected: function (params) {
                self.rowSelected(params.key);
            },
            rowUnselected: function (params) {
                self.rowUnselected(params.key);
            },
            editRow: function (params) {
                self.editRow(params.key);
            },
            deleteRow: function (params) {
                self.deleteRow(params.key);
            },
            showFormDetails: function (params) {
                self.showFormDetails(params.key);
            },
            pageRequested: function (params) {
                self.pageRequested(params);
            },
            sortRequested: function (params) {
                self.fetchData(params.page, params.sortBy, params.sortType);
            }
        });
    },

    /*
  *   Triggers the grid plugin event
  */
    triggerGridPluginHandler: function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 0);
        //return self.grid.apply(self.grid, args);
    },

    /**
     * rowSelected
     * @param {} key 
     * @returns {} 
     */
    rowSelected: function (key) {
        var self = this;
        var grid = self.currentGrid;
        var element = grid.getContainer();

        // Add selected style to row
        var rowSeleted = element.find("[data-bizagi-component=rows] tr[data-key=" + key + "]");
        rowSeleted.addClass("bz-rn-grid-state-selected");        
    },

    /**
     * rowUnselected
     * @param {} key 
     * @returns {} 
     */
    rowUnselected: function (key) {
        var self = this;
        var grid = self.currentGrid;
        var element = grid.getContainer();

        var tr = element.find("[data-bizagi-component=rows] tr[data-key=" + key + "]");
        tr.removeClass("bz-rn-grid-state-selected");        
    },

    /**
     * Method overrrides from base or virtual
     * @param {} value 
     * @returns {} 
     */
    setDisplayValue: function (value) { },

    /**
     * setDisplayValueEdit
     * @param {} value 
     * @returns {} 
     */
    setDisplayValueEdit: function (value) { },

    /**
     * actionSave
     * @returns {} 
     */
    actionSave: function () { },

    /**
     * Updates manually the affected cell 
     * @returns {} 
     */
    updateAffectedCellManually: function () { },

    /**
     * Get the row index using the key as a reference
     * @returns {} 
     */
    getRowIndexByKey: function () { },

    /**
     * Shows more info about a grid row in smartphones not implemented
     * @param {} id 
     * @returns {} 
     */
    showMore: function (id) { },

    /**
     * getHeaderStyles
     * @returns {} 
     */
    getHeaderStyles: function () { },

    /**
     * Creates the column model required to initialize the grid plugin
     * @returns {} 
     */
    buildColumnModel: function () {
        var self = this;
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
     * @returns {} 
     */
    refresh: function () {
        var self = this;
        var deferred = $.Deferred();

        $.when(self.fetchData()).done(function () {
            deferred.resolve();
        });

        return deferred.promise();
    },

    /**
     * Holds the execution until the grid data is ready after a load operation
     * @returns {} 
     */
    dataReady: function () {
        var self = this;

        return self.dataReadyDeferred != null ? self.dataReadyDeferred.promise() : null;
    },

    /**
     * Method to set data and update the grid
     * @param {} data 
     * @returns {} 
     */
    updateData: function (data) {
        var self = this;
        var grid = self.currentGrid;

        if (!data.records || (data.records && data.records === 0)) {
            self.view.content.find(".bz-rn-grid-top-content, .bz-rn-grid-counter-column").hide();
            self.view.content.find(".bz-rn-grid-scroll-content").css("width", "100%");
        } else {
            if (self.view.content.find(".bz-rn-grid-top-content").css("display") === "none") {
                self.view.content.find(".bz-rn-grid-top-content, .bz-rn-grid-counter-column").show();
            }
        }

        // Set value in control
        if (data && self.properties) {
            self.properties.data = data;
            self.setCellOverrides(data);
            grid.setData(data);
        }
    },

    /**
     * Method to fetch data from the server and then update the data
     * @param {} page 
     * @param {} sortBy 
     * @param {} sortType 
     * @returns {} 
     */
    fetchData: function (page, sortBy, sortType) {
        var self = this;
        var properties = self.properties;

        self.dataReadyDeferred = $.Deferred();
        self.sortBy = sortBy;
        self.sortType = sortType;

        // Define defaults
        page = page || 1;
        sortBy = sortBy || (properties.sortBy || "id");
        sortType = sortType || (properties.sortOrder || "asc");

        // Update control properties
        properties.page = page;
        properties.sortBy = sortBy;
        properties.sortType = sortType;
        properties.sort = sortBy + " " + sortType;

        // Start loading to avoid multiple calls to the server
        self.startLoading();

        $.when(self.getRemoteData())
            .then(function (data) {
                self.endLoading();

                if (data) {
                    if (data.deviceMaxRecordsExceeded) {
                        bizagi.showMessageBox(bizagi.localization.getResource("render-search-maximum-records-allowed"));
                        self.dataReadyDeferred.resolve();
                    } else {
                        $.when(self.updateData(data))
                            .done(function () {
                                // Attach handlers                                
                                self.configureHeaderAndFooterFixed();
                                self.attachScrollHandler();

                                self.triggerRenderChange({ changed: false });
                                self.dataReadyDeferred.resolve();
                            });
                    }
                }
            });

        return self.dataReadyDeferred.promise();
    },

    /**
     * Fetch Sum Data
     * @param {} params 
     * @returns {} 
     */
    fetchTotalData: function (params) {
    },

    /**
     * Add the render data to the given collection in order to send data to the server
     * @param {} renderValues 
     * @returns {} 
     */
    collectData: function (renderValues) { },

    /**
     * onPageRequested
     * @param {} ui 
     * @returns {} 
     */
    pageRequested: function (params) {
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

        self.fetchData(params.page, params.sortBy, params.sortType);
    },

    /**
     * onTotalData
     * @param {} ui 
     * @returns {} 
     */
    onTotalData: function (ui) { },

    /**
     * showTotals
     * @param {} params 
     * @returns {} 
     */
    showTotals: function (params) { },

    /**
     *  Customizes the content drawing inside the cell
     * @param {} column 
     * @param {} key 
     * @param {} value 
     * @param {} isNewRow 
     * @returns {} 
     */
    drawCell: function (column, key, value, isNewRow) {
        var self = this;

        if (column.key) return value;

        self.newRecords = self.newRecords || {};

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

        // Not display
        properties.editable = false;
        renderColumn.properties.displayType = 'value';

        renderColumn.setValue(key, value);
        renderColumn.setSurrogateKey(key);

        if (visible) {
            var defer = new $.Deferred();
            renderColumn.properties = properties;

            $.when(renderColumn.renderReadOnly(key, value)).done(function (cell) {
                // Register array with new records              
                for (var j = 0; j < self.columns.length; j++) {
                    self.cellOverrides[key] = self.cellOverrides[key] || {};
                    self.getCellOverride(key, j).visible = true;
                }
                defer.resolve(cell);
            });

            return defer.promise();

        } else {
            return "";
        }
    },

    /**
     * Executes when the cell is ready and inserted into the DOM
     * @param {} column 
     * @param {} key 
     * @param {} cell 
     * @param {} isNewRow 
     * @returns {} 
     */
    onCellReady: function (column, key, cell, isNewRow) {
        var self = this;

        // Get render column
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];
        var properties = ((self.cellMetadata[key][columnIndex] != undefined) ? self.cellMetadata[key][columnIndex].properties : undefined) || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        // Show editable cell when we are performing inline add operation
        if (isNewRow) {
            editable = true;
        } else {
            editable = false;
        }

        if (visible) {
            var control;
            if (editable) {
                // Set editable
                var originalEditable = renderColumn.properties.editable;
                renderColumn.properties.editable = editable;

                // Set xpath context for submitonchange action
                if (renderColumn.properties.submitOnChange) {
                    control = renderColumn.getDecorated(key);
                    if (control) {
                        control.properties.submitOnChangexpathContext = self.properties.xpath + "[]";
                    }
                }

                // Execute cell post render
                renderColumn.postRender(key, cell);

                // Restore editable
                renderColumn.properties.editable = originalEditable;
            } else {
                renderColumn.postRenderReadOnly(key, cell);
            }
        }
    },

    /**
    * Returns a promise that will resolve when the element is ready
    * @returns {} 
    */
    ready: function () {
        var self = this;
        var parentPromise = self._super();

        return $.when(parentPromise);
    },

    /**
     * Adds a row to the grid
     * @returns {} 
     */
    addRow: function () {
        var self = this;
        var properties = self.properties;

        var container = self.getFormContainer().container;
        var dataservice = self.dataService;
        var renderFactory = self.renderFactory;

        self.startLoading();

        $.when(self.submitAddRequest())
            .done(function (newId) {
                var recordXpath = properties.xpath + "[id=" + newId + "]";

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
                    idAsigned: newId,
                    enableEditSubmitRequest: false,
                    hideLabel: true,
                    withAddForm: true
                };

                var argumentsGrid = {
                    "renderFactory": renderFactory,
                    "dataService": dataservice,
                    "parent": self,
                    "data": {
                        properties: propertiesGridForm
                    }
                };

                var formlink = new bizagi.rendering.formLink(argumentsGrid);

                $.extend(formlink, {
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
                self.endLoading();

            }).fail(function (error) {
                self.endLoading();
                bizagi.showMessageBox(bizagi.localization.getResource("render-grid-no-records"), "Error");
            });
    },

    /**
     * Edit form in the grid
     * @param {} id 
     * @returns {} 
     */
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
            idAsigned: id
        };

        var argumentsGrid = {
            "renderFactory": renderFactory,
            "dataService": dataservice,
            "parent": self,
            "data": {
                properties: propertiesGridForm
            }
        };

        var formlink = new bizagi.rendering.formLink(argumentsGrid);

        $.extend(formlink, {
            contextEdit: $(container).find("#container-items-edit"),
            element: self.element,
            actionSave: self.actionSaveNewRow,
            actionCancel: self.actionCancelRow,
            _sendRelation: formlink.submitEditRequest,
            _getData: self.dataService.getFormData,
            _params: propertiesGridForm
        });

        self._InternalRenderLinkForm(formlink);
    },

    /**
     * Deletes  a row to the grid
     * @param {} id 
     * @returns {} 
     */
    deleteRow: function (id) {
        var self = this;

        if (id === 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
            .done(function () {
                //Do a grid record deletion
                $.when(self.submitDeleteRequest(id))
                    .done(function (data) {
                        // Reload grid
                        self.fetchData();

                        if (data.type === "success") {
                            // Trigger the event
                            //'key' must be included to trigger a single call to actions and validations
                            self.triggerRenderChange({ rowDeleted: true, changed: false, key: id });
                        }
                    });
            });
    },

    /**
     * Details form in the grid
     * @param {} id 
     * @returns {} 
     */
    showFormDetails: function (id) {
        var self = this;

        if (id === 0 || id == undefined) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        //save form in case the user has made changes in the inline row
        //var containerForm = self.getFormContainer();
        //containerForm.saveForm();

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
            editable: false,
            url: properties.editPage,
            requestedForm: "detailForm",
            displayName: properties.detailLabel,
            idAsigned: id,
            hideSaveButton: true
        };

        var argumentsGrid = {
            "renderFactory": renderFactory,
            "dataService": dataservice,
            "parent": self,
            "data": {
                properties: propertiesGridForm
            }
        };

        var formlink = new bizagi.rendering.formLink(argumentsGrid);

        $.extend(formlink, {
            contextEdit: $(container).find("#container-items-edit"),
            element: self.element,
            //disable if you want only save at the end (submit the form)
            //actionCancel: self.actionCancelRow,
            _sendRelation: formlink.submitEditRequest,
            _getData: self.dataService.getFormData,
            _params: propertiesGridForm
        });

        self._InternalRenderLinkForm(formlink);
    },

    /**
     * actionCancelRow
     * @returns {} 
     */
    actionCancelRow: function () {
        var self = this;
        var deferred = $.Deferred();

        $.when(self.submitRollbackRequest()).done(function () {
            deferred.resolve();
        });

        return deferred.promise();
    },

    /**
     * actionSaveNewRow
     * @returns {} 
     */
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

    /**
     * _InternalRenderLinkForm
     * @param {} formlink 
     * @returns {} 
     */
    _InternalRenderLinkForm: function (formlink) {
        var self = this;

        $.when(formlink.renderEdition()).done(
            function () {
                formlink.endLoading();
                formlink.postRenderEdit();

                formlink.form.one("refresh", function (_, refreshParams) {
                    if (formlink.kendoView) {
                        var id = formlink.kendoView.data("kendoMobileView").id;
                        if (id.substring(1, id.length) === kendo.history.current) {
                            refresh.apply(self);
                        } else {
                            formlink.kendoView.data("kendoMobileView").bind("afterShow", refresh.bind(self));
                        }

                        function refresh() {
                            self = this;
                            bizagi.kendoMobileApplication.navigate("#:back");
                            formlink.kendoView.data("kendoMobileView").destroy();
                            self._InternalRenderLinkForm(formlink);
                        }
                    }
                });
            }
        );
    },

    /**
     * applyActionUpdateGrid
     * @param {} column 
     * @param {} context 
     * @returns {} 
     */
    applyActionUpdateGrid: function (column, context) { },

    /**
     * collectRenderValues
     * @param {} renderValues 
     * @returns {} 
     */
    collectRenderValues: function (renderValues) { },


    /*   Sets an error on the cell
    */
    setError: function (key, xpath) { },

    /**
     * Changes the required for cell
     * @param {} key 
     * @param {} xpath 
     * @param {} argument 
     * @returns {} 
     */
    changeCellValue: function (key, xpath, argument) { },

    /**
     * Changes the background for a cell
     * @param {} key 
     * @param {} xpath 
     * @param {} argument 
     * @returns {} 
     */
    changeCellBackgroundColor: function (key, xpath, argument) { },

    /**
     *  Changes the background for a cell
     * @param {} key 
     * @param {} xpath 
     * @param {} argument 
     * @returns {} 
     */
    changeCellColor: function (key, xpath, argument) { },

    /**
     *  Changes the visibility for a cell
     * @param {} key 
     * @param {} xpath 
     * @param {} argument 
     * @returns {} 
     */
    changeCellVisibility: function (key, xpath, argument) { },

    /**
     *  Changes the editability for a cell
     * @param {} key 
     * @param {} xpath 
     * @param {} argument 
     * @returns {} 
     */
    changeCellEditability: function (key, xpath, argument) { },

    /**
     * cleanCellData
     * @param {} key 
     * @param {} xpath 
     * @returns {} 
     */
    cleanCellData: function (key, xpath) { },

    /**
     * Method to start loading for ajax data and update the ui
     * @param {} bUseTimeout 
     * @returns {} 
     */
    startLoading: function () {
        bizagiLoader().start();
    },

    /**
     * Method to remove the loading message
     * @returns {} 
     */
    endLoading: function () {
        bizagiLoader().stop();
    }
});