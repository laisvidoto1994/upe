/**
 * Created by RicardoPD on 3/20/2015.
 */

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.rendermanager", {},

{
    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;
        // Call base
        this._super(workportalFacade, dataService, initialParams);
        if (!initialParams || typeof initialParams.navigator == 'undefined'){
            console.error("it is a render webpart and there is no navigator to this webpart");
        }
        self.navigator = initialParams.navigator;

    }
});
