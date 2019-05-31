/**
 * Base definition of a range control
 *
 * @author: Andr�s Fernando Mu�oz
 */
bizagi.rendering.render.extend("bizagi.rendering.range", {}, {
    /*
     * Constructor
     */
    init: function(params) {
        // Call base
        this._super(params);
    },

    /*
     * Initialize the control with data provided
     */
    initializeData: function(data) {
        var self = this;
        // Call base
        this._super(data);
    },


    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function() {
        var self = this,
            properties = self.properties;
        var template;
        var html = "";
        // Render template
        template = self.renderFactory.getTemplate("render-range");
        html = $.fasttmpl(template, {});
        return html;
    },
    /**
     * Sets the range controls in DOM
     * @param minControl: min range control
     * @param maxControl: max range control
     */
    setRanageControls: function (minControl, maxControl){
        var self = this;
        self.minControl = minControl || null;
        self.maxControl = maxControl || null;
        var control = self.getControl();

        var $maxCanvas = $(".bz-range-maximum", control);
        var $minCanvas = $(".bz-range-minimum", control);

        //var $maxCanvas = $('<div>hola</div>');
        //var $minCanvas = $('<div>hola</div>');

        self.renderRangeControl($minCanvas, minControl);
        self.renderRangeControl($maxCanvas, maxControl);
    },

    /*
     *   Returns the internal value
     */
    getValue: function () {
        var self = this;
        var minValue = self.minControl.getValue();
        var maxValue = self.maxControl.getValue();

        var value = {
            min: minValue,
            max: maxValue
        };
        return value;
    },

    renderRangeControl: function ($canvas, control){
        $.when(control.render("render")).done(function (html) {
            $canvas.empty().append(html);
            control.postRenderElement($canvas);
        });
    }
});
