/*
*   Name: BizAgi Workportal Tablet Workarea Controller
*   Author: Diego Parra 
*   Comments:
*   -   This script will override workarea controller class to apply custom stuff just for tablet device
*/

// Auto extend
bizagi.workportal.controllers.main.extend("bizagi.workportal.controllers.main", {}, {

    performResizeLayout: function () {
        var self = this;
        self._super();
        //column-footbar
        var context = self.getContent();
        if (bizagi.detectDevice() == "tablet_android" ) {
            //TODO: bug in android , the html in tablets is'nt well optimized
            // Delegate click on render column toggler
            $('.render-form .column-footbar', context).hide();
            setTimeout(function () {
                $('.render-form .column-footbar', context).show();
            }, 150);
        }
    }

});
