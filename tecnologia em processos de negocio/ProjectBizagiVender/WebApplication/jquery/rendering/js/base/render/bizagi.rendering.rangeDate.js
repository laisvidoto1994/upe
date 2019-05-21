/**
 * Base definition of a range date control
 *
 * @author: Andr�s Fernando Mu�oz
 */
bizagi.rendering.range.extend("bizagi.rendering.rangeDate", {}, {

    /**
     * Defines de min date an de max date to the range control
     */
    defineRangeControl: function (params) {
        var self = this;

        var dateMin = bizagi.rendering.date.extend({
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

        var dateMax = bizagi.rendering.date.extend({
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


        var minControl = new dateMin(self.getRenderProperties("min"));
        var maxControl = new dateMax(self.getRenderProperties("max"));

        minControl.suscribe(maxControl);
        maxControl.suscribe(minControl);


        self.setRanageControls(minControl, maxControl);
    },

    getRenderProperties: function (typeRangeControl) {
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

        if (typeRangeControl === "min") {
            renderProperties.data.properties.displayName = "From";
        } else {
            renderProperties.data.properties.displayName = "To";
        }

        return renderProperties;
    }
});
