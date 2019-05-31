/*
*   Name: BizAgi Template Services
*   Author: Diego Parra
*   Comments:
*   -   This class will provide a facade to access to all templates available on bizagi
*/

$.Class.extend("bizagi.templates.services.service", {
    /*  Static templates*/
    customTemplateFile: bizagi.loader.getResource("tmpl", "bizagi.overrides." + bizagi.detectDevice() + ".custom.templates"),
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
    getTemplate: function (template) {

        var self = this;
        var isCustomTemplate = false;


        // If the template contains double hash, it's because its in release mode, then we got to ignore the first hash
        template = template.replace(/([^#]*#)([^#]*#)([^#]*)/g, "$1$3");

        // If the template contains the hash before the question mark, we need to exchange them
        template = template.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g, "$1?$3#$2");

        if (bizagi.enableCustomizations) {
            var hash = self.getHash(template);

            // Check if a custom template has been given in order to override it
            if (self.Class.customTemplates[hash])
                isCustomTemplate = true;
        }

        if(isCustomTemplate || (bizagi.loader.environment !== "release")){
            return this.internalGetTemplate(template)
            .pipe(function (resolvedTemplate) {
                // Creates a in-memory element to hold the template
                return   $.template("#" + template, resolvedTemplate);
            });
        }
        else {
            return this.getTemplateForRelease(template).pipe(function (resolvedTemplate) {
                return   $.template("#" + template, resolvedTemplate);
            });
        }
    },

    /*
     *   Returns the template from cache or from ajax
     *   Must return a deferred
     */
    getTemplateWidget : function(template){
        var self = this;
        var isCustomTemplate = false;


        // If the template contains double hash, it's because its in release mode, then we got to ignore the first hash
        template = template.replace(/([^#]*#)([^#]*#)([^#]*)/g, "$1$3");

        // If the template contains the hash before the question mark, we need to exchange them
        template = template.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g, "$1?$3#$2");

        if (bizagi.enableCustomizations) {
            var hash = self.getHash(template);

            // Check if a custom template has been given in order to override it
            if (self.Class.customTemplates[hash])
                isCustomTemplate = true;
        }

        if(isCustomTemplate || (bizagi.loader.environment !== "release")){
            return this.internalGetTemplate(template)
                .pipe(function (resolvedTemplate) {
                    // Creates a in-memory element to hold the template
                    return  $.templates("#" + template, resolvedTemplate);
                });
        }
        else {
            return this.getTemplateForRelease(template).pipe(function (resolvedTemplate) {
                return  $.templates("#" + template, resolvedTemplate);
            });
        }
    },


    /*
    *   Returns the template from cache or from ajax
    *   Must return a deferred
    */
    getTemplateWebpart: function (template) {

        // If the template contains double hash, it's because its in release mode, then we got to ignore the first hash
        template = template.replace(/([^#]*#)([^#]*#)([^#]*)/g, "$1$3");

        // If the template contains the hash before the question mark, we need to exchange them
        template = template.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g, "$1?$3#$2");
        return this.internalGetTemplate(template)
	    .pipe(function (resolvedTemplate) {
	        // Creates a in-memory element to hold the template
	        return $.template("#" + template, resolvedTemplate);
	    });
    },

    /*
    * Load the production template and return requested template
    */
    getTemplateForRelease: function (template) {
        var self = this, defer = $.Deferred(), url, hash, cachedTemplate;

        // extract url
        if (self.containsHash(template)) {
            url = self.getUrlWithoutHashes(template);
            hash = self.getHash(template);
        } else {
            url = template;
            hash = "";
        }

        cachedTemplate = self.Class.cachedTemplates[url];

        if (!cachedTemplate) {
            $.when(self.loadTemplateFileForRelease(url))
            .done(function(){
                defer.resolve(self.processAndReturnTemplate(url, hash));
            });            
            
        } else {
            defer.resolve(self.processAndReturnTemplate(url, hash));
        }

        return defer.promise();
    },

    loadTemplateFileForRelease: function (url) {
        var self = this;
        var defer = $.Deferred();

        // Check in cache
        if (self.Class.cachedTemplates[url]) return self.Class.cachedTemplates[url];

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
        $.when($.ajax({ url: url, dataType: "text" }),
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

                    if ( index.indexOf("jsrender") >= 0){
                        delete self.Class.cachedTemplates[url][index];
                        
                        index = index.substring(0, index.indexOf("jsrender") - 1);
                        self.Class.cachedTemplates[url][index] = valueTemplate;
                        $.templates("#" + index, translatedTemplate);

                    } else {
                        $.template("#" + index, translatedTemplate);
                    }

                    self.Class.cachedTemplates[url][index] = self.Class.cachedTemplates[index] = translatedTemplate;


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
    processAndReturnTemplate: function (url, hash) {
        var self = this;
        var template = self.Class.cachedTemplates[url][hash];

        if (!template) {
            throw "template " + template + "doesn't exist";
        }

        return template;
    },

    /*
    *   Returns the template from cache or from ajax
    *   Must return a deferred
    */
    internalGetTemplate: function (template) {
        var self = this;
        var defer = new $.Deferred();
        var cachedTemplate = this.Class.cachedTemplates[template];
        if (!cachedTemplate) {

            // Check if the template has a hash
            if (self.containsHash(template)) {
                var url = self.getUrlWithoutHashes(template);
                var hash = self.getHash(template);

                // Check if a custom template has been given in order to override it
                if (self.Class.customTemplates[hash]) {
                    // Resolve deferred
                    defer.resolve(self.Class.customTemplates[hash]);
                    return defer.promise();
                }

                $.when(self.getTemplatePart(url, hash))
                .done(function (response) {
                    // Set in cache
                    self.Class.cachedTemplates[template] = response;

                    // Resolve deferred
                    defer.resolve(response);
                });

            } else {

                // Gets the full template
                $.when(self.getTemplateFile(template))
                .done(function (response) {

                    // Resolve deferred
                    defer.resolve(response);
                });
            }
        }
        else {

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
                bizagi.assert(responsePart.length > 0, "No template part (" + hash + ") found in content for:" + templateUrl);

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
        var cachedTemplate = this.Class.cachedTemplates[template];

        if (cachedTemplate) {
            return cachedTemplate;
        }

        // Not found in cache, fetch it with ajax
        return $.when(
                    $.ajax({ url: template, dataType: "text" }),
                    self.localization.ready()
                ).pipe(function (response) {
                    // if no response has been found in the source file return an empty template
                    if (!response) return "";

                    if (typeof (response) != "string") {
                        response = response[0];
                    }

                    if (typeof (response) == "undefined") return "";

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

                    // Cache all sub-templates
                    var temp = $("<div />").html(translatedTemplate);
                    $("script", temp).each(function (i, subTemplate) {
                        var id = $(subTemplate).attr("id"),
                            type = $(subTemplate).attr("type");

                        if ($.templates && type && type.indexOf('jsrender') >= 0){
                            $.templates("#" + id, $(subTemplate).html());
                        } else {
                            $.template("#" + id, $(subTemplate).html());
                        }
                    });

                    // Set in cache
                    self.Class.cachedTemplates[template] = typeof (translatedTemplate) === "string" ? translatedTemplate : translatedTemplate[0].outerHTML;

                    return translatedTemplate;
                });
    },

    /*
    *   Check if a url contains hashes
    */
    containsHash: function (url) {
        return url.indexOf("#") != -1;
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

// Overrides empty method to apply custom stuff
var originalEmptyMethod = jQuery.fn.empty;
jQuery.fn.empty = function () {
    // Call original jquery method
    var result = originalEmptyMethod.apply(this, arguments);

    // Check if it has loading property to apply plugin
    var element = $(this);
    if (element.hasClass("ui-bizagi-component-loading")) {
        element.loadingMessage();
    }

    // Return original response
    return result;
};
// Overrides detach method to apply custom stuff
jQuery.fn.fastEmpty = function () {
    // Call original jquery method
    this.children().remove();

    // Check if it has loading property to apply plugin
    var element = $(this);
    if (element.hasClass("ui-bizagi-component-loading")) {
        element.loadingMessage();
    }
};
// Overrides append and prepend method to apply custom stuff
var originalPrependMethod = jQuery.fn.prepend;
jQuery.fn.prepend = function() {
	// Check if it has loading property to apply plugin
	var element = $(this);
	if (element.length == 0) return jQuery.fn;
	if (element.data("loading")) {
		// Clear the container
		originalEmptyMethod.apply(this);
		element.data("loading", false);
	}
	
	// Call original jquery method
	var result = originalPrependMethod.apply(this, arguments);
	
	// Check if the new content has adjustable content
	if (element[0].tagName.toLowerCase() != "body"  && element.find(".ui-bizagi-component-adjustable").length > 0) {
		$(document).triggerHandler("resizeLayout");
    }
    element.removeData("loading");
	
	// Return original response
    return result;
};

var originalAppendMethod = jQuery.fn.append;
jQuery.fn.append = function() {
	// Check if it has loading property to apply plugin
	var element = $(this);
	if (element.length == 0) return jQuery.fn;
	if (eval(element.attr("data-loading"))) {
		// Clear the container
		originalEmptyMethod.apply(this);
		element.data("loading", false);
	}
	
	// Call original jquery method
	var result = originalAppendMethod.apply(this, arguments);
	
	// Check if the new content has adjustable content
	var tagName = element[0].tagName || "";
	if (tagName.toLowerCase() != "body"  && element.find(".ui-bizagi-component-adjustable").length > 0) {
		$(document).triggerHandler("resizeLayout");
    }
    element.removeData("loading");
	
	// Return original response
    return result;
};

/*
*   JQuery tmpl extension
*/
var originalTmplMethod = jQuery.tmpl;
jQuery.tmpl = function () {
    // Call original jquery method
    var result = originalTmplMethod.apply(this, arguments);
    if (arguments[2] && arguments[2].fast) return result;

    // Execute custom stuff after the template has been processed
    $(".ui-bizagi-component", result).each(function (i, element) {
        var component = $(element).attr("component");
        var parent = $(element).parent();
        while (parent[0].tagName.length == 0) {
            parent = parent.parent();
        }

        parent.attr("data-bizagi-component", component);
        $(element).detach();
    });

    // Configure loading message
    if ($("[data-loading=true]", result).length > 0) {
        $("[data-loading=true]", result).loadingMessage();
    }
    $("[data-loading=true]", result).addClass("ui-bizagi-component-loading");
    if (result.jquery) {
        // Check in root elements
        $.each(result, function (i, element) {
            if (element.outerHTML && $(element).is("[data-loading=true]")) {
                $(element).loadingMessage();
                $(element).addClass("ui-bizagi-component-loading");
            }
        });
    }

    // Configure adjustable containers
    $("[data-adjustable=true]", result).addClass("ui-bizagi-component-adjustable");
    if (result.jquery) {
        // Check in root elements
        $.each(result, function (i, element) {
            if (element.outerHTML && $(element).is("[data-adjustable=true]")) {
                $(element).addClass("ui-bizagi-component-adjustable");
            }
        });
    }

    // Return original response
    return result;
};

// Clone inner methods / objects
for(key in originalTmplMethod) {
	jQuery.tmpl[key] = originalTmplMethod[key];
}

// Extend with custom tags
$.extend(jQuery.tmpl.tag, {
    'component': {
    	 open: '_ = _.concat(\'<div class="ui-bizagi-component" component="$1"></div>\');'
    },
	'loading': {
    	 open: '_ = _.concat(\'data-loading="true"\');'
    },
	'adjustable': {
    	 open: '_ = _.concat(\'data-adjustable="true"\');'
    },
	'resource': {
		_default: { $1: "$data" },
    	 open: "if($notnull_1){_.push($.encode(bizagi.localization.getResource($1a)));}"
    },
    'log': {
		 open: "console.log($1, $2);"
    },
    'children': {
        open: "_ = _.concat(\'{{children}}');"
    },
    'control': {
        open: "_ = _.concat(\'{{control}}');"
    },
    'files': {
        open: "_ = _.concat(\'{{files}}');"
    },
    'result': {
        open: "_ = _.concat(\'{{result}}');"
    },
    'element': {
        open: "_ = _.concat(\'{{element $1}}');"
    },
    "for": {
        _default: { $2: "var i=1;i<=1;i++" },
        open: 'for ($2){',
        close: '};'
    }
});
