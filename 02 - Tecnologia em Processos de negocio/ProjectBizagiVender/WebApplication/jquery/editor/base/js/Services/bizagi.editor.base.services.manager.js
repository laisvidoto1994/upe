bizagi.editor.base.services.Manager = (function () {
    function ManagerRestServices() {        
    }

    ManagerRestServices.prototype.requestRestService = function (agumentsValues, restEndPoint) {

        function build_url(url, data) {
            var key, u, val;
            for (key in data) {
                val = data[key];
                u = url.replace('{' + key + '}', val);
                if (u != url) {
                    url = u;
                    delete data[key];
                }
            }
            return url;
        }

        if (typeof(BIZAGI_EDITOR_TEST) != "undefined") {

            var action = agumentsValues.actiontype.toLowerCase();
            promise = $.ajax({
                url: "jquery/editor/base/mocks/stub." + action + ".json.txt",
                dataType: "json",
                async: true
            }).pipe(function (data) {
                return data;
            });

            return promise;
        }

        return $.ajax({
            url: restEndPoint.getUrl(),
            data: JSON.stringify(agumentsValues),
            type: restEndPoint.getMethod(),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    return new ManagerRestServices();   
})();