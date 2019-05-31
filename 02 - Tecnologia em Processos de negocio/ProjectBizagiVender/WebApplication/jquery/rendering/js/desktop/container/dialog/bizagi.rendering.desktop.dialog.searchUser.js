/**
 * Description of file
 *
 * @author: Jeison Borja
 */

bizagi.rendering.dialog.search.extend("bizagi.rendering.dialog.searchUser", {}, {
    /*
     * Constructor
     */
    init: function (dataService, renderFactory, searchForms, searchParams, otherOptions) {
        // Call base
        this._super(dataService, renderFactory, searchForms, searchParams, otherOptions);
    },
    getSearchFormData:function(params){
        return {"form":{"properties":{"id":"3ad923cf-f21e-439e-90b5-f2df8ffe4559","type":"searchForm","displayName":"SearchWFuser","xpathContext":"","columns":[{"caption":"idUser","dataType":7,"xpath":"idUser"},{"caption":"userName","dataType":15,"xpath":"userName"},{"caption":"domain","dataType":15,"xpath":"domain"},{"caption":"fullName","dataType":15,"xpath":"fullName"},{"caption":"enabledForAssignation","dataType":5,"xpath":"enabledForAssignation"},{"caption":"enabled","dataType":5,"xpath":"enabled"}]},"elements":[{"render":{"properties":{"id":"e0babe1d-7924-4d2a-8fb3-b915b746dbe6","type":"searchText","xpath":"domain","displayName":"domain","dataType":15}}},{"render":{"properties":{"id":"87b14b2e-992d-4e40-a17b-eecbcbc2466a","type":"searchText","xpath":"userName","displayName":"userName","dataType":15}}},{"render":{"properties":{"id":"c5d137d9-a392-4d8e-9088-d5eba64b4c2a","type":"searchText","xpath":"fullName","displayName":"fullName","dataType":15}}}],"buttons":[],"sessionId":"bcy5gtv11xxao4oy4xrlk3o3","pageCacheId":1876964702},"type":"form"};
    }
});