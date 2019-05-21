/*
*   Name: BizAgi Desktop queryForm Extension
*   Author: Iván Ricardo Taimal Narváez
 *   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
*   -   Will apply a desktop form template
*/

// Auto extend
bizagi.rendering.form.extend("bizagi.rendering.queryForm", {
    /*
     *    Create a function to hide check all element in view when no contains check elements
     */
    postRenderContainer: function (container) {
        var self = this;
        var checkIncluded = [];
        var checkIncludedAll = self.container.find(".ui-bizagi-render-control-included-all");
        // Call base
        self._super(container);
        checkIncluded = self.container.find(".ui-bizagi-render-control-included");
        if(checkIncluded.length <= 0 ){
            checkIncludedAll.parent().hide();
        }
    },
    /*
    *    Creates a json array with key values to send to the server
    */
    collectRenderValuesForSubmit: function (request) {
        var self = this;
        var data = [];
        // Collect data in array
        self.collectRenderValuesQueryForm(data);

        // Mark data collected as original values
        $.each(data, function (i, item) {
            var renders = self.getRenders(item.xpath);
            $.each(renders, function (i, render) {
                render.updateOriginalValue();
            });
        });
        request.parameters = data;
        return request;
    },

    getSearchParams: function (request) {
        var self = this;
        self.validationController = new bizagi.command.controllers.validation(self, self.validations);
        var valid = self.validationController.performValidations();
        if (valid) {
            return self.collectRenderValuesForSubmit(request);
        } else {
            self.validationController.expandNotificationBox();
            return null;
        }
    },
    /*
    *  configure Handlers for check  all column included in the response
    */
    configureHandlers: function () {
        var self = this;
        self._super();
        var checkIncludedAll = self.container.find(".ui-bizagi-render-control-included-all");
        checkIncludedAll.tooltip({ position: { my: "right-20 center", at: "right center" }, tooltipClass: 'bz-wp-queryForm-check-all'});
        checkIncludedAll.change(function () {
            var newValue = checkIncludedAll.is(":checked");

            var checkedChildren = function (target) {
                $.each(target.children, function (i, item) {
                    if (item.element) {
                        if(item.properties.visible===true && item.properties.includedInResult===true){
                            item.properties.included = newValue;
                            var checkIncluded = item.element.find(".ui-bizagi-render-control-included");
                            checkIncluded.prop("checked", newValue);
                        }
                    }
                    else if (item.children) {
                        checkedChildren(item);
                    }
                });
            };

            checkedChildren(self);
        });
    }
});
