/*
 *   Name: BizAgi Render Layout Image Class
 *   Author: Ricardo Pérez
 *   Comments:
 *   -   This script will define basic stuff for non editable image control inside templates
 *   -   This control is based on the image no flash render control
 */

bizagi.rendering.layoutImage.extend("bizagi.rendering.layoutImage", {
}, {
    /**
     * Gets the url to get the array image
     */
    getImageUri: function () {
        var self = this;

        var map = {
            entity: self.value.guid,
            surrogateKey: self.value.surrogateKey,
            xpath: self.properties.xpath,
            width: 96,
            height: 96,
            hash: self.value.value
        };

        return self.dataService.serviceLocator.getUrl("render-entity-layout-imageByteArray").replaceMultiple(map);
    }
});