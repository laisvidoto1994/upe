/*
*   Name: BizAgi FormModeler Editor Communication Protocol Load Form
*   Author: Alexander Mejia
*   Comments:
*   -   This protocol loads the nested form information externally
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.loadform", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        self._super(params);
        self.actiontype = "LoadForm";
        self.params = params;
    },

    /*
    *   Builds the request
    */
    buildRequest: function () {
        var self = this;
        var params = self.params;
        var parameterItem = self.createParameterItem("id", bizagi.editor.utilities.resolveComplexReference(params.form));        

        self.parameters = [];
        self.parameters.push(parameterItem);
        if (params.loadByParent) self.parameters.push(self.createParameterItem("loadByParent", params.loadByParent));
        if (params.adhocProcessId && params.isAdhocSummaryForm) {            
            self.parameters.push(self.createParameterItem("adhocProcessId", params.adhocProcessId));
            self.parameters.push(self.createParameterItem("isAdhocSummaryForm", params.isAdhocSummaryForm));
        }
    },
    /*
    callRestService: function (basRequest) {
        var self = this;

        return !self._editorInfo.isCloud() && self._ResourcesServices.getMultiResources(basRequest);

    },*/

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("form");
            return JSON.parse(itemParameter.value);
        }

        return false;
    }
})