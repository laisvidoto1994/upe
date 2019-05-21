/*
* @title : Dimension filter component
* @author : David Romero Estrada
* @date   : 26/09/2013
* Comments:
*     Defines a base class for all report components
*
*/

bizagi.reporting.component.controller("bizagi.reporting.component.dimensionfilter", {
    /*
    *   Constructor
    */
    init: function (canvas, services, params) {

        params = params || {};

        //Call super
        this._super(canvas);

        //Set up the variables
        this.model = {};

        //Dimensions container
        this.modal = [];

        //Dimension services actions
        this.srvActions = params.srvActions;

        //Set services object
        this.services = services;

        //Set up process model
        this.process = params.process;

        //Set up default dimension items
        this.dimensions = [];

        //Set up defaults dimensions
        this.defaults = params.dftDimensions || [];

        //Set up dimension model
        this.dimension = [];

        //Var for edition mode
        this.edit = false;

        //Set up for edition list
        this.editionList = [];

        //indicate if the service for dimensions list need to be load or not
        this.load = true;

        //Render component
        this.render();
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "dimension": (bizagi.getTemplate("bizagi.reporting.component.dimensionfilter") + "#bz-rp-filters-dimension"),
            "dimension-dialog": (bizagi.getTemplate("bizagi.reporting.component.dimensionfilter") + "#bz-rp-filters-dimension-dialog"),
            "dimension-pills-wrapper": (bizagi.getTemplate("bizagi.reporting.component.dimensionfilter") + "#bz-rp-filters-dimension-pills-wrapper"),
            "dimension-container": (bizagi.getTemplate("bizagi.reporting.component.dimensionfilter") + "#bz-rp-filters-dimension-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    * Set initial dimension
    */
    setInitialDimension: function () {

        var self = this;

        var id = self.model.dimensions[0].id || 0;
        var guid = self.model.dimensions[0].guid;
        var type = self.model.dimensions[0].type;
        var name = self.model.dimensions[0].name;

        self.dimension = { processId: self.process.process.id, guid:guid, id: id, name: self.getResource(name), type: type };
    },

    /*
    *   Templated render component
    */
    renderComponent: function () {

        var self = this;
        var template = self.getTemplate("dimension");
        var content = $.tmpl(template);

        //Set defaults dimensions
        if (self.defaults.length) {
            self.setDefaults();
        }

        return content;
    },

    /*
    *   Update the model and render again
    */
    refresh: function (process) {

        var self = this;

        self.dimension.processId = process.process.id;
        self.process = process;
        self.removeAllDimensions();
        self.checkPills();
        self.load = true;
    },

    /*
    * After Render is loaded execute some actions
    */
    postRender: function () {

        var self = this;

        //resolve post render deferred
        self.resolvePostRender();

        // bind events
        self.eventHandlers();
    },

    /*
    * Append modal container
    */
    appendModal: function () {

        var self = this;

        if (!self.modal.length) {
            var tmpl = self.getTemplate("dimension-container");
            self.modal = $.tmpl(tmpl);
            self.modal.appendTo("body");
        }

    },

    /*
    * Set Defaults
    */
    setDefaults: function () {

        var self = this, defaults = self.defaults, length = defaults.length;

        $.when(self.loadDimensions()).done(function () {

            for (var i = 0; i < length; i++) {

                var nulls = (defaults[i].includeEmptyValues) ? true : false;

                var items = self.model.dimensions.filter(function (arr, x) {
                    var idFilter = arr.id === defaults[i].id && arr.type === defaults[i].type && arr.id > 0;
                    var guidFilter = arr.guid === defaults[i].guid && arr.type === defaults[i].type && (arr.guid != null && arr.guid != undefined);
                    return (idFilter || guidFilter);
                });

                self.dimensions.push({ id: items[0].id || 0, guid: items[0].guid, name: self.getResource(items[0].name), values: defaults[i].values, type: items[0].type, includeEmptyValues: nulls });
                self.buildPills({ isNew: true, position: [i] });

                self.checkPills();
            }

        });
    },

    /*
    * Render dialog 
    */
    renderDialog: function (dlgContent) {

        var self = this;
        var deferred = new $.Deferred();
        var title = self.getResource("bz-rp-components-dimension-dimensions-label");

        dlgContent.dialog({
            resizable: false,
            modal: true,
            title: title,
            dialogClass: "bz-rp-dialog",
            draggable: false,
            appendTo: self.modal,
            maximize: false,
            open: function () {
                deferred.resolve();
            },
            close: function () {
                $(this).remove();
            },
            buttons: [
                    {
                        text: self.getResource("workportal-general-button-label-apply"),
                        click: function () {

                            self.applyDimensionsFilter();
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: self.getResource("render-form-dialog-box-close"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
        });

        return deferred;
    },

    /*
    * Render description
    */
    renderDescription: function () {

        var self = this;

        //filter dimension list to get dimension description
        var el = self.model.dimensions.filter(function (arr, x) {
            if(self.dimension.id || self.dimension.id === 0)
                return (arr.guid === self.dimension.guid);
            else
                return (arr.id === self.dimension.id);
        });

        //set description
        if (el.length > 0)
            $("#bz-rp-filters-dimension-description p", self.modal).html(self.getResource(el[0].description));
        else 
            $("#bz-rp-filters-dimension-description p", self.modal).html("");
    },

    /*
    * Render dimensions 
    */
    renderDimensions: function () {

        var self = this;
        var comboDataSource = self.getComboDataSource();
        $combo = $("#bz-rp-filters-dimension-list", self.modal);

        $combo.uicombo({
            data: comboDataSource,
            disabled: self.edit,
            onChange: function (obj) {
                var data = obj.ui.data("value").split("/");

                self.dimension.id = data[0] || 0;
                self.dimension.name = data[1];
                self.dimension.type = data[2];
                self.dimension.guid = data[3];

                //render description
                self.renderDescription();

                $.when(self.getDimensionItems()).done(function (obj) {
                    self.resetTabs();
                    self.refreshSearch(obj.items);
                    self.refreshTree(obj.items);
                });

            },
            itemValue: function (obj) {
                return obj.id + "/" + obj.name + "/" + obj.type + "/" + obj.guid;
            },
            itemText: function (obj) {
                return obj.name;
            },
            initValue: comboDataSource.combo[comboDataSource.dft]
        });

    },

    resetTabs: function () {
        var self = this;
        var disabled = self.tabs.tabs("option", "disabled");
        if (disabled && disabled.length > 0) {
            self.tabs.tabs("enable");
            self.tabs.tabs({ active: 0 });
        }
    },

    /*
    * Render the selected dimension items
    */
    renderTree: function (items) {
        var self = this, $tree;

        if (items && items.length > 200) {
            $tree = $("#bz-rp-filters-dimension-tree", self.modal);
            $tree.treeview({
                list: [],
                itemValue: function (obj) {
                    return obj.id + "/" + obj.subtype +  "/" + obj.guid;
                },
                itemText: function (obj) {
                    return obj.name;
                }
            });
            // disable tab
            self.tabs.tabs({ active: 1 });
            self.tabs.tabs("disable", 0);
        } else {
            var treeData = self.getTreeviewDataSource(items);
            $tree = $("#bz-rp-filters-dimension-tree", self.modal);

            $tree.treeview({
                list: treeData,
                itemValue: function (obj) {
                    return obj.id + "/" + obj.subtype + "/" + obj.guid;
                },
                itemText: function (obj) {
                    return obj.name;
                }
            });
        }
    },

    /*
    *  Get dimensions items
    */
    getDimensionItems: function () {

        var self = this;
        var filter = "dimension=" + JSON.stringify(self.dimension);

        return $.when(self.services.getDimensionsItems(filter));
    },

    /*
    * Render the searcher for dimension items
    */
    renderSearch: function (items) {

        var self = this;

        var $search = $("#bz-rp-filters-dimension-search", self.modal);

        $search.multiSelect({
            list: items,
            itemValue: function (obj) {
                return obj.id + "/" + obj.subtype + "/" + obj.guid;
            },
            itemText: function (obj) {
                return obj.name;
            },
            label: self.getResource("bz-rp-components-dimension-search-label")
        });
    },

    /*
    * Refresh  the searcher for dimension items
    */
    refreshSearch: function (items) {

        var self = this;
        var $search = $("#bz-rp-filters-dimension-search", self.modal);
        $search.multiSelect("setList", items);
    },

    /*
    * Refresh the tree
    */
    refreshTree: function (items) {
        var self = this, $tree;

        if (items && items.length > 200) {
            $tree = $("#bz-rp-filters-dimension-tree", self.modal);
            $tree.treeview("setList", []);
            // disable tab
            self.tabs.tabs({ active: 1 });
            self.tabs.tabs("disable", 0);
        } else {
            $tree = $("#bz-rp-filters-dimension-tree", self.modal);
            var treeData = self.getTreeviewDataSource(items);

            $tree.treeview("setList", treeData);
        }
    },

    /*
    * Apply dimensions filters
    */
    applyDimensionsFilter: function () {

        var self = this;
        var $search = $("#bz-rp-filters-dimension-search", self.modal);
        var $tree = $("#bz-rp-filters-dimension-tree", self.modal);

        var itemsSearch = $search.multiSelect("getDataItems");
        var itemsTree = $tree.treeview("getDataItems");

        var nulls = $("#bz-rp-filters-dimension-nulls input", self.modal).prop("checked");
        var items = self.uniqueKeys(itemsSearch, itemsTree, 'value');

        if (items.length || self.edit || nulls) {

            var obj = self.buildDimensions(items, nulls);
            var dimension = self.dimensions[obj.position[0]];

            (dimension.values.length || dimension.includeEmptyValues) ? self.buildPills(obj) : self.removeDimension(obj.position);

            self.executeFilters();
        }

    },

    /*
    * Remove duplicates and return an array
    */
    uniqueKeys: function (vector1, vector2, key) {

        var arr = {};
        var items = [].concat(vector1).concat(vector2);

        for (var i = 0, length = items.length; i < length; i++) arr[items[i][key]] = items[i];

        items = new Array();

        if (key == 'value') {
            for (y in arr) {
                data = arr[y].value.split("/");
                items.push({ id: data[0], subType: data[1], name: arr[y].text });
            }
        } else {
            for (y in arr) {
                items.push(arr[y]);
            }
        }

        return items;
    },

    /*
    * Build Dimensions Object for server
    */
    buildDimensions: function (items, nulls) {

        var self = this;
        var id = self.dimension.id;
        var guid = self.dimension.guid;
        var isNew = true;
        var type = self.dimension.type;
        var name = self.dimension.name;
        var arr = { id: id, guid: guid, name: name, values: [], type: type, includeEmptyValues: nulls };

        //Get the position of current dimension if exists
        var position = $.map(self.dimensions, function (array, i) {
           // if (array.id == id && array.type == type) return i;
                if( id == "0" && guid !="" )
                {
                    if(array.guid == guid) return i;
                }
                else if ((array.id == id && array.type == type) && guid =="")
                {
                    return i;
                }
        });

        if (position.length) {

            var dimension = self.dimensions[position[0]];
            isNew = false;

            arr.values = (self.edit) ? //for edition just override the values                
                 items : //for adding make a merge with the current dimension values
                 self.uniqueKeys(items, dimension.values, 'id');

            dimension.values = arr.values;
            dimension.includeEmptyValues = nulls;

        } else {
            arr.values = items;
            self.dimensions.push(arr);
            position.push(self.dimensions.length - 1);
        }

        return { isNew: isNew, position: position };
    },

    /*
    * Build Pills
    */
    buildPills: function (obj) {

        var self = this;
        var position = obj.position;
        var dimension = self.dimensions[position[0]];
        var content = "";
        var tmpl = self.getTemplate("dimension-pills-wrapper");
        var $pillsWrapper = self.getPillsWrapper();

        if (!obj.isNew) {

            var $pill = $(".bz-rp-filters-dimensions-pill", $pillsWrapper).eq(position[0]);
            content = $.tmpl(tmpl, dimension);
            $pill.replaceWith(content);

        } else {

            content = $.tmpl(tmpl, dimension);
            content.appendTo($pillsWrapper);
        }
    },

    /*
    * Check if there are selected dimensions
    */
    checkPills: function () {

        var self = this;
        var $pillsWrapper = self.getPillsWrapper();
        var $pills = $(".bz-rp-filters-dimensions-pill", $pillsWrapper);

        if ($pills.length) {

            $pillsWrapper.addClass("bz-rp-filters-dimension-pills");
        } else {

            $pillsWrapper.removeClass("bz-rp-filters-dimension-pills");
        }
    },

    /*
    * Get Pills Wrapper
    */
    getPillsWrapper: function () {

        var self = this;

        return $("#reports-canvas").find("#bz-rp-filters-dimension-pills");
    },

    /*
    * Get object data for combo
    */
    getComboDataSource: function () {

        var self = this;
        var dimensions = [].concat(self.model.dimensions);
        var dataSource = { combo: [], label: self.getResource("bz-rp-components-dimension-label"), dft: 0 };

        if (self.edit) {

            dataSource.combo.push({ id: self.dimension.id || 0, guid: self.dimension.guid, name: self.dimension.name, type: self.dimension.type });
        } else {

            for (var i = 0, length = dimensions.length; i < length; i++) {
                dataSource.combo.push({ id: dimensions[i].id || 0, guid: dimensions[i].guid, name: self.getResource(dimensions[i].name), type: dimensions[i].type });
            }
        }

        return dataSource;
    },

    /*
    * Get object data for treeview plugin
    */
    getTreeviewDataSource: function (items) {

        var self = this;
        var dataSource = [];
        var edit = self.editionList;
        var data = [].concat(items);

        for (var i = 0, length = data.length; i < length; i++) {

            data[i].defaults = false;

            for (var y = 0, lengthy = edit.length; y < lengthy; y++) {
                if (edit[y].id == data[i].id) {
                    data[i].defaults = true; break;
                }
            }

            if (data[i].parent === 0) {
                dataSource.push(data[i]);
            } else {

                var ref = data.filter(function (arr) {
                    return arr.id === data[i].parent
                });

                if (typeof (ref[0].subitems) !== "undefined") {
                    ref[0].subitems.push(data[i]);
                } else {
                    ref[0].subitems = new Array(data[i]);
                }
            }
        }

        return dataSource;
    },

    /*
    * Render dimensions dialog
    */
    renderDimensionsDialog: function (pst) {

        var self = this;
        var dimensionTemplate = self.getTemplate("dimension-dialog");
        var nulls = (typeof (pst) !== "undefined") ? self.dimensions[pst].includeEmptyValues : false;
        var dlgContent = $.tmpl(dimensionTemplate, { nulls: nulls });

        $.when(self.renderDialog(dlgContent)).done(function () {

            //render description
            self.renderDescription();

            self.tabs = dlgContent.find("#bz-rp-filters-dimension-filters");
            self.tabs.tabs();

            if (typeof (pst) !== "undefined") {

                var dimension = self.dimensions[pst];

                //for edition
                self.edit = true;
                self.editionList = dimension.values;
                self.dimension.id = dimension.id;
                self.dimension.guid = dimension.guid;
                self.dimension.name = dimension.name;
                self.dimension.type = dimension.type;

            } else {

                //for addition
                self.edit = false;
                self.editionList = [];
            }

            //render combo
            self.renderDimensions();

            $.when(self.getDimensionItems()).done(function (obj) {
                self.resetTabs();

                //render tree plugin
                self.renderTree(obj.items);

                //render search plugin
                self.renderSearch(obj.items);

            });

        });
    },

    /*
    * Render dialog for no dimensions
    */
    renderNoDataDialog: function () {

        var self = this;
        var message = self.getResource("bz-rp-components-dimension-nodata");

        bizagi.showMessageBox(message);

    },

    /*
    * Load dimensions
    */
    loadDimensions: function () {

        var self = this;
        var deferred = $.Deferred();

        if (self.load) {
            var filter = "filters=" + JSON.stringify(self.process);

            $.when(self.services[self.srvActions.dimensionsList](filter)).done(function (result) {
                self.load = false;

                //save the result in the modal var
                self.model = result;

                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred;
    },

    /*
    *   E V E N T    H A N D L E R S
    */
    eventHandlers: function () {

        var self = this;

        var $dimensionButton = $(".bz-rp-filters-dimension-button", self.content);
        var $rpCanvas = $("#reports-canvas");

        $dimensionButton.on("click", function (event, pst) {

            $.when(self.loadDimensions()).done(function () {
                if (self.model.dimensions.length) {
                    //set the default dimension
                    self.setInitialDimension();

                    //append modal container if there isn't
                    self.appendModal();

                    self.renderDimensionsDialog(pst);
                } else {
                    self.renderNoDataDialog();
                }
            });

        });

        $rpCanvas.off("click.dimension-delete").on("click.dimension-delete", "#bz-rp-filters-dimension-pills .bz-rp-filters-dimensions-pill-delete", function (event) {

            var parent = $(this).parent();
            var id = parent.data("id");
            var type = parent.data("type");
            var guid = parent.data("guid");

            //Get the position of current dimension if exists
            var position = $.map(self.dimensions, function (array, i) {
                // if (array.id == id && array.type == type) return i;
                if (id == "0" && guid != "") {
                    if (array.guid == guid) return i;
                }
                else if ((array.id == id && array.type == type) && guid == "") {
                    return i;
                }
            });

            self.removeDimension(position);
            self.executeFilters();

        });

        $rpCanvas.off("click.dimension-edit").on("click.dimension-edit", "#bz-rp-filters-dimension-pills .bz-rp-filters-dimensions-pill-edit", function (event) {

            var parent = $(this).parent();
            var id = parent.data("id");
            var type = parent.data("type");
            var guid = parent.data("guid");

            //Get the position of current dimension if exists
            var position = $.map(self.dimensions, function (array, i) {
                // if (array.id == id && array.type == type) return i;
                if (id == "0" && guid != "") {
                    if (array.guid == guid) return i;
                }
                else if ((array.id == id && array.type == type) && guid == "") {
                    return i;
                }
            });

            $dimensionButton.trigger("click", position);

        });

    },

    /*
    * Remove all dimensions
    */
    removeAllDimensions: function () {

        var self = this;
        var $pillsWrapper = self.getPillsWrapper();

        //remove the dimension pill
        $(".bz-rp-filters-dimensions-pill", $pillsWrapper).remove();

        //reset dimensions array
        self.dimensions = [];
    },

    /*
    * Remove Dimension
    */
    removeDimension: function (position) {

        var self = this;
        var $pillsWrapper = self.getPillsWrapper();

        //remove the dimension pill
        $(".bz-rp-filters-dimensions-pill", $pillsWrapper).eq(position[0]).remove();

        //remove the dimension
        self.dimensions.splice(position[0], 1);
    },

    /*
    * Execute filters
    */
    executeFilters: function () {

        var self = this;
        self.publish("filterbydimension", [self.dimensions]);
        self.checkPills();
    }
});

