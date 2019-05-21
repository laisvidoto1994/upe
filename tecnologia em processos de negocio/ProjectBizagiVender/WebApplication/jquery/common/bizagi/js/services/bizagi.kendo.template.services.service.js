/*
*   Name: BizAgi Template Services
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This class will provide a facade to access to all templates available on bizagi
*/

$.Class.extend("bizagi.templates.services.service", {
    // Static templates
    customTemplateFile: bizagi.loader.getResource("tmpl", "bizagi.overrides." + bizagi.detectDevice() + ".custom.templates"),
    cachedFiles: {},
    cachedTemplates: {},
    customTemplates: {}
}, {
    /* 
    *   Constructor
    */
    init: function (localization) {
        this.localization = localization;
        this.cssRegex = /{{css "(.+)"}}/g;
        this.loadingFileDeferred = {};
    },

    /*
    *   Load custom templates info in order to override framework stuff
    */
    loadCustomTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(this.getTemplateFile(this.Class.customTemplateFile))
        .done(function (response) {
            var temp = $("<div />").html(response);
            var responseParts = $("script", temp);

            $.each(responseParts, function (i, responsePart) {
                responsePart = $(responsePart);
                self.Class.customTemplates[responsePart.attr("id")] = responsePart.html();
            });


            // Resolve deferred
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    *   Returns the template from cache or from ajax
    *   Must return a deferred
    */
    getTemplate: function (template, id) {
        var self = this;
        var isCustomTemplate = false;

        // If the template contains double hash, it's because its in release mode, then we got to ignore the first hash
        template = template.replace(/([^#]*#)([^#]*#)([^#]*)/g, "$1$3");

        // If the template contains the hash before the question mark, we need to exchange them
        template = template.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g, "$1?$3#$2");

        if (bizagi.enableCustomizations) {
            var hash = self.getHash(template);

            // Check if a custom template has been given in order to override it
            if (self.Class.customTemplates[hash]) {
                isCustomTemplate = true;
            }
        }

        if (isCustomTemplate || (bizagi.loader.environment !== "release")) {
            return this.internalGetTemplate(template, id)
                .pipe(function (resolvedTemplate) {
                    // Creates a in-memory element to hold the template
                    return resolvedTemplate;
                });
        } else {
            return this.getTemplateForRelease(template, id)
                .pipe(function (resolvedTemplate) {
                    return resolvedTemplate;
                });
        }
    },

    /*
     *   Returns the template from cache or from ajax
     *   Must return a deferred
     */
    getTemplateWidget: function (template, id) {
        var self = this;
        var isCustomTemplate = false;

        // If the template contains double hash, it's because its in release mode, then we got to ignore the first hash
        template = template.replace(/([^#]*#)([^#]*#)([^#]*)/g, "$1$3");

        // If the template contains the hash before the question mark, we need to exchange them
        template = template.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g, "$1?$3#$2");

        if (bizagi.enableCustomizations) {
            var hash = self.getHash(template);

            // Check if a custom template has been given in order to override it
            if (self.Class.customTemplates[hash]) {
                isCustomTemplate = true;
            }
        }

        if (isCustomTemplate || (bizagi.loader.environment !== "release")) {
            return this.internalGetTemplate(template, id)
                .pipe(function (resolvedTemplate) {
                    // Creates a in-memory element to hold the template
                    return resolvedTemplate;
                });
        } else {
            return this.getTemplateForRelease(template, id).then(function (resolvedTemplate) {
                return resolvedTemplate;
            });
        }
    },

    /*
    *   Returns the template from cache or from ajax
    *   Must return a deferred
    */
    getTemplateWebpart: function (template, id) {
        // If the template contains double hash, it's because its in release mode, then we got to ignore the first hash
        template = template.replace(/([^#]*#)([^#]*#)([^#]*)/g, "$1$3");

        // If the template contains the hash before the question mark, we need to exchange them
        template = template.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g, "$1?$3#$2");
        return this.internalGetTemplate(template, id)
            .pipe(function (resolvedTemplate) {
                // Creates a in-memory element to hold the template
                return resolvedTemplate;
            });
    },

    /*
    * Load the production template and return requested template
    */
    getTemplateForRelease: function (template, id) {
        var self = this;
        var defer = $.Deferred();
        var url;
        var hash;

        // extract url
        if (self.containsHash(template)) {
            url = self.getUrlWithoutHashes(template);
            hash = self.getHash(template);
        } else {
            url = template;
            hash = "";
        }

        var cachedTemplate = self.Class.cachedTemplates[url];
        if (!cachedTemplate) {
            $.when(self.loadTemplateFileForRelease(url))
            .done(function () {
                defer.resolve(self.processAndReturnTemplate(url, hash, id));
            });

        } else {
            defer.resolve(self.processAndReturnTemplate(url, hash, id));
        }

        return defer.promise();
    },

    loadTemplateFileForRelease: function (url) {
        var self = this;
        var defer = $.Deferred();

        // Check in cache
        if (self.Class.cachedTemplates[url]) {
            return self.Class.cachedTemplates[url];
        }

        // Check if it is already being loaded
        if (self.loadingFileDeferred[url]) {
            $.when(self.loadingFileDeferred[url])
            .done(function () {
                // Resolve with cached content
                defer.resolve(self.Class.cachedTemplates[url]);
            });
            return defer.promise();
        }

        // Load file via ajax
        self.loadingFileDeferred[url] = $.Deferred();
        $.when(
            $.ajax({ url: url, dataType: "text" }),
                self.localization.ready()
        ).done(function (response) {
            if (!response) {
                defer.reject("");
            }
            // response is an object
            if (typeof (response) != "string") {
                response = JSON.parse(response[0]);
            }

            self.Class.cachedTemplates[url] = response;

            // process templates for translate, remove CSS and generate global function template
            var index, valueTemplate, translatedTemplate;
            for (index in response) {
                if (response.hasOwnProperty(index)) {
                    valueTemplate = response[index];
                    translatedTemplate = self.localization.translate(valueTemplate);

                    // Remove css tags
                    translatedTemplate = translatedTemplate.replace(self.cssRegex, "");
                    self.Class.cachedTemplates[url][index] = translatedTemplate;
                }
            }

            self.loadingFileDeferred[url].resolve();
            defer.resolve(response);
        });

        return defer.promise();
    },

    /*
    * Return hashed template
    */
    processAndReturnTemplate: function (url, hash, id) {
        var self = this;
        var template = self.Class.cachedTemplates[id];

        if (!template) {
            template = self.Class.cachedTemplates[url][hash];
            if (!template) {
                throw "template " + template + "doesn't exist";
            } else {
                self.Class.cachedTemplates[id] = template;
            }
        }

        return template;
    },

    /*
    *   Returns the template from cache or from ajax
    *   Must return a deferred
    */
    internalGetTemplate: function (template, id) {
        var self = this;
        var defer = new $.Deferred();
        var cachedTemplate = this.Class.cachedTemplates[id];

        if (!cachedTemplate) {

            // Check if the template has a hash
            if (self.containsHash(template)) {
                var url = self.getUrlWithoutHashes(template);
                var hash = self.getHash(template);

                // Check if a custom template has been given in order to override it
                if (self.Class.customTemplates[url]) {
                    // Resolve deferred
                    if (self.Class.customTemplates[url][id]) {
                        defer.resolve(self.Class.customTemplates[hash]);
                        return defer.promise();
                    }
                }

                $.when(self.getTemplatePart(url, hash, id))
                    .done(function (response) {
                        // Set in cache
                        self.Class.cachedTemplates[id] = response;

                        // Resolve deferred
                        defer.resolve(response);
                    });

            } else {
                // Gets the full template
                $.when(self.getTemplateFile(template))
                    .done(function (response) {
                        self.Class.cachedTemplates[id] = response;
                        // Resolve deferred
                        defer.resolve(response);
                    });
            }
        } else {
            defer.resolve(cachedTemplate);
        }

        return defer.promise();
    },

    /*
    *   Gets a template part from a composite template file
    *   Just load one template at a time to avoid multiple loadings of the same file
    */
    getTemplatePart: function (templateUrl, hash) {
        var self = this;
        var defer = new $.Deferred();

        // If it is already loading a template set a timeout to check later
        $.when(self.loadingTemplatePartExecution)
        .done(function () {
            // Set a async flag to synchronize this method
            self.loadingTemplatePart = true;
            self.loadingTemplatePartExecution = new $.Deferred();

            // Load template file
            $.when(self.getTemplateFile(templateUrl))
            .done(function (response) {
                var temp = $("<div />").html(response);
                var responsePart = $("#" + hash, temp);

                // Assertion to check that hash exists inside the main template                
                if (BIZAGI_ENVIRONMENT === "debug" && responsePart.length === 0) {
                    console.warn("No template part (" + hash + ") found in content for:" + templateUrl);
                }

                // Set response
                response = responsePart.html();

                // Free async flag
                self.loadingTemplatePartExecution.resolve();
                self.loadingTemplatePart = true;

                // Resolve main deferred
                defer.resolve(response);
            });
        });

        return defer.promise();
    },

    /*
    *   Loads a full template file and keeps it on cache
    */
    getTemplateFile: function (template) {
        var self = this;
        var cachedTemplate = this.Class.cachedFiles[template];

        if (cachedTemplate) {
            return cachedTemplate;
        }

        // Not found in cache, fetch it with ajax
        return $.when(
                    $.ajax({ url: template, dataType: "text" }),
                    self.localization.ready()
                ).pipe(function (response) {
                    // if no response has been found in the source file return an empty template
                    if (!response) { return ""; }

                    if (typeof (response) != "string") {
                        response = response[0];
                    }

                    // Translate template
                    var translatedTemplate = self.localization.translate(response);

                    // Find css and import them
                    var matches = translatedTemplate.match(self.cssRegex);
                    if (matches) {
                        $.each(matches, function (i, match) {
                            var cssFile = match.replace(self.cssRegex, "$1");
                            bizagi.loader.loadFile({
                                src: cssFile,
                                type: "css",
                                environment: "debug"
                            });
                        });
                    }
                    // Remove css tags
                    translatedTemplate = translatedTemplate.replace(self.cssRegex, "");

                    // Set in cache
                    self.Class.cachedFiles[template] = typeof (translatedTemplate) === "string" ? translatedTemplate : translatedTemplate[0].outerHTML;

                    return translatedTemplate;
                });
    },

    /*
    *   Check if a url contains hashes
    */
    containsHash: function (url) {
        return url.indexOf("#") !== -1;
    },

    /*
    *   Get url hash
    */
    getHash: function (url) {
        return url.substring(url.indexOf("#") + 1, url.length);
    },

    /*
    *   Get url without hashes
    */
    getUrlWithoutHashes: function (url) {
        return url.substring(0, url.indexOf("#"));
    }
});

/**
 *   Overrides detach method to apply custom stuff
 */
jQuery.fn.fastEmpty = function () {
    // Call original jquery method
    this.children().remove();

    // Check if it has loading property to apply plugin
    var element = $(this);
    if (element.hasClass("ui-bizagi-component-loading")) {
        element.loadingMessage();
    }
};

/**
 *   JQuery tmpl extension
 */
jQuery.fasttmpl = function (tmpl, data) {
    if (typeof tmpl === "undefined") {
        return "";
    }

    tmpl = tmpl.replace(/(\n*)|(\r*)|(\t*)/g, "");
    tmpl = tmpl.replace(/\s+/g, " ");

    var tempTmpl = kendo.template(tmpl, { useWithBlock: false });
    var html = tempTmpl(data);

    html = html.replace(/>\s*</g, "><").trim();

    return html;
};


jQuery.tmpl = function (tmpl, data) {
    return $(jQuery.fasttmpl(tmpl, data));
};

jQuery.cacheTemplate = function (tmpl, data) {
    return jQuery.fasttmpl(bizagi.templates.services.service.cachedTemplates[tmpl], data);
};