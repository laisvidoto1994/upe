/*
*   Name: BizAgi Render Association Class
*   Author: Edward Morales
*   Comments:
*   -   This script will define basic stuff for association renders
*/

bizagi.rendering.render.extend("bizagi.rendering.association", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;

        // Call base
        self._super(data);

        var properties = self.properties;

        // Fill default properties
        properties.property = "flipped";
        properties.idRender = self.properties.id;
        properties.allowFlip = (typeof properties.allowFlip != "undefined") ? bizagi.util.parseBoolean(properties.allowFlip) : true;
        properties.flipped = (typeof properties.flipped != "undefined") ? bizagi.util.parseBoolean(properties.flipped) : false;
        properties.flipstate = properties.flipped;


        // data of entities (left and right)
        properties.leftData = properties.leftData || [];
        properties.rightData = properties.rightData || [];

        if (properties.value) {
            self.processPropertyValue();
        }
    },



    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("association");
        var def = new $.Deferred();

        self.properties.property = "flipped";
        self.properties.idRender = self.properties.id;

        // Define flipped
        $.when(self.getFlipAssociation())
            .done(function (flip) {

                // Make json base, create self.properties.formatJson
                self.makeJsonBase();

                self.properties.flipped = bizagi.util.parseBoolean(flip) || false;

                var html = $.fasttmpl(template, self.properties, {
                    getColumnData: self.getColumnData,
                    getRightAssociation: self.getRightAssociation
                });

                /* by default need set self.properties.formatJson */
                self.setValue(JSON.encode(self.properties.formatJson));

                def.resolve(html);
            });

        return def.promise();
    },


    /*
    * Returns the flip state
    */
    getFlipAssociation: function () {
        var self = this,
            mode = self.getMode();

        if (mode == "execution") {
            return self.dataService.getFlipAssociation(self.properties);
        }

        return false;
    },

    /* 
    *   Gets the display value of the render
    */
    getDisplayValue: function () {
        var self = this;
        var value = self.getValue();

        return value;
    },

    /*
    *   Get the template 
    */
    getTemplateName: function () {
        return "association";
    },


    /**
    * Get Left Data, verify if flipper flags sets true
    * 
    * @param column {'0'||'1'}
    */
    getColumnData: function () {
        var self = this;
        var properties = self.data;
        var data = [];

        if (properties.flipped) {
            $.each(properties.rightData, function (key, item) {
                data.push({
                    id: item.id,
                    value: item.value
                });
            });
        } else {
            $.each(properties.leftData, function (key, item) {
                data.push({
                    id: item.id,
                    value: item.value
                });
            });
        }

        return data;
    },

    /**
    * Association of right elements
    */
    getRightAssociation: function (leftId) {
        var self = this;
        var properties = self.data;
        var association = [];


        var isChecked = function (leftId, idRight) {
            var checked = false;
            $.each(properties.formatJson.value, function (key, value) {
                if (!checked && value.id == leftId && value.value.indexOf(idRight) >= 0) {
                    checked = true;
                }
            });

            return checked;
        };

        // create association and check element
        if (properties.flipped) {
            // left element
            $.each(properties.leftData, function (key, data) {
                association.push({
                    id: data.id,
                    name: data.value,
                    checked: isChecked(data.id, leftId)
                });

            });
        } else {
            $.each(properties.rightData, function (key, data) {
                association.push({
                    id: data.id,
                    name: data.value,
                    checked: isChecked(leftId, data.id)
                });
            });
        }

        return association;
    },


    removeElement: function (leftId, rightId) {
        var self = this;

        $.each(self.properties.formatJson.value, function (key, data) {
            if (self.properties.flipped) {
                if (data.id == rightId) {
                    // Remove right element from left panel
                    $.each(self.properties.formatJson.value[key]["value"], function (removeKey, removeValue) {
                        if (leftId == removeValue) {
                            // Splice from array
                            self.properties.formatJson.value[key]["value"].splice(removeKey, 1);
                        }
                    });
                }
            } else if (data.id == leftId) {
                // Remove right element from left panel
                $.each(self.properties.formatJson.value[key]["value"], function (removeKey, removeValue) {
                    if (rightId == removeValue) {
                        // Splice from array
                        self.properties.formatJson.value[key]["value"].splice(removeKey, 1);
                    }
                });
            }
        });
        self.setValue(JSON.encode(self.properties.formatJson));
    },


    addElement: function (leftId, rightId) {
        var self = this;

        $.each(self.properties.formatJson.value, function (key, data) {
            if (self.properties.flipped) {
                if (data.id == rightId) {
                    // Add right element to left panel
                    self.properties.formatJson.value[key]["value"].push(leftId);
                }
            } else if (data.id == leftId) {
                // Add right element to left panel
                self.properties.formatJson.value[key]["value"].push(rightId);
            }
        });
        self.setValue(JSON.encode(self.properties.formatJson));
    },

    makeJsonBase: function () {
        var self = this;
        self.properties.formatJson = self.properties.formatJson || {
            leftXpath: self.properties.leftXpath,
            rightXpath: self.properties.rightXpath,
            leftFactName: self.properties.leftFactName,
            rightFactName: self.properties.rightFactName,
            value: self.properties.value
        };
    },


    /*
    *   Check if a render has no value for required validation
    */
    hasValue: function () {
        var self = this;

        if (self.properties.formatJson) {
            var values = self.properties.formatJson.value;
        } else {            
            values = self.properties.value;
        }
       

        for (var i = 0, l = values.length; i < l; i++) {
            var data = values[i];
            if (data && data.value.length > 0) {
                return true;
            }
        }

        return false;
    },

    /*
    * This method process the value.
    * changes the format to send request
    */
    processPropertyValue: function () {
        var self = this;
        var properties = self.properties;
        var values = properties.value;
        var result = [];

        for (var i = 0, l = values.length; i < l; i++) {
            var value = values[i];
            result.push({ id: value[0], value: value[1] });
        }

        properties.value = result;
    }
});