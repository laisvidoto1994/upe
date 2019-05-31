/*
 *   Name: BizAgi Localization Plugin
 *   Author: Nelson Daza
 *   Comments:
 *   -   This script creates a plugin with an options hash which defines the json resources to localize
 */


// Create or Define BizAgi namespace
bizagi = bizagi || {};
bizagi.l10n = bizagi.l10n || {};

bizagi.l10n.extend("bizagi.l10n",
// Static properties
    {},
// Methods 
    {
        /**
         * This method loads or returns a cached version of a dictionary for a given language
         * @override
         * @param language string
         * @returns {*}
         * @private
         */
        _getDictionary: function (language) {
            var self = this;
            var defer = new $.Deferred();
            language = language.toLowerCase();

            // Check for cache
            if ( self.dictionaries[language] ) {
                return self.dictionaries[language];
            }

            self._super( language ).always(function(){
                // Try to load the local mobile
                self._loadMobileLocalDictionary( language ).always(function(){
                    defer.resolve(self.dictionaries[language]);
                });
            });

            return defer.promise();
        },

        /**
         * Loads mobile resources
         * @param language string
         * @private
         */
        _loadMobileLocalDictionary: function (language) {
            var self = this;
            var defer = new $.Deferred();
            language = language.toLowerCase();

            // Load resource from web
            var userLanguage = self._getUserLanguage(language);

            var lang = userLanguage.toLowerCase().replace(/([^a-z]+)/g, "-").split("-").shift();

            self.service.getResourceDictionary("jquery/resources/mobile/bizagi.resources." + lang + ".json.txt?build=" + bizagi.loader.build)
                .done(function (dictionary) {
                    self.dictionaries[language] = $.extend(dictionary, self.dictionaries[language]);
                    defer.resolve(self.dictionaries[language]);
                })
                .fail(function () {
                    self.service.getResourceDictionary("jquery/resources/mobile/bizagi.resources.en.json.txt?build=" + bizagi.loader.build)
                        .done(function (dictionary) {
                            self.dictionaries[language] = $.extend(dictionary, self.dictionaries[language]);
                        })
                        .fail(function (_, status, errorMessage) {
                            console.log("Can't load mobile localization file for language: " + language + ", " + status + " - " + errorMessage); // jshint ignore:line
                        }).always(function(){
                            defer.resolve(self.dictionaries[language]);
                        });
                });

            return defer.promise();

        },

        /**
         * This method returns the localized version of the resource
         * @override
         * @param resource string Key of the resource
         * @param defaultValue string Default value in case key does not exists
         * @returns string resource found or default value
         */
        getResource: function (resource, defaultValue ) {
            var self = this;

            // Return original resource when not found on dictionary
            if (self.dictionary[resource] === undefined) {
                return ( defaultValue !== undefined ? defaultValue : resource );
            }

            // if found return translated resource
            return self.dictionary[resource];
        }

    });
