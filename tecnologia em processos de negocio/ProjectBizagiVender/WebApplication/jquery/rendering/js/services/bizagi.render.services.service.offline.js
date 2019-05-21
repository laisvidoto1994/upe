/*
*   Name: Bizagi Rendering Services
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This class will provide a facade to access to workportal REST services
*/

bizagi.render.services.service.extend("bizagi.render.services.service", {},
{
    /* 
    *   Constructor
    */
    init: function(params) {
        // Call base
        var self = this;

        self._super(params);
        self.database = params.database;
    },

    getFormData: function(params) {
        var self = this;

        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            return $.when(self.database.getCase(params.idCase))
                .then(function(response) {
                    var idWfClass = $.trim(response.idWfClass.toString());

                    return self.database.mergeForm(response, self.database.getFormData(idWfClass));
                });
        }
    },

    submitData: function(params) {
        var self = this;

        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {

            var data = self.resolveData(params.data || {}, params.xpathContext);
            data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = params.action;
            return self.database.saveFormInfo(params, data);
        }
    }
});
