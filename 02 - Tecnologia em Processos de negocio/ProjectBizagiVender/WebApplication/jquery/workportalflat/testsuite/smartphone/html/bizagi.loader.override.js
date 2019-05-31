initBizagi = function () {    
    var intervalTime = 500;

    var intervalAction = setInterval(function() {
        var loader = bizagi.loader;
        if (loader) {
            clearInterval(intervalAction);
            startHomeportal(loader);
        }
    }, intervalTime);
};

startHomeportal = function (loader) {
    loader.getProductionTemplate = getProductionTemplate;
    loader.searchTemplateInModule = searchTemplateInModule;
};

getProductionTemplate = function(src) {
    for (var i = 0; i < this.externalModules.length; i++) {
        var externalModule = this.externalModules[i];
        var module = this.getModule(externalModule);
        var bFoundInModule = this.searchTemplateInModule(module, src);
        if (bFoundInModule) {
            if (module.devices) {
                // Search in a multi-device module
                var device = module.name === "renderingflat" ? "smartphone_android" : BIZAGI_DEFAULT_DEVICE; // "smartphone_ios_native";
                for (var j = 0; j < module.devices.length; j++) {
                    if (module.devices[j].name === device) {
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

searchTemplateInModule = function(module, tmpl) {
    var bFoundInSubModule;
    if (module.devices) {
        // Search in a multi-device module
        var device = module.name === "renderingflat" ? "smartphone_android"
            : BIZAGI_DEFAULT_DEVICE; // "smartphone_ios_native";
        for (var j = 0; j < module.devices.length; j++) {
            if (module.devices[j].name === device) {

                for (var k = 0; k < module.devices[j].components.tmpl.length; k++) {
                    if (module.devices[j].components.tmpl[k] === tmpl) {
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
            if (module.components.tmpl[i] === src) {
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

initBizagi();