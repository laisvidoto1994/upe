/*
*   Name: BizAgi FormModeler Editor Base Host Facede
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define base communication between jQuery and C#
*/

bizagi.editor.base.HostFacade = (function () {
    /*
    *   PRIVATE STUFF
    */
    this.internalCache = {};

    /*
    *   Check if there is an available host
    */
    this.isHost = function () {
        if (bizagi.editor.base.info.isCloud()) {
            return false;
        }

        return (typeof (sharedObject) !== "undefined");
    };

    /*
    *   Invokes a method in the host
    */
    this.invokeHost = function (method, params) {
        var defer = new $.Deferred();

        bizagi.log("Invoking host method " + method, params);
        var result = sharedObject.call(method, JSON.encode(params));

        bizagi.log("Result from invoking host method " + method, result);

        // Attempt to parse result
        try { result = JSON.parse(result); } catch (e) { bizagi.log("Could not parse result for call " + method, e.message); };

        // Resolve deferred
        defer.resolve(result);
        return defer.promise();
    };

    return {
        /*
        *   PUBLIC STUFF
        */

        /*
        *   Returns all the controls definitions
        */
        getControlsMetadata: function () {
            var self = this;

            var defer = new $.Deferred(),
                promise;

            // Check in cache
            if (internalCache["getControlsMetadata"]) return internalCache["getControlsMetadata"];

            // Call the method in the host or use a dummy
            if (isHost()) {
                promise = invokeHost("GetControlDefinitions");
            } else {
                promise = $.ajax({
                    url: "jquery/editor/base/mocks/stub.controls.definition.json.txt",
                    dataType: "json",
                    async: true
                });
            }

            // Wait until async calls finish
            $.when(promise)
                .done(function (result) {
                    bizagi.log("Current working control definitions: ", result);

                    // Save in cache and resolve
                    internalCache["getControlsMetadata"] = result;

                    // Resolves promise
                    defer.resolve(result);
                });

            return defer.promise();
        },

        getXpathNavigatorFirstLoad: function () {
            var promise;

            if (isHost()) {
                promise = invokeHost("XpathNavigatorFirstLoad");
            } else {
                promise = $.ajax({
                    url: "jquery/editor/component/xpathNavigator/mocks/stub.xpathnavigator.firstLoad.json.txt",
                    dataType: "json",
                    async: true
                }).pipe(function (data) {
                    return data;

                });
            }


            return promise;
        },

        getUserfieldDependencies: function (userfieldName) {
            var promise;

            if (isHost()) {
                promise = invokeHost("GetUserfieldDependencies", { name: userfieldName });
            } else {
                promise = $.ajax({
                    url: "jquery/editor/component/xpathNavigator/mocks/stub.xpathnavigator.firstLoad.json.txt",
                    //                    url: "jquery/editor/component/xpathNavigator/mocks/stub.userfield.code.js.txt",
                    dataType: "json",
                    async: true
                }).pipe(function (data) {
                    return data;

                });
            }

            return promise;
        },

        GetUserfieldIconDependencies: function (userfieldName, density, size) {
            var promise;

            if (isHost()) {
                promise = invokeHost("GetUserfieldIconDependencies", { name: userfieldName, density: density, size: size });
            } else {
                promise = $.ajax({
                    url: "jquery/editor/base/mocks/stub.loadUserFieldIcon.json.txt",
                    //                    url: "jquery/editor/component/xpathNavigator/mocks/stub.userfield.code.js.txt",
                    dataType: "text",
                    async: true
                }).pipe(function (data) {
                    return data;

                });
            }

            return promise;
        },

        getXpathNavigatorExpandLoad: function (nodeExpandedData) {
            var promise;

            if (isHost()) {
                params = { contextScope: nodeExpandedData.contextScope, guid: nodeExpandedData.guidRelatedEntity, xpath: nodeExpandedData.xpath, style: nodeExpandedData.style, isScopeAttribute: nodeExpandedData.isScopeAttribute };
                promise = invokeHost("XpathNavigatorExpandLoad", params);
            } else {
                promise = $.ajax({
                    url: "jquery/editor/component/xpathNavigator/mocks/stub.xpathnavigator.forexpand.json.txt",
                    dataType: "json",
                    async: true
                }).pipe(function (data) {
                    return data;
                });
            }

            return promise;
        },

        /*
        *   Returns the layout navigator model from the host
        */
        getLayoutNavigatorModel: function () {
            var promise;

            if (isHost()) {
                promise = invokeHost("GetLayoutDefinitions");
            } else {
                promise = $.ajax({
                    url: "jquery/editor/component/layoutnavigator/mocks/stub.layoutnavigator.json.txt",
                    dataType: "json",
                    async: true
                }).pipe(function (data) {
                    return data;
                });
            }

            return promise;
        },

        executeBasActions: function (basRequest) {
            var self = this,
                defer = new $.Deferred(),
                promise;

            if (isHost()) {
                promise = invokeHost("ExecuteBasActions", basRequest);
            } else {
                
                var action = basRequest.actiontype.toLowerCase();
                promise = $.ajax({
                    url: "jquery/editor/base/mocks/stub." + action + ".json.txt",
                    dataType: "json",
                    async: true
                }).pipe(function (data) {
                    return data;
                });
                
            }

            return promise;
        },

//        CheckFlags: function () {
//            var self = this,
//                promise;

//            promise = $.ajax({
//                url: "jquery/editor/base/mocks/stub.checkflags.json.txt",
//                dataType: "json",
//                async: true
//            }).pipe(function (data) {
//                return data;
//            });

//            return promise;
//        },
        
        LoadForm: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadform.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        GetReleatedEntityForms: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadrelatedforms.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        LoadExpression: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadexpression.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        LoadInterface: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadinterface.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },


        LoadLocalizationForm: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.multilenguages.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },


        LoadCopyForm: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadcopyform.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        LoadFilterEditor: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadfilter.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },


        LoadDocumentTemplates: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loaddocumentemplates.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        LoadEntityValues: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadentityvalues.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        GetAvailableLanguages: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.getavailablelanguages.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        GetAttributeDisplayName: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.atributtedisplayname.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        OpenWidgetstore: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadwigdetstore.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        InstallWidget: function () {
            var self = this,
                promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.installwidget.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        GetWidgets: function () {
            var promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.loadwigdets.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        VerifyLetters: function () {
            var promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.verifyletters.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        GetParentEntities: function () {
            var promise;

            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub.getparententities.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        },

        CreateForm: function (request) {


            var parameters = request.parameters;
            var guidRender = this.findKeyInParameters(parameters, "guidRender");
            var propertyName = this.findKeyInParameters(parameters, "propertyName");
            var context = this.findKeyInParameters(parameters, "context");
            setTimeout(function () {
                bizagi.form.modeler.updateForm({ actiontype: "CreateForm", guidrender: guidRender, propertyname: propertyName, context: context, idform: Math.guid() });
            }, 100);
        },

        findKeyInParameters: function (parameters, key) {

            for (var i = 0, l = parameters.length; i < l; i += 1) {
                if (parameters[i].key === key) {
                    return parameters[i].value;
                }
            }


        },

        /*
        *   Returns the ribbon base model from the host
        */
        getRibbonBaseModel: function () {
            var promise;

            //if (isHost()) {
            //    promise = invokeHost("GetRibbonBaseModel");
            //} else {
            promise = $.ajax({
                url: "jquery/editor/component/ribbon/mocks/stub.base.ribbon.json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });
            //}

            return promise;
        },

        loadRuleExpressions: function (guidRule) {
            var jsonRule = false;

            if (isHost()) {
                jsonRule = invokeHost("LoadBooleanExpression");
            }
            if (jsonRule) {
                jsonRule = JSON.parse(jsonRule);
            }
        }
    };
})();


bizagi.editor.base.info = (function () {
    function EditorInfo() {
    }
    
    EditorInfo.prototype.isCloud = function () {
        var PATHSERVICES = BIZAGI_URL_REST_SERVICES;

        if (PATHSERVICES.indexOf('localhost') >= 0) {
            return false;
        }

        return true;
    }

    return new EditorInfo();
})();
