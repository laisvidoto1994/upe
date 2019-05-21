/*
 *   Name: BizAgi Desktop Render Factory
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a render factory to create desktop versions of each render type
 */

bizagi.rendering.base.factory.extend("bizagi.rendering.desktop.factory", {}, {
    /*
     *   Constructor
     */
    init: function (dataService) {
        var self = this;
        // Call base
        self._super(dataService);

        // Desktop implementation
        this.printVersion = false;
    },
    /*
     *   Load all the templates used for rendering
     */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            // Common
            self.loadTemplate("form-error", bizagi.getTemplate("bizagi.rendering.desktop.form-error")),
            self.loadTemplate("form-waiting", bizagi.getTemplate("bizagi.rendering.desktop.form-waiting")),
            self.loadTemplate("info-message", bizagi.getTemplate("common.bizagi.desktop.info-message")),
            // Containers
            self.loadTemplate("form", bizagi.getTemplate("bizagi.rendering.desktop.form") + "#ui-bizagi-render-form"),
            self.loadTemplate("form-process-path", bizagi.getTemplate("bizagi.rendering.desktop.form") + "#ui-bizagi-render-form-process-path"),
            self.loadTemplate("panel", bizagi.getTemplate("bizagi.rendering.desktop.panel")),
            self.loadTemplate("contentPanel", bizagi.getTemplate("bizagi.rendering.desktop.contentPanel")),
            self.loadTemplate("tab", bizagi.getTemplate("bizagi.rendering.desktop.tab")),
            self.loadTemplate("tabItem", bizagi.getTemplate("bizagi.rendering.desktop.tabItem")),
            self.loadTemplate("collectionnavigator", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator"),
            self.loadTemplate("collectionnavigator-form-button", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-form-button"),
            self.loadTemplate("collectionnavigator-control", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-control"),
            self.loadTemplate("collectionnavigator-actions", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-actions"),
            self.loadTemplate("collectionnavigator-control-rtl", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-control-rtl"),
            self.loadTemplate("collectionnavigator-actions-rtl", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-actions-rtl"),
            self.loadTemplate("collectionnavigator-preview", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-preview"),
            self.loadTemplate("collectionnavigator-execution", bizagi.getTemplate("bizagi.rendering.desktop.collectionnavigator") + "#ui-bizagi-render-collectionnavigator-execution"),
            self.loadTemplate("horizontal", bizagi.getTemplate("bizagi.rendering.desktop.horizontal")),
            self.loadTemplate("accordion", bizagi.getTemplate("bizagi.rendering.desktop.accordion")),
            self.loadTemplate("accordionItem", bizagi.getTemplate("bizagi.rendering.desktop.accordionItem")),
            self.loadTemplate("group", bizagi.getTemplate("bizagi.rendering.desktop.group")),
            self.loadTemplate("searchForm", bizagi.getTemplate("bizagi.rendering.desktop.searchForm")),
            // Renders
            self.loadTemplate("render", bizagi.getTemplate("bizagi.rendering.desktop.render")),
	
            self.loadTemplate("render-layout", bizagi.getTemplate("bizagi.rendering.desktop.render.layout")),

            self.loadTemplate("render-userPassword", bizagi.getTemplate("bizagi.rendering.desktop.userPassword") + "#bz-rendering-userPassword"),
            self.loadTemplate("render-getUser", bizagi.getTemplate("bizagi.rendering.desktop.getUser") + "#bz-rendering-getUser"),
            self.loadTemplate("render-user-email", bizagi.getTemplate("bizagi.rendering.desktop.userEmail") + "#bz-rendering-user-email"),
            self.loadTemplate("render-comboSelected", bizagi.getTemplate("bizagi.rendering.desktop.comboSelected") + "#bz-rendering-comboSelected"),
            self.loadTemplate("render-comboSelectedReadOnly", bizagi.getTemplate("bizagi.rendering.desktop.comboSelected") + "#bz-rendering-comboSelected-ReadOnly"),
            self.loadTemplate("render-querySearchUser", bizagi.getTemplate("bizagi.rendering.desktop.querySearchUser") + "#ui-bizagi-render-querySearchUser"),
            self.loadTemplate("text", bizagi.getTemplate("bizagi.rendering.desktop.text") + "#ui-bizagi-render-text"),
            self.loadTemplate("text-read-only", bizagi.getTemplate("bizagi.rendering.desktop.text") + "#ui-bizagi-render-text-read-only"),
            self.loadTemplate("extendedText", bizagi.getTemplate("bizagi.rendering.desktop.extendedText")),
            self.loadTemplate("number", bizagi.getTemplate("bizagi.rendering.desktop.number")),
            self.loadTemplate("numberScientificNotation", bizagi.getTemplate("bizagi.rendering.desktop.numberScientificNotation") + "#bz-rendering-numberScientificNotation"),
            self.loadTemplate("date", bizagi.getTemplate("bizagi.rendering.desktop.date")),
            self.loadTemplate("yesno", bizagi.getTemplate("bizagi.rendering.desktop.yesno")),
            self.loadTemplate("check", bizagi.getTemplate("bizagi.rendering.desktop.check")),
            self.loadTemplate("combo", bizagi.getTemplate("bizagi.rendering.desktop.combo")),
            self.loadTemplate("list", bizagi.getTemplate("bizagi.rendering.desktop.list")),
            self.loadTemplate("geolocation", bizagi.getTemplate("bizagi.rendering.desktop.geolocation")),
            self.loadTemplate("radio", bizagi.getTemplate("bizagi.rendering.desktop.radio")),
            self.loadTemplate("image", bizagi.getTemplate("bizagi.rendering.desktop.image") + "#ui-bizagi-render-image"),
            self.loadTemplate("image-noflash", bizagi.getTemplate("bizagi.rendering.desktop.image.noflash") + "#ui-bizagi-render-image-noflash"),
            self.loadTemplate("image-html5", bizagi.getTemplate("bizagi.rendering.desktop.image.html5") + "#ui-bizagi-render-image-html5"),
            self.loadTemplate("image-dialog", bizagi.getTemplate("bizagi.rendering.desktop.image.noflash") + "#ui-bizagi-render-image-dialog-noflash"),
            self.loadTemplate("image-item", bizagi.getTemplate("bizagi.rendering.desktop.image") + "#ui-bizagi-render-image-item"),
            self.loadTemplate("image-item-noflash", bizagi.getTemplate("bizagi.rendering.desktop.image.noflash") + "#ui-bizagi-render-image-item-noflash"),
            self.loadTemplate("image-item-html5", bizagi.getTemplate("bizagi.rendering.desktop.image.html5") + "#ui-bizagi-render-image-item-html5"),
            //self.loadTemplate("upload-ecm", bizagi.getTemplate("bizagi.rendering.desktop.ecm")),
            self.loadTemplate("upload-ecm-view-default", bizagi.getTemplate("bizagi.rendering.desktop.ecm") + "#biz-render-ecm-view-default"),
            self.loadTemplate("upload-ecm-view-default-metadata", bizagi.getTemplate("bizagi.rendering.desktop.ecm") + "#biz-render-ecm-view-default-metadata"),
            self.loadTemplate("upload-ecm-view-default-yesno", bizagi.getTemplate("bizagi.rendering.desktop.ecm") + "#biz-render-ecm-view-default-yesno"),
            self.loadTemplate("upload-ecm-view-default-edit-buttons", bizagi.getTemplate("bizagi.rendering.desktop.ecm") + "#biz-render-ecm-view-default-edit-buttons"),
            self.loadTemplate("document", bizagi.getTemplate("bizagi.rendering.desktop.document") + "#bz-document-generator"),
            self.loadTemplate("document-item", bizagi.getTemplate("bizagi.rendering.desktop.document") + "#bz-document-generator-item"),
            self.loadTemplate("document-column-item", bizagi.getTemplate("bizagi.rendering.desktop.document") + "#bz-document-generator-column-item"),
            self.loadTemplate("document-item-preview", bizagi.getTemplate("bizagi.rendering.desktop.document") + "#bz-document-generator-item-preview"),
            self.loadTemplate("document-item-preview-object", bizagi.getTemplate("bizagi.rendering.desktop.document") + "#bz-document-generator-item-preview-object"),
            self.loadTemplate("upload", bizagi.getTemplate("bizagi.rendering.desktop.upload")),
            self.loadTemplate("uploadItem", bizagi.getTemplate("bizagi.rendering.desktop.uploadItem")),
            self.loadTemplate("upload.noFlash", bizagi.getTemplate("bizagi.rendering.desktop.upload.noFlash")),
            self.loadTemplate("uploadHtml5", bizagi.getTemplate("bizagi.rendering.desktop.upload.html5")),
            self.loadTemplate("upload.dialog", bizagi.getTemplate("bizagi.rendering.desktop.upload.dialog")),
            self.loadTemplate("upload.template.dialog", bizagi.getTemplate("bizagi.rendering.desktop.upload.template.dialog")),
            self.loadTemplate("upload.ecm.dialog", bizagi.getTemplate("bizagi.rendering.desktop.upload.ecm.dialog")),
            self.loadTemplate("dialog-send-email", bizagi.getTemplate("bizagi.rendering.desktop.dialog-sendEmail") + "#dialog-send-email"),
            self.loadTemplate("dialog-send-email-rtl", bizagi.getTemplate("bizagi.rendering.desktop.dialog-sendEmail") + "#dialog-send-email-rtl"),
            self.loadTemplate("grid", bizagi.getTemplate("bizagi.rendering.desktop.grid")),
            self.loadTemplate("cell", bizagi.getTemplate("bizagi.rendering.desktop.cell")),
            self.loadTemplate("cell.readonly", bizagi.getTemplate("bizagi.rendering.desktop.cell.readonly")),
            self.loadTemplate("cell.summary", bizagi.getTemplate("bizagi.rendering.desktop.cell.summary")),
            self.loadTemplate("cell.upload", bizagi.getTemplate("bizagi.rendering.desktop.cell.upload")),
            self.loadTemplate("cell.button", bizagi.getTemplate("bizagi.rendering.desktop.cell.button")),
            self.loadTemplate("search", bizagi.getTemplate("bizagi.rendering.desktop.search")),
            self.loadTemplate("searchItem", bizagi.getTemplate("bizagi.rendering.desktop.searchItem")),
            self.loadTemplate("searchList", bizagi.getTemplate("bizagi.rendering.desktop.searchList")),
            self.loadTemplate("letter", bizagi.getTemplate("bizagi.rendering.desktop.letter")),
            self.loadTemplate("letter.readonly", bizagi.getTemplate("bizagi.rendering.desktop.letter.readonly")),
            self.loadTemplate("letter.dialog", bizagi.getTemplate("bizagi.rendering.desktop.dialog-letter")),
            self.loadTemplate("button", bizagi.getTemplate("bizagi.rendering.desktop.button")),
            self.loadTemplate("fileprint", bizagi.getTemplate("bizagi.rendering.desktop.fileprint") + "#ui-bizagi-render-fileprint"),
            self.loadTemplate("fileprint-object", bizagi.getTemplate("bizagi.rendering.desktop.fileprint") + "#ui-bizagi-render-fileprint-object"),
            self.loadTemplate("fileprint-iframe", bizagi.getTemplate("bizagi.rendering.desktop.fileprint") + "#ui-bizagi-render-fileprint-iframe"),
            self.loadTemplate("link", bizagi.getTemplate("bizagi.rendering.desktop.link")),
            self.loadTemplate("association", bizagi.getTemplate("bizagi.rendering.desktop.association")),
            self.loadTemplate("stakeholder", bizagi.getTemplate("bizagi.rendering.desktop.stakeholder") + "#bz-rendering-stakeholder"),
            self.loadTemplate("stakeholder-grid", bizagi.getTemplate("bizagi.rendering.desktop.stakeholder") + "#bz-rendering-stakeholder-grid"),
            self.loadTemplate("stakeholder-paginator", bizagi.getTemplate("bizagi.rendering.desktop.stakeholder") + "#bz-rendering-stakeholder-paginator"),
            self.loadTemplate("queryProcess", bizagi.getTemplate("bizagi.rendering.desktop.queryProcess") + "#ui-bizagi-render-query-process"),
            self.loadTemplate("checkList", bizagi.getTemplate("bizagi.rendering.desktop.checkList")),

            //render layout controls
            self.loadTemplate("layout-link", bizagi.getTemplate("bizagi.rendering.desktop.layout.link")),
            self.loadTemplate("layout-image", bizagi.getTemplate("bizagi.rendering.desktop.layout.image") + "#ui-bizagi-render-layout-image"),
            self.loadTemplate("layout-image64", bizagi.getTemplate("bizagi.rendering.desktop.layout.image") + "#ui-bizagi-render-layout-image64"),
            self.loadTemplate("layout-label", bizagi.getTemplate("bizagi.rendering.desktop.layout.label")),
            self.loadTemplate("layout-text", bizagi.getTemplate("bizagi.rendering.desktop.layout.text")),
            self.loadTemplate("layout-upload", bizagi.getTemplate("bizagi.rendering.desktop.layout.upload")),
            self.loadTemplate("layout-uploadItem", bizagi.getTemplate("bizagi.rendering.desktop.layout.uploadItem")),
            self.loadTemplate("layout-date-time", bizagi.getTemplate("bizagi.rendering.desktop.layout.dateTime")),
            self.loadTemplate("layout-number", bizagi.getTemplate("bizagi.rendering.desktop.layout.number")),
            self.loadTemplate("layout-money", bizagi.getTemplate("bizagi.rendering.desktop.layout.money")),
            self.loadTemplate("layout-placeholder", bizagi.getTemplate("bizagi.rendering.desktop.layout.placeholder")),
            self.loadTemplate("layout-boolean", bizagi.getTemplate("bizagi.rendering.desktop.layout.yesno")),

            //action launcher
            self.loadTemplate("render-actionLauncher", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher"),
            self.loadTemplate("render-actionLauncher-horizontal", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher-horizontal"),
            self.loadTemplate("render-actionLauncher-horizontal-more", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher-horizontal-more"),
            self.loadTemplate("render-actionLauncher-vertical", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher-vertical"),
            self.loadTemplate("render-actionLauncher-actions-to-execute", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher-actions-to-execute"),
            self.loadTemplate("render-actionLauncher-design", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher-design"),
            self.loadTemplate("render-actionLauncher-confirm", bizagi.getTemplate("bizagi.rendering.desktop.actionLauncher") + "#bz-rendering-actionLauncher-confirm"),

            self.loadTemplate("render-polymorphicLauncher", bizagi.getTemplate("bizagi.rendering.desktop.polymorphicLauncher") +                    "#bz-rendering-polymorphicLauncher"),
            self.loadTemplate("render-polymorphicLauncher-vertical-tree", bizagi.getTemplate("bizagi.rendering.desktop.polymorphicLauncher") +      "#bz-rendering-polymorphicLauncher-vertical-tree"),
            self.loadTemplate("render-polymorphicLauncher-vertical-tree-item", bizagi.getTemplate("bizagi.rendering.desktop.polymorphicLauncher") +      "#bz-rendering-polymorphicLauncher-vertical-tree-item"),
            self.loadTemplate("render-polymorphicLauncher-actions-to-execute", bizagi.getTemplate("bizagi.rendering.desktop.polymorphicLauncher") + "#bz-rendering-polymorphicLauncher-actions-to-execute"),
            self.loadTemplate("render-polymorphicLauncher-design", bizagi.getTemplate("bizagi.rendering.desktop.polymorphicLauncher") +             "#bz-rendering-polymorphicLauncher-design"),
            self.loadTemplate("render-polymorphicLauncher-confirm", bizagi.getTemplate("bizagi.rendering.desktop.polymorphicLauncher") +            "#bz-rendering-polymorphicLauncher-confirm"),


            (bizagi.override.enablePrintFromEditForm) ? self.loadTemplate("print-frame", bizagi.getTemplate("bizagi.workportal.desktop.widget.print") + "#bz-wp-widget-print-frame") : null, (bizagi.override.enablePrintFromEditForm) ? self.loadTemplate("print-frame-header", bizagi.getTemplate("bizagi.workportal.desktop.widget.print") + "#bz-wp-widget-print-frame-header") : null,

            //Bizagi grid
            self.loadTemplate("grid.bizagi", bizagi.getTemplate("bizagi.rendering.desktop.grid.component")),
            self.loadTemplate("bizagi.grid.grid", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid"),
            self.loadTemplate("bizagi.grid.grid.rtl", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-rtl"),
            self.loadTemplate("bizagi.grid.waiting", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-waiting"),
            self.loadTemplate("bizagi.grid.table", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-table"),
            self.loadTemplate("bizagi.grid.table.empty", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-table-empty"),
            self.loadTemplate("bizagi.grid.column", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-column"),
            self.loadTemplate("bizagi.grid.column.special", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-column-special"),
            self.loadTemplate("bizagi.grid.row", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-row"),
            self.loadTemplate("bizagi.grid.row.buttons", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-row-buttons"),
            self.loadTemplate("bizagi.grid.row.buttons.rtl", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-row-buttons-rtl"),
            self.loadTemplate("bizagi.grid.cell", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-cell"),
            self.loadTemplate("bizagi.grid.cell.special", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-cell-special"),
            //Grig Pager based on inboxgrid pager
            self.loadTemplate("bizagi.grid.pagination", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-pagination"),
            self.loadTemplate("bizagi.grid.pager", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-pager"),
            self.loadTemplate("bizagi.grid.buttons", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-buttons"),
            self.loadTemplate("bizagi.grid.buttons.rtl", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-buttons-rtl"),
            self.loadTemplate("bizagi.grid.dynamicpager", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-dynamic-pager"),
            self.loadTemplate("bizagi.grid.summary", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-summary"),
            self.loadTemplate("bizagi.grid.summaryCell", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-summary-cell"),
            // Grouped grid
            self.loadTemplate("bizagi.grid.grouped.table", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-table"),
            self.loadTemplate("bizagi.grid.grouped.column", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-column"),
            self.loadTemplate("bizagi.grid.grouped.row", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-row"),
            self.loadTemplate("bizagi.grid.grouped.header.row", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-header-row"),
            self.loadTemplate("bizagi.grid.grouped.summary", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-summary"),
            self.loadTemplate("bizagi.grid.grouped.summaryCell", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-summary-cell"),
            self.loadTemplate("bizagi.grid.grouped.emptyCell", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-grouped-empty-cell"),
            //plugin search user
            self.loadTemplate("bizagi.plugin.search.user", bizagi.getTemplate("bizagi.plugin.searchuser") + "#ui-bizagi-plugin-search-user"),
            self.loadTemplate("gridActions", bizagi.getTemplate("bizagi.rendering.desktop.gridActions")),

            //Range control
            self.loadTemplate("render-range", bizagi.getTemplate("bizagi.rendering.desktop.range") + "#bz-rendering-range"),

            self.loadTemplate("bizagi.grid.exportOptions", bizagi.getTemplate("bizagi.rendering.desktop.grid.bizagi") + "#ui-bizagi-grid-export-options")).done(function () {

                // Resolve when all templates are loaded
                defer.resolve();
                
            });

        return defer.promise();
    },
    /*
     *   Returns the appropiate render based on the render type
     */
    getRender: function (params) {
        var self = this;
        var type = params.type;
        var data = params.data;
        var renderParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });

        if (type == "image") {
            // Override for test purposes
            if (self.enableFlashControls && self.hasFlash) {
                return new bizagi.rendering.image(renderParams);
            } else {
                //Check if the engine is Windows 8 App
                if (typeof Windows === "undefined") {
                    // TODO: Implement all functionalities of flash version in to uploadhtml5 control
                    return new bizagi.rendering.imageNoFlash(renderParams);
                } else {
                    //its windows 8
                    return new bizagi.rendering.imageHtml5(renderParams);
                }
            }
        }

        if (type == "upload") {
            // Upload control with flash now its deprecated
            // return new bizagi.rendering.upload(renderParams);

            //Check if the engine is Windows 8 App
            if (typeof Windows === "undefined") {
                // TODO: Implement all functionalities of flash version in to uploadhtml5 control
                return new bizagi.rendering.uploadNoFlash(renderParams);
            } else {
                //its windows 8
                if (typeof (bizagi.context.isOfflineForm) != "undefined" && bizagi.context.isOfflineForm) {
                    return new bizagi.rendering.upload.offline(renderParams);
                } else {
                    return new bizagi.rendering.uploadHtml5(renderParams);
                }
            }
        }

        if (type == "uploadecm") {
            return new bizagi.rendering.ecm(renderParams);
        }

        if (type == "grid") {
            var properties = data.properties;

            if (typeof (bizagi.context.isOfflineForm) != "undefined" && bizagi.context.isOfflineForm) {
                return new bizagi.rendering.grid.offline(renderParams);
            } else {
                return new bizagi.rendering.grid.bizagi(renderParams);
            }
        }

        if (type == "groupedgrid") {
            var properties = data.properties;
            return new bizagi.rendering.grid.grouped(renderParams);
        }

        if (type == "collectionnavigator") {
            return new bizagi.rendering.collectionnavigator(renderParams);
        }

        // Call base

        if (type == "querySearchUser") {
            return new bizagi.rendering.querySearchUser(renderParams);
        }


        if (type == "comboSelected") {
            return new bizagi.rendering.comboSelected(renderParams);
        }


        if (type == "userPassword") {
            return new bizagi.rendering.userPassword(renderParams);
        }

	if (type == "stakeholder") {
            return new bizagi.rendering.stakeholder(renderParams);
        }
	
	if (type == "number") {
		var properties = data.properties;
		if(properties && properties.dataType === 29) {
		                return new bizagi.rendering.numberScientificNotation(renderParams);
            }

        }

	
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

        if (type == "columnUpload") {
            //Check if the engine is Windows 8 App
            if (typeof Windows === "undefined") {
                if (self.enableFlashControls && self.hasFlash) {
                    columnParams.decorated = bizagi.rendering.upload;
                } else {
                    columnParams.decorated = bizagi.rendering.uploadNoFlash;
                }
                return new bizagi.rendering.columns.upload(columnParams);
            } else {
                //its windows 8
                columnParams.decorated = bizagi.rendering.uploadHtml5;
                return new bizagi.rendering.columns.uploadHtml5(columnParams);
            }
        }

        if (type == "columnImage") {
            if (self.enableFlashControls && self.hasFlash) {
                columnParams.decorated = bizagi.rendering.image;
            } else {
                columnParams.decorated = bizagi.rendering.imageNoFlash;
            }

            return new bizagi.rendering.columns.image(columnParams);
        }

        if (type == "columnNumber") {
            var data = params.data;
            var properties = data.properties;
            if(properties && properties.dataType === 29) {
                columnParams.decorated = bizagi.rendering.numberScientificNotation;
                return new bizagi.rendering.columns.numberScientificNotation(columnParams);
            }
        }

        if (type == "columnNumberScientificNotation") {
            columnParams.decorated = bizagi.rendering.numberScientificNotation;
            return new bizagi.rendering.columns.numberScientificNotation(columnParams);
        }
        if (type == "columnActions") {
            columnParams.decorated = bizagi.rendering.gridActions;
            return new bizagi.rendering.columns.actions(columnParams);
        }

        // Call base
        return self._super(params);
    }
});
