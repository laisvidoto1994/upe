var EndPointBuilder = bizagi.editor.base.services.EndPointBuilder;

bizagi.editor.base.services.EndPointsHelper = (function () {
    function EndPointsHelper() {
    }

    EndPointsHelper.prototype.getResource = function () {
        return new EndPointBuilder()
            .setName('getResource')
            .setUrl(BIZAGI_URL_REST_SERVICES + 'api/forms-designer/resources')
            .setMethod(EndPointMethod[EndPointMethod.POST])
            .setArguments([])
            .create();
    }

    EndPointsHelper.prototype.getMultiResources = function () {
        return new EndPointBuilder()
            .setName('getMultiResources')
            .setUrl(BIZAGI_URL_REST_SERVICES + 'api/forms-designer/multiresources')
            .setMethod(EndPointMethod[EndPointMethod.POST])
            .setArguments([])
            .create();
    }

    return new EndPointsHelper();
})();