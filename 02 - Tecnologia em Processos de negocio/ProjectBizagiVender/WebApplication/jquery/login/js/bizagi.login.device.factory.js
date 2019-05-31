/**
 *  Detect device and create instance
 *  @author Edward J Morales
 */

// Define BizAgi login namespace
bizagi.login = bizagi.login || {};
bizagi.login.widgets = bizagi.login.widgets || {};
bizagi.login.widgets.widget = bizagi.login.widgets.widget || {};

bizagi.log = function(data, type) {
    if (console != undefined) {
        console.log(type, data);
    }
};


$.Class.extend("bizagi.login.device.factory", {}, {
    /**
     * Constructor
     */
    init: function(params) {
        params = params || {};
        this.device = bizagi.util.detectDevice();
        this.oAuthParameters = params.oAuthParameters || {};
    },
    /**
     * Return facade for specific device
     */
    getLoginFacade: function(dataService) {
        var device = this.device || "";
        var facade = new Object();

        switch (device) {
            case "desktop":
                facade = new bizagi.login.desktop.facade(this, dataService);
                break;
            case "smartphone_ios":
                facade = new bizagi.login.desktop.facade(this, dataService);
                break;
            case "smartphone_android":
                facade = new bizagi.login.desktop.facade(this, dataService);
                break;
            case "tablet_android":
                facade = new bizagi.login.desktop.facade(this, dataService);
                break;
            case "tablet":             
                facade = new bizagi.login.desktop.facade(this, dataService);
                break;
            case "tablet_ios":
                facade = new bizagi.login.desktop.facade(this, dataService);
                break;
                //TODO: create factory to other devices
            default:
                window.alert("Not supported device: " + device);
                break;
        }

        return facade;
    }
});