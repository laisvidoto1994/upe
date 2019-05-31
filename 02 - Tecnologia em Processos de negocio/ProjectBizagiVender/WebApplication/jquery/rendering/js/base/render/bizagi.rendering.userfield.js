/*
*   Name: BizAgi User field render
*   Author: Diego Parra
*   Comments:
*   -   This script will define the basic behaviour for userfields
*/
bizagi.rendering.render.extend("bizagi.rendering.userfieldDefinition", {}, {

    /*************************************************************/
    /* Private section of the userfield                          */
    /*************************************************************/

    /*
    *   Method to be overriden by userfields in order to ensure that custom files are loaded before the execution
    */
    getFileDependencies: function () {
        return null;
    },

    postRender: function () {
        var self = this;

        // Call base
        self._super();

        var defer = $.Deferred();
        var fileDependencies = self.getFileDependencies();
        if (fileDependencies && fileDependencies.length > 0) {
            bizagi.loader.loadFile(fileDependencies)
			.then(function () {
			    // After all dependencies has been resolved
			    self.internalRenderControl();
			    defer.resolve();
			});

        } else {
            $.when( self.renderUserfieldControl()).done(function () {
                defer.resolve();
            });
        }

        return defer.promise();
    },

    renderUserfieldControl: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var def = new $.Deferred();

        if (properties.extendedData && properties.extendedData.length > 0) {
            self.extendedData = bizagi.services.ajax.parseJSON(properties.extendedData);
        } else {
            self.extendedData = {};
        }


        var loadUserfield = function () {
            var userEditableControl = self.getEditableControl();
            if (userEditableControl) {
                self.input = userEditableControl.appendTo(control);
            }
            self.renderComplex();
            def.resolve();
        };

        
            loadUserfield();
    
        
        return def.promise();
    },

    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;

        if (properties.extendedData && properties.extendedData.length > 0) {
            self.extendedData = bizagi.services.ajax.parseJSON(properties.extendedData);
        } else {
            self.extendedData = {};
        }

        var loadUserfieldReadOnly = function () {
            var userReadOnlyControl = self.getReadonlyControl();
            if (userReadOnlyControl) {
                self.input = userReadOnlyControl.appendTo(control);
            }
            self.renderComplex();
        };

        if (self.ready) {
            self.ready().done(function () {
                loadUserfieldReadOnly();
            });
        } else {
            loadUserfieldReadOnly();
        }
    },

    getDisplayValue: function () {
        var self = this;
        return self.getReadonlyValue();
    },

    /*
    *   Sets the value in the rendered control 
    */
    setDisplayValue: function (value) {
        var self = this;

        // Call base
        self.setValue(value);

        // Set editable value in control
        self.setEditableValue(value);
    },

    getValue: function () {
        var self = this;
        return self.getEditableValue();
    },

    getPropertyValue: function (propertyName, params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        self.dataService.multiaction().getPropertyData({
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            property: propertyName,
            extra: params,
            dataType: params ? params.dataType : null
        }).done(function (data) {
            if (data.type == "error") {
                // Workflow engine error, we gotta show it with error
                self.getFormContainer().addErrorMessage(data.message);
                defer.reject(data);
            } else {
                defer.resolve(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            defer.reject(jqXHR, textStatus, errorThrown);
        });

        return defer.promise();
    },

    /*
    *   Saves the form
    */
    saveForm: function () {
        var self = this;
        var form = self.getFormContainer();
        return form.saveForm();
    },

    /**
    * Returns all the elements that match the given xpath
    */
    getRenderElements: function (xpath) {
        var self = this;
        var result = $();
        var controls = self.getFormContainer().getRenders(xpath);
        $.each(controls, function (i, item) {
            result = result.add($(item.element));
        });

        return result;
    },

    getServerResourceURL: function (resource) {
        var self = this;
        var url = "Rest/Userfields/{0}/resource/{1}/{2}";
        url = url.replace("{0}", self.properties.userfieldGuid);
        resource = resource.replace("\\", "__").replace("/", "__");
        var device = bizagi.util.detectDevice();
        url = url.replace("{1}", device);
        url = url.replace("{2}", resource);
        //Rest/Userfields/{0}/resource/desktop/{1}
        return url;
    },

    /**
    * Returns all the elements that match the given xpath
    */
    getRenderValue: function (xpath) {
        var self = this;
        var controls = self.getFormContainer().getRenders(xpath);
        var control;
        $.each(controls, function (index, item) {
            if (!control || item.properties.editable) {
                control = item;
            }
        });
        if (control) {
            return control.getValue();
        } else {
            return null;
        }
    },

    /*
    *   Refresh the current form
    */
    refreshForm: function () {
        var self = this;
        var properties = self.properties;

        var form = self.getFormContainer();
        form.refreshForm(properties.id);
    },

    /*
    * Shows a jquery dialog
    */
    showDialog: function (url, params) {
        bizagi.util.mustImplement("Must implement the showDialog method");
    },

    /*
    *   Shows a browser popup
    */
    showPopup: function (url, params) {
        bizagi.util.mustImplement("Must implement the showPopup method");
    }


});

bizagi.rendering.userfieldDefinition.extend("bizagi.rendering.basicUserField", {}, {

    /*************************************************************/
    /* methods to be overriden by the implementations            */
    /*************************************************************/
    getEditableControl: function () {
    },

    renderComplex: function () {
    },

    // Returns the value of the control
    getEditableValue: function () {
        return bizagi.rendering.render.prototype.getValue.apply(this, arguments);
    },

    // 
    setEditableValue: function (value) {
        return bizagi.rendering.render.prototype.setValue.apply(this, arguments);
    },

    getReadonlyControl: function () {
    },

    getReadonlyValue: function () {
        // if the method is not overriden then call the parent method 
        return bizagi.rendering.render.prototype.getDisplayValue.apply(this, arguments);
    },

    dispose: function () {
        var self = this;

        // Call base
        self._super();
    }

});


/*
*   This control will wrap any userfield in order to load the code remotely, 
*   when executing renderControl, which is an async method
*/
bizagi.rendering.render.extend("bizagi.rendering.userfieldWrapper", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // Call base
        self._super(params);
        // Save userfield guid and name
        self.initialParams = params;
        self.userfieldGuid = this.properties.userfieldGuid;
        self.userfieldName = this.properties.control;
    },

    /*
    *   Returns the in-memory processed element
    */
    internalPostRender: function () {
        var self = this;
        $.when(self.getUserfieldControl())
        .done(function (control) {
            control.element = self.element;

            // Add grid and surrogatekey properties if the userfield is a column userfield
            if (self.column) {
                control.isColumn = true;
                control.grid = self.grid;
                control.surrogateKey = self.surrogateKey;
                control.properties.xpathContext = self.getControlXpathContext(control);
                control.getControl = self.column.getControl;
            }

            return control.internalPostRender();
        });
    },

    /*
    *   Helper for userfields to fetch the xpathContext
    */
    getControlXpathContext: function (control) {
        var self = this;
        var properties = control.properties;

        if (control.isColumn) {
            return properties.xpathContext.length > 0 ? properties.xpathContext + "." + control.grid.properties.xpath + "[id=" + control.surrogateKey + "]" : control.grid.properties.xpath + "[id=" + control.surrogateKey + "]";
        }

        return properties.xpathContext;
    },

    /*
    *   Load userfield
    */
    getUserfieldControl: function () {
        var self = this;
        var sControl = self.userfieldName;
        var exists = eval("bizagi.rendering." + sControl + " !== undefined");
        var def = new $.Deferred();
        if (exists) {
            // Creates the userfield instance
            // Set true argument for tabItem
            $.when(self.parent.ready()).done(function () {
                def.resolve(self.createUserfieldInstance(sControl));
            });

        } else {
            var device = bizagi.util.detectDevice();
            if (device.indexOf("smartphone") >= 0) {
                device = "smartphone";
            } else if (device.indexOf("tablet") >= 0) {
                device = "tablet";
            }
            // Call ajax service in order to retrieve user field definitions
            $.when(self.dataService.getUserfieldDefinition({ userfield: self.userfieldGuid, device: device })).pipe(function (data) {
                       // Load userfield in memory
                       self.loadUserfield(data);

                       // Creates the userfield instance
                       def.resolve(self.createUserfieldInstance(sControl));
                   });
        }
              

        return def.promise();
    },

    /*
    *   Creates the userfield instance when the userfield prototype is loaded in memory
    */
    createUserfieldInstance: function (sControl) {
        var self = this;
        var control;
        try {
            // Create a dynamic function to avoid problem with eval calls when minifying the code
            var dynamicFunction = "var baDynamicFn = function(renderParams){ \r\n";
            dynamicFunction += "return new bizagi.rendering." + sControl + "(renderParams);\r\n";
            dynamicFunction += "}\r\n";
            dynamicFunction += "baDynamicFn";
            dynamicFunction = eval(dynamicFunction);

            // Call the dynamic function
            control = dynamicFunction(self.initialParams);
        } catch (e) {
            // If the call fails, return the default user field
            control = new bizagi.rendering.defaultUserField(self.initialParams);
        }
        control.properties.isUserField = true;

        // Save userfield instance
        self.userfieldInstance = control;

        // Create proxy methods from the wrapper to the userfield instance
        self.replicateUserfieldMethods(control);

        // Replicate renderchange event from wrapped element to grid if applies
        self.userfieldInstance.bind("renderchange", function () {
            self.triggerHandler("renderchange", arguments);
        });

        return control;
    },

    /*
    *   Replicate all userfield methods to this instance in order to create a proxy
    */
    replicateUserfieldMethods: function (control) {
        var self = this;
        for (var key in control.Class.prototype) {
            // Omit the folowing methods
            if (key == "init" || key == "constructor" || key == "Class" || key == "subscribe" || key == "unsubscribe" ||
                key == "publish" || key == "render" || key == "triggerHandler" || key == "dispose") continue;

            // Replicate instance methods
            self[key] = eval('var tmp = function(){ if (this.userfieldInstance) return this.userfieldInstance.' + key + '.apply(this.userfieldInstance, arguments); return null;};tmp');
        }

        // Replicate properties and value
        control.properties = self.properties;
        control.value = self.value;
    },

    /*
    *   Load userfield into memory
    */
    loadUserfield: function (data) {
        var self = this;
        self.properties.styleGuid = self.properties.styleGuid || Math.guid();

        try {
            // Parse data
            try { data = eval(data); } catch (e) { bizagi.log("Could not parse result userfield " + self.userfieldName, e.message); }

            // Iterate elements
            $.each(data, function (index, val) {
                if (val.type == "js") {
                    try { eval(val.content); } catch (ex) { bizagi.log("Could not parse result userfield3 " + self.userfieldName, ex.message); };
                }
                if (val.type == "css") {
                    bizagi.util.loadStyle(val.content, self.properties.styleGuid);
                }
            });

            // Replicate userfield methods to the wrapper
            var control = eval("bizagi.rendering." + self.userfieldName);

        } catch (e) { bizagi.log("Could not parse result userfield " + self.userfieldName, e.message); };
    },

    dispose: function () {
        var self = this;

        setTimeout(function () {
            if (self.userfieldInstance) {
                self.userfieldInstance.unbind("renderchange");
                self.userfieldInstance.dispose();
            }
        }, bizagi.override.disposeTime || 50);

        // Call base
        self._super();
    }
});