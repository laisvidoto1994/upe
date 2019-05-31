/*
 *   Name: BizAgi Tablet Render Factory
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a render factory to create tablet versions of each render type
 */

bizagi.rendering.base.factory.extend("bizagi.rendering.tablet.factory", {}, {
    /**
     * Load all the templates used for rendering
     */
    loadTemplates: function() {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            // Common
            self.loadTemplate("form-error", bizagi.getTemplate("bizagi.renderingflat.tablet.form-error")),
            self.loadTemplate("form-waiting", bizagi.getTemplate("bizagi.renderingflat.tablet.form-waiting")),

            // Containers
            self.loadTemplate("form", bizagi.getTemplate("bizagi.renderingflat.tablet.form") + "#ui-bizagi-render-form"),
            self.loadTemplate("complexgateway", bizagi.getTemplate("bizagi.renderingflat.tablet.form") + "#ui-bizagi-render-complexGateway"),
            self.loadTemplate("panel", bizagi.getTemplate("bizagi.renderingflat.tablet.panel")),
            self.loadTemplate("tab", bizagi.getTemplate("bizagi.renderingflat.tablet.tab")),
            self.loadTemplate("tabItem", bizagi.getTemplate("bizagi.renderingflat.tablet.tabItem")),
            self.loadTemplate("horizontal", bizagi.getTemplate("bizagi.renderingflat.tablet.horizontal")),
            self.loadTemplate("accordion", bizagi.getTemplate("bizagi.renderingflat.tablet.accordion")),
            self.loadTemplate("accordionItem", bizagi.getTemplate("bizagi.renderingflat.tablet.accordionItem")),
            self.loadTemplate("group", bizagi.getTemplate("bizagi.renderingflat.tablet.group")),
            self.loadTemplate("searchForm", bizagi.getTemplate("bizagi.renderingflat.tablet.searchForm")),
            self.loadTemplate("contentPanel", bizagi.getTemplate("bizagi.renderingflat.tablet.contentPanel")),

            // Renders
            self.loadTemplate("render", bizagi.getTemplate("bizagi.renderingflat.tablet.render")),
            self.loadTemplate("render-layout", bizagi.getTemplate("bizagi.renderingflat.tablet.render.layout")),
            self.loadTemplate("text", bizagi.getTemplate("bizagi.renderingflat.tablet.text")),
            self.loadTemplate("extendedText", bizagi.getTemplate("bizagi.renderingflat.tablet.extendedText") + "#ui-bz-mobile-extended-text-control"),
            self.loadTemplate("readonlyExtendedText", bizagi.getTemplate("bizagi.renderingflat.tablet.extendedText") + "#ui-bz-mobile-readonly-extended-text-control"),
            self.loadTemplate("number", bizagi.getTemplate("bizagi.renderingflat.tablet.number") + "#ui-bz-mobile-number-control"),
            self.loadTemplate("readonlyNumber", bizagi.getTemplate("bizagi.renderingflat.tablet.number") + "#ui-bz-mobile-readonly-number-control"),
            self.loadTemplate("numberScientificNotation", bizagi.getTemplate("bizagi.renderingflat.tablet.numberScientificNotation")),
            self.loadTemplate("date", bizagi.getTemplate("bizagi.renderingflat.tablet.date") + "#bz-rn-date"),
            self.loadTemplate("readonlyDate", bizagi.getTemplate("bizagi.renderingflat.tablet.date") + "#bz-rn-readonly-date"),
            self.loadTemplate("yesno", bizagi.getTemplate("bizagi.renderingflat.tablet.yesno")),
            self.loadTemplate("check", bizagi.getTemplate("bizagi.renderingflat.tablet.check")),
            self.loadTemplate("combo", bizagi.getTemplate("bizagi.renderingflat.tablet.combo") + "#ui-bz-mobile-combo-control"),
            self.loadTemplate("readonlyCombo", bizagi.getTemplate("bizagi.renderingflat.tablet.combo") + "#ui-bz-mobile-readonly-combo-control"),
            self.loadTemplate("comboModalView", bizagi.getTemplate("bizagi.renderingflat.tablet.combo") + "#ui-bz-wp-popup-combo-control"),
            self.loadTemplate("list", bizagi.getTemplate("bizagi.renderingflat.tablet.list") + "#ui-bz-mobile-list-control"),
            self.loadTemplate("listModalView", bizagi.getTemplate("bizagi.renderingflat.tablet.list") + "#ui-bz-wp-popup-list-control"),
            self.loadTemplate("radio", bizagi.getTemplate("bizagi.renderingflat.tablet.radio")),
            self.loadTemplate("image", bizagi.getTemplate("bizagi.renderingflat.tablet.image") + "#ui-bizagi-render-image"),
            self.loadTemplate("image-item", bizagi.getTemplate("bizagi.renderingflat.tablet.image") + "#ui-bizagi-render-image-item"),
            self.loadTemplate("image-preview", bizagi.getTemplate("bizagi.renderingflat.tablet.image") + "#bz-rd-upload-render-edition"),
            self.loadTemplate("imageModalView", bizagi.getTemplate("bizagi.renderingflat.tablet.image") + "#ui-bizagi-render-image-modalview"),
            self.loadTemplate("upload", bizagi.getTemplate("bizagi.renderingflat.tablet.upload") + "#ui-bz-mobile-upload-control"),
            self.loadTemplate("uploadModalView", bizagi.getTemplate("bizagi.renderingflat.tablet.upload") + "#ui-bz-wp-popup-upload-control"),
            self.loadTemplate("uploadItem", bizagi.getTemplate("bizagi.renderingflat.tablet.uploadItem")),
            self.loadTemplate("uploadSlide", bizagi.getTemplate("bizagi.renderingflat.tablet.slide.upload")),
            self.loadTemplate("grid", bizagi.getTemplate("bizagi.renderingflat.tablet.grid")),
            self.loadTemplate("cell", bizagi.getTemplate("bizagi.renderingflat.tablet.cell")),
            self.loadTemplate("cell.readonly", bizagi.getTemplate("bizagi.renderingflat.tablet.cell.readonly")),
            self.loadTemplate("cell.upload", bizagi.getTemplate("bizagi.renderingflat.tablet.cell.upload")),
            self.loadTemplate("search", bizagi.getTemplate("bizagi.renderingflat.tablet.search") + "#ui-bz-mobile-search-control"),
            self.loadTemplate("readonlySearch", bizagi.getTemplate("bizagi.renderingflat.tablet.search") + "#ui-bz-mobile-readonly-search-control"),
            self.loadTemplate("searchAddItem", bizagi.getTemplate("bizagi.renderingflat.tablet.searchAddItem")),
            self.loadTemplate("searchItem", bizagi.getTemplate("bizagi.renderingflat.tablet.searchItem")),
            self.loadTemplate("searchList", bizagi.getTemplate("bizagi.renderingflat.tablet.searchList") + "#ui-bz-mobile-searchlist-control"),
            self.loadTemplate("searchListModalView", bizagi.getTemplate("bizagi.renderingflat.tablet.searchList") + "#ui-bz-wp-popup-searchlist-control"),
            self.loadTemplate("searchListModalViewAuxTemplates", bizagi.getTemplate("bizagi.renderingflat.tablet.searchList") + "#ui-bz-wp-searchlist-control-modalview-auxiliary-templates"),
            self.loadTemplate("searchListInputAuxTemplates", bizagi.getTemplate("bizagi.renderingflat.tablet.searchList") + "#ui-bz-wp-searchlist-control-input-auxiliary-templates"),
            self.loadTemplate("letter", bizagi.getTemplate("bizagi.renderingflat.tablet.letter")),
            self.loadTemplate("letter.readonly", bizagi.getTemplate("bizagi.renderingflat.tablet.letter.readonly")),
            self.loadTemplate("letter.dialog", bizagi.getTemplate("bizagi.renderingflat.tablet.dialog-letter")),
            self.loadTemplate("button", bizagi.getTemplate("bizagi.renderingflat.tablet.button")),
            self.loadTemplate("link", bizagi.getTemplate("bizagi.renderingflat.tablet.link")),
            self.loadTemplate("geolocation", bizagi.getTemplate("bizagi.renderingflat.tablet.geolocation")),
            self.loadTemplate("association", bizagi.getTemplate("bizagi.renderingflat.tablet.association")),
            self.loadTemplate("ecm", bizagi.getTemplate("bizagi.renderingflat.tablet.ecm") + "#bz-rn-ecm-view-default-item"),
            self.loadTemplate("ecm-metadata", bizagi.getTemplate("bizagi.renderingflat.tablet.ecm") + "#bz-rn-ecm-metadata"),
            self.loadTemplate("ecmModalView", bizagi.getTemplate("bizagi.renderingflat.tablet.ecm") + "#ui-bizagi-render-ecm-modalview"),
            self.loadTemplate("checkList", bizagi.getTemplate("bizagi.renderingflat.tablet.checkList")),
            self.loadTemplate("document", bizagi.getTemplate("bizagi.renderingflat.tablet.document") + "#bz-document-generator"),
            self.loadTemplate("document-item", bizagi.getTemplate("bizagi.renderingflat.tablet.document") + "#bz-document-generator-item"),
            self.loadTemplate("render-actionLauncher", bizagi.getTemplate("bizagi.renderingflat.tablet.actionLauncher") + "#bz-rendering-actionLauncher"),
            self.loadTemplate("render-actionLauncher-horizontal", bizagi.getTemplate("bizagi.renderingflat.tablet.actionLauncher") + "#bz-rendering-actionLauncher-horizontal"),
            self.loadTemplate("render-actionLauncher-vertical", bizagi.getTemplate("bizagi.renderingflat.tablet.actionLauncher") + "#bz-rendering-actionLauncher-vertical"),
            self.loadTemplate("render-actionLauncher-actions-to-execute", bizagi.getTemplate("bizagi.renderingflat.tablet.actionLauncher") + "#bz-rendering-actionLauncher-actions-to-execute"),
            self.loadTemplate("render-polymorphicLauncher", bizagi.getTemplate("bizagi.renderingflat.tablet.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher"),
            self.loadTemplate("render-polymorphicLauncher-vertical-tree", bizagi.getTemplate("bizagi.renderingflat.tablet.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-vertical-tree"),
            self.loadTemplate("render-polymorphicLauncher-vertical-tree-item", bizagi.getTemplate("bizagi.renderingflat.tablet.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-vertical-tree-item"),
            self.loadTemplate("render-polymorphicLauncher-actions-to-execute", bizagi.getTemplate("bizagi.renderingflat.tablet.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-actions-to-execute"),
            self.loadTemplate("render-polymorphicLauncher-confirm", bizagi.getTemplate("bizagi.renderingflat.tablet.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-confirm"),
            self.loadTemplate("readonly", bizagi.getTemplate("bizagi.renderingflat.tablet.readonly")),

            // Slide View
            self.loadTemplate("render-slide-view", bizagi.getTemplate("bizagi.renderingflat.tablet.slide.view")),
            self.loadTemplate("render-slide-view-item", bizagi.getTemplate("bizagi.renderingflat.tablet.slide.view.item")),

            //Renders Layouts
            self.loadTemplate("layout-image", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.image") + "#ui-bizagi-render-layout-image"),
            self.loadTemplate("layout-image64", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.image") + "#ui-bizagi-render-layout-image64"),
            self.loadTemplate("layout-label", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.label")),
            self.loadTemplate("layout-link", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.link")),
            self.loadTemplate("layout-text", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.text")),
            self.loadTemplate("layout-date-time", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.dateTime")),
            self.loadTemplate("layout-money", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.money")),
            self.loadTemplate("layout-number", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.number")),
            self.loadTemplate("layout-upload", bizagi.getTemplate("bizagi.renderingflat.tablet.layout.upload")),

            // Grid plugin stuff
            self.loadTemplate("bizagi.grid.grid", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid"),
            self.loadTemplate("bizagi.grid.waiting", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-waiting"),
            self.loadTemplate("bizagi.grid.table", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-table"),
            self.loadTemplate("bizagi.grid.table.empty", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-table-empty"),
            self.loadTemplate("bizagi.grid.column", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-column"),
            self.loadTemplate("bizagi.grid.column.special", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-column-special"),
            self.loadTemplate("bizagi.grid.row", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-row"),
            self.loadTemplate("bizagi.grid.row.buttons", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-row-buttons"),
            self.loadTemplate("bizagi.grid.cell", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-cell"),
            self.loadTemplate("bizagi.grid.cell.special", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-cell-special"),
            self.loadTemplate("bizagi.grid.pager", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-pager"),
            self.loadTemplate("bizagi.grid.buttons", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-buttons"),
            self.loadTemplate("bizagi.grid.dynamicpager", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-dynamic-pager"),
            self.loadTemplate("bizagi.grid.totalizer", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-totalizer"),

            // Grid Offline
            self.loadTemplate("bizagi.grid.buttons.offline", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-buttons-offline"),
            self.loadTemplate("bizagi.grid.row.buttons.offline", bizagi.getTemplate("bizagi.renderingflat.tablet.grid.component") + "#ui-bizagi-grid-row-buttons-offline")
        ).done(function () {
            // Resolve when all templates are loaded
            defer.resolve();
        });

        return defer.promise();
    },
    /**
     *
     * @param params
     * @returns {*}
     */
    getRender: function(params) {
        var self = this;
        var type = params.type;
        var data = params.data;

        var renderParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ container: params.parent });

        if (type === "grid") {
            // Review the offline status or context 
            if (bizagi.util.isTabletDevice()) {
                if (isOfflineForm) {
                    return new bizagi.rendering.grid.offline(renderParams);
                } else {
                    return new bizagi.rendering.grid(renderParams);
                }
            } else {
                return new bizagi.rendering.grid(renderParams);
            }
        }

        if (type === "upload") {
            // Review the offline status or context  
            if (bizagi.util.isTabletDevice()) {
                if (isOfflineForm) {
                    return new bizagi.rendering.upload.offline(renderParams);
                } else {
                    return new bizagi.rendering.upload(renderParams);
                }
            } else {
                return new bizagi.rendering.upload(renderParams);
            }
        }

        if (type === "number") {
            var properties = data.properties;
            if (properties && properties.dataType === 29) {
                return new bizagi.rendering.numberScientificNotation(renderParams);
            }

        }

        // Call base
        return self._super(params);
    },
    /**
     * Returns the appropiate column based on the render type
     * @param params
     * @return {*}
     */
    getColumn: function(params) {
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
    }
});