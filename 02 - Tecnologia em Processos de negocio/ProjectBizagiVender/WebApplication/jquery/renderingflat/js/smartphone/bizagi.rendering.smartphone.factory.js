/*
*   Name: BizAgi Smartphone Render Factory
*   Author: Oscar O
*   Comments:
*   -   This script will define a render factory to create smartphone versions of each render type
*/

bizagi.rendering.base.factory.extend("bizagi.rendering.smartphone.factory", {}, {

    /*
    *   Load all the templates used for rendering
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            // Containers
            self.loadTemplate("form", bizagi.getTemplate("bizagi.renderingflat.smartphone.form") + "#ui-bizagi-render-form"),
            self.loadTemplate("complexgateway", bizagi.getTemplate("bizagi.renderingflat.smartphone.form") + "#ui-bizagi-render-complexGateway"),
            self.loadTemplate("panel", bizagi.getTemplate("bizagi.renderingflat.smartphone.panel")),
            self.loadTemplate("tab", bizagi.getTemplate("bizagi.renderingflat.smartphone.tab")),
            self.loadTemplate("tabItem", bizagi.getTemplate("bizagi.renderingflat.smartphone.tabItem")),
            self.loadTemplate("horizontal", bizagi.getTemplate("bizagi.renderingflat.smartphone.horizontal")),
            self.loadTemplate("group", bizagi.getTemplate("bizagi.renderingflat.smartphone.group")),
            self.loadTemplate("editRender", bizagi.getTemplate("bizagi.renderingflat.smartphone.edit")),
            self.loadTemplate("searchForm", bizagi.getTemplate("bizagi.renderingflat.smartphone.searchForm")),
            self.loadTemplate("accordion", bizagi.getTemplate("bizagi.renderingflat.smartphone.accordion")),
            self.loadTemplate("accordionItem", bizagi.getTemplate("bizagi.renderingflat.smartphone.accordionItem")),
            self.loadTemplate("contentPanel", bizagi.getTemplate("bizagi.renderingflat.smartphone.contentPanel")),

            // Renders
            self.loadTemplate("render", bizagi.getTemplate("bizagi.renderingflat.smartphone.render")),
            self.loadTemplate("render-layout", bizagi.getTemplate("bizagi.renderingflat.smartphone.render.layout")),
            self.loadTemplate("combo", bizagi.getTemplate("bizagi.renderingflat.smartphone.combo") + "#ui-bz-mobile-combo-control"),
            self.loadTemplate("readonlyCombo", bizagi.getTemplate("bizagi.renderingflat.smartphone.combo") + "#ui-bz-mobile-readonly-combo-control"),
            self.loadTemplate("comboModalView", bizagi.getTemplate("bizagi.renderingflat.smartphone.combo") + "#ui-bz-wp-popup-combo-control"),
            self.loadTemplate("date", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.date") + "#bz-rn-date"),
            self.loadTemplate("text", bizagi.getTemplate("bizagi.renderingflat.smartphone.text")),
            self.loadTemplate("number", bizagi.getTemplate("bizagi.renderingflat.smartphone.number") + "#ui-bz-mobile-number-control"),
            self.loadTemplate("readonlyNumber", bizagi.getTemplate("bizagi.renderingflat.smartphone.number") + "#ui-bz-mobile-readonly-number-control"),
            self.loadTemplate("numberScientificNotation", bizagi.getTemplate("bizagi.renderingflat.smartphone.numberScientificNotation")),
            self.loadTemplate("extendedText", bizagi.getTemplate("bizagi.renderingflat.smartphone.extendedText") + "#ui-bz-mobile-extended-text-control"),
            self.loadTemplate("readonlyExtendedText", bizagi.getTemplate("bizagi.renderingflat.smartphone.extendedText") + "#ui-bz-mobile-readonly-extended-text-control"),
            self.loadTemplate("yesno", bizagi.getTemplate("bizagi.renderingflat.smartphone.yesno")),
            self.loadTemplate("check", bizagi.getTemplate("bizagi.renderingflat.smartphone.check")),
            self.loadTemplate("button", bizagi.getTemplate("bizagi.renderingflat.smartphone.button")),
            self.loadTemplate("link", bizagi.getTemplate("bizagi.renderingflat.smartphone.link")),
            self.loadTemplate("list", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.list") + "#ui-bz-mobile-list-control"),
            self.loadTemplate("listModalView", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.list") + "#ui-bz-wp-popup-list-control"),
            self.loadTemplate("geolocation", bizagi.getTemplate("bizagi.renderingflat.smartphone.geolocation")),
            self.loadTemplate("radio", bizagi.getTemplate("bizagi.renderingflat.smartphone.radio")),
            self.loadTemplate("search", bizagi.getTemplate("bizagi.renderingflat.smartphone.search") + "#ui-bz-mobile-search-control"),
            self.loadTemplate("readonlySearch", bizagi.getTemplate("bizagi.renderingflat.smartphone.search") + "#ui-bz-mobile-readonly-search-control"),
            self.loadTemplate('searchList', bizagi.getTemplate("bizagi.renderingflat.smartphone.searchList") + "#ui-bz-mobile-searchlist-control"),
            self.loadTemplate("searchListModalView", bizagi.getTemplate("bizagi.renderingflat.smartphone.searchList") + "#ui-bz-wp-popup-searchlist-control"),
            self.loadTemplate("searchListModalViewAuxTemplates", bizagi.getTemplate("bizagi.renderingflat.smartphone.searchList") + "#ui-bz-wp-searchlist-control-modalview-auxiliary-templates"),
            self.loadTemplate("searchListInputAuxTemplates", bizagi.getTemplate("bizagi.renderingflat.smartphone.searchList") + "#ui-bz-wp-searchlist-control-input-auxiliary-templates"),
            self.loadTemplate("upload", bizagi.getTemplate("bizagi.renderingflat.smartphone.upload") + "#bz-rn-upload-container"),
            self.loadTemplate("uploadItem", bizagi.getTemplate("bizagi.renderingflat.smartphone.upload") + "#bz-rn-upload-item"),
            self.loadTemplate("association", bizagi.getTemplate("bizagi.renderingflat.smartphone.association")),
            self.loadTemplate("ecm", bizagi.getTemplate("bizagi.renderingflat.smartphone.ecm") + "#bz-rn-ecm-view-default-item"),
            self.loadTemplate("ecm-metadata", bizagi.getTemplate("bizagi.renderingflat.smartphone.ecm") + "#bz-rn-ecm-metadata"),
            self.loadTemplate("checkList", bizagi.getTemplate("bizagi.renderingflat.smartphone.checkList")),
            self.loadTemplate("image", bizagi.getTemplate("bizagi.renderingflat.smartphone.image") + "#ui-bizagi-render-image"),
            self.loadTemplate("image-item", bizagi.getTemplate("bizagi.renderingflat.smartphone.image") + "#ui-bizagi-render-image-item"),
            self.loadTemplate("image-preview", bizagi.getTemplate("bizagi.renderingflat.smartphone.image") + "#bz-rd-upload-render-edition"),
            self.loadTemplate("document", bizagi.getTemplate("bizagi.renderingflat.smartphone.document") + "#bz-document-generator"),
            self.loadTemplate("document-item", bizagi.getTemplate("bizagi.renderingflat.smartphone.document") + "#bz-document-generator-item"),
            self.loadTemplate("render-range", bizagi.getTemplate("bizagi.renderingflat.smartphone.range")),
            self.loadTemplate("readonly", bizagi.getTemplate("bizagi.renderingflat.smartphone.readonly")),

            //action launcher helpers
            self.loadTemplate("render-slide-view", bizagi.getTemplate("bizagi.renderingflat.smartphone.slide.view")),

            //action launcher
            self.loadTemplate("render-actionLauncher", bizagi.getTemplate("bizagi.renderingflat.smartphone.actionLauncher") + "#bz-rendering-actionLauncher"),
            self.loadTemplate("render-actionLauncher-horizontal", bizagi.getTemplate("bizagi.renderingflat.smartphone.actionLauncher") + "#bz-rendering-actionLauncher-horizontal"),
            self.loadTemplate("render-actionLauncher-vertical", bizagi.getTemplate("bizagi.renderingflat.smartphone.actionLauncher") + "#bz-rendering-actionLauncher-vertical"),
            self.loadTemplate("render-actionLauncher-actions-to-execute", bizagi.getTemplate("bizagi.renderingflat.smartphone.actionLauncher") + "#bz-rendering-actionLauncher-actions-to-execute"),

            //polymorphic launcher
            self.loadTemplate("render-polymorphicLauncher", bizagi.getTemplate("bizagi.renderingflat.smartphone.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher"),
            self.loadTemplate("render-polymorphicLauncher-vertical-tree", bizagi.getTemplate("bizagi.renderingflat.smartphone.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-vertical-tree"),
            self.loadTemplate("render-polymorphicLauncher-vertical-tree-item", bizagi.getTemplate("bizagi.renderingflat.smartphone.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-vertical-tree-item"),
            self.loadTemplate("render-polymorphicLauncher-actions-to-execute", bizagi.getTemplate("bizagi.renderingflat.smartphone.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-actions-to-execute"),
            self.loadTemplate("render-polymorphicLauncher-confirm", bizagi.getTemplate("bizagi.renderingflat.smartphone.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-confirm"),

            //Renders Edition
            self.loadTemplate("edition.number", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.number")),
            self.loadTemplate("edition.search.add", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.search") + "#bz-rn-search-add"),
            self.loadTemplate("edition.search.item", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.search") + "#bz-rn-search-item"),
            self.loadTemplate("edition.link", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.link")),
            self.loadTemplate("edition.letter", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.letter")),
            self.loadTemplate("edition.upload.menu", bizagi.getTemplate("bizagi.renderingflat.smartphone.edition.upload") + "#bz-rn-upload-menu"),

            //Renders Layouts
            self.loadTemplate("layout-image", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.image") + "#ui-bizagi-render-layout-image"),
            self.loadTemplate("layout-image64", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.image") + "#ui-bizagi-render-layout-image64"),
            self.loadTemplate("layout-label", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.label")),
            self.loadTemplate("layout-link", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.link")),
            self.loadTemplate("layout-text", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.text")),
            self.loadTemplate("layout-date-time", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.dateTime")),
            self.loadTemplate("layout-money", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.money")),
            self.loadTemplate("layout-number", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.number")),
            self.loadTemplate("layout-upload", bizagi.getTemplate("bizagi.renderingflat.smartphone.layout.upload")),

            //Renders commons
            self.loadTemplate("form-error", bizagi.getTemplate("bizagi.renderingflat.smartphone.form-error")),
            self.loadTemplate("form-waiting", bizagi.getTemplate("bizagi.renderingflat.smartphone.form-waiting")),

            self.getGridTemplates()

        ).done(function () {

            // Resolve when all templates are loaded
            defer.resolve();
        });

        return defer.promise();
    },
    /**
     * Returns the appropiate render based on the render type
     * @param {} params 
     * @returns {} 
     */
    getRender: function (params) {
        var self = this;
        var type = params.type;
        var data = params.data;

        var renderParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });

        if (type === "number") {
            var properties = data.properties;
            if (properties && properties.dataType === 29) {
                return new bizagi.rendering.numberScientificNotation(renderParams);
            }
        }

        // Grid Beta
        if (bizagi.util.isMobileGridEnabled() && type === "grid") {
            return new bizagi.rendering.grid.beta(renderParams);
        }

        return self._super(params);
    },

    /**
     * Returns the appropiate column based on the render type
     * @param {} params 
     * @returns {} 
     */
    getColumn: function (params) {
        var self = this;
        var type = params.type;
        var columnParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService,
            singleInstance: bizagi.util.isEmpty(params.singleInstance) ? true : params.singleInstance
        });

        if (type === "columnNumber") {
            var data = params.data;
            var properties = data.properties;
            if (properties && properties.dataType === 29) {
                columnParams.decorated = bizagi.rendering.numberScientificNotation;
                return new bizagi.rendering.columns.numberScientificNotation(columnParams);
            }
        }

        // Call base
        return self._super(params);
    },

    /**
     * Get template by type
     * @returns {} 
     */
    getGridTemplates: function () {
        var self = this;
        var deferred = new $.Deferred();

        if (bizagi.util.isMobileGridEnabled()) {
            $.when(
                    //Grid helper
                    self.loadTemplate("grid-view", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.helpers")),

                    //Grid Smartphone
                    self.loadTemplate("grid", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid"),
                    self.loadTemplate("cell", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-cell"),
                    self.loadTemplate("cell.readonly", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-cell-readonly"),
                    self.loadTemplate("cell.upload", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-cell-upload"),
                    //Grid items
                    self.loadTemplate("grid-control", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-control"),
                    self.loadTemplate("grid-table", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table"),
                    self.loadTemplate("grid-table-empty", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-empty"),
                    self.loadTemplate("grid-table-column", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-column"),
                    self.loadTemplate("grid-table-column-special", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-column-special"),
                    self.loadTemplate("grid-table-row", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-row"),
                    self.loadTemplate("grid-table-cell", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-cell"),
                    self.loadTemplate("grid-table-cell-special", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-cell-special"),
                    self.loadTemplate("grid-table-pager", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-table-pager"),
                    //Modal filter
                    self.loadTemplate("grid-modal-filter", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid.control") + "#bz-rn-grid-filter"))
                .done(function () {
                    deferred.resolve();
                });
        } else {
            $.when(
                    //Grid Smartphone
                    self.loadTemplate("grid", bizagi.getTemplate("bizagi.renderingflat.smartphone.grid")),
                    self.loadTemplate("cell", bizagi.getTemplate("bizagi.renderingflat.smartphone.cell")),
                    self.loadTemplate("cell.readonly", bizagi.getTemplate("bizagi.renderingflat.smartphone.cell.readonly")),
                    self.loadTemplate("cell.upload", bizagi.getTemplate("bizagi.renderingflat.smartphone.cell.upload")),

                    // Grid items
                    self.loadTemplate("bizagi.grid.grid", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid"),
                    self.loadTemplate("bizagi.grid.waiting", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-waiting"),
                    self.loadTemplate("bizagi.grid.table", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-table"),
                    self.loadTemplate("bizagi.grid.table.empty", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-table-empty"),
                    self.loadTemplate("bizagi.grid.column", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-column"),
                    self.loadTemplate("bizagi.grid.column.special", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-column-special"),
                    self.loadTemplate("bizagi.grid.row", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-row"),
                    self.loadTemplate("bizagi.grid.row.buttons", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-row-buttons"),
                    self.loadTemplate("bizagi.grid.cell", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-cell"),
                    self.loadTemplate("bizagi.grid.cell.special", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-cell-special"),
                    self.loadTemplate("bizagi.grid.pager", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-pager"),
                    self.loadTemplate("bizagi.grid.buttons", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-buttons"),
                    self.loadTemplate("bizagi.grid.totalizer", bizagi.getTemplate("bizagi.renderingflat.smartphone.bizagi.grid") + "#ui-bizagi-grid-totalizer"))
                .done(function () {
                    deferred.resolve();
                });
        }

        return deferred.promise();
    }
});