/*
*   Name: BizAgi Desktop Letter Column Decorator Extension
*   Author: Alexander Mejia
*   Comments:
*   -   This script will redefine the letter column decorator class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.columns.letter.extend("bizagi.rendering.columns.letter", {}, {

    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();

        //Call base
        self._super(decorated);

        // Hacks some methods to add features
        decorated.getContextXpath = self.getContextXpath;
        decorated.getXpath = self.getXpath;
        decorated.getControl = self.getControl;
        decorated.setDisplayValue = self.setDisplayValue;

        decorated.postRenderReadOnly = function (element) {
            var html = decorated.renderReadOnly.apply(decorated);
            var control = $(".ui-bizagi-cell", element);
            control.append(html);
        };
    },

    /*
    *   Returns the current context xpath  
    */
    getContextXpath: function () {
        var self = this;
        var mode = self.getMode();
        var properties = self.properties;

        if (mode === "execution") {

            return (properties.xpathContext && properties.xpathContext.length > 0) ?
                properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]" :
                self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
        }

        return "";

    },

    /*
    *   Returns the current xpath  
    */
    getXpath: function () {
        var self = this;
        var properties = self.properties;

        var xpathPath = properties.xpath;
        var index = xpathPath.indexOf(self.grid.properties.xpath);
        if (index != -1) { xpathPath = xpathPath.substr(index + self.grid.properties.xpath.length + 1); }

        return xpathPath;
    },

    /* 
    * Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {

        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var mode = self.getMode();

        this.setSurrogateKey(surrogateKey);
        if (mode == "execution") {

            var decorated = this.getDecorated(surrogateKey);
            var control = decorated.getControl();

            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                // Show message:  Please save record before to generate a letter
                control.html(bizagi.localization.getResource('render-grid-column-letter-mandatory-key'));
            }
        }
    },

    /*
    *   Template method to get the control element
    *   This will execute under the decorated element context
    */
    getControl: function () {
        var self = this;
        var properties = self.properties;

        if (properties.editable) { return $(".ui-bizagi-render-control", self.element); }

        return $(".ui-bizagi-cell", self.element);
    },

    /*
    * Override function
    */
    setDisplayValue: function (value) {
        var self = this;
        // Set internal value
        self.setValue(value, false);
    }



});
