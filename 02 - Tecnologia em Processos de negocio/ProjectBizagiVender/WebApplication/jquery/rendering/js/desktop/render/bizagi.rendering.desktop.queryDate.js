/*
 *   Name: BizAgi Desktop queryDate
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -
 */

// Extends itself
bizagi.rendering.date.extend("bizagi.rendering.queryDate", {}, {

    /*
     *   Add the render data to the given collection in order to send data to the server
     */
    collectDataQueryForm: function (renderValues) {
        var self = this;
        var properties = self.properties;
        var xpath = properties.xpath;
        var value = self.getValue();

        var queryValue = null;
        var changed = self.controlValueIsChanged();
        if (!bizagi.util.isEmpty(xpath)) {
            if (value !== null && typeof (value) !== "undefined" && value!=="") {
                queryValue=value;
            }
            if (queryValue !== null || properties.included) {
                var searchType = self.properties.typeSearch || self.properties.rangeQuery || "NONE";
                searchType = searchType.toUpperCase();
                renderValues.push({ "value": queryValue, "included": self.properties.included, "xpath": properties.xpath, "searchType": searchType, "orderType": "NONE" });
            }
        }
    }
});
