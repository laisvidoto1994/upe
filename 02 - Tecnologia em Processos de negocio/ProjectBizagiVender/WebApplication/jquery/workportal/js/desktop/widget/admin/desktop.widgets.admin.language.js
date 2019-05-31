/**
 * Name: BizAgi Desktop Widget Administration Language Implementation
 * 
 * @authors Ivan Ricardo Taimal - Mauricio Sanchez S. - Andres Fernando Munoz
 */


bizagi.workportal.widgets.admin.language.extend("bizagi.workportal.widgets.admin.language", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.language.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language").concat("#ui-bizagi-workportal-widget-admin-language-wrapper"),
            "admin.language.panel.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language").concat("#ui-bizagi-workportal-widget-admin-language-panel-wrapper"),
            "admin.language.template.list": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language").concat("#ui-bizagi-workportal-widget-admin-language-template-list"),
            "admin.language.upload.file.culturename": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language").concat("#ui-bizagi-workportal-widget-admin-language-combo-culturename"),
            "admin.language.bizagi.objects.list": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language").concat("#ui-bizagi-workportal-widget-admin-language-bizagi-objects-list"),
            "admin.language.entities.list": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language").concat("#ui-bizagi-workportal-widget-admin-language-entities-list"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;

        //Template vars
        self.config = {
            "maxSize": "10000000",
            "validExtensions": ".xlsx",
            "uploadFormTemplateName": "bizagi.workportal.desktop.fileupload.form",
            "cultureName": "en"
        };
        self.generalUploadFile = self.workportalFacade.getTemplate("admin.language.upload.file");
        self.formTemplate1 = self.workportalFacade.getTemplate(self.config["uploadFormTemplateName"]);
        self.formTemplate2 = self.workportalFacade.getTemplate(self.config["uploadFormTemplateName"]);
        self.formTemplate3 = self.workportalFacade.getTemplate(self.config["uploadFormTemplateName"]);
        self.formTemplate4 = self.workportalFacade.getTemplate(self.config["uploadFormTemplateName"]);
    },

    postRender: function () {
        var self = this;
        var content = self.getContent();
        self.startTab = "entities";
        self.loadtemplates();
        self.setupData();
        $.when(self.initLanguageTemplatesList(self.startTab)).done(function (data) {
            self.renderUploadForm();
            self.initBizagiObjectsList();
            self.initEntities();
            content.html(self.panelWrapper);
            if (!session.isProduction) {
                $('#tab_reset').parent().addClass('hidden');
            }
            $("#admin-language-wrapper").tabs();
            $("#entities_internal_tabs").tabs({
                create: function (event, ui) {
                    ui.tab.parent().removeClass('hidden');
                }
            });
            $("#entities-accordion").accordion({ heightStyle: "content" });
            self.activeTab = self.startTab;
            self.handleTabEvents();
        });
    },

    setupData: function () {
        var self = this;
        var content = self.getContent();
    },

    renderUploadForm: function () {
        var self = this;
        var content = self.getContent();
        var languageUploadFormWrapper = $("#languages-upload-form-wrapper", self.panelWrapper);
        var massiveResourcesUploadFormWrapper = $("#massive-resources-upload-form-wrapper", self.panelWrapper);
        languageUploadFormWrapper.empty();
        massiveResourcesUploadFormWrapper.empty();
        // Render Form

        //self.addUploadMassiveResources();
    },

    initLanguageTemplatesList: function (source) {
        var defer = $.Deferred();
        var self = this;
        var content = self.getContent();
        var listWrapperSelector = "#" + source + '-language-list-wrapper';
        var languageListWrapper = $(listWrapperSelector, self.panelWrapper);
        languageListWrapper.empty();
        $.when(self.dataService.getStoreLanguageTemplates()).done(function (data) {
            var title;
            data.result.sort(function (a, b) {
                if (a.value > b.value) {
                    return 1;
                }
                if (a.value < b.value) {
                    return -1;
                }
                return 0;
            });
            self.templateList = data;
            title = (source === 'all') ? self.getResource("workportal-widget-admin-language-all-language-list") : self.getResource("workportal-widget-admin-language-current-language-settings");
            $.tmpl(self.generalTemplateListTmpl, { languageTemplates: data.result, listTitle: title, source: source }).appendTo(languageListWrapper);
            self.downloadTemplateEvent(source);
            defer.resolve();
            self.addUploadMassiveResources();
            if (source === 'reset') {
                self.initReset();
            }
        });
        return defer.promise();
    },

    initBizagiObjectsList: function () {
        var self = this,
            bizagiObjectsListWrapper;
        bizagiObjectsListWrapper = $("#bizagi-objects-list-wrapper", self.panelWrapper);
        $.when(this.dataService.getBizagiObjects()).done(function (data) {
            data.result.sort(function (a, b) {
                if (a.value > b.value) {
                    return 1;
                }
                if (a.value < b.value) {
                    return -1;
                }
                return 0;
            });
            self.bizagiObjects = data.result;
            $.tmpl(self.bizagiObjectsList, { elementList: self.bizagiObjects }).appendTo(bizagiObjectsListWrapper);
            self.bizagiObjectsEvents();
        });
    },

    bizagiObjectsEvents: function () {
        var self = this;

        /**
        * Disable text selection for objects list and objects selected
        * */
        $("table tr", ".objects-container").bind('selectstart', function (event) {
            event.preventDefault();
        });
        /**
        * Event click for each entity in table list and selected
        * */
        $(".ui-bizagi-object").click(function () {
            var entity = this;
            if ($("td", entity).hasClass("bizagi-objects-object-selected")) {
                $("td", entity).removeClass("bizagi-objects-object-selected");
            } else {
                $("td", entity).addClass("bizagi-objects-object-selected");
            }
        });
        /**
        * Move all objects to right
        * */

        $('.objects-buttons').click(function (e) {
            e.preventDefault();
        });

        $("#move-all-objects-right").click(function () {
            $("#table-objects-selected tbody").append($("#table-bizagi-ojects-list td").closest("tr"));
            $("#table-objects-selected tbody tr td").removeClass("bizagi-objects-object-selected");
            $("#table-objects-selected tbody tr").show();
            self.readyToDownload('bizagi_objects');
        });
        /**
        * Move selected objects to right
        * */
        $("#move-objects-right").click(function () {
            $("#table-objects-selected tbody").append($("#table-bizagi-ojects-list .bizagi-objects-object-selected").closest("tr"));
            $("#table-objects-selected tbody tr td").removeClass("bizagi-objects-object-selected");
            self.readyToDownload('bizagi_objects');
        });
        /**
        * Move selected object to left
        * */
        $("#move-objects-left").click(function () {
            $("#table-bizagi-ojects-list tbody").append($("#table-objects-selected .bizagi-objects-object-selected").closest("tr"));
            $("#table-bizagi-ojects-list tbody tr td").removeClass("bizagi-objects-object-selected");
            self.readyToDownload('bizagi_objects');
        });
        /**
        * Move all objects to left
        * */
        $("#move-all-objscts-left").click(function () {
            $("#table-bizagi-ojects-list tbody").append($("#table-objects-selected td").closest("tr"));
            $("#table-bizagi-ojects-list tbody tr td").removeClass("bizagi-objects-object-selected");
            self.readyToDownload('bizagi_objects');
        });
    },

    initEntities: function () {
        var self = this,
            entitiesListWrapper;
        entitiesListWrapper = $("#entities-list-wrapper", self.panelWrapper);
        $.when(this.dataService.getEntitiesList()).done(function (data) {
            data.entities.sort(function (a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
            self.entitiesList = data.entities;
            $.tmpl(self.entitiesListTmpl, { elementList: self.entitiesList }).appendTo(entitiesListWrapper);
            self.entitiesEvents();
        });
    },

    entitiesEvents: function () {
        var self = this;
        /**
        * Disable text selection for entities list and entities selected
        * */
        $("table tr", ".entities-container").bind('selectstart', function (event) {
            event.preventDefault();
        });
        /**
        * Captures the input typing
        * */
        $("#ui-entities-filter").keyup(function () {
            var search = $(this).val();
            $("#table-entities-list .ui-bizagi-entity").show();
            if (search)
                $("#table-entities-list .ui-bizagi-entity").not(":FilterEntity(" + search + ")").hide();
        });
        /**
        * Filters entities according to the typed text
        * */
        $.expr[":"].FilterEntity = function (entity, i, array) {
            var search = array[3];
            if (!search) return false;
            return new RegExp(search, "i").test($(entity).text());
        };
        /**
        * Event click for each entity in table list and selected
        * */
        $(".ui-bizagi-entity").click(function () {
            var entity = this;
            if ($("td", entity).hasClass("bizagi-entities-entity-selected")) {
                $("td", entity).removeClass("bizagi-entities-entity-selected");
            } else {
                $("td", entity).addClass("bizagi-entities-entity-selected");
            }
        });
        /**
        * Move all entities to right
        * */

        $('.entities-buttons').click(function (e) {
            e.preventDefault();
        });

        $("#move-all-right").click(function () {
            $("#table-entities-selected tbody").append($("#table-entities-list td").closest("tr"));
            $("#table-entities-selected tbody tr td").removeClass("bizagi-entities-entity-selected");
            $("#table-entities-selected tbody tr").show();
            self.readyToDownload('entities');
        });
        /**
        * Move selected entities to right
        * */
        $("#move-right").click(function () {
            $("#table-entities-selected tbody").append($("#table-entities-list .bizagi-entities-entity-selected").closest("tr"));
            $("#table-entities-selected tbody tr td").removeClass("bizagi-entities-entity-selected");
            self.readyToDownload('entities');
        });
        /**
        * Move selected entities to left
        * */
        $("#move-left").click(function () {
            $("#table-entities-list tbody").append($("#table-entities-selected .bizagi-entities-entity-selected").closest("tr"));
            $("#table-entities-list tbody tr td").removeClass("bizagi-entities-entity-selected");
            self.readyToDownload('entities');
        });
        /**
        * Move all entities to left
        * */
        $("#move-all-left").click(function () {
            $("#table-entities-list tbody").append($("#table-entities-selected td").closest("tr"));
            $("#table-entities-list tbody tr td").removeClass("bizagi-entities-entity-selected");
            self.readyToDownload('entities');
        });
    },

    getEntitiesSelected: function () {
        var entitiesSelected = $("#table-entities-selected tbody tr");
        var idEntitiesSelected = [];
        $.each(entitiesSelected, function (index, item) {
            idEntitiesSelected.push($(item).data("id"));
        });
        return idEntitiesSelected;
    },

    getObjectsSelected: function () {
        var objectsSelected = $("#table-objects-selected tbody tr");
        var valueObjectsSelected = [];
        $.each(objectsSelected, function (index, item) {
            valueObjectsSelected.push($(item).data("value"));
        });
        return valueObjectsSelected;
    },

    initAllLangs: function () {
        var self = this;
        self.allLangsEvents();
    },

    allLangsEvents: function () {
        var self = this;

        /**
        * Captures the input typing
        * */
        $("input.ui-all-languages-filter").keyup(function () {
            var search = $(this).val();
            $(".ui-bizagi-grid-table .ui-bizagi-language").show();
            if (search)
                $(".ui-bizagi-grid-table .ui-bizagi-language").not(":FilterLanguage(" + search + ")").hide();
        });
        /**
        * Filters entities according to the typed text
        * */
        $.expr[":"].FilterLanguage = function (entity, i, array) {
            var search = array[3];
            if (!search) return false;
            return new RegExp(search, "i").test($(entity).text());
        };

        self.modifiedLangs = {};
        $('#all-language-list-wrapper .ui-bizagi-cell-readonly').find('input[type=checkbox]').on('change', function () {
            var element = $(this),
                elValue,
                objIndex = -1;
            elValue = element.attr('value');
            $.each(self.modifiedLangs, function (index, item) {
                var x;
                for (x in item) {
                    if (x === elValue) {
                        delete self.modifiedLangs[elValue];
                    }
                }
            });
            self.modifiedLangs[elValue] = (element.is(':checked')) ? true : false;
        });
        $('#all-language-list-wrapper #save-lang-list-btn').on('click', function () {
            self.saveLangsList();
        });
    },

    saveLangsList: function () {
        var self = this,
            langsObj;
        langsObj = {
            'languages': this.modifiedLangs
        };
        $.when(this.dataService.setLanguages(JSON.stringify(langsObj))).done(function (data) {
            var errMsgEl;
            if (!data.result) {
                errMsgEl = $('#all-language-list-wrapper .multilang-error-msg');
                errMsgEl.removeClass('dp-hidden');
                setTimeout(function () {
                    errMsgEl.addClass('dp-hidden');
                }, 5000);
                $.each(self.modifiedLangs, function (name, value) {
                    var element = $('#all-language-list-wrapper .ui-bizagi-cell-readonly').find('input[value=' + name + ']');
                    if (value) {
                        element.removeAttr('checked');
                    } else {
                        element.prop('checked', true);
                    }
                });
            } else {
                $('#tab_all_languages').click();
            }
            self.modifiedLangs = {};
        });
    },

    initReset: function () {
        var self = this;
        self.resetEvents();
        $("#message-container").hide();
        $("#template-reset").hide();
    },

    resetEvents: function () {
        var self = this;
        $('button#lang-reset-btn').on('click', function () {

            self.loadingOption();
            $("#message-container").hide();
            $("#template-reset").hide();
            var message = bizagi.localization.getResource("workportal-widget-admin-language-reset-confirmation");
            $.when(bizagi.showConfirmationBox(message, "Bizagi", "warning")).done(function () {
                $.when(self.dataService.resetPersonalization()).done(function (data) {
                    if (data.result) {
                        $("#message-container").show();
                        $("#template-reset").show();
                    }
                })
            });
            self.notLoading();
        });
    },

    loadingOption: function () {
        $("div.ui-dialog").append("<div class='loading-language ui-bizagi-loading-icon'><div class='loading-language-icon'></div></div>");
    },

    notLoading: function () {
        $("div.loading-language").remove();
        $("body").removeClass("cursor-loading");
    },



    addUploadMassiveResources: function () {
        var self = this;

        var internalsContainer = $("#internals", self.panelWrapper);
        var extendedContainer = $("#extended", self.panelWrapper);
        var objectsContainer = $("#bizagi_objects", self.panelWrapper);
        var entitiesContainer = $("#entities_localization ", self.panelWrapper);

        var entitiesUrl = self.dataService.serviceLocator.getUrl("admin-language-entities");
        var defaultUrl = self.dataService.serviceLocator.getUrl("admin-language-resource");

        self.renderUploadPlugin(internalsContainer, self.formTemplate1, defaultUrl, "internals");
        self.renderCultureCombo(internalsContainer, self.panelWrapper);
        self.renderUploadPlugin(extendedContainer, self.formTemplate2, defaultUrl, "extended");
        self.renderCultureCombo(extendedContainer, self.panelWrapper);
        self.renderUploadPlugin(objectsContainer, self.formTemplate3, defaultUrl, "objects");
        self.renderCultureCombo(objectsContainer);
        self.renderUploadPlugin(entitiesContainer, self.formTemplate4, entitiesUrl, "entities");
        self.renderCultureCombo(entitiesContainer);
    },

    /**
    Binds the bizagiFileUpload plugin to the tab container
    */
    renderUploadPlugin: function (tabContainer, formTemplate, uploadUrl, responseTarget) {
        var self = this;
        var properties = {};
        properties.addUrl = uploadUrl;
        properties.validExtensions = self.config["validExtensions"];
        properties.maxSize = self.config["maxSize"];
        properties.maxfiles = "1";
        properties.filesCount = "";
        $("#massive-resources-upload-form-wrapper", tabContainer).bizagiFileUpload({
            showLoading: true,
            alertAfterUpload: self.getResource("workportal-widget-admin-language-alert-after-upload"),
            alerFailtAfterUpload: self.getResource("workportal-widget-admin-language-alert-fail-after-upload"),
            formTemplate: formTemplate,
            properties: {
                cultureName: self.config["cultureName"],
                url: properties.addUrl,
                validExtensions: properties.validExtensions,
                maxSize: properties.maxSize,
                xpath: responseTarget
            },
            onUploadFileCompletedCallback: function (ref, data) {
                self.handleResponse("alert-upload-massive-resources-template", data);
                $("div.loading-language").remove();
                $("body").removeClass("cursor-loading");
            },
            onUploadFileFailCallback: function (data) {
                console.log(data);
                $("div.loading-language").remove();
                $("body").removeClass("cursor-loading");
            },
            onUploadFileProcess: function () {
                $("div.ui-dialog").append("<div class='loading-language ui-bizagi-loading-icon'><div class='loading-language-icon'></div></div>");
            },
            maxAllowedFiles: properties.maxfiles,
            uploadedFiles: properties.filesCount
        });
    },
    /*
    * Render combo
    */
    renderCultureCombo: function (tabContainer) {
        var self = this;
        var content = self.getContent();
        var deferred = $.Deferred();
        var comboDataSource = { combo: [], id: "cultureName" };
        comboDataSource.combo.push({ id: 'default', name: '' });
        $.each(self.templateList.result, function (index, value) {
            if (value.enabled) {
                comboDataSource.combo.push({ id: value.key, name: value.value });
            }
        });
        var comboWrapper = $(".ui-bizagi-culturecombo", tabContainer);
        comboWrapper.empty();
        comboWrapper.uicombo({
            isEditable: false,
            data: comboDataSource,
            itemValue: function (obj) {
                return obj.id;
            },
            itemText: function (obj) {
                return obj.name;
            },
            onComplete: function () {
                $("[name='cultureName']", tabContainer).val(comboDataSource.combo[0].id);
                deferred.resolve();
            },
            onChange: function (obj) {
                var sendBtn = $('button#upload-file', '#' + self.activeTab + '_upload_file'),
                    value = obj.ui.data('value');
                if (value !== 'default') {
                    sendBtn.prop('disabled', false);
                } else {
                    sendBtn.prop('disabled', true);
                }
                $("[name='cultureName']", tabContainer).val(value);
            },
            initValue: comboDataSource.combo[0]
        });
        return deferred;
    },

    handleResponse: function (div, data) {
        var self = this,
            dataLength = data.length,
            errorDetail = "Error",
            message;
        if (dataLength == 0) {
            self.initLanguageTemplatesList(self.startTab);
        } else {
            response = JSON.parse(data);
            if (typeof (response.detail) != "undefined") {
                if (response.detail.length > 200) {
                    errorDetail = response.detail.substring(0, 197) + " ...";
                }
                else {
                    errorDetail = response.detail;
                }
            }
            message = bizagi.localization.getResource(response.message);
            $("#" + div).html(message + " : " + errorDetail);
            $("#" + div).parent().removeClass("ui-hidden");
        }
    },

    downloadTemplateEvent: function (source) {
        var self = this,
            listTable = $('#' + source + '-language-list-wrapper .ui-bizagi-grid-table', self.panelWrapper),
            downloadBtn = $(".lang-list-button button#" + source + "-tmpl-download-btn", self.panelWrapper);
        listTable.find('input[type="radio"]').click(function (e) {
            self.readyToDownload(source, listTable, downloadBtn);
        });
        downloadBtn.click(function (e) {
            var activeBizagiObjects,
                activeEntities,
                selectedLang,
                extendedObj,
                params;
            e.preventDefault();
            selectedLang = listTable.find('input[type="radio"]:checked').data('guid');
            params = { "cultureName": selectedLang };
            if (source === 'bizagi_objects') {
                activeBizagiObjects = {
                    'elements': self.getObjectsSelected()
                };
                params.elements = JSON.stringify(activeBizagiObjects);
            } else if (source === 'entities') {
                activeEntities = {
                    'entities': self.getEntitiesSelected()
                };
                params.entities = JSON.stringify(activeEntities);
            } else if (source === 'extended') {
                extendedObj = {
                    'elements': ["extended"]
                };
                params.elements = JSON.stringify(extendedObj);
            }
            self.dataService.getLanguageTemplate(params);

        })
    },

    readyToDownload: function (source, listTable, downloadBtn) {
        var self = this,
            include = false,
            langSelected = false;
        if (!listTable) {
            listTable = $('#' + source + '-language-list-wrapper .ui-bizagi-grid-table', self.panelWrapper);
        }
        if (!downloadBtn) {
            downloadBtn = $(".lang-list-button button#" + source + "-tmpl-download-btn", self.panelWrapper);
        }
        if (source === 'internals') {
            include = true;
        } else if (source === 'extended') {
            include = true;
        } else if (source === 'bizagi_objects') {
            include = ((self.getObjectsSelected().length > 0) ? true : false);
        } else if (source === 'entities') {
            include = ((self.getEntitiesSelected().length > 0) ? true : false);
        }
        if (listTable.find('input[type="radio"]:checked').length > 0) {
            langSelected = true;
        }
        if (include && langSelected) {
            downloadBtn.removeAttr('disabled');
        } else {
            downloadBtn.attr('disabled', true);
        }
    },

    handleTabEvents: function () {
        var self = this,
            actionRunning = false,
            mainWrapper = $("#admin-language-wrapper"),
            content;
        content = self.getContent();
        $('.ui-tabs-anchor', '#admin-language-wrapper').click(function () {
            $("#message-container").hide();
            $("#template-reset").hide();
            $("input.ui-all-languages-filter").val('');
        });
        $("#tab_internals").click(function (e) {
            if (!actionRunning) {
                actionRunning = true;
                mainWrapper.tabs("disable");
                $.when(self.initLanguageTemplatesList('internals')).done(function (data) {
                    $("#internals_internal_tabs").tabs({
                        create: function (event, ui) {
                            ui.tab.parent().removeClass('hidden');
                        }
                    });
                    self.activeTab = 'internals';
                    mainWrapper.tabs("enable");
                    actionRunning = false;
                });
            }
            else{
                e.preventDefault();
            }
        });
        $("#tab_extended").click(function (e) {
            if (!actionRunning) {
                actionRunning = true;
                mainWrapper.tabs("disable");
                $.when(self.initLanguageTemplatesList('extended')).done(function (data) {
                    $("#extended_internal_tabs").tabs({
                        create: function (event, ui) {
                            ui.tab.parent().removeClass('hidden');
                        }
                    });
                    self.activeTab = 'extended';
                    mainWrapper.tabs("enable");
                    actionRunning = false;
                });
            }
            else{
                e.preventDefault();
            }
        });
        $("#tab_bizagi_objects").click(function (e) {
            if (!actionRunning) {
                actionRunning = true;
                mainWrapper.tabs("disable");
                $.when(self.initLanguageTemplatesList('bizagi_objects')).done(function (data) {
                    $("#bizagi_objects_internal_tabs").tabs({
                        create: function (event, ui) {
                            ui.tab.parent().removeClass('hidden');
                        }
                    });
                    $("#bizagi-objects-accordion").accordion({ heightStyle: "content" });
                    self.activeTab = 'bizagi_objects';
                    mainWrapper.tabs("enable");
                    actionRunning = false;
                });
            }
            else{
                e.preventDefault();
            }
        });
        $("#tab_entities_localization").click(function (e) {
            if (!actionRunning) {
                actionRunning = true;
                mainWrapper.tabs("disable");
                $.when(self.initLanguageTemplatesList('entities')).done(function (data) {
                    $("#entities_internal_tabs").tabs({
                        create: function (event, ui) {
                            ui.tab.parent().removeClass('hidden');
                        }
                    });
                    $("#entities-accordion").accordion({ heightStyle: "content" });
                    self.activeTab = 'entities';
                    mainWrapper.tabs("enable");
                    actionRunning = false;
                });
            }
            else{
                e.preventDefault();
            }
        });
        $("#tab_all_languages").click(function (e) {
            if (!actionRunning) {
                actionRunning = true;
                mainWrapper.tabs("disable");
                $.when(self.initLanguageTemplatesList('all')).done(function (data) {
                    self.initAllLangs();
                    self.activeTab = 'all';
                    mainWrapper.tabs("enable");
                    actionRunning = false;
                });
            }
            else{
                e.preventDefault();
            }
        });
        $("#tab_reset").click(function (e) {
            if (!actionRunning) {
                actionRunning = true;
                mainWrapper.tabs("disable");
                $.when(self.initLanguageTemplatesList('reset')).done(function (data) {
                    self.allLangsEvents();
                    self.activeTab = 'reset';
                    mainWrapper.tabs("enable");
                    actionRunning = false;
                });
            }
            else{
                e.preventDefault();
            }
        });

        $(".tab_upload_file").click(function (e) {
            self.addUploadMassiveResources();
        });

        // Only show "Entities" tab
        $('#tab_reset').parent().hide();
        $('#tab_internals').parent().show();

    }
});
