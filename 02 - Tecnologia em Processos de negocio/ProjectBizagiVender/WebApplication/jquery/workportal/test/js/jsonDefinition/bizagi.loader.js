/*
*   Name: BizAgi Master Loader
*   Author: Diego Parra
*   Comments:
*   -   This script will define a prototype that is capable to load a bizagi definition module
*/


var bizagi = bizagi || {};
bizagi.override = bizagi.override || {};

var rnd = Math.ceil(Math.random() * 100000);
bizagi.defaultModuleDefinitionPath = "jquery/bizagi.module.definition.json.txt?rnd=" + rnd;
bizagi.defaultWebPartDefinitionName = "webpart.definition.json.txt";

/*
*   Merges to objects into one
*/
bizagi.merge = function (o1, o2) {
    for (var i in o2) {
        o1[i] = o2[i];
    }
    return o1;
};

/*
*   Creates a replace all method that is left from the String Class
*/
bizagi.replaceAll = function (text, pcFrom, pcTo) {
    var temp = text;
    var index = temp.indexOf(pcFrom);
    while (index != -1) {
        temp = temp.replace(pcFrom, pcTo);
        index = temp.indexOf(pcFrom, index + pcTo.length);
    }
    return temp.toString();
};
/*
*   Reads the query string parameters
*/
bizagi.readQueryString = function () {
    var queryString = window.location.search.substring(1);
    var splitQueryString = queryString.split("&");
    var queryStringHashTable = {};
    for (var i = 0; i < splitQueryString.length; i++) {
        var singleKeyValue = splitQueryString[i].split("=");
        queryStringHashTable[singleKeyValue[0]] = singleKeyValue[1];
    }
    return queryStringHashTable;
};

bizagi.detectSO = function () {

    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
        if (navigator.userAgent.toLowerCase().search("android") > -1) {
            return "android";
        }
        else {
            return "ios";
        }
    }

    return "ios";
};

/*
*   Detect a device based on the width
*/
bizagi.detectDevice = function () {
    // Check for a hard-coded device
    var device = (typeof (BIZAGI_DEFAULT_DEVICE) !== "undefined" && BIZAGI_DEFAULT_DEVICE != "" ? BIZAGI_DEFAULT_DEVICE : null);

    if (!device) {
        // Check for a device configured in the querystring
        var queryString = bizagi.readQueryString();
        device = queryString && queryString["device"] ? queryString["device"] : null;
    }
    if (device) return device;

    //check the so
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
        
        if (navigator.userAgent.indexOf("iPad") >= 0) {
            //tablet ios
            return BIZAGI_DEFAULT_DEVICE = "tablet";
        }

        if (navigator.userAgent.toLowerCase().search("android") > -1 && navigator.userAgent.toLowerCase().search("mobile") == -1) {
            //tablet android
           // return BIZAGI_DEFAULT_DEVICE = "tablet";
          return BIZAGI_DEFAULT_DEVICE = "tablet_android";
        }
        //for test device android on smartphone
        if (navigator.userAgent.toLowerCase().indexOf("android") >= 0) {
           //smartphone for android
          return BIZAGI_DEFAULT_DEVICE = "smartphone_android";
        }
        //common smartphone use in the future for ios 
        return BIZAGI_DEFAULT_DEVICE = "smartphone_ios";
    }
    return "desktop";
};

/*
*   Creates a bizagi resource loader object definition
*   Note: This requires steal to be loaded first
*   Note: This requires global variable BIZAGI_PATH_TO_BASE in order to work properly
*/
bizagi.loaderPrototype = function () {
    // Variable creation
    this.xhr = null;
    this.environment = "debug";
    this.initializing = false;
    this.initialized = false;
    this.useAbsolutePath = false;
    this.build = "";
    this.loadedModules = {};
    this.definedModules = {};
    this.externalModules = [];
    this.resources = {
        js: {},
        css: {},
        tmpl: {},
        l10n: {},
        webparts: {}
    };
    this.webparts = {};
    this.moduleDefinition = null;
    this.moduleDefinitionUrl = null;
    this.moduleDefinitionOverrides = null;
    // Method definition
    // Creation method
    this.init = function (params) {
        var self = this;
        this.xhr = null;
        var theme = params.theme || (typeof (BIZAGI_THEME) !== "undefined" ? BIZAGI_THEME : "bizagiDefault");
        var queryString = bizagi.readQueryString();
        this.environment = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || this.environment);
        this.useAbsolutePath = typeof (BIZAGI_USE_ABSOLUTE_PATH) !== "undefined" ? BIZAGI_USE_ABSOLUTE_PATH : false;
        this.basePath = params.basePath ? params.basePath : location.protocol + "//" + location.host;
        var url = params.url ? params.url : bizagi.defaultModuleDefinitionPath;
        var callback = params.callback ? params.callback : (typeof (params) == "function" ? params : null);
        this.moduleDefinitionOverrides = params.overrides ? params.overrides : null;

        /*
        *   If the loader has been initialized just execute the callback
        */
        if (this.initialized) {
            // Callback function
            if (callback) callback();
            return;
        }

        if (this.initializing) {
            // Wait until the loader has been initialized and execute callback
            var doMutexLoop = function () {
                if (self.initializing) {
                    setTimeout(doMutexLoop, 50);
                } else {
                    // Callback function
                    if (callback) callback();
                }
            };
            doMutexLoop();
            return;
        }

        // Turn initializing flag on
        this.initializing = true;

        // Depending on what the browser supports, use the right way to create the XMLHttpRequest object
        if (window.XMLHttpRequest) {
            // Mozilla, Safari would use this method ...
            this.xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE would use this method ...
            this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        // Build base path
        // this.basePath = location.protocol + "//" + location.host;

        var locationParts = location.pathname.split("/");
        var rnd = Math.ceil(Math.random() * 100000);
        if (url.indexOf("?rnd") == -1) url += "?rnd=" + rnd;

        if (this.useAbsolutePath) {
            this.moduleDefinitionUrl = this.basePath + url;
            // Initialize steal root path
            steal.config({ root: this.basePath });
        } else {
            var pathToBaseBackwards = BIZAGI_PATH_TO_BASE.split("../").length;
            for (var i = 0; i < locationParts.length - pathToBaseBackwards; i++) {
                this.basePath += locationParts[i] + "/";
            }

            this.moduleDefinitionUrl = this.basePath + url;
            // Initialize steal root path
            steal.config({ root: this.basePath });
        }

        // Load module definition file
        this.send(this.moduleDefinitionUrl, function (data) {
            self.productBuild = data.build;
            self.build = data.build + "." + (data.overridesVersion || "0");

            // Mix the data with the overrides
            data = bizagi.merge(data, self.moduleDefinitionOverrides);

            // Set the prefix
            if (params.locationPrefix)
            { self.locationPrefix = params.locationPrefix; }
            else {
                self.locationPrefix = data.locationPrefix || "";
            }
            //LocationPrefix can be "" this line is unnecesary in several cases 
            //if (self.locationPrefix.length == 0) self.locationPrefix = "/";

            // Define default theme
            theme = queryString["theme"] || theme;
            var so = bizagi.detectSO();

            // Starts up dictionary
            for (var i = 0; i < data.files.css.length; i++) {
                self.resources.css[data.files.css[i].name] = data.files.css[i].location.replace("%theme%", theme).replace("%so%", so);
            }
            for (var i = 0; i < data.files.js.length; i++) {
                self.resources.js[data.files.js[i].name] = data.files.js[i].location;
            }
            for (var i = 0; i < data.files.tmpl.length; i++) {
                self.resources.tmpl[data.files.tmpl[i].name] = data.files.tmpl[i].location.replace("%device%", so); ;
            }
            for (var i = 0; i < data.files.l10n.length; i++) {
                self.resources.l10n[data.files.l10n[i].name] = data.files.l10n[i].location;
            }

            for (var i = 0; i < data.webparts.length; i++) {
                self.resources.webparts[data.webparts[i].name] = data.webparts[i].location;
            }

            for (var i = 0; i < data.modules.length; i++) {
                self.definedModules[data.modules[i].name] = data.modules[i];
            }

            self.moduleDefinition = data;

            // Turn  off flags
            self.initialized = true;
            self.initializing = false;

            // Callback function
            if (callback) callback();
        });
    };

    // Gets the location prefix
    this.getLocationPrefix = function () {
        return this.locationPrefix;
    },

    // Send method
    this.send = function (url, callback) {
        // Download the master resource file
        var xhr = this.xhr;
        xhr.open('get', url);

        // Assign a handler for the response
        this.xhr.onreadystatechange = function () {
            // Check if the response has been received from the server
            if (xhr.readyState == 4) {
                var response;
                try {
                    // Read and assign the response from the server
                    response = eval("(" + xhr.responseText + ")");

                } catch (e) {
                    alert("Module definition file read error: please check the JSON syntax");
                    throw e;
                }

                // Call function
                if (callback) callback(response);
            }
        };

        // Actually send the request to the server
        xhr.send(null);
    };
    // Return a module definition
    this.getModule = function (module) {
        return this.definedModules[module];
    };
    // Checks if a module has been loaded
    this.isModuleLoaded = function (module) {
        if (this.loadedModules == null || this.loadedModules[module] == null) return false;
        return this.loadedModules[module].ready == true ? true : false;
    };
    // Executes a callback when a module has been loaded
    this.whenModuleLoaded = function (module, callback) {
        var self = this;
        var fn = function (_module, _callback) {
            if (self.isModuleLoaded(_module) && _callback) _callback();
            else setTimeout(function () { fn(_module, _callback); }, 100);
        };
        fn(module, callback);
    };
    // Load module method
    this.loadModule = function (module, bool, desciptionModule) {
        var self = this;
        // Don't load already loaded modules
        if (this.loadedModules[module.name]) return this;

        // Load each javascript via steal
        this.log("Loading module:" + module.name);

        if (module.devices) {
            if (desciptionModule && desciptionModule.device) {
                device = desciptionModule.device
            }
            else {
                device = bizagi.detectDevice();
            }
            for (var i = 0; i < module.devices.length; i++) {
                if (module.devices[i].name == device) {
                    if (this.environment == "release") {
                        this.loadReleaseModule(module.devices[i]);

                    } else {
                        this.loadDebugModule(module.devices[i], desciptionModule);
                    }
                }
            }
        } else {
            if (this.environment == "release") {
                this.loadReleaseModule(module);

            } else {
                this.loadDebugModule(module);
            }
        }

        // Add module to loaded hashtable
        this.loadedModules[module.name] = module;

        //TODO: REPLACE FILES??
        self.log("remplazar archivos si vienen en la descripcion");

        this.then(function () {
            self.loadedModules[module.name].ready = true;
        });

        // Load less at last when using debug mode
        if (this.environment == "debug" && bizagi.detectDevice() == "desktop") {
            this.then(function () {
                self.loadFile({
                    src: self.getResource("js", "common.base.lib.less"),
                    type: "js"
                });
            });
        }

        return this;
    };
    // Load the release version of a module
    this.loadReleaseModule = function (module) {

        // Load minified files
        this.loadFile({
            src: this.resolveReleaseFile(module.target.css),
            type: "css",
            environment: "release"
        });
        this.loadFile({
            src: this.resolveReleaseFile(module.target.js),
            type: "js",
            environment: "release"
        });
        this.loadWebparts(module.components.webparts);
    };
    // Load the debug version of a module
    this.loadDebugModule = function (module, desciptionModule) {
        //overrides components
        if (desciptionModule && desciptionModule.components) {
             module = this.replaceDefinition(module, desciptionModule);
        }
        // Load default components
        this.loadSubModules(module.components.modules);
        this.loadStyleSheets(module.components.css);
        this.loadJavaScripts(module.components.js);
        this.loadWebparts(module.components.webparts);
    };

    this.replaceDefinition = function (module, desciptionModule) {
        if (desciptionModule.components.css) {
            if (desciptionModule.components.css.add) {
                module.components.css = this._addTodefinition(module.components.css, desciptionModule.components.css.add)
            }
            if (desciptionModule.components.css.remove) {
                module.components.css = this._removeDefinition(module.components.css, desciptionModule.components.css.remove)
            }
            if (desciptionModule.components.css.replace) {
                module.components.css = this._replaceDefinition(module.components.css, desciptionModule.components.css.replace)
            }
        }
        if (desciptionModule.components.js) {
            if (desciptionModule.components.js.add) {
                module.components.js = this._addTodefinition(module.components.js, desciptionModule.components.js.add)
            }
            if (desciptionModule.components.js.remove) {
                module.components.js = this._removeDefinition(module.components.js, desciptionModule.components.js.remove)
            }
            if (desciptionModule.components.js.replace) {
                module.components.js = this._replaceDefinition(module.components.js, desciptionModule.components.js.replace)
            }
        }
        if (desciptionModule.components.tmpl) {
            if (desciptionModule.components.tmpl.add) {
                module.components.tmpl = this._addTodefinition(module.components.tmpl, desciptionModule.components.tmpl.add)
            }
            if (desciptionModule.components.tmpl.remove) {
                module.components.tmpl = this._removeDefinition(module.components.tmpl, desciptionModule.components.tmpl.remove)
            }
            if (desciptionModule.components.tmpl.replace) {
                module.components.tmpl = this._replaceDefinition(module.components.tmpl, desciptionModule.components.tmpl.replace)
            }
         }

      return module;

    };

    this._addTodefinition = function (baseElement, newElements) {
        for (position in newElements) {
            baseElement.push(newElements[position]);
        }
        return baseElement;
    };

    this._removeDefinition = function (baseElement, newElements) {
        for (position in newElements) {
            var index = baseElement.indexOf(newElements[position]);
            if (index != -1) {
                baseElement = baseElement.splice(index);
            }
        }
        return baseElement;
    };

    this._replaceDefinition = function (baseElement, newElements) {
        for (position in newElements) {
            var element = newElements[position];
            var index = baseElement.indexOf(element.from);
            if (index != -1) {
                baseElement[index] = element.to;
            }
        }
        return baseElement;
    };

    // Resolve release final file
    this.resolveReleaseFile = function (src) {
        return bizagi.replaceAll(src, "%build%", this.productBuild);
    };
    // Load submodules
    this.loadSubModules = function (modules) {

        if (modules != undefined) {
            var moduleslength = modules.length;
            for (var i = 0; i < moduleslength; i++) {
                var subModule = modules[i];
                this.internalLoadModule(subModule);
            }
        }
    };
    // Load stylesheets
    this.loadStyleSheets = function (cssFiles) {

        for (var i = 0; i < cssFiles.length; i++) {
            var css = this.resources.css[cssFiles[i]];
            if (typeof (css) === "undefined") alert(cssFiles[i] + " not found in stylesheets files declaration");
            this.loadFile({
                type: "css",
                src: css
            });
        }
    };
    // Load javascripts
    this.loadJavaScripts = function (jsFiles) {

        for (var i = 0; i < jsFiles.length; i++) {
            var js = this.resources.js[jsFiles[i]];
            if (typeof (js) === "undefined") alert(jsFiles[i] + " not found in javascript files declaration");
            this.loadFile({
                type: "js",
                src: js
            });
        }
    };
    // Load a single webpart
    this.loadWebpart = function (webpartLocation) {
        var self = this;
        var prefix = this.useAbsolutePath ? this.basePath + this.getLocationPrefix() : "" + this.getLocationPrefix();
        var url = prefix + webpartLocation + bizagi.defaultWebPartDefinitionName + "?build=" + self.build;
        steal.then({
            src: url,
            id: url,
            type: "text",
            waits: true,
            onError: function (options) {
                alert("Could not load file " + options.src);
            }
        }).then(function () {
            var data = steal.resources[url].options.text;

            // Cache the webpart definition
            data = eval("(" + data + ")");
            data.location = webpartLocation;
            data["class"] = data.className || "bizagi.workportal.webparts." + data.name;

            // Add to definition    
            self.webparts[data.name] = data;
        });

        return this;
    };
    // Return a cached webpart
    this.getWebpart = function (webpartName) {
        return this.webparts[webpartName];
    };
    this.initWebpart = function (webpart, callback) {
        var self = this;
        if (webpart != null) {
            if (!webpart.initialized) {

                // Load javascripts and stylesheets
                steal.then(function () {
                    var targetWebpart, alias;

                    for (var i = 0; i < webpart.js.length; i++) {
                        self.loadFile({
                            type: "js",
                            src: webpart.location + webpart.js[i].src
                        });
                    }


                    for (var i = 0; i < webpart.css.length; i++) {
                        if (webpart.css[i].src) {
                            // Direct source
                            self.loadFile({
                                type: "css",
                                src: webpart.location + webpart.css[i].src,
                                wait: true
                            });
                        } else if (webpart.css[i].reuse) {
                            // Reference to another webpart
                            targetWebpart = self.webparts[webpart.css[i].reuse.webpart];
                            self.loadFile({
                                type: "css",
                                src: targetWebpart.location + webpart.css[i].reuse.src,
                                wait: true
                            });
                        }
                    }

                    for (var i = 0; i < webpart.tmpl.length; i++) {
                        if (webpart.tmpl[i].src) {
                            // Direct source
                            alias = "webpart." + webpart.name + "." + webpart.tmpl[i].alias;
                            self.resources.tmpl[alias] = webpart.location + webpart.tmpl[i].src;
                            webpart.tmpl[i].originalAlias = webpart.tmpl[i].alias;
                            webpart.tmpl[i].alias = alias;

                        } else if (webpart.tmpl[i].reuse) {
                            // Reference to another webpart
                            targetWebpart = self.webparts[webpart.tmpl[i].reuse.webpart];

                            // Find referenced webpart template src
                            alias = "webpart." + webpart.name + "." + webpart.tmpl[i].alias;

                            for (var j = 0; j < targetWebpart.tmpl.length; j++) {
                                if (targetWebpart.tmpl[j].alias == webpart.tmpl[i].reuse.alias) {
                                    self.resources.tmpl[alias] = targetWebpart.location + targetWebpart.tmpl[j].src;
                                }
                            }

                            webpart.tmpl[i].originalAlias = webpart.tmpl[i].alias;
                            webpart.tmpl[i].alias = alias;
                        }
                    }

                    steal.then(function () {
                        // Invokes callback
                        webpart.initialized = true;
                        if (callback) callback();
                    });
                });

            } else {
                steal.then(function () {
                    // Invokes callback
                    if (callback) callback();
                });
            }
        }

        return this;
    },
    // Load webparts
    this.loadWebparts = function (moduleWebparts) {

        if (moduleWebparts != undefined) {
            for (var i = 0; i < moduleWebparts.length; i++) {
                var webpart = moduleWebparts[i];
                if (webpart == "*") {

                    for (var j = 0; j < this.resources.webparts.length; j++) {
                        this.loadWebpart(this.resources.webparts[j]);
                    }
                } else {
                    if (typeof (this.resources.webparts[webpart]) === "undefined") alert(webpart + " not found in javascript files declaration");
                    this.loadWebpart(this.resources.webparts[webpart]);
                }
            }
        }
    };
    // Load custom files
    this.loadFile = function (params) {
        var build = "?build=" + this.build;
        if (arguments.length > 1) {

            for (var i = 0; i < arguments.length; i++) {
                this.loadFile(arguments[i]);
            }
            return this;
        }

        if (typeof (params) == "object" && params.length > 1) {

            for (var i = 0; i < params.length; i++) {
                this.loadFile(params[i]);
            }
            return this;
        }
        //Internet Explorer bug in case that is object, 1 element
        if (params[0] && typeof (params) == "object") {
            this.loadFile(params[0]);
            return this;
        }

        // Skip some files when in release mode
        var environment = typeof (params.environment) !== "undefined" ? params.environment : "release";
        if (environment != "release" && this.environment == "release") return this;

        var file = params && params.src ? params.src : params;
        var type = params && params.type ? params.type : "js";
        var prefix = this.useAbsolutePath ? this.basePath + this.getLocationPrefix() : "" + this.getLocationPrefix();

        // Remove build variable content if the url already has a build in the querystring
        if (file.indexOf(build) > 0) build = "";

        // Load each javascript via steal
        var wait;
        if (type == "css") {
            wait = typeof (params.wait) !== "undefined" ? params.wait : false;
            this.log("Loading css:" + file + " route to load:" + prefix + file + build);
            steal({
                id: prefix + file + build,
                src: prefix + file + build,
                type: "css",
                waits: wait
            });
        } else if (type == "js") {
            wait = typeof (params.wait) !== "undefined" ? params.wait : true;
            this.log("Loading js:" + file + " route to load:" + prefix + file + build);
            steal.then({
                id: prefix + file + build,
                src: prefix + file + build,
                type: "js",
                waits: wait,
                onError: function (options) {
                    alert("Could not load file " + options.src);
                    if (params.onError) params.onError();
                }
            });
        }

        return this;
    };
    // Start method
    this.start = function (module) {
        // Add to external modules loaded
        this.externalModules.push(module);

        // Load module
        this.internalLoadModule(module);

        return this;
    };

    this._setModuleName = function (module) {
        //assign var moduleanddevice this contains the specific for name and device
        if (typeof module === "string" && (moduleanddevice = module.split(".")) && moduleanddevice.length >= 2) {
            return { "name": moduleanddevice[0], "device": moduleanddevice[1] };
        }
        return { "name": module };
    };

    this.determineModule = function (module) {
        //determine when a module is and aobject and contains overrides
        if (typeof module === "object") {
            moduletmp = this._setModuleName(module.name);
            moduletmp["components"] = module.components
            module = moduletmp;
        }
        else {
            module = this._setModuleName(module);
        }

        return module;
    };


    this.internalLoadModule = function (module) {
        var self = this,
        moduleDescription = this.determineModule(module);

        self.log("internalLoadModule: " + module);
        self.log(moduleDescription);

        for (var i = 0; i < self.moduleDefinition.modules.length; i++) {
            if (moduleDescription.name == self.moduleDefinition.modules[i].name) {
                self.loadModule(self.moduleDefinition.modules[i], true, moduleDescription);
            }
        }

    };
    // Method to retrieve resources from the dictionary
    this.getResource = function (type, alias) {
        var resource = this.resources[type][alias];
        return resource + "?build=" + this.build;
    };
    // Method to iterative call itself when needed
    this.then = function (args) {
        steal.then(args);
        return this;
    };
    // Quick logging method
    this.log = function (message) {
        if (typeof (console) !== "undefined") console.log(message);
    };
    // Method to retrieve the module that contains a template
    this.getProductionTemplate = function (src) {

        for (var i = 0; i < this.externalModules.length; i++) {
            var externalModule = this.externalModules[i];
            var module = this.getModule(externalModule);
            var bFoundInModule = this.searchTemplateInModule(module, src);
            if (bFoundInModule) {
                if (module.devices) {
                    // Search in a multi-device module
                    var device = bizagi.detectDevice();

                    for (var j = 0; j < module.devices.length; j++) {
                        if (module.devices[j].name == device) {
                            return this.resolveReleaseFile(module.devices[j].target.tmpl);
                        }
                    }

                } else {
                    return this.resolveReleaseFile(module.target.tmpl);
                }
            }
        }
        alert(src + " not defined in any of these modules: " + this.externalModules.toString());
        return null;
    };
    // Method to search a template in a module
    this.searchTemplateInModule = function (module, tmpl) {
        var bFoundInSubModule;
        if (module.devices) {
            // Search in a multi-device module
            var device = bizagi.detectDevice();

            for (var j = 0; j < module.devices.length; j++) {
                if (module.devices[j].name == device) {

                    for (var k = 0; k < module.devices[j].components.tmpl.length; k++) {
                        if (module.devices[j].components.tmpl[k] == tmpl) {
                            return true;
                        }
                    }
                    if (module.devices[j].components.modules) {
                        for (var k = 0; k < module.devices[j].components.modules.length; k++) {
                            var subModule = this.getModule(module.devices[j].components.modules[k]);
                            bFoundInSubModule = this.searchTemplateInModule(subModule, tmpl);
                            if (bFoundInSubModule) return true;
                        }
                    }
                }
            }

        } else {

            for (var i = 0; i < module.components.tmpl.length; i++) {
                if (module.components.tmpl[i] == src) {
                    return true;
                }
            }

            for (var i = 0; i < module.components.modules.length; i++) {
                bFoundInSubModule = this.searchTemplateInModule(module.components.modules[i], tmpl);
                if (bFoundInSubModule) return true;
            }
        }
        return false;
    };
};

// Create global instance
bizagi.loader = typeof (bizagi.loader) !== "undefined" ? bizagi.loader : (new bizagi.loaderPrototype());

// Mini-wrappers for old-fashion methods
bizagi.getTemplate = function (src, onDemand) {

    
    onDemand = onDemand || false;
    if (bizagi.loader.environment == "release" && onDemand == false) {
        // Release mode
        var productionSrc = bizagi.loader.getProductionTemplate(src);
        var prefix = bizagi.loader.useAbsolutePath ? bizagi.loader.basePath + bizagi.loader.getLocationPrefix() : "" + bizagi.loader.getLocationPrefix();
        return prefix + productionSrc + "#" + bizagi.replaceAll(src, ".", "_");

    } else {
        // Debug mode
        if (src.length == 0) alert("No source defined for bizagi.getTemplate call");
       
        var template = bizagi.loader.getResource("tmpl", src);
        if (template == null) alert("No entry found for " + src + " in bizagi.getTemplate call");
        prefix = bizagi.loader.useAbsolutePath ? bizagi.loader.basePath + bizagi.loader.getLocationPrefix() : "" + bizagi.loader.getLocationPrefix();
        return prefix+template;
    }
};
bizagi.getJavaScript = function (src) {
    if (src.length == 0) alert("No source defined for bizagi.getJavaScript call");
   
    var javascript = bizagi.loader.getResource("js", src);
    if (javascript == null) alert("No entry found for " + src + " in bizagi.getJavaScript call");
    return javascript;
};
bizagi.getStyleSheet = function (src) {
    if (src.length == 0) alert("No source defined for bizagi.getStyleSheet call");
    var styleSheet = bizagi.loader.getResource("css", src);
    if (styleSheet == null) alert("No entry found for " + src + " in bizagi.getStyleSheet call");
    return styleSheet;
};
bizagi.getWebpart = function (src) {
    if (src.length == 0) alert("No src defined for bizagi.getWebpart call");
    var webpart = bizagi.loader.getWebpart(src);
    if (webpart == null) alert("No entry found for " + src + " in bizagi.getWebpart call");
    return webpart;
};
