/*
 *   Name: BizAgi Base Render Factory
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define an abstract render factory in order to do common stuff for all device factories
 */

$.Class.extend("bizagi.rendering.base.factory", {}, {
    /* 
    *   Constructor
    */
    init: function (dataService) {
        this.templates = {};
        this.dataService = dataService;
    },
    /*
    *   This function will load asynchronous stuff needed in the module
    */
    initAsyncStuff: function () {
        return $.when(
                this.loadTemplates()
                );
    },
    /*
    *   Load all the templates used for rendering
    */
    loadTemplates: function () {
    },
    /*
    *   Load one template and save it internally
    */
    loadTemplate: function (template, templateDestination) {
        var self = this;

        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination, template)
                .done(function (resolvedRemplate) {
                    self.templates[template] = resolvedRemplate;
                });
    },
    /*
    * Returns a common  used template for the framework
    */
    getCommonTemplate: function (template) {
        var self = this;
        return self.templates[template];
    },
    /*
    *   Returns the appropiate container based on the container type
    */
    getContainer: function (params) {
        var type = params.type;
        var data = params.data;
        var containerParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });

        if (type == "form") {
            return new bizagi.rendering.form(containerParams);
        }

        if (type == "template") {
            return new bizagi.rendering.formTemplate(containerParams);
        }

        if (type == "queryForm") {
            return new bizagi.rendering.queryForm(containerParams);
        }

        if (type == "layout") {
            return new bizagi.rendering.layout(containerParams);
        }

        if (type == "usersForm") {
            return new bizagi.rendering.usersForm(containerParams);
        }

        if (type == "panel") {
            return new bizagi.rendering.panel(containerParams);
        }

        if (type == "contentPanel") {
            return new bizagi.rendering.contentPanel(containerParams);
        }

        if (type == "nestedForm") {
            return new bizagi.rendering.nestedForm(containerParams);
        }

        if (type == "tab") {
            return new bizagi.rendering.tab(containerParams);
        }

        if (type == "tabItem") {
            return new bizagi.rendering.tabItem(containerParams);
        }

        if (type == "horizontal") {
            return new bizagi.rendering.horizontal(containerParams);
        }

        if (type == "accordion") {
            return new bizagi.rendering.accordion(containerParams);
        }

        if (type == "accordionItem") {
            return new bizagi.rendering.accordionItem(containerParams);
        }

        if (type == "group") {
            return new bizagi.rendering.group(containerParams);
        }

        if (type == "searchForm") {
            containerParams.context = "search";
            containerParams.contexttype = "metadata";
            return new bizagi.rendering.searchForm(containerParams);
        }

        // No type supported
        bizagi.log(type + " not supported in render factory", data, "error");
        return null;
    },
    /*
    *   Returns the appropiate render based on the render type
    */
    getRender: function (params) {
        var type = params.type;
        var data = params.data;
        var renderParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });


        if (!type)
            type = "label";

        if (type == "text") {
            var isExtended = bizagi.util.parseBoolean(data.properties.isExtended) || false;

            if (isExtended) {
                // Creates one extended render
                return new bizagi.rendering.extendedText(renderParams);
            }

            // Creates one normal text render
            return new bizagi.rendering.text(renderParams);
        }
        if (type == "association") {
            return new bizagi.rendering.association(renderParams);
        }

        if (type == "label") {
            return new bizagi.rendering.label(renderParams);
        }

        if (type == "hidden") {
            return new bizagi.rendering.hidden(renderParams);
        }

        if (type == "number") {
            return new bizagi.rendering.number(renderParams);
        }

        if (type == "money") {
            return new bizagi.rendering.money(renderParams);
        }

        if (type == "date") {
            return new bizagi.rendering.date(renderParams);
        }

        if (type == "boolean") {
            var display = data.properties.display || "option";

            if (display == "check") {
                // Creates one check render
                return new bizagi.rendering.check(renderParams);
            }

            // Creates one yes-no render
            return new bizagi.rendering.yesno(renderParams);
        }

        if (type == "combo") {
            return new bizagi.rendering.combo(renderParams);
        }

        if (type == "cascadingCombo") {
            return new bizagi.rendering.cascadingCombo(renderParams);
        }

        if (type == "list") {
            return new bizagi.rendering.list(renderParams);
        }

        if (type == "radio") {
            return new bizagi.rendering.radio(renderParams);
        }

        if (type == "image") {
            // Override for test purposes
            return new bizagi.rendering.image(renderParams);
        }
        if (type == "uploadecm") {
            // Check if its ECM file            
            return new bizagi.rendering.ecm(renderParams);
        }

        if (type == "upload") {
            return new bizagi.rendering.upload(renderParams);
        }
        if (type == "grid") {
            return new bizagi.rendering.grid(renderParams);
        }

        if (type == "groupedgrid") {
            return new bizagi.rendering.grid(renderParams);
        }

        if (type == "search") {
            return new bizagi.rendering.search(renderParams);
        }

        if (type == "searchList") {
            return new bizagi.rendering.searchList(renderParams);
        }

        if (type == "letter") {
            return new bizagi.rendering.letter(renderParams);
        }

        if (type == "button") {
            return new bizagi.rendering.button(renderParams);
        }

        if (type == "formLink") {
            return new bizagi.rendering.formLink(renderParams);
        }

        if (type == "link") {
            return new bizagi.rendering.link(renderParams);
        }

        if (type == "layoutImage") {
            return new bizagi.rendering.layoutImage(renderParams);
        }

        if (type == "layoutLink") {
            return new bizagi.rendering.layoutLink(renderParams);
        }

        if (type == "layoutLabel") {
            return new bizagi.rendering.layoutLabel(renderParams);
        }

        if (type == "layoutText") {
            return new bizagi.rendering.layoutText(renderParams);
        }

        if (type == "layoutDateTime") {
            return new bizagi.rendering.layoutDateTime(renderParams);
        }

        if (type == "layoutNumber") {
            return new bizagi.rendering.layoutNumber(renderParams);
        }

        if (type == "layoutMoney") {
            return new bizagi.rendering.layoutMoney(renderParams);
        }

        if (type == "layoutPlaceholder") {
            return new bizagi.rendering.layoutPlaceholder(renderParams);
        }

        if (type == "actionLauncher") {
            return new bizagi.rendering.actionLauncher(renderParams);
        }

        if (type == "layoutBoolean") {
            return new bizagi.rendering.layoutBoolean(renderParams);
        }

        if (type == "layoutUpload") {
            return new bizagi.rendering.layoutUpload(renderParams);
        }

        if (type == "entityTemplate") {
            return new bizagi.rendering.entityTemplate(renderParams);
        }

        if (type == "polymorphicLauncher") {
            return new bizagi.rendering.polymorphicLauncher(renderParams);
        }

        if (type == "userfield") {
            return new bizagi.rendering.userfieldWrapper(renderParams);
        }

        // Check search renders (starts with "search")
        if (type.indexOf("search") == 0) {
            return this.getSearchRender(params);
        }

        if (type.indexOf("query") == 0) {
            return this.getQueryRender(params);
        }

        if (type == "document") {
            return new bizagi.rendering.document(renderParams);
        }

        if (type == "image") {
            return new bizagi.rendering.image(renderParams);
        }
        if (type == "fileprint") {
            return new bizagi.rendering.fileprint(renderParams);
        }
        if (type == "geolocation") {
            return new bizagi.rendering.geolocation(renderParams);
        }

        if (type == "collectionnavigator") {
            return new bizagi.rendering.collectionnavigator(renderParams);
        }

        if (type == "getUser") {
            return new bizagi.rendering.getUser(renderParams);
        }

        if (type == "rangeDate") {
            return new bizagi.rendering.rangeDate(renderParams);
        }

        if (type == "rangeMoney") {
            return new bizagi.rendering.rangeMoney(renderParams);
        }

        if (type == "rangeNumber") {
            return new bizagi.rendering.rangeNumber(renderParams);
        }

        if (type == "activityCheckList") {
            return new bizagi.rendering.activityCheckList(renderParams);
        }

        // No type supported
        bizagi.log(type + " not supported in render factory", data, "error");
        return null;
    },
    /*
    *   Returns the appropiate column based on the render type
    */
    getColumn: function (params) {
        var type = params.type;
        var data = params.data;
        var columnParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService,
            singleInstance: bizagi.util.isEmpty(params.singleInstance) ? true : params.singleInstance
        });

        if (type == "columnText") {
            var isExtended = bizagi.util.parseBoolean(data.properties.isExtended) || false;

            if (isExtended) {
                // Creates one extended render
                columnParams.decorated = bizagi.rendering.extendedText;
            } else {
                // Creates one normal text render
                columnParams.decorated = bizagi.rendering.text;
            }
            return new bizagi.rendering.columns.text(columnParams);
        }

        if (type == "columnSearchList") {
            columnParams.decorated = bizagi.rendering.searchList;
            return new bizagi.rendering.columns.searchList(columnParams);
        }

        if (type == "columnNumber") {
            columnParams.decorated = bizagi.rendering.number;
            return new bizagi.rendering.columns.number(columnParams);
        }

        if (type == "columnMoney") {
            columnParams.decorated = bizagi.rendering.money;
            return new bizagi.rendering.columns.number(columnParams);
        }

        if (type == "columnDate") {
            columnParams.decorated = bizagi.rendering.date;
            return new bizagi.rendering.columns.date(columnParams);
        }

        if (type == "columnBoolean") {
            var display = data.properties.display || "option";

            if (display == "check") {
                // Creates one check render
                columnParams.decorated = bizagi.rendering.check;
                if (params.data.properties.isExclusive) {
                    return new bizagi.rendering.columns.exclusiveCheck(columnParams);
                }
            } else {
                // Creates one yes-no render
                columnParams.decorated = bizagi.rendering.yesno;
            }
            return new bizagi.rendering.columns.column(columnParams);
        }

        if (type == "columnCombo") {
            columnParams.decorated = bizagi.rendering.combo;
            return new bizagi.rendering.columns.combo(columnParams);
        }

        if (type == "columnRadio") {
            columnParams.decorated = bizagi.rendering.radio;
            return new bizagi.rendering.columns.radio(columnParams);
        }

        if (type == "columnList") {
            columnParams.decorated = bizagi.rendering.list;
            return new bizagi.rendering.columns.list(columnParams);
        }

        if (type == "columnHidden") {
            columnParams.decorated = bizagi.rendering.hidden;
            return new bizagi.rendering.columns.column(columnParams);
        }

        if (type == "columnUpload") {
            columnParams.decorated = bizagi.rendering.upload;
            return new bizagi.rendering.columns.upload(columnParams);
        }

        if (type == "columnImage") {
            columnParams.decorated = bizagi.rendering.image;
            return new bizagi.rendering.columns.image(columnParams);
        }

        if (type == "columnUploadEcm") {
            columnParams.decorated = bizagi.rendering.ecm;
            return new bizagi.rendering.columns.uploadecm(columnParams);
        }
        if (type == "columnLink") {
            columnParams.decorated = bizagi.rendering.link;
            return new bizagi.rendering.columns.link(columnParams);
        }

        if (type == "columnFormLink") {
            columnParams.decorated = bizagi.rendering.formLink;
            return new bizagi.rendering.columns.link(columnParams);
        }

        if (type == "columnUserfield") {
            columnParams.decorated = bizagi.rendering.userfieldWrapper;
            return new bizagi.rendering.columns.column(columnParams);
        }

        if (type == "columnSearch") {
            columnParams.decorated = bizagi.rendering.search;
            return new bizagi.rendering.columns.search(columnParams);
        }

        if (type == "columnLabel") {
            columnParams.decorated = bizagi.rendering.label;
            return new bizagi.rendering.columns.column(columnParams);
        }

        if (type == "columnReadonly") {
            columnParams.decorated = bizagi.rendering.label;
            return new bizagi.rendering.columns.readonly(columnParams);
        }

        if (type == "columnDocument") {
            columnParams.decorated = bizagi.rendering.document;
            return new bizagi.rendering.columns.document(columnParams);
        }

        if (type == "columnLetter") {
            columnParams.decorated = bizagi.rendering.letter;
            return new bizagi.rendering.columns.letter(columnParams);
        }

        if (type == "columnButton") {
            columnParams.decorated = bizagi.rendering.button;
            return new bizagi.rendering.columns.button(columnParams);
        }

        // No type supported
        bizagi.log(type + " not supported in render factory", data, "error");
        return null;
    },
    /*
    *   Returns the appropiate search render based on the type
    */
    getSearchRender: function (params) {
        var type = params.type;
        var data = params.data;
        var searchParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });
        if (type == "searchText") {
            var isExtended = bizagi.util.parseBoolean(data.properties.isExtended) || false;

            if (isExtended) {
                // Creates one extended render
                return new bizagi.rendering.extendedText(searchParams);
            }

            // Creates one normal text render
            return new bizagi.rendering.text(searchParams);
        }

        if (type == "searchBoolean") {
            var display = data.properties.display || "option";

            if (display == "check") {
                // Creates one check render
                return new bizagi.rendering.check(searchParams);
            }

            // Creates one yes-no render
            return new bizagi.rendering.yesno(searchParams);
        }

        if (type == "searchNumber") {
            if (data.properties.dataType == 29) {
                //Creates a Scientific Notation render
                return new bizagi.rendering.numberScientificNotation(searchParams);
            }
            return new bizagi.rendering.number(searchParams);
        }

        if (type == "searchMoney") {
            return new bizagi.rendering.money(searchParams);
        }

        if (type == "searchDate") {
            return new bizagi.rendering.date(searchParams);
        }

        if (type == "searchCombo") {
            return new bizagi.rendering.combo(searchParams);
        }

        if (type == "searchSuggest") {
            return new bizagi.rendering.search(searchParams);
        }

        if (type == "searchLabel") {
            return new bizagi.rendering.label(searchParams);
        }

        // No type supported
        bizagi.log(type + " not supported in render factory", data, "error");
        return null;
    },
    /*
    *   Returns the appropiate search render based on the type
    */
    getQueryRender: function (params) {
        var type = params.type;
        var data = params.data;
        var searchParams = $.extend(params, {
            renderFactory: this,
            dataService: params.dataService || this.dataService
        });
        if (type == "queryText") {
            var isExtended = bizagi.util.parseBoolean(data.properties.isExtended) || false;

            if (isExtended) {
                // Creates one extended render
                return new bizagi.rendering.queryExtendedText(searchParams);
            }

            // Creates one normal text render
            return new bizagi.rendering.queryText(searchParams);
        }

        if (type == "queryBoolean") {
            var display = data.properties.display || "option";

            if (display == "check") {
                // Creates one check render
                return new bizagi.rendering.queryCheck(searchParams);
            }

            // Creates one yes-no render
            return new bizagi.rendering.queryYesNo(searchParams);
        }

        if (type == "queryNumber") {

            return new bizagi.rendering.queryNumber(searchParams);
        }

        if (type == "queryMoney") {
            return new bizagi.rendering.queryMoney(searchParams);
        }

        if (type == "queryDate") {
            return new bizagi.rendering.queryDate(searchParams);
        }

        if (type == "queryCombo") {
            return new bizagi.rendering.queryCombo(searchParams);
        }

        if (type == "queryCascadingCombo") {
            return new bizagi.rendering.queryCascadingCombo(searchParams);
        }

        if (type == "querySuggest") {
            return new bizagi.rendering.querySuggest(searchParams);
        }

        if (type == "queryLabel") {
            return new bizagi.rendering.queryLabel(searchParams);
        }

        if (type == "queryList") {
            return new bizagi.rendering.queryList(searchParams);
        }

        if (type == "querySearch") {
            return new bizagi.rendering.querySearch(searchParams);
        }

        if (type == "queryRadio") {
            return new bizagi.rendering.queryRadio(searchParams);
        }

        if (type == "queryState") {
            return new bizagi.rendering.queryState(searchParams);
        }

        if (type == "queryCaseState") {
            return new bizagi.rendering.queryCaseState(searchParams);
        }

        if (type == "queryProcess") {
            return new bizagi.rendering.queryProcess(searchParams);
        }

        if (type == "querySearchUser") {
            return new bizagi.rendering.querySearchUser(searchParams);
        }

        if (type == "queryHidden") {
            return new bizagi.rendering.hidden(searchParams);
        }

        // No type supported
        bizagi.log(type + " not supported in render factory", data, "error");
        return null;
    },
    /*
    *   Method to fetch templates from a private dictionary
    */
    getTemplate: function (template) {
        var self = this;
        return self.templates[template];
    }
});
