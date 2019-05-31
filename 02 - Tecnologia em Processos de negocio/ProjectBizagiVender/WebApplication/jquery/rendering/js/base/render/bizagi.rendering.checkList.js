/*
 *   Name: BizAgi Render Radio Class
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -   This script will define basic stuff for radio renders
 */

bizagi.rendering.render.extend("bizagi.rendering.checkList", {}, {

    /*
     *   Update or init the element data
     */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.horizontal = bizagi.util.parseBoolean(properties.horizontal) || false;
        self.setValue(properties.items);
        self.updateOriginalValue();
    },

    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        self._super();
        self.checkListGroup = $(".ui-bizagi-render-checkList .ui-bizagi-render-checkList-item", control);
    },

    /*
     *   Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;

        return self.renderCheckList();
    },

    /*
     *   Renders the combo
     */
    renderCheckList: function (params) {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate(self.getTemplateName());
        var items = self.properties.items || [];

        var html = $.fasttmpl(template, $.extend(self.getTemplateParams(), {
            id: properties.id,
            xpath: properties.xpath,
            unique: bizagi.util.randomNumber(10000, 1000000),
            idPageCache: properties.idPageCache,
            items: items
        }));
        return html;
    },

    /*
     *   Gets the template used by the combo render
     *   can be overriden in subclasses to reuse logic and just change the template
     */
    getTemplateName: function () {
        return "checkList";
    },

    /*
     *   Determines if we need to show the empty node or not
     *   Can be overriden to change behaviour
     */
    showEmpty: function () {
        return false;
    },

    /*
     *   Determines if we need to show the current data regardless if it belongs to data or not
     *   Can be overriden to change behaviour
     */
    showCurrentData: function () {
        return false;
    },


    /*
     *   Adds custom parameters to process the template
     */
    getTemplateParams: function () {
        var self = this;
        var properties = self.properties;

        return {
            vertical: !properties.horizontal
        };
    },
    /*
     * Cleans current data
     */
    cleanData: function () {

    },

    setValue: function (value) {
        var self = this;
        self.value = bizagi.clone(value);
    },
    getValue: function (data) {
        var self = this;
        return self.value || [];
    }

});

