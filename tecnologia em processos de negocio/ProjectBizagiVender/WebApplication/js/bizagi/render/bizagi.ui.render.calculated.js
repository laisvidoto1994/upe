/*
* jQuery BizAgi Render Calculated Field Widget 0.1
*
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.calculatedRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Draws internal value
            self.internalValue = $('<input type="hidden" value="" />')
                .attr("id", "calculatedField" + properties.id)
                .appendTo(self.control);

            // Creates control
            self.result = $('<label class="ui-bizagi-render-calculated"/>')
                .appendTo(control);

            // Creates an action on the fly
            var action = { conditions: [], logicalOperator: 1, commands: [{ xpath: "calculatedField" + properties.id, command: 12}], dependencies: properties.dependencies };
            var form = self.getFormContainer();
            form.formContainer("processAction", action);
        },

        /* Executes the internal formula*/
        runFormula: function () {
            var self = this,
            properties = self.options.properties;

            var formula = properties.formula;
            var tokens = properties.dependencies;
            var form = self.getFormContainer();

            for (var i = 0; i < tokens.length; i++) {
                var renders = form.formContainer("getRenders", tokens[i]);
                if (renders && renders.length > 0) {
                    formula = formula.replaceAll("<" + tokens[i] + ">", renders[0].baseRender("getValue"));
                }
            }

            try {
                self.result.html(eval(formula));
            } catch (e) {
                self.result.html('<font color="red">Error in the formula</font>');
            }
        }
    });

})(jQuery);