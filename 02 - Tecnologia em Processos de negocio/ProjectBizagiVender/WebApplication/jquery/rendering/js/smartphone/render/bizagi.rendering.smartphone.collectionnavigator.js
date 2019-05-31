bizagi.rendering.collectionnavigator.extend("bizagi.rendering.collectionnavigator", {}, {
 
  renderSingle: function () {

        var self = this;        
        var container = self.getContainerRender();
        container.addClass("bz-command-not-edit");
    }

});