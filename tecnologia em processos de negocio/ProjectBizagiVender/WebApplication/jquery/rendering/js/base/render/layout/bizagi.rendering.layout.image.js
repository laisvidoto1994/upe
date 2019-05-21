/*
*   Name: BizAgi render layout Image Class
*   Author: Andrés Fernando Muñoz
*   Comments:
*   -   This script will define basic stuff for non editable image control inside templates
*/

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutImage", { }, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this,
            mode = self.getMode(),
            useDefaultImage = false,
            valueObj = self.properties.value || {},
            uri= "";

        //
        var templateUri = self.renderFactory.getTemplate("layout-image");

        //Solucion temporal mientras se ajusta la respuesta del servicio cambiar despues de demo de 21/07/2015
        /*if (value.value && value.value !== "" && value.value.length > 100){
            var template64 = self.renderFactory.getTemplate("layout-image64");
            return $.fasttmpl(template64, { url: value.value, useDefaultImage: useDefaultImage });
        }*/

        if (mode === 'execution' && valueObj.value && valueObj.value.length > 0) {
            uri = self.getImageUri();
        }
        else{
            useDefaultImage = true;
        }

        return $.fasttmpl(templateUri, { url: uri, useDefaultImage: useDefaultImage });
    },

    /**
     * Gets the base 64 image, specify in each device in order to change the size
     */
    getImage64: function () {
        var self = this;
        //Gets the real value of the image
        var params = {
            xpath: self.properties.xpath,
            entity: self.value.guid,
            surrogateKey: self.value.surrogateKey,
            width: 96,
            height: 96
        };

        return self.dataService.getEntityImage64(params);
    },

    /**
     * Gets the url to get the array image, specify in each device in order to change the size
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