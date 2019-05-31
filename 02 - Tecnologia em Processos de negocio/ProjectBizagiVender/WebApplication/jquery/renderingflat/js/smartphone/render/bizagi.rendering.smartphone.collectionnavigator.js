/*
*   Name: BizAgi Smartphone Collection Navigator Extension
*   Author: Bizagi Bizagi Team
*   Comments:
*   -   This script will redefine the collection Navigator class to adjust to smartphone devices
*/

bizagi.rendering.collectionnavigator.extend("bizagi.rendering.collectionnavigator", {}, {
 
  renderSingle: function () {

        var self = this;        
        var container = self.getContainerRender();

        container.addClass("bz-command-not-edit");
    }

});