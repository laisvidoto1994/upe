/*
*   Name: BizAgi Form Modeler External Facade
*   Author: Diego Parra
*   Comments:
*   -   This script will define a static object in order to create or update form modeler instances
*/

// Create or Define bizagi.form.modeler namespaces
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.form = (typeof (bizagi.form) !== "undefined") ? bizagi.form : {};
bizagi.form.modeler = (typeof (bizagi.form.modeler) !== "undefined") ? bizagi.form.modeler : {};

// Define global functions that c# will access
bizagi.form.modeler.initialize = function (params) {
    params = params || {};
    BIZAGI_LANGUAGE = params.language || "default";
    BIZAGI_ENVIRONMENT = params.environment || "debug";
    BIZAGI_ENABLE_LOG = (typeof (params.enableLog) !== "undefined") ? params.enableLog : true;
    BIZAGI_ENABLE_CUSTOMIZATIONS = false;
    BIZAGI_DEFAULT_DATETIME_INFO = false;
    BIZAGI_URL_REST_SERVICES = params.urlRestServices || 'http://localhost:3333/';
    BIZAGI_USER = params.user || '';
    BIZAGI_IDENTIFIER_MODEL = params.idModel || '';
          
    // Initialize scripts
    var loader = bizagi.loader;
    loader.init(function () {
        loader.start("formModeler");
    });
};

/*
*   Creates a new modeler instance
*/
bizagi.form.modeler.instance = null;
bizagi.form.modeler.createForm = function (params) {
    var defer = typeof($) !== "undefined" ? new $.Deferred() : null;
    bizagi.loader.whenModuleLoaded("formModeler", function () {
        bizagi.form.modeler.params = params;
        switch (params.context) {
            case 'template': bizagi.form.modeler.instance = new bizagi.editor.templateView(params); break;
            case 'adhocform': bizagi.form.modeler.instance = new bizagi.editor.adhocModelerView(params); break;
            default: bizagi.form.modeler.instance = new bizagi.editor.modelerView(params);
        }
        
        if (defer) defer.resolve(bizagi.form.modeler.instance);
    });

    return defer ? defer.promise(): null;
};

/*
*   Saves a modeler instance
*/
bizagi.form.modeler.saveForm = function (data) {

    if (data && data.encode) {
        return bizagi.util.unicode2htmlencode(JSON.encode(bizagi.form.modeler.instance.save()));
    } else {
        return JSON.encode(bizagi.form.modeler.instance.save());
    }
};

/*
*   Updates Jquery model, with data send from C#
*/
bizagi.form.modeler.updateForm = function (data) {
    bizagi.form.modeler.instance.updateForm(data);
};

/*
*   Validates form
*/
bizagi.form.modeler.validateAndSaveForm = function () {
    return JSON.encode(bizagi.form.modeler.instance.validateAndSaveForm());
};

