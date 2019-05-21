/**
 * Base definition of a range number control
 *
 * @author: Andr�s Fernando Mu�oz
 */
bizagi.rendering.range.extend("bizagi.rendering.rangeNumber", {}, {

    /**
    * Defines de min number an de max number to the range control
    */
    defineRangeControl: function () {
        var self = this;

        var numberMin = bizagi.rendering.number.extend({
            suscribe: function (control) {
                this.observer = this.observer || [];
                this.observer.push(control);
            },

            notify: function (value) {
                for (var i = this.observer.length - 1 ; i >= 0; i--) {
                    this.observer[i].changeMinValue(value);
                }
            },

            setValue: function (value) {
                value = value || "";
                this._super(value);
                this.notify(value);
            }
        });

        var numberMax = bizagi.rendering.number.extend({
            suscribe: function (control) {
                this.observer = this.observer || [];
                this.observer.push(control);
            },

            notify: function (value) {
                for (var i = this.observer.length - 1; i >= 0; i--) {
                    this.observer[i].changeMaxValue(value);
                }
            },

            setValue: function (value) {
                value = value || "";
                this._super(value);
                this.notify(value);
            }
        });

        var minControl = new numberMin(self.getRenderProperties("min"));
        var maxControl = new numberMax(self.getRenderProperties("max"));

        minControl.suscribe(maxControl);
        maxControl.suscribe(minControl);

        self.setRanageControls(minControl, maxControl);
    },


    getRenderProperties: function (typeRangeControl){
        var self = this;
        var form = self.getFormContainer();
        var properties = self.properties;

        var renderProperties = {
            data: {
                properties: {
                    "id": properties.id,
                    "xpath": properties.xpath + "_" + typeRangeControl,
                    "displayType": "value"
                }
            },
            mode: "execute",
            parent: form,
            renderFactory: self.renderFactory,
            resources: bizagi.localization,
            dataService: self.dataService
        };

        return renderProperties;
    }
});
