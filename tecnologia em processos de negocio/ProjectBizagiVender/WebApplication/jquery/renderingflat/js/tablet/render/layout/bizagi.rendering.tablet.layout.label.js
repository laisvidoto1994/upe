/*
*   Name: BizAgi Render Layout Label Class
*   Author: Ricardo Pérez
*   Comments:
*   -   This script will define basic stuff for labels inside templates
*/

bizagi.rendering.layoutLabel.extend("bizagi.rendering.layoutLabel", {}, {
    setValue: function(val,triggerEvents) {
        var self = this;
        self.properties.displayName = val;
        this._super(val, triggerEvents);
        var control = self.getControl();
        if(control) {
            $(".ui-bizagi-render-label", control).text(val);
        }
    }
});
