/*
 *   Name: BizAgi Services
 *   Author: Diego Parra
 *   Comments:
 *   -   This class will provide a facade to access to all REST services available in Bizagi
 *   -   Can be extendable by each sub-module ex. rendering
 */

$.Class.extend("bizagi.services.service", {}, {
    /* 
     *   Constructor
     */
    init: function () {

    },
    getServerResourceDictionary: function () {
        var proxyPrefix = "";
        if(typeof bizagiConfig !== "undefined" && bizagiConfig.proxyPrefix){
            proxyPrefix = bizagiConfig.proxyPrefix;
        }else{
            if(typeof BIZAGI_PROXY_PREFIX !== 'undefined'){
                proxyPrefix = BIZAGI_PROXY_PREFIX;
            }
        }
        //var proxyPrefix = (typeof bizagiConfig !== "undefined" && bizagiConfig.proxyPrefix) ? bizagiConfig.proxyPrefix: ((typeof (BIZAGI_PROXY_PREFIX) !== 'undefined' ? BIZAGI_PROXY_PREFIX : "");
        //var lowCaseLanguage = BIZAGI_LANGUAGE.substring(0, 2);
        var culture = typeof BIZAGI_LANGUAGE === "undefined" ? bizagi.language : BIZAGI_LANGUAGE;
        return $.ajax({
            url: proxyPrefix + "Rest/Multilanguage/Client?cultureName=" + culture + "&version=" + bizagi.loader.version,
            rpcEnabled: false,
            cache:true,
            dataType: "json",
            async: true
        });
    },
    getResourceDictionary: function (url) {
        return $.ajax({
            url: url,
            rpcEnabled: false,
            dataType: "json",
            async: true
        });
    }
});

 
