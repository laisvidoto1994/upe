/*
 */
$.widget("bizagi.theme", {
    // default options
    options: {
        path: '',
        colorPickerClass: 'biz-ui-color-picker',
        switchClass: 'biz-ui-switch',
        radioClass: 'biz-ui-radio',
        secureFonts: null,
        previewPage: '',
        previewWebparts: '',
        oneColorTheme: '',
        autoPreview: true,
        thumbs: 3,
        tooltipPreview: false,
        _themeVersion: 0,
        _themeAutoUpdate: true,
        selectedTheme: 0,
        _queue: {},
        _browser: 'Chrome',
        _info: {},
        _themeLessString: '',
        _savedThemes: '',
        _savedThemeList: [],
        _exportThemeString: false,
        _debug: false,
        _dummies: false,
        _animations: false,
        _baseID: '075bcfae-d36f-4957-9bce-02b5ba8017e1',
        _baseIdBizagiGO: '9b9a9539-e09e-4da4-8d77-f6a02cc8d84e',
        _baseIdLostWoods: '86b8d526-5ff2-4513-b206-2cc77cf2a4cc',
        _baseIdBeezagi: '87dd146b-c877-4ea2-83a7-7a49acb237c5',
        _baseValue: '{\"@skeuomorphic":"active","@flat":"inactive","@lineal":"inactive"}',
        predefinedThemes: [],
        _advancedTheme: "",
        _storage: {
            currentTheme: {}
        }
    },
    /***********************************************************************************
     **  Constructor
     **  Initial configuration builder
     ***********************************************************************************/
    _create: function() {
        var self = this;

        self._languageSetup();

        self.userAuthenticated = false;
        self.userAuthorized = false;

        self.fromOneColorPalette = false;
        self.options._browser = (BrowserDetect.browser) ? BrowserDetect.browser : 'Chrome';
        self.options._version = (BrowserDetect.version) ? BrowserDetect.version : '10';
        self.options.stampVersionCss = '';
        self.counterSources = 0;
        self.limitSources = 0;
        self.globalInterval = [];

        self.layout = {};
        self.layout.bizUiThemesList = null;
        self.layout.bizUiOnePalette = null;
        self.layout.bizUiThemeSaveModal = null;
        self.layout.bizUiThemeSavePanel = null;
        self.layout.bizUiThemeUpdateModal = null;
        self.layout.bizUiThemeUpdatePanel = null;
        self.layout.bizUiControlList = null;
        self.layout.bizUiControlListPanel = null;

        self.listThemeContainerIsOpen = false;

        self.addingNew = false;

        if (IsIE8Browser) {
            self.options.isIE8 = IsIE8Browser();
        }

        self.options.stampVersionCss = function() {
            var stampVersionCss = '';

            stampVersionCss = '/***************************************\n';
            stampVersionCss += ' ***    @version: ' + self.options._themeVersion + '\n';
            stampVersionCss += ' ***    @date: ' + self._printDate() + '\n';
            stampVersionCss += ' ***    @create: Theme builder\n';
            stampVersionCss += ' **************************************/\n\n';

            return stampVersionCss;
        };

        self.local = {};
        self.local.save = {
            name: ''
        };

        self.resetThemeString = '';

        self.element.empty();
        self.element
            // add a class for theming
            .addClass("custom-theme")
            // prevent double click to select text
            .disableSelection();

        $.when($.get('libs/css/rules.theme.less')).done(function(data) {
            self.themeRulesBase = data;
        });

        $('body', 'html').addClass('biz-theme-builder');

        if (self.options._debug) {
            $.getScript(self.options.mockjax, function() {
                self._debug('loaded Mockjax for debug json dummies');
            });
        }

        // Creates a data service instance
        self.dataService = new bizagi.themebuilder.services.service({});
        self.actionsType = {
            SAVE: "save",
            UPDATE: "update",
            COPY: "copy",
            NEW: "new"
        };

        $.when(self.dataService.getMenuAuthorization(),
            $.get(self.options._configTheme)
        ).done(function(result) {
            self._authentificationHandler(result);
            self._loadThemeBuilder();
        }).fail(function() {
            self._loadThemeBuilder();
        });

    },
    _loadThemeBuilder: function() {
        var self = this;
        $.when(
            $.get(self.options._configTheme),
            $.get(self.options._savedThemes)
        ).done(function(data, themes) {
            self.configuration = $.parseJSON(data[0]);
            self.options.secureFonts = self.configuration.theme.css.securefonts;
            self.options.sideBackgrounds = self.configuration.theme.css.sideBackgrounds;
            self.options.path = self.configuration.theme.less;
            self.options.predefinedThemes = $.parseJSON(themes[0]);
            self.options.localization = self.configuration.theme.localization;

            self._setupLocalization();
        })
    },

    _verifyThemesVersion: function() {
        var self = this;
        var version = self.options._themeVersion = self.configuration.theme.version;
        var localVersion = self.options._localVersion = '1.0';

        $.when(self.dataService.getAllThemes(), self.dataService.getCurrentTheme()).done(function(dataA, dataB) {
            if (dataB.id) {
                var isNotMigrated = {
                    value: self.options._baseValue,
                    thumbs: ["#36454E", "#2E516B", "#5D6771", "#DEDEDE"],
                };

                if (!dataB.value) {
                    dataB = $.extend({}, dataB, isNotMigrated);
                }

                var nDataA = [].concat(dataA);
                self.options._storage = {
                    currentTheme: dataB,
                    createdThemes: nDataA
                };
                dataA.push(dataB);

                if (dataB.id == self.options._baseID) {
                    self.options.updateVersion = false;
                } else {
                    if (!dataB.version)
                        dataB.version = self.options._localVersion;

                    self.options.updateVersion = bizagi.util.upVersion(dataB.version, self.options._themeVersion);
                }
            }
            self._getLesstoJson();
        }).fail(function(failDataA, failDataB) {
            if (failDataA.status === 401 || failDataB.status === 401) {
                self._createLoginErrorMessage();
            }
        });
    },
    _getLesstoJson: function() {
        var self = this,
            info;

        if (self.options.updateVersion) {
            self.options._updatingText = bizagi.localization.getResource("widget-theme-builder-updating-themes");
            self._createLoadingOverlay($('body'), self.options._updatingText);
        }

        $.get(self.options.path, function(data) {
            var dataJson = JSON.parse(data);
            self.options.info = dataJson.info;
            self.options.dataSource = dataJson.less;
            self.options.actualKeys = self._getAllKeks();

            if (self.options.updateVersion) {
                self._recreateSavedThemes();
            } else {
                self._loadTemplates(self.configuration.theme.templates);
            }

            if (!self.options.updateVersion && self.options._storage.errorUpdateThemeList) {
                self._showAlertToInvalidThemes();
            }
        });
    },
    _getAllKeks: function() {
        var self = this;
        var data = self.options.dataSource;

        var allKeys = {};

        for (var i = 0; i < data.length; i++) {
            if (data[i].hasOwnProperty('category')) {
                if (data[i].category.hasOwnProperty('items')) {
                    allKeys = $.extend({}, allKeys, self._getAllItemsKey(data[i].category.items));
                } else if (data[i].category.hasOwnProperty('subcategory')) {
                    if (data[i].category.subcategory) {
                        allKeys = $.extend({}, allKeys, self._getAllKeysFromCategory(data[i].category.subcategory));
                    }
                }
            }
        }

        return allKeys;
    },
    _getAllKeysFromCategory: function(data) {
        var self = this;
        var objTmp = {};

        for (var i = 0; i < data.length; i++) {
            if (data[i].hasOwnProperty('items')) {
                objTmp = $.extend({}, objTmp, self._getAllItemsKey(data[i].items));
            }
        }
        return objTmp;
    },
    _getAllItemsKey: function(data) {

        var self = this;
        var objTmp = {};

        for (var i = 0; i < data.length; i++) {
            objTmp[data[i].key] = data[i].value;
        }
        return objTmp;
    },
    /*
     *
     */
    _authentificationHandler: function(result) {

        var self = this;
        if (result[0].code != "AUTHENTICATION_ERROR") {
            var i = result[0].permissions.length,
                j;
            self.userAuthenticated = true;
            var success = false;
            while (i-- > 0) {
                if (result[0].permissions[i].Admin) {
                    j = result[0].permissions[i].Admin.length;

                    while (j-- > 0) {
                        if (result[0].permissions[i].Admin[j] == "ThemeBuilder") {
                            success = true;

                            j = i = 0;
                        }
                    }
                }
            }
            if (success) {
                self.userAuthorized = true;
            }
        }
    },

    _languageSetup: function() {
        var defaultLanguage = bizagi.readQueryString()["language"];
        defaultLanguage = defaultLanguage || (typeof(BIZAGI_LANGUAGE) !== "undefined" ? BIZAGI_LANGUAGE : null);
        bizagi.language = defaultLanguage;
    },

    /***********************************************************************************
     **  Load Templates
     ***********************************************************************************/
    _loadTemplates: function(templates) {
        var self = this;
        self.limitSources = templates.length;
        self._loadTemplate(templates[0]);
    },
    /***********************************************************************************
     **  Load Template
     ***********************************************************************************/
    _loadTemplate: function(resource) {
        var self = this;
        if (resource !== undefined) {
            $.get(resource.src).done(function(data, textStatus) {

                // Translate template
                var translatedTemplate = bizagi.localization.translate(data);

                $.template(resource.name, translatedTemplate);
                self._amountCounterTemplates(resource.src);

            }).fail(function(jqxhr, settings, exception) {
                //console.error(resource, settings, exception);
            });
        }
    },
    /***********************************************************************************
     **  Amount of resources loaded
     ***********************************************************************************/
    _amountCounterTemplates: function(src) {
        var self = this;
        self.counterSources++;
        self._debug(self.counterSources + ' Success to load: ' + src);

        if (self.counterSources == self.limitSources) {

            //Checks if the user is authentiated, and autorized
            if (self.userAuthenticated && self.userAuthorized) {
                self._buildTheme();
            } else {
                self._createLoginErrorMessage();
            }

        } else {
            self._loadTemplate(self.configuration.theme.templates[self.counterSources]);
        }
    },


    /**
     *
     */
    _setLocalizationSettings: function() {
        var self = this;
        var defer = $.Deferred();
        // Set localization settings
        if (typeof bizagi.localization === "undefined") {
            bizagi.localization = new bizagi.l10n(self.options.localization);
            bizagi.localization.setLanguage(bizagi.language);

            //When the required resources are ready, load the templates
            $.when(bizagi.localization.ready()).done(function() {
                defer.resolve();
            });
        } else {
            defer.resolve();
        }
        return defer.promise();
    },
    /**
     *
     */
    _setupLocalization: function() {
        var self = this;
        $.when(self._setLocalizationSettings()).done(function() {
            self._verifyThemesVersion();
        });
    },

    /***********************************************************************************
     **  BuildTheme
     **  Load templates / Layout Generation
     **  Get CSS from less
     ***********************************************************************************/
    _buildTheme: function() {
        var self = this,
            savedJson,
            themeLayout,
            valJson,
            savedThemesLayout,
            css,
            bizOutputLines,
            bizOutputJson,
            bizUiThemesList,
            bizUiOnePalette,
            bizUiThemeSavePanel,
            bizUiThemeNewPanel,
            bizUiThemeUpdatePanel,
            bizUiThemeChangeBackgroundImagePanel,
            bizUiThemeChangeLogoPanel,
            onePaletteTheme,
            saveModal,
            newModal,
            updateModal,
            changeBackgroundImageModal,
            changeLogoModal,
            themeTabs;

        self.options.tmpl = {};
        $.extend(self.configuration.theme, {
            updateVersion: self.options.updateVersion
        });

        themeLayout = $.tmpl("custom.theme.layout", self.configuration.theme);
        themeTabs = $.tmpl("custom.theme.layout.tabs", {
            panels: self.configuration.theme.previewPanels
        });

        $('.biz-layout-panel-right', themeLayout).append(themeTabs);

        self.layout.bizUiThemesList = bizUiThemesList = $('.biz-ui-themes-list', themeLayout);

        onePaletteTheme = $.tmpl("custom.theme.ui.controls.color.base", {});
        self.layout.bizUiOnePalette = bizUiOnePalette = $('.biz-ui-one-color-palette', themeLayout);
        bizUiOnePalette.append(onePaletteTheme);

        self.layout.bizUiThemeSavePanel = bizUiThemeSavePanel = $('.biz-ui-theme-save-panel', themeLayout);
        self.layout.bizUiThemeNewPanel = bizUiThemeNewPanel = $('.biz-ui-theme-new-panel', themeLayout);
        self.layout.bizUiThemeUpdatePanel = bizUiThemeUpdatePanel = $('.biz-ui-theme-update-panel', themeLayout);
        self.layout.bizUiThemeChangeLogoPanel = bizUiThemeChangeLogoPanel = $('.biz-ui-theme-change-logo-panel', themeLayout);
        self.layout.bizUiThemeChangeBackgroundImagePanel = bizUiThemeChangeBackgroundImagePanel = $('body');

        var thumbsSaved = [];
        for (var i = 0; i < self.options.thumbs; i++) {
            thumbsSaved.push(i);
        }

        //Save Modal
        self.layout.bizUiThemeSaveModal = saveModal = $.tmpl("custom.theme.ui.controls.save.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeSavePanel.append(saveModal);

        self.layout.bizUiControlModalSave = $('.modal-script', bizUiThemeSavePanel);

        //New Modal
        self.layout.bizUiThemeNewModal = newModal = $.tmpl("custom.theme.ui.controls.new.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeNewPanel.append(newModal);
        self.layout.bizUiControlModalNew = $('.modal-script', bizUiThemeNewPanel);

        //Update Modal
        self.layout.bizUiThemeUpdateModal = updateModal = $.tmpl("custom.theme.ui.controls.update.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeUpdatePanel.append(updateModal);
        self.layout.bizUiControlModalUpdate = $('.modal-script', bizUiThemeUpdatePanel);

        //Change Background Image Modal
        self.layout.bizUiThemeChangeBackgropundImageModal = changeBackgroundImageModal = $.tmpl("custom.theme.ui.controls.change.background.image.panel", {
            bgImages: self.options.sideBackgrounds
        });
        bizUiThemeChangeBackgroundImagePanel.append(changeBackgroundImageModal);
        self.layout.bizUiControlModalChangeBackgroungImage = $('.modal-script', bizUiThemeChangeBackgroundImagePanel);

        //Change logo Modal
        self.layout.bizUiThemeChangeLogoModal = changeLogoModal = $.tmpl("custom.theme.ui.controls.changeLogo.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeChangeLogoPanel.append(changeLogoModal);
        self.layout.bizUiControlModalChangeLogo = $('.modal-script', bizUiThemeChangeLogoPanel);
        self.layout.bizUiControlModalChangeLogoUnchanged = self.layout.bizUiControlModalChangeLogo.clone(true);

        self.element.append(themeLayout);

        self._createThemeList();
        self._createListThemeVariables();

        /* Generate an output css */
        bizOutputLines = $("#biz-output-lines");
        bizOutputJson = $("#biz-output-json");

        bizOutputJson.val(self.options._themeLessString);
        bizOutputLines.data('change', true);

        $('[title]').tooltip({
            tooltipClass: 'biz-ui-horizontal-align-tooltip',
            position: {
                my: "right center",
                at: "left center"
            }
        });

        $('.is-customizable').hide();
        $('.is-not-customizable').hide();
    },

    _createLoginErrorMessage: function() {
        var self = this;
        self._loadTemplates(self.configuration.theme.templates);
        $.when(self._setLocalizationSettings()).done(function() {
            var formTemplate;

            if (!self.userAuthenticated)
                formTemplate = $.tmpl("access.denied.form", {
                    "message": bizagi.localization.getResource("widget-theme-builder-theme-access-denied-logged")
                });
            else
            if (!self.userAuthorized)
                formTemplate = $.tmpl("access.denied.form", {
                    "message": bizagi.localization.getResource("widget-theme-builder-theme-access-denied-user")
                });

            if ($("div", formTemplate).length > 0) {
                formTemplate.appendTo($('.biz-theme-generator'));
            }

            $('body', 'html').removeClass('biz-theme-builder');
            $('body', 'html').addClass('biz-form-body');

            //Make room to show the complete form
            $('html').css("height", "100%");
        });
    },

    _returnToLogin: function() {
        window.location = window.location.toString().substring(0, window.location.toString().indexOf("ThemeBuilder"));
    },

    _toggleListColors: function() {
        var self = this,
            listThemes;



        var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);

        if (currentThemeObj && ((self.currentSelectedThemeID !== self.options._baseID) && (currentThemeObj.value !== self.options._baseValue)) || self.fromOneColorPalette) {
            $('.biz-ui-control-list .biz-theme-category').show();
        } else {
            $('.biz-ui-control-list .biz-theme-category').hide();
            $('[data-key="@one-color-theme"]').css('background-color', 'black');

        }

        if (currentThemeObj === null || currentThemeObj.value === self.options._baseValue) {
            listThemes = $('.biz-ui-themes-list');
            $('.biz-theme-controls', listThemes).removeClass('isClose').addClass('isOpen');
        }
    },

    /***********************************************************************************
     **  List Theme Variables
     **  Create Theme Variable  by List / by Category
     ***********************************************************************************/
    _createListThemeVariables: function() {
        var self = this,
            list, dataForList, info, controlList;
        self.layout.bizUiControlList = controlList = $('.biz-ui-control-list', self.element);

        self._translateThemeVariables();

        dataForList = {
            controls: self.options.dataSource,
            info: self.options.info
        };

        list = $.tmpl("custom.theme.category.list", dataForList);

        controlList.append(list);

        self._createFontFamily();
        self._createBackgroundImages();
        self._applyPlugins();
        self._createShortCutsSpans();
        self._addHandlers();

        if (self.options._themeLessString.length > 1) {
            var queueJson = $.parseJSON(self.options._themeLessString);
            self._refreshFields(queueJson);
        }
        // hide all span elements that contains array values
        self._hideShortCutsElements(['true', 'false', 'inactive', 'active']);
        self._createPreviewPanel();


        //set reset theme
        self.resetThemeString = self._gethemeLessString(false);

    },

    /*
     *
     */
    _translateThemeVariables: function() {
        var self = this;
        var i = self.options.dataSource.length;

        while (i-- > 0) {
            self.options.dataSource[i].category.name = bizagi.localization.getResource(self.options.dataSource[i].category.name) ? bizagi.localization.getResource(self.options.dataSource[i].category.name) : self.options.dataSource[i].category.name;

            if (self.options.dataSource[i].category.subcategory) {
                var j = self.options.dataSource[i].category.subcategory.length;

                while (j-- > 0) {
                    self.options.dataSource[i].category.subcategory[j].name = bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j]) ? bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j].name) : self.options.dataSource[i].category.subcategory[j].name;
                    if (self.options.dataSource[i].category.subcategory[j].items) {
                        var k = self.options.dataSource[i].category.subcategory[j].items.length;

                        while (k-- > 0) {
                            if (bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j].items[k].label))
                                self.options.dataSource[i].category.subcategory[j].items[k].label = bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j].items[k].label);
                        }
                    }
                }
            } else
            if (self.options.dataSource[i].category.items) {
                var l = self.options.dataSource[i].category.items.length;

                while (l-- > 0) {
                    if (bizagi.localization.getResource(self.options.dataSource[i].category.items[l].label))
                        self.options.dataSource[i].category.items[l].label = bizagi.localization.getResource(self.options.dataSource[i].category.items[l].label);
                }
            }
        }
    },
    /*
     *
     */
    _hideShortCutsElements: function(key) {

        var self = this;

        if (typeof key === 'string') {
            $(".noColor:contains('" + key + "')", self.element).addClass('biz-ui-hide');
        } else {

            for (var i = 0; i < key.length; i++) {
                $(".noColor:contains('" + key[i] + "')", self.element).addClass('biz-ui-hide');
            }
        }
    },

    /*
     *
     */
    _gethemeLessString: function() {
        var self = this;
        var tmpStr = '';
        var controlList = self.layout.bizUiControlList;

        tmpStr += '{';

        $('input', controlList).each(function() {
            tmpStr += '\"' + $(this).data('key') + '\":\"' + $(this).val() + '\",';
        });

        tmpStr += '}';
        tmpStr = tmpStr.replace('",}', '"}');

        return tmpStr;
    },

    /*
     * This method is called when select a theme, and if this need to be published!
     */
    _selectTheme: function(_instancia, publish) {
        var self = this;
        var _input = $('input', _instancia);
        var parent = _instancia.closest('.biz-ui-theme-pre-build');

        //Check if the element is already selected
        if (_instancia.hasClass('active')) {
            //Clears the current selected theme
            self.currentSelectedThemeID = "";

            _instancia.removeClass('active');
            self._restoreTitle();

        } //if not, apply the selected theme
        else {
            //Stores the current selected theme
            self.currentSelectedThemeID = _instancia.attr('id');

            //Add the active
            self.options._themeLessString = _input.val();
            self.options._advancedTheme = _input.data("advanceCss");
            self.fromOneColorPalette = false;

            var name = $('h4', _instancia).text();
            var thumbs = $('.biz-ui-thumbs-theme span', _instancia).clone();

            self._changeTitle(name);

            $('.biz-theme-name', parent).text(name);
            $('.biz-ui-thumbs-theme:first', parent).empty().append(thumbs);

            var queueJson = (self.options._themeLessString.length > 0) ? $.parseJSON(self.options._themeLessString) : '';
            self._refreshFields(queueJson);
            self._selectActiveTheme(self.currentSelectedThemeID);
        }


        if (self.currentSelectedThemeID === self.options._baseIdBizagiGO) {
            $('.is-customizable').hide();
            $('.is-not-customizable').show();
        } else {
            $('.is-customizable').show();
            $('.is-not-customizable').hide();
        }

        if (publish) {
            var id = (_instancia.attr('id')) ? _instancia.attr('id') : undefined;
            self._publishService(id);
        }

    },

    /*
     *
     */
    _addHandlers: function() {
        var self = this,
            controlList;

        self.element.on('change', 'input', function() {
            if (!self.fromOneColorPalette) {
                var _self = $(this);
                self._addtoQueue(_self);
                var key = _self.data('key');
                $('span[data-key="' + key + '"]').css('background-color', _self.val());

            } else {
                //TODO:Check this reset options for "Select theme"
                $('.biz-ui-selected-theme .biz-theme-name').text(bizagi.localization.getResource("widget-theme-builder-controls-label-select-a-theme"));
                $('.biz-ui-selected-theme .biz-ui-thumbs-theme').empty();
                var _self = $(this);
                var key = _self.data('key');
                $('span[data-key="' + key + '"]').css('background-color', _self.val());
            }


        });


        self.element.on('click', '.biz-ui-theme-part', function() {
            var _self = $(this);
            self._selectTheme(_self);
            /*Hide Reset Button*/
            self._resetButton("hide");
        });

        self.element.on('click', '.biz-theme-delete', function(e) {
            e.stopPropagation();
            var partTheme = $(this).closest('.biz-ui-theme-part');
            self._deleteTheme(partTheme.attr('id'));
        });

        if (self.options.oneColorTheme.length !== '') {
            $('.' + self.options.oneColorTheme).change(function(e) {
                var _self = $(this);
                self._createOneColorTheme(_self);
            });
        }

        $('.biz-theme-reset').click(function() {
            self._reset();
        });

        $('.biz-theme-save').click(function() {
            self._readyForSave(true);
        });

        $('.biz-theme-new').click(function() {

            self.addingNew = true;
            self._toggleListColors();
            self._readyForNew();
        });

        $('#logo').click(function() {
            self._readyForChangeLogo();
        });


        //Modal New
        $('.biz-ui-theme-new').click(function() {

            var originBg = "url('jquery/workportal/css/desktop/images/bg-landscape.png')";
            $('input[data-key="@sidebar-image-theme"]').val(originBg);
            self.options._advancedTheme = "";

            $('.' + self.options.oneColorTheme).change();
            self.layout.bizUiControlModalNew.removeClass('biz-ui-hide').dialog("close");

            var name = $('input[name="name"]', self.layout.bizUiControlModalNew).val();
            self.local.save.displayName = name;

            self._changeTitle(name);

            $('input[name="name"]', self.layout.bizUiControlModalNew).val('');

            var saveReference = $('.modal-save');
            $('input[name="name"]', saveReference).val(self.local.save.displayName);

            self._readyForSave(true);
        });

        //Modal Save
        $('.biz-ui-theme-save').click(function() {
            self.layout.bizUiControlModalSave.removeClass('biz-ui-hide').dialog("close");
            self._saveService(self.actionsType.SAVE);
        });

        //Modal Update
        $('.biz-ui-theme-update').click(function() {
            self.layout.bizUiControlModalUpdate.removeClass('biz-ui-hide').dialog("close");
            self._saveService(self.actionsType.UPDATE); //sents the parameter in true indicating that is for "update"
        });


        $('.biz-ui-theme-save-copy').click(function() {
            self.layout.bizUiControlModalUpdate.removeClass('biz-ui-hide').dialog("close");
            self._saveService(self.actionsType.COPY); //save
        });

        /* Deprecated biz-theme-preview handler */

        self._addHandlerCategoryPanels(self.element);

        self.element.on("click", ".biz-theme-options-shortcut > span", function(e) {
            $('.biz-ui-control-list .biz-theme-category').show();
            var _self, key, input, h, parent;

            e.preventDefault();
            e.stopPropagation();

            self.fromOneColorPalette = false;

            _self = $(this);
            key = _self.data('key');
            input = $('input[data-key="' + key + '"]');

            input.data('spanFired', true);



            if (_self.hasClass('noColor')) {
                input.next().toggleClass('isOpen isClose').addClass('upLevel');
                input.closest('.biz-theme-controls').width(_self.outerWidth());
                //input.next().width(_self.outerWidth());

                h = ((input.next().height() / 2) - (_self.parent().height() / 2)) * (-1) + 'px';

                parent = _self.closest('.biz-theme-category');
                $('h3', parent).addClass('biz-active');

                input.next().css({
                    top: h
                });
            } else {
                input.spectrum("show");
            }
        });

        $('.biz-ui-theme-add-thumb').click(function() {
            var _self = $(this);
            var parent = _self.parent();

            var colorThumb = $('input', parent).val();
            $('.biz-ui-theme-list-thumbs', parent).append('<span style="background-color:' + colorThumb + '"></span>');
        });

        $('.biz-theme-reload').click(function() {
            $.when($.get('libs/css/rules.theme.less')).done(function(data) {
                self.themeRulesBase = data;
            });
        });


        self.element.on('click', '.biz-theme-publish', function(e) {
            var $this = $(this);
            e.stopPropagation();
            self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-publishing-theme"), function() {
                var themeSelector = $this.closest('.biz-ui-theme-part');
                self._selectTheme(themeSelector, true);
                /*Hide Reset Button*/
                self._resetButton("hide");
            });
        });


        $(window).resize(function() {
            self._refreshPanelHeights();
        });
    },

    _changeTitle: function(text) {
        var self = this;
        $('.biz-ui-theme-header .biz-theme-title', self.element).fadeOut(function() {

            $('.biz-ui-theme-header .biz-theme-name', self.element)
                .html(bizagi.localization.getResource("widget-theme-builder-theme-prefix") + '<span class="biz-theme-separator-ltr"> > </span>' + text)
                .fadeIn();
        });

    },
    _restoreTitle: function(text) {
        var self = this;

        $('.biz-ui-theme-header .biz-theme-name', self.element).fadeOut(function() {
            $('.biz-ui-theme-header .biz-theme-title', self.element).fadeIn();
        });
    },
    _restoreLogo: function() {
        var self = this;
        //selects the logo speified for the active theme
        self._selectLogoForActiveTheme(self.currentSelectedThemeID);
    },
    _changeLogo: function(src, isDefaultLogo) {
        var self = this;
        $('#logo').find('img').attr('src', src);
        //sets the default logo, it asks firts to set the old logo
        src = isDefaultLogo ? self.configuration.theme.brand.defaultLogo : src;
        self._refreshWorkportalLogo(src);
    },
    _getImageDataFromService: function(selectedFile) {
        var self = this;
        var $logoContent = $('.modal-change-logo');

        if (selectedFile && selectedFile[0]) {
            self._createLoadingOverlay($logoContent, '...');

            //calls the service to get the base64 data
            $.when(self.dataService.getImageData(selectedFile[0])).done(function(result) {
                if (result.isValid) {
                    //sets the image data returned from the service
                    self._setLogoData(result.data);

                    //closes the dialog and hides the loading
                    self.layout.bizUiControlModalChangeLogo.removeClass('biz-ui-hide').dialog("close");
                } else {
                    self._showerrorMessage(result.messageCode);
                }
                self._removeLoadingOverlay($logoContent);

            }).fail(function(error) {
                self._removeLoadingOverlay($logoContent);
            });
        }
    },
    _getImageDataFromIframe: function() {
        var self = this;
        var $logoContent = $('.modal-change-logo');

        var $content = self.layout.bizUiControlModalChangeLogo;

        self._createLoadingOverlay($logoContent, '...');

        //uses the old way to get the base64 data
        $.when(self.dataService.getImageDataFromIframe($content, self.layout.$uploadIframe)).done(function(result) {
            if (result.isValid) {
                //sets the image data returned from the service
                self._setLogoData(result.data);

                //closes the dialog and hides the loading
                self.layout.bizUiControlModalChangeLogo.removeClass('biz-ui-hide').dialog("close");
            } else {
                self._showerrorMessage(result.messageCode);
            }
            self._removeLoadingOverlay($logoContent);

        }).fail(function(error) {
            self._removeLoadingOverlay($logoContent);
        });
    },
    _setLogoData: function(data) {
        var self = this;
        //sets the logo with the data returned by the service
        self.logo = data;

        //modifies the variable to report the changes
        //self._modifyVars();
        self._changeLogo(data);
        self._activeSaveButton();

    },
    _showerrorMessage: function(messageCode) {
        var errorContainer = $("#alert-file-upload");

        // Empty container
        errorContainer.empty();
        errorContainer.show();

        if (messageCode == 101) {
            errorContainer.html(bizagi.localization.getResource("widget-theme-builder-modal-error-file-extension"));

        } else if (messageCode == 102) {
            errorContainer.html(bizagi.localization.getResource("widget-theme-builder-modal-error-file-size"));
        }
    },
    _refreshWorkportalLogo: function(src) {
        $('.biz-ui-theme-panel-workportal').contents().find('#ui-bizagi-wp-app-menu-logo-client img').attr('src', src);

    },
    /*
     *
     */
    _addHandlerCategoryPanels: function(_instance) {
        var self = this;

        self.actualHighligthed = [];

        _instance.on('click', 'h3', function() {
            var $h3 = $('.biz-theme-category > h3', _instance);
            var $this = $(this);

            $('.biz-theme-category > h3 + .biz-theme-controls', _instance).addClass('isClose');

            if ($this.closest('.biz-theme-controls-item').length === 0) {
                if ($this.next().hasClass('isOpen')) {
                    $this.removeClass('biz-active');
                    $this.next().slideUp(function() {
                        $(this).removeClass('isOpen').addClass('isClose');
                    });
                } else {
                    $this.addClass('biz-active');
                    $this.next().slideDown(function() {
                        $(this).removeClass('isClose').addClass('isOpen');
                    });
                }
            }
        });


        /** show a related section **/
        _instance.on('mouseenter', 'h3[data-related]', function() {
            var $this = $(this);

            var keySearch = $this.data('related');
            var keyArray = keySearch.split(',');
            var _selfIframe = $('iframe');

            $.each(_selfIframe, function() {
                var $thisIframe = $(this);
                for (var i = 0; i < keyArray.length; i++) {
                    var $tmp = $thisIframe.contents().find(keyArray[i]);
                    if ($tmp.length > 0) {
                        self.actualHighligthed.push($tmp);
                        $tmp.addClass('highlight');
                        $tmp.attr('data-selection', $this.text());
                    }
                }

            });
        });

        _instance.on('mouseleave', 'h3[data-related]', function() {
            $.each(self.actualHighligthed, function(item, value) {
                value.removeClass('highlight');
            });

        });

        $('.biz-theme-category > h3 + .biz-theme-controls', _instance).addClass('isClose');
    },

    /*
     *
     */
    _createShortCutsSpans: function() {
        var self = this;
        $('.biz-theme-options-shortcut span').each(function() {
            var _self = $(this);
            var isColor = self.isValidColor(_self.text());
            var insideHtml = '';

            if (isColor) {
                _self.css('background-color', _self.text());
                _self.html(insideHtml);
            } else {
                if (_self.data('key').indexOf('font') != -1) {
                    _self.css('font-family', _self.text());
                    _self.addClass('font-dropdown');
                    _self.closest('.biz-theme-options-shortcut').addClass('biz-full-size');
                    _self.closest('h3').addClass('biz-full-size');
                }
                _self.addClass('noColor');
            }
        });

    },

    /*
     *
     */
    _applyPlugins: function() {
        var self = this,
            controlList;

        $('.biz-layout-tabs', self.element).tabs({
            beforeLoad: function(event, ui) {
                ui.jqXHR.error(function() {
                    ui.panel.html(
                        "Couldn't load this tab. We'll try to fix this as soon as possible. " +
                        "If this wouldn't be a demo.");
                });
            }
        });

        /* color inputs */
        controlList = $('.biz-ui-control-list', self.element);

        $('input', controlList).each(function() {
            var $this = $(this);
            var elVal = $this.val();

            if (elVal.indexOf('#') != -1) {
                $this.addClass(self.options.colorPickerClass);
            }

            if (elVal === 'true' || elVal === 'false') {
                $this.addClass(self.options.switchClass);
            }

            if (elVal === 'active' || elVal === 'inactive') {
                $this.addClass(self.options.radioClass);
            }
        });

        self._createSwitch();

        self._createRadioButtons();


        $('.biz-ui-theme-thumbs-selector > input').spectrum({
            autoUpdate: self.getAutoUpdate(),
            flat: false,
            showInput: true,
            clickoutFiresChange: true,
            cancelText: 'X',
            chooseText: bizagi.localization.getResource("widget-theme-builder-controls-label-apply")
        });

        $('.' + self.options.colorPickerClass).spectrum({
            autoUpdate: self.getAutoUpdate(),
            flat: false,
            showInput: true,
            clickoutFiresChange: true,
            cancelText: 'X',
            chooseText: bizagi.localization.getResource("widget-theme-builder-controls-label-apply"),
            show: function(color) {
                var _self = $(this);
                var pos = 0;
                var top = _self.css('top');
                var left = _self.css('left');

                _self.data('oPos', {
                    top: top,
                    left: left
                });
                var sp = $('.sp-container:visible');

                if (_self.data('spanFired')) {

                    var key = _self.data('key');
                    pos = $('span[data-key="' + key + '"]').offset();
                    _self.data('spanFired', false);

                } else {
                    pos = _self.next().offset();
                }

                var validH = pos.top + sp.height();
                var wH = $(window).height();
                if (validH > wH) {
                    pos.top = pos.top - sp.height();
                }

                sp.css({
                    top: pos.top,
                    left: pos.left + _self.next().width()
                });
            }
        });

        $('.biz-ui-control-panel').scroll(function() {
            $('.' + self.options.colorPickerClass).spectrum('hide');
        });
    },

    /*
     *
     */
    getAutoUpdate: function() {
        return false;
    },
    /***********************************************************************************
     **  Add to Queue
     **  Queue of variables to modify in Less
     ***********************************************************************************/
    _addtoQueue: function(field) {
        var self = this;
        var key = field.data('key');
        var value = (field.val()) ? field.val() : field.data('value');
        self.options._queue[key] = value;
        self._modifyVars();
        self._activeSaveButton();
    },
    _activeSaveButton: function() {
        var self = this;
        $('.biz-ui-button.biz-theme-save').removeClass('biz-ui-hide');
    },
    _inactiveSaveButton: function() {
        var self = this;
        $('.biz-ui-button.biz-theme-save').addClass('biz-ui-hide');
    },

    /*
     *
     */
    _createOneColorTheme: function(el) {
        var self = this;
        var oneColor = el.val();

        var obj = self._findElementsByAttribute('all', self.options.dataSource, 'lessFunction');
        var _queue = '{"@one-color-palette":"' + oneColor + '"';

        _queue += self._recursiveExploreCategories(obj);

        _queue += '}';
        _queue = _queue.replace(/("")/g, '","').replace(/(\(@one-color-palette, @one-color-palette%\))/g, '@one-color-palette');

        var queueJson = $.parseJSON(_queue);
        self.fromOneColorPalette = true;
        self._refreshFields(queueJson);
    },

    /*
     *
     */
    _recursiveExploreCategories: function(arr) {
        var self = this;
        var _data = '';
        for (var i = 0; i < arr.length; i++) {

            if (typeof arr[i] === 'object' && arr[i].length > 0) {
                _data += self._recursiveExploreCategories(arr[i]);
            } else {
                var tmpFunctionLess = arr[i].lessFunction;
                _data += '"' + arr[i].key + '":"' + tmpFunctionLess + '"';
            }
        }

        return _data;
    },

    /*
     *
     */
    _refreshFields: function(queueJson) {
        var self = this;
        self._toggleListColors();


        var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);

        if (currentThemeObj && ((self.currentSelectedThemeID !== self.options._baseID) && (currentThemeObj.value !== self.options._baseValue)) || self.fromOneColorPalette) {


            var oneColor = $('.' + self.options.oneColorTheme).val();

            for (var prop in queueJson) {
                var inputChange = $("input[data-key='" + prop + "']");
                if (inputChange.hasClass('biz-ui-color-picker')) {
                    var realVal = self._getRealValue(queueJson[prop], oneColor);
                    self.fromOneColorPalette = true;
                    inputChange.spectrum("set", realVal);
                    inputChange.val(realVal);
                    $('span[data-key="' + prop + '"]').css('background-color', realVal);
                } else if (prop.indexOf('image-') !== -1) {
                    inputChange.val(queueJson[prop]);
                    $('span[data-key="' + prop + '"]').css('background-image', queueJson[prop].replace('jquery/', '../jquery/'));

                    self._selectBackgroundImageOnModal();
                } else {
                    inputChange.val(queueJson[prop]);
                    self._refreshPlugins();
                }
            }
            $.extend(self.options._queue, queueJson);

            self._modifyVars(queueJson);
            self.fromOneColorPalette = false;

        } else {

            var selector = $('.biz-ui-theme-pre-build > h3');
            var idSelector = $('#' + self.currentSelectedThemeID);

            var thumbs = $('.biz-ui-thumbs-theme span', idSelector).clone();
            $('.biz-ui-thumbs-theme:first', selector).empty().append(thumbs);

            self._resetVarsCss();
        }
        //selects the logo speified for the active theme
        self._selectLogoForActiveTheme(self.currentSelectedThemeID);
    },

    /*
     *
     */
    _getRealValue: function(func, color) {
        var parser = new(less.Parser);
        var result = 'Error in _getRealValue :' + func + ' ' + color;
        var _queue = '@one-color-palette: ' + color + '; @one-color-theme: ' + color + ';';

        try {
            parser.parse(_queue + ' .class { color: ' + func + '; }', function(err, tree) {
                result = tree.toCSS();
            });
        } catch (e) {
            this._debug(e);
            this._debug(_queue);
            this._debug(func);
        }

        result = result.replace(/(\.[a-z]*\s+\{\s+[a-z:]*\s+(.*)\;\s+})/g, '$2').replace(/(\r\n|\n|\r)/g, '').replace(/\s{2}/g, '');
        return result;

    },

    /*
     *
     */
    isValidColor: function(str) {
        return str.match(/^#[a-f0-9]{6}$|^#[a-f0-9]{3}$/i) !== null;
    },
    /***********************************************************************************
     **  Execute Modify vars in Less
     **  modifyvars Less with queue variables
     ***********************************************************************************/
    _modifyVars: function(_queue) {
        var self = this;
        var queue = (_queue) ? _queue : self.options._queue;
        var color = $('.' + self.options.oneColorTheme).val();
        var toExport = "";

        /*Active Reset Button*/
        self._resetButton("show");

        if (Object.size(queue) > 0) {
            $("#biz-output-lines").data('change', true);
        }

        self._printDebugQueue(queue);

        //less.modifyVars(queue);


        var str = "{";
        for (var prop in queue) {
            str += '"' + prop + '":"' + self._getRealValue(queue[prop], color) + '",';
        }
        str += "}";
        str = str.replace(/(\,\})/g, '}');

        self.options._themeLessString = str;

        //TODO:Comment this line for produccion
        /*console.info(self.options._themeLessString.replace(/(")/gi, '\\"'));*/

        if (self.options._exportThemeString) {

            var __queue = $('.biz-ui-color-picker:not(.biz-one-color-theme)');
            var _str = '{';

            for (var i = 0; i < __queue.length; i++) {
                var el = $(__queue[i]);
                if (!queue[el.data('key')]) {
                    _str += '"' + el.data('key') + '":"' + el.val() + '",';
                }
            }
            _str += "}";

            _str = _str.replace(/(\"\,\})/gim, '"}');



            if (_str.length > 5) {
                toExport = _str + self.options._themeLessString;
                toExport = toExport.replace(/(\}\{)/gim, ',');
            } else {
                toExport = self.options._themeLessString;
            }

            toExport = toExport.replace(/(\")/gim, '\\"');
            $("#biz-output-json").val(toExport);

            self._debug(toExport);
        }

        var css = self._getCSSText();
        $("#biz-output-lines").val(css);

        if (self.options.autoPreview) {
            self._previewinPanel(css);
        }
    },
    _printDebugQueue: function(queue) {
        var self = this;
        if (self.options._debug) {
            JSON.stringify(queue);
        }
    },
    _resetVarsCss: function() {
        var self = this;
        var css = '';

        $("#biz-output-lines").val(css);

        if (self.options.autoPreview) {
            self._previewinPanel(css);
        }
    },
    _recreateSavedThemes: function() {
        var self = this;

        self.options.updateVersion = false;



        self.layout.themebuilder = $('.biz-theme-builder');

        var counter = 0;
        var count = 0;

        var themesRecreate = [];

        if (self.options._storage.currentTheme.id) {
            var _current = self.options._storage.currentTheme;
            var jsonCurrentData = self._getJsonDataToRecreate(_current);
            themesRecreate.push(jsonCurrentData);
        }

        counter = themesRecreate.length - 1;
        if (themesRecreate.length > 0) {
            $.each(themesRecreate, function(item, value) {


                var data = {};
                //Checks if is already published
                if (value.published) {
                    value.published = true;
                } else {
                    value.published = false;
                }

                if (!value.displayName || value.displayName === null) {
                    value.displayName = value.name;
                }
                data.json = JSON.stringify(value);
                data.id = value.id;
                data.published = value.published;
                data.displayName = value.displayName;
                var percent = 100;
                if (counter > 0) {
                    percent = Math.floor(count * 100 / counter);
                }

                $('body > .biz-theme-preloader .biz-theme-preloader-text').text(self.options._updatingText + ': ' + percent + '%');
                $.when(self.dataService.updateTheme(data)).done(function(result) {
                    if (count == counter) {


                        $('.biz-ui-update-all-themes').parent().fadeOut(function() {
                            $(this).remove();
                        });

                        setTimeout(function() {
                            if (!self.options._themeAutoUpdate) {
                                self._refreshPanelHeights();
                            }
                            self._createThemeList();
                        }, 1000);

                        self._removeLoadingOverlay($('body'), function() {});

                    } else {
                        if (counter > 0) {
                            percent = Math.floor(count * 100 / counter);
                        }
                        $('body > .biz-theme-preloader .biz-theme-preloader-text').text(self.options._updatingText + ': ' + percent + '%');
                        count++;
                    }

                }).fail(function(error) {
                    self._removeLoadingOverlay(self.layout.themebuilder);
                });


            });
        } else {

            self._removeLoadingOverlay(self.layout.themebuilder);
        }

        if (self.options._storage.errorUpdateThemeList) {
            self._showAlertToInvalidThemes();
        }

        self._loadTemplates(self.configuration.theme.templates);


    },

    _getJsonDataToRecreate: function(data) {
        var self = this;


        var cssVars = data.value;
        var cssVarsJson = $.parseJSON(cssVars);

        var name = data.name;

        var _queueString = '';
        for (var prop in self.options.actualKeys) {

            if (!cssVarsJson.hasOwnProperty(prop)) {
                _queueString += prop + ':  "";';
            } else {
                _queueString += prop + ':' + cssVarsJson[prop] + ';';

            }
        }

        var newCSS = '/*** @name:' + name + ' ***/' + self.options.stampVersionCss() + self._getCSSTextByQueueString(_queueString);
        var jsonData = {
            version: self.options._themeVersion,
            name: data.name,
            id: data.id,
            description: data.description,
            thumbs: data.thumbs,
            value: data.value,
            css: newCSS,
            type: data.type,
            logo: data.logo
        };

        if (data.published) {
            jsonData.published = true;
        }

        return jsonData;

    },

    _isAValidThemeToRecreate: function(val) {
        var self = this;
        var isValid = true;

        if (!val.value || !val.id) {
            isValid = false;
        } else if (val.value.length === 0) {
            isValid = false;
        }

        if (!isValid) {
            if (!self.options._storage.errorUpdateThemeList) {
                self.options._storage.errorUpdateThemeList = [];
            }

            self.options._storage.errorUpdateThemeList.push(val);
        }

        return isValid;
    },


    _showAlertToInvalidThemes: function() {
        var self = this;
        var invalidThemes = '';

        var ellipsis = $('.biz-ui-theme-part .biz-theme-ellipsis');

        $.each(self.options._storage.errorUpdateThemeList, function(item, value) {

            var nameCompare = value.name;

            for (var i = ellipsis.length - 1; i >= 0; i--) {
                var ellTempo = $(ellipsis[i]);
                var ellTempoText = ellTempo.text();
                var ellParent = ellTempo.closest('.biz-ui-theme-part');

                if (nameCompare === ellTempoText) {

                    ellParent.addClass('invalid-theme');
                    ellParent.attr('title', bizagi.localization.getResource("widget-theme-invalid-theme"));
                    ellParent.tooltip();

                    break;
                }
            }

        });
    },
    /***********************************************************************************
     **  Find Value by Key
     ***********************************************************************************/
    _findElementsByAttribute: function(key, data, attribute) {
        var self = this;
        var dataSource = (data) ? data : self.options.dataSource;
        var returnVal = [];
        var objAttr = (attribute) ? attribute : 'key';

        for (var i = 0; i < dataSource.length; i++) {
            if (dataSource[i].category.subcategory) {
                var tmpSubCat = self._getValueFromSubcategory(key, dataSource[i].category.subcategory, objAttr);
                if (tmpSubCat) {
                    returnVal.push(tmpSubCat);
                }
            } else if (dataSource[i].category.items) {
                var tmpCat = self._getValueFromItems(key, dataSource[i].category.items, attribute);
                if (tmpCat) {
                    returnVal.push(tmpCat);
                }
            }
        }

        return returnVal;
    },

    /*
     *
     */
    _getValueFromSubcategory: function(key, subcategory, attribute) {
        var self = this;
        var returnVal = false;
        for (var i = 0; i < subcategory.length; i++) {
            var tmpValue = self._getValueFromItems(key, subcategory[i].items, attribute);
            if (tmpValue) {
                if (!returnVal) {
                    returnVal = [];
                }
                returnVal.push(tmpValue);
            }
        }
        return returnVal;
    },

    /*
     *
     */
    _getValueFromItems: function(key, items, attribute) {
        var self = this;
        var returnVal = false;

        for (var i = 0; i < items.length; i++) {
            if (key === 'all') {
                if (items[i][attribute]) {
                    if (!returnVal) {
                        returnVal = [];
                    }
                    returnVal.push(items[i]);
                }
            } else {
                if (items[i][attribute] === key) {
                    if (!returnVal) {
                        returnVal = [];
                    }
                    returnVal.push(items[i]);
                }
            }
        }

        return returnVal;
    },

    /*
     *
     */
    _minify: function(prev) {

        var self = this,
            bizOutputLines, bizOutputJson, strToMinify;

        bizOutputLines = $("#biz-output-lines");
        bizOutputJson = $("#biz-output-json");

        strToMinify = bizOutputLines.val();

        strToMinify = strToMinify.replace(/(\r\n|\n|\r)/g, ' ').replace(/(\/\*([^*]|[\r\n]|(\*+([^\*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g, "").replace(/\s{2}/g, '');
        strToMinify = self._getMinifyMark() + strToMinify;

        bizOutputJson.val(self._gethemeLessString(true));
        bizOutputLines.val(strToMinify);
        bizOutputLines.data('change', false);
        if (prev) {
            self._previewinPanel(strToMinify);
        }
    },

    /*
     *
     */
    _getMinifyMark: function() {
        var self = this;
        var mark = '';
        var date = new Date();

        mark += "/********************************************************************** \r\n";
        mark += "\t" + self.configuration.theme.title + "\r\n";
        mark += "\t @date:    \t" + date + "\r\n";
        mark += "\t @version: \t" + self.configuration.theme.version + "\r\n";
        mark += "\t @support: \t";
        for (var i = 0; i < self.configuration.theme.support.length; i++) {
            mark += self.configuration.theme.support[i] + ' ';
        }
        mark += "\r\n";
        mark += "\t @author: \t" + self.configuration.theme.brand.alt + "\r\n";
        mark += "\t @website: \t" + self.configuration.theme.brand.url + "\r\n";
        mark += "**********************************************************************/ \r\n";


        return mark;

    },

    /***********************************************************************************
     ** Shows the modal with the upload file
     ***********************************************************************************/
    _readyForChangeLogo: function() {
        var self = this;
        //reload the object every time is closed and opened again
        self.layout.bizUiControlModalChangeLogo.remove();
        self.layout.bizUiControlModalChangeLogo = self.layout.bizUiControlModalChangeLogoUnchanged.clone(true);

        //sets the plugin and shows it
        self.layout.bizUiControlModalChangeLogo.removeClass('biz-ui-hide').dialog({
            height: "auto",
            width: '400',
            modal: true
        });

        var $fileControl = self.layout.bizUiControlModalChangeLogo.find('#fileUpload');

        var itShouldUseIframeWay = !$fileControl[0] || !$fileControl[0].files;

        //if user is using and old version of IE
        if (itShouldUseIframeWay) {
            self.layout.$uploadIframe = $('<iframe id="upload-iframe" name="upload-iframe"></iframe>').css({
                width: '0px',
                height: '0px',
                border: '0px solid #fff'
            });

            //sets the file control to use the form
            var $form = self.layout.bizUiControlModalChangeLogo.find('form');
            self.layout.bizUiControlModalChangeLogo.find('form').attr('target', 'upload-iframe');

            self.layout.$uploadIframe.appendTo(self.layout.bizUiControlModalChangeLogo.find('form'));
        }

        //upload button
        self.layout.bizUiControlModalChangeLogo.find('.biz-ui-theme-change-logo').click(function() {

            var selectedFile = $fileControl[0].files;
            if (self._fileWasSelected(itShouldUseIframeWay)) {
                //if client is using old IE browsers we should get the content differently
                if (itShouldUseIframeWay) {
                    if ($fileControl[0].value) {
                        self._getImageDataFromIframe();
                    }

                } else {
                    if (selectedFile && selectedFile[0]) {
                        self._getImageDataFromService(selectedFile);
                    }

                }

            } else {
                errorContainer = $("#alert-file-upload");

                // Empty container
                errorContainer.empty();
                errorContainer.show();
                errorContainer.html(bizagi.localization.getResource("widget-theme-builder-modal-error-no-file"));
            }

            return false;
        });

        $('.biz-ui-theme-upload-logo').change(function() {
            var files = $(this)[0].files;
            if (files && files.length > 0) {
                //  $('.biz-ui-theme-change-logo').removeAttr('disabled');
            } else {
                //  $('.biz-ui-theme-change-logo').attr('disabled', 'disabled');
            }

        });

    },

    _fileWasSelected: function(itShouldUseIframeWay) {
        var self = this;
        var $fileControl = self.layout.bizUiControlModalChangeLogo.find('#fileUpload');
        if (itShouldUseIframeWay) {
            if ($fileControl[0].value) {
                return true;
            }
        } else {
            var selectedFile = $fileControl[0].files;
            if (selectedFile && selectedFile[0]) {
                return true;
            }
        }
        return false;
    },


    /***********************************************************************************
     **  New Theme
     ***********************************************************************************/
    _readyForNew: function() {
        var self = this;
        self.layout.bizUiControlModalNew.removeClass('biz-ui-hide').dialog({
            height: "auto",
            width: '400',
            modal: true
        });


        var inputChange = $('input.color-picker', self.layout.bizUiControlModalNew);
        inputChange.change(
            function() {
                $('.' + self.options.oneColorTheme).val(inputChange.val());
            });

        $('.color-picker', self.layout.bizUiControlModalNew).each(function() {
            var $this = $(this);
            $this.spectrum("set", "#fff");
        });
    },
    /***********************************************************************************
     **  Save Theme and publish css as minified string
     ***********************************************************************************/
    _readyForSave: function(goService) {
        var self = this,
            bizOutputLines, bizOutputJson;

        self._minify(!goService);

        if (goService) {


            bizOutputLines = $("#biz-output-lines");
            bizOutputJson = $("#biz-output-json");

            var objectTheme = $.parseJSON(bizOutputJson.val());
            var selectedThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);

            var selected = $('.biz-ui-theme-part.biz-ui-active');
            if (selected.length) {
                self.currentSelectedThemeID = selected.attr('id');
            }

            //Check if there is selected theme
            if (self.currentSelectedThemeID && (self.currentSelectedThemeID.length > 0) && (self.local.save.displayName.length === 0)) {

                var result = self._getThemeDataByID(self.currentSelectedThemeID);

                //Fill the fields with the required info
                $('input[name="name"]', self.layout.bizUiControlModalUpdate).val(result.displayName);
                $('textarea', self.layout.bizUiControlModalUpdate).val(result.description);

                //Show the save modal
                self.layout.bizUiControlModalUpdate.removeClass('biz-ui-hide').dialog({
                    height: "auto",
                    width: '400',
                    modal: true
                });

                $('.color-picker', self.layout.bizUiControlModalUpdate).each(function() {
                    var $this = $(this);
                    $this.spectrum("set", Object.random(objectTheme));
                });


                var selector = $('#' + self.currentSelectedThemeID);
                if (selector.data().hasOwnProperty('save')) {
                    $('.biz-ui-theme-update', self.layout.bizUiControlModalUpdate).show();
                } else {
                    var valueName = $('input[name="name"]', self.layout.bizUiControlModalUpdate).val() + ' copy';
                    $('input[name="name"]', self.layout.bizUiControlModalUpdate).val(valueName);
                    $('.biz-ui-theme-update', self.layout.bizUiControlModalUpdate).hide();
                }

            } else if (self.local.save.displayName.length) {

                $(".biz-ui-theme-part").removeClass('active');
                $('.color-picker', self.layout.bizUiControlModalSave).each(function() {
                    var $this = $(this);
                    $this.spectrum("set", Object.random(objectTheme));
                });

                self._saveService(self.actionsType.SAVE);

            } else if ((self.currentSelectedThemeID == "")) {
                $(".biz-ui-theme-part").removeClass('active');

                self.layout.bizUiControlModalSave.removeClass('biz-ui-hide').dialog({
                    height: "auto",
                    width: '400',
                    modal: true
                });

                $('.color-picker', self.layout.bizUiControlModalSave).each(function() {
                    var $this = $(this);
                    $this.spectrum("set", Object.random(objectTheme));
                });
            }

        }
    },

    /*
     *
     */
    _saveService: function(saveMethod) {

        var self = this,
            currentModal;
        var name, description;
        var css, themeJson;
        var thumbs = [],
            thumbsContainer;
        var data = {};

        //Check if is saving new, or updating an existing
        if (saveMethod == self.actionsType.SAVE)
            currentModal = self.layout.bizUiControlModalSave;
        else
            currentModal = self.layout.bizUiControlModalUpdate;


        name = $('input[name="name"]', currentModal).val();
        description = $('textarea', currentModal).val();

        themeJson = self._gethemeLessString();
        css = self._getCSSText();

        thumbsContainer = $('.biz-ui-theme-thumbs-selector', currentModal);

        $('.color-picker', thumbsContainer).each(function(item, value) {
            thumbs.push($(value).val());
        });

        self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-saving-theme"));

        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');



        //If is not updating, then, is saving a new theme
        if ((saveMethod == self.actionsType.SAVE) || (saveMethod == self.actionsType.COPY)) {

            var nameField = $('input[name="name"]', currentModal);
            var logoTheme = self.logo;
            if (saveMethod == self.actionsType.SAVE) {
                logoTheme = self.configuration.theme.brand.defaultLogo;
            }
            name = self.validateIfNameExist(name).name;

            var actualId = Math.guid();
            data = {
                version: self.options._themeVersion,
                displayName: name,
                name: 'ThemeBuilder' + actualId,
                id: actualId,
                description: description,
                logo: logoTheme,
                thumbs: thumbs,
                predefined: false,
                value: themeJson,
                css: self.options.stampVersionCss() + css
            };

            self.options._savedThemeList = [data];
            //data = JSON.stringify(data);

            var sendDataJson = new _JsonThemeObject(data);
            var _strSendDataJson = JSON.stringify(sendDataJson);

            $.when(self.dataService.createTheme(_strSendDataJson)).done(function(result) {

                self._removeLoadingOverlay(self.layout.bizUiThemesList, function() {
                    self._refreshThemeList({
                        themes: self.options._savedThemeList
                    }, true);
                });

            }).fail(function(error) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        } //Otherwise, is updating an existing theme
        else {

            var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);

            var jsonData = {
                version: self.options._themeVersion,
                displayName: name,
                name: 'ThemeBuilder' + self.currentSelectedThemeID,
                id: self.currentSelectedThemeID,
                description: description,
                logo: self.logo,
                thumbs: thumbs,
                value: themeJson,
                css: self.options.stampVersionCss() + css,
                type: currentThemeObj.type
            };

            //Checks if is already published
            if (currentThemeObj.published)
                jsonData.published = true;

            var sendDataJson = new _JsonThemeObject(jsonData);
            var _strSendDataJson = JSON.stringify(sendDataJson);

            data.json = _strSendDataJson;
            data.id = self.currentSelectedThemeID;

            $.when(self.dataService.updateTheme(data)).done(function(result) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList, function() {
                    self._createThemeList();
                });
            }).fail(function(error) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        }


    },

    validateIfNameExist: function(name) {
        var self = this;
        var exist = false;


        var idWithName = self._getThemeIdByName(name);

        if (idWithName != null) {
            name = self.validateIfNameExist(name + ' copy').name;
        }

        return {
            exist: exist,
            name: name
        };
    },

    /*
     *
     */
    _publishService: function(id) {

        var self = this;
        var theme = self._getThemeDataByID(id);


        // just for IE8 (updateVersion);

        if (!theme.version)
            theme.version = self.options._localVersion;

        var updateVersion = bizagi.util.upVersion(theme.version, self.options._themeVersion);

        theme.value = theme.value || self.options._baseValue;

        theme.advCSS = self.options._advancedTheme || '';

        if (id !== self.options._baseID && theme.value !== self.options._baseValue) {
            // Recompile css

            var lessVars = "{}";
            lessVars = $.parseJSON(theme.value);
            theme.version = self.options._themeVersion;
            //self._refreshFields(lessVars);

            if (theme.displayName) {
                // Take recalculated data
                theme.css = '/*** @name:' + theme.displayName + ' ***/' + self.options.stampVersionCss() + self._getCSSText();
            } else {
                // Take recalculated data
                theme.css = '/*** @name:' + theme.name + ' ***/' + self.options.stampVersionCss() + self._getCSSText();
            }

        } else {
            theme.css = '/*** Base Theme  ***/';
        }

        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');

        // Validate just params to be serialize on backend
        var sendDataJson = new _JsonThemeObject(theme);
        var _strSendDataJson = JSON.stringify(sendDataJson);

        var dataUpdate = {};
        dataUpdate.json = _strSendDataJson;
        dataUpdate.id = theme.id;

        if (updateVersion) {
            $.when(self.dataService.updateTheme(dataUpdate)).done(function(result) {
                $.when(self.dataService.publishTheme(dataUpdate)).done(function(result) {
                    self._removeLoadingOverlay(self.layout.bizUiThemesList, function() {
                        self._createThemeList();
                    });
                })

            }).fail(function() {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        } else {

            $.when(self.dataService.publishTheme(dataUpdate)).done(function(result) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList, function() {
                    self._createThemeList();
                });
            }).fail(function(error) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        }


    },

    /*
     *
     */
    _createThemeList: function() {
        var self = this;

        self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-loading-theme-list"));

        //Reset the current Selected Theme
        self.currentSelectedThemeID = "";

        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');

        //Invoques the services to fecth the AllThemes, the DummyThemes, and the Current Theme
        //$.when(self.dataService.getAllThemes(), self.dataService.getDummyThemes(), self.dataService.getCurrentTheme()).done(function (serverThemes, mockThemes, currentTheme) {
        $.when(self.dataService.getAllThemes(), self.dataService.getCurrentTheme()).done(function(serverThemes, currentTheme) {

            if (currentTheme.id) {

                if ((currentTheme.name === "Bizagi GO" || currentTheme.name === "Bizagi") && currentTheme.id !== self.options._baseIdBizagiGO) {
                    currentTheme.id = self.options._baseID;
                }

                if (currentTheme.name === "Lost Woods" && currentTheme.id !== self.options._baseIdLostWoods) {
                    currentTheme.id = self.options._baseIdLostWoods;
                }

                if (currentTheme.name === "Beezagi" && currentTheme.id !== self.options._baseIdBeezagi) {
                    currentTheme.id = self.options._baseIdBeezagi;
                }

                var isNotMigrated = {
                    value: self._baseValue,
                    thumbs: ["#36454E", "#2E516B", "#5D6771", "#DEDEDE"]
                };


                if (!currentTheme.value) {
                    currentTheme = $.extend({}, currentTheme, isNotMigrated);
                }
            }

            var themes = self._preprocessThemes(serverThemes, currentTheme);

            self._removeLoadingOverlay(self.layout.bizUiThemesList, function() {
                self._refreshThemeList({
                    themes: themes
                }, false);
            });

        });
    },

    /*
     *
     */
    _preprocessThemes: function(serverThemes, currentTheme) {

        var self = this;
        var i = serverThemes.length,
            itemDummy;
        var j, k;
        var mockThemes = {
            themes: [].concat(self.options.predefinedThemes.themes)
        };

        var themes = [];

        //Convert string array of thumbs, to a real array
        while (i-- > 0) {
            itemDummy = serverThemes[i];
            serverThemes[i].thumbs = [].concat(itemDummy.thumbs);
        }

        k = serverThemes.length;

        while (k-- > 0) {

            if (serverThemes[k].displayName === null) {
                serverThemes[k].displayName = serverThemes[k].name;
            }

            if ((serverThemes[k].name === "Bizagi GO" || serverThemes[k].name === "Bizagi") && currentTheme.id !== self.options._baseIdBizagiGO) {
                serverThemes[k].id = self.options._baseID;
            }

            if (serverThemes[k].name === "Lost Woods" && serverThemes[k].id !== self.options._baseIdLostWoods) {
                serverThemes[k].id = self.options._baseIdLostWoods;
            }

            if (serverThemes[k].name === "Beezagi" && serverThemes[k].id !== self.options._baseIdBeezagi) {
                serverThemes[k].id = self.options._baseIdBeezagi;
            }

        }
        // Join both data origins and argument
        if (mockThemes.themes.length) {

            themes = self.validateRepeatedIds($.merge(mockThemes.themes, serverThemes));

        } else {
            themes = [].concat(serverThemes);
        }





        //Checks if the current theme is an predefined theme
        j = themes.length;


        while (j-- > 0) {

            if (themes[j].id == currentTheme.id) {

                //Stores the current selected theme
                self.currentSelectedThemeID = currentTheme.id;

                //Assign the processed css
                themes[j].css = currentTheme.css;
                break;
            }
        }

        return themes;
    },
    validateRepeatedIds: function(arr) {

        for (var i = 0; i < arr.length; ++i) {
            for (var j = i + 1; j < arr.length; ++j) {
                if (arr[i].id === arr[j].id)
                    arr.splice(j--, 1);
            }
        }

        return arr;

    },

    /*
     *
     */
    _refreshThemeList: function(data, newTheme) {

        var self = this,
            savedJson, savedThemesLayout;
        savedJson = (typeof data === 'string') ? $.parseJSON(data) : data;

        if (self.currentThemeList && newTheme) {

            self.currentThemeList = self.currentThemeList.concat(savedJson.themes);
        } else {

            self.currentThemeList = [].concat(savedJson.themes);
        }

        for (var i = 0; i < savedJson.themes.length; i++) {
            if (!savedJson.themes[i].thumbs) {
                savedJson.themes[i].thumbs = [];
            }

            if (savedJson.themes[i].thumbs.length === 0) {
                valJson = $.parseJSON(savedJson.themes[i].value);
                for (var j = 0; j < self.options.thumbs; j++) {
                    savedJson.themes[i].thumbs.push(Object.random(valJson));
                }
            }
        }

        //Create a theme list or add a new theme
        if (newTheme) {
            savedThemesLayout = $.tmpl("custom.theme.ui.controls.new", savedJson);
            self.layout.bizUiThemesList.find(".biz-theme-controls").append(savedThemesLayout);

        } else {
            savedThemesLayout = $.tmpl("custom.theme.ui.controls.themes", savedJson);
            self.layout.bizUiThemesList.empty().append(savedThemesLayout);
        }

        if (self.options._animations) {
            savedThemesLayout.hide();
            savedThemesLayout.fadeIn();
        }

        $('h3[title]', self.layout.bizUiThemesList).tooltip({
            tooltipClass: 'biz-ui-horizontal-align-tooltip biz-theme-title',
            position: {
                my: "right center",
                at: "left center"
            }
        });

        $('.biz-theme-button-side-bar [title]').tooltip({
            tooltipClass: 'biz-ui-horizontal-align-tooltip',
            position: {
                my: "left bottom",
                at: "right top"
            }
        });

        $('.biz-ui-theme-part[title]', self.layout.bizUiThemesList).attr('title', '');

        self._toggleListColors();

        if (self.options.tooltipPreview) {
            $('.biz-ui-theme-part[title]', self.layout.bizUiThemesList).tooltip({
                tooltipClass: 'biz-ui-horizontal-align-tooltip biz-theme-thumbnail',
                position: {
                    my: "left center",
                    at: "right center"
                },
                content: function() {
                    var _self = $(this);
                    var title = _self.attr('title');
                    var strReturn = title;
                    if (title) {
                        if (title.indexOf('.png') != -1 || title.indexOf('.jpg') != -1) {
                            strReturn = '<img src="' + title + '">';
                        }
                    }
                    return strReturn;
                }

            });
        }

        //Check if after processing the template, there is any element with the attribute  is published
        var publishTheme = $('.biz-ui-theme-part.biz-ui-active', self.element);

        if (self.local.save.displayName === null || !self.local.save.displayName) {
            self.local.save.displayName = self.local.save.name;
        }

        if (self.local.save.displayName.length) {
            self._selectActiveTheme(self._getThemeIdByName(self.local.save.displayName));
        } else if (self.currentSelectedThemeID != '' && !newTheme) {
            self._selectPublishedTheme(self.currentSelectedThemeID);
        } else {
            self.currentSelectedThemeID = publishTheme.attr('id');
        }

        if (publishTheme.length > 0 && !newTheme) {

            var str = $('input', publishTheme).val();
            var name = $('h4', publishTheme).text();
            var queueJson = $.parseJSON(str);
            self._refreshFields(queueJson);
            $('.biz-theme-name', self.layout.bizUiThemesList).text(printf(bizagi.localization.getResource("widget-theme-builder-title-theme-is-selected"), name));
            self._changeTitle(name);

        } else if (self.currentSelectedThemeID && self.currentSelectedThemeID != "" && !self.local.save.displayName.length) {

            var themeItem = self._getThemeDataByID(self.currentSelectedThemeID);
            var str = themeItem.value;
            var name = (themeItem.displayName !== null) ? themeItem.displayName : themeItem.name;

            var queueJson = $.parseJSON(str);
            self._refreshFields(queueJson);
            self.currentSelectedThemeID = "";

            $('.biz-theme-name', self.layout.bizUiThemesList).text(printf(bizagi.localization.getResource("widget-theme-builder-title-theme-is-selected"), name));

            self._changeTitle(name);

        } else if (publishTheme.length === 0 && !newTheme) {
            var name = $('h4', $('.biz-ui-theme-part:first', self.element)).text();

            self.currentSelectedThemeID = self.options._baseID;
            self._selectPublishedTheme(self.currentSelectedThemeID);
            self._refreshFields();
            self._changeTitle(name);
        } else {
            $('.biz-theme-name', self.layout.bizUiThemesList).text(bizagi.localization.getResource("widget-theme-builder-controls-label-select-a-theme"));
            self.local.save.displayName = "";
        }

        if (self.listThemeContainerIsOpen) {
            $('.biz-ui-selected-theme', savedThemesLayout).addClass('biz-active');
            $('.biz-theme-controls', savedThemesLayout).addClass('isOpen');
        }

        /*Hide Reset Button*/
        self._resetButton("hide");


    },
    _selectPublishedTheme: function(id) {
        var self = this;
        $('.biz-theme-publish.biz-ui-active').removeClass('biz-ui-active');

        var activeTheme = $('#' + id);
        activeTheme.addClass('biz-ui-active');

        $('.biz-theme-publish', activeTheme).addClass('biz-ui-active');
        $('.biz-theme-delete', activeTheme).replaceWith('<span class="biz-ui-button-spacer"></span>');

        self._selectTheme(activeTheme);
        self._selectLogoForActiveTheme(id);
    },
    _selectActiveTheme: function(id) {
        var self = this;
        var activeTheme = $('#' + id);

        if (activeTheme.data().hasOwnProperty('save')) {
            self._activeSaveButton();
        } else {
            self._inactiveSaveButton();
        }

        $('.biz-ui-theme-part.biz-ui-active').removeClass('biz-ui-active');
        activeTheme.addClass('biz-ui-active');

        //selects the  logo for the theme
        self._selectLogoForActiveTheme(id);

    },
    //when the user selects uany theme, we should change the logo as well
    _selectLogoForActiveTheme: function(themeId) {
        var self = this;
        //filters the active theme
        var selectedTheme = self._getThemeDataByID(themeId);
        var selectedLogo = selectedTheme && selectedTheme.logo;
        self._changeLogo(selectedLogo || self.configuration.theme.brand.logo, !selectedLogo);
    },
    /*
     *
     */
    _deleteTheme: function(id) {
        var self = this;
        var data = {
            id: id
        };

        self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-deleting-theme"));

        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');

        $.when(self.dataService.deleteTheme(data)).done(function(result) {
            //console.log("delete result", result);

            //Clean the current selected theme
            self.currentSelectedThemeID = "";

            self._removeLoadingOverlay(self.layout.bizUiThemesList, function() {
                self._createThemeList();
            });

        }).fail(function(error) {
            //console.log('error publishing theme', error.responseText);
            self._removeLoadingOverlay(self.layout.bizUiThemesList);
        });
    },

    /*
     *
     */
    _createPreviewPanel: function() {
        var self = this,
            iframeParent,
            _selfIframe,
            tmplPreview,
            tmplPreviewWebparts,
            counterPreviewWorkportal = 0,
            previewPanelHeight = 0,
            panelHeight = 0,
            tabsPanel;

        function Check_Version() {
            var rv = -1; // Return value assumes failure.

            if (navigator.appName == 'Microsoft Internet Explorer') {

                var ua = navigator.userAgent,
                    re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

                if (re.exec(ua) !== null) {
                    rv = parseFloat(RegExp.$1);
                }
            } else if (navigator.appName == "Netscape") {
                /// in IE 11 the navigator.appVersion says 'trident'
                /// in Edge the navigator.appVersion does not say trident
                if (navigator.appVersion.indexOf('Trident') === -1) rv = 12;
                else rv = 11;
            }

            return rv;
        }

        //If IE11 or EDGE
        var keyStorageAux = 'auxBizagiAuthentication';
        if (Check_Version() === 11 || Check_Version() === 12 && !window.sessionStorage.bizagiAuthentication && localStorage.getItem(keyStorageAux)) {
            sessionStorage.setItem('bizagiAuthentication', JSON.parse(localStorage.getItem(keyStorageAux)));
            localStorage.removeItem(keyStorageAux);
        }


        tmplPreview = $.tmpl('custom.theme.ui.controls.preview.workportal', {
            title: 'Preview Theme',
            url: self.options.previewPage
        });
        tmplPreviewWebparts = $.tmpl('custom.theme.ui.controls.preview.webparts', {
            title: 'Preview Theme',
            url: self.options.previewWebparts
        });

        var browser = self.options._browser;
        var version = self.options._version;

        $('iframe').load(function() {

            iframeParent = $('iframe').parent();
            self._createLoadingOverlay(iframeParent, bizagi.localization.getResource("widget-theme-builder-loading-workportal-message"));
            _selfIframe = $(this);

            self.globalInterval.push(setInterval(function() {
                var contents = _selfIframe.contents().find('#contentFramework');
                var contentsMe = _selfIframe.contents().find('#home-content');

                counterPreviewWorkportal++;
                if (contents.length > 0 || contentsMe.length > 0 || counterPreviewWorkportal > 20) {
                    for (var i = 0; i < self.globalInterval.length; i++) {
                        clearInterval(self.globalInterval[i]);
                    }
                    if (browser === 'Explorer' && version < 10) {
                        _selfIframe.contents().find('body').addClass('biz-theme-ie');
                    }
                    self._readyForSave(false);
                    self._removeLoadingOverlay($('iframe').parent());

                }

            }, 500));
        });

        self._refreshPanelHeights();
    },

    _refreshPanelHeights: function() {

        var updateLink = 0;
        var panelContainer = $(window).height() - $('header.clearfix').outerHeight();
        $('.biz-layout-panel-container').height(panelContainer);

        var buttonBar = $('.biz-ui-actions-bar').height();
        var controlPanel = panelContainer - buttonBar;

        if ($('.biz-ui-update-all-themes').parent().length) {
            if ($('.biz-ui-update-all-themes').parent().is(':visible')) {
                updateLink = $('.biz-ui-update-all-themes').parent().height();
            }
        }

        $('.biz-ui-control-panel').height(controlPanel);


        var tabsNav = $('.ui-tabs-nav');
        var tabsHeight = 0;
        if (tabsNav.is(':visible')) {
            tabsHeight = tabsNav.outerHeight();
        }

        var previewPanelHeight = panelContainer - tabsHeight - updateLink;
        $('.ui-tabs-panel').height(previewPanelHeight);
        $('.ui-tabs-panel iframe').height(previewPanelHeight);

    },

    /*
     *
     */
    _createLoadingOverlay: function(_instance, text, response) {
        var h = (_instance.height() / 2) - 30;
        var altMax = (h <= 0) ? '45%' : h;


        if (_instance.has('.biz-theme-preloader').length > 0) {
            $('.biz-theme-preloader-text', _instance).attr("style", "top:'" + altMax + "'px;").text(text);
            $('.biz-theme-preloader', _instance).show();
        } else {
            _instance.append('<div class="biz-theme-preloader"><span class="biz-theme-preloader-text" style="top:' + altMax + 'px;">' + text + '</span></div>');
        }

        if (response) {
            response();
        }
    },

    /*
     *
     */
    _removeLoadingOverlay: function(_instance, callback) {

        if (_instance.has('.biz-theme-preloader').length > 0) {
            $('.biz-theme-preloader', _instance).fadeOut(function() {
                if (callback) {
                    callback();
                }
            });
        }
    },

    /*
     *
     */

    _previewinPanel: function(str) {
        var self = this;
        self._checkStylesForAppend();

        var prevPanelWorkPortal = $('.biz-ui-theme-panel-workportal').contents().find('head').find('#bizagi-theme');
        var prevPanelWebParts = $('.biz-ui-theme-panel-webparts').contents().find('head').find('#bizagi-theme');

        prevPanelWorkPortal.replaceWith('<style id="bizagi-theme">' + str + '</style>');
        prevPanelWebParts.replaceWith('<style id="bizagi-theme">' + str + '</style>');
    },

    _checkStylesForAppend: function() {
        var self = this;
        var instance = $('.biz-ui-theme-panel-workportal').contents().find('head');
        var styles = $('style', instance);
        for (var i = 0; i < styles.length; i++) {
            var el = $(styles[i]);
            var elID = el.attr('id');
            if (elID === 'bizagi-theme') {
                el.remove();
            }
        }

        var reference = $('link[href*="bizagi.custom.styles.css"]', instance);
        var style = $('<style id="bizagi-theme"></style>');

        if (reference.length) {
            style.insertBefore(reference);
        } else {
            instance.append(style);
        }
    },

    /*
     *
     */
    _reset: function() {
        var self = this;

        $('.biz-ui-theme-part.biz-ui-active').trigger('click');

        //Clean the current selected theme
        self._restoreLogo();
        self._restoreTitle();
        self.currentSelectedThemeID = "";

    },

    /*
     *
     */
    _selectAll: function(node) {
        var self = this;
        var browser = self.options._browser;
        if (browser === 'Explorer') {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (browser === 'Mozilla' || browser === 'Opera' || browser === 'Chrome') {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (browser === 'Safari') {
            var selection = window.getSelection();
            selection.setBaseAndExtent(node, 0, node, 1);
        }
    },

    /* called when created, and later when changing options
     *
     */
    _refresh: function() {
        this.element.css("background-color", "rgb(" +
            this.options.red + "," +
            this.options.green + "," +
            this.options.blue + ")"
        );

        // trigger a callback/event
        this._trigger("change");
    },

    /*
     *
     */
    _getCSSText: function() {
        var self = this;

        var _queueString = '';
        var cssText = '';
        var result = '';

        var inputsKey = $('input[data-key]');

        inputsKey.each(function() {
            var $this = $(this);
            var $dataKey = $this.data('key');
            if ($dataKey === '@one-color-theme') {
                $dataKey = '@one-color-palette';
            }
            _queueString += $dataKey + ': ' + $this.val() + ';';
        });

        return self._getCSSTextByQueueString(_queueString);
    },

    _getCSSTextByQueueString: function(_queueString) {
        var self = this;
        var parser = new(less.Parser);
        var result = 'Error in _getCSSTextByQueueString: ' + _queueString;
        var rules = (self.themeRulesBase.length > 0) ? self.themeRulesBase : '';
        var _queue = '@white: #FFF ; @one-color-palette: #000 ; @one-color-theme: #000;';

        try {
            parser.parse(_queueString + _queue + rules, function(err, tree) {
                result = tree.toCSS() + self.options._advancedTheme;
            });
        } catch (e) {
            this._debug(_queueString + rules);
            this._debug(e);
        }

        return result;
    },

    /*
     *
     */
    _getObjectFromComment: function(data) {

        var myInfoJson = '{';
        $.each(data, function(item, value) {
            var key = value.replace(/\@/gi, '').split(':');
            var jsonText = '"' + $.trim(key[0]) + '":"' + $.trim(key[1]) + '" ';
            myInfoJson += jsonText;
        });

        myInfoJson += '}';


        myInfoJson = myInfoJson.replace(/(\"\s\")/gim, '","');
        myInfoJson = $.parseJSON(myInfoJson);
        return myInfoJson;
    },

    _selectBackgroundImageOnModal: function() {
        var self = this;
        var initSideBgImageField = $('input[data-key="@sidebar-image-theme"]');
        $('.thumbnail.active', self.layout.bizUiControlModalChangeBackgroungImage).removeClass('active');
        self.layout.bizUiControlModalChangeBackgroungImage.find('.thumbnail').each(function(item, value) {
            var $el = $(value);
            var dataValue = $el.data('value');
            if ((initSideBgImageField.val() === 'none') && (dataValue.indexOf('not-alowed') !== -1)) {
                $el.addClass('active');
                $('span[data-key="@sidebar-image-theme"]').attr('style', 'background-image:url(' + dataValue + ');');
            } else if (initSideBgImageField.val().indexOf(dataValue.replace('../', '')) !== -1) {
                $el.addClass('active');
            }
        })
        $('.thumbnail.active', self.layout.bizUiControlModalChangeBackgroungImage).focus();
    },

    /*

     */
    _createBackgroundImages: function() {
        var selectElelement = false,
            self = this;
        var sideBackground = self._findElementsByAttribute('@sidebar-image-theme', self.options.dataSource, 'key');

        if (sideBackground) {
            var initSideBgImageField = $('input[data-key="@sidebar-image-theme"]');
            var initSideBgImageButton = $('span[data-key="@sidebar-image-theme"]');


            var label = initSideBgImageField.val().split(',')[0].replace(/(\')/gi, '');


            if (initSideBgImageField.val() !== 'none') {
                initSideBgImageButton.attr('style', 'background-image:' + initSideBgImageField.val());
                initSideBgImageButton.addClass('biz-button-image');
            }

            self.layout.bizUiControlModalChangeBackgroungImage.find('.thumbnail').click(
                function() {

                    $('.thumbnail.active', self.layout.bizUiControlModalChangeBackgroungImage).removeClass('active');
                    var $el = $(this);
                    var url = $el.data('source');
                    var src = $el.data('value');

                    if (url) {
                        $el.addClass('active').focus();
                        initSideBgImageField.val(url);
                        initSideBgImageField.attr('value', url);
                        initSideBgImageButton.text(url);

                        if (src !== 'none') {
                            initSideBgImageButton.attr('style', 'background-image:url("' + src + '")');
                        }


                        self._addtoQueue(initSideBgImageField);
                    }

                }
            );

            self.layout.bizUiControlModalChangeBackgroungImage.find('.biz-ui-button').click(function() {
                self.layout.bizUiControlModalChangeBackgroungImage.dialog('close');
            });

            initSideBgImageButton.parent().on("click", function() {

                self.layout.bizUiControlModalChangeBackgroungImage.removeClass('biz-ui-hide').dialog({
                    height: "auto",
                    width: '750',
                    modal: true,
                    open: function() {
                        self._selectBackgroundImageOnModal();
                    }
                });
            });
        }
    },

    /*
     *
     */
    _createFontFamily: function() {
        var self = this;
        var fontFamily = self._findElementsByAttribute('@font-family', self.options.dataSource, 'key');
        if (fontFamily) {
            var initFontField = $('input[data-key="@font-family"]');

            var label = initFontField.val().split(',')[0].replace(/(\')/gi, '');

            var myFontSelect = $(self._createSelect(self.options.secureFonts, '@font-family', initFontField.val()));

            $('.select', myFontSelect).on("click", "li", function(event) {
                var _self = $(this);
                var _parent = _self.parent();
                var parent = _self.closest('.biz-theme-category');

                var initFontField = $('input[data-key="@font-family"]');

                initFontField.val(_self.data('value'));
                initFontField.data('label', _self.text());
                initFontField.attr('value', _self.data('value'));

                var keyField = $('span[data-key="' + initFontField.data('key') + '"]');

                keyField.text(initFontField.data('label'));
                keyField.css('font-family', initFontField.val());


                self._addtoQueue(initFontField);
                if (_parent.hasClass('isOpen')) {
                    $('h3', parent).removeClass('biz-active');
                    _parent.removeClass('isOpen').addClass('isClose');
                } else {
                    _parent.addClass('isClose').addClass('isOpen');
                }

            });


            var selected = $('.select li[selected]', myFontSelect).text();
            $('span[data-key="' + initFontField.data('key') + '"]').text(selected);

            myFontSelect.insertAfter(initFontField);
            initFontField.remove();



            $('span[data-key="@font-family"]').closest('h3').addClass('no-label');


            $(document).bind('click.list', function(e) {
                var target = $(e.target);
                if (target.closest('.select').length === 0) {
                    var parent = target.closest('.biz-theme-category');
                    $('.select', myFontSelect).removeClass('isOpen').addClass('isClose');
                }
            });
        }
    },

    /***********************************************************************************
     **  Convert a Less String to Json Object
     ***********************************************************************************/
    _convertLesstoJson: function(data) {
        var self = this,
            jsonLess,
            jsonTmp,
            jsonLessArray = [],
            obj = {},
            catCounter = 0,
            newData;


        newData = self._replaceByRegExp(data);
        jsonTmp = $.parseJSON(newData);

        for (var i = 0; i < jsonTmp.less.length; i++) {
            if (jsonTmp.less[i].category) {

                obj = {
                    category: {
                        name: jsonTmp.less[i].category
                    }
                };
                jsonLessArray[jsonLessArray.length] = obj;

            } else if (jsonTmp.less[i].subcategory) {
                if (!jsonLessArray[jsonLessArray.length - 1].category.subcategory) {
                    jsonLessArray[jsonLessArray.length - 1].category.subcategory = [];
                }

                var related = jsonTmp.less[i].related;
                jsonLessArray[jsonLessArray.length - 1].category.subcategory.push({
                    name: jsonTmp.less[i].subcategory,
                    items: [],
                    related: (related) ? related : null
                });

            } else {

                if (jsonLessArray[jsonLessArray.length - 1].category.subcategory) {
                    var l = jsonLessArray[jsonLessArray.length - 1].category.subcategory.length - 1;
                    jsonLessArray[jsonLessArray.length - 1].category.subcategory[l].items.push(jsonTmp.less[i]);
                } else {

                    if (!jsonLessArray[jsonLessArray.length - 1].category.items) {
                        jsonLessArray[jsonLessArray.length - 1].category.items = [];
                    }

                    jsonLessArray[jsonLessArray.length - 1].category.items.push(jsonTmp.less[i]);
                }
            }
        }

        jsonLess = {
            less: jsonLessArray
        };

        return jsonLess;
    },
    /***********************************************************************************
     **  Replace comments to convert a less page in a Json string structure
     ***********************************************************************************/
    _replaceByRegExp: function(data) {
        var self = this;
        data = data.replace(/(\/\*\*\*\*([\*\s\@\:\.\-\(\)a-zA-Z0-9]*)\*\/)/gim, '');
        /* replace string for  categories */
        data = data.replace(/(\/\*\*\s+\=.*\s+)/gm, '{"category":"').replace(/(\s+[=].*\*\/)/gim, '"}');
        /* replace string for  commnets by objects */
        data = data.replace(/(\/\*\s+)/gm, '{').replace(/.*\=\s+\*\/|\s+\*\//gm, '"}');
        /*replace string for  labels*/
        data = data.replace(/(\/\*\*\s+label:\s+)/gim, '{"label":"');
        /*replace string for subcategories */
        data = data.replace(/(\/\*\*\s+)/gim, '{"subcategory":"');

        /* replace string to create json LESS variables */
        data = data.replace(/(@(.*):)/gim, '{"key":"$&",').replace(/(,+(.*);)/gim, ',"value":"$&"}');
        /* remove @imports from string */
        data = data.replace(/(@import.*;)/gim, '');
        /* replace colons and semicolons */
        data = data.replace(/(\"\,\s+)/gim, '"').replace(/\;/gi, '').replace(/\:\"\,/gi, '",');
        /* join variables key*/
        data = data.replace(/(\"\}\s+\{"key")/gim, '", "key"');


        /* replace strong to create an array object */
        data = data.replace(/(\}\s+)/gim, '},');

        /* replace oneColorPalette to create functions in json */
        data = data.replace(/(oneColorPalette:\s+(([@a-z-(,":0-9%)])*}?\s?([0-9%)"}]*)?))/gim, '","lessFunction":"$2"').replace(/(\"\,\s+([0-9]*\%))/gim, ",$2").replace(/(\"\")/gim, '"');
        /* replace string to create a related selector from workportal / webparts */
        data = data.replace(/(related)\:.+\[(.*)\]/gm, '","$1":"$2');

        data = '{"less":[' + data + ']}';
        data = data.replace(/(\,\])/gim, ']').replace(/(\[\s+\{)/gim, '[{').replace(/(\s+\")/gim, '"');

        return data;

    },

    /*
     *
     */
    _createSelect: function(options, key, value) {
        var self = this;

        var name = key.replace('@', '');
        var opts = {
            key: key,
            name: name,
            value: value,
            options: []
        };

        var selectedLabel = '';

        for (var i = 0; i < options.length; i++) {
            var obj = {};
            var opt = options[i];

            obj.label = (opt.label) ? opt.label : opt;
            obj.value = (opt.value) ? opt.value : opt;

            if (value === obj.value) {
                obj.selected = true;
                selectedLabel = obj.label;
            }

            opts.options.push(obj);
        }

        var list = $.tmpl("custom.theme.ui.controls.select", opts);

        return list;
    },

    _refreshPlugins: function() {
        var self = this;
        self._createSwitch();
        self._createRadioButtons();
    },

    /*
     *
     */
    _createRadioButtons: function() {
        var self = this;
        var inputRadio = $('.' + self.options.radioClass);

        inputRadio.each(function() {

            var $this = $(this);
            var key = $this.data('key');
            var value = $this.val();

            var $parent = $this.parent();

            $('.biz-theme-radio', $parent).remove();

            var radioTmpl = $.tmpl('custom.theme.ui.controls.radio', {
                key: key,
                value: value
            });
            $this.parent().append(radioTmpl);

            $this.addClass('biz-ui-hide');
            var radioControl = $('.biz-theme-radio-control', radioTmpl);


            radioControl.data('value', value);
            if (value === 'active') {
                radioTmpl.addClass('biz-theme-radio-on');
            } else {
                radioTmpl.addClass('biz-theme-radio-off');
            }

            radioTmpl.click(function() {
                var _self = radioControl;
                var valAct = _self.data('value');

                if (valAct === 'inactive') {

                    var referenceGroup = radioTmpl.closest('.biz-theme-controls-items');
                    var referenceWrapperItem = radioTmpl.closest('.biz-theme-controls-item');
                    var siblingsGroup = $('.biz-theme-radio > .biz-theme-radio-control', referenceGroup);

                    $('.biz-theme-radio', referenceGroup).removeClass('biz-theme-radio-on').addClass('biz-theme-radio-off');
                    siblingsGroup.data('value', 'inactive');
                    $('input', referenceGroup).val('inactive');

                    _self.data('value', 'active');
                    $('input', referenceWrapperItem).val('active');

                    $('input', referenceGroup).change();

                    radioTmpl.toggleClass('biz-theme-radio-on biz-theme-radio-off');
                    for (var i = 0; i < siblingsGroup.length; i++) {
                        self._addtoQueue($(siblingsGroup[i]));
                    }
                }
            });
        });
    },

    /*
     *
     */

    _resetButton: function(action) {
        if (action == "show") {
            $(".biz-ui-theme-button-bar .biz-ui-button.biz-theme-reset").show();
        } else {
            $(".biz-ui-theme-button-bar .biz-ui-button.biz-theme-reset").hide();
        }
    },

    /*
     *
     */
    _createSwitch: function() {
        var self = this;
        var inputSwitch = $('.' + self.options.switchClass);

        inputSwitch.each(function() {
            var $this = $(this);
            var key = $this.data('key');
            var value = $this.val();

            var $parent = $this.parent();
            $('.biz-theme-switch', $parent).remove();

            var switchTmpl = $.tmpl('custom.theme.ui.controls.switch', {
                key: key,
                value: value
            });
            $this.parent().append(switchTmpl);

            $this.addClass('biz-ui-hide');
            var switchControl = $('.biz-theme-switch-control', switchTmpl);


            switchControl.data('value', value);
            $('input', $this.parent()).val(value).change();


            if (self._booleanFromString(value)) {
                switchTmpl.addClass('biz-theme-switch-on');
            } else {
                switchTmpl.addClass('biz-theme-switch-off');
            }

            switchTmpl.click(function() {
                var _self = switchControl;
                var valAct = self._booleanFromString(_self.data('value'));
                if (valAct) {
                    _self.data('value', 'false');
                } else {
                    _self.data('value', 'true');
                }

                $('input', switchTmpl.parent()).val(_self.data('value')).change();

                switchTmpl.toggleClass('biz-theme-switch-on biz-theme-switch-off');
                self._addtoQueue(_self);
            });
        });
    },

    /*
     *
     */
    _booleanFromString: function(val) {
        if (typeof val == "string") {
            return (val.toLowerCase() === 'true') ? true : false;
        } else if (typeof val == "boolen") {
            return val;
        } else {
            return false;
        }
    },

    /*
     *
     */
    _getThemeDataByID: function(id) {
        var self = this;

        var i = self.currentThemeList.length;

        while (i-- > 0) {
            if (self.currentThemeList[i].id == id) {
                return self.currentThemeList[i];
            }
        }

        return null;
    },

    _getThemeIdByName: function(name) {
        var self = this;

        var i = self.currentThemeList.length;

        while (i-- > 0) {
            if (self.currentThemeList[i].displayName == name || self.currentThemeList[i].name == name) {
                return self.currentThemeList[i].id;
            }
        }

        return null;
    },

    // events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function() {
        // remove generated elements
        this.element.remove();
    },
    _debug: function(msg) {
        if (this.options._debug && console) {
            console.log(msg);
        }
    },
    _printDate: function() {
        var temp = new Date();

        var padStr = function(i) {
            return (i < 10) ? "0" + i : "" + i;
        };

        var dateStr = padStr(temp.getFullYear()) +
            '/' +
            padStr(1 + temp.getMonth()) +
            '/' +
            padStr(temp.getDate()) +
            ' | ' +
            padStr(temp.getHours()) +
            ':' +
            padStr(temp.getMinutes()) +
            ':' +
            padStr(temp.getSeconds());
        return dateStr;
    }
});

Object.keys = Object.keys || function(o, k, r) {
    r = [];
    for (k in o) r.hasOwnProperty.call(o, k) && r.push(k);
    return r
};

Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};


Object.random = function(obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

/**
 Serialize (Backend)
*/

_JsonThemeObject = function(data) {
    this.css = data.css || "";
    this.displayName = data.displayName || "";
    this.id = data.id || "";
    this.image = data.image || "";
    this.logo = data.logo || "";
    this.name = data.name || "";
    this.predefined = eval(data.predefined) || false;
    this.published = eval(data.published) || false;
    this.thumbs = data.thumbs || [];
    this.value = data.value || "";
    this.version = data.version || "";


    return this;
}
