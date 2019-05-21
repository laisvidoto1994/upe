/*
* jQuery BizAgi Render Grid Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*   jquery.form.js
*   grid.base.js
*   grid.common.js
*   jquery.fmatter.js
*   grid.grouping.js
*   grid.formEdit.js
*   grid.jqueryui.js
*   grid.locale-XX.js
*	bizagi.util.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    var BIZAGI_GRID_DATA_HANDLER = "ajax/AjaxGridHandler.aspx";
    var BIZAGI_GRID_INLINE_SAVE_HANDLER = "ajax/AjaxGridHandler.aspx";
    var BIZAGI_GRID_ADD_PAGE = "misc/GridAdd.html"
    var BIZAGI_GRID_ADD_HANDLER = "ajax/AjaxGridHandler.aspx";
    var BIZAGI_GRID_EDIT_PAGE = "misc/GridEdit.html";
    var BIZAGI_GRID_EDIT_HANDLER = "ajax/AjaxGridHandler.aspx";
    var BIZAGI_GRID_DELETE_HANDLER = "ajax/AjaxGridHandler.aspx";

    $.ui.baseRender.subclass('ui.gridRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Just apply display-type: value, align it to the left
            self.changeDisplayType("value");
            self.changeLabelAlign("left");

            // Make control to behave as a block container
            self.control
                .addClass("ui-bizagi-render-grid-container")
                .addClass("ui-bizagi-render-display-block");

            // Define control settings & defaults
            self.gridId = "ui-bizagi-grid-table-" + encodeXpath(properties.xpath);
            self.pagerId = "ui-bizagi-grid-pager-" + encodeXpath(properties.xpath);
            self.inlineEdit = properties.inlineEdit || false;
            self.dataType = properties.dataUrl ? $.bizAgiCommunication.dataType : "local";
            self.dataUrl = properties.dataUrl || BIZAGI_GRID_DATA_HANDLER;
            self.data = self.dataType == "local" ? properties.data : [];
            self.inlineEditSaveUrl = properties.inlineEditSaveUrl || BIZAGI_GRID_INLINE_SAVE_HANDLER;
            self.editUrl = properties.editUrl || BIZAGI_GRID_EDIT_PAGE;
            self.editHandlerUrl = properties.editHandlerUrl || BIZAGI_GRID_EDIT_HANDLER;
            self.addUrl = properties.addUrl || BIZAGI_GRID_ADD_PAGE;
            self.addHandlerUrl = properties.addHandlerUrl || BIZAGI_GRID_ADD_HANDLER;
            self.deleteUrl = properties.deleteUrl || BIZAGI_GRID_DELETE_HANDLER;
            self.allowAdd = properties.allowAdd || false;
            self.allowEdit = properties.allowAdd || false;
            self.allowDelete = properties.allowAdd || false;
            self.groupSummary = properties.groupSummary || null;
            self.dynamicPager = properties.dynamicPager || false;
            self.allowSearch = properties.allowSearch || false;

            // Creates grid
            self.grid = $('<table class="ui-bizagi-render-grid" />')
                .attr("id", self.gridId)
                .appendTo(control);

            // Creates pager
            self.pager = $('<div />')
                .attr("id", self.pagerId)
                .appendTo(control);

            // Apply grid plugin
            self._applyGridPlugin();
        },

        /* Resizes the grid adjusting it to the container*/
        resize: function(){
            var self = this;
            if (self.control.width() > 0)
                self.grid.jqGrid("setGridWidth", self.control.width());
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value && properties.editable) {
                var self = this;
                self.grid.jqGrid("option", "data", value);
            }
        },

        _applyGridPlugin: function () {
            var self = this,
                properties = self.options.properties;

            // Build column model
            var columnModel = self._buildColumnModel();

            // Apply jqgrid plugin
            self.grid.jqGrid({
                data: self.data,
                url: urlMergeQueryString(self.dataUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                datatype: self.dataType,
                colModel: columnModel,
                jsonReader: { repeatitems: false, cell: "", id: "0" },
                pager: self.pager,
                pgbuttons: (self.dynamicPager ? false : true),
                pginput: (self.dynamicPager ? false : true),
                recordtext: (self.dynamicPager ? "" : $.jgrid.defaults.recordtext),
                height: "100%",
                sortname: (properties.sortBy ? encodeXpath(properties.sortBy) : self.keyColumn.name),
                sortOrder: (properties.sortOrder ? properties.sortOrder : 'asc'),
                viewrecords: true,
                sortorder: "asc",
                forceFit: true,
                caption: properties.label,
                autowidth: true,
                rowNum: (properties.rowsPerPage || 10),
                grouping: (properties.groupBy ? true : false),
                groupingView: {
                    groupField: [properties.groupBy ? encodeXpath(properties.groupBy) : ''],
                    groupText: ['<b>{0} - {1} elemento(s)</b>'],
                    groupCollapse: (properties.groupCollapsed ? properties.groupCollapsed : false),
                    groupOrder: [properties.groupOrder ? properties.groupOrder : 'asc'],
                    groupSummary: [properties.groupSummary ? true : false],
                    groupColumnShow: [false],
                    showSummaryOnHide: true,
                    groupDataSorted: true
                },
                footerrow: (properties.groupBy ? true : false),
                userDataOnFooter: (properties.groupBy ? true : false),
                ondblClickRow: function (id, iRow, iCol, e) { self._gridRowDoubleClick(id, iRow, iCol, e); }
            });

            //Configure pager
            self._configurePager();

            // Configure dinamic pager
            if (self.dynamicPager) {
                self._configureDynamicPager();
            }

            // Allow search
            if (self.allowSearch) {
                self.grid.jqGrid("enableQuickSearch");

                // Highlight match
                self.grid.jqGrid("setGridParam",
                {
                    afterInsertRow: function (rowid, rowdata, rowelem) {
                        var searchValue = $(".ui-bizagi-render-grid-search-input", self.element).val();

                        if (searchValue && searchValue.length > 0) {
                            for (var item in rowdata) {
                                rowdata[item] = rowdata[item].toString().replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(searchValue) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                            }

                            self.grid.jqGrid("setRowData", rowid, rowdata);
                        }
                    }
                });
            }

            // Configure resize handler (ONLY WORKS IN IE7)
            self.element.resize(function () {
                self.grid.jqGrid("setGridWidth", self.control.width());
            });
        },

        /* Process internal columns*/
        _buildColumnModel: function () {
            var self = this,
                element = self.element;

            var colModel = [];
            $(".ui-bizagi-render-column", element).each(function (i) {
                var column = $(this);

                // Extract metadata
                column.properties = column.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Temporal fix for linq (does not admit dots in the anonymous object)
                var xpath = encodeXpath(column.properties.xpath);

                // Check if it has a group summary
                var summary = "";
                if (self.groupSummary) {
                    for (i = 0; i < self.groupSummary.length; i++) {
                        if (self.groupSummary[i].xpath == column.properties.xpath) {
                            summary = self.groupSummary[i].type;
                        }
                    }
                }

                // Set grid column
                var gridColumn = {
                    name: xpath,
                    index: xpath,
                    label: column.properties.label,
                    hidden: (column.properties.isKey ? column.properties.isKey : false),
                    key: (column.properties.isKey ? true : false),
                    bizAgiProperties: column.properties,
                    summaryType: summary,
                    summaryTpl: self._formatSummary(summary)
                };

                /* Read key column */
                if (column.properties.isKey)
                    self.keyColumn = gridColumn;

                colModel.push(gridColumn);
            });

            return colModel;
        },

        /* Customizes pager control*/
        _configurePager: function () {
            var self = this;

            self.grid.jqGrid('navGrid', "#" + self.pagerId,
            {
                edit: self.allowEdit,
                add: self.allowAdd,
                del: self.allowDelete,
                search: false,
                refresh: (self.dynamicPager ? false : (self.dataType == $.bizAgiCommunication.dataType)),
                delfunc: function (rowid) { self._gridRowDelete(rowid); },
                addfunc: function () { self._gridRowAdd(); },
                editfunc: function () { self._gridRowEdit(); }
            });
        },

        /* Customizes dinamic pager */
        _configureDynamicPager: function () {
            var self = this;

            // Enable icons
            self.grid.jqGrid('navButtonAdd', "#" + self.pagerId,
            {
                id: "ui-bizagi-grid-pager-next",
                caption: $.bizAgiResources["bizagi-ui-render-grid-dynamic-pager"],
                buttonicon: "ui-icon-triangle-1-e",
                onClickButton: function () { self._gridMoreClick(); },
                position: "last",
                title: "More",
                cursor: "pointer"
            });

            // Check if there are more items to show / hide the more icon
            self.grid.jqGrid("setGridParam",
            {
                loadComplete: function (data) {
                    self._toggleMoreIcon(data);
                }
            });

        },

        /* Helper to get the format summary needed*/
        _formatSummary: function (summary) {
            if (summary == "count")
                return "({0}) total";
            else
                return "{0}";
        },

        /* Restore pager icons to original state*/
        _clearPagerIcons: function () {
            var self = this;

            $("#ui-bizagi-grid-pager-cancel", self.pager).detach();
            $("#ui-bizagi-grid-pager-save", self.pager).detach();
        },

        /* Show pager icons for inline edition*/
        _showPagerIcons: function () {
            var self = this;

            // Enable icons
            self.grid
                .jqGrid('navButtonAdd', "#" + self.pagerId,
                {
                    id: "ui-bizagi-grid-pager-cancel",
                    caption: "Cancelar",
                    buttonicon: "ui-icon-arrowthickstop-1-w",
                    onClickButton: function () { self._cancelInlineEdition(); },
                    position: "last",
                    title: "Cancelar",
                    cursor: "pointer"
                })
                .jqGrid('navButtonAdd', "#" + self.pagerId,
                {
                    id: "ui-bizagi-grid-pager-save",
                    caption: "Guardar",
                    buttonicon: "ui-icon-disk",
                    onClickButton: function () { self._saveInlineEditedRow(); },
                    position: "last",
                    title: "Guardar",
                    cursor: "pointer"
                });
        },

        /* Hides or show the more icon in the pager */
        _toggleMoreIcon: function (data) {
            var self = this;

            // Check if there are more items
            if (self.grid.jqGrid("getGridParam", "reccount") == data.records) {

                // Hide more icon
                $("#ui-bizagi-grid-pager-next", self.pager).hide();

            } else {
                // Show more icon
                $("#ui-bizagi-grid-pager-next", self.pager).show();
            }
        },

        /* Cancel the edition for the current row*/
        _cancelInlineEdition: function () {
            var self = this;

            // Cancel inline edition
            self.grid
                .jqGrid('restoreRow', self.lastRowSelected, function (rowid) {
                    self._clearPagerIcons();
                    self.lastRowSelected = -1;
                });
        },
        /* Save inline edited row*/
        _saveInlineEditedRow: function () {
            var self = this,
            properties = self.options.properties,
            saveUrl = urlMergeQueryString(self.inlineEditSaveUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id);

            // Save row
            self.grid
                .jqGrid('saveRow', self.lastRowSelected, saveUrl, function (rowid) {
                    self._clearPagerIcons();
                    self.lastRowSelected = -1;
                });
        },


        /* Handler for cell double click*/
        _gridRowDoubleClick: function (id, iRow, iCol, e) {
            var self = this;

            if (self.inlineEdit) {
                if (id && id !== self.lastRowSelected) {

                    // End last edition
                    if (self.lastRowSelected > 0) {
                        // Save row
                        self.grid.jqGrid('saveRow', self.lastRowSelected, self.inlineEditSaveUrl);
                    } else {
                        // Clear old icons
                        self._clearPagerIcons();
                        self._showPagerIcons();
                    }

                    // Edit current row
                    self.grid.jqGrid('editRow', id);
                    self.lastRowSelected = id;
                }
            }
        },

        /* Handler for grid row deletion*/
        _gridRowDelete: function (rowid) {
            var self = this,
                properties = self.options.properties,
                doc = self.element.ownerDocument;

            var deleteDialog = $('<div></div>')
                .appendTo("body", doc)
                .append('<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' + $.bizAgiResources["bizagi-ui-render-grid-delete-confirmation"] + '</p>')
                .dialog({
                    resizable: false,
                    height: 140,
                    modal: true,
                    buttons: {
                        'Borrar': function () {
                            $(this).dialog('close');

                            // Send request to delete the row
                            $.ajax({
                                type: $.bizAgiCommunication.type,
                                url: urlMergeQueryString(self.deleteUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                                data: { key: rowid },
                                dataType: $.bizAgiCommunication.dataType,
                                jsonp: $.bizAgiCommunication.jsonpParam,
                                complete: function (event, request, settings) {
                                    if (event.responseText.length > 0) {
                                        // Eval error messages
                                        var result = eval("(" + event.responseText + ")");
                                        alert(result.error);

                                    } else {
                                        // Do grid visual deletion
                                        self.grid.jqGrid("delRowData", rowid);
                                    }
                                }
                            });
                        },
                        'Cancelar': function () {
                            $(this).dialog('close');
                        }
                    },
                    close: function (ev, ui) {
                        deleteDialog.dialog('destroy');
                        deleteDialog.detach();
                    }
                });
        },

        /* Handler for grid row adding*/
        _gridRowAdd: function () {
            var self = this,
                properties = self.options.properties;

            self._showFormPopup({
                url: urlMergeQueryString(self.addUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                onSave: function (form) {
                    form.ajaxSubmit({
                        url: urlMergeQueryString(self.addHandlerUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                        success: function (responseText, statusText, xhr, element) { self.grid.trigger("reloadGrid", [{ current: true}]); }
                    });
                }
            });
        },

        /* Handler for grid row edition*/
        _gridRowEdit: function () {
            var self = this,
                properties = self.options.properties;

            // Get selected row
            var id = self.grid.jqGrid('getGridParam', 'selrow');
            var row = self.grid.jqGrid('getRowData', id);
            var colModel = self.grid.jqGrid('getGridParam', 'colModel');

            // Show popup
            self._showFormPopup({
                url: urlMergeQueryString(self.editUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                afterLoad: function (form) {
                    // Add key
                    form.append('<input type="hidden" name="h_key" value="' + id + '">');
                    $(".ui-bizagi-render", form).each(function (i) {
                        var render = $(this);
                        render.properties = render.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                        // set value
                        try {
                            render.properties.value = eval('row.' + render.properties.xpath);
                        } catch (e) { }

                        // Serialize
                        render.attr("properties", JSON.encode(render.properties));
                    });
                },
                onSave: function (form) {
                    form.ajaxSubmit({
                        url: urlMergeQueryString(self.editHandlerUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                        success: function (responseText, statusText, xhr, element) {
                            self.grid.trigger("reloadGrid", [{ current: true}]);
                        }
                    });
                }
            });
        },

        /* Handler for more icon in the pager*/
        _gridMoreClick: function () {
            var self = this,
            properties = self.options.properties;

            // Set next page
            var postData = self.grid.jqGrid("getGridParam", "postData");
            var nextPage = self.grid.jqGrid("getGridParam", "page") + 1;
            postData.page = nextPage;
            self.grid.jqGrid("setGridParam", { page: nextPage });

            // Fetch next rows
            $.ajax({
                url: urlMergeQueryString(self.dataUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                data: postData,
                type: "GET",
                dataType: $.bizAgiCommunication.dataType,
                jsonp: $.bizAgiCommunication.jsonpParam,
                success: function (data, st) {
                    for (i = 0; i < data.rows.length; i++) {
                        var row = data.rows[i];

                        // Get key
                        key = row[0];

                        // Add tow to grid
                        self.grid.jqGrid("addRowData", key, row, "last");
                    }

                    // Check if there are more items to show / hide the more icon
                    self._toggleMoreIcon(data);
                }
            });
        }
    });

})(jQuery);

/* JQQGrid plugin for inline edition and quick search */
(function ($) {
    $ = jQuery;
    
    /**
    * jqGrid extension for manipulating Grid Data
    * made by and for BizAgi
    * Depends on the BizAgi Rendering Plugin
    **/
    $.jgrid.extend({
        
        /* This method converts each column in a full bizagi render */
        editRow: function (rowid) {
            var doc = this.ownerDocument;

            return this.each(function () {
                var columnModel = this.p.colModel;
                var tr = $(this).jqGrid("getInd", rowid, true);

                // Iterate each column in the row
                $('td', tr).each(function (i) {
                    var column = columnModel[i];
                    
                    // Read metadata set when building the gird
                    var columnProperties = column.bizAgiProperties;
                    var td = $(this);

                    // Set Value and clear current
                    columnProperties.temporal = true;
                    columnProperties.value = td.html();
                    columnProperties.displayType = 'value';
                    td.data("oldValue", columnProperties.value);
                    td.empty();

                    // Apply bizagi rendering
                    var render = $('<div class="ui-bizagi-render" />').appendTo(td);
                    render.attr("properties", JSON.encode(columnProperties));

                    // Render controls
                    td.baseContainer();
                });
            });
        },

        /* This method read the values entered by the user and sends it to the server by ajax */
        saveRow: function (rowid, saveUrl, afterSaveCallback) {
            return this.each(function () {
                var columnModel = this.p.colModel;
                var index = $(this).jqGrid("getInd", rowid, true);
                var data = [];
                var key;

                // Iterate each column in the row
                $('td', index).each(function (i) {
                    var td = $(this);
                    var column = columnModel[i];

                    // Read metadata set when building the gird
                    var columnProperties = column.bizAgiProperties;

                    // Set new value 
                    var render = $(".ui-bizagi-render", td);
                    var isKey = columnProperties.isKey ? columnProperties.isKey : false;
                    
                    var value = !isKey ? render.baseRender("getValue") : columnProperties.value;
                    var displayValue = render.baseRender("getDisplayValue");
                    td.data("oldValue", value);

                    if (isKey) {
                        key = value;
                    }

                    // Set new value
                    td.empty();
                    td.html(displayValue);

                    // Add data to send
                    data.push({ xpath: columnProperties.xpath, value: value, isKey: isKey });
                });

                // Send info
                if (saveUrl) {
                    $.ajax({
                        url: saveUrl,
                        data: { data: JSON.encode(data), key: key },
                        type: $.bizAgiCommunication.type,
                        dataType: $.bizAgiCommunication.dataType,
                        jsonp: $.bizAgiCommunication.jsonpParam,
                        complete: function (event, request, settings) {
                            // Call event
                            if (afterSaveCallback)
                                afterSaveCallback(rowid, true);
                        }
                    });

                } else {
                    // Call event
                    if (afterSaveCallback)
                        afterSaveCallback(rowid, true);
                }
            });
        },
        
        /* This method restores the row to its initial state */
        restoreRow: function (rowid, afterRestoreCallback) {
            return this.each(function () {
                var columnModel = this.p.colModel;
                var index = $(this).jqGrid("getInd", rowid, true);

                // Restore each cell value
                $('td', index).each(function (i) {
                    var td = $(this);

                    // Restore old value
                    if (td.data("oldValue")) {
                        td.html(td.data("oldValue"));
                    }
                });

                // Call event
                if (afterRestoreCallback)
                    afterRestoreCallback(rowid);

            });
        },
        //end inline edit

        // Quick search
        /* This method sets the layout to create a quick search box*/
        enableQuickSearch: function () {
            return this.each(function () {
                var $t = this;
                var header = $($t.grid.cDiv);

                // Add span 
                var input = $('<input class="ui-corner-all ui-bizagi-render-grid-search-input" type="text" value="" />');
                var icon = $('<span class="ui-icon ui-icon-search" />');
                var span = $('<span class="ui-bizagi-render-grid-header-search" />')
                    .append(input)
                    .append(icon)
                    .appendTo(header);

                icon.click(function () {
                    // Update post data
                    var postData = $($t).jqGrid("getGridParam", "postData")
                    postData.searchFilter = input.val();
                    $($t).jqGrid("setGridParam", "postData", postData);

                    // Trigger reload grid
                    $($t).trigger("reloadGrid", [{ page: 1}]);
                });
            });
        }
    });

})(jQuery);