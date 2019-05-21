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
            self.loadTemplate("form", bizagi.getTemplate("bizagi.rendering.smartphone.form") + "#ui-bizagi-render-form"),
            self.loadTemplate("panel", bizagi.getTemplate("bizagi.rendering.smartphone.panel")),
            self.loadTemplate("tab", bizagi.getTemplate("bizagi.rendering.smartphone.tab")),
            self.loadTemplate("tabItem", bizagi.getTemplate("bizagi.rendering.smartphone.tabItem")),
            self.loadTemplate("horizontal", bizagi.getTemplate("bizagi.rendering.smartphone.horizontal")),
            self.loadTemplate("group", bizagi.getTemplate("bizagi.rendering.smartphone.group")),
            self.loadTemplate("editRender", bizagi.getTemplate("bizagi.rendering.smartphone.edit")),
            self.loadTemplate("searchForm", bizagi.getTemplate("bizagi.rendering.smartphone.searchForm")),
            self.loadTemplate("accordion", bizagi.getTemplate("bizagi.rendering.smartphone.accordion")),
            self.loadTemplate("accordionItem", bizagi.getTemplate("bizagi.rendering.smartphone.accordionItem")),
            self.loadTemplate("contentPanel", bizagi.getTemplate("bizagi.rendering.smartphone.contentPanel")),
        // Renders
            self.loadTemplate("render", bizagi.getTemplate("bizagi.rendering.smartphone.render")),
            self.loadTemplate("text", bizagi.getTemplate("bizagi.rendering.smartphone.text")),
            self.loadTemplate("number", bizagi.getTemplate("bizagi.rendering.smartphone.number")),
            self.loadTemplate("extendedText", bizagi.getTemplate("bizagi.rendering.smartphone.extendedText")),
            self.loadTemplate("yesno", bizagi.getTemplate("bizagi.rendering.smartphone.yesno")),
            self.loadTemplate("check", bizagi.getTemplate("bizagi.rendering.smartphone.check")),
            self.loadTemplate("button", bizagi.getTemplate("bizagi.rendering.smartphone.button")),
            self.loadTemplate("link", bizagi.getTemplate("bizagi.rendering.smartphone.link")),
            self.loadTemplate("geolocation", bizagi.getTemplate("bizagi.rendering.smartphone.geolocation")),
            self.loadTemplate("radio", bizagi.getTemplate("bizagi.rendering.smartphone.radio")),
            self.loadTemplate("upload", bizagi.getTemplate("bizagi.rendering.smartphone.upload") + "#bz-rn-upload-container"),
            self.loadTemplate("uploadItem", bizagi.getTemplate("bizagi.rendering.smartphone.upload") + "#bz-rn-upload-item"),
            self.loadTemplate('association', bizagi.getTemplate('bizagi.rendering.smartphone.association')),
            self.loadTemplate("ecm", bizagi.getTemplate("bizagi.rendering.smartphone.ecm") + "#bz-rn-ecm-view-default-item"),
            self.loadTemplate("ecm-metadata", bizagi.getTemplate("bizagi.rendering.smartphone.ecm") + "#bz-rn-ecm-metadata"),
            self.loadTemplate('searchList', bizagi.getTemplate('bizagi.rendering.smartphone.searchList')),
            self.loadTemplate("image", bizagi.getTemplate("bizagi.rendering.smartphone.image") + "#ui-bizagi-render-image"),
            self.loadTemplate("image-item", bizagi.getTemplate("bizagi.rendering.smartphone.image") + "#ui-bizagi-render-image-item"),
            self.loadTemplate("document", bizagi.getTemplate("bizagi.rendering.smartphone.document") + "#bz-document-generator"),
            self.loadTemplate("document-item", bizagi.getTemplate("bizagi.rendering.smartphone.document") + "#bz-document-generator-item"),
            self.loadTemplate("document-item-preview", bizagi.getTemplate("bizagi.rendering.smartphone.document") + "#bz-document-generator-item-preview"),

        //Renders Edition
            self.loadTemplate("edition.text", bizagi.getTemplate("bizagi.rendering.smartphone.edition.text")),
            self.loadTemplate("edition.extendedText", bizagi.getTemplate("bizagi.rendering.smartphone.edition.extendedText")),
            self.loadTemplate("edition.number", bizagi.getTemplate("bizagi.rendering.smartphone.edition.number")),
            self.loadTemplate("edition.date", bizagi.getTemplate("bizagi.rendering.smartphone.edition.date") + "#bz-rn-date"),
            self.loadTemplate("edition.time", bizagi.getTemplate("bizagi.rendering.smartphone.edition.date") + "#bz-rn-time"),
            self.loadTemplate("combo", bizagi.getTemplate("bizagi.rendering.smartphone.combo")),
            self.loadTemplate("edition.combo", bizagi.getTemplate("bizagi.rendering.smartphone.edition.combo")),
            self.loadTemplate("edition.search", bizagi.getTemplate("bizagi.rendering.smartphone.edition.search") + "#bz-rn-search"),
            self.loadTemplate("edition.search.item", bizagi.getTemplate("bizagi.rendering.smartphone.edition.search") + "#bz-rn-search-item"),
            self.loadTemplate("edition.link", bizagi.getTemplate("bizagi.rendering.smartphone.edition.link")),
            self.loadTemplate("edition.list", bizagi.getTemplate("bizagi.rendering.smartphone.edition.list")),
            self.loadTemplate("edition.letter", bizagi.getTemplate("bizagi.rendering.smartphone.edition.letter")),
            self.loadTemplate("edition.upload.menu", bizagi.getTemplate("bizagi.rendering.smartphone.edition.upload") + "#bz-rn-upload-menu"),

        //Renders commons
            self.loadTemplate("form-error", bizagi.getTemplate("bizagi.rendering.smartphone.form-error")),
            self.loadTemplate("form-waiting", bizagi.getTemplate("bizagi.rendering.smartphone.form-waiting")),


        //GRIDS SMARTPHONES
            self.loadTemplate("grid", bizagi.getTemplate("bizagi.rendering.smartphone.grid")),
            self.loadTemplate("cell", bizagi.getTemplate("bizagi.rendering.smartphone.cell")),
        	self.loadTemplate("cell.readonly", bizagi.getTemplate("bizagi.rendering.smartphone.cell.readonly")),
        	self.loadTemplate("cell.upload", bizagi.getTemplate("bizagi.rendering.smartphone.cell.upload")),

        //searchForm

        //grid items
            self.loadTemplate("bizagi.grid.grid", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid"),
        	self.loadTemplate("bizagi.grid.waiting", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-waiting"),
        	self.loadTemplate("bizagi.grid.table", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-table"),
        	self.loadTemplate("bizagi.grid.table.empty", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-table-empty"),
        	self.loadTemplate("bizagi.grid.column", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-column"),
        	self.loadTemplate("bizagi.grid.column.special", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-column-special"),
        	self.loadTemplate("bizagi.grid.row", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-row"),
        	self.loadTemplate("bizagi.grid.row.buttons", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-row-buttons"),
        	self.loadTemplate("bizagi.grid.cell", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-cell"),
        	self.loadTemplate("bizagi.grid.cell.special", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-cell-special"),
        	self.loadTemplate("bizagi.grid.pager", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-pager"),
        	self.loadTemplate("bizagi.grid.buttons", bizagi.getTemplate("bizagi.rendering.smartphone.bizagi.grid") + "#ui-bizagi-grid-buttons")

        ).done(function () {

            // Resolve when all templates are loaded
            defer.resolve();
        });

        return defer.promise();
    }
});
