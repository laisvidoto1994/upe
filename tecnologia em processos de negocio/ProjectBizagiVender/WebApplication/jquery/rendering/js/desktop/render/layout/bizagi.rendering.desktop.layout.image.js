/*
*   Name: BizAgi render layout image
*   Author: Andrés Fernando Muñoz
*   Comments:
*   -   This script will redefine the non editable image render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.layoutImage.extend("bizagi.rendering.layoutImage", {}, {

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