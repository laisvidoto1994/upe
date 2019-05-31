/*
 *   Name: BizAgi Localization Plugin
 *   Author: Diego Parra
 *   Comments:
 *   -   This script creates a plugin with an options hash which defines the json resources to localize
 */


// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.util = (typeof (bizagi.util) !== "undefined") ? bizagi.util : {};

$.Class.extend("bizagi.l10n",
// Static properties
    {
        templateRegex: /%{([\w-{}$.]+)}/,
        templateSubExpressionRegex: /[$]{([\w.]+)}/g
    },
// Methods 
    {
        /*
         *   Constructor
         */
        init: function (resourceLocationDefinition) {
            this.resourceLocationDefinition = resourceLocationDefinition;
            this.service = new bizagi.services.service();
            this.dictionaries = {};
            this.dictionary = {};
            this.readyDeferred = null;
            this.enableCustomizations = typeof (bizagi.enableCustomizations) !== "undefined" ? bizagi.enableCustomizations : (typeof (BIZAGI_ENABLE_CUSTOMIZATIONS) !== "undefined" ? BIZAGI_ENABLE_CUSTOMIZATIONS : true);
            this.defaultDatetimeInfo = (typeof BIZAGI_DEFAULT_DATETIME_INFO != "undefined") ? BIZAGI_DEFAULT_DATETIME_INFO : false;
        },
        /*
         *   This methods set the langague used to localize
         *   Returns a promise
         */
        setLanguage: function (language) {
            var self = this;

            self.language = language;
            self.readyDeferred = new $.Deferred();

            // Run async method
            $.when(self._getDictionary(language))
                .done(function (dictionary) {
                    self.dictionary = dictionary;

                    // Override Time Format defined on default.aspx
                    if (self.defaultDatetimeInfo) {
                        if (self.defaultDatetimeInfo.shortDateFormat) {
                            self.overrideSpecificResource('dateFormat', self.defaultDatetimeInfo.shortDateFormat);
                        }

                        if (self.defaultDatetimeInfo.timeFormat) {
                            self.overrideSpecificResource('timeFormat', self.defaultDatetimeInfo.timeFormat);
                        }
                    }


                    if (self.enableCustomizations) {
                        if (self.resourceLocationDefinition["custom"]) {
                            //BIZAGI_LOCAL_RESOURCES is defined only for test
                            var dictionaryService = (typeof BIZAGI_LOCAL_RESOURCES !== "undefined" && BIZAGI_LOCAL_RESOURCES) ? self.service.getResourceDictionary : self.service.getServerResourceDictionary;

                            //if languaje is the same, dont request twice culture
                            if(dictionaryService === self.service.getServerResourceDictionary && BIZAGI_LANGUAGE === self.language){
                                self.readyDeferred.resolve();
                            }
                            else{
                                dictionaryService(self.resourceLocationDefinition["custom"]).done(function (overrides) {
                                    if (self.enableCustomizations) {
                                        self.overrideResources(overrides);
                                    }
                                    self.readyDeferred.resolve();
                                });
                            }

                        }
                    } else {
                        self.readyDeferred.resolve();
                    }

                });
        },

        /*
         *   This methods load a set of new keys and merge to the current dictionary (LOCALLY initially)
         *   Returns a promise
         */
        loadLanguageExtension: function (language) {
            var self = this;

            self.language = language;
            self.readyDeferred = new $.Deferred();

            var loadLanguage = self.getLanguageFromCulture(language);
            if(typeof self.resourceLocationDefinition[loadLanguage.toLowerCase()] === "undefined"){
                loadLanguage = "default";
            }

            // Load local dictionary
            self.service.getResourceDictionary(self.resourceLocationDefinition[loadLanguage.toLowerCase()])
            .done(function (dictionary) {
                self.dictionaries[language.toLowerCase()] = self.dictionaries[language.toLowerCase()] || {};
                $.extend(self.dictionaries[language.toLowerCase()], dictionary);
                self.readyDeferred.resolve();
            })
            .fail(function (_, status, errorMessage) {
                alert("Can't load localization file for language: " + language + ", " + status + " - " + errorMessage);
            });

            return self.readyDeferred.promise();
        },

        /**
         * Get language by culture
         */
        getLanguageFromCulture: function(culture){
            return culture.indexOf('-') !== -1 ? culture.split('-')[0] : culture;
        },

        /*
         *   Get a localized name, resolving a localization complex object
         */
        resolvei18n: function (localizationObject) {
            if (!localizationObject)
                return "";
            if (typeof (localizationObject) == "string")
                return localizationObject;
            if (this.language && this.language != "default") {
                var result = localizationObject.i18n["default"].languages[this.language];
                if (result)
                    return result;
            }

            return localizationObject.i18n["default"];
        },
        /*
         *   This method returns the localized version of the resource
         */
        getResource: function (resource) {
            var self = this;

            // Return original resource when not found on dictionary
            if (self.dictionary[resource] == null)
                return resource;

            // if found return translated resource
            return self.dictionary[resource];
        },
        /*
         *   This method set the localized version of the resource
         */
        setResource: function (resource, value) {
            var self = this;
            if (resource && resource != "") {
                self.dictionary[resource] = value;
            }
        },
        getMessageFromLocalization: function (messageStatus, messageType, params, isFromServer) {
            var self = this, message = "";

            if (messageType == "error") {

                //Checks if the message comes from the server, so add it as it comes
                if (isFromServer) {
                    message = messageStatus;
                }
                else {

                    messageStatus = messageStatus.toLowerCase();

                    //Try to capture the error from the localization files
                    message = bizagi.localization.getResource("workportal-general-error-" + messageStatus);

                    //If is message does´nt exist, add the generic error
                    if (message == ("workportal-general-error-" + messageStatus)) {
                        var auxMessage = bizagi.localization.getResource("workportal-general-error-generic");
                        if(auxMessage === "workportal-general-error-generic"){ //if localization resources don't loaded
                            message = "The request could not be completed.";
                        }
                    }

                    //Checks is there is any extraparameter, to customise a field inside the error message
                    if (params) {
                        for (var i = 0; i < params.length; i++) {
                            message = message.replace("{" + i + "}", params[i]);
                        }
                    }
                }

            } else {
                message = bizagi.localization.getResource(messageStatus);            
            }

            return message;
        },
        /*
         *   This method locates all the localization hints (%) and translates the full text
         */
        translate: function (text) {
            var self = this;

            var nextToken;
            do {
                nextToken = this.Class.templateRegex.exec(text);

                if (nextToken) {
                    var enclosedValue = nextToken[1];
                    if (enclosedValue.indexOf("$") == -1) {
                        text = text.replaceAll(nextToken[0], self.getResource(enclosedValue));
                    } else {
                        var subExpressionToken = this.Class.templateSubExpressionRegex.exec(enclosedValue);
                        if (!subExpressionToken) {
                            var regEx = /[$]{([\w.]+)}/g;
                            subExpressionToken = regEx.exec(enclosedValue);
                        }
                        text = text.replaceAll(nextToken[0], "{{resource " + subExpressionToken[1] + "}}");
                    }
                }

            } while (nextToken != null);

            return text;
        },
        /*
         *   Allow to override some resources in order to allow project customizations
         */
        overrideResources: function (overrides) {
            var self = this;
            var userLanguage = self._getUserLanguage(self.language);
            // Only use current language overrides
            var languageOverrides = overrides[userLanguage];
            for (var resourceOverride in languageOverrides) {
                self.dictionary[resourceOverride] = languageOverrides[resourceOverride];
            }
        },
        /*
         *   Override value of specific language
         */
        overrideSpecificResource: function (key, value) {
            var self = this;
            key = key || "nodefined";
            value = value || "";

            self.dictionary[key] = value;
        },
        /*
         *   This method loads or returns a cached version of a dictionary for a given language
         */
        _getDictionary: function (language) {
            var self = this;
            var defer = new $.Deferred();
            language = language.toLowerCase();

            // Check for cache
            if (self.dictionaries[language] != null)
                return self.dictionaries[language];

            // Load resource from web
            var userLanguage = self._getUserLanguage(language);

            //BIZAGI_LOCAL_RESOURCES is defined only for test
            var dictionaryService = (typeof BIZAGI_LOCAL_RESOURCES !== "undefined" && BIZAGI_LOCAL_RESOURCES) ? self.service.getResourceDictionary:self.service.getServerResourceDictionary;

                dictionaryService(self.resourceLocationDefinition[userLanguage])
                    .done(function (dictionary) {
                        self.dictionaries[language] = dictionary;
                        defer.resolve(dictionary);
                    })
                    .fail(function (_, status, errorMessage) {
                        if(typeof _.responseJSON === "undefined" && _.status === 0 && _.statusText === "error" && errorMessage === ""){
                            console.log("Can't load localization file for language: " + language + ", " + status + " - " + errorMessage);
                        }
                        else{
                            alert("Can't load localization file for language: " + language + ", " + status + " - " + errorMessage);
                        }

                    });

                return defer.promise();

        },
        _getUserLanguage: function (language) {
            var self = this;

            // Load resource from web
            var userLanguage = language.toLowerCase();

            if (self.resourceLocationDefinition[userLanguage] == null && userLanguage.length > 0) {
                // get all the components of the language
                var userLanguageParts = userLanguage.split("-");
                // Check if any of the language fits (i.e. Norwegian is No, but there are nn-no variants)
                for (var i = userLanguageParts.length - 1; i >= 0; i--) {
                    if (self.resourceLocationDefinition[userLanguageParts[i]] != null) {
                        userLanguage = userLanguageParts[i];
                        break;
                    }
                };
            }

            if (userLanguage.length == 0 || self.resourceLocationDefinition[userLanguage] == null) {
                // Return default language
                bizagi.log("No resource definition location has been given for language :" + language + ", loading default language");
                userLanguage = "default";
            }

            return userLanguage;
        },
        /*
         *   Helps to check if the language is loaded
         */
        ready: function () {
            var self = this;
            return self.readyDeferred.promise();
        }
    });
