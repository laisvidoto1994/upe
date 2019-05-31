/*
*   Name: BizAgi Tablet Render Factory
*   Author: Diego Parra
*   Comments:
*   -   This script will define a render factory to create tablet versions of each render type
*/

bizagi.rendering.base.factory.extend("bizagi.rendering.tablet.factory", {}, {

    /*
    *   Load all the templates used for rendering
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
        // Common
            self.loadTemplate("form-error", bizagi.getTemplate("bizagi.rendering.tablet.form-error")),
        	self.loadTemplate("form-waiting", bizagi.getTemplate("bizagi.rendering.tablet.form-waiting")),

        // Containers
            self.loadTemplate("form", bizagi.getTemplate("bizagi.rendering.tablet.form") + "#ui-bizagi-render-form"),
            self.loadTemplate("complexgateway", bizagi.getTemplate("bizagi.rendering.tablet.form") + "#ui-bizagi-render-complexGateway"),
            self.loadTemplate("panel", bizagi.getTemplate("bizagi.rendering.tablet.panel")),
            self.loadTemplate("tab", bizagi.getTemplate("bizagi.rendering.tablet.tab")),
            self.loadTemplate("tabItem", bizagi.getTemplate("bizagi.rendering.tablet.tabItem")),
            self.loadTemplate("horizontal", bizagi.getTemplate("bizagi.rendering.tablet.horizontal")),
            self.loadTemplate("accordion", bizagi.getTemplate("bizagi.rendering.tablet.accordion")),
            self.loadTemplate("accordionItem", bizagi.getTemplate("bizagi.rendering.tablet.accordionItem")),
            self.loadTemplate("group", bizagi.getTemplate("bizagi.rendering.tablet.group")),
            self.loadTemplate("searchForm", bizagi.getTemplate("bizagi.rendering.tablet.searchForm")),
            self.loadTemplate("contentPanel", bizagi.getTemplate("bizagi.rendering.tablet.contentPanel")),

        // Renders
            self.loadTemplate("render", bizagi.getTemplate("bizagi.rendering.tablet.render")),
            self.loadTemplate("text", bizagi.getTemplate("bizagi.rendering.tablet.text")),
            self.loadTemplate("extendedText", bizagi.getTemplate("bizagi.rendering.tablet.extendedText")),
            self.loadTemplate("number", bizagi.getTemplate("bizagi.rendering.tablet.number")),
            self.loadTemplate("numberScientificNotation", bizagi.getTemplate("bizagi.rendering.tablet.numberScientificNotation")),
            self.loadTemplate("date", bizagi.getTemplate("bizagi.rendering.tablet.date")),
            self.loadTemplate("yesno", bizagi.getTemplate("bizagi.rendering.tablet.yesno")),
            self.loadTemplate("check", bizagi.getTemplate("bizagi.rendering.tablet.check")),
            self.loadTemplate("combo", bizagi.getTemplate("bizagi.rendering.tablet.combo")),
            self.loadTemplate("list", bizagi.getTemplate("bizagi.rendering.tablet.list")),
            self.loadTemplate("radio", bizagi.getTemplate("bizagi.rendering.tablet.radio")),
            self.loadTemplate("image", bizagi.getTemplate("bizagi.rendering.tablet.image") + "#ui-bizagi-render-image"),
            self.loadTemplate("image-item", bizagi.getTemplate("bizagi.rendering.tablet.image") + "#ui-bizagi-render-image-item"),
            self.loadTemplate("upload", bizagi.getTemplate("bizagi.rendering.tablet.upload")),
            self.loadTemplate("uploadItem", bizagi.getTemplate("bizagi.rendering.tablet.uploadItem")),
        	self.loadTemplate("uploadSlide", bizagi.getTemplate("bizagi.rendering.tablet.slide.upload")),
            self.loadTemplate("grid", bizagi.getTemplate("bizagi.rendering.tablet.grid")),
            self.loadTemplate("cell", bizagi.getTemplate("bizagi.rendering.tablet.cell")),
        	self.loadTemplate("cell.readonly", bizagi.getTemplate("bizagi.rendering.tablet.cell.readonly")),
        	self.loadTemplate("cell.upload", bizagi.getTemplate("bizagi.rendering.tablet.cell.upload")),
            self.loadTemplate("search", bizagi.getTemplate("bizagi.rendering.tablet.search")),
            self.loadTemplate("searchItem", bizagi.getTemplate("bizagi.rendering.tablet.searchItem")),
			self.loadTemplate('searchList', bizagi.getTemplate('bizagi.rendering.tablet.searchList')),
            self.loadTemplate("letter", bizagi.getTemplate("bizagi.rendering.tablet.letter")),
            self.loadTemplate("letter.readonly", bizagi.getTemplate("bizagi.rendering.tablet.letter.readonly")),
            self.loadTemplate("letter.dialog", bizagi.getTemplate("bizagi.rendering.tablet.dialog-letter")),
            self.loadTemplate("button", bizagi.getTemplate("bizagi.rendering.tablet.button")),
            self.loadTemplate("link", bizagi.getTemplate("bizagi.rendering.tablet.link")),
            self.loadTemplate("geolocation", bizagi.getTemplate("bizagi.rendering.tablet.geolocation")),
            self.loadTemplate('association', bizagi.getTemplate('bizagi.rendering.tablet.association')),
            self.loadTemplate('ecm', bizagi.getTemplate('bizagi.rendering.tablet.ecm') + "#bz-rn-ecm-view-default-item"),
            self.loadTemplate("ecm-metadata", bizagi.getTemplate("bizagi.rendering.tablet.ecm") + "#bz-rn-ecm-metadata"),

            self.loadTemplate("document", bizagi.getTemplate("bizagi.rendering.tablet.document") + "#bz-document-generator"),
            self.loadTemplate("document-item", bizagi.getTemplate("bizagi.rendering.tablet.document") + "#bz-document-generator-item"),
            self.loadTemplate("document-item-preview", bizagi.getTemplate("bizagi.rendering.tablet.document") + "#bz-document-generator-item-preview"),

        // Grid plugin stuff
        	self.loadTemplate("bizagi.grid.grid", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid"),
        	self.loadTemplate("bizagi.grid.waiting", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-waiting"),
        	self.loadTemplate("bizagi.grid.table", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-table"),
        	self.loadTemplate("bizagi.grid.table.empty", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-table-empty"),
        	self.loadTemplate("bizagi.grid.column", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-column"),
        	self.loadTemplate("bizagi.grid.column.special", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-column-special"),
        	self.loadTemplate("bizagi.grid.row", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-row"),
        	self.loadTemplate("bizagi.grid.row.buttons", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-row-buttons"),
        	self.loadTemplate("bizagi.grid.cell", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-cell"),
        	self.loadTemplate("bizagi.grid.cell.special", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-cell-special"),
        	self.loadTemplate("bizagi.grid.pager", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-pager"),
        	self.loadTemplate("bizagi.grid.buttons", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-buttons"),
            self.loadTemplate("bizagi.grid.dynamicpager", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-dynamic-pager"),

        // Grid Offline
            self.loadTemplate("bizagi.grid.buttons.offline", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-buttons-offline"),
            self.loadTemplate("bizagi.grid.row.buttons.offline", bizagi.getTemplate("bizagi.rendering.tablet.grid.component") + "#ui-bizagi-grid-row-buttons-offline")

        ).done(function () {

            // Resolve when all templates are loaded
            defer.resolve();
        });

        return defer.promise();
    },

    getRender: function(params) {
        var self = this;
        var type = params.type;
        var data = params.data;
        var renderParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });
        var properties;
        if (type == "grid") {
            // Review the offline status or context             
            if (typeof (bizagi.context.isOfflineForm) != "undefined" && bizagi.context.isOfflineForm) {
                return new bizagi.rendering.grid.offline(renderParams);
            } else {
                return new bizagi.rendering.grid(renderParams);
            }
        }

        if (type == "upload") {
            // Review the offline status or context              
            if (typeof(bizagi.context.isOfflineForm) != "undefined" && bizagi.context.isOfflineForm) {
                return new bizagi.rendering.upload.offline(renderParams);
            } else {
                return new bizagi.rendering.upload(renderParams);
            }
        }

        if (type == "number") {
            properties = data.properties;
            if (properties && properties.dataType === 29) {
                return new bizagi.rendering.numberScientificNotation(renderParams);
            }
        }

        // Call base
        return self._super(params);

    },

    /*
     *   Returns the appropiate column based on the render type
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
            if(properties && properties.dataType === 29) {
                columnParams.decorated = bizagi.rendering.numberScientificNotation;
                return new bizagi.rendering.columns.numberScientificNotation(columnParams);
            }
        }

        // Call base
        return self._super(params);
    }

});
